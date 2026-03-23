---
sidebar_position: 13
sidebar_label: "13. Scientific Python"
---

# Chapter 13: Python Scientific Computing Ecosystem

## Chapter Goals

- Master NumPy array operations and vectorized thinking
- Understand the core numerical computing features of SciPy
- Learn to create publication-quality figures with Matplotlib
- Understand parallel computing approaches using multiprocessing and mpi4py
- Complete a full physics problem from modeling to visualization

## Motivation

The reason Python has become the top language for scientific research is its scientific computing ecosystem. NumPy provides efficient array operations, SciPy provides ready-made numerical methods, and Matplotlib handles visualization. Mastering these three tools enables you to solve the vast majority of computational physics problems with Python.

---

## 13.1 NumPy: Arrays and Vectorization

### Core Concepts

NumPy's `ndarray` is the fundamental data structure for scientific computing. Unlike Python lists, it stores data contiguously in memory and supports vectorized operations.

```python
import numpy as np

# Creating arrays
a = np.array([1.0, 2.0, 3.0, 4.0])
b = np.linspace(0, 2 * np.pi, 100)   # 100 evenly spaced points
c = np.zeros((3, 3))                  # 3x3 zero matrix
d = np.random.randn(1000)             # 1000 standard normal random numbers

# Vectorized operations (no for loops needed)
y = np.sin(b)
z = a ** 2 + 2 * a + 1

# Array indexing and slicing
matrix = np.arange(12).reshape(3, 4)
print(matrix[0, :])    # First row
print(matrix[:, -1])   # Last column
print(matrix[1:, :2])  # Sub-matrix
```

:::tip
**Vectorized thinking**: Whenever you want to write a `for` loop to process arrays, first consider whether you can use NumPy's vectorized operations instead. This is the core optimization technique for Python scientific computing.
:::

### Common Operations Quick Reference

| Operation | Code |
|-----------|------|
| Matrix multiplication | `A @ B` or `np.dot(A, B)` |
| Transpose | `A.T` |
| Inverse | `np.linalg.inv(A)` |
| Eigenvalues | `np.linalg.eigh(A)` |
| FFT | `np.fft.fft(signal)` |
| Save/Load | `np.save('data.npy', arr)` / `np.load('data.npy')` |

---

## 13.2 SciPy: Numerical Computing Toolbox

SciPy provides advanced numerical algorithms on top of NumPy.

### Commonly Used Submodules

| Module | Functionality |
|--------|---------------|
| `scipy.integrate` | Numerical integration, ODE solvers |
| `scipy.optimize` | Optimization, root finding |
| `scipy.linalg` | Linear algebra (more complete than NumPy) |
| `scipy.interpolate` | Interpolation |
| `scipy.fft` | Fast Fourier Transform |
| `scipy.sparse` | Sparse matrices |
| `scipy.signal` | Signal processing |

### ODE Solver Example: Simple Harmonic Oscillator

```python
import numpy as np
from scipy.integrate import solve_ivp

def harmonic_oscillator(t, y, omega=1.0):
    """dy/dt = [v, -omega^2 * x]"""
    x, v = y
    return [v, -omega**2 * x]

# Initial conditions: x(0)=1, v(0)=0
t_span = (0, 20)
y0 = [1.0, 0.0]
t_eval = np.linspace(0, 20, 500)

sol = solve_ivp(harmonic_oscillator, t_span, y0, t_eval=t_eval,
                method='RK45', rtol=1e-8)

# sol.t — time array
# sol.y[0] — position x(t)
# sol.y[1] — velocity v(t)
```

### Numerical Integration

```python
from scipy.integrate import quad

# Compute integral_0^inf e^(-x^2) dx = sqrt(pi) / 2
result, error = quad(lambda x: np.exp(-x**2), 0, np.inf)
print(f"Result: {result:.10f}, Error estimate: {error:.2e}")
```

---

## 13.3 Matplotlib: Plotting

### Basic Line Plot

```python
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 200)
y1 = np.sin(x)
y2 = np.cos(x)

plt.figure(figsize=(8, 5))
plt.plot(x, y1, 'b-', label=r'$\sin(x)$', linewidth=1.5)
plt.plot(x, y2, 'r--', label=r'$\cos(x)$', linewidth=1.5)
plt.xlabel('x', fontsize=14)
plt.ylabel('y', fontsize=14)
plt.title('Trigonometric Functions', fontsize=16)
plt.legend(fontsize=12)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('trig_functions.pdf', dpi=300)
plt.show()
```

### Scatter Plots and Subplots

```python
# Scatter plot
np.random.seed(42)
x_data = np.random.randn(200)
y_data = 2 * x_data + 0.5 * np.random.randn(200)
plt.figure(figsize=(6, 5))
plt.scatter(x_data, y_data, c=y_data, cmap='coolwarm', alpha=0.7, s=30)
plt.colorbar(label='y value')
plt.xlabel('x'); plt.ylabel('y')
plt.savefig('scatter.png', dpi=150)

# Subplots
fig, axes = plt.subplots(2, 2, figsize=(10, 8))
funcs = [np.sin, np.cos, lambda x: np.exp(-x**2), np.sinc]
titles = ['sin(x)', 'cos(x)', r'$e^{-x^2}$', 'sinc(x)']
for ax, f, t in zip(axes.flat, funcs, titles):
    ax.plot(x, f(x)); ax.set_title(t); ax.grid(True, alpha=0.3)
fig.tight_layout()
fig.savefig('subplots.pdf')
```

:::info
**Publication-quality figures**: Use `savefig('figure.pdf', dpi=300)` to save vector graphics. Journal submissions typically require PDF or EPS format at 300 dpi or above.
:::

---

## 13.4 multiprocessing: Multi-Process Parallelism

Python's GIL (Global Interpreter Lock) prevents true parallel computation with multithreading. For CPU-intensive tasks, use `multiprocessing`.

```python
import multiprocessing as mp
import numpy as np

def compute_integral(args):
    """One batch of Monte Carlo integration"""
    seed, n_samples = args
    rng = np.random.default_rng(seed)
    x = rng.uniform(0, 1, n_samples)
    return np.mean(np.sin(x))

if __name__ == '__main__':
    n_workers = mp.cpu_count()
    n_total = 10_000_000
    n_per_worker = n_total // n_workers

    tasks = [(seed, n_per_worker) for seed in range(n_workers)]

    with mp.Pool(n_workers) as pool:
        results = pool.map(compute_integral, tasks)

    final_result = np.mean(results)
    print(f"∫₀¹ sin(x) dx ≈ {final_result:.6f}")
    print(f"Analytical value: {1 - np.cos(1):.6f}")
```

:::caution
When using `multiprocessing` on Windows, you **must** place parallel code inside `if __name__ == '__main__':`, otherwise you will get an error.
:::

---

## 13.5 mpi4py: MPI Interface

For large-scale parallel computing across nodes, use MPI (Message Passing Interface). `mpi4py` is the Python binding for MPI.

```python
# mpi_hello.py
from mpi4py import MPI

comm = MPI.COMM_WORLD
rank = comm.Get_rank()
size = comm.Get_size()

print(f"Hello from rank {rank} of {size}")

# Simple reduce operation
local_value = rank * 10.0
total = comm.reduce(local_value, op=MPI.SUM, root=0)

if rank == 0:
    print(f"Sum of all ranks: {total}")
```

```bash
# Run (requires MPI and mpi4py to be installed first)
mpirun -np 4 python mpi_hello.py
```

```bash
# Installation
# Ubuntu: sudo apt install libopenmpi-dev
# macOS:  brew install open-mpi
# Then:   pip install mpi4py
```

---

## 13.6 Performance, Memory, and Vectorized Thinking

### Performance Optimization Hierarchy

```text
1. Vectorization (NumPy)          — Simplest, usually sufficient
2. Numba JIT compilation          — Add @jit decorator, near-C speed
3. multiprocessing                — Utilize multiple cores
4. Cython / C extension           — Write C-level code
5. Call external C/Fortran libs   — Maximum performance
```

### Memory Considerations

```python
# Check array memory usage
a = np.zeros((10000, 10000), dtype=np.float64)
print(f"Memory: {a.nbytes / 1e9:.2f} GB")  # 0.80 GB

# Use appropriate dtype to save memory
b = np.zeros((10000, 10000), dtype=np.float32)  # 0.40 GB
```

:::tip
For large simulations, estimate memory requirements first. A $10000 \times 10000$ `float64` matrix requires about 800 MB.
:::

---

## 13.7 A Small Physics Problem Example

### 1D Diffusion Equation

Solve `$\frac{\partial u}{\partial t} = D \frac{\partial^2 u}{\partial x^2}$` with a Gaussian pulse as the initial condition.

```python
import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

# --- Parameters ---
L = 10.0          # Spatial range [-L, L]
N = 200           # Number of spatial grid points
D = 1.0           # Diffusion coefficient
T = 5.0           # Total time

# --- Spatial discretization ---
x = np.linspace(-L, L, N)
dx = x[1] - x[0]

# --- Initial condition: Gaussian ---
u0 = np.exp(-x**2)

# --- Build diffusion operator (finite difference) ---
def diffusion_rhs(t, u):
    """du/dt = D * d²u/dx² (central difference, Dirichlet BC)"""
    d2u = np.zeros_like(u)
    d2u[1:-1] = (u[2:] - 2*u[1:-1] + u[:-2]) / dx**2
    # Boundary conditions: u=0
    d2u[0] = 0
    d2u[-1] = 0
    return D * d2u

# --- Solve ---
t_eval = np.linspace(0, T, 50)
sol = solve_ivp(diffusion_rhs, (0, T), u0, t_eval=t_eval,
                method='RK45', rtol=1e-6)

# --- Analytical solution (for comparison and verification) ---
def analytical(x, t, D=1.0):
    """Analytical solution for Gaussian diffusion"""
    if t == 0:
        return np.exp(-x**2)
    return 1.0 / np.sqrt(1 + 4*D*t) * np.exp(-x**2 / (1 + 4*D*t))
```

:::info
This example demonstrates the typical computational physics workflow: **Modeling -> Discretization -> Numerical solving -> Comparison with analytical solution for verification**.
:::

---

## 13.8 Result Visualization and Saving

### Visualizing the Diffusion Process

```python
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Left panel: Snapshots at different times
for idx in np.linspace(0, len(sol.t)-1, 6, dtype=int):
    axes[0].plot(x, sol.y[:, idx], label=f't = {sol.t[idx]:.1f}')
axes[0].set_xlabel('x'); axes[0].set_ylabel('u(x, t)')
axes[0].set_title('1D Diffusion: Numerical Solution')
axes[0].legend(); axes[0].grid(True, alpha=0.3)

# Right panel: Numerical vs analytical solution
idx_check = np.argmin(np.abs(sol.t - 2.0))
axes[1].plot(x, sol.y[:, idx_check], 'b-', label='Numerical', lw=2)
axes[1].plot(x, analytical(x, sol.t[idx_check]), 'r--', label='Analytical', lw=2)
axes[1].set_xlabel('x'); axes[1].set_ylabel('u(x, t)')
axes[1].set_title(f'Comparison at t = {sol.t[idx_check]:.1f}')
axes[1].legend(); axes[1].grid(True, alpha=0.3)

fig.tight_layout()
fig.savefig('diffusion_results.pdf', dpi=300)
```

### Saving Data

```python
# NumPy binary format (recommended for intermediate results)
np.savez('diffusion_data.npz', x=x, t=sol.t, u=sol.y)
data = np.load('diffusion_data.npz')  # Load

# CSV (universal but less efficient)
np.savetxt('final_profile.csv',
           np.column_stack([x, sol.y[:, -1]]),
           header='x, u', delimiter=',')

# HDF5 (recommended for large datasets)
import h5py
with h5py.File('simulation.h5', 'w') as f:
    f.create_dataset('x', data=x)
    f.create_dataset('t', data=sol.t)
    f.create_dataset('u', data=sol.y)
    f.attrs['D'] = D
```

| Format | Pros | Cons | Use Case |
|--------|------|------|----------|
| `.npy` / `.npz` | Fast, simple | Python-only | Intermediate results, small data |
| `.csv` | Universal, human-readable | Slow, large file size | Data exchange with other tools |
| `.h5` (HDF5) | Fast, supports large data, can store metadata | Requires extra h5py installation | Large-scale simulation data |

---

## FAQ

**Q: What are the main differences between NumPy and MATLAB?**
A: NumPy indexing starts from 0 (MATLAB from 1), NumPy uses `@` for matrix multiplication (MATLAB uses `*`), and NumPy arrays default to row-major storage (MATLAB is column-major).

**Q: When should I use SciPy instead of writing my own?**
A: Almost always use SciPy. Its algorithms are thoroughly tested and optimized. Writing your own implementation is error-prone and less efficient.

**Q: How do I make figures suitable for papers?**
A: Use `figsize` to control size, `fontsize` to adjust fonts, and `savefig` to save as PDF. It's recommended to use `plt.rcParams` for global style settings.

---

## Summary

- NumPy's vectorized operations are the foundation of Python scientific computing — avoid explicit for loops
- SciPy provides ready-made tools for ODE solving, numerical integration, optimization, etc. — use them first
- Matplotlib can create publication-quality figures — learn subplots and savefig
- multiprocessing is for single-machine multi-core parallelism; mpi4py is for cross-node parallelism
- Complete research workflow: Modeling -> Coding -> Solving -> Verification -> Visualization -> Saving data

---

## Exercises

1. **NumPy**: Create two $100 \times 100$ random matrices, compute the matrix product, and use `%timeit` to compare the speed of `@` versus `for` loops
2. **SciPy**: Use `solve_ivp` to solve a damped harmonic oscillator `$\ddot{x} + 2\gamma\dot{x} + \omega_0^2 x = 0$`, plot `$x(t)$` and the phase space diagram `$(x, \dot{x})$`
3. **Matplotlib**: Reproduce the diffusion equation plot from this chapter and add a colorbar and time annotations
4. **Parallelism**: Use multiprocessing to compute a Monte Carlo estimate of $\pi$ in parallel, and compare speedup ratios with different numbers of processes
5. **Comprehensive**: Choose a physics problem that interests you (e.g., Lorenz attractor, heat conduction, wave equation) and complete the full workflow from modeling to visualization
