---
sidebar_position: 18
sidebar_label: "18. Julia Programming"
---

# Chapter 18: Julia and Package Management

> "Walks like Python, runs like C."

## Chapter Goals

After reading this chapter, you should be able to:

- Understand Julia's position and advantages in scientific computing
- Install Julia on your platform
- Use the Julia REPL and Pkg package manager
- Create and manage Julia project environments
- Complete a simple numerical experiment with Julia
- Make a rational comparison between Julia and Python

## Motivation

Python is the most popular language for scientific computing, but it has a fundamental weakness: **it's slow**. Pure Python for loops are over 100x slower than C/Fortran. Although NumPy partially solves this by calling underlying C libraries, once your algorithm cannot be expressed via vectorization, performance drops dramatically.

Julia aims to solve this "two-language problem": you can use syntax close to Python and get performance close to C. For computational physics researchers, this is an option worth knowing about.

:::info Julia Is Not Required
This tutorial does not require you to master Julia. If you are working well with Python + NumPy, you can skip this chapter entirely. But if you are interested in performance-sensitive numerical computing, Julia is worth trying.
:::

## 18.1 Why Some Researchers Use Julia

### Julia's Core Advantages

1. **High performance**: Through LLVM JIT compilation, Julia code performance approaches C/Fortran
2. **Scientific computing friendly**: Native Unicode variable names (you can write `α = 0.5`), multiple dispatch, built-in linear algebra
3. **Excellent package management**: Pkg is a language-built-in package manager with reliable dependency resolution
4. **Reproducibility**: `Project.toml` + `Manifest.toml` precisely lock all dependency versions
5. **Easy interop**: Can directly call C, Fortran, and Python code

### Where It's Commonly Used

- Numerical ODE solving (DifferentialEquations.jl is a benchmark-level library)
- Scientific machine learning (SciML ecosystem)
- Optimization problems (JuMP.jl)
- Quantum computing simulation (ITensors.jl for tensor networks)

## 18.2 Installing Julia

### Recommended Method: juliaup

`juliaup` is the officially recommended Julia version manager, similar to Python's `pyenv`.

```bash
# macOS / Linux / WSL
curl -fsSL https://install.julialang.org | sh

# Windows (PowerShell)
winget install Julia.Juliaup

# Verify
julia --version
```

### Manual Installation

If you don't want to use juliaup, you can download from the official website:

```bash
# Visit https://julialang.org/downloads/ and download the package for your platform

# Linux manual installation example
wget https://julialang-s3.julialang.org/bin/linux/x64/1.11/julia-1.11.3-linux-x86_64.tar.gz
tar xzf julia-1.11.3-linux-x86_64.tar.gz
sudo ln -s $(pwd)/julia-1.11.3/bin/julia /usr/local/bin/julia
```

:::tip Version Selection
It's recommended to use the latest stable version (LTS or Current Stable). As of early 2026, Julia 1.11.x or newer is recommended.
:::

## 18.3 Pkg Package Manager

Julia has a powerful built-in package manager called Pkg. Press `]` in the REPL to enter Pkg mode.

### Basic REPL Operations

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

### Pkg Mode

```julia
# Press ] to enter Pkg mode
(@v1.11) pkg> add LinearAlgebra    # Install a package
(@v1.11) pkg> status               # View installed packages
(@v1.11) pkg> update               # Update all packages
(@v1.11) pkg> remove SomePackage   # Uninstall a package
# Press Backspace to exit Pkg mode
```

### Using Pkg in Code

```julia
using Pkg
Pkg.add("Plots")
Pkg.add("DifferentialEquations")
```

## 18.4 Environments and Project.toml

Julia's environment system solves the "dependency hell" problem, similar to Python virtual environments but more natural.

### Creating a Project Environment

```bash
mkdir my_project && cd my_project
julia --project=.
```

```julia
# In Pkg mode
(@v1.11) pkg> activate .       # Activate current directory as project environment
(my_project) pkg> add Plots    # Install package to current environment
(my_project) pkg> status       # View packages in the environment
```

This generates two files in the project directory:

| File | Purpose | Commit to Git? |
|------|---------|----------------|
| `Project.toml` | Declares direct dependencies and version ranges | Yes |
| `Manifest.toml` | Locks exact versions of all dependencies | Recommended yes |

### Project.toml Example

```toml
[deps]
DifferentialEquations = "0c46a032-eb83-5123-abaf-570d42b7caa7"
Plots = "91a5bcdd-55d7-5caf-9e0b-520d859cae80"

[compat]
julia = "1.9"
```

:::tip Reproducible Research
Commit both `Project.toml` and `Manifest.toml` to Git. Others can clone your project and run `julia --project=. -e 'using Pkg; Pkg.instantiate()'` to rebuild the exact same environment. This is much more reliable than Python's `requirements.txt`.
:::

## 18.5 Common Scientific Computing Packages

| Package | Functionality | Python Equivalent |
|---------|---------------|-------------------|
| `LinearAlgebra` | Linear algebra (standard library) | `numpy.linalg` |
| `DifferentialEquations.jl` | ODE/PDE solvers | `scipy.integrate` |
| `Plots.jl` | Plotting | `matplotlib` |
| `DataFrames.jl` | Data frame operations | `pandas` |
| `Optim.jl` | Numerical optimization | `scipy.optimize` |
| `JuMP.jl` | Mathematical optimization modeling | `PuLP` / `cvxpy` |
| `ITensors.jl` | Tensor networks | No direct equivalent |
| `Flux.jl` | Deep learning | `PyTorch` |
| `CSV.jl` | CSV file I/O | `csv` / `pandas` |
| `StaticArrays.jl` | High-performance small arrays | No direct equivalent |

```julia
# Install common packages
using Pkg
Pkg.add(["Plots", "DifferentialEquations", "LinearAlgebra"])
```

:::caution First Compilation Time
Julia packages need to be compiled on first use (known as the "Time to First Plot" problem). The first `using Plots` may take 30 seconds to several minutes. Subsequent calls will be much faster. This is a known pain point of Julia that the community is continuously optimizing.
:::

## 18.6 Julia vs Python Comparison

| Aspect | Julia | Python |
|--------|-------|--------|
| Performance | Close to C/Fortran | Pure Python is very slow, relies on NumPy for acceleration |
| Learning curve | Moderate (new concepts like multiple dispatch) | Low (simple and intuitive syntax) |
| Ecosystem | Growing rapidly but still smaller than Python | Extremely rich |
| First-run latency | Higher (JIT compilation) | Almost none |
| Package management | Excellent (Pkg built-in) | Complex (pip/conda/poetry/uv) |
| Reproducibility | Excellent (Project.toml) | Requires additional tools |
| Community size | Smaller but active | Very large |
| Job market | Smaller | Very large |
| Calling C/Fortran | Native support, no wrappers needed | Requires ctypes/cffi/Cython |
| Best suited for | Performance-sensitive numerical computing | General programming, data science, ML |

### When to Choose Julia

- Your computational bottleneck is in pure numerical loops (can't be easily vectorized)
- You need to solve complex differential equations (DifferentialEquations.jl far exceeds SciPy in features)
- You want a single language that combines high performance and readability
- Your research group is already using Julia

### When to Stick with Python

- You need a rich ecosystem of third-party libraries (data processing, web, ML, etc.)
- Your computations are fast enough with NumPy vectorization
- You don't want to spend time learning a new language
- You need to collaborate with many people (Python has more users)

## 18.7 A Simple Numerical Experiment

### Matrix Eigenvalue Computation

```julia
# eigenvalue_demo.jl
using LinearAlgebra

# Create a random symmetric matrix
n = 5
A = rand(n, n)
A = A + A'  # Ensure symmetry

# Compute eigenvalues and eigenvectors
eigenvalues, eigenvectors = eigen(A)

println("Matrix A:")
display(A)
println("\nEigenvalues:")
for (i, λ) in enumerate(eigenvalues)
    println("  λ_$i = $λ")
end

# Verify: A * v = λ * v
v1 = eigenvectors[:, 1]
λ1 = eigenvalues[1]
residual = norm(A * v1 - λ1 * v1)
println("\nVerification |Av - λv| = $residual")
```

Run:

```bash
julia eigenvalue_demo.jl
```

### Solving an ODE

```julia
# ode_demo.jl
using DifferentialEquations
using Plots

# Define simple harmonic oscillator: x'' + ω²x = 0
# Rewrite as first-order system: u₁' = u₂, u₂' = -ω²u₁
function harmonic!(du, u, p, t)
    ω = p[1]
    du[1] = u[2]         # dx/dt = v
    du[2] = -ω^2 * u[1]  # dv/dt = -ω²x
end

# Initial conditions: x(0) = 1, v(0) = 0
u0 = [1.0, 0.0]
ω = 2π
tspan = (0.0, 3.0)
p = [ω]

# Solve
prob = ODEProblem(harmonic!, u0, tspan, p)
sol = solve(prob)

# Plot
plot(sol, label=["x(t)" "v(t)"],
     xlabel="t", ylabel="amplitude",
     title="Simple Harmonic Oscillator")
savefig("harmonic_oscillator.png")
println("Figure saved as harmonic_oscillator.png")
```

Run:

```bash
julia --project=. ode_demo.jl
```

### Performance Comparison Experiment

```julia
# performance_demo.jl

# Julia version: naive loop summation
function my_sum(arr)
    s = 0.0
    for x in arr
        s += x
    end
    return s
end

arr = rand(10_000_000)

# Warm up (trigger JIT compilation)
my_sum(arr)

# Timing
@time result = my_sum(arr)
println("Sum = $result")
```

```python
# Comparison: Python version
import time
import random

arr = [random.random() for _ in range(10_000_000)]

start = time.time()
result = sum(arr)
elapsed = time.time() - start

print(f"Sum = {result}")
print(f"Time: {elapsed:.3f} seconds")
```

:::info Typical Results
On the same machine, Julia's naive loop is typically **50-100x faster** than Python's naive loop, and comparable to NumPy's `np.sum()`. Julia's advantage is that even without vectorization, pure loops are fast.
:::

## FAQ

**Q: Can Julia replace Python?**

A: Not in the short term. Python's ecosystem is too vast. However, in pure numerical computing, Julia has clear advantages. Many researchers' strategy is: use Python for data processing, and Julia (or C/Fortran) for core computations.

**Q: How is the quality of Julia packages?**

A: Core scientific computing packages (LinearAlgebra, DifferentialEquations, Optim, etc.) are of very high quality. However, in some niche areas, the number and maturity of packages are less than Python's.

**Q: Should I learn Python or Julia first?**

A: We recommend learning Python first. Python is more versatile, has a larger community, and more learning resources. Consider Julia when you hit Python performance bottlenecks.

**Q: Why is Julia code so slow on first run?**

A: This is the JIT compilation overhead. Julia compiles functions only when they are first called. You can use `PrecompileTools.jl` or package into a sysimage to mitigate this.

## Summary

- Julia provides "Python's ease of use + C's performance" for scientific computing
- Use `juliaup` to install and manage Julia versions
- The Pkg package manager and `Project.toml` provide excellent dependency management
- Julia is particularly well-suited for performance-sensitive numerical computing and differential equation solving
- You don't need to "choose between" Python and Julia — use each as needed

## Exercises

1. Install Julia and compute `sqrt(2)`, `exp(1)`, and `pi` in the REPL
2. Create a new project environment, install the `Plots` package, and draw a sin(x) function graph
3. Run the matrix eigenvalue computation example, changing the matrix size to 100x100
4. (Optional) Install `DifferentialEquations.jl` and solve a damped oscillator x'' + γx' + ω²x = 0
5. (Optional) Write a Julia program to compute Pi (Monte Carlo method) and compare performance with the Python version

[Previous chapter: High-Performance Numerical Libraries ->](../17-hpc-libraries/index.md) | [Next chapter: AI-Assisted Programming ->](../19-ai-coding/index.md)
