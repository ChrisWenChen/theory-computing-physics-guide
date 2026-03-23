---
sidebar_position: 16
sidebar_label: "16. OpenMP 与 MPI"
---

# 第 16 章：OpenMP 与 MPI

> 一台电脑算不完的，就让一千台电脑一起算。

## 本章目标

读完本章后，你应该能：

- 理解并行计算的基本动机与分类（共享内存 vs 分布式内存）
- 使用 OpenMP 编写简单的多线程程序
- 使用 MPI 编写简单的多进程程序
- 编译和运行 OpenMP / MPI 程序
- 判断何时使用 OpenMP、何时使用 MPI

## 动机

假设你写了一个蒙特卡洛模拟程序，单核运行需要 100 小时。你的实验室服务器有 64 个核心——如果能把任务分给所有核心，理论上可以缩短到不到 2 小时。这就是并行计算的核心价值。

在计算物理中，并行计算不是"高级技巧"，而是**日常需求**。

## 16.1 为什么需要并行计算

现代 CPU 的单核频率已经接近物理极限（约 5 GHz），性能提升主要靠**增加核心数**。如果你的程序只用一个核心，你就浪费了绝大部分算力。

常见的并行场景：

- **蒙特卡洛模拟**：每个样本独立，天然适合并行
- **矩阵运算**：线性代数操作可以拆分到多个核心
- **参数扫描**：对不同参数值独立运行同一程序
- **大规模 PDE 求解**：将空间网格分配给不同进程

## 16.2 共享内存与分布式内存

并行计算有两种基本模型：

| 特性 | 共享内存 (Shared Memory) | 分布式内存 (Distributed Memory) |
|------|--------------------------|-------------------------------|
| 代表技术 | OpenMP | MPI |
| 内存模型 | 所有线程共享同一块内存 | 每个进程有自己独立的内存 |
| 通信方式 | 直接读写共享变量 | 通过消息传递（send/receive） |
| 典型硬件 | 单台多核机器 | 多台机器组成的集群 |
| 编程难度 | 较低 | 较高 |
| 扩展性 | 受限于单机核心数 | 可扩展到数千节点 |

```
共享内存模型 (OpenMP)          分布式内存模型 (MPI)

┌──────────────────┐       ┌────────┐   ┌────────┐
│   共享内存空间     │       │ 进程 0  │   │ 进程 1  │
│                  │       │ 内存 0  │   │ 内存 1  │
│  线程0  线程1     │       └───┬────┘   └───┬────┘
│  线程2  线程3     │           │  消息传递   │
└──────────────────┘           ←──────────→
```

:::info 混合并行
在超算上，常见的做法是**节点间用 MPI，节点内用 OpenMP**，称为 hybrid parallelism。不过对于入门阶段，先分别学好两者即可。
:::

## 16.3 OpenMP 基本概念

OpenMP（Open Multi-Processing）是一套基于**编译器指令**的共享内存并行编程接口。它的核心思想是：在串行代码中插入 `#pragma` 指令，告诉编译器哪些部分可以并行执行。

关键概念：

- **线程 (Thread)**：程序执行的最小单位，多个线程共享同一进程的内存
- **并行区域 (Parallel Region)**：用 `#pragma omp parallel` 标记的代码块，由多个线程同时执行
- **工作分配 (Work Sharing)**：用 `#pragma omp for` 将循环迭代分配给不同线程
- **同步 (Synchronization)**：用 `#pragma omp critical` 或 `#pragma omp barrier` 控制线程协调

## 16.4 MPI 基本概念

MPI（Message Passing Interface）是分布式内存并行计算的标准接口。每个进程有独立的内存空间，进程间通过**发送和接收消息**来通信。

关键概念：

- **进程 (Process)**：独立运行的程序实例，有自己的内存空间
- **通信器 (Communicator)**：一组进程的集合，默认为 `MPI_COMM_WORLD`
- **Rank**：进程在通信器中的编号（从 0 开始）
- **点对点通信**：`MPI_Send` / `MPI_Recv`
- **集合通信**：`MPI_Bcast`、`MPI_Reduce`、`MPI_Gather` 等

## 16.5 编译与运行方式

### OpenMP 编译

```bash
# GCC
gcc -fopenmp -o hello_omp hello_omp.c

# 设置线程数
export OMP_NUM_THREADS=4
./hello_omp
```

### MPI 编译与运行

```bash
# 安装 MPI（Ubuntu）
sudo apt install openmpi-bin libopenmpi-dev

# 安装 MPI（macOS）
brew install open-mpi

# 编译
mpicc -o hello_mpi hello_mpi.c

# 运行（4 个进程）
mpirun -np 4 ./hello_mpi
```

:::caution Windows 用户
在 Windows 上，请通过 WSL 使用 OpenMP 和 MPI。原生 Windows 上的 MPI 配置非常复杂，不建议初学者尝试。
:::

## 16.6 Hello World

### OpenMP Hello World

```c
// hello_omp.c
#include <stdio.h>
#include <omp.h>

int main() {
    #pragma omp parallel
    {
        int tid = omp_get_thread_num();
        int nthreads = omp_get_num_threads();
        printf("Hello from thread %d of %d\n", tid, nthreads);
    }
    return 0;
}
```

编译与运行：

```bash
gcc -fopenmp -o hello_omp hello_omp.c
export OMP_NUM_THREADS=4
./hello_omp
```

输出（顺序可能不同）：

```
Hello from thread 0 of 4
Hello from thread 2 of 4
Hello from thread 1 of 4
Hello from thread 3 of 4
```

### MPI Hello World

```c
// hello_mpi.c
#include <stdio.h>
#include <mpi.h>

int main(int argc, char *argv[]) {
    MPI_Init(&argc, &argv);

    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    printf("Hello from process %d of %d\n", rank, size);

    MPI_Finalize();
    return 0;
}
```

编译与运行：

```bash
mpicc -o hello_mpi hello_mpi.c
mpirun -np 4 ./hello_mpi
```

输出：

```
Hello from process 0 of 4
Hello from process 1 of 4
Hello from process 2 of 4
Hello from process 3 of 4
```

:::tip 注意区别
OpenMP 的输出顺序是不确定的（线程竞争），MPI 的输出顺序也可能不确定，但每个进程的 rank 是唯一且固定的。
:::

## 16.7 一个并行积分示例：计算 Pi

用数值积分计算圆周率：

`$$\pi = \int_0^1 \frac{4}{1+x^2} dx$$`

### OpenMP 版本

```c
// pi_omp.c
#include <stdio.h>
#include <omp.h>

int main() {
    long num_steps = 100000000;
    double step = 1.0 / (double)num_steps;
    double sum = 0.0;

    #pragma omp parallel for reduction(+:sum)
    for (long i = 0; i < num_steps; i++) {
        double x = (i + 0.5) * step;
        sum += 4.0 / (1.0 + x * x);
    }

    double pi = step * sum;
    printf("Pi = %.15f\n", pi);
    return 0;
}
```

```bash
gcc -fopenmp -O2 -o pi_omp pi_omp.c
export OMP_NUM_THREADS=4
./pi_omp
```

:::info reduction 子句
`reduction(+:sum)` 告诉编译器：每个线程维护自己的 `sum` 副本，最后自动汇总（求和）。这避免了手动处理竞争条件。
:::

### MPI 版本

```c
// pi_mpi.c
#include <stdio.h>
#include <mpi.h>

int main(int argc, char *argv[]) {
    MPI_Init(&argc, &argv);

    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    long num_steps = 100000000;
    double step = 1.0 / (double)num_steps;
    double local_sum = 0.0;

    // 每个进程计算一部分
    for (long i = rank; i < num_steps; i += size) {
        double x = (i + 0.5) * step;
        local_sum += 4.0 / (1.0 + x * x);
    }

    double global_sum;
    MPI_Reduce(&local_sum, &global_sum, 1, MPI_DOUBLE,
               MPI_SUM, 0, MPI_COMM_WORLD);

    if (rank == 0) {
        double pi = step * global_sum;
        printf("Pi = %.15f\n", pi);
    }

    MPI_Finalize();
    return 0;
}
```

```bash
mpicc -O2 -o pi_mpi pi_mpi.c
mpirun -np 4 ./pi_mpi
```

## 16.8 什么时候用 OpenMP，什么时候用 MPI

| 场景 | 推荐 | 原因 |
|------|------|------|
| 单台多核机器上的循环并行 | OpenMP | 简单，改动小 |
| 超算集群上的大规模计算 | MPI | 可跨节点 |
| 矩阵运算加速 | OpenMP（或用 BLAS 库） | 共享内存即可 |
| 大规模 PDE 求解 | MPI | 需要分布式内存 |
| 快速原型验证 | OpenMP | 只需加几行 pragma |
| 已有 MPI 代码需要修改 | MPI | 保持一致性 |
| 节点内 + 节点间都要并行 | MPI + OpenMP 混合 | 充分利用硬件 |

:::tip 实用建议
对于大多数研究生阶段的计算任务：
1. **先试 OpenMP**——只需要在循环前加一行 `#pragma omp parallel for`
2. 如果单机性能不够，或者需要上超算，再学 MPI
3. 很多数值库（BLAS、LAPACK）内部已经用了 OpenMP，你可能不需要自己写并行代码
:::

## 16.9 常见错误与调试思路

### 竞争条件 (Race Condition)

```c
// 错误示例：多个线程同时修改 sum
double sum = 0.0;
#pragma omp parallel for
for (int i = 0; i < N; i++) {
    sum += a[i];  // 竞争条件！
}

// 正确：使用 reduction
#pragma omp parallel for reduction(+:sum)
for (int i = 0; i < N; i++) {
    sum += a[i];
}
```

### MPI 死锁

```c
// 错误：两个进程都先 Send 再 Recv，可能死锁
if (rank == 0) {
    MPI_Send(&data, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
    MPI_Recv(&data, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &status);
} else {
    MPI_Send(&data, 1, MPI_INT, 0, 0, MPI_COMM_WORLD);
    MPI_Recv(&data, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &status);
}

// 正确：一个先 Send，一个先 Recv
if (rank == 0) {
    MPI_Send(&data, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
    MPI_Recv(&data, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &status);
} else {
    MPI_Recv(&data, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &status);
    MPI_Send(&data, 1, MPI_INT, 0, 0, MPI_COMM_WORLD);
}
```

### 常见调试方法

| 问题 | 排查方法 |
|------|----------|
| 结果不正确 | 用 1 个线程/进程运行，确认串行版本正确 |
| 程序卡住 | 检查是否有死锁（MPI）或 barrier 不匹配 |
| 性能没提升 | 检查是否有隐式同步或 false sharing |
| 编译报错找不到 `omp.h` | 确认加了 `-fopenmp` 编译选项 |
| `mpirun` 报错 | 确认 MPI 已安装且在 PATH 中 |

## 常见问题

**Q: OpenMP 和多线程 (pthreads) 有什么区别？**

A: OpenMP 是更高层的抽象，通过编译器指令实现并行。pthreads 是底层的线程 API，需要手动管理线程的创建和同步。对于科学计算，OpenMP 通常更方便。

**Q: MPI 程序能在笔记本上测试吗？**

A: 可以。`mpirun -np 4 ./program` 会在本地启动 4 个进程。虽然不会有性能提升（共享同一个 CPU），但可以验证逻辑正确性。

**Q: 我的程序用了 NumPy，还需要学 OpenMP 吗？**

A: NumPy 底层调用的 BLAS/LAPACK 库通常已经多线程化了。如果你的计算主要是矩阵运算且用 Python，可能不需要自己写 OpenMP。但如果你写 C/Fortran 代码，了解 OpenMP 非常有用。

## 小结

- 并行计算是计算物理的日常需求，不是"高级技巧"
- **OpenMP** 适合单机多核的共享内存并行，上手简单
- **MPI** 适合跨节点的分布式内存并行，扩展性好
- 先用串行代码验证正确性，再加并行
- 注意竞争条件和死锁这两大并行编程陷阱

## 练习

1. 编译并运行 OpenMP 和 MPI 的 Hello World 程序，分别用 2、4、8 个线程/进程
2. 修改 Pi 计算程序，比较不同线程数下的运行时间（使用 `time` 命令或 `omp_get_wtime()`）
3. 写一个 OpenMP 程序计算数组元素之和，先不用 `reduction`（观察错误结果），再用 `reduction`（观察正确结果）
4. 写一个 MPI 程序，让 rank 0 发送一个整数给 rank 1，rank 1 收到后打印出来

[上一章：Make 与 CMake →](../15-make-cmake/index.md) | [下一章：高性能数值库 →](../17-hpc-libraries/index.md)
