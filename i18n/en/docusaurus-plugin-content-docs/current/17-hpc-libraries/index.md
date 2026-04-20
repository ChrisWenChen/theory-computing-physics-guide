---
sidebar_position: 17
sidebar_label: "17. HPC Libraries"
---

# Chapter 17: High-Performance Numerical Libraries

> Don't write your own matrix multiplication — others have already optimized it to the extreme.

## Chapter Goals

After reading this chapter, you should be able to:

- Understand the role and hierarchy of BLAS / LAPACK
- Install OpenBLAS on your platform
- Know what problems Intel oneMKL, PETSc, cuBLAS, and other libraries solve
- Determine which libraries you currently need to install
- Run a simple BLAS test program

## Motivation

The core operations in computational physics can mostly be reduced to **linear algebra**: matrix multiplication, eigenvalue solving, and linear system solving. There are standard libraries for these operations that have been optimized over decades, with performance far exceeding anything you could write by hand.

An optimized BLAS library can perform matrix multiplication **10-100x faster** than a naive triple loop. Understanding the relationships and usage of these libraries is fundamental to efficient computing.

:::caution Don't Install Everything at Once
This chapter introduces many libraries, but you **don't need to install them all**. Read the entire chapter first, use the guide in Section 17.9 to determine what you need, and then install.
:::

## 17.1 What Are BLAS / LAPACK

### BLAS (Basic Linear Algebra Subprograms)

BLAS is a **standardized interface for basic linear algebra operations**, divided into three levels:

| Level | Operation Type | Example | Computational Complexity |
|-------|---------------|---------|--------------------------|
| Level 1 | Vector-vector | Dot product, vector addition | O(n) |
| Level 2 | Matrix-vector | Matrix-vector multiplication | O(n^2) |
| Level 3 | Matrix-matrix | Matrix-matrix multiplication | O(n^3) |

BLAS defines an **interface standard**, not a specific library. Different implementations (OpenBLAS, MKL, cuBLAS) all follow the same function signatures.

### LAPACK (Linear Algebra PACKage)

LAPACK is built on top of BLAS and provides higher-level linear algebra functionality:

- Linear system solving (`dgesv`)
- Eigenvalue problems (`dsyev`)
- Singular value decomposition (`dgesvd`)
- Least squares problems (`dgels`)

### Hierarchy

```
Application / Scientific Computing Code
        ↓
┌─────────────────────────────────────┐
│  High-level: PETSc, SLEPc, ScaLAPACK   │  ← Large-scale/distributed
├─────────────────────────────────────┤
│  LAPACK                             │  ← Dense linear algebra
├─────────────────────────────────────┤
│  BLAS                               │  ← Basic vector/matrix operations
├─────────────────────────────────────┤
│  Hardware optimization layer         │  ← CPU SIMD, GPU CUDA
└─────────────────────────────────────┘
```

:::info Why Not Write Your Own?
High-performance BLAS implementations leverage CPU SIMD instructions, cache optimization, pipeline scheduling, and other low-level techniques. Optimizing `dgemm` (double-precision matrix multiplication) is a classic topic in computer science that experts have spent decades refining. Your hand-written version will almost certainly not match the same performance.
:::

## 17.2 OpenBLAS

OpenBLAS is the most commonly used open-source BLAS/LAPACK implementation, supporting multiple CPU architectures with performance close to commercial libraries.

### Installation

```bash
# Ubuntu / WSL
sudo apt install libopenblas-dev

# macOS
brew install openblas

# Verify installation
dpkg -l | grep openblas     # Ubuntu
brew info openblas           # macOS
```

**Windows (MSYS2 UCRT64)**: assuming MSYS2 is already installed per Chapter 14:

```powershell
C:\msys64\usr\bin\bash.exe -lc "pacman -S --needed --noconfirm mingw-w64-ucrt-x86_64-openblas"

# Verify (with C:\msys64\ucrt64\bin on PATH)
pkg-config --libs openblas
```

You can then compile with `gcc test_blas.c $(pkg-config --libs openblas) -o test_blas`.

### Simple Test

The following program calls BLAS's `ddot` function to compute the dot product of two vectors:

```c
// test_blas.c
#include <stdio.h>

// BLAS function declaration (Fortran-style, trailing underscore)
extern double ddot_(int *n, double *x, int *incx, double *y, int *incy);

int main() {
    int n = 4;
    double x[] = {1.0, 2.0, 3.0, 4.0};
    double y[] = {5.0, 6.0, 7.0, 8.0};
    int inc = 1;

    double result = ddot_(&n, x, &inc, y, &inc);
    printf("Dot product = %.1f\n", result);
    // Expected result: 1*5 + 2*6 + 3*7 + 4*8 = 70.0
    return 0;
}
```

Compile and run:

```bash
# Ubuntu
gcc test_blas.c -lopenblas -o test_blas
./test_blas

# macOS (Homebrew OpenBLAS)
gcc test_blas.c -I/opt/homebrew/opt/openblas/include \
    -L/opt/homebrew/opt/openblas/lib -lopenblas -o test_blas
./test_blas
```

## 17.3 macOS Accelerate

macOS comes with the **Accelerate framework**, which includes Apple-optimized BLAS and LAPACK implementations, deeply optimized for Apple Silicon.

```bash
# Compile using Accelerate framework (no extra installation needed)
gcc test_blas.c -framework Accelerate -o test_blas
./test_blas
```

:::tip macOS Users
If you are developing on macOS, Accelerate is usually the best choice — no extra installation needed, and performance is already very good. Only install OpenBLAS if you have specific requirements.
:::

## 17.4 Intel oneAPI / oneMKL

Intel oneAPI is Intel's high-performance computing toolkit. For scientific computing, we typically need to install several components beyond just the base toolkit:

### Main Components

| Component | Package Name | Purpose |
|-----------|-------------|---------|
| **oneAPI Base Toolkit** | `intel-oneapi-base-toolkit` | Base toolkit (includes oneMKL) |
| **oneMKL** | `intel-oneapi-mkl-devel` | BLAS, LAPACK, FFT, sparse matrices |
| **Intel C/C++/Fortran Compilers** | `intel-oneapi-compiler-dpcpp-cpp`, `intel-oneapi-compiler-fortran` | Highly optimized compilers (`icx`, `ifx`) |
| **oneAPI HPC Toolkit** | `intel-oneapi-hpc-toolkit` | Compilers + MPI + performance analysis tools |
| **oneMPI** | `intel-oneapi-mpi-devel` | Intel's MPI implementation |

### Installation

```bash
# 1. Add APT repository
wget -O- https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB \
    | gpg --dearmor | sudo tee /usr/share/keyrings/oneapi-archive-keyring.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/oneapi-archive-keyring.gpg] \
    https://apt.repos.intel.com/oneapi all main" \
    | sudo tee /etc/apt/sources.list.d/oneAPI.list
sudo apt update

# 2. Install MKL only (minimal)
sudo apt install intel-oneapi-mkl-devel

# 3. Install MKL + Intel compilers (recommended)
sudo apt install intel-oneapi-mkl-devel \
    intel-oneapi-compiler-dpcpp-cpp \
    intel-oneapi-compiler-fortran

# 4. Install complete HPC toolkit (compilers + MPI + perf tools)
sudo apt install intel-oneapi-hpc-toolkit
```

### Environment Variables

Source the environment variables before each use:

```bash
# Load all oneAPI components
source /opt/intel/oneapi/setvars.sh

# Or load specific components only
source /opt/intel/oneapi/mkl/latest/env/vars.sh
source /opt/intel/oneapi/compiler/latest/env/vars.sh
source /opt/intel/oneapi/mpi/latest/env/vars.sh
```

Recommended addition to `~/.bashrc`:

```bash
# Intel oneAPI
if [ -f /opt/intel/oneapi/setvars.sh ]; then
    source /opt/intel/oneapi/setvars.sh > /dev/null 2>&1
fi
```

### Using Intel Compilers

```bash
# Intel C/C++ compiler
icx hello.c -o hello           # C
icpx hello.cpp -o hello        # C++

# Intel Fortran compiler
ifx hello.f90 -o hello

# Link MKL
icx test_blas.c -qmkl -o test_blas
gcc test_blas.c -lmkl_rt -o test_blas   # GCC can also link MKL
```

:::info Do You Need MKL?
If you're using an Intel CPU and have extreme performance requirements, MKL is worth installing. Otherwise, OpenBLAS is good enough for most scenarios. AMD CPU users can also use MKL, but the performance advantage is less pronounced than on Intel CPUs.
:::

### Intel oneAPI on Windows

On Windows, Intel oneAPI depends on the **native Windows developer environment** — Visual Studio Build Tools, the Windows SDK, and oneAPI's own `setvars.bat`. **Do not** try to load it inside MSYS2/bash, and do not run `icx` from a plain PowerShell without setting up the environment first — you will hit missing-header errors (e.g. `stdio.h: file not found`) and link errors.

First install VS Build Tools (C++ toolchain + Windows SDK) from an administrator PowerShell:

```powershell
winget install -e --id Microsoft.VisualStudio.2022.BuildTools `
  --accept-package-agreements --accept-source-agreements `
  --override "--quiet --wait --norestart --nocache --add Microsoft.VisualStudio.Workload.VCTools --add Microsoft.VisualStudio.Component.Windows11SDK.22621"
```

Then install the Windows builds of the oneAPI Base Toolkit + HPC Toolkit from Intel's website. **In every new terminal**, you must load the two environments in the right order:

```powershell
# 1. Load the Visual Studio developer environment first
& "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\Launch-VsDevShell.ps1" -Arch amd64 -HostArch amd64

# 2. Then layer oneAPI on top (import the variables that setvars.bat exports)
cmd /c '"C:\Program Files (x86)\Intel\oneAPI\setvars.bat" intel64 >nul && set' | ForEach-Object {
    if ($_ -match '^(.*?)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}

# Verify
where.exe icx
where.exe ifx
Get-ChildItem Env:MKLROOT
```

Order matters: loading oneAPI without the VS developer shell leaves `INCLUDE` missing the MSVC / UCRT / Windows SDK include paths, and even `stdio.h` will not be found.

:::caution Do not mix the GNU and Intel toolchains
MSYS2 lives in the GNU/pkg-config world; Intel oneAPI lives in the native Windows / MSVC world. Headers, library formats, and linking conventions differ. Forcing them into one shell produces a fragile hybrid. The stable approach is two one-shot launcher scripts — start whichever terminal fits the task.
:::

:::tip When to switch to WSL
For single-machine work with just MKL + Intel compilers, the native Windows path does work. But once you need **Intel MPI, PETSc, or SLEPc**, Windows wrappers, shells, and paths will eat enormous amounts of time in pure environment friction. That kind of work is **much easier in WSL** — installing OpenMPI via `apt` and building PETSc is a standard flow, and the environment matches real HPC clusters.
:::

## 17.5 PETSc

PETSc (Portable, Extensible Toolkit for Scientific Computation) is a **large-scale scientific computing** parallel framework. It is widely used on supercomputers and HPC clusters, scaling to thousands or even hundreds of thousands of cores.

### Why PETSc Matters on Large Clusters

- **Distributed parallelism**: Based on MPI, data and computation are automatically distributed across nodes
- **Sparse matrices**: Efficient storage and operations on large-scale sparse matrices (million × million scale)
- **Rich solvers**: Built-in Krylov iterative solvers, optional external direct solvers (MUMPS, SuperLU_DIST)
- **Scalability**: Same code runs from laptops to supercomputers without modification
- **Mature ecosystem**: Many physics/engineering codes are built on PETSc

### Installation

```bash
# Download
git clone https://gitlab.com/petsc/petsc.git
cd petsc
```

PETSc's core is `./configure`, which links different backend libraries through options. Here are several common configurations:

#### Basic Configuration (auto-download dependencies)

```bash
./configure --with-cc=gcc --with-cxx=g++ --with-fc=gfortran \
    --download-mpich --download-fblaslapack \
    --with-debugging=0 \
    COPTFLAGS="-O3" CXXOPTFLAGS="-O3" FOPTFLAGS="-O3"
```

#### Link Local OpenBLAS + System MPI

```bash
./configure --with-cc=mpicc --with-cxx=mpicxx --with-fc=mpif90 \
    --with-blaslapack-lib="-lopenblas" \
    --with-debugging=0 \
    COPTFLAGS="-O3" CXXOPTFLAGS="-O3" FOPTFLAGS="-O3"
```

#### Link Intel MKL + Intel MPI

```bash
# Source oneAPI environment first
source /opt/intel/oneapi/setvars.sh

./configure --with-cc=mpicc --with-cxx=mpicxx --with-fc=mpif90 \
    --with-blaslapack-dir=$MKLROOT \
    --with-mpi-dir=$I_MPI_ROOT \
    --with-debugging=0 \
    COPTFLAGS="-O3" CXXOPTFLAGS="-O3" FOPTFLAGS="-O3"
```

#### Link CUDA (GPU acceleration)

```bash
./configure --with-cc=gcc --with-cxx=g++ --with-fc=gfortran \
    --download-mpich --download-fblaslapack \
    --with-cuda=1 --with-cuda-dir=/usr/local/cuda \
    --with-debugging=0 \
    COPTFLAGS="-O3" CXXOPTFLAGS="-O3" FOPTFLAGS="-O3"
```

#### Download Additional Direct Solvers

```bash
./configure --with-cc=mpicc --with-cxx=mpicxx --with-fc=mpif90 \
    --with-blaslapack-lib="-lopenblas" \
    --download-mumps --download-scalapack --download-parmetis --download-metis \
    --download-superlu_dist \
    --with-debugging=0 \
    COPTFLAGS="-O3" CXXOPTFLAGS="-O3" FOPTFLAGS="-O3"
```

### Building

```bash
# After configure completes, it will show the make command
make all
make check   # Run tests to verify installation
```

### Setting Environment Variables

```bash
# Add to ~/.bashrc
export PETSC_DIR=/path/to/petsc
export PETSC_ARCH=arch-linux-c-opt   # Architecture name generated during configure
```

The `PETSC_ARCH` value is shown at the end of `./configure` output, or you can check the directory names under `$PETSC_DIR`.

### Common Configure Options Reference

| Option | Description |
|--------|-------------|
| `--with-cc=mpicc` | Specify C compiler |
| `--with-blaslapack-dir=$MKLROOT` | Link MKL |
| `--with-blaslapack-lib="-lopenblas"` | Link OpenBLAS |
| `--download-mpich` | Auto-download and install MPICH |
| `--with-mpi-dir=/path/to/mpi` | Use locally installed MPI |
| `--with-cuda=1` | Enable CUDA support |
| `--download-mumps` | Download MUMPS direct solver |
| `--with-debugging=0` | Disable debug mode (production) |
| `--with-debugging=1` | Enable debug mode (development) |
| `COPTFLAGS="-O3"` | C compiler optimization level |

## 17.6 SLEPc

SLEPc (Scalable Library for Eigenvalue Problem Computations) is built on PETSc and specializes in **large-scale eigenvalue problems**. It is one of the most commonly used tools for computing eigenvalues of million-dimensional sparse matrices on HPC clusters.

### Typical Applications

- Large-scale Hamiltonian diagonalization in quantum mechanics
- Band structure calculations in condensed matter physics
- Modal analysis in vibration studies
- Stability analysis in fluid dynamics

### Installation

SLEPc depends on PETSc — PETSc must be installed first.

```bash
# Download
git clone https://gitlab.com/slepc/slepc.git
cd slepc

# Set environment variables
export PETSC_DIR=/path/to/petsc
export PETSC_ARCH=arch-linux-c-opt
export SLEPC_DIR=$(pwd)

# Configure (can download additional eigenvalue solvers)
./configure
# Or download ARPACK (classic eigenvalue solver)
./configure --download-arpack

# Build
make all
make check
```

### Environment Variables

```bash
# Add to ~/.bashrc
export SLEPC_DIR=/path/to/slepc
```

### Simple Example

SLEPc solving for the smallest eigenvalues of a sparse matrix:

```c
// Pseudocode illustration
Mat A;                          // PETSc sparse matrix
EPS eps;                        // SLEPc eigenvalue solver
EPSCreate(PETSC_COMM_WORLD, &eps);
EPSSetOperators(eps, A, NULL);
EPSSetFromOptions(eps);         // Read options from command line
EPSSolve(eps);                  // Solve
EPSGetEigenvalue(eps, 0, &kr, &ki);  // Get first eigenvalue
```

Control solver parameters via command line at runtime:

```bash
mpirun -np 16 ./my_solver -eps_nev 10 -eps_type krylovschur
#                          find 10 eigenvalues    use Krylov-Schur method
```

## 17.7 cuBLAS / cuSOLVER

If you have an NVIDIA GPU, you can use numerical libraries from the CUDA ecosystem:

| Library | Functionality |
|---------|---------------|
| cuBLAS | GPU-accelerated BLAS |
| cuSOLVER | GPU-accelerated LAPACK (partial) |
| cuSPARSE | GPU-accelerated sparse matrices |
| cuFFT | GPU-accelerated FFT |

### Installation

These libraries are installed together with the CUDA Toolkit:

```bash
# Ubuntu
sudo apt install nvidia-cuda-toolkit

# Verify
nvcc --version
```

:::tip When GPU Computing Is Appropriate
GPUs excel at **massively parallel** computation (thousands of cores working simultaneously), but data transfer (CPU ↔ GPU) has overhead. Suitable for large matrix operations, deep learning, and large-scale Monte Carlo simulations. Not suitable for small-scale or logic-heavy computations.
:::

## 17.8 How These Libraries Relate to Each Other

```
┌────────────────────────────────────────────────┐
│              Your Research Code                  │
├────────────┬──────────┬──────────┬─────────────┤
│  Python    │    C     │ Fortran  │   Julia     │
│  NumPy     │  Direct  │ Direct   │  Built-in   │
├────────────┴──────────┴──────────┴─────────────┤
│                                                │
│  ┌─────────┐  ┌────────┐  ┌──────────────┐    │
│  │ PETSc   │  │ SLEPc  │  │ ScaLAPACK    │    │
│  │(Large   │  │(Eigen) │  │(Distributed  │    │
│  │ scale)  │  │        │  │ LA)          │    │
│  └────┬────┘  └───┬────┘  └──────┬───────┘    │
│       └───────────┴──────────────┘             │
│                    ↓                            │
│  ┌──────────────────────────────────────┐      │
│  │           LAPACK                      │      │
│  │   (Linear systems, eigenvalues, SVD)  │      │
│  └──────────────────┬───────────────────┘      │
│                     ↓                           │
│  ┌──────────────────────────────────────┐      │
│  │            BLAS Interface              │      │
│  ├──────────┬───────────┬───────────────┤      │
│  │OpenBLAS  │ Intel MKL │ Apple          │      │
│  │(General) │(Intel CPU)│ Accelerate     │      │
│  └──────────┴───────────┴───────────────┘      │
│                                                │
│  GPU side: cuBLAS / cuSOLVER (NVIDIA)          │
└────────────────────────────────────────────────┘
```

Key points:

- **BLAS** is the lowest-level building block; all higher-level libraries depend on it
- **LAPACK** provides more complex linear algebra operations on top of BLAS
- **PETSc / SLEPc** are high-level frameworks for specific problem domains
- Different BLAS implementations can be swapped without modifying higher-level code

## 17.9 Who Needs to Install What, and What Can Be Skipped

| Your Situation | Need to Install | Can Skip for Now |
|----------------|-----------------|------------------|
| Just starting computational physics | OpenBLAS | MKL, PETSc, CUDA |
| Mainly using Python + NumPy | Usually no manual installation needed (pip bundles it) | Everything |
| Writing C/Fortran numerical code | OpenBLAS or MKL | PETSc, CUDA |
| Large-scale sparse matrix solving | PETSc + OpenBLAS/MKL | CUDA (unless using GPU) |
| Doing large-scale eigenvalue problems | SLEPc + PETSc | CUDA |
| Using macOS | Accelerate (already included) | OpenBLAS, MKL |
| Have an NVIDIA GPU and need acceleration | CUDA + cuBLAS | PETSc |

:::tip Practical Advice
**Most graduate students only need OpenBLAS** (or Accelerate on macOS). Wait until your research actually requires more advanced libraries, then install as needed. Installing a bunch of unused libraries ahead of time only wastes time and disk space.
:::

## 17.10 Basic Testing and Benchmarking

After installing numerical libraries, you should do simple verification:

### Correctness Test

```c
// test_lapack.c - Use LAPACK to solve linear system Ax = b
#include <stdio.h>

extern void dgesv_(int *n, int *nrhs, double *a, int *lda,
                   int *ipiv, double *b, int *ldb, int *info);

int main() {
    int n = 2, nrhs = 1, lda = 2, ldb = 2, info;
    int ipiv[2];

    // A = [1 2; 3 4], b = [5; 6]
    // Note: LAPACK uses column-major storage
    double A[] = {1.0, 3.0, 2.0, 4.0};
    double b[] = {5.0, 6.0};

    dgesv_(&n, &nrhs, A, &lda, ipiv, b, &ldb, &info);

    if (info == 0) {
        printf("Solution: x = [%.1f, %.1f]\n", b[0], b[1]);
        // Expected result: x = [-4.0, 4.5]
    } else {
        printf("Error: info = %d\n", info);
    }
    return 0;
}
```

```bash
gcc test_lapack.c -lopenblas -o test_lapack
./test_lapack
```

### Performance Benchmark

```bash
# Simple matrix multiplication performance test: see how many threads OpenBLAS uses
export OPENBLAS_NUM_THREADS=4

# Test in Python
python3 -c "
import numpy as np
import time
n = 2000
A = np.random.rand(n, n)
B = np.random.rand(n, n)
start = time.time()
C = A @ B
elapsed = time.time() - start
print(f'{n}x{n} matrix multiply: {elapsed:.3f} seconds')
"
```

## FAQ

**Q: Which BLAS does NumPy use?**

A: You can check with `python3 -c "import numpy; numpy.show_config()"`. NumPy installed via pip usually bundles OpenBLAS. NumPy installed via conda may use MKL.

**Q: How much performance difference is there between OpenBLAS and MKL?**

A: On Intel CPUs, MKL is usually 10-30% faster. On AMD CPUs, the gap is smaller. For most research tasks, this difference is not the bottleneck.

**Q: Do I need to learn CUDA?**

A: If your research doesn't involve GPU computing or deep learning, no. There's no rush — learn it when you need it.

## Summary

- BLAS and LAPACK are the cornerstones of scientific computing — nearly all numerical libraries are built on top of them
- **OpenBLAS** is the most commonly used open-source implementation, sufficient for most cases
- macOS users can directly use the built-in **Accelerate** framework
- **Don't install everything at once** — choose based on actual needs
- Python users are already indirectly using these libraries through NumPy
- Advanced libraries (PETSc, SLEPc, CUDA) can be learned as needed

## Exercises

1. Install OpenBLAS on your system (or confirm Accelerate is available), compile and run `test_blas.c`
2. Run `python3 -c "import numpy; numpy.show_config()"` to check which BLAS backend your NumPy uses
3. Compile and run `test_lapack.c` to solve a 3x3 linear system
4. Use Python to test matrix multiplication performance at different sizes (500x500, 1000x1000, 2000x2000), observe the time growth trend

[Previous chapter: OpenMP and MPI ->](../16-openmp-mpi/index.md) | [Next chapter: Julia and Package Management ->](../18-julia/index.md)
