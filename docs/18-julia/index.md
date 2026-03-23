---
sidebar_position: 18
sidebar_label: "18. Julia 与包管理"
---

# 第 18 章：Julia 与包管理

> "Walks like Python, runs like C."

## 本章目标

读完本章后，你应该能：

- 理解 Julia 在科学计算中的定位和优势
- 在你的平台上安装 Julia
- 使用 Julia REPL 和 Pkg 包管理器
- 创建和管理 Julia 项目环境
- 用 Julia 完成一个简单的数值实验
- 理性比较 Julia 和 Python

## 动机

Python 是科学计算最流行的语言，但它有一个根本性的弱点：**慢**。纯 Python 的 for 循环比 C/Fortran 慢 100 倍以上。虽然 NumPy 通过调用底层 C 库解决了部分问题，但一旦你的算法无法用向量化表达，性能就会急剧下降。

Julia 试图解决这个"两语言问题"：你可以用接近 Python 的语法，获得接近 C 的性能。对于计算物理研究者来说，这是一个值得了解的选项。

:::info Julia 不是必修
本教程不要求你掌握 Julia。如果你目前用 Python + NumPy 工作得很好，完全可以跳过本章。但如果你对性能敏感的数值计算感兴趣，Julia 值得一试。
:::

## 18.1 为什么有人用 Julia 做科研

### Julia 的核心优势

1. **高性能**：通过 LLVM JIT 编译，Julia 代码的性能接近 C/Fortran
2. **科学计算友好**：原生支持 Unicode 变量名（可以写 `α = 0.5`）、多重分派、内置线性代数
3. **包管理出色**：Pkg 是语言内置的包管理器，依赖解析可靠
4. **可复现性**：`Project.toml` + `Manifest.toml` 精确锁定所有依赖版本
5. **调用方便**：可以直接调用 C、Fortran、Python 的代码

### 在哪些领域常见

- 微分方程数值求解（DifferentialEquations.jl 是标杆级别的库）
- 科学机器学习（SciML 生态）
- 优化问题（JuMP.jl）
- 量子计算模拟（ITensors.jl 用于张量网络）

## 18.2 安装 Julia

### 推荐方式：juliaup

`juliaup` 是官方推荐的 Julia 版本管理器，类似于 Python 的 `pyenv`。

```bash
# macOS / Linux / WSL
curl -fsSL https://install.julialang.org | sh

# Windows (PowerShell)
winget install Julia.Juliaup

# 验证
julia --version
```

### 手动安装

如果你不想用 juliaup，可以从官网下载：

```bash
# 访问 https://julialang.org/downloads/ 下载对应平台的安装包

# Linux 手动安装示例
wget https://julialang-s3.julialang.org/bin/linux/x64/1.11/julia-1.11.3-linux-x86_64.tar.gz
tar xzf julia-1.11.3-linux-x86_64.tar.gz
sudo ln -s $(pwd)/julia-1.11.3/bin/julia /usr/local/bin/julia
```

:::tip 版本选择
建议使用最新的稳定版（LTS 或 Current Stable）。截至 2026 年初，推荐 Julia 1.11.x 或更新版本。
:::

## 18.3 Pkg 包管理器

Julia 内置了强大的包管理器 Pkg。在 REPL 中按 `]` 键进入 Pkg 模式。

### REPL 基本操作

```
$ julia
               _
   _       _ _(_)_     |  Documentation: https://docs.julialang.org
  (_)     | (_) (_)    |
   _ _   _| |_  __ _   |  Type "?" for help, "]" for Pkg mode
  | | | | | | |/ _` |  |
  | | |_| | | | (_| |  |  Version 1.11.3
 _/ |\__'_|_|_|\__'_|  |
|__/                    |

julia> 1 + 1
2

julia> sqrt(2)
1.4142135623730951
```

### Pkg 模式

```julia
# 按 ] 进入 Pkg 模式
(@v1.11) pkg> add LinearAlgebra    # 安装包
(@v1.11) pkg> status               # 查看已安装的包
(@v1.11) pkg> update               # 更新所有包
(@v1.11) pkg> remove SomePackage   # 卸载包
# 按 Backspace 退出 Pkg 模式
```

### 在代码中使用 Pkg

```julia
using Pkg
Pkg.add("Plots")
Pkg.add("DifferentialEquations")
```

## 18.4 环境与 Project.toml

Julia 的环境系统解决了"依赖地狱"问题，类似于 Python 的虚拟环境但更加自然。

### 创建项目环境

```bash
mkdir my_project && cd my_project
julia --project=.
```

```julia
# 在 Pkg 模式下
(@v1.11) pkg> activate .       # 激活当前目录为项目环境
(my_project) pkg> add Plots    # 安装包到当前环境
(my_project) pkg> status       # 查看环境中的包
```

这会在项目目录下生成两个文件：

| 文件 | 作用 | 是否提交到 Git |
|------|------|---------------|
| `Project.toml` | 声明直接依赖和版本范围 | 是 |
| `Manifest.toml` | 锁定所有依赖的精确版本 | 推荐是 |

### Project.toml 示例

```toml
[deps]
DifferentialEquations = "0c46a032-eb83-5123-abaf-570d42b7caa7"
Plots = "91a5bcdd-55d7-5caf-9e0b-520d859cae80"

[compat]
julia = "1.9"
```

:::tip 可复现的研究
将 `Project.toml` 和 `Manifest.toml` 都提交到 Git。其他人克隆你的项目后，只需运行 `julia --project=. -e 'using Pkg; Pkg.instantiate()'` 即可重建完全相同的环境。这比 Python 的 `requirements.txt` 可靠得多。
:::

## 18.5 常用科学计算包

| 包名 | 功能 | Python 对应 |
|------|------|------------|
| `LinearAlgebra` | 线性代数（标准库） | `numpy.linalg` |
| `DifferentialEquations.jl` | ODE/PDE 求解器 | `scipy.integrate` |
| `Plots.jl` | 绘图 | `matplotlib` |
| `DataFrames.jl` | 数据框操作 | `pandas` |
| `Optim.jl` | 数值优化 | `scipy.optimize` |
| `JuMP.jl` | 数学优化建模 | `PuLP` / `cvxpy` |
| `ITensors.jl` | 张量网络 | 无直接对应 |
| `Flux.jl` | 深度学习 | `PyTorch` |
| `CSV.jl` | CSV 文件读写 | `csv` / `pandas` |
| `StaticArrays.jl` | 高性能小数组 | 无直接对应 |

```julia
# 安装常用包
using Pkg
Pkg.add(["Plots", "DifferentialEquations", "LinearAlgebra"])
```

:::caution 首次编译时间
Julia 的包在首次使用时需要编译（称为"Time to First Plot"问题）。第一次 `using Plots` 可能需要等待 30 秒到几分钟。之后的调用会快很多。这是 Julia 的已知痛点，社区一直在优化。
:::

## 18.6 Julia 与 Python 的比较

| 方面 | Julia | Python |
|------|-------|--------|
| 性能 | 接近 C/Fortran | 纯 Python 很慢，依赖 NumPy 加速 |
| 学习曲线 | 中等（新概念如多重分派） | 低（语法简单直观） |
| 生态系统 | 快速增长但仍小于 Python | 极其丰富 |
| 首次运行延迟 | 较高（JIT 编译） | 几乎没有 |
| 包管理 | 优秀（Pkg 内置） | 复杂（pip/conda/poetry/uv） |
| 可复现性 | 优秀（Project.toml） | 需要额外工具 |
| 社区规模 | 较小但活跃 | 非常大 |
| 就业市场 | 较小 | 非常大 |
| 调用 C/Fortran | 原生支持，无需包装 | 需要 ctypes/cffi/Cython |
| 适合谁 | 性能敏感的数值计算 | 通用编程、数据科学、ML |

### 什么时候选 Julia

- 你的计算瓶颈在纯数值循环（不能简单向量化）
- 你需要求解复杂的微分方程（DifferentialEquations.jl 功能远超 SciPy）
- 你想要一种语言同时兼顾高性能和易读性
- 你的课题组已经在用 Julia

### 什么时候继续用 Python

- 你需要丰富的第三方库（数据处理、Web、ML 等）
- 你的计算用 NumPy 向量化就足够快
- 你不想花时间学新语言
- 你需要和很多人协作（Python 用户更多）

## 18.7 一个简单数值实验

### 矩阵特征值计算

```julia
# eigenvalue_demo.jl
using LinearAlgebra

# 创建一个随机对称矩阵
n = 5
A = rand(n, n)
A = A + A'  # 保证对称

# 计算特征值和特征向量
eigenvalues, eigenvectors = eigen(A)

println("矩阵 A:")
display(A)
println("\n特征值:")
for (i, λ) in enumerate(eigenvalues)
    println("  λ_$i = $λ")
end

# 验证: A * v = λ * v
v1 = eigenvectors[:, 1]
λ1 = eigenvalues[1]
residual = norm(A * v1 - λ1 * v1)
println("\n验证 |Av - λv| = $residual")
```

运行：

```bash
julia eigenvalue_demo.jl
```

### 求解常微分方程

```julia
# ode_demo.jl
using DifferentialEquations
using Plots

# 定义简谐振子: x'' + ω²x = 0
# 改写为一阶系统: u₁' = u₂, u₂' = -ω²u₁
function harmonic!(du, u, p, t)
    ω = p[1]
    du[1] = u[2]         # dx/dt = v
    du[2] = -ω^2 * u[1]  # dv/dt = -ω²x
end

# 初始条件: x(0) = 1, v(0) = 0
u0 = [1.0, 0.0]
ω = 2π
tspan = (0.0, 3.0)
p = [ω]

# 求解
prob = ODEProblem(harmonic!, u0, tspan, p)
sol = solve(prob)

# 绘图
plot(sol, label=["x(t)" "v(t)"],
     xlabel="t", ylabel="amplitude",
     title="Simple Harmonic Oscillator")
savefig("harmonic_oscillator.png")
println("图已保存为 harmonic_oscillator.png")
```

运行：

```bash
julia --project=. ode_demo.jl
```

### 性能对比小实验

```julia
# performance_demo.jl

# Julia 版本：朴素循环求和
function my_sum(arr)
    s = 0.0
    for x in arr
        s += x
    end
    return s
end

arr = rand(10_000_000)

# 预热（触发 JIT 编译）
my_sum(arr)

# 计时
@time result = my_sum(arr)
println("Sum = $result")
```

```python
# 对比：Python 版本
import time
import random

arr = [random.random() for _ in range(10_000_000)]

start = time.time()
result = sum(arr)
elapsed = time.time() - start

print(f"Sum = {result}")
print(f"Time: {elapsed:.3f} seconds")
```

:::info 典型结果
在同一台机器上，Julia 的朴素循环通常比 Python 的朴素循环快 **50-100 倍**，与 NumPy 的 `np.sum()` 性能相当。Julia 的优势在于：即使不用向量化，纯循环也很快。
:::

## 常见问题

**Q: Julia 能取代 Python 吗？**

A: 短期内不会。Python 的生态系统太庞大了。但在纯数值计算领域，Julia 有明显优势。很多研究者的策略是：数据处理用 Python，核心计算用 Julia（或 C/Fortran）。

**Q: Julia 的包质量如何？**

A: 核心科学计算包（LinearAlgebra, DifferentialEquations, Optim 等）质量非常高。但在一些边缘领域，包的数量和成熟度不如 Python。

**Q: 我应该先学 Python 还是 Julia？**

A: 建议先学 Python。Python 更通用，社区更大，学习资源更多。等你遇到 Python 性能瓶颈时，再考虑 Julia。

**Q: Julia 代码第一次运行为什么这么慢？**

A: 这是 JIT 编译的开销。Julia 在第一次调用函数时才编译它。可以使用 `PrecompileTools.jl` 或打包成 sysimage 来缓解。

## 小结

- Julia 在科学计算领域提供了"Python 的易用性 + C 的性能"
- 使用 `juliaup` 安装和管理 Julia 版本
- Pkg 包管理器和 `Project.toml` 提供了出色的依赖管理
- Julia 特别适合性能敏感的数值计算和微分方程求解
- 不需要在 Python 和 Julia 之间"二选一"，可以按需使用

## 练习

1. 安装 Julia，在 REPL 中计算 `sqrt(2)`、`exp(1)`、`pi` 的值
2. 创建一个新的项目环境，安装 `Plots` 包，画一个 sin(x) 函数图
3. 运行矩阵特征值计算示例，将矩阵大小改为 100x100
4. （可选）安装 `DifferentialEquations.jl`，求解阻尼振子 x'' + γx' + ω²x = 0
5. （可选）写一个 Julia 程序计算 Pi（蒙特卡洛方法），与 Python 版本比较性能

[上一章：高性能数值库 →](../17-hpc-libraries/index.md) | [下一章：AI 辅助编程 →](../19-ai-coding/index.md)
