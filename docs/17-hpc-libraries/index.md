---
sidebar_position: 17
sidebar_label: "17. 高性能数值库"
---

# 第 17 章：高性能数值库

> 不要自己写矩阵乘法——前人已经把它优化到了极致。

## 本章目标

读完本章后，你应该能：

- 理解 BLAS / LAPACK 的定位和层级关系
- 在你的平台上安装 OpenBLAS
- 知道 Intel oneMKL、PETSc、cuBLAS 等库各自解决什么问题
- 判断自己当前需要安装哪些库
- 运行一个简单的 BLAS 测试程序

## 动机

计算物理的核心操作大多可以归结为**线性代数**：矩阵乘法、特征值求解、线性方程组求解。这些操作有经过数十年优化的标准库，性能远超你自己手写的版本。

一个经过优化的 BLAS 库做矩阵乘法，可以比朴素的三重循环快 **10-100 倍**。了解这些库的关系和用法，是高效计算的基础。

:::caution 不要一次全装
本章介绍的库很多，但你**不需要全部安装**。先读完全章，根据 17.9 节的指南判断自己需要什么，再动手安装。
:::

## 17.1 BLAS / LAPACK 是什么

### BLAS (Basic Linear Algebra Subprograms)

BLAS 是一套**标准化的线性代数基本操作接口**，分三个级别：

| 级别 | 操作类型 | 示例 | 计算复杂度 |
|------|----------|------|-----------|
| Level 1 | 向量-向量 | 向量点积、向量加法 | O(n) |
| Level 2 | 矩阵-向量 | 矩阵-向量乘法 | O(n²) |
| Level 3 | 矩阵-矩阵 | 矩阵-矩阵乘法 | O(n³) |

BLAS 定义的是**接口标准**，不是某个具体的库。不同的实现（OpenBLAS、MKL、cuBLAS）都遵循同样的函数签名。

### LAPACK (Linear Algebra PACKage)

LAPACK 建立在 BLAS 之上，提供更高级的线性代数功能：

- 线性方程组求解（`dgesv`）
- 特征值问题（`dsyev`）
- 奇异值分解（`dgesvd`）
- 最小二乘问题（`dgels`）

### 层级关系

```
应用程序 / 科学计算代码
        ↓
┌─────────────────────────────────────┐
│  高级库: PETSc, SLEPc, ScaLAPACK   │  ← 大规模/分布式
├─────────────────────────────────────┤
│  LAPACK                             │  ← 稠密线性代数
├─────────────────────────────────────┤
│  BLAS                               │  ← 基本向量/矩阵操作
├─────────────────────────────────────┤
│  硬件优化层                          │  ← CPU SIMD, GPU CUDA
└─────────────────────────────────────┘
```

:::info 为什么不自己写？
BLAS 的高性能实现利用了 CPU 的 SIMD 指令、缓存优化、流水线调度等底层技术。`dgemm`（双精度矩阵乘法）的优化是计算机科学的经典课题，专家们已经花了几十年打磨。你自己写的版本几乎不可能达到同样的性能。
:::

## 17.2 OpenBLAS

OpenBLAS 是最常用的开源 BLAS/LAPACK 实现，支持多种 CPU 架构，性能接近商业库。

### 安装

```bash
# Ubuntu / WSL
sudo apt install libopenblas-dev

# macOS
brew install openblas

# 验证安装
dpkg -l | grep openblas     # Ubuntu
brew info openblas           # macOS
```

### 简单测试

下面的程序调用 BLAS 的 `ddot` 函数计算两个向量的点积：

```c
// test_blas.c
#include <stdio.h>

// BLAS 函数声明（Fortran 风格，名称末尾加下划线）
extern double ddot_(int *n, double *x, int *incx, double *y, int *incy);

int main() {
    int n = 4;
    double x[] = {1.0, 2.0, 3.0, 4.0};
    double y[] = {5.0, 6.0, 7.0, 8.0};
    int inc = 1;

    double result = ddot_(&n, x, &inc, y, &inc);
    printf("Dot product = %.1f\n", result);
    // 期望结果: 1*5 + 2*6 + 3*7 + 4*8 = 70.0
    return 0;
}
```

编译与运行：

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

macOS 自带 **Accelerate framework**，内含 Apple 优化的 BLAS 和 LAPACK 实现，针对 Apple Silicon 深度优化。

```bash
# 使用 Accelerate framework 编译（无需额外安装）
gcc test_blas.c -framework Accelerate -o test_blas
./test_blas
```

:::tip macOS 用户
如果你在 macOS 上做开发，Accelerate 通常是最佳选择——不需要额外安装，性能已经很好。只有在特殊需求下才需要安装 OpenBLAS。
:::

## 17.4 Intel oneAPI / oneMKL

Intel oneAPI 是 Intel 提供的高性能计算工具套件。在科研计算中，我们通常需要安装以下几个组件：

### 主要组件

| 组件 | 包名 | 用途 |
|------|------|------|
| **oneAPI Base Toolkit** | `intel-oneapi-base-toolkit` | 基础工具包（含 oneMKL） |
| **oneMKL** | `intel-oneapi-mkl-devel` | BLAS、LAPACK、FFT、稀疏矩阵 |
| **Intel C/C++/Fortran 编译器** | `intel-oneapi-compiler-dpcpp-cpp`, `intel-oneapi-compiler-fortran` | 高度优化的编译器（`icx`, `ifx`） |
| **oneAPI HPC Toolkit** | `intel-oneapi-hpc-toolkit` | 包含编译器 + MPI + 性能分析工具 |
| **oneMPI** | `intel-oneapi-mpi-devel` | Intel 的 MPI 实现 |

### 安装

```bash
# 1. 添加 APT 仓库
wget -O- https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB \
    | gpg --dearmor | sudo tee /usr/share/keyrings/oneapi-archive-keyring.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/oneapi-archive-keyring.gpg] \
    https://apt.repos.intel.com/oneapi all main" \
    | sudo tee /etc/apt/sources.list.d/oneAPI.list
sudo apt update

# 2. 只装 MKL（最小安装）
sudo apt install intel-oneapi-mkl-devel

# 3. 装 MKL + Intel 编译器（推荐）
sudo apt install intel-oneapi-mkl-devel \
    intel-oneapi-compiler-dpcpp-cpp \
    intel-oneapi-compiler-fortran

# 4. 装完整 HPC 套件（含编译器 + MPI + 性能工具）
sudo apt install intel-oneapi-hpc-toolkit
```

### 环境变量

每次使用前需要 source 环境变量：

```bash
# 加载所有 oneAPI 组件
source /opt/intel/oneapi/setvars.sh

# 或者只加载特定组件
source /opt/intel/oneapi/mkl/latest/env/vars.sh
source /opt/intel/oneapi/compiler/latest/env/vars.sh
source /opt/intel/oneapi/mpi/latest/env/vars.sh
```

建议在 `~/.bashrc` 中添加：

```bash
# Intel oneAPI
if [ -f /opt/intel/oneapi/setvars.sh ]; then
    source /opt/intel/oneapi/setvars.sh > /dev/null 2>&1
fi
```

### 使用 Intel 编译器

```bash
# Intel C/C++ 编译器
icx hello.c -o hello           # C
icpx hello.cpp -o hello        # C++

# Intel Fortran 编译器
ifx hello.f90 -o hello

# 链接 MKL
icx test_blas.c -qmkl -o test_blas
gcc test_blas.c -lmkl_rt -o test_blas   # 用 GCC 也可以链接 MKL
```

:::info 需要 MKL 吗？
如果你用的是 Intel CPU 且对性能有极致要求，MKL 值得安装。否则 OpenBLAS 对于大多数场景已经足够好。AMD CPU 用户也可以用 MKL，但性能优势不如在 Intel CPU 上明显。
:::

## 17.5 PETSc

PETSc（Portable, Extensible Toolkit for Scientific Computation）是一个用于**大规模科学计算**的并行框架。它在超级计算机和 HPC 集群上被广泛使用，能够扩展到数千甚至数十万个核心。

### 为什么 PETSc 在大型集群上很重要

- **分布式并行**：基于 MPI，数据和计算自动分布到多个节点
- **稀疏矩阵**：高效存储和操作大规模稀疏矩阵（百万×百万规模）
- **丰富的求解器**：内置 Krylov 迭代求解器，可选外部直接求解器（MUMPS、SuperLU_DIST）
- **可扩展性**：从笔记本到超算，同一套代码无需修改
- **生态完善**：大量物理/工程领域的代码基于 PETSc 构建

### 安装

```bash
# 下载
git clone https://gitlab.com/petsc/petsc.git
cd petsc
```

PETSc 的核心是 `./configure`，通过不同选项链接不同的后端库。以下是几种常见的配置方式：

#### 基本配置（自动下载依赖）

```bash
./configure --with-cc=gcc --with-cxx=g++ --with-fc=gfortran \
    --download-mpich --download-fblaslapack \
    --with-debugging=0 \
    COPTFLAGS="-O3" CXXOPTFLAGS="-O3" FOPTFLAGS="-O3"
```

#### 链接本地 OpenBLAS + 系统 MPI

```bash
./configure --with-cc=mpicc --with-cxx=mpicxx --with-fc=mpif90 \
    --with-blaslapack-lib="-lopenblas" \
    --with-debugging=0 \
    COPTFLAGS="-O3" CXXOPTFLAGS="-O3" FOPTFLAGS="-O3"
```

#### 链接 Intel MKL + Intel MPI

```bash
# 先 source oneAPI 环境
source /opt/intel/oneapi/setvars.sh

./configure --with-cc=mpicc --with-cxx=mpicxx --with-fc=mpif90 \
    --with-blaslapack-dir=$MKLROOT \
    --with-mpi-dir=$I_MPI_ROOT \
    --with-debugging=0 \
    COPTFLAGS="-O3" CXXOPTFLAGS="-O3" FOPTFLAGS="-O3"
```

#### 链接 CUDA（GPU 加速）

```bash
./configure --with-cc=gcc --with-cxx=g++ --with-fc=gfortran \
    --download-mpich --download-fblaslapack \
    --with-cuda=1 --with-cuda-dir=/usr/local/cuda \
    --with-debugging=0 \
    COPTFLAGS="-O3" CXXOPTFLAGS="-O3" FOPTFLAGS="-O3"
```

#### 下载额外的直接求解器

```bash
./configure --with-cc=mpicc --with-cxx=mpicxx --with-fc=mpif90 \
    --with-blaslapack-lib="-lopenblas" \
    --download-mumps --download-scalapack --download-parmetis --download-metis \
    --download-superlu_dist \
    --with-debugging=0 \
    COPTFLAGS="-O3" CXXOPTFLAGS="-O3" FOPTFLAGS="-O3"
```

### 编译

```bash
# configure 完成后会提示 make 命令
make all
make check   # 运行测试验证安装
```

### 设置环境变量

```bash
# 添加到 ~/.bashrc
export PETSC_DIR=/path/to/petsc
export PETSC_ARCH=arch-linux-c-opt   # configure 时生成的架构名
```

`PETSC_ARCH` 的值在 `./configure` 输出的末尾会显示，也可以查看 `$PETSC_DIR` 下的目录名。

### 常用 configure 选项一览

| 选项 | 说明 |
|------|------|
| `--with-cc=mpicc` | 指定 C 编译器 |
| `--with-blaslapack-dir=$MKLROOT` | 链接 MKL |
| `--with-blaslapack-lib="-lopenblas"` | 链接 OpenBLAS |
| `--download-mpich` | 自动下载安装 MPICH |
| `--with-mpi-dir=/path/to/mpi` | 使用本地已安装的 MPI |
| `--with-cuda=1` | 启用 CUDA 支持 |
| `--download-mumps` | 下载 MUMPS 直接求解器 |
| `--with-debugging=0` | 关闭调试模式（生产环境） |
| `--with-debugging=1` | 开启调试模式（开发调试） |
| `COPTFLAGS="-O3"` | C 编译优化级别 |

## 17.6 SLEPc

SLEPc（Scalable Library for Eigenvalue Problem Computations）基于 PETSc，专门解决**大规模特征值问题**。在 HPC 集群上求解百万维稀疏矩阵的特征值时，SLEPc 是最常用的工具之一。

### 典型应用

- 量子力学中的大规模哈密顿量对角化
- 凝聚态物理中的能带结构计算
- 振动分析中的模态求解
- 流体力学中的稳定性分析

### 安装

SLEPc 依赖 PETSc，必须先安装好 PETSc。

```bash
# 下载
git clone https://gitlab.com/slepc/slepc.git
cd slepc

# 设置环境变量
export PETSC_DIR=/path/to/petsc
export PETSC_ARCH=arch-linux-c-opt
export SLEPC_DIR=$(pwd)

# 配置（可下载额外的特征值求解器）
./configure
# 或下载 ARPACK（经典特征值求解器）
./configure --download-arpack

# 编译
make all
make check
```

### 环境变量

```bash
# 添加到 ~/.bashrc
export SLEPC_DIR=/path/to/slepc
```

### 简单示例

SLEPc 求解稀疏矩阵的最小几个特征值：

```c
// 伪代码示意
Mat A;                          // PETSc 稀疏矩阵
EPS eps;                        // SLEPc 特征值求解器
EPSCreate(PETSC_COMM_WORLD, &eps);
EPSSetOperators(eps, A, NULL);
EPSSetFromOptions(eps);         // 从命令行读取选项
EPSSolve(eps);                  // 求解
EPSGetEigenvalue(eps, 0, &kr, &ki);  // 获取第一个特征值
```

运行时通过命令行控制求解器参数：

```bash
mpirun -np 16 ./my_solver -eps_nev 10 -eps_type krylovschur
#                          求10个特征值    使用 Krylov-Schur 方法
```

## 17.7 cuBLAS / cuSOLVER

如果你有 NVIDIA GPU，可以使用 CUDA 生态的数值库：

| 库 | 功能 |
|----|------|
| cuBLAS | GPU 加速的 BLAS |
| cuSOLVER | GPU 加速的 LAPACK（部分） |
| cuSPARSE | GPU 加速的稀疏矩阵 |
| cuFFT | GPU 加速的 FFT |

### 安装

这些库随 CUDA Toolkit 一起安装：

```bash
# Ubuntu
sudo apt install nvidia-cuda-toolkit

# 验证
nvcc --version
```

:::tip GPU 计算的适用场景
GPU 擅长**大规模并行**的计算（数千个核心同时工作），但数据传输（CPU ↔ GPU）有开销。适合大矩阵运算、深度学习、大规模蒙特卡洛模拟。不适合小规模或逻辑复杂的计算。
:::

## 17.8 这些库之间的关系

```
┌────────────────────────────────────────────────┐
│                你的科研代码                      │
├────────────┬──────────┬──────────┬─────────────┤
│  Python    │    C     │ Fortran  │   Julia     │
│  NumPy     │  直接调用 │ 直接调用  │  内置       │
├────────────┴──────────┴──────────┴─────────────┤
│                                                │
│  ┌─────────┐  ┌────────┐  ┌──────────────┐    │
│  │ PETSc   │  │ SLEPc  │  │ ScaLAPACK    │    │
│  │(大规模)  │  │(特征值) │  │(分布式LA)     │    │
│  └────┬────┘  └───┬────┘  └──────┬───────┘    │
│       └───────────┴──────────────┘             │
│                    ↓                            │
│  ┌──────────────────────────────────────┐      │
│  │           LAPACK                      │      │
│  │   (线性方程组、特征值、SVD)             │      │
│  └──────────────────┬───────────────────┘      │
│                     ↓                           │
│  ┌──────────────────────────────────────┐      │
│  │            BLAS 接口                   │      │
│  ├──────────┬───────────┬───────────────┤      │
│  │OpenBLAS  │ Intel MKL │ Apple          │      │
│  │(通用)    │(Intel CPU)│ Accelerate     │      │
│  └──────────┴───────────┴───────────────┘      │
│                                                │
│  GPU 侧: cuBLAS / cuSOLVER (NVIDIA)            │
└────────────────────────────────────────────────┘
```

核心要点：

- **BLAS** 是最底层的构建块，所有上层库都依赖它
- **LAPACK** 在 BLAS 之上提供更复杂的线性代数操作
- **PETSc / SLEPc** 是面向特定问题域的高级框架
- 不同的 BLAS 实现可以互相替换，上层代码不需要修改

## 17.9 谁需要安装，谁可以先跳过

| 你的情况 | 需要安装 | 可以先跳过 |
|----------|----------|-----------|
| 刚开始学计算物理 | OpenBLAS | MKL, PETSc, CUDA |
| 主要用 Python + NumPy | 通常不需要手动装（pip 自带） | 全部 |
| 写 C/Fortran 数值代码 | OpenBLAS 或 MKL | PETSc, CUDA |
| 大规模稀疏矩阵求解 | PETSc + OpenBLAS/MKL | CUDA（除非用 GPU） |
| 做大规模特征值问题 | SLEPc + PETSc | CUDA |
| 用 macOS | Accelerate（已自带） | OpenBLAS, MKL |
| 有 NVIDIA GPU 且需要加速 | CUDA + cuBLAS | PETSc |

:::tip 实用建议
**大多数研究生只需要 OpenBLAS**（或 macOS 上的 Accelerate）。等到你的课题确实需要更高级的库时，再按需安装。提前装一堆用不到的库只会浪费时间和硬盘空间。
:::

## 17.10 测试与基准的基本思路

安装好数值库后，应该做简单的验证：

### 正确性测试

```c
// test_lapack.c - 用 LAPACK 解线性方程组 Ax = b
#include <stdio.h>

extern void dgesv_(int *n, int *nrhs, double *a, int *lda,
                   int *ipiv, double *b, int *ldb, int *info);

int main() {
    int n = 2, nrhs = 1, lda = 2, ldb = 2, info;
    int ipiv[2];

    // A = [1 2; 3 4], b = [5; 6]
    // 注意: LAPACK 使用列优先存储
    double A[] = {1.0, 3.0, 2.0, 4.0};
    double b[] = {5.0, 6.0};

    dgesv_(&n, &nrhs, A, &lda, ipiv, b, &ldb, &info);

    if (info == 0) {
        printf("Solution: x = [%.1f, %.1f]\n", b[0], b[1]);
        // 期望结果: x = [-4.0, 4.5]
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

### 性能基准

```bash
# 简单的矩阵乘法性能测试：看 OpenBLAS 用了几个线程
export OPENBLAS_NUM_THREADS=4

# Python 中测试
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

## 常见问题

**Q: NumPy 用的是哪个 BLAS？**

A: 可以用 `python3 -c "import numpy; numpy.show_config()"` 查看。通过 pip 安装的 NumPy 通常自带 OpenBLAS。通过 conda 安装的可能用 MKL。

**Q: OpenBLAS 和 MKL 性能差多少？**

A: 在 Intel CPU 上，MKL 通常快 10-30%。在 AMD CPU 上差距更小。对于大多数科研任务，这个差异不是瓶颈。

**Q: 我需要学 CUDA 吗？**

A: 如果你的课题不涉及 GPU 计算或深度学习，不需要。等需要时再学不迟。

## 小结

- BLAS 和 LAPACK 是科学计算的基石，几乎所有数值库都建立在它们之上
- **OpenBLAS** 是最常用的开源实现，大多数情况下够用
- macOS 用户可以直接使用自带的 **Accelerate** framework
- **不要一次全装**——根据实际需求选择
- Python 用户通过 NumPy 已经在间接使用这些库
- 高级库（PETSc、SLEPc、CUDA）按需再学

## 练习

1. 在你的系统上安装 OpenBLAS（或确认已有 Accelerate），编译运行 `test_blas.c`
2. 运行 `python3 -c "import numpy; numpy.show_config()"` 查看你的 NumPy 使用的 BLAS 后端
3. 编译运行 `test_lapack.c`，解一个 3x3 的线性方程组
4. 用 Python 测试不同大小的矩阵乘法性能（500x500, 1000x1000, 2000x2000），观察时间增长趋势

[上一章：OpenMP 与 MPI →](../16-openmp-mpi/index.md) | [下一章：Julia 与包管理 →](../18-julia/index.md)
