---
sidebar_position: 12
sidebar_label: "12. Python 与虚拟环境"
---

# 第 12 章：Python 与虚拟环境

## 本章目标

- 理解为什么 Python 是科研工作者的首选语言
- 在 macOS、Ubuntu、Windows 上正确安装 Python
- 掌握 pip、venv、conda、uv 的区别与使用场景
- 学会创建和管理虚拟环境，践行 **one project, one environment** 原则
- 安装常用科学计算包并配置 Jupyter 环境
- 了解跨平台差异与常见陷阱

## 动机

物理科研中，从数据处理到数值模拟，Python 几乎无处不在。然而，许多初学者在"装 Python"这一步就踩坑——系统自带版本冲突、包依赖混乱、不同项目需要不同版本。本章将帮助你一次性建立干净、可复现的 Python 开发环境。

---

## 12.1 为什么 Python 是科研第一语言

| 优势 | 说明 |
|------|------|
| 语法简洁 | 接近伪代码，学习曲线低 |
| 生态丰富 | NumPy、SciPy、Matplotlib、SymPy 等覆盖绝大多数科研需求 |
| 胶水语言 | 可调用 C/Fortran 库，兼顾开发效率和运行性能 |
| 社区庞大 | Stack Overflow、GitHub 上资源极多 |
| Jupyter 生态 | 支持交互式探索，方便写实验报告 |
| 免费开源 | 没有 MATLAB 的授权费用问题 |

:::tip
Python 不是最快的语言，但它是**从想法到结果最快的语言**。科研中，开发效率往往比运行效率更重要。
:::

---

## 12.2 安装 Python (macOS / Ubuntu / Windows)

### macOS

```bash
# 推荐使用 Homebrew 安装
brew install python@3.12

# 验证
python3 --version
```

:::caution
macOS 自带的 Python 是系统工具依赖的版本，**不要用它做科研开发**。始终通过 Homebrew 或 pyenv 安装独立版本。
:::

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv

# 验证
python3 --version
pip3 --version
```

### Windows

1. 从 [python.org](https://www.python.org/downloads/) 下载安装包
2. **勾选 "Add Python to PATH"**（非常重要）
3. 选择 "Customize installation"，确保 pip 和 venv 被勾选

```powershell
# 验证（PowerShell 或 Git Bash）
python --version
pip --version
```

:::info
Windows 上推荐使用 **Git Bash** 或 **WSL** 作为终端，以获得与 Linux/macOS 一致的命令体验。
:::

---

## 12.3 pip、venv、conda、uv 的区别

| 工具 | 类型 | 特点 | 适用场景 |
|------|------|------|----------|
| **pip** | 包管理器 | Python 自带，从 PyPI 安装包 | 所有场景的基础工具 |
| **venv** | 虚拟环境 | Python 内置模块，轻量 | 纯 Python 项目 |
| **conda** | 包管理 + 环境管理 | 可管理非 Python 依赖（如 MKL、CUDA） | 需要复杂 C/Fortran 依赖的科学计算 |
| **uv** | 包管理 + 环境管理 | Rust 编写，极快，pip 兼容 | 追求速度，现代 Python 工作流 |

```text
pip   → 只管 Python 包
venv  → 只管隔离环境
conda → 包 + 环境 + 非 Python 依赖，一站式
uv    → 类似 pip + venv，但速度快 10-100 倍
```

:::tip
**推荐策略**：大多数科研项目用 `venv + pip` 即可。如果你需要 GPU 计算（CUDA）或特殊编译库，考虑 `conda`。如果你追求现代工作流和速度，试试 `uv`。
:::

---

## 12.4 创建和激活虚拟环境

### 核心原则：One Project, One Environment

每个项目使用独立的虚拟环境，避免不同项目的依赖冲突。

### 使用 venv

```bash
# 创建虚拟环境
python3 -m venv .venv

# 激活（macOS / Linux）
source .venv/bin/activate

# 激活（Windows Git Bash）
source .venv/Scripts/activate

# 激活（Windows PowerShell）
.venv\Scripts\Activate.ps1

# 停用
deactivate
```

### 使用 conda

```bash
# 创建环境
conda create -n myproject python=3.12

# 激活
conda activate myproject

# 停用
conda deactivate
```

### 使用 uv

```bash
# 安装 uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 创建项目并初始化环境
uv init myproject
cd myproject
uv venv

# 激活（与 venv 相同）
source .venv/bin/activate

# 安装包（极快）
uv pip install numpy scipy matplotlib
```

:::caution
永远不要在系统 Python 中直接 `pip install`。这会污染全局环境，导致难以排查的依赖冲突。
:::

---

## 12.5 安装常用科学计算包

```bash
# 激活虚拟环境后
pip install numpy scipy matplotlib sympy pandas jupyter

# 或一次性安装
pip install numpy scipy matplotlib sympy pandas jupyterlab ipython
```

| 包 | 用途 |
|---|------|
| `numpy` | 数组运算、线性代数 |
| `scipy` | 数值积分、ODE、优化、信号处理 |
| `matplotlib` | 绘图 |
| `sympy` | 符号计算 |
| `pandas` | 数据表格处理 |
| `jupyter` / `jupyterlab` | 交互式 notebook |
| `ipython` | 增强交互式 shell |
| `h5py` | HDF5 数据格式读写 |

---

## 12.6 requirements.txt / pyproject.toml

### requirements.txt（传统方式）

```bash
# 导出当前环境依赖
pip freeze > requirements.txt

# 从文件安装
pip install -r requirements.txt
```

`requirements.txt` 示例：

```text
numpy==1.26.4
scipy==1.13.0
matplotlib==3.9.0
jupyterlab>=4.0
```

### pyproject.toml（现代方式）

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
# 使用 pip 安装
pip install -e .

# 使用 uv 安装
uv pip install -e ".[dev,jupyter]"
```

:::tip
新项目推荐使用 `pyproject.toml`，它是 Python 官方推荐的项目配置格式，比 `requirements.txt` 更结构化。
:::

---

## 12.7 Jupyter Notebook 与 JupyterLab

### 安装与启动

```bash
pip install jupyterlab

# 启动 JupyterLab
jupyter lab

# 或传统 Notebook
jupyter notebook
```

### 在虚拟环境中注册 kernel

```bash
# 在虚拟环境中安装 ipykernel
pip install ipykernel

# 将当前环境注册为 Jupyter kernel
python -m ipykernel install --user --name=myproject --display-name="My Project (Python 3.12)"
```

### 在 VS Code 中使用

1. 安装 VS Code 的 **Jupyter** 扩展
2. 打开 `.ipynb` 文件
3. 右上角选择 kernel → 选择你的虚拟环境

:::info
VS Code 的 Jupyter 支持已经非常成熟，很多人不再需要在浏览器中使用 JupyterLab。但 JupyterLab 在远程服务器上仍然非常有用（见 SSH 章节）。
:::

### Notebook 使用技巧

```python
# 在 cell 开头使用 magic command
%timeit np.dot(a, b)          # 测量运行时间
%matplotlib inline             # 内嵌绘图
%%writefile script.py          # 将 cell 内容写入文件
```

---

## 12.8 基本调试与错误处理

### 常见错误类型

```python
# ImportError — 包没装或环境不对
import numpy  # ModuleNotFoundError: No module named 'numpy'
# 解决：确认虚拟环境已激活，pip install numpy

# SyntaxError — 语法错误
print("hello"  # SyntaxError: unexpected EOF
# 解决：检查括号、引号是否配对

# IndexError — 索引越界
a = [1, 2, 3]
a[5]  # IndexError: list index out of range

# TypeError — 类型不匹配
"hello" + 5  # TypeError
```

### 使用 pdb 调试

pdb（Python DeBugger）是 Python 内置的交互式调试器。它可以让程序暂停在指定位置，然后你可以逐行执行代码、查看变量值、检查调用栈。

```python
# 在代码中插入断点
import pdb; pdb.set_trace()

# Python 3.7+ 更简洁的写法
breakpoint()
```

程序运行到断点处会暂停，进入交互模式。常用命令：

| 命令 | 功能 |
|------|------|
| `n` (next) | 执行下一行 |
| `s` (step) | 进入函数内部 |
| `c` (continue) | 继续运行到下一个断点 |
| `p x` (print) | 打印变量 `x` 的值 |
| `l` (list) | 显示当前代码上下文 |
| `q` (quit) | 退出调试器 |

```python
# 示例：调试一个计算出错的函数
import numpy as np

def total_energy(positions, velocities, masses):
    breakpoint()  # 程序会在这里暂停
    kinetic = 0.5 * masses * velocities**2
    potential = -1.0 / np.linalg.norm(positions, axis=1)
    return np.sum(kinetic + potential)

# 运行后在 pdb 交互模式中：
# (Pdb) p positions.shape    ← 查看数组形状
# (Pdb) p masses             ← 查看变量值
# (Pdb) n                    ← 执行下一行
```

### 使用 print 调试（最朴素但有效）

```python
import numpy as np

def compute_energy(positions, masses):
    print(f"positions shape: {positions.shape}")  # 调试
    print(f"masses shape: {masses.shape}")          # 调试
    # ...
```

:::tip
对于科研代码，`print` 调试往往够用。但对于复杂项目，学会使用 VS Code 的断点调试功能会极大提升效率。
:::

---

## 12.9 平台差异注意事项

| 问题 | macOS | Linux | Windows |
|------|-------|-------|---------|
| Python 命令 | `python3` | `python3` | `python` |
| 路径分隔符 | `/` | `/` | `\`（建议用 `/` 或 `pathlib`） |
| 激活 venv | `source .venv/bin/activate` | 同 macOS | `.venv\Scripts\activate` |
| 行尾符 | LF | LF | CRLF（注意 `.gitattributes`） |
| 编译扩展 | 需要 Xcode CLI tools | 需要 `build-essential` | 需要 Visual Studio Build Tools |

```python
# 跨平台路径处理
from pathlib import Path

data_dir = Path.home() / "research" / "data"
output_file = data_dir / "results.csv"
```

:::caution
在 Windows 上，避免将项目放在路径中含中文或空格的目录下（如 `C:\Users\张三\我的项目`），这会导致某些工具出错。
:::

---

## 常见问题

**Q: 我应该用 Anaconda 还是 Miniconda？**
A: 推荐 **Miniconda**。Anaconda 预装了大量你可能用不到的包，占用数 GB 空间。Miniconda 是最小安装，按需添加。

**Q: pip install 报权限错误怎么办？**
A: 不要用 `sudo pip install`。确认你已经激活了虚拟环境。

**Q: 环境搞乱了怎么办？**
A: 删除 `.venv` 目录，重新创建即可。这就是虚拟环境的优势——可以随时重建。

**Q: conda 和 pip 能混用吗？**
A: 可以但需谨慎。在 conda 环境中，先用 `conda install` 安装能找到的包，再用 `pip install` 安装剩余的。

---

## 小结

- 安装 Python 时避免使用系统自带版本，通过包管理器或 pyenv 安装
- **始终使用虚拟环境**，做到 one project, one environment
- `venv + pip` 适用于大多数场景，`conda` 适合复杂依赖，`uv` 追求速度
- 用 `requirements.txt` 或 `pyproject.toml` 记录依赖，确保可复现
- Jupyter 是科研探索的利器，但正式代码应写成 `.py` 脚本

---

## 练习

1. **基础**：在你的系统上安装 Python 3.12，创建一个虚拟环境，安装 NumPy，验证 `import numpy` 成功
2. **环境管理**：为两个不同的"项目"创建两个虚拟环境，分别安装不同版本的 NumPy，验证它们互不影响
3. **依赖记录**：在一个项目中安装若干包，导出 `requirements.txt`，删除环境后用该文件重建环境
4. **Jupyter**：安装 JupyterLab，创建一个 notebook，绘制 `y = sin(x)` 的图像
5. **进阶**：尝试使用 `uv` 替代 `pip + venv`，对比安装速度的差异
