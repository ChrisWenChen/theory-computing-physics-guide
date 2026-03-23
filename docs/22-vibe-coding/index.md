---
sidebar_position: 22
sidebar_label: "22. Vibe Coding"
---

# 第 22 章：如何做一个"vibe coding"的计算物理软件

> 不要追求完美，先让它跑起来，再让它跑得好。

## 本章目标

读完本章后，你应该能：

- 理解"vibe coding"的理念和适用场景
- 掌握从零开始构建计算物理小项目的迭代流程
- 学会借助 AI 工具拆解和实现任务
- 完成一个完整的物理模拟项目（从 idea 到 GitHub 发布）

## 动机

很多物理学生面对编程项目时会陷入两个极端：

1. **过度规划**：还没写一行代码就画了几十页 UML 图，结果迟迟无法开始
2. **毫无规划**：上来就写，写到一半发现结构混乱、无法扩展

"Vibe coding" 是一种介于两者之间的实用开发方式：**跟着感觉走，但有基本的方法论支撑。**

---

## 22.1 什么叫"vibe coding"

"Vibe coding" 这个概念来自 Andrej Karpathy（OpenAI/Tesla AI 负责人）的描述：

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

在计算物理的语境下，vibe coding 意味着：

- **快速原型**：先写一个最简版本，验证物理逻辑
- **迭代改进**：一轮一轮地加功能、加测试、优化性能
- **AI 辅助**：利用 ChatGPT、GitHub Copilot 等工具加速开发
- **不追求完美**：代码不需要一开始就漂亮，能跑、能验证就好

:::info 适用范围
Vibe coding 适合小到中型科研项目（几百到几千行代码）。如果你要开发大型框架或需要团队长期维护的软件，还是需要更正式的软件工程流程。
:::

### Vibe coding vs 传统开发

| | 传统软件工程 | Vibe Coding |
|---|---|---|
| 起点 | 需求文档、设计文档 | 一个物理问题 |
| 节奏 | 瀑布式或 Agile sprint | 随灵感迭代 |
| 代码质量 | 从一开始就追求规范 | 先跑通，后重构 |
| 测试 | TDD（测试驱动开发） | 先看结果对不对，再补测试 |
| 工具 | IDE、CI/CD、代码审查 | 编辑器 + AI 助手 |
| 适合 | 团队项目、生产软件 | 科研探索、课程作业、个人项目 |

---

## 22.2 正确心态：先验证，再扩展

### 核心原则

```
1. Make it work  —— 先让它能跑
2. Make it right —— 再让它正确
3. Make it fast  —— 最后让它快
```

:::caution 新手常见错误
不要在第一步就纠结于性能优化。先确保物理结果是对的，再考虑效率。一个跑得很快但结果错误的程序毫无价值。
:::

### 验证的方法

在计算物理中，验证代码正确性的常用方法：

| 方法 | 适用场景 | 示例 |
|------|---------|------|
| 解析解对比 | 存在精确解的情况 | 1D 谐振子、自由粒子 |
| 极限检验 | 特殊参数下行为已知 | T→0 或 T→∞ 的热力学量 |
| 守恒量检查 | 有守恒律的系统 | 能量守恒、粒子数守恒 |
| 文献对比 | 已发表的数值结果 | 临界温度、临界指数 |
| 对称性检验 | 系统应满足的对称性 | 空间各向同性、时间反演 |

---

## 22.3 选题建议：Ising、薛定谔方程、随机游走、分子动力学

以下是适合 vibe coding 的计算物理项目，按难度排序：

### 入门级

| 项目 | 物理 | 核心算法 | 编程难度 |
|------|------|---------|---------|
| 1D/2D 随机游走 | 布朗运动 | 随机数生成 | 低 |
| 数值积分 | 任意势能 | Simpson / Gauss 积分 | 低 |
| 弹簧振子 | 经典力学 | Euler / Verlet 积分 | 低 |

### 中级

| 项目 | 物理 | 核心算法 | 编程难度 |
|------|------|---------|---------|
| 2D Ising 模型 | 统计力学 | Metropolis Monte Carlo | 中 |
| 1D 薛定谔方程 | 量子力学 | 有限差分 / 打靶法 | 中 |
| 分子动力学（LJ） | 材料科学 | Velocity Verlet | 中 |

### 进阶

| 项目 | 物理 | 核心算法 | 编程难度 |
|------|------|---------|---------|
| XY 模型与 KT 转变 | 统计力学 | Wolff cluster MC | 高 |
| 2D 薛定谔方程 | 量子力学 | 分裂算符法 | 高 |
| N 体引力模拟 | 天体物理 | Barnes-Hut / PM | 高 |

:::tip 选题原则
选一个你**物理上理解**的问题。Vibe coding 的前提是你知道结果应该"大概长什么样"。
:::

---

## 22.4 用 AI 辅助拆解任务

AI 工具在 vibe coding 中的角色是**加速器**，而不是替代品。

### 如何用 AI 拆解任务

向 AI 提问的有效方式：

```
Prompt: "我想用 Python 写一个 2D Ising 模型的 Monte Carlo 模拟。
请帮我把这个项目拆解成 5-7 个可以逐步实现的小任务，
每个任务都应该可以独立运行和验证。"
```

AI 可能给你的拆解：

```
任务 1: 创建 L×L 晶格，随机初始化自旋
任务 2: 实现能量计算函数（周期边界条件）
任务 3: 实现单次 Metropolis 翻转
任务 4: 实现 MC 循环，计算能量和磁化强度
任务 5: 加入热化（thermalization）和测量分离
任务 6: 扫描温度，画相变曲线
任务 7: 加入 Wolff cluster 算法，比较效率
```

### AI 使用的注意事项

:::caution AI 不是万能的
- AI 生成的代码**必须验证**——它可能写出看起来对但物理上错的代码
- 不要复制粘贴不理解的代码——这样出错时你无法调试
- AI 不了解你的具体科研背景——物理判断仍然靠你
- 把 AI 当作"一个有经验但偶尔犯错的同事"
:::

### 推荐的 AI 工具

| 工具 | 用途 | 价格 |
|------|------|------|
| GitHub Copilot | 编辑器内代码补全 | 学生免费 |
| ChatGPT / Claude | 对话式问答、代码生成 | 免费/付费 |
| Cursor | AI-native 编辑器 | 免费/付费 |

---

## 22.5 建立最小可运行版本

### MVP（Minimum Viable Product）思维

你的第一个版本应该：

- 能运行不报错
- 物理上做的事情是对的（哪怕很简化）
- 能产生可以检查的输出

### 示例：2D Ising 模型的 MVP

```python
# ising_mvp.py — 最小可运行的 2D Ising 模型
import numpy as np

# 参数
L = 16          # 晶格尺寸
T = 2.27        # 温度（临界温度附近）
steps = 100000  # MC 步数

# 初始化随机自旋构型
spins = np.random.choice([-1, 1], size=(L, L))

def energy(spins):
    """计算总能量（周期边界）"""
    E = 0
    for i in range(L):
        for j in range(L):
            S = spins[i, j]
            nb = (spins[(i+1)%L, j] + spins[(i-1)%L, j] +
                  spins[i, (j+1)%L] + spins[i, (j-1)%L])
            E -= S * nb
    return E / 2  # 每对只算一次

def mc_step(spins, T):
    """一次 MC sweep（L*L 次翻转尝试）"""
    for _ in range(L * L):
        i, j = np.random.randint(0, L, size=2)
        S = spins[i, j]
        nb = (spins[(i+1)%L, j] + spins[(i-1)%L, j] +
              spins[i, (j+1)%L] + spins[i, (j-1)%L])
        dE = 2 * S * nb
        if dE <= 0 or np.random.random() < np.exp(-dE / T):
            spins[i, j] *= -1

# 运行模拟
for step in range(steps):
    mc_step(spins, T)
    if step % 10000 == 0:
        E = energy(spins)
        M = np.abs(spins.mean())
        print(f"Step {step:6d}: E/N = {E/L**2:.4f}, |M| = {M:.4f}")
```

运行验证：

```bash
python ising_mvp.py
# 检查：T=2.27 附近，|M| 应该在 0.3-0.8 之间波动
# 检查：T=1.0 时，|M| 应该接近 1
# 检查：T=4.0 时，|M| 应该接近 0
```

---

## 22.6 增加测试与可视化

### 第二轮迭代：加入可视化

```python
# 在 MVP 基础上添加
import matplotlib.pyplot as plt

# 存储测量数据
energies = []
magnetizations = []

for step in range(steps):
    mc_step(spins, T)
    if step % 100 == 0 and step > 20000:  # 跳过热化阶段
        energies.append(energy(spins) / L**2)
        magnetizations.append(np.abs(spins.mean()))

# 画图
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

axes[0].imshow(spins, cmap='coolwarm', interpolation='nearest')
axes[0].set_title(f"Spin configuration (T={T})")

axes[1].plot(energies)
axes[1].set_xlabel("Measurement")
axes[1].set_ylabel("E/N")
axes[1].set_title("Energy per site")

axes[2].plot(magnetizations)
axes[2].set_xlabel("Measurement")
axes[2].set_ylabel("|M|")
axes[2].set_title("Magnetization")

plt.tight_layout()
plt.savefig("ising_results.png", dpi=150)
plt.show()
```

### 加入基本测试

```python
# tests/test_ising.py
import numpy as np
from ising_mvp import energy, mc_step

def test_energy_all_up():
    """全部向上时能量 = -2N"""
    L = 4
    spins = np.ones((L, L), dtype=int)
    E = energy(spins)
    assert E == -2 * L * L, f"Expected {-2*L*L}, got {E}"

def test_high_temperature():
    """高温下磁化强度接近 0"""
    L = 16
    spins = np.random.choice([-1, 1], size=(L, L))
    for _ in range(10000):
        mc_step(spins, T=100.0)
    M = np.abs(spins.mean())
    assert M < 0.3, f"|M| = {M}, expected near 0 at high T"

def test_low_temperature():
    """低温下磁化强度接近 1"""
    L = 8
    spins = np.ones((L, L), dtype=int)
    for _ in range(10000):
        mc_step(spins, T=0.5)
    M = np.abs(spins.mean())
    assert M > 0.9, f"|M| = {M}, expected near 1 at low T"

if __name__ == "__main__":
    test_energy_all_up()
    test_high_temperature()
    test_low_temperature()
    print("All tests passed!")
```

---

## 22.7 重构与性能优化

### 第三轮迭代：重构代码结构

将单个脚本拆分为模块：

```
ising_project/
├── src/
│   ├── __init__.py
│   ├── model.py          # IsingModel 类
│   ├── algorithms.py     # Metropolis, Wolff
│   └── observables.py    # 能量、磁化强度、比热
├── scripts/
│   ├── run.py            # 主运行脚本
│   └── plot.py           # 绘图脚本
├── tests/
│   └── test_model.py
├── configs/
│   └── default.yaml
└── README.md
```

### 性能优化思路

```python
# 优化 1: 用 NumPy 向量化计算能量
def energy_vectorized(spins):
    """向量化能量计算——比循环快 100 倍"""
    return -(spins * (
        np.roll(spins, 1, axis=0) +
        np.roll(spins, -1, axis=0) +
        np.roll(spins, 1, axis=1) +
        np.roll(spins, -1, axis=1)
    )).sum() / 2

# 优化 2: 预计算 Boltzmann 因子
# dE 只可能是 -8, -4, 0, 4, 8
boltzmann = {dE: np.exp(-dE / T) for dE in [-8, -4, 0, 4, 8]}

# 优化 3: 使用 Numba JIT 编译
from numba import njit

@njit
def mc_step_fast(spins, L, T):
    for _ in range(L * L):
        i = np.random.randint(0, L)
        j = np.random.randint(0, L)
        S = spins[i, j]
        nb = (spins[(i+1)%L, j] + spins[(i-1)%L, j] +
              spins[i, (j+1)%L] + spins[i, (j-1)%L])
        dE = 2 * S * nb
        if dE <= 0 or np.random.random() < np.exp(-dE / T):
            spins[i, j] = -S
```

:::tip 优化原则
1. **先 profiling，再优化**——用 `cProfile` 或 `line_profiler` 找到瓶颈
2. **向量化优先**——NumPy 操作比 Python 循环快 10-100 倍
3. **Numba/Cython 次之**——对无法向量化的热循环有效
4. **C/Fortran 扩展最后**——极端性能需求时考虑
:::

---

## 22.8 写文档与发布到 GitHub

### 写一个好的 README

````markdown
# 2D Ising Model Monte Carlo Simulation

A Python implementation of the 2D Ising model using
Metropolis and Wolff cluster algorithms.

## Features
- Metropolis single-spin-flip algorithm
- Wolff cluster algorithm
- Energy, magnetization, specific heat, susceptibility
- Finite-size scaling analysis

## Installation
```bash
git clone https://github.com/yourname/ising-mc.git
cd ising-mc
pip install -r requirements.txt
```

## Quick Start
```bash
python scripts/run.py --config configs/default.yaml
python scripts/plot.py --data data/output/
```

## Results
![Phase Diagram](results/figures/phase_diagram.png)

## References
- Onsager, L. (1944). Crystal Statistics.
- Newman, M. & Barkema, G. Monte Carlo Methods in Statistical Physics.
````

### 发布到 GitHub

```bash
# 初始化仓库
cd ising_project
git init
git add .
git commit -m "Initial commit: 2D Ising MC simulation"

# 创建 GitHub 仓库（使用 gh CLI）
gh repo create ising-mc --public --source=. --push

# 或手动添加远程仓库
git remote add origin https://github.com/yourname/ising-mc.git
git push -u origin main
```

---

## 22.9 一个完整示例路线 (2D Ising model)

以下是完整的开发路线图，展示从零到发布的全过程：

```
Week 1: MVP
├── Day 1: 搜索学习 Ising 模型和 Metropolis 算法
├── Day 2: 写 MVP 脚本（~50 行），验证能运行
├── Day 3: 加 print 输出，检查能量和磁化强度
├── Day 4: 对比解析解（1D）或文献值（2D 临界温度）
└── Day 5: 修 bug，确保物理结果合理

Week 2: 功能完善
├── Day 1: 加入 matplotlib 可视化
├── Day 2: 实现温度扫描，画相变曲线
├── Day 3: 写基本测试（极限情况）
├── Day 4: 重构为类和模块结构
└── Day 5: 加入配置文件（YAML）

Week 3: 优化与发布
├── Day 1: 性能 profiling，识别瓶颈
├── Day 2: NumPy 向量化或 Numba 加速
├── Day 3: 加入 Wolff cluster 算法
├── Day 4: 写 README，整理文档
└── Day 5: 发布到 GitHub
```

### 迭代过程可视化

```
        代码行数
  800 ┤                                    ╭──── v1.0 发布
      │                                 ╭──╯
  600 ┤                              ╭──╯
      │                           ╭──╯
  400 ┤                  重构   ╭──╯  加 Wolff
      │                  ╭──╯╭──╯
  200 ┤       加可视化╭──╯
      │           ╭──╯
   50 ┤  MVP ╭───╯
      │  ╭──╯
    0 ┼──╯─────────────────────────────────────
      Day1    5     10     15     20     25
```

### 每个阶段的验证标准

| 阶段 | 验证标准 | 通过条件 |
|------|---------|---------|
| MVP | 能跑、有输出 | 能量和磁化强度在合理范围 |
| 物理验证 | 结果正确 | T_c ≈ 2.269（2D 方格子） |
| 可视化 | 看得出相变 | 相变曲线与教科书一致 |
| 测试 | 自动化验证 | `pytest` 全部通过 |
| 性能 | 可以算大系统 | L=128 在几分钟内完成 |
| 发布 | 别人能用 | 按 README 步骤可以复现结果 |

---

## 常见问题

**Q: Vibe coding 会不会养成坏习惯？**
A: 不会，只要你在后期做重构和测试。关键是**不要永远停留在 MVP 阶段**。

**Q: AI 生成的代码能直接用吗？**
A: 必须验证。特别是涉及物理的部分——AI 可能搞错符号、边界条件或单位。

**Q: 一个人做的项目也需要写测试吗？**
A: 需要。测试不是给"别人"看的，是给"三个月后忘了细节的你"看的。

**Q: 应该从 Python 开始还是 C++？**
A: 科研项目推荐 Python 起步（开发速度快），性能瓶颈出现后再考虑 C/Fortran 重写核心部分。

---

## 小结

- **Vibe coding** 是一种适合科研项目的迭代式开发方式
- 核心流程：**Make it work → Make it right → Make it fast**
- AI 是有力的辅助工具，但**物理判断和代码验证**仍然靠你
- 从 MVP 开始，逐步添加测试、可视化、优化
- 最终目标是一个**可复现、有文档、可分享**的项目

---

## 练习

1. 选择一个本章推荐的物理问题，用 vibe coding 的方式写一个 MVP（不超过 100 行）
2. 用 AI 工具辅助你拆解任务——记录 AI 给出了什么建议，哪些有用，哪些需要修正
3. 为你的 MVP 添加至少 3 个测试（极限情况测试）
4. 对 MVP 进行一轮重构，拆分为至少 2 个文件
5. 写一个 README，发布到 GitHub（可以设为 private）
