---
sidebar_position: 14
sidebar_label: "14. Fortran / C / C++ 入门"
---

# 第 14 章：Fortran / C / C++ 入门

## 本章目标

- 理解为什么物理科研中仍然需要编译型语言
- 了解编译器的基本概念和工作流程
- 能够编写、编译、运行 C / C++ / Fortran 的 Hello World
- 掌握三种语言的基本语法差异
- 完成一个最小的数值计算例子
- 了解编译型语言与 Python 的互操作

## 动机

虽然 Python 是科研的首选语言，但在高性能计算领域，Fortran、C、C++ 仍然不可替代。许多经典物理代码（如 VASP、LAMMPS、Quantum ESPRESSO）都是用这些语言写的。即使你主要用 Python，也会在某些时候需要阅读、修改或编译这些代码。

---

## 14.1 为什么物理人还会遇到这些语言

| 场景 | 说明 |
|------|------|
| 运行经典物理代码 | VASP (Fortran), LAMMPS (C++), Gaussian (Fortran) |
| 性能瓶颈优化 | Python 慢 100 倍时，核心循环改用 C/Fortran |
| HPC 集群 | 超算上的 MPI 并行代码几乎全是 C/Fortran |
| 阅读导师/合作者代码 | 老一辈物理学家偏好 Fortran |
| 调用数值库 | LAPACK、FFTW、BLAS 都是 C/Fortran 写的 |

:::info
你不需要精通这些语言，但需要能**读懂基本结构、编译运行、做简单修改**。这就是本章的目标。
:::

---

## 14.2 编译器是什么

```text
源代码 (.c / .cpp / .f90)
        ↓  编译器 (gcc / g++ / gfortran)
目标文件 (.o)
        ↓  链接器 (linker)
可执行文件 (a.out / program.exe)
```

**解释型语言 vs 编译型语言**：

| 特性 | Python（解释型） | C/Fortran（编译型） |
|------|-------------------|---------------------|
| 执行方式 | 逐行解释 | 一次编译，直接执行机器码 |
| 运行速度 | 慢 | 快（10-100 倍） |
| 开发速度 | 快 | 慢（需要编译步骤） |
| 类型检查 | 运行时 | 编译时 |
| 调试难度 | 较低 | 较高（段错误、内存泄漏） |

### 安装编译器

**macOS**：
```bash
xcode-select --install       # 安装 Apple Clang (C/C++)
brew install gcc              # 安装 GCC (含 gfortran)
```

**Ubuntu / Debian**：
```bash
sudo apt install build-essential gfortran
```

**Windows**：Windows 本身没有系统级的 GNU 工具链。要在 Windows 原生环境里用 gcc/gfortran，需要借助 **MSYS2**——它在 Windows 上提供一套 GNU/MinGW 开发环境，编译出的程序是 Windows 原生可执行文件，不依赖额外运行时。

在管理员 PowerShell 里执行：

```powershell
# 1. 用 winget 安装 MSYS2
winget install -e --id MSYS2.MSYS2

# 2. 更新 MSYS2（连跑两次：第一次大更新后需要再刷新一次包状态）
C:\msys64\usr\bin\bash.exe -lc "pacman -Syu --noconfirm"
C:\msys64\usr\bin\bash.exe -lc "pacman -Syu --noconfirm"

# 3. 安装 UCRT64 环境下的 GCC / gfortran / make
C:\msys64\usr\bin\bash.exe -lc "pacman -S --needed --noconfirm \
  mingw-w64-ucrt-x86_64-gcc \
  mingw-w64-ucrt-x86_64-gcc-fortran \
  mingw-w64-ucrt-x86_64-pkgconf \
  make"
```

把 `C:\msys64\ucrt64\bin` 加入用户 PATH，之后在普通 PowerShell 里就能直接调用 gcc/gfortran：

```powershell
[Environment]::SetEnvironmentVariable(
  "Path",
  "C:\msys64\ucrt64\bin;" + [Environment]::GetEnvironmentVariable("Path","User"),
  "User"
)
```

重开 PowerShell 后用 `where.exe gcc` 和 `gcc --version` 验证。

:::tip 更省心的方案：WSL
MSYS2 能让 gcc/gfortran 在 Windows 原生跑起来，但等你往上叠 MPI、PETSc、SLEPc 等库时，不同 shell、工具链、路径之间的摩擦会迅速积累。对于科研计算，**强烈建议直接用 WSL**：

```bash
# 在 WSL (Ubuntu) 中一条命令搞定
sudo apt install build-essential gfortran
```

WSL 把这些复杂度收敛到统一的 Linux 环境里，也跟超算/服务器环境一致。WSL 安装方式见第 3 章。
:::

验证安装：
```bash
gcc --version
g++ --version
gfortran --version
```

---

## 14.3 Hello World 与基本编译

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
三种语言的编译流程完全一致：`编译器 源文件 -o 可执行文件`。`-o` 指定输出文件名，不加则默认为 `a.out`。
:::

---

## 14.4 基本语法差异

| 特性 | C | C++ | Fortran 90+ |
|------|---|-----|-------------|
| 注释 | `/* */` 或 `//` | `//` | `!` |
| 变量声明 | `int x = 5;` | `int x = 5;` | `integer :: x = 5` |
| 浮点数 | `double x = 3.14;` | `double x = 3.14;` | `real(8) :: x = 3.14d0` |
| 数组 | `double a[100];` | `std::vector<double>` | `real(8) :: a(100)` |
| 数组索引 | 从 0 开始 | 从 0 开始 | 从 1 开始 |
| 打印 | `printf(...)` | `std::cout << ...` | `print *, ...` 或 `write(*, *)` |
| 函数 | `double f(double x)` | `double f(double x)` | `function f(x) result(res)` |
| 入口 | `int main()` | `int main()` | `program name` |
| 文件扩展 | `.c` | `.cpp` | `.f90` |
| 行尾 | `;` | `;` | 无需 |
| 大小写 | 敏感 | 敏感 | 不敏感 |

:::caution
Fortran 数组从 **1** 开始，C/C++ 从 **0** 开始。这是最常见的 bug 来源之一，尤其在混合编程时。
:::

---

## 14.5 数组、循环、函数

### C 示例

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

### Fortran 示例

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

## 14.6 与 Python 的关系

Python 的科学计算库底层几乎全是 C/Fortran：

```text
Python 层:   import numpy as np; np.dot(A, B)
              ↓
NumPy 层:    C 代码调度
              ↓
BLAS 层:     Fortran (LAPACK/BLAS) 或 C (OpenBLAS/MKL)
```

### 从 Python 调用 C（ctypes）

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

### 从 Python 调用 Fortran（f2py）

```bash
# 编译 Fortran 为 Python 模块
f2py -c -m myfortran myfortran.f90

# 在 Python 中使用
import myfortran
c = myfortran.add_arrays(a, b, len(a))
```

---

## 14.7 科研中常见用途

| 语言 | 典型用途 | 代表性软件 |
|------|----------|-----------|
| **Fortran** | 数值模拟、气象/气候模型、第一性原理计算 | VASP, Quantum ESPRESSO, WRF |
| **C** | 系统级工具、MD 模拟引擎、底层库 | FFTW, GSL, HDF5 |
| **C++** | 大型框架、粒子物理、现代 MD 代码 | ROOT, Geant4, LAMMPS, deal.II |

---

## 14.8 GDB 调试器

GDB（GNU Debugger）是 C/C++/Fortran 程序最常用的调试工具。当你的程序出现段错误（segmentation fault）、结果不对、或行为异常时，GDB 可以让你暂停程序、查看变量、逐步执行代码。

### 基本用法

```bash
# 编译时必须加 -g 选项，生成调试信息
gcc -g program.c -o program -lm
gfortran -g program.f90 -o program

# 用 GDB 启动程序
gdb ./program
```

在 GDB 中，常用命令：

| 命令 | 功能 |
|------|------|
| `run` (r) | 运行程序 |
| `break main` (b main) | 在 `main` 函数设置断点 |
| `break 42` (b 42) | 在第 42 行设置断点 |
| `next` (n) | 执行下一行（不进入函数） |
| `step` (s) | 执行下一行（进入函数内部） |
| `continue` (c) | 继续运行到下一个断点 |
| `print x` (p x) | 打印变量 `x` 的值 |
| `print A[0:5]` | 打印数组前 5 个元素 |
| `backtrace` (bt) | 查看调用栈（段错误时最有用） |
| `info locals` | 显示当前函数的所有局部变量 |
| `watch x` | 当变量 `x` 被修改时自动暂停 |
| `quit` (q) | 退出 GDB |

### 典型调试流程

```bash
$ gcc -g buggy.c -o buggy -lm
$ gdb ./buggy
(gdb) run
# 程序崩溃：Program received signal SIGSEGV, Segmentation fault.
(gdb) backtrace
# 显示崩溃位置：#0  0x... in compute_energy (data=0x0, n=100) at buggy.c:15
# 可以看到 data 是空指针 (0x0)
(gdb) frame 0
(gdb) print data
$1 = (double *) 0x0       ← 空指针，找到 bug 了
(gdb) quit
```

### 调试段错误的快速方法

```bash
# 如果程序已经崩溃了，可以用 core dump 调试
ulimit -c unlimited        # 允许生成 core dump
./buggy                    # 运行并崩溃
gdb ./buggy core           # 用 GDB 分析 core dump
(gdb) backtrace            # 直接看到崩溃位置
```

### 在 VS Code 中使用 GDB

VS Code 的 C/C++ 扩展内置了 GDB 前端，可以像调试 Python 一样设置断点、查看变量：

1. 安装 **C/C++** 扩展（Microsoft）
2. 编译时加 `-g` 选项
3. 点击行号左侧设置断点
4. 按 `F5` 开始调试

:::tip
对于简单的 bug，`printf` 调试（在代码中插入打印语句）往往最快。但对于段错误和复杂的逻辑错误，GDB 的 `backtrace` 几乎是唯一的高效手段。
:::

---

## 14.9 最小数值例子

### 数值积分：梯形法则

用 C 和 Python 分别实现 $\int_0^\pi \sin(x)\,dx = 2$。

**C 版本**：

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

**Python 对比**：同样的算法在 Python 中只需 `np.trapz(np.sin(x), x)` 一行。但当 $N$ 达到上亿次迭代时，C 的速度优势就体现出来了。

---

## 常见问题

**Q: "undefined reference" 错误是什么意思？**
A: 链接器找不到函数定义。常见原因：忘了链接数学库（`-lm`），或漏编译了某个源文件。

**Q: "segmentation fault" 怎么调试？**
A: 段错误通常是数组越界或空指针。用 `gcc -g` 编译后用 `gdb` 调试：
```bash
gcc -g program.c -o program
gdb ./program
```

**Q: 应该学 C 还是 C++？**
A: 如果只是为了读懂和修改物理代码，学 C 的基础语法即可。C++ 的面向对象、模板等特性在大型项目中很有用，但学习曲线陡峭。

**Q: Fortran 77 和 Fortran 90 有什么区别？**
A: Fortran 90+ 是现代 Fortran，支持自由格式、模块、动态数组。如果你看到固定格式（每行从第 7 列开始写）的代码，那就是 Fortran 77。新代码应始终使用 `.f90` 格式。

---

## 小结

- 编译型语言在性能敏感的科学计算中仍然不可替代
- `gcc` / `g++` / `gfortran` 是最常用的开源编译器
- 三种语言的基本结构相似：变量声明、循环、函数、数组
- Python 的科学计算库底层就是 C/Fortran，可通过 ctypes、f2py 直接调用
- 能读懂、能编译运行、能做简单修改——这是物理科研者的最低要求

---

## 练习

1. **Hello World**：在你的系统上编译运行 C、C++、Fortran 的 Hello World
2. **数组操作**：用 C 写一个函数计算数组的平均值和标准差，与 NumPy 结果对比
3. **数值积分**：实现 Simpson 法则（C 或 Fortran），与梯形法则比较收敛速度
4. **混合编程**：用 ctypes 从 Python 调用你的 C 数值积分函数
5. **阅读真实代码**：找一个你领域常用的 Fortran/C 程序的源代码，尝试理解其 `main` 函数的结构
