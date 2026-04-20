---
sidebar_position: 2
sidebar_label: "2. 终端、Shell 与命令行"
---

# 第 2 章：终端、Shell 与命令行

> 命令行是科研计算的"方向盘"——你可以不喜欢它，但必须会用它。

## 本章目标

学完本章后，你应该能：

- 打开终端并输入命令
- 解释 Shell 的作用，区分 bash、zsh、PowerShell
- 使用基本命令进行文件操作（创建、移动、复制、删除）
- 查看文件内容
- 使用 `find` 和 `grep` 搜索文件和内容
- 理解 PATH 环境变量的作用
- 使用管道和重定向组合命令

## 动机

为什么要用命令行？用图形界面不好吗？

1. **服务器没有图形界面**：通过 SSH 连接到超算时，你只有命令行
2. **批量操作**：重命名 1000 个文件，命令行一行搞定，图形界面需要点击 1000 次
3. **可重复性**：把命令写成脚本，任何人都能复现你的操作
4. **自动化**：提交 100 个计算任务、定时备份数据，都需要命令行
5. **速度**：熟练后，命令行比图形界面快得多

## 2.1 什么是终端

**终端 (Terminal)** 是一个让你输入文字命令来与计算机交互的程序。

### 如何打开终端

**macOS：**
- `Command + Space`，输入 `Terminal`，回车
- 或者在 `应用程序 → 实用工具 → 终端`
- 推荐使用 [iTerm2](https://iterm2.com/) 替代自带终端：支持分屏、全局快捷键、强大的搜索与自动补全、配色主题管理，长期重度使用会明显更顺手

**Ubuntu：**
- `Ctrl + Alt + T`
- 或在应用菜单中搜索 Terminal

**Windows：**
- 搜索并打开 `Windows Terminal`（推荐）
- 或者搜索 `PowerShell`
- 如果已安装 WSL，在 Windows Terminal 中可以选择 Ubuntu 标签页

打开终端后，你会看到类似这样的界面：

```bash
student@laptop:~$
```

这叫做**提示符 (prompt)**，它在等待你输入命令。别小看这一行字符，它其实把你的当前状态交代得很清楚：

| 片段 | 含义 |
|------|------|
| `student` | 当前**用户名** |
| `@` | 分隔符，读作"at" |
| `laptop` | **主机名**——你登录的这台机器的名字（SSH 到远程服务器后会变成服务器名） |
| `:` | 分隔符 |
| `~` | 当前**工作目录**；`~` 是家目录的简写（`/home/student` 或 `/Users/student`） |
| `$` | 提示符尾字符——普通用户是 `$`，root 用户是 `#`；zsh 常用 `%` |

所以 `student@laptop:~$` 读作：*用户 student 正在主机 laptop 上，当前位于家目录，等待输入*。SSH 连上服务器后提示符会变成 `student@hpc-login-01:~$`，一眼就能看出自己现在在哪台机器、哪个目录——这在同时开多个窗口时非常有用。

## 2.2 什么是 Shell

Shell 是一个**命令解释器**。当你在终端里输入一条命令时，Shell 负责读取、解析并执行它。

例如，你输入：

```bash
pwd
```

Shell 会运行这条命令，并把结果显示出来。

要注意，Shell 和终端**不是同一个东西**：

- **终端（Terminal）**：你输入命令、查看结果的界面
- **Shell**：在这个界面里工作的解释器

可以这样理解：

> 终端 = 聊天窗口，Shell = 帮你听懂并执行指令的人

常见的 Shell：

| Shell | 系统 | 说明 |
|-------|------|------|
| **bash** | Linux 默认 | 最通用，几乎所有 Linux 系统都有 |
| **zsh** | macOS 默认 | bash 的增强版，功能更多 |
| **PowerShell** | Windows 默认 | 语法与 bash 差异较大 |
| **cmd** | Windows 传统 | 功能有限，科研中较少使用 |

:::tip Windows 用户建议
推荐安装 WSL，在其中使用 bash/zsh，这样你可以和 macOS/Linux 用户使用同样的命令。**本教程后续默认使用 bash 语法。**
:::

### 查看当前使用的 Shell

```bash
echo $SHELL
# 输出示例: /bin/bash 或 /bin/zsh
```

## 2.3 CLI 与 GUI 的区别

| 特性 | CLI (命令行界面) | GUI (图形用户界面) |
|------|-----------------|-------------------|
| 交互方式 | 输入文字命令 | 鼠标点击 |
| 学习曲线 | 较陡 | 较平缓 |
| 批量操作 | 非常方便 | 较困难 |
| 远程使用 | 方便（SSH） | 往往需要额外工具 |
| 可脚本化 | 天然支持 | 较难 |
| 精确控制 | 高 | 中 |

在科研中，两者通常是**互补**的：你可能会用 GUI 编辑器写代码，但用 CLI 编译、运行、调试和批量处理数据。

:::info GUI 编辑器 ≠ 一般的 GUI
上表里的"GUI"指的是**文件管理器、图形操作界面**那一类——用鼠标点图标、拖窗口。而 "GUI 编辑器" 如 VS Code 是**专门写代码的图形工具**，它内部集成了 CLI（终端面板），可以一边用鼠标编辑文本，一边在下方终端里用命令行跑代码。所以"用 GUI 编辑器写代码 + 用 CLI 运行"并不矛盾——VS Code 就是典型的一份工具同时满足两种交互方式。
:::

### 例子：处理实验数据

假设你做了 100 次实验，每次都生成一个数据文件。

**用 GUI 的方式**，你可能需要：打开文件夹 → 一个个点开文件 → 手动复制、重命名、整理 → 再导入分析软件。直观，但文件一多就慢且容易出错。

**用 CLI 的方式**，三条命令搞定：

```bash
mkdir results          # 创建结果文件夹
mv *.csv results/      # 把所有 CSV 文件移进去
wc -l results/*.csv    # 统计每个文件的行数
```

如果需要重复执行，还可以把这些命令写成脚本，下次直接运行。

### 例子：本地编辑 + 远程运行

你在本地用 VS Code（GUI）写好程序，然后用 CLI 完成后续步骤：

```bash
gcc main.c -o main     # 编译
./main                 # 运行

ssh user@server        # 登录远程服务器继续操作
```

:::tip AI 时代的 CLI
现在有了 AI 编程助手（如 Claude、GitHub Copilot），CLI 变得更容易上手——你可以直接用自然语言描述你想做的事，让 AI 帮你生成命令，再复制到终端执行。**理解 CLI 的基本概念，是高效使用 AI 助手的前提。**
:::

## 2.4 基本命令：pwd, ls, cd, mkdir, cp, mv, rm

### pwd —— 显示当前目录

```bash
pwd
# 输出: /home/student
```

`pwd` = **p**rint **w**orking **d**irectory。在任何时候忘了自己在哪，就用 `pwd`。

### ls —— 列出目录内容

```bash
ls              # 列出当前目录的文件和子目录
ls -l           # 详细信息（权限、大小、日期）
ls -la          # 包括隐藏文件（以 . 开头的文件）
ls -lh          # 人类可读的文件大小（KB, MB, GB）
ls research/    # 列出指定目录（research）的内容
```

示例输出：

```
$ ls -lh
total 12K
drwxr-xr-x 2 student student 4.0K Jan 15 10:30 data
-rw-r--r-- 1 student student  856 Jan 15 09:20 simulation.py
-rw-r--r-- 1 student student 2.1K Jan 14 16:45 analysis.py
```

### cd —— 切换目录

```bash
cd research           # 进入子目录（research）
cd /home/student      # 进入绝对路径指定的目录（/home/student）
cd ..                 # 返回上一级目录
cd ~                  # 回到家（Home）目录
cd -                  # 回到上一次所在的目录
```

:::caution 常见错误
```bash
cd research/data.txt   # 错误！cd 只能进入目录，不能"进入"文件
```
:::

### mkdir —— 创建目录

```bash
mkdir my_project                  # 创建一个目录
mkdir -p project/src/utils        # 创建多级嵌套目录（-p 自动创建中间目录）
```

### cp —— 复制文件或目录

```bash
cp file1.txt file2.txt            # 将 file1.txt 复制一份为 file2.txt
cp file.txt backup/               # 复制 file.txt 到另一个目录（backup）
cp -r src_dir/ dest_dir/          # 将 src_dir 及其全部子目录、文件递归复制到 dest_dir（-r = recursive）
```

### mv —— 移动或重命名

```bash
mv old_name.py new_name.py        # 重命名文件（把 old_name.py 改名为 new_name.py）
mv data.csv results/              # 移动文件 data.csv 到另一个目录（results）
mv *.py scripts/                  # 移动所有以 .py 为扩展名的文件到另一个目录（scripts）
```

### rm —— 删除文件或目录

```bash
rm unwanted_file.txt              # 删除文件
rm -r old_project/                # 删除目录及其内容
rm -i important_file.txt          # 删除前确认（推荐）
```

:::danger rm 没有回收站！
`rm` 删除的文件**不会**进入回收站，几乎无法恢复。使用 `rm -r` 时一定要仔细检查路径。

**永远不要执行 `rm -rf /` 或 `rm -rf ~`**，这会删除整个系统或你的所有文件。
:::

### 终端内的光标、历史与补全

新手最大的困惑之一是：**为什么在终端里不能像在 Word 里那样用鼠标点到某个位置修改？** 终端的光标几乎全靠键盘操作，但一旦熟悉这些快捷键，编辑命令会比图形编辑器还快。

**光标移动与编辑：**

| 快捷键 | 作用 |
|--------|------|
| `Ctrl + A` | 跳到行首 |
| `Ctrl + E` | 跳到行尾 |
| `Alt + B` / `Alt + F` | 按"词"向前 / 向后跳（Mac 上可能是 `Esc + B/F`） |
| `Ctrl + U` | 删除光标左侧到行首的全部内容 |
| `Ctrl + K` | 删除光标右侧到行尾的全部内容 |
| `Ctrl + W` | 删除光标左侧一个词 |
| `Ctrl + L` | 清屏（等价于 `clear`） |
| `Ctrl + C` | 中断当前输入或正在运行的命令 |
| `Ctrl + D` | 在空行上按：退出当前 Shell |

想修改刚输入长命令的开头？不用按几十次 `←`——`Ctrl + A` 一步到位。

**历史命令：**

| 快捷键 / 命令 | 作用 |
|---------------|------|
| `↑` / `↓` | 上下翻看历史命令 |
| `Ctrl + R` | 反向搜索历史（输入关键词会模糊匹配） |
| `!!` | 重复上一条命令 |
| `!grep` | 重复最近一条以 `grep` 开头的命令 |
| `history` | 列出命令历史 |

:::tip Tab 补全是最重要的快捷键
输入命令或路径时按 **Tab**：Shell 会自动补全文件名、目录名、命令名。

- 按一次：唯一匹配时直接补全
- 按两次：列出所有可能的匹配

这个习惯能让你少打 80% 的字符，还能避免拼错文件名。
:::

### 实用组合示例

```bash
# 为新项目创建标准目录结构
mkdir -p monte_carlo/{src,data,results,figures,docs}

# 查看刚创建的结构
ls monte_carlo/
# 输出: data  docs  figures  results  src
```

## 2.5 查看文件内容：cat, less, head, tail

### cat —— 输出整个文件内容

```bash
cat params.txt               # 显示文件全部内容
cat file1.txt file2.txt      # 依次显示多个文件
```

适合查看小文件。对于大文件，请用 `less`。

### less —— 分页查看

```bash
less large_output.log
```

在 `less` 中的操作：
- `空格` 或 `f`：翻下一页
- `b`：翻上一页
- `/keyword`：搜索 keyword
- `q`：退出

### head 和 tail —— 查看开头和结尾

```bash
head -n 20 data.csv           # 查看前 20 行
tail -n 10 simulation.log     # 查看最后 10 行
tail -f simulation.log        # 实时追踪文件末尾（看日志非常有用）
```

:::tip 科研实用场景
模拟程序运行时，用 `tail -f` 实时查看输出日志，监控运行进度：
```bash
tail -f output.log
# 按 Ctrl+C 停止追踪
```
:::

## 2.6 查找与通配符：find, grep, wildcard

### 通配符 (Wildcards)

```bash
ls *.py                    # 所有 .py 文件（* 匹配任意字符，包括空）
ls data_?.csv              # data_1.csv, data_2.csv ...（? 匹配"恰好一个"任意字符）
ls result_[0-9]*.dat       # result_0.dat, result_123.dat ...
                           # [0-9] 匹配"恰好一个"数字字符；紧随其后的 * 匹配任意字符
                           # 所以整体 = 以 result_ 开头、紧跟一个数字、后面可有任意字符、以 .dat 结尾
```

三者的关键区别：

| 模式 | 含义 | 匹配例子 |
|------|------|---------|
| `*` | 任意多个（含 0 个）任意字符 | `a`, `abc`, `` |
| `?` | 恰好 1 个任意字符 | `a`, `1`，但不匹配 `ab` |
| `[0-9]` | 恰好 1 个在指定范围内的字符 | `3`，但不匹配 `a` |
| `[0-9]*` | 1 个数字 + 任意字符 | `3abc`, `7` |

### find —— 按条件查找文件

```bash
# 查找当前目录及子目录中所有 .py 文件
find . -name "*.py"

# 查找大于 100 MB 的文件
find . -size +100M

# 查找最近 7 天修改过的文件
find . -mtime -7 -name "*.dat"
```

### grep —— 在文件内容中搜索

```bash
# 在文件中搜索关键词
grep "energy" output.log

# 递归搜索目录中所有文件
grep -r "convergence" results/

# 显示匹配行的行号
grep -n "error" simulation.log

# 忽略大小写
grep -i "warning" output.log
```

:::tip grep 是科研中的"瑞士军刀"
想知道哪个文件里定义了某个变量？想在大量日志中找到错误信息？`grep` 是你最好的朋友。

```bash
# 在所有源码文件中搜索特定函数
grep -r "def calculate_energy" *.py
```
:::

## 2.7 环境变量 PATH 是什么

当你在终端中输入一个命令，例如：

```bash
python
```

Shell 需要先找到 `python` 这个程序实际存放在磁盘上的位置，才能执行它。**PATH** 就是一个环境变量，它保存了一组用于查找可执行程序的目录。

> 你可以把 PATH 理解为：Shell 查找命令时使用的目录列表。

### 查看 PATH

```bash
echo $PATH
```

输出示例：

```
/usr/local/bin:/usr/bin:/bin:/home/student/.local/bin
```

这些目录之间用 `:` 分隔。当你输入一个命令时，Shell 会**从左到右**依次在这些目录中查找同名程序。

例如输入 `python`，Shell 可能依次检查：

```
/usr/local/bin/python
/usr/bin/python
/bin/python
/home/student/.local/bin/python
```

找到了就执行；如果所有目录中都没有，就会报：

```
command not found
```

### 查看命令的实际位置

```bash
which python
```

输出示例：

```
/usr/bin/python
```

这表示当前默认执行的 `python` 来自 `/usr/bin/python`。

### 为什么 PATH 很重要？

- 它决定一个命令能否直接运行
- 程序已安装但不在 PATH 中时，可能出现 `command not found`
- 当系统中存在多个同名程序时，PATH 的顺序决定默认使用哪一个

### 修改 PATH

临时添加目录到 PATH：

```bash
export PATH="/new/software/bin:$PATH"
```

永久添加（以 bash 为例）：

```bash
echo 'export PATH="/new/software/bin:$PATH"' >> ~/.bashrc
```

## 2.8 命令帮助：man, --help

遇到不认识的命令，或者忘了某个选项怎么用？

```bash
# 查看命令的手册页（man page）
man ls
man grep

# 快速查看帮助信息
ls --help
python --help
```

在 `man` 页面中，操作方式和 `less` 相同（空格翻页，`q` 退出）。

:::info 养成查文档的习惯
比起搜索引擎，`man` 和 `--help` 往往能更快给你准确答案。先查文档，再上网搜。
:::

## 2.9 终端中的重定向与管道

### 重定向 (Redirection)

将命令的输出写入文件，而不是显示在屏幕上。

```bash
# 将输出写入文件（覆盖已有内容）
ls -l > file_list.txt

# 将输出追加到文件末尾
echo "simulation done" >> log.txt

# 将错误输出重定向到文件
python script.py 2> errors.log

# 同时重定向标准输出和错误输出
python script.py > output.log 2>&1
```

### 管道 (Pipe)

管道使用符号 `|` 表示，它会把前一个命令的标准输出直接交给后一个命令的标准输入——也就是说，前一个命令产生的数据不再直接显示到屏幕，而是作为下一个命令要处理的内容。

> 你可以把管道理解成一条"数据处理流水线"：前一个命令负责产生数据，后一个命令负责进一步筛选、统计或加工。

例如：

```bash
ps aux | grep python
```

含义：`ps aux` 列出所有进程，`grep python` 从中筛选出包含 `python` 的行。

再例如：

```bash
find . -name "*.py" | wc -l
```

含义：`find` 找出所有 `.py` 文件，`wc -l` 统计共有多少个。

管道特别适合把多个简单命令连接起来逐步完成复杂任务——先查找、再筛选、再排序、最后只保留前几项：

```bash
du -sh * | sort -rh | head -10
```

含义：查看当前目录各项占用空间，按大小从大到小排序，只显示前 10 个。

管道是命令行最强大的特性之一，因为它允许你像搭积木一样，把许多小而专一的命令组合成一个完整的数据处理流程。

### 科研实用示例

```bash
# 从大量输出文件中提取最终能量值
grep "Total Energy" output_*.log | sort -t= -k2 -n

# 统计代码行数
find . -name "*.py" -exec wc -l {} + | sort -n | tail

# 查找所有包含 NaN 的数据文件
grep -l "nan" data_*.csv
```

## 2.10 新手常见错误

### 错误 1：路径中有空格

```bash
# 错误
cd My Documents

# 正确
cd "My Documents"
cd My\ Documents
```

:::tip 建议
在命名文件和目录时，**避免使用空格**。用下划线 `_` 或连字符 `-` 代替。
```
# 推荐
monte_carlo_simulation/
ising-model/

# 不推荐
monte carlo simulation/
```
:::

### 错误 2：混淆文件和目录

```bash
# 想查看文件内容，但 research 是一个目录
cat research      # 错误：cat 不能查看目录

# 想进入目录，但 data.csv 是一个文件
cd data.csv       # 错误：不能 cd 到文件
```

### 错误 3：在错误的目录中执行命令

```bash
# 你以为自己在项目目录中，但实际上在家目录
rm -r data/   # 这会删除家目录下的 data/，而不是项目的 data/
```

**养成习惯：执行重要操作前先 `pwd` 确认当前位置。**

### 错误 4：忘记转义特殊字符

```bash
# 搜索包含 * 号的行
grep "E*" file.txt          # 错误：* 在 regex 中有特殊含义
grep "E\*" file.txt         # 正确：用 \ 转义
grep -F "E*" file.txt       # 正确：用 -F 表示固定字符串匹配
```

### 错误 5：Windows 换行符问题

如果你在 Windows 上编辑的脚本在 Linux 上运行出错，可能是因为换行符不同：

```bash
# 检查文件的换行符格式
file script.sh
# 如果显示 "CRLF"，需要转换

# 转换为 Unix 格式
dos2unix script.sh
# 或者
sed -i 's/\r$//' script.sh
```

## 常见问题

**Q：命令行和图形界面我应该用哪个？**

A：日常使用可以用图形界面，但科研计算必须掌握命令行。远程连接服务器时，你只有命令行。

**Q：这么多命令要背吗？**

A：不需要背。常用的（`cd`, `ls`, `cp`, `mv`, `rm`, `grep`）用几次就记住了。不常用的用 `man` 或 `--help` 查就行。

**Q：PowerShell 的命令和 bash 不一样，怎么办？**

A：安装 WSL 后，你可以在 Windows 上使用 bash。本教程后续章节会指导你完成安装。

## 小结

- 终端是窗口，Shell 是解释器，bash/zsh 是最常用的 Shell
- 核心文件操作命令：`pwd`, `ls`, `cd`, `mkdir`, `cp`, `mv`, `rm`
- 查看文件：`cat`（小文件），`less`（大文件），`head`/`tail`（看头尾）
- 搜索：`find`（找文件），`grep`（搜内容），通配符（模式匹配）
- PATH 决定了 Shell 在哪里找命令
- 管道 `|` 和重定向 `>` 是组合命令的核心机制
- 善用 `man` 和 `--help` 查看文档

## 练习

### 练习 2.1：基本文件操作

在你的家目录下完成以下操作：

1. 创建目录结构 `physics_lab/experiment_01/{raw_data,analysis,plots}`
2. 在 `raw_data/` 中创建三个空文件：`run_1.dat`, `run_2.dat`, `run_3.dat`（提示：使用 `touch` 命令）
3. 将 `run_1.dat` 复制为 `run_1_backup.dat`
4. 将 `run_3.dat` 移动到 `analysis/` 目录
5. 列出 `physics_lab/` 下所有文件和目录（递归）
6. 删除整个 `physics_lab/` 目录

<details>
<summary>参考答案</summary>

```bash
# 1. 一条命令创建三个同级子目录（花括号展开）
mkdir -p physics_lab/experiment_01/{raw_data,analysis,plots}

# 2. 进入 raw_data 后批量创建空文件
cd physics_lab/experiment_01/raw_data
touch run_1.dat run_2.dat run_3.dat
# 也可以用花括号范围展开：touch run_{1..3}.dat
# {N1..N2} 生成起点为 N1、步长为 1、终点为 N2 的序列

# 3. 复制
cp run_1.dat run_1_backup.dat

# 4. 移动到上级的 analysis/
mv run_3.dat ../analysis/

# 5. 回到家目录后用 find 递归列出
cd ~
find physics_lab
# 或者直接在任意目录：ls -R physics_lab/

# 6. 递归删除整个目录
rm -r physics_lab/
```

注意：`cp` 是复制，`mv` 是移动——第 3 题用 `cp`（保留原文件），第 4 题用 `mv`（原位置不再保留）。

</details>

### 练习 2.2：grep 实战

创建一个文件 `energies.log`，包含以下内容：

```
Step 1: Total Energy = -3.456 eV
Step 2: Total Energy = -3.461 eV
Step 3: Total Energy = -3.459 eV
WARNING: convergence not reached
Step 4: Total Energy = -3.462 eV
Step 5: Total Energy = -3.462 eV
INFO: convergence reached
```

然后：

1. 找出所有包含 "Energy" 的行
2. 找出所有包含 "WARNING" 或 "ERROR" 的行
3. 统计包含 "Energy" 的行数
4. 提取最后一步的能量值

<details>
<summary>参考答案</summary>

```bash
# 1. 直接搜索关键词
grep "Energy" energies.log

# 2. 用扩展正则 -E，| 表示"或"
grep -E "WARNING|ERROR" energies.log
# 也可以：grep -e "WARNING" -e "ERROR" energies.log

# 3. 统计匹配行数，两种等价写法
grep -c "Energy" energies.log
grep "Energy" energies.log | wc -l

# 4. 先过滤出 Energy 行，再取最后一行
grep "Energy" energies.log | tail -1
# 注意：管道符号是 | （ASCII 竖线），不是中文全角的 ｜
```

</details>

### 练习 2.3：管道组合

1. 使用一行命令统计当前目录及子目录中有多少个 `.py` 文件
2. 列出当前目录中最大的 5 个文件
3. 查看你的 PATH 中有多少个目录（提示：`echo $PATH | tr ':' '\n' | wc -l`）

<details>
<summary>参考答案</summary>

```bash
# 1. find 输出每个文件一行，wc -l 数行数
find . -name "*.py" | wc -l

# 2. du -sh 列出各项占用空间，sort -rh 按"人类可读大小"从大到小排序，head 取前 N 个
du -sh * | sort -rh | head -5

# 3. PATH 用 : 分隔，用 tr 把 : 换成换行，再 wc -l 数行
echo $PATH | tr ':' '\n' | wc -l
```

这三题体现了管道的核心思路：**每个命令只做一件事，用管道串起来完成复杂任务**——`find` 负责找，`wc` 负责数；`du` 负责算大小，`sort` 负责排序，`head` 负责取前几。

</details>

### 练习 2.4：命令探索

使用 `man` 或 `--help` 找出：

1. `ls` 的哪个选项可以按修改时间排序？
2. `grep` 的哪个选项可以只显示匹配的文件名而不显示具体内容？
3. `find` 如何查找空目录？

<details>
<summary>参考答案</summary>

```bash
# 1. -t 按修改时间排序（最新在前）；配合 -r 可反转顺序
ls -t
ls -lt        # 同时显示详细信息
ls -tr        # 最旧在前

# 2. -l 只列出含匹配内容的文件名
grep -l "pattern" *.py

# 3. -empty 筛选空文件或空目录，配合 -type d 只保留目录
find . -type d -empty
```

查文档的正规姿势：

```bash
man ls | grep -A1 -- '-t'    # 在 man 里定位到 -t 选项的说明
grep --help | less           # 浏览完整帮助
```

</details>
