---
sidebar_position: 16
sidebar_label: "16. OpenMP & MPI"
---

# Chapter 16: OpenMP and MPI

> What one computer can't finish, let a thousand computers work on together.

## Chapter Goals

After reading this chapter, you should be able to:

- Understand the basic motivation and classification of parallel computing (shared memory vs distributed memory)
- Write simple multithreaded programs using OpenMP
- Write simple multi-process programs using MPI
- Compile and run OpenMP / MPI programs
- Determine when to use OpenMP and when to use MPI

## Motivation

Suppose you've written a Monte Carlo simulation that takes 100 hours on a single core. Your lab server has 64 cores — if you could distribute the task across all cores, you could theoretically cut the time to under 2 hours. This is the core value of parallel computing.

In computational physics, parallel computing is not an "advanced technique" — it is an **everyday necessity**.

## 16.1 Why Parallel Computing Is Needed

Modern CPU single-core frequencies have approached their physical limits (around 5 GHz), and performance improvements mainly come from **increasing the number of cores**. If your program only uses one core, you are wasting the vast majority of computing power.

Common parallel scenarios:

- **Monte Carlo simulations**: Each sample is independent, naturally suited for parallelism
- **Matrix operations**: Linear algebra operations can be distributed across multiple cores
- **Parameter sweeps**: Running the same program independently for different parameter values
- **Large-scale PDE solving**: Distributing spatial grids to different processes

## 16.2 Shared Memory vs Distributed Memory

There are two fundamental models of parallel computing:

| Feature | Shared Memory | Distributed Memory |
|---------|--------------------------|-------------------------------|
| Representative technology | OpenMP | MPI |
| Memory model | All threads share the same memory | Each process has its own independent memory |
| Communication method | Direct read/write of shared variables | Message passing (send/receive) |
| Typical hardware | Single multi-core machine | Cluster of multiple machines |
| Programming difficulty | Lower | Higher |
| Scalability | Limited by single-machine core count | Scalable to thousands of nodes |

```
Shared Memory Model (OpenMP)        Distributed Memory Model (MPI)

┌──────────────────┐       ┌────────┐   ┌────────┐
│   Shared Memory    │       │ Proc 0  │   │ Proc 1  │
│                  │       │ Mem 0   │   │ Mem 1   │
│  Thread0  Thread1 │       └───┬────┘   └───┬────┘
│  Thread2  Thread3 │           │  Message     │
└──────────────────┘           │  Passing     │
                               ←──────────→
```

:::info Hybrid Parallelism
On supercomputers, a common approach is to use **MPI between nodes and OpenMP within nodes**, known as hybrid parallelism. However, for beginners, it's best to learn each one separately first.
:::

## 16.3 OpenMP Basic Concepts

OpenMP (Open Multi-Processing) is a shared-memory parallel programming interface based on **compiler directives**. Its core idea is: insert `#pragma` directives into serial code to tell the compiler which parts can be executed in parallel.

Key concepts:

- **Thread**: The smallest unit of program execution; multiple threads share the same process memory
- **Parallel Region**: A code block marked with `#pragma omp parallel`, executed simultaneously by multiple threads
- **Work Sharing**: Use `#pragma omp for` to distribute loop iterations to different threads
- **Synchronization**: Use `#pragma omp critical` or `#pragma omp barrier` to coordinate threads

## 16.4 MPI Basic Concepts

MPI (Message Passing Interface) is the standard interface for distributed-memory parallel computing. Each process has its own independent memory space, and processes communicate by **sending and receiving messages**.

Key concepts:

- **Process**: An independently running program instance with its own memory space
- **Communicator**: A group of processes; the default is `MPI_COMM_WORLD`
- **Rank**: A process's ID number within the communicator (starting from 0)
- **Point-to-point communication**: `MPI_Send` / `MPI_Recv`
- **Collective communication**: `MPI_Bcast`, `MPI_Reduce`, `MPI_Gather`, etc.

## 16.5 Compilation and Execution

### OpenMP Compilation

```bash
# GCC
gcc -fopenmp -o hello_omp hello_omp.c

# Set the number of threads
export OMP_NUM_THREADS=4
./hello_omp
```

### MPI Compilation and Execution

```bash
# Install MPI (Ubuntu)
sudo apt install openmpi-bin libopenmpi-dev

# Install MPI (macOS)
brew install open-mpi

# Compile
mpicc -o hello_mpi hello_mpi.c

# Run (4 processes)
mpirun -np 4 ./hello_mpi
```

:::caution Windows Users
On Windows, please use OpenMP and MPI through WSL. Configuring native Windows MPI is very complex and not recommended for beginners.
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

Compile and run:

```bash
gcc -fopenmp -o hello_omp hello_omp.c
export OMP_NUM_THREADS=4
./hello_omp
```

Output (order may vary):

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

Compile and run:

```bash
mpicc -o hello_mpi hello_mpi.c
mpirun -np 4 ./hello_mpi
```

Output:

```
Hello from process 0 of 4
Hello from process 1 of 4
Hello from process 2 of 4
Hello from process 3 of 4
```

:::tip Note the Difference
OpenMP output order is nondeterministic (thread contention), and MPI output order may also be nondeterministic, but each process's rank is unique and fixed.
:::

## 16.7 A Parallel Integration Example: Computing Pi

Compute Pi using numerical integration:

`$$\pi = \int_0^1 \frac{4}{1+x^2} dx$$`

### OpenMP Version

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

:::info The reduction Clause
`reduction(+:sum)` tells the compiler: each thread maintains its own copy of `sum`, and they are automatically combined (summed) at the end. This avoids manually handling race conditions.
:::

### MPI Version

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

    // Each process computes a portion
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

## 16.8 When to Use OpenMP vs MPI

| Scenario | Recommended | Reason |
|----------|-------------|--------|
| Loop parallelism on a single multi-core machine | OpenMP | Simple, minimal code changes |
| Large-scale computing on a supercomputer cluster | MPI | Can span nodes |
| Matrix operation acceleration | OpenMP (or use BLAS libraries) | Shared memory is sufficient |
| Large-scale PDE solving | MPI | Requires distributed memory |
| Quick prototype validation | OpenMP | Just add a few pragma lines |
| Modifying existing MPI code | MPI | Maintain consistency |
| Parallelism both within and across nodes | MPI + OpenMP hybrid | Fully utilize hardware |

:::tip Practical Advice
For most graduate-level computational tasks:
1. **Try OpenMP first** — you just need to add one line of `#pragma omp parallel for` before the loop
2. If single-machine performance isn't enough, or you need to use a supercomputer, then learn MPI
3. Many numerical libraries (BLAS, LAPACK) already use OpenMP internally — you may not need to write parallel code yourself
:::

## 16.9 Common Errors and Debugging Approaches

### Race Conditions

```c
// Wrong: multiple threads modify sum simultaneously
double sum = 0.0;
#pragma omp parallel for
for (int i = 0; i < N; i++) {
    sum += a[i];  // Race condition!
}

// Correct: use reduction
#pragma omp parallel for reduction(+:sum)
for (int i = 0; i < N; i++) {
    sum += a[i];
}
```

### MPI Deadlock

```c
// Wrong: both processes Send first then Recv, may deadlock
if (rank == 0) {
    MPI_Send(&data, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
    MPI_Recv(&data, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &status);
} else {
    MPI_Send(&data, 1, MPI_INT, 0, 0, MPI_COMM_WORLD);
    MPI_Recv(&data, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &status);
}

// Correct: one Sends first, the other Recvs first
if (rank == 0) {
    MPI_Send(&data, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
    MPI_Recv(&data, 1, MPI_INT, 1, 0, MPI_COMM_WORLD, &status);
} else {
    MPI_Recv(&data, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, &status);
    MPI_Send(&data, 1, MPI_INT, 0, 0, MPI_COMM_WORLD);
}
```

### Common Debugging Methods

| Problem | Troubleshooting Approach |
|---------|--------------------------|
| Incorrect results | Run with 1 thread/process, confirm serial version is correct |
| Program hangs | Check for deadlock (MPI) or mismatched barriers |
| No performance improvement | Check for implicit synchronization or false sharing |
| Compile error: can't find `omp.h` | Confirm `-fopenmp` flag is included |
| `mpirun` error | Confirm MPI is installed and in PATH |

## FAQ

**Q: What is the difference between OpenMP and pthreads?**

A: OpenMP is a higher-level abstraction that implements parallelism through compiler directives. pthreads is a low-level thread API that requires manual thread creation and synchronization management. For scientific computing, OpenMP is usually more convenient.

**Q: Can MPI programs be tested on a laptop?**

A: Yes. `mpirun -np 4 ./program` will launch 4 processes locally. Although there won't be performance gains (sharing the same CPU), you can verify logical correctness.

**Q: I use NumPy in my program. Do I still need to learn OpenMP?**

A: The BLAS/LAPACK libraries that NumPy calls under the hood are usually already multithreaded. If your computation is mainly matrix operations using Python, you may not need to write OpenMP yourself. However, if you write C/Fortran code, understanding OpenMP is very useful.

## Summary

- Parallel computing is an everyday necessity in computational physics, not an "advanced technique"
- **OpenMP** is suitable for shared-memory parallelism on a single multi-core machine, easy to get started
- **MPI** is suitable for distributed-memory parallelism across nodes, with good scalability
- Verify correctness with serial code first, then add parallelism
- Watch out for the two major pitfalls of parallel programming: race conditions and deadlocks

## Exercises

1. Compile and run the OpenMP and MPI Hello World programs with 2, 4, and 8 threads/processes respectively
2. Modify the Pi computation program to compare runtimes with different thread counts (using the `time` command or `omp_get_wtime()`)
3. Write an OpenMP program that computes the sum of array elements — first without `reduction` (observe incorrect results), then with `reduction` (observe correct results)
4. Write an MPI program where rank 0 sends an integer to rank 1, and rank 1 prints it after receiving

[Previous chapter: Make and CMake ->](../15-make-cmake/index.md) | [Next chapter: High-Performance Numerical Libraries ->](../17-hpc-libraries/index.md)
