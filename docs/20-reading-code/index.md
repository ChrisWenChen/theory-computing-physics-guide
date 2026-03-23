---
sidebar_position: 20
sidebar_label: "20. 如何读懂别人的代码"
---

# 第 20 章：如何读懂别人的代码

> 你 80% 的时间在读代码，只有 20% 在写代码。

## 本章目标

读完本章后，你应该能：

- 理解为什么阅读代码是比编写代码更重要的技能
- 掌握一套系统的代码阅读流程
- 知道在不同类型的文件中应该关注什么
- 能够进行有效的 code review
- 建立自己的代码阅读笔记体系

## 动机

在科研中，你经常需要：

- 接手师兄师姐留下的项目代码
- 复现论文中的计算结果
- 理解一个开源库的内部实现
- 参与课题组的代码协作

这些场景都要求你能高效地**读懂别人的代码**。然而大多数课程只教你如何写代码，从不教你如何读代码。

---

## 20.1 为什么"会读代码"比"会写代码"更重要

在实际科研工作中，你面对的代码绝大部分不是自己写的：

| 场景 | 占比（估计） |
|------|-------------|
| 读别人的代码并理解 | ~40% |
| 修改现有代码 | ~25% |
| 调试和排错 | ~15% |
| 从零写新代码 | ~20% |

:::tip 核心观点
**写代码是表达，读代码是理解。** 不会读代码的人，写出来的代码往往也不好——因为他从来没有见过"好代码"长什么样。
:::

读代码的能力帮助你：

- 更快上手新项目
- 更准确地复现别人的工作
- 学习优秀的编程模式和技巧
- 在 code review 中发现潜在问题

---

## 20.2 从 README 开始

拿到一个项目，**第一件事永远是读 README**。

一个好的 README 通常包含：

```markdown
# 项目名称

## 简介
这个项目做什么、解决什么问题

## 安装方法
如何安装依赖、编译、运行

## 使用示例
基本用法和示例命令

## 项目结构
目录和文件的说明

## 许可证
开源协议
```

如果没有 README，看以下替代品：

- `INSTALL` 或 `INSTALL.md`——安装说明
- `CONTRIBUTING.md`——贡献指南，通常包含项目结构信息
- `docs/` 目录——正式文档
- GitHub/GitLab 的 Wiki 页面

:::caution 没有 README 的项目
如果一个项目连 README 都没有，要么它是个人草稿，要么作者不重视文档。阅读难度会大幅增加，做好心理准备。
:::

---

## 20.3 看目录结构

在读具体代码之前，先用 `tree` 或 `ls -R` 看项目的整体结构：

```bash
# 查看前两层目录结构
tree -L 2

# 如果没有 tree，用 find
find . -maxdepth 2 -type f | head -40
```

### 常见目录结构模式

**Python 项目：**

```
my_project/
├── src/ 或 my_project/    # 源代码
│   ├── __init__.py
│   ├── main.py
│   └── utils.py
├── tests/                  # 测试
├── docs/                   # 文档
├── setup.py 或 pyproject.toml
├── requirements.txt
└── README.md
```

**C/C++ 项目：**

```
my_project/
├── src/                    # 源文件 (.c, .cpp)
├── include/                # 头文件 (.h, .hpp)
├── lib/                    # 第三方库
├── build/                  # 编译输出（通常在 .gitignore 中）
├── tests/
├── Makefile 或 CMakeLists.txt
└── README.md
```

**Fortran 计算物理项目：**

```
my_simulation/
├── src/                    # 源文件 (.f90, .f)
├── mod/                    # 模块文件
├── input/                  # 输入参数文件
├── output/                 # 计算结果
├── scripts/                # 后处理脚本
├── Makefile
└── README
```

---

## 20.4 找入口文件

入口文件（entry point）是程序开始执行的地方。找到它就找到了代码的"起点"。

| 语言 | 常见入口文件 | 标志 |
|------|-------------|------|
| Python | `main.py`, `app.py`, `__main__.py` | `if __name__ == "__main__":` |
| C/C++ | `main.c`, `main.cpp` | `int main(int argc, char* argv[])` |
| Fortran | `main.f90`, `program.f90` | `program xxx` |
| Shell | `run.sh`, `submit.sh` | `#!/bin/bash` |

### 查找入口文件的技巧

```bash
# Python：搜索 main 函数
grep -rn "if __name__" *.py src/

# C/C++：搜索 main 函数
grep -rn "int main" src/

# Fortran：搜索 program 语句
grep -rn "^program " src/

# 查看 Makefile 中的目标
head -30 Makefile
```

:::info 阅读顺序
找到入口文件后，按照程序的**执行顺序**往下读，而不是按文件名字母顺序。这样你能理解数据是如何流动的。
:::

---

## 20.5 读配置、依赖和构建方式

不同文件类型告诉你不同的信息：

### 依赖文件——项目用了什么库

| 文件 | 语言/工具 | 关注什么 |
|------|----------|---------|
| `requirements.txt` | Python (pip) | 依赖包列表和版本 |
| `pyproject.toml` | Python (modern) | 依赖、构建配置、项目元数据 |
| `environment.yml` | Python (conda) | conda 环境和依赖 |
| `package.json` | JavaScript/Node | 依赖和脚本命令 |
| `CMakeLists.txt` | C/C++ (CMake) | 编译选项、链接库 |
| `Makefile` | 通用 | 编译命令、编译选项、链接标志 |
| `Cargo.toml` | Rust | 依赖和构建配置 |

### 配置文件——项目如何运行

```bash
# 查看所有配置文件
ls -la *.cfg *.ini *.yaml *.yml *.toml *.json 2>/dev/null

# 查看 .gitignore——哪些文件被排除了
cat .gitignore
```

### 构建文件——如何编译/运行

```bash
# Makefile：看有哪些目标
grep "^[a-zA-Z].*:" Makefile

# CMake：看项目名和依赖
head -30 CMakeLists.txt

# Python：看 setup 配置
cat setup.py        # 或 pyproject.toml
```

---

## 20.6 跟踪数据流

理解代码的关键是跟踪**数据是如何流动的**：

1. **输入**：数据从哪里来？（文件、命令行参数、标准输入）
2. **处理**：数据经过了哪些变换？（函数调用链）
3. **输出**：结果写到哪里？（文件、屏幕、数据库）

### 一个实际的跟踪流程

```
命令行参数 → 读取配置文件 → 初始化物理系统
    → 主循环（时间步进 / 蒙特卡洛采样）
    → 计算可观测量 → 写入输出文件
```

### 使用编辑器辅助跟踪

在 VS Code 中：

- **Ctrl+Click**（或 **Cmd+Click**）：跳转到函数定义
- **Ctrl+Shift+F**：全局搜索函数名或变量名
- **F12**：Go to Definition
- **Shift+F12**：Find All References
- **Ctrl+Shift+O**：查看文件中的符号列表（函数、类）

```bash
# 命令行中搜索函数调用关系
grep -rn "function_name" src/
```

---

## 20.7 看测试与示例

测试代码是理解项目行为的最好"文档"：

```python
# tests/test_ising.py
def test_magnetization_at_zero_temperature():
    """零温下磁化强度应该为 ±1"""
    model = IsingModel(L=10, T=0.01)
    model.run(steps=1000)
    assert abs(model.magnetization()) > 0.99
```

从这个测试你立刻知道：

- 有一个 `IsingModel` 类
- 构造时需要系统尺寸 `L` 和温度 `T`
- 有 `run()` 方法进行模拟
- 有 `magnetization()` 方法计算磁化强度

:::tip 阅读优先级
**示例代码 > 测试代码 > 文档 > 源代码**。先读使用方式，再读实现细节。
:::

### 常见示例位置

```
examples/           # 示例脚本
notebooks/          # Jupyter notebook 示例
demo/               # 演示代码
tests/              # 测试（也是一种使用示例）
docs/tutorials/     # 教程
```

---

## 20.8 代码 review 的基本原则

无论是审查别人的代码还是自审，以下清单非常有用：

### Code Review Checklist

```markdown
## 功能性
- [ ] 代码是否实现了预期功能？
- [ ] 边界情况是否处理了？（空输入、极端参数）
- [ ] 物理单位是否一致？（计算物理中常见 bug）

## 可读性
- [ ] 变量名和函数名是否有意义？
- [ ] 是否有必要的注释？（尤其是物理公式对应的代码）
- [ ] 函数是否太长？（超过 50 行应考虑拆分）

## 正确性
- [ ] 数组索引是否正确？（off-by-one error）
- [ ] 数值精度是否足够？（float vs double）
- [ ] 随机数种子是否可控？（可复现性）

## 性能
- [ ] 是否有不必要的重复计算？
- [ ] 循环是否可以向量化？
- [ ] 内存分配是否合理？

## 工程规范
- [ ] 是否有测试？
- [ ] 是否符合项目的代码风格？
- [ ] 是否更新了文档？
```

### Review 时的心态

- 目标是**改进代码**，不是"找茬"
- 提出问题而非直接否定："这里用 `numpy.dot` 是否会更快？"
- 区分"必须修改"和"建议优化"
- 对新手更多鼓励，对核心逻辑更严格

---

## 20.9 如何做自己的阅读笔记

读代码时做笔记能极大提高理解效率。

### 推荐的笔记模板

```markdown
# 项目名称

## 基本信息
- 语言：Python 3.10
- 用途：2D Ising 模型蒙特卡洛模拟
- 仓库：https://github.com/xxx/ising-mc

## 目录结构
src/
├── ising.py        # 核心模型类
├── mc.py           # 蒙特卡洛算法
├── analysis.py     # 数据分析
└── plot.py         # 绘图脚本

## 入口与执行流程
main.py → 读取 config.yaml → 创建 IsingModel → 运行 MC → 输出结果

## 关键函数
- `IsingModel.__init__()`: 初始化晶格
- `metropolis_step()`: 单次 Metropolis 更新
- `measure()`: 测量能量和磁化强度

## 我不理解的地方
- mc.py:45 行的 cluster update 算法细节
- analysis.py 中 bootstrap 误差估计的实现

## 可以改进的地方
- 没有用 NumPy 向量化，循环很慢
- 没有写测试
```

### 笔记工具推荐

| 工具 | 适合场景 |
|------|---------|
| Obsidian | 长期知识管理，支持双向链接 |
| Markdown 文件 | 放在项目目录中，随项目走 |
| 纸质笔记 | 画调用关系图、数据流图 |
| VS Code 注释 | 临时标记，读完后删除 |

---

## 完整的代码阅读工作流

以下是推荐的 step-by-step 阅读流程：

```
Step 1: 读 README 和文档
    │   了解项目做什么、怎么用
    ▼
Step 2: 看目录结构
    │   建立项目的整体印象
    ▼
Step 3: 读依赖和构建配置
    │   了解技术栈和运行方式
    ▼
Step 4: 找入口文件
    │   确定程序从哪里开始执行
    ▼
Step 5: 跟踪主流程
    │   从入口出发，沿着调用链往下读
    ▼
Step 6: 读测试和示例
    │   理解预期行为和使用方式
    ▼
Step 7: 深入关键模块
    │   聚焦核心算法和数据结构
    ▼
Step 8: 做笔记，记录疑问
    │   整理理解，标记不懂的地方
    ▼
Step 9: 尝试修改和运行
        通过动手验证你的理解
```

:::tip 黄金法则
**不要试图一次读懂所有代码。** 先理解整体结构和主流程，再按需深入细节。就像读一本书，先看目录和摘要，再读感兴趣的章节。
:::

---

## 用 AI Agent 辅助阅读代码

AI Agent（如 Claude Code、OpenCode，详见第 19 章）可以大幅加速代码阅读过程。Agent 直接运行在你的项目目录中，能读取所有文件、搜索代码库、理解上下文，比手动逐文件阅读高效得多。

### 典型用法

```bash
cd ~/research/some_project
claude

# 让 Agent 分析项目结构
> 分析一下这个项目的目录结构，每个文件夹和主要文件的作用是什么

# 理解核心算法
> 详细解释 src/solver.f90 中的 conjugate_gradient 函数，
> 用物理人能理解的语言

# 追踪数据流
> 从 main.py 出发，输入数据是怎么一步步经过处理变成最终结果的

# 找到关键参数
> 这个项目中所有的物理参数（温度、耦合常数等）在哪里定义的？
> 怎么修改它们？
```

### Agent 与传统阅读的配合

Agent 不是替代手动阅读，而是加速你的理解过程：

| 步骤 | 手动做 | 让 Agent 做 |
|------|--------|------------|
| 读 README | 自己读 | 自己读 |
| 分析目录结构 | 自己看 | Agent 快速概述 |
| 找入口文件 | 逐文件查找 | Agent 直接定位 |
| 理解核心算法 | 自己读 + 查资料 | Agent 解释 + 自己验证 |
| 追踪调用链 | 用 IDE 跳转 | Agent 画出调用关系 |
| 理解编译/构建方式 | 读 Makefile/CMakeLists | Agent 解释构建流程 |

:::caution
Agent 的解释可能有误，特别是对物理含义的理解。始终用你的物理知识验证 Agent 给出的解释。Agent 擅长解释代码结构和语法，但物理判断是你的责任。
:::

---

## 常见问题

**Q: 代码太大了，不知道从哪里开始？**
A: 从入口文件开始，只跟踪你关心的那一条执行路径。忽略暂时不相关的模块。

**Q: 代码没有注释怎么办？**
A: 看函数名和变量名推测意图，看测试理解行为，必要时运行代码加 print 语句调试。

**Q: 读不懂某个算法的实现？**
A: 先去读算法的理论描述（论文、教科书），理解原理后再看代码实现会容易很多。

**Q: 应该花多少时间读代码？**
A: 对于一个中等规模的项目（几千行），花 2-4 小时理解主体结构是合理的。不必追求 100% 理解。

---

## 小结

- **读代码是一项需要刻意练习的技能**，不会自动随着编程经验提高
- 遵循系统的阅读流程：README → 目录结构 → 配置文件 → 入口文件 → 主流程 → 测试
- 使用编辑器的跳转和搜索功能提高效率
- **做笔记**是提高理解和记忆的关键
- Code review 既是读代码的实践，也是团队协作的重要环节

---

## 练习

1. 选一个你常用的 Python 库（如 `numpy` 或 `matplotlib`），在 GitHub 上浏览它的目录结构，找到入口文件
2. 找到师兄/师姐的一个项目，用本章的流程从头阅读，写一份阅读笔记
3. 阅读一个小型开源计算物理项目（如 GitHub 上的 Ising 模型实现），完成 code review checklist
4. 在你自己的某个项目中加上 README，确保别人能通过 README 理解你的项目
5. 练习使用 VS Code 的 "Go to Definition" 和 "Find All References" 功能跟踪一段代码的调用关系
