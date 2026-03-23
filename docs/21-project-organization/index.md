---
sidebar_position: 21
sidebar_label: "21. 如何组织计算物理项目"
---

# 第 21 章：如何组织一个计算物理项目

> 好的项目结构是可复现科研的基础。

## 本章目标

读完本章后，你应该能：

- 设计一个清晰、规范的计算物理项目目录结构
- 理解 `src/`、`include/`、`scripts/`、`docs/`、`data/`、`tests/` 各目录的职责
- 编写规范的配置文件和参数文件
- 管理计算的输入、输出和日志
- 满足科研可复现性的最小要求
- 使用项目模板快速启动新项目

## 动机

你是否遇到过这些情况？

- 文件夹里全是 `test1.py`、`test2_final.py`、`test2_final_v2.py`
- 半年后回来看自己的代码，完全不知道哪个是最终版本
- 导师要你复现三个月前的计算结果，但参数丢了
- 师弟接手你的项目，花了两周才搞清楚怎么运行

这些问题的根源是**缺乏项目组织规范**。

---

## 21.1 一个科研项目应该长什么样

### 最小可行结构

一个计算物理项目至少需要：

```
my_project/
├── README.md           # 项目说明（必须有）
├── src/                # 源代码
├── data/               # 数据（输入/输出）
├── scripts/            # 辅助脚本（绘图、后处理）
├── docs/               # 文档和笔记
├── .gitignore          # Git 忽略规则
└── requirements.txt    # 依赖清单（Python 项目）
```

### 完整推荐结构

```
ising_monte_carlo/
├── README.md
├── LICENSE
├── .gitignore
├── requirements.txt        # 或 environment.yml
│
├── src/                    # 核心源代码
│   ├── __init__.py
│   ├── model.py            # 物理模型定义
│   ├── algorithm.py        # 算法实现
│   ├── observables.py      # 可观测量计算
│   └── io.py               # 输入输出处理
│
├── include/                # 头文件（C/C++/Fortran 项目）
│   └── constants.h
│
├── scripts/                # 辅助脚本
│   ├── run_simulation.sh   # 运行脚本
│   ├── plot_results.py     # 绘图脚本
│   ├── analyze.py          # 数据分析
│   └── submit_job.slurm    # 超算任务提交脚本
│
├── tests/                  # 测试
│   ├── test_model.py
│   └── test_algorithm.py
│
├── configs/                # 配置文件
│   ├── default.yaml
│   ├── high_temp.yaml
│   └── critical_point.yaml
│
├── data/                   # 数据目录
│   ├── input/              # 输入数据
│   └── output/             # 输出结果（通常不纳入 Git）
│
├── results/                # 最终结果和图表
│   ├── figures/
│   └── tables/
│
├── docs/                   # 文档
│   ├── notes.md            # 研究笔记
│   └── methods.md          # 方法说明
│
├── notebooks/              # Jupyter notebooks（探索性分析）
│   └── exploration.ipynb
│
└── Makefile                # 或 CMakeLists.txt
```

:::tip 原则
**每个文件都应该有明确的归属。** 如果你不知道一个文件应该放在哪里，说明你的目录结构需要改进。
:::

---

## 21.2 src / include / scripts / docs / data / tests

### `src/`——核心源代码

存放项目的核心逻辑代码。每个文件应有单一职责：

```python
# src/model.py —— 物理模型定义
class IsingModel:
    def __init__(self, L, T, J=1.0):
        self.L = L          # 晶格尺寸
        self.T = T          # 温度
        self.J = J          # 耦合常数
        self.spins = np.random.choice([-1, 1], size=(L, L))
```

### `include/`——头文件（C/C++/Fortran）

```c
// include/constants.h
#ifndef CONSTANTS_H
#define CONSTANTS_H

#define KB 1.380649e-23    // Boltzmann constant (J/K)
#define PI 3.14159265358979

#endif
```

### `scripts/`——辅助脚本

不是核心逻辑，但用于运行、分析、绘图等：

```bash
#!/bin/bash
# scripts/run_simulation.sh
# 批量运行不同温度的模拟

for T in 1.0 1.5 2.0 2.27 2.5 3.0 3.5 4.0; do
    echo "Running T=$T ..."
    python -m src.main --config configs/default.yaml --temperature $T
done
```

### `docs/`——文档和笔记

```markdown
<!-- docs/methods.md -->
# 方法说明

## Metropolis 算法
本项目使用标准 Metropolis-Hastings 算法...
翻转接受概率: P = min(1, exp(-ΔE / kT))

## 参考文献
- Newman & Barkema, "Monte Carlo Methods in Statistical Physics"
```

### `data/`——数据

```
data/
├── input/                  # 初始构型、参数文件
│   └── initial_config.npy
└── output/                 # 模拟输出（通常不入 Git）
    ├── T1.0_L32.dat
    ├── T2.0_L32.dat
    └── T2.27_L32.dat
```

### `tests/`——测试

```python
# tests/test_model.py
import pytest
from src.model import IsingModel

def test_energy_fully_aligned():
    """全部自旋向上时，能量应为 -2*J*N"""
    model = IsingModel(L=4, T=1.0)
    model.spins[:] = 1  # 所有自旋向上
    E = model.total_energy()
    expected = -2 * model.J * model.L**2
    assert E == expected
```

---

## 21.3 配置文件与参数文件

**永远不要在代码中硬编码参数。** 使用配置文件管理所有可变参数。

### YAML 格式（推荐）

```yaml
# configs/default.yaml
simulation:
  model: "ising_2d"
  lattice_size: 32
  temperature: 2.27
  coupling: 1.0
  boundary: "periodic"

algorithm:
  method: "metropolis"
  thermalization_steps: 10000
  measurement_steps: 50000
  measurement_interval: 10

output:
  directory: "data/output"
  save_config: true
  save_snapshots: false
  snapshot_interval: 1000

random:
  seed: 42
```

### JSON 格式

```json
{
  "simulation": {
    "model": "ising_2d",
    "lattice_size": 32,
    "temperature": 2.27
  },
  "algorithm": {
    "method": "metropolis",
    "thermalization_steps": 10000,
    "measurement_steps": 50000
  }
}
```

### 在代码中加载配置

```python
# src/config.py
import yaml

def load_config(path):
    with open(path, 'r') as f:
        config = yaml.safe_load(f)
    return config

# 使用
config = load_config("configs/default.yaml")
L = config["simulation"]["lattice_size"]
T = config["simulation"]["temperature"]
```

:::caution YAML vs JSON
- **YAML**：支持注释、可读性更好，推荐用于配置文件
- **JSON**：更严格、无注释，适合机器间数据交换
- **INI/CFG**：简单场景可用，但不支持嵌套结构
:::

---

## 21.4 输入输出规范

### 输入规范

- 使用命令行参数指定配置文件路径
- 支持命令行参数覆盖配置文件中的值
- 输入文件使用标准格式（YAML, JSON, HDF5, NumPy）

```python
# 使用 argparse 处理命令行参数
import argparse

parser = argparse.ArgumentParser(description="2D Ising Monte Carlo")
parser.add_argument("--config", type=str, required=True,
                    help="Path to config file")
parser.add_argument("--temperature", type=float, default=None,
                    help="Override temperature in config")
parser.add_argument("--output-dir", type=str, default=None,
                    help="Override output directory")
args = parser.parse_args()
```

### 输出规范

输出文件名应包含关键参数信息：

```python
# 好的命名
output_file = f"ising_L{L}_T{T:.4f}_seed{seed}.dat"
# 例如：ising_L32_T2.2700_seed42.dat

# 坏的命名
output_file = "result.dat"       # 无法区分不同运行
output_file = "result_final.dat" # "final" 毫无意义
```

### 输出文件头信息

```python
# 在输出文件开头写入元数据
with open(output_file, 'w') as f:
    f.write(f"# Ising 2D Monte Carlo Simulation\n")
    f.write(f"# Date: {datetime.now().isoformat()}\n")
    f.write(f"# L={L}, T={T}, J={J}, seed={seed}\n")
    f.write(f"# Columns: step, energy, magnetization\n")
    for step, E, M in results:
        f.write(f"{step} {E:.6e} {M:.6e}\n")
```

---

## 21.5 日志与结果管理

### 使用 Python logging 模块

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("simulation.log"),
        logging.StreamHandler()  # 同时输出到屏幕
    ]
)

logger = logging.getLogger(__name__)

logger.info(f"Starting simulation: L={L}, T={T}")
logger.info(f"Thermalization: {therm_steps} steps")
logger.warning("Temperature is below critical point")
logger.error("Configuration file not found")
```

### 结果目录的组织

```
results/
├── 2025-01-15_phase_diagram/
│   ├── run_config.yaml          # 复制一份当时的配置
│   ├── ising_L32_T2.27.dat
│   ├── phase_diagram.pdf
│   └── notes.md                 # 这次计算的说明
│
└── 2025-02-03_finite_size/
    ├── run_config.yaml
    ├── L16/ L32/ L64/ L128/
    ├── scaling_analysis.pdf
    └── notes.md
```

:::tip 时间戳命名
用日期前缀命名结果目录，方便按时间排序和回溯。
:::

---

## 21.6 复现实验的最小要求

科研可复现性（reproducibility）是核心要求。以下是最小清单：

| 要素 | 说明 | 如何实现 |
|------|------|---------|
| 代码版本 | 用的是哪个版本的代码 | Git commit hash |
| 参数记录 | 所有参数都有记录 | 配置文件 + 输出文件头 |
| 随机种子 | 随机过程可重复 | 固定并记录 seed |
| 环境信息 | 软件版本、编译器版本 | `requirements.txt` / `environment.yml` |
| 运行命令 | 如何运行程序 | README 或脚本 |
| 原始数据 | 计算的原始输出 | 保存在 `data/output/` |

### 在输出中记录 Git 信息

```python
import subprocess

def get_git_info():
    commit = subprocess.check_output(
        ["git", "rev-parse", "HEAD"]
    ).decode().strip()
    status = subprocess.check_output(
        ["git", "status", "--short"]
    ).decode().strip()
    return commit, status

commit, status = get_git_info()
logger.info(f"Git commit: {commit}")
if status:
    logger.warning(f"Uncommitted changes:\n{status}")
```

:::caution 可复现性红线
如果你无法在新环境中用同样的代码和参数得到同样的结果，你的研究就有问题。**在发表论文前，至少让一个同事成功复现你的结果。**
:::

---

## 21.7 项目模板示例

### 一键创建项目结构

````bash
#!/bin/bash
# scripts/create_project.sh
# 用法: bash create_project.sh my_new_project

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: bash create_project.sh <project_name>"
    exit 1
fi

mkdir -p "$PROJECT_NAME"/{src,tests,scripts,configs,data/{input,output},results/figures,docs,notebooks}

# 创建 README
cat > "$PROJECT_NAME/README.md" << 'EOF'
# Project Name

## Description
Brief description of the project.

## Installation
```bash
pip install -r requirements.txt
```

## Usage
```bash
python -m src.main --config configs/default.yaml
```

## Project Structure
- `src/` — Core source code
- `tests/` — Unit tests
- `scripts/` — Helper scripts
- `configs/` — Configuration files
- `data/` — Input/output data
- `results/` — Figures and analysis results
- `docs/` — Documentation
EOF

# 创建 .gitignore
cat > "$PROJECT_NAME/.gitignore" << 'EOF'
# Python
__pycache__/
*.pyc
*.egg-info/
.venv/
venv/

# Data (large files)
data/output/
*.hdf5
*.h5

# Build
build/
*.o
*.mod

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Results (optional, may want to keep)
# results/
EOF

# 创建空的 requirements.txt
cat > "$PROJECT_NAME/requirements.txt" << 'EOF'
numpy>=1.24
scipy>=1.10
matplotlib>=3.7
pyyaml>=6.0
pytest>=7.0
EOF

# 创建默认配置
cat > "$PROJECT_NAME/configs/default.yaml" << 'EOF'
# Default configuration
simulation:
  name: "unnamed"
  # Add your parameters here

output:
  directory: "data/output"
  save_config: true

random:
  seed: 42
EOF

# 创建 __init__.py
touch "$PROJECT_NAME/src/__init__.py"

echo "Project '$PROJECT_NAME' created successfully!"
echo "Next steps:"
echo "  cd $PROJECT_NAME"
echo "  git init"
echo "  python -m venv .venv"
echo "  source .venv/bin/activate"
echo "  pip install -r requirements.txt"
````

### 使用 cookiecutter 模板

如果你经常创建类似项目，可以使用 `cookiecutter`：

```bash
pip install cookiecutter

# 使用社区模板
cookiecutter https://github.com/audreyfeldroy/cookiecutter-pypackage

# 或创建自己的模板
```

---

## `.gitignore` 的要点

一个好的 `.gitignore` 应该排除：

```gitignore
# 编译产物
build/
*.o
*.mod
*.exe

# Python 缓存
__pycache__/
*.pyc
.venv/

# 大型数据文件
data/output/
*.hdf5
*.npy
*.csv

# 编辑器临时文件
.vscode/settings.json
*.swp
*~

# 系统文件
.DS_Store
Thumbs.db

# 密钥和敏感信息
*.key
*.pem
.env
```

:::info 什么应该纳入 Git
- 所有源代码
- 配置文件模板
- 文档和 README
- 测试代码
- 小型输入数据（< 1 MB）
- Makefile / CMakeLists.txt / pyproject.toml
:::

---

## 常见问题

**Q: 数据太大，不能放 Git 怎么办？**
A: 使用 Git LFS（Large File Storage），或把大数据放在共享存储/云盘上，在 README 中说明数据获取方式。

**Q: notebooks 应该放在 Git 里吗？**
A: 探索性 notebooks 可以放，但正式代码应该从 notebook 中提取出来放到 `src/`。用 `nbstripout` 工具清除 notebook 的输出再提交。

**Q: 配置文件用 YAML 还是 JSON？**
A: 推荐 YAML。支持注释、可读性好。JSON 适合程序间数据交换。

**Q: 一个项目多大算"太大"？**
A: 如果 `src/` 超过 50 个文件，考虑拆分为多个子模块。如果涉及多个独立的研究方向，考虑拆成多个仓库。

---

## 小结

- **清晰的目录结构**是项目可维护性的基础
- 使用配置文件管理参数，**永远不要硬编码**
- 输出文件名应包含关键参数，文件头应包含元数据
- **可复现性**是科研的底线——记录代码版本、参数、环境
- 使用项目模板快速启动新项目，保持一致性
- 合理使用 `.gitignore`，不要把大文件和缓存提交到 Git

---

## 练习

1. 使用本章的模板脚本创建一个新项目，初始化 Git 仓库
2. 为你现有的某个项目重新组织目录结构，添加 README 和 `.gitignore`
3. 将一个硬编码参数的脚本改为使用 YAML 配置文件
4. 在你的模拟输出中加上元数据头信息（日期、参数、Git commit）
5. 检查你的项目是否满足"可复现性最小清单"中的所有要素
