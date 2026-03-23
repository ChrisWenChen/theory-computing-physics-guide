---
sidebar_position: 13
sidebar_label: "13. Python 科学计算生态"
---

# 第 13 章：Python 科学计算生态

## 本章目标

- 掌握 NumPy 数组操作与向量化思维
- 了解 SciPy 的核心数值计算功能
- 学会使用 Matplotlib 绘制出版质量的图像
- 理解 multiprocessing 和 mpi4py 的并行方案
- 完成一个从建模到可视化的完整物理问题

## 动机

Python 之所以能成为科研第一语言，核心原因是它的科学计算生态。NumPy 提供高效数组运算，SciPy 提供现成的数值方法，Matplotlib 处理可视化。掌握这三者，你就能用 Python 解决绝大多数计算物理问题。

---

## 13.1 NumPy：数组与向量化

### 核心概念

NumPy 的 `ndarray` 是科学计算的基础数据结构。与 Python 列表不同，它在内存中连续存储、支持向量化运算。

```python
import numpy as np

# 创建数组
a = np.array([1.0, 2.0, 3.0, 4.0])
b = np.linspace(0, 2 * np.pi, 100)   # 等间距 100 个点
c = np.zeros((3, 3))                  # 3x3 零矩阵
d = np.random.randn(1000)             # 1000 个标准正态随机数

# 向量化运算（不需要 for 循环）
y = np.sin(b)
z = a ** 2 + 2 * a + 1

# 数组索引与切片
matrix = np.arange(12).reshape(3, 4)
print(matrix[0, :])    # 第一行
print(matrix[:, -1])   # 最后一列
print(matrix[1:, :2])  # 子矩阵
```

:::tip
**向量化思维**：每当你想写 `for` 循环处理数组时，先想想能否用 NumPy 的向量化操作替代。这是 Python 科学计算的核心优化技巧。
:::

### 常用操作速查

| 操作 | 代码 |
|------|------|
| 矩阵乘法 | `A @ B` 或 `np.dot(A, B)` |
| 转置 | `A.T` |
| 求逆 | `np.linalg.inv(A)` |
| 特征值 | `np.linalg.eigh(A)` |
| FFT | `np.fft.fft(signal)` |
| 保存/加载 | `np.save('data.npy', arr)` / `np.load('data.npy')` |

---

## 13.2 SciPy：数值计算工具箱

SciPy 在 NumPy 之上提供高级数值算法。

### 常用子模块

| 模块 | 功能 |
|------|------|
| `scipy.integrate` | 数值积分、ODE 求解 |
| `scipy.optimize` | 优化、求根 |
| `scipy.linalg` | 线性代数（比 NumPy 更完整） |
| `scipy.interpolate` | 插值 |
| `scipy.fft` | 快速 Fourier 变换 |
| `scipy.sparse` | 稀疏矩阵 |
| `scipy.signal` | 信号处理 |

### ODE 求解示例：简谐振子

```python
import numpy as np
from scipy.integrate import solve_ivp

def harmonic_oscillator(t, y, omega=1.0):
    """dy/dt = [v, -omega^2 * x]"""
    x, v = y
    return [v, -omega**2 * x]

# 初始条件：x(0)=1, v(0)=0
t_span = (0, 20)
y0 = [1.0, 0.0]
t_eval = np.linspace(0, 20, 500)

sol = solve_ivp(harmonic_oscillator, t_span, y0, t_eval=t_eval,
                method='RK45', rtol=1e-8)

# sol.t — 时间数组
# sol.y[0] — 位置 x(t)
# sol.y[1] — 速度 v(t)
```

### 数值积分

```python
from scipy.integrate import quad

# 计算 ∫₀^∞ e^(-x²) dx = √π / 2
result, error = quad(lambda x: np.exp(-x**2), 0, np.inf)
print(f"结果: {result:.10f}, 误差估计: {error:.2e}")
```

---

## 13.3 Matplotlib：绘图

### 基础线图

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

### 散点图与子图

```python
# 散点图
np.random.seed(42)
x_data = np.random.randn(200)
y_data = 2 * x_data + 0.5 * np.random.randn(200)
plt.figure(figsize=(6, 5))
plt.scatter(x_data, y_data, c=y_data, cmap='coolwarm', alpha=0.7, s=30)
plt.colorbar(label='y value')
plt.xlabel('x'); plt.ylabel('y')
plt.savefig('scatter.png', dpi=150)

# 子图 (subplots)
fig, axes = plt.subplots(2, 2, figsize=(10, 8))
funcs = [np.sin, np.cos, lambda x: np.exp(-x**2), np.sinc]
titles = ['sin(x)', 'cos(x)', r'$e^{-x^2}$', 'sinc(x)']
for ax, f, t in zip(axes.flat, funcs, titles):
    ax.plot(x, f(x)); ax.set_title(t); ax.grid(True, alpha=0.3)
fig.tight_layout()
fig.savefig('subplots.pdf')
```

:::info
**出版质量图像**：使用 `savefig('figure.pdf', dpi=300)` 保存矢量图。期刊投稿通常要求 PDF 或 EPS 格式，300 dpi 以上。
:::

---

## 13.4 multiprocessing：多进程

Python 的 GIL (Global Interpreter Lock) 使多线程无法真正并行计算。对于 CPU 密集型任务，使用 `multiprocessing`。

```python
import multiprocessing as mp
import numpy as np

def compute_integral(args):
    """蒙特卡洛积分的一个批次"""
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
    print(f"解析值: {1 - np.cos(1):.6f}")
```

:::caution
在 Windows 上使用 `multiprocessing` 时，**必须**将并行代码放在 `if __name__ == '__main__':` 中，否则会报错。
:::

---

## 13.5 mpi4py：MPI 接口

对于跨节点的大规模并行计算，使用 MPI (Message Passing Interface)。`mpi4py` 是 Python 的 MPI 绑定。

```python
# mpi_hello.py
from mpi4py import MPI

comm = MPI.COMM_WORLD
rank = comm.Get_rank()
size = comm.Get_size()

print(f"Hello from rank {rank} of {size}")

# 简单的 reduce 操作
local_value = rank * 10.0
total = comm.reduce(local_value, op=MPI.SUM, root=0)

if rank == 0:
    print(f"Sum of all ranks: {total}")
```

```bash
# 运行（需要先安装 MPI 和 mpi4py）
mpirun -np 4 python mpi_hello.py
```

```bash
# 安装
# Ubuntu: sudo apt install libopenmpi-dev
# macOS:  brew install open-mpi
# 然后:   pip install mpi4py
```

---

## 13.6 性能、内存与向量化思维

### 性能优化层级

```text
1. 向量化 (NumPy)           — 最简单，通常够用
2. Numba JIT 编译            — 加 @jit 装饰器，接近 C 速度
3. multiprocessing           — 利用多核
4. Cython / C extension      — 写 C 级别代码
5. 调用外部 C/Fortran 库     — 最大性能
```

### 内存注意事项

```python
# 检查数组内存占用
a = np.zeros((10000, 10000), dtype=np.float64)
print(f"内存: {a.nbytes / 1e9:.2f} GB")  # 0.80 GB

# 使用合适的 dtype 节省内存
b = np.zeros((10000, 10000), dtype=np.float32)  # 0.40 GB
```

:::tip
对于大型模拟，先估算内存需求。一个 $10000 \times 10000$ 的 `float64` 矩阵就需要约 800 MB。
:::

---

## 13.7 一个小型物理问题案例

### 一维扩散方程 (Diffusion Equation)

求解 `$\frac{\partial u}{\partial t} = D \frac{\partial^2 u}{\partial x^2}$`，初始条件为 Gaussian 脉冲。

```python
import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

# --- 参数 ---
L = 10.0          # 空间范围 [-L, L]
N = 200           # 空间格点数
D = 1.0           # 扩散系数
T = 5.0           # 总时间

# --- 空间离散 ---
x = np.linspace(-L, L, N)
dx = x[1] - x[0]

# --- 初始条件：Gaussian ---
u0 = np.exp(-x**2)

# --- 构建扩散算子（有限差分） ---
def diffusion_rhs(t, u):
    """du/dt = D * d²u/dx² （中心差分，Dirichlet BC）"""
    d2u = np.zeros_like(u)
    d2u[1:-1] = (u[2:] - 2*u[1:-1] + u[:-2]) / dx**2
    # 边界条件：u=0
    d2u[0] = 0
    d2u[-1] = 0
    return D * d2u

# --- 求解 ---
t_eval = np.linspace(0, T, 50)
sol = solve_ivp(diffusion_rhs, (0, T), u0, t_eval=t_eval,
                method='RK45', rtol=1e-6)

# --- 解析解（对比验证） ---
def analytical(x, t, D=1.0):
    """Gaussian 扩散的解析解"""
    if t == 0:
        return np.exp(-x**2)
    return 1.0 / np.sqrt(1 + 4*D*t) * np.exp(-x**2 / (1 + 4*D*t))
```

:::info
这个例子展示了计算物理的典型工作流：**建模 -> 离散化 -> 数值求解 -> 与解析解对比验证**。
:::

---

## 13.8 结果可视化与保存

### 可视化扩散过程

```python
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# 左图：不同时刻的快照
for idx in np.linspace(0, len(sol.t)-1, 6, dtype=int):
    axes[0].plot(x, sol.y[:, idx], label=f't = {sol.t[idx]:.1f}')
axes[0].set_xlabel('x'); axes[0].set_ylabel('u(x, t)')
axes[0].set_title('1D Diffusion: Numerical Solution')
axes[0].legend(); axes[0].grid(True, alpha=0.3)

# 右图：数值解 vs 解析解
idx_check = np.argmin(np.abs(sol.t - 2.0))
axes[1].plot(x, sol.y[:, idx_check], 'b-', label='Numerical', lw=2)
axes[1].plot(x, analytical(x, sol.t[idx_check]), 'r--', label='Analytical', lw=2)
axes[1].set_xlabel('x'); axes[1].set_ylabel('u(x, t)')
axes[1].set_title(f'Comparison at t = {sol.t[idx_check]:.1f}')
axes[1].legend(); axes[1].grid(True, alpha=0.3)

fig.tight_layout()
fig.savefig('diffusion_results.pdf', dpi=300)
```

### 保存数据

```python
# NumPy 二进制格式（推荐用于中间结果）
np.savez('diffusion_data.npz', x=x, t=sol.t, u=sol.y)
data = np.load('diffusion_data.npz')  # 加载

# CSV（通用但效率低）
np.savetxt('final_profile.csv',
           np.column_stack([x, sol.y[:, -1]]),
           header='x, u', delimiter=',')

# HDF5（推荐用于大型数据）
import h5py
with h5py.File('simulation.h5', 'w') as f:
    f.create_dataset('x', data=x)
    f.create_dataset('t', data=sol.t)
    f.create_dataset('u', data=sol.y)
    f.attrs['D'] = D
```

| 格式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| `.npy` / `.npz` | 快速、简单 | Python 专用 | 中间结果、小数据 |
| `.csv` | 通用、可读 | 慢、占空间 | 与其他工具交换 |
| `.h5` (HDF5) | 快速、支持大数据、可存元数据 | 需要额外安装 h5py | 大规模模拟数据 |

---

## 常见问题

**Q: NumPy 和 MATLAB 的主要区别？**
A: NumPy 索引从 0 开始（MATLAB 从 1），NumPy 用 `@` 做矩阵乘法（MATLAB 用 `*`），NumPy 的 array 默认是行优先存储（MATLAB 列优先）。

**Q: 什么时候该用 SciPy 而不是自己写？**
A: 几乎总是应该用 SciPy。它的算法经过充分测试和优化，自己实现容易出错且效率低。

**Q: 图要怎么调才能用于论文？**
A: 使用 `figsize` 控制大小，`fontsize` 调整字体，`savefig` 保存为 PDF。推荐用 `plt.rcParams` 全局设置样式。

---

## 小结

- NumPy 的向量化操作是 Python 科学计算的基础，避免显式 for 循环
- SciPy 提供 ODE 求解、数值积分、优化等现成工具，优先使用
- Matplotlib 能绘制出版质量的图像，学会 subplots 和 savefig
- multiprocessing 用于单机多核并行，mpi4py 用于跨节点并行
- 完整的科研工作流：建模 -> 编码 -> 求解 -> 验证 -> 可视化 -> 保存数据

---

## 练习

1. **NumPy**：创建两个 $100 \times 100$ 的随机矩阵，计算矩阵乘积，用 `%timeit` 比较 `@` 和 `for` 循环的速度
2. **SciPy**：用 `solve_ivp` 求解阻尼谐振子 `$\ddot{x} + 2\gamma\dot{x} + \omega_0^2 x = 0$`，绘制 `$x(t)$` 和相空间图 `$(x, \dot{x})$`
3. **Matplotlib**：复现本章的扩散方程图，并添加 colorbar 和时间标注
4. **并行**：用 multiprocessing 并行计算 $\pi$ 的蒙特卡洛估计，比较不同进程数的加速比
5. **综合**：选择一个你感兴趣的物理问题（如 Lorenz attractor、热传导、波动方程），完成从建模到可视化的全流程
