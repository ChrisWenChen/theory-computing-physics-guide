---
sidebar_position: 19
sidebar_label: "19. Agent 辅助研究"
---

# 第 19 章：Agent 辅助研究：Claude Code 与 OpenCode

> Agent 是你的研究助手，不是你的替代品。理解你的研究，始终是你的责任。

## 本章目标

读完本章后，你应该能：

- 理解 Agent 与普通聊天机器人（Chatbox）的本质区别
- 安装和配置 Claude Code，了解 OpenCode 的定位
- 理解 Claude Code 的两种使用方式：订阅账户与 API key
- 认识到 Agent 不仅仅是编程工具——它能辅助公式推导、文献调研、LaTeX 写作等多种研究任务
- 识别 Agent 辅助研究的适用边界和局限
- 注意安全与费用问题

## 动机

作为理论与计算物理的研究生，你经常会遇到这样的情况：

- 一个长达两页的推导，不确定中间某步是否正确
- 接手师兄留下的几千行 Fortran 代码，看不懂
- 需要快速了解一个不熟悉的物理概念或数学方法
- 大量数据需要处理、绘图、格式转换，重复劳动耗时耗力
- LaTeX 编译报错，排版细节让人头疼

这些任务有一个共同特点：它们耗时但不一定需要创造性思维。Agent 可以在这些场景中大幅提高效率。但前提是——**你必须能理解和判断 Agent 给出的结果**。

## 19.1 Agent vs Chatbox：本质区别

你可能已经使用过 ChatGPT 网页版或 Claude 网页版。这些是**聊天界面（Chatbox）**——你在浏览器中输入问题，它给出回答。如果你想让它分析你的代码或数据，你需要手动复制粘贴。

**Agent**（如 Claude Code、OpenCode）则完全不同。它直接运行在你的终端中，能够：

- **主动读取你的文件**：不需要你复制粘贴，它可以直接查看你的代码、数据、论文草稿
- **执行命令**：编译代码、运行脚本、调用 Python 画图、执行 LaTeX 编译
- **编辑文件**：直接修改你的代码或文档，你可以实时看到差异
- **搜索代码库**：在数万行代码中快速定位某个函数或变量的定义和使用
- **理解项目上下文**：它知道你的目录结构、依赖关系、文件之间的调用链

简单来说：

| 方面 | Chatbox（ChatGPT 网页、Claude 网页） | Agent（Claude Code、OpenCode） |
|------|--------------------------------------|-------------------------------|
| 运行环境 | 浏览器 | 你的终端 |
| 访问文件 | 需要手动复制粘贴 | 直接读取你的文件系统 |
| 执行命令 | 不能 | 可以执行 shell 命令 |
| 修改代码 | 不能（只能给你看建议） | 可以直接编辑文件 |
| 上下文 | 仅限你粘贴的内容 | 整个项目目录 |
| 工作流 | 来回切换窗口 | 在终端中一站式完成 |

:::tip 关键理解
Agent 的核心优势不是"更聪明"，而是**它能直接与你的研究环境交互**。你不需要把代码一段段贴给它看——它自己会去读。你不需要手动执行它建议的命令——它可以直接运行并分析结果。这使得它在处理真实研究任务时效率远高于 Chatbox。
:::

## 19.2 Claude Code 是什么

Claude Code 是 Anthropic 推出的**命令行 Agent**。它直接在你的终端中运行，能够读取文件、执行命令、编辑代码、搜索项目，是目前最成熟的研究辅助 Agent 之一。

### 两种使用方式

Claude Code 提供两种访问方式：

**方式一：订阅账户（Max 计划）**

Anthropic 提供 Claude Max 订阅计划，按月付费，包含 Claude Code 使用额度。适合日常稳定使用的研究者。

```bash
# 首次运行时选择登录 Anthropic 账户
claude
# 按提示登录你的 Max 订阅账户即可
```

**方式二：API Key（按量计费）**

通过 Anthropic API key 使用，按实际消耗的 token 数量计费。适合偶尔使用或需要灵活控制用量的情况。

```bash
# 设置 API key
export ANTHROPIC_API_KEY="sk-ant-..."

# 添加到 shell 配置文件以持久化
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.bashrc
source ~/.bashrc
```

两种方式功能完全相同，选择适合你的即可。

## 19.3 OpenCode 是什么

OpenCode 是一个开源的终端 Agent 工具，灵感来自 Claude Code，但支持多种 AI 模型后端（Claude、GPT、本地模型等）。

### 与 Claude Code 的对比

| 方面 | Claude Code | OpenCode |
|------|-------------|----------|
| 开发者 | Anthropic（商业公司） | 开源社区 |
| 模型 | Claude（Anthropic） | 可配置多种模型 |
| 安装方式 | npm | go install 或下载二进制 |
| 代码 | 闭源 | 开源 |
| 成熟度 | 高 | 发展中 |
| 费用 | 订阅 或 API key | 取决于所用模型 |

## 19.4 不只是编程工具

:::info 核心观点
Agent 辅助研究**远不止写代码**。作为理论和计算物理的研究生，你可以把它用在研究工作的方方面面。
:::

### 公式推导与验证

你可以让 Agent 逐步验证你的推导，或者从头推导一个结果：

```bash
claude
> 请从 Hubbard 模型的哈密顿量出发，用平均场近似推导出自洽方程。
> 逐步写出每一步，特别注意 Hartree 项和 Fock 项的区别。
```

```bash
> 我在做 Matsubara 频率求和时，得到的结果和教科书不一致。
> 请帮我检查以下推导的每一步（推导在 notes/derivation.tex 中），
> 指出哪一步可能有误。
```

### 文献概念的搜索与总结

```bash
> 帮我解释 DMRG（密度矩阵重正化群）的基本思想，
> 特别是和 MPS（矩阵乘积态）的关系。
> 说明它适用于什么类型的问题，有什么限制。
```

```bash
> 解释 Keldysh 形式体系和 Matsubara 形式体系的区别，
> 各自在什么场景下使用。
```

### 理解复杂物理代码

```bash
> 分析一下 src/dmft_solver.f90 的整体结构，
> 找到自洽循环在哪里，解释每轮迭代做了什么。
```

```bash
> 这段 Julia 代码实现了什么物理模型？
> 识别其中的物理参数和它们的含义。
```

### 自动化重复性研究任务

**数据处理与绘图：**

```bash
> 读取 data/ 目录下所有 .csv 文件，
> 对每个文件的第二列做 Fourier 变换，
> 把功率谱画在同一张图上，用 matplotlib 保存为 PDF。
```

**格式转换：**

```bash
> 把 results/ 目录下的所有 .dat 文件（空格分隔）转换为 .csv 格式，
> 第一行加上列名：temperature, magnetization, susceptibility
```

**批量任务：**

```bash
> 帮我写一个脚本，对 L=8,16,32,64 四个系统尺寸
> 分别运行 ./ising_mc --size L --temp 2.269，
> 收集输出的比热值，画 finite-size scaling 图。
```

### LaTeX 写作与调试

```bash
> 我的 LaTeX 文件 paper.tex 编译报错：
> "Undefined control sequence \bm"
> 帮我找到问题并修复。
```

```bash
> 帮我把 paper.tex 中的 Results 部分的英文改得更地道，
> 保持学术论文的风格。注意不要改变任何公式和物理内容。
```

```bash
> 帮我给 figures/phase_diagram.pdf 写一段 LaTeX figure 环境的代码，
> caption 描述这是一个 Hubbard 模型在半填充时的相图，
> 横轴是 U/t，纵轴是温度。
```

## 19.5 安装

### 安装 Claude Code

前提条件：需要 Node.js 18+。

```bash
# 安装 Node.js（如果没有）
# macOS
brew install node

# Ubuntu / WSL
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

### 安装 OpenCode

```bash
# 使用官方安装脚本（推荐）
curl -fsSL https://opencode.ai/install | bash

# 或者下载预编译的二进制文件
# 访问 https://github.com/opencode-ai/opencode/releases

# 验证安装
opencode --version
```

## 19.6 登录与配置

### Claude Code

```bash
# 首次运行，按提示选择登录方式
claude

# 方式一：登录订阅账户（Max 计划）——按照终端提示操作

# 方式二：使用 API key
export ANTHROPIC_API_KEY="sk-ant-..."
```

:::caution API Key 安全
- **永远不要**把 API key 提交到 Git 仓库
- **永远不要**在共享的脚本或文档中明文写 API key
- 使用环境变量或专门的 secrets 管理工具
- 定期轮换你的 API key
:::

### OpenCode

```bash
# 支持多种模型后端
export ANTHROPIC_API_KEY="sk-ant-..."   # 使用 Claude
export OPENAI_API_KEY="sk-..."          # 使用 GPT

# 首次运行
opencode
```

## 19.7 正确的使用心态

:::caution 核心原则
Agent 可以帮你推导公式、分析代码、处理数据，但**不能替你理解物理**。如果你不理解结果背后的物理和数学，你就无法：
- 判断 Agent 给出的推导是否正确
- 发现数值计算中的稳定性问题
- 解释为什么结果不符合预期
- 在论文中为你的方法辩护
:::

| 正确 | 错误 |
|------|------|
| "帮我检查这个推导的第三步" | "帮我从头推导并直接写进论文" |
| "解释这段代码的物理含义" | "我不想看代码，Agent 说对就对" |
| "帮我把数据画成图" | "帮我分析数据并直接得出物理结论" |
| "这个 LaTeX 错误是什么意思" | "帮我写完整篇论文" |

### 不要跳过理解

```
错误做法：让 Agent 推导一个 Green's function 的解析延拓，直接抄到论文里

正确做法：
1. 先自己尝试推导
2. 卡住时让 Agent 解释关键步骤
3. 让 Agent 检查你的推导
4. 理解每一步之后再写入论文
```

### 不要用于需要原创性的工作

- 论文中的核心结论和物理 insight 应该来自你自己
- 审稿人可能会问你推导细节和物理直觉
- 使用 Agent 辅助没问题，但你必须能独立解释每一个步骤

:::caution 学术诚信
在课程作业中使用 Agent 辅助，请遵循你所在学校和课程的相关政策。即使允许使用，也要确保你理解最终提交的内容。
:::

## 19.8 一个科研辅助完整示例

假设你在研究二维 Ising 模型的相变，从师兄那里接手了一段蒙特卡洛代码。

### 第一步：理解代码结构

```bash
cd ~/research/ising_model
claude
> 分析这个项目的目录结构和主要文件的作用，
> 特别关注物理模型的实现和参数设置
```

### 第二步：理解核心算法的物理

```bash
> 详细解释 src/metropolis.c 中 metropolis_step 函数的物理含义，
> 包括详细平衡条件是如何满足的，
> 接受概率的表达式对应的是什么统计力学公式
```

### 第三步：验证一个推导

```bash
> 我想确认临界温度附近比热的 scaling 行为。
> 请从 Ising 模型的配分函数出发，
> 推导比热在 T_c 附近的 power-law 行为 C ~ |T-T_c|^{-alpha}，
> 告诉我 2D 情况下 alpha 的值
```

### 第四步：自动化数据分析

```bash
> 读取 output/ 目录下所有模拟结果文件，
> 提取温度和比热数据，
> 对不同系统尺寸 L=16,32,64 画在同一张图上，
> 标注 T_c=2.269 的位置，保存为 publication-quality 的 PDF
```

### 第五步：LaTeX 写作辅助

```bash
> 帮我在 paper/results.tex 中为刚才生成的图写一段描述，
> 说明 finite-size scaling 的结果与理论预期一致，
> 使用学术论文的规范写法
```

:::info 注意这个流程
每一步你都在**主动引导 Agent**，而不是被动等待。你提出物理问题，Agent 提供技术支持，你做判断和决策。这才是 Agent 辅助研究的正确方式。
:::

## 19.9 安全与费用注意事项

### 费用

| 工具 | 费用模式 |
|------|----------|
| Claude Code（Max 订阅） | 月费固定，包含一定使用额度 |
| Claude Code（API key） | 按 token 使用量计费 |
| OpenCode | 取决于后端模型；使用本地模型则免费 |

控制费用的建议：

1. **Max 订阅**适合日常高频使用，费用可预测
2. **API key** 适合偶尔使用，按需付费——记得在 Anthropic Console 设置月度限额
3. **避免发送大文件**：不要让 Agent 读取 GB 级别的数据文件，只发关键部分
4. **减少不必要的对话轮次**：一次性提供足够的上下文

### 安全

- **不要让 Agent 处理敏感数据**：未发表的关键结果、合作者的私有代码
- **注意 API 传输**：你的文件内容会发送到远程服务器
- **本地模型选项**：如果数据保密性要求高，考虑使用 OpenCode + 本地模型
- **审查 Agent 执行的命令**：Claude Code 可以执行 shell 命令，注意确认它要做什么

:::caution 保密数据
如果你的研究涉及保密数据、专利相关代码、或合作协议限制的内容，在使用在线 Agent 工具前请咨询你的导师和学校的相关政策。代码和数据一旦发送到 API，就可能被记录（取决于服务商的政策和你的使用条款）。
:::

### 推荐的安全实践

```bash
# 在 .gitignore 中排除 API key 相关文件
echo ".env" >> .gitignore
echo ".anthropic" >> .gitignore

# 使用 .env 文件管理 API key（不要提交到 Git）
echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env
```

## 常见问题

**Q: Agent 和网页版聊天有什么本质区别？**

A: Agent（如 Claude Code）直接运行在你的终端中，能读取项目文件、执行命令、编辑代码。网页版需要你手动粘贴内容，无法直接操作你的文件系统。这使得 Agent 在处理真实研究项目时效率高得多。

**Q: Agent 真的能帮助推导公式吗？**

A: 可以，而且效果很好。它能逐步展示推导过程，检查你的推导中的错误，或者用不同方法重新推导以供对比。但你必须具备判断推导正确性的能力——不要盲目相信任何一步。

**Q: Max 订阅和 API key 怎么选？**

A: 如果你每天都会使用，Max 订阅更划算且省心。如果你只是偶尔用用，API key 按量计费更灵活。两者功能完全相同。

**Q: 本地模型和云端模型哪个好？**

A: 云端模型（Claude、GPT-4）通常更强大，但有隐私和费用问题。本地模型（如通过 Ollama 运行）免费且私密，但性能较弱。对于需要深度推理的研究任务，目前云端模型明显更好。

**Q: 我的研究方向比较小众，Agent 能理解吗？**

A: 对于主流的物理和数学概念，Agent 的理解相当准确。对于非常前沿或小众的方向，它可能会犯错或给出模糊的回答。这正是你需要保持专业判断力的原因。关键是：越小众的领域，你越需要仔细验证 Agent 的输出。

**Q: 费用大概多少？**

A: Max 订阅按月收费（具体价格请查阅 Anthropic 官网）。API key 按量计费，日常使用（每天几十次交互）大约每月 10-30 美元。建议设置月度上限，避免意外高额账单。

## 小结

- Agent 和 Chatbox 有本质区别：Agent 能**直接与你的研究环境交互**
- Claude Code 支持**订阅账户**和 **API key** 两种使用方式
- Agent 辅助研究**不仅限于编程**——公式推导、文献调研、数据处理、LaTeX 写作都可以
- 最佳使用场景：理解代码、验证推导、自动化重复任务、调试排错
- 不适合：替代你的物理理解、盲目接受结果、处理敏感数据
- 始终记住：**理解是你的责任，Agent 只是工具**

## 练习

1. 安装 Claude Code，让它解释本教程中任一章节的示例代码
2. 选一个你熟悉的物理公式（如谐振子的能级），让 Agent 从头推导，检查它的每一步是否正确
3. 找一段你之前写的代码或 LaTeX 文档，让 Agent 指出可能的改进点，评估其建议是否合理
4. 让 Agent 帮你处理一组数据：读取、清洗、画图，观察它的工作流程
5. （可选）用 OpenCode 配置一个本地模型，比较与云端模型在推导物理公式时的差异
