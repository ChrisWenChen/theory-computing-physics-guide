---
sidebar_position: 12
sidebar_label: "12. Python Environment"
---

# Chapter 12: Python and Virtual Environments

## Chapter Goals

- Understand why Python is the language of choice for researchers
- Install Python correctly on macOS, Ubuntu, and Windows
- Master the differences and use cases of pip, venv, conda, and uv
- Learn to create and manage virtual environments, following the **one project, one environment** principle
- Install common scientific computing packages and configure a Jupyter environment
- Understand cross-platform differences and common pitfalls

## Motivation

In physics research, Python is ubiquitous — from data processing to numerical simulations. However, many beginners stumble at the very first step of "installing Python" — system version conflicts, dependency chaos, and different projects requiring different versions. This chapter will help you establish a clean, reproducible Python development environment once and for all.

---

## 12.1 Why Python Is the Top Language for Research

| Advantage | Description |
|-----------|-------------|
| Clean syntax | Close to pseudocode, low learning curve |
| Rich ecosystem | NumPy, SciPy, Matplotlib, SymPy, etc. cover the vast majority of research needs |
| Glue language | Can call C/Fortran libraries, balancing development efficiency and runtime performance |
| Large community | Abundant resources on Stack Overflow and GitHub |
| Jupyter ecosystem | Supports interactive exploration, convenient for writing lab reports |
| Free and open source | No licensing costs like MATLAB |

:::tip
Python is not the fastest language, but it is **the fastest language from idea to result**. In research, development efficiency often matters more than runtime efficiency.
:::

---

## 12.2 Installing Python (macOS / Ubuntu / Windows)

### macOS

```bash
# Recommended: install via Homebrew
brew install python@3.12

# Verify
python3 --version
```

:::caution
The Python bundled with macOS is a dependency for system tools — **do not use it for research development**. Always install a separate version through Homebrew or pyenv.
:::

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Verify
python3 --version
pip3 --version
```

### Windows

The recommended way is to use winget:

```powershell
winget install Python.Python.3.12

# Verify
python --version
pip --version
```

You can also download the graphical installer from [python.org](https://www.python.org/downloads/) — make sure to check **"Add Python to PATH"** during installation.

:::info
On Windows, it is recommended to use **Git Bash** or **WSL** as your terminal for a command-line experience consistent with Linux/macOS.
:::

---

## 12.3 Differences Between pip, venv, conda, and uv

| Tool | Type | Features | Use Case |
|------|------|----------|----------|
| **pip** | Package manager | Bundled with Python, installs from PyPI | Fundamental tool for all scenarios |
| **venv** | Virtual environment | Built-in Python module, lightweight | Pure Python projects |
| **conda** | Package + environment manager | Can manage non-Python dependencies (e.g., MKL, CUDA) | Scientific computing with complex C/Fortran dependencies |
| **uv** | Package + environment manager | Written in Rust, extremely fast, pip-compatible | Speed-oriented, modern Python workflows |

```text
pip   → Manages Python packages only
venv  → Manages isolated environments only
conda → Packages + environments + non-Python dependencies, all-in-one
uv    → Similar to pip + venv, but 10-100x faster
```

:::tip
**Recommended strategy**: For most research projects, `venv + pip` is sufficient. If you need GPU computing (CUDA) or specialized compiled libraries, consider `conda`. If you want a modern workflow and speed, try `uv`.
:::

---

## 12.4 Creating and Activating Virtual Environments

### Core Principle: One Project, One Environment

Each project should use an independent virtual environment to avoid dependency conflicts between projects.

### Using venv

```bash
# Create a virtual environment
python3 -m venv .venv

# Activate (macOS / Linux)
source .venv/bin/activate

# Activate (Windows Git Bash)
source .venv/Scripts/activate

# Activate (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Deactivate
deactivate
```

### Using conda

```bash
# Create an environment
conda create -n myproject python=3.12

# Activate
conda activate myproject

# Deactivate
conda deactivate
```

### Using uv

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create a project and initialize the environment
uv init myproject
cd myproject
uv venv

# Activate (same as venv)
source .venv/bin/activate

# Install packages (extremely fast)
uv pip install numpy scipy matplotlib
```

:::caution
Never run `pip install` directly in the system Python. This pollutes the global environment and leads to hard-to-diagnose dependency conflicts.
:::

---

## 12.5 Installing Common Scientific Computing Packages

```bash
# After activating the virtual environment
pip install numpy scipy matplotlib sympy pandas jupyter

# Or install everything at once
pip install numpy scipy matplotlib sympy pandas jupyterlab ipython
```

| Package | Purpose |
|---------|---------|
| `numpy` | Array operations, linear algebra |
| `scipy` | Numerical integration, ODEs, optimization, signal processing |
| `matplotlib` | Plotting |
| `sympy` | Symbolic computation |
| `pandas` | Tabular data processing |
| `jupyter` / `jupyterlab` | Interactive notebooks |
| `ipython` | Enhanced interactive shell |
| `h5py` | HDF5 data format I/O |

---

## 12.6 requirements.txt / pyproject.toml

### requirements.txt (Traditional Approach)

```bash
# Export current environment dependencies
pip freeze > requirements.txt

# Install from file
pip install -r requirements.txt
```

`requirements.txt` example:

```text
numpy==1.26.4
scipy==1.13.0
matplotlib==3.9.0
jupyterlab>=4.0
```

### pyproject.toml (Modern Approach)

```toml
[project]
name = "my-physics-project"
version = "0.1.0"
requires-python = ">=3.10"
dependencies = [
    "numpy>=1.26",
    "scipy>=1.13",
    "matplotlib>=3.9",
]

[project.optional-dependencies]
dev = ["pytest", "ruff"]
jupyter = ["jupyterlab>=4.0"]
```

```bash
# Install with pip
pip install -e .

# Install with uv
uv pip install -e ".[dev,jupyter]"
```

:::tip
For new projects, `pyproject.toml` is recommended. It is the officially recommended project configuration format for Python and is more structured than `requirements.txt`.
:::

---

## 12.7 Jupyter Notebook and JupyterLab

### Installation and Launch

```bash
pip install jupyterlab

# Launch JupyterLab
jupyter lab

# Or the classic Notebook
jupyter notebook
```

### Registering a Kernel in a Virtual Environment

```bash
# Install ipykernel in the virtual environment
pip install ipykernel

# Register the current environment as a Jupyter kernel
python -m ipykernel install --user --name=myproject --display-name="My Project (Python 3.12)"
```

### Using in VS Code

1. Install the **Jupyter** extension for VS Code
2. Open a `.ipynb` file
3. Select the kernel in the upper right corner and choose your virtual environment

:::info
VS Code's Jupyter support is now very mature, and many people no longer need to use JupyterLab in the browser. However, JupyterLab is still very useful on remote servers (see the SSH chapter).
:::

### Notebook Tips

```python
# Use magic commands at the beginning of a cell
%timeit np.dot(a, b)          # Measure execution time
%matplotlib inline             # Inline plotting
%%writefile script.py          # Write cell contents to a file
```

---

## 12.8 Basic Debugging and Error Handling

### Common Error Types

```python
# ImportError — package not installed or wrong environment
import numpy  # ModuleNotFoundError: No module named 'numpy'
# Solution: confirm the virtual environment is activated, pip install numpy

# SyntaxError — syntax error
print("hello"  # SyntaxError: unexpected EOF
# Solution: check that parentheses and quotes are matched

# IndexError — index out of range
a = [1, 2, 3]
a[5]  # IndexError: list index out of range

# TypeError — type mismatch
"hello" + 5  # TypeError
```

### Using pdb for Debugging

pdb (Python DeBugger) is Python's built-in interactive debugger. It pauses your program at a specified point, allowing you to step through code line by line, inspect variable values, and examine the call stack.

```python
# Insert a breakpoint in your code
import pdb; pdb.set_trace()

# More concise syntax for Python 3.7+
breakpoint()
```

When the program reaches the breakpoint, it pauses and enters interactive mode. Common commands:

| Command | Function |
|---------|----------|
| `n` (next) | Execute next line |
| `s` (step) | Step into a function |
| `c` (continue) | Continue to next breakpoint |
| `p x` (print) | Print the value of variable `x` |
| `l` (list) | Show surrounding code context |
| `q` (quit) | Exit the debugger |

```python
# Example: debugging a function with unexpected results
import numpy as np

def total_energy(positions, velocities, masses):
    breakpoint()  # Program pauses here
    kinetic = 0.5 * masses * velocities**2
    potential = -1.0 / np.linalg.norm(positions, axis=1)
    return np.sum(kinetic + potential)

# In the pdb interactive mode:
# (Pdb) p positions.shape    ← check array shape
# (Pdb) p masses             ← inspect variable value
# (Pdb) n                    ← execute next line
```

### Using print for Debugging (Simple but Effective)

```python
import numpy as np

def compute_energy(positions, masses):
    print(f"positions shape: {positions.shape}")  # Debug
    print(f"masses shape: {masses.shape}")          # Debug
    # ...
```

:::tip
For research code, `print` debugging is often sufficient. But for complex projects, learning to use VS Code's breakpoint debugging features will greatly improve your efficiency.
:::

---

## 12.9 Cross-Platform Considerations

| Issue | macOS | Linux | Windows |
|-------|-------|-------|---------|
| Python command | `python3` | `python3` | `python` |
| Path separator | `/` | `/` | `\` (use `/` or `pathlib` instead) |
| Activating venv | `source .venv/bin/activate` | Same as macOS | `.venv\Scripts\activate` |
| Line endings | LF | LF | CRLF (mind your `.gitattributes`) |
| Compiling extensions | Requires Xcode CLI tools | Requires `build-essential` | Requires Visual Studio Build Tools |

```python
# Cross-platform path handling
from pathlib import Path

data_dir = Path.home() / "research" / "data"
output_file = data_dir / "results.csv"
```

:::caution
On Windows, avoid placing projects in directories with Chinese characters or spaces in the path (e.g., `C:\Users\Zhang San\My Project`), as this can cause certain tools to fail.
:::

---

## FAQ

**Q: Should I use Anaconda or Miniconda?**
A: **Miniconda** is recommended. Anaconda comes pre-installed with many packages you may never use, taking up several GB of space. Miniconda is the minimal installation — add packages as needed.

**Q: What should I do if pip install gives a permission error?**
A: Do not use `sudo pip install`. Make sure you have activated your virtual environment.

**Q: What if my environment is messed up?**
A: Delete the `.venv` directory and recreate it. This is the advantage of virtual environments — they can be rebuilt at any time.

**Q: Can I mix conda and pip?**
A: Yes, but with caution. In a conda environment, first use `conda install` for packages available through conda, then use `pip install` for the rest.

---

## Summary

- When installing Python, avoid using the system-bundled version; install via a package manager or pyenv
- **Always use virtual environments** — one project, one environment
- `venv + pip` works for most scenarios; `conda` is suited for complex dependencies; `uv` prioritizes speed
- Use `requirements.txt` or `pyproject.toml` to record dependencies for reproducibility
- Jupyter is a powerful tool for research exploration, but production code should be written as `.py` scripts

---

## Exercises

1. **Basics**: Install Python 3.12 on your system, create a virtual environment, install NumPy, and verify that `import numpy` succeeds
2. **Environment Management**: Create two virtual environments for two different "projects," install different versions of NumPy in each, and verify they do not interfere with each other
3. **Dependency Recording**: Install several packages in a project, export `requirements.txt`, delete the environment, and rebuild it from that file
4. **Jupyter**: Install JupyterLab, create a notebook, and plot `y = sin(x)`
5. **Advanced**: Try using `uv` as a replacement for `pip + venv` and compare the installation speed difference
