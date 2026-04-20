---
sidebar_position: 14
sidebar_label: "14. Compiled Languages"
---

# Chapter 14: Getting Started with Fortran / C / C++

## Chapter Goals

- Understand why compiled languages are still needed in physics research
- Learn the basic concepts and workflow of compilers
- Be able to write, compile, and run Hello World in C / C++ / Fortran
- Grasp the basic syntax differences among the three languages
- Complete a minimal numerical computation example
- Understand interoperability between compiled languages and Python

## Motivation

Although Python is the preferred language for research, in the field of high-performance computing, Fortran, C, and C++ remain irreplaceable. Many classic physics codes (such as VASP, LAMMPS, Quantum ESPRESSO) are written in these languages. Even if you mainly use Python, you will at some point need to read, modify, or compile such code.

---

## 14.1 Why Physicists Still Encounter These Languages

| Scenario | Description |
|----------|-------------|
| Running classic physics codes | VASP (Fortran), LAMMPS (C++), Gaussian (Fortran) |
| Optimizing performance bottlenecks | When Python is 100x slower, rewrite core loops in C/Fortran |
| HPC clusters | Parallel MPI code on supercomputers is almost always C/Fortran |
| Reading advisor/collaborator code | Older-generation physicists prefer Fortran |
| Calling numerical libraries | LAPACK, FFTW, BLAS are all written in C/Fortran |

:::info
You don't need to master these languages, but you need to be able to **read basic structures, compile and run, and make simple modifications**. That is the goal of this chapter.
:::

---

## 14.2 What Is a Compiler

```text
Source code (.c / .cpp / .f90)
        ↓  Compiler (gcc / g++ / gfortran)
Object file (.o)
        ↓  Linker
Executable (a.out / program.exe)
```

**Interpreted vs Compiled Languages**:

| Feature | Python (Interpreted) | C/Fortran (Compiled) |
|---------|---------------------|----------------------|
| Execution method | Line-by-line interpretation | Compile once, run machine code directly |
| Runtime speed | Slow | Fast (10-100x) |
| Development speed | Fast | Slow (requires compilation step) |
| Type checking | At runtime | At compile time |
| Debugging difficulty | Lower | Higher (segfaults, memory leaks) |

### Installing Compilers

**macOS**:
```bash
xcode-select --install       # Install Apple Clang (C/C++)
brew install gcc              # Install GCC (includes gfortran)
```

**Ubuntu / Debian**:
```bash
sudo apt install build-essential gfortran
```

**Windows**: Windows has no system-level GNU toolchain. To use gcc/gfortran in native Windows, you need **MSYS2** — it provides a GNU/MinGW development environment on Windows whose compiled programs are native Windows executables with no extra runtime dependency.

In an administrator PowerShell:

```powershell
# 1. Install MSYS2 via winget
winget install -e --id MSYS2.MSYS2

# 2. Update MSYS2 (run twice: the first big update needs a second refresh)
C:\msys64\usr\bin\bash.exe -lc "pacman -Syu --noconfirm"
C:\msys64\usr\bin\bash.exe -lc "pacman -Syu --noconfirm"

# 3. Install GCC / gfortran / make in the UCRT64 environment
C:\msys64\usr\bin\bash.exe -lc "pacman -S --needed --noconfirm \
  mingw-w64-ucrt-x86_64-gcc \
  mingw-w64-ucrt-x86_64-gcc-fortran \
  mingw-w64-ucrt-x86_64-pkgconf \
  make"
```

Add `C:\msys64\ucrt64\bin` to your user PATH so you can call gcc/gfortran directly from plain PowerShell:

```powershell
[Environment]::SetEnvironmentVariable(
  "Path",
  "C:\msys64\ucrt64\bin;" + [Environment]::GetEnvironmentVariable("Path","User"),
  "User"
)
```

Reopen PowerShell, then verify with `where.exe gcc` and `gcc --version`.

:::tip The easier path: WSL
MSYS2 can make gcc/gfortran run natively on Windows, but once you stack MPI, PETSc, SLEPc, etc. on top, friction between different shells, toolchains, and paths accumulates fast. For research computing, **WSL is strongly recommended**:

```bash
# One command in WSL (Ubuntu):
sudo apt install build-essential gfortran
```

WSL collapses this complexity into a single unified Linux environment that also matches what runs on HPC clusters. See Chapter 3 for WSL installation.
:::

Verify installation:
```bash
gcc --version
g++ --version
gfortran --version
```

---

## 14.3 Hello World and Basic Compilation

### C

```c
/* hello.c */
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

```bash
gcc hello.c -o hello
./hello
```

### C++

```cpp
// hello.cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

```bash
g++ hello.cpp -o hello
./hello
```

### Fortran

```fortran
! hello.f90
program hello
    implicit none
    print *, "Hello, World!"
end program hello
```

```bash
gfortran hello.f90 -o hello
./hello
```

:::tip
The compilation workflow is identical for all three languages: `compiler source_file -o executable`. `-o` specifies the output filename; without it, the default is `a.out`.
:::

---

## 14.4 Basic Syntax Differences

| Feature | C | C++ | Fortran 90+ |
|---------|---|-----|-------------|
| Comments | `/* */` or `//` | `//` | `!` |
| Variable declaration | `int x = 5;` | `int x = 5;` | `integer :: x = 5` |
| Floating point | `double x = 3.14;` | `double x = 3.14;` | `real(8) :: x = 3.14d0` |
| Arrays | `double a[100];` | `std::vector<double>` | `real(8) :: a(100)` |
| Array indexing | Starts from 0 | Starts from 0 | Starts from 1 |
| Print | `printf(...)` | `std::cout << ...` | `print *, ...` or `write(*, *)` |
| Functions | `double f(double x)` | `double f(double x)` | `function f(x) result(res)` |
| Entry point | `int main()` | `int main()` | `program name` |
| File extension | `.c` | `.cpp` | `.f90` |
| Line terminator | `;` | `;` | Not required |
| Case sensitivity | Sensitive | Sensitive | Insensitive |

:::caution
Fortran arrays start from **1**, while C/C++ start from **0**. This is one of the most common sources of bugs, especially in mixed-language programming.
:::

---

## 14.5 Arrays, Loops, and Functions

### C Example

```c
/* arrays_loops.c */
#include <stdio.h>
#include <math.h>

double compute_norm(double *vec, int n) {
    double sum = 0.0;
    for (int i = 0; i < n; i++) {
        sum += vec[i] * vec[i];
    }
    return sqrt(sum);
}

int main() {
    int n = 5;
    double a[] = {1.0, 2.0, 3.0, 4.0, 5.0};

    printf("Norm = %f\n", compute_norm(a, n));
    return 0;
}
```

```bash
gcc arrays_loops.c -o arrays_loops -lm
./arrays_loops
```

### Fortran Example

```fortran
! arrays_loops.f90
program arrays_loops
    implicit none
    integer, parameter :: n = 5
    real(8) :: a(n) = [1.0d0, 2.0d0, 3.0d0, 4.0d0, 5.0d0]

    print *, "Norm =", compute_norm(a, n)

contains

    function compute_norm(vec, m) result(res)
        integer, intent(in) :: m
        real(8), intent(in) :: vec(m)
        real(8) :: res
        integer :: i
        res = 0.0d0
        do i = 1, m
            res = res + vec(i)**2
        end do
        res = sqrt(res)
    end function compute_norm

end program arrays_loops
```

```bash
gfortran arrays_loops.f90 -o arrays_loops
./arrays_loops
```

---

## 14.6 Relationship with Python

The scientific computing libraries in Python are almost entirely built on C/Fortran under the hood:

```text
Python layer:   import numpy as np; np.dot(A, B)
                  ↓
NumPy layer:    C code dispatch
                  ↓
BLAS layer:     Fortran (LAPACK/BLAS) or C (OpenBLAS/MKL)
```

### Calling C from Python (ctypes)

```c
/* mylib.c */
double square(double x) {
    return x * x;
}
```

```bash
gcc -shared -o mylib.so mylib.c    # Linux/macOS
gcc -shared -o mylib.dll mylib.c   # Windows
```

```python
import ctypes

lib = ctypes.CDLL('./mylib.so')
lib.square.argtypes = [ctypes.c_double]
lib.square.restype = ctypes.c_double

result = lib.square(3.0)
print(result)  # 9.0
```

### Calling Fortran from Python (f2py)

```bash
# Compile Fortran into a Python module
f2py -c -m myfortran myfortran.f90

# Use in Python
import myfortran
c = myfortran.add_arrays(a, b, len(a))
```

---

## 14.7 Common Use Cases in Research

| Language | Typical Use Cases | Representative Software |
|----------|-------------------|------------------------|
| **Fortran** | Numerical simulations, weather/climate models, first-principles calculations | VASP, Quantum ESPRESSO, WRF |
| **C** | System-level tools, MD simulation engines, low-level libraries | FFTW, GSL, HDF5 |
| **C++** | Large frameworks, particle physics, modern MD codes | ROOT, Geant4, LAMMPS, deal.II |

---

## 14.8 The GDB Debugger

GDB (GNU Debugger) is the most commonly used debugging tool for C/C++/Fortran programs. When your program has segmentation faults, incorrect results, or unexpected behavior, GDB lets you pause the program, inspect variables, and step through code.

### Basic Usage

```bash
# Must compile with -g flag to include debug information
gcc -g program.c -o program -lm
gfortran -g program.f90 -o program

# Start the program with GDB
gdb ./program
```

Common commands in GDB:

| Command | Function |
|---------|----------|
| `run` (r) | Run the program |
| `break main` (b main) | Set breakpoint at `main` function |
| `break 42` (b 42) | Set breakpoint at line 42 |
| `next` (n) | Execute next line (don't enter functions) |
| `step` (s) | Execute next line (enter function body) |
| `continue` (c) | Continue to next breakpoint |
| `print x` (p x) | Print the value of variable `x` |
| `print A[0:5]` | Print first 5 elements of array |
| `backtrace` (bt) | Show call stack (most useful for segfaults) |
| `info locals` | Show all local variables in current function |
| `watch x` | Pause automatically when variable `x` is modified |
| `quit` (q) | Exit GDB |

### Typical Debugging Workflow

```bash
$ gcc -g buggy.c -o buggy -lm
$ gdb ./buggy
(gdb) run
# Program crashes: Program received signal SIGSEGV, Segmentation fault.
(gdb) backtrace
# Shows crash location: #0  0x... in compute_energy (data=0x0, n=100) at buggy.c:15
# data is a null pointer (0x0)
(gdb) frame 0
(gdb) print data
$1 = (double *) 0x0       ← null pointer, bug found
(gdb) quit
```

### Quick Method for Debugging Segfaults

```bash
# If the program has already crashed, use core dump for debugging
ulimit -c unlimited        # Allow core dump generation
./buggy                    # Run and crash
gdb ./buggy core           # Analyze core dump with GDB
(gdb) backtrace            # See crash location directly
```

### Using GDB in VS Code

The VS Code C/C++ extension has a built-in GDB frontend, letting you set breakpoints and inspect variables just like debugging Python:

1. Install the **C/C++** extension (Microsoft)
2. Compile with the `-g` flag
3. Click to the left of line numbers to set breakpoints
4. Press `F5` to start debugging

:::tip
For simple bugs, `printf` debugging (inserting print statements) is often fastest. But for segfaults and complex logic errors, GDB's `backtrace` is almost the only efficient approach.
:::

---

## 14.9 Minimal Numerical Example

### Numerical Integration: Trapezoidal Rule

Implement $\int_0^\pi \sin(x)\,dx = 2$ in both C and Python.

**C version**:

```c
/* trapezoidal.c */
#include <stdio.h>
#include <math.h>

double trapezoidal(double a, double b, int n) {
    double h = (b - a) / n;
    double sum = 0.5 * (sin(a) + sin(b));

    for (int i = 1; i < n; i++) {
        sum += sin(a + i * h);
    }
    return sum * h;
}

int main() {
    int n_values[] = {10, 100, 1000, 10000};
    double exact = 2.0;

    printf("%-10s %-20s %-15s\n", "N", "Result", "Error");
    printf("-------------------------------------------\n");

    for (int j = 0; j < 4; j++) {
        int n = n_values[j];
        double result = trapezoidal(0.0, M_PI, n);
        printf("%-10d %-20.15f %-15.2e\n", n, result, fabs(result - exact));
    }
    return 0;
}
```

```bash
gcc trapezoidal.c -o trapezoidal -lm
./trapezoidal
```

**Python comparison**: The same algorithm in Python requires just one line: `np.trapz(np.sin(x), x)`. However, when $N$ reaches hundreds of millions of iterations, the speed advantage of C becomes apparent.

---

## FAQ

**Q: What does "undefined reference" error mean?**
A: The linker cannot find the function definition. Common causes: forgot to link the math library (`-lm`), or forgot to compile a source file.

**Q: How do I debug "segmentation fault"?**
A: Segfaults are usually caused by array out-of-bounds access or null pointers. Compile with `gcc -g` and debug with `gdb`:
```bash
gcc -g program.c -o program
gdb ./program
```

**Q: Should I learn C or C++?**
A: If you just want to read and modify physics code, learning basic C syntax is sufficient. C++ features like object-oriented programming and templates are useful in large projects but have a steep learning curve.

**Q: What is the difference between Fortran 77 and Fortran 90?**
A: Fortran 90+ is modern Fortran, supporting free-form source, modules, and dynamic arrays. If you see fixed-format code (where lines start from column 7), that is Fortran 77. New code should always use the `.f90` format.

---

## Summary

- Compiled languages remain irreplaceable in performance-sensitive scientific computing
- `gcc` / `g++` / `gfortran` are the most commonly used open-source compilers
- The basic structure of all three languages is similar: variable declarations, loops, functions, arrays
- Python's scientific computing libraries are built on C/Fortran under the hood, and can be called directly via ctypes and f2py
- Being able to read, compile, run, and make simple modifications — this is the minimum requirement for physics researchers

---

## Exercises

1. **Hello World**: Compile and run Hello World in C, C++, and Fortran on your system
2. **Array operations**: Write a C function to compute the mean and standard deviation of an array, and compare results with NumPy
3. **Numerical integration**: Implement Simpson's rule (in C or Fortran) and compare convergence speed with the trapezoidal rule
4. **Mixed programming**: Use ctypes to call your C numerical integration function from Python
5. **Reading real code**: Find the source code of a Fortran/C program commonly used in your field and try to understand the structure of its `main` function
