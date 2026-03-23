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
- 推荐使用 [iTerm2](https://iterm2.com/) 替代自带终端

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

这叫做**提示符 (prompt)**，它在等待你输入命令。

## 2.2 什么是 Shell

**Shell** 是终端背后真正解释和执行你输入的命令的程序。终端只是"窗口"，Shell 才是"大脑"。

| Shell | 系统 | 说明 |
|-------|------|------|
| **bash** | Linux 默认 | 最通用，几乎所有 Linux 系统都有 |
| **zsh** | macOS 默认 | bash 的增强版，功能更多 |
| **PowerShell** | Windows 默认 | 语法与 bash 差异较大 |

:::tip 建议
如果你使用 Windows，强烈建议安装 WSL 并使用 bash/zsh，这样你可以和 macOS/Linux 用户使用同样的命令。本教程的命令示例默认使用 bash 语法。
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
| 批量操作 | 非常方便 | 困难 |
| 远程使用 | 方便（SSH） | 需要额外工具 |
| 可脚本化 | 天然支持 | 很难 |
| 精确控制 | 高 | 中 |

**在科研中，两者互补使用**。你可能用 GUI 的编辑器写代码，但用 CLI 编译和运行它。

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
ls research/    # 列出指定目录的内容
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
cd research           # 进入 research 子目录
cd /home/student      # 进入绝对路径指定的目录
cd ..                 # 返回上一级目录
cd ~                  # 回到家目录
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
cp file1.txt file2.txt            # 复制文件
cp file.txt backup/               # 复制到另一个目录
cp -r src_dir/ dest_dir/          # 复制整个目录（需要 -r）
```

### mv —— 移动或重命名

```bash
mv old_name.py new_name.py        # 重命名文件
mv data.csv results/              # 移动文件到另一个目录
mv *.py scripts/                  # 移动所有 .py 文件
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
ls *.py                    # 所有 .py 文件
ls data_?.csv              # data_1.csv, data_2.csv, ... (? 匹配单个字符)
ls result_[0-9]*.dat       # result_0.dat, result_123.dat, ...
```

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

当你输入一个命令（比如 `python`），Shell 需要知道 `python` 这个程序在磁盘上的哪个位置。它是通过 **PATH 环境变量**来查找的。

```bash
# 查看 PATH
echo $PATH
# 输出示例:
# /usr/local/bin:/usr/bin:/bin:/home/student/.local/bin
```

PATH 是一系列目录，用 `:` 分隔。当你输入 `python` 时，Shell 会依次在这些目录中查找名为 `python` 的程序。

### 查看命令的实际位置

```bash
which python
# 输出: /usr/bin/python

which gcc
# 输出: /usr/local/bin/gcc
```

### 为什么 PATH 很重要？

- `command not found` 错误通常意味着程序没有安装，或者安装了但其路径不在 PATH 中
- 安装新软件后，有时需要将其路径添加到 PATH
- 当你有多个版本的同一程序时，PATH 中的顺序决定了默认使用哪个

```bash
# 临时添加路径到 PATH
export PATH="/new/software/bin:$PATH"

# 永久添加（写入配置文件）
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

用 `|` 将一个命令的输出作为另一个命令的输入。

```bash
# 查看进程中包含 python 的
ps aux | grep python

# 统计源码文件的数量
find . -name "*.py" | wc -l

# 查看占用空间最大的文件
du -sh * | sort -rh | head -10

# 在输出中搜索特定内容
cat simulation.log | grep "energy" | tail -5
```

管道是命令行最强大的特性之一——它让你像搭积木一样组合简单命令来完成复杂任务。

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

### 练习 2.3：管道组合

1. 使用一行命令统计当前目录及子目录中有多少个 `.py` 文件
2. 列出当前目录中最大的 5 个文件
3. 查看你的 PATH 中有多少个目录（提示：`echo $PATH | tr ':' '\n' | wc -l`）

### 练习 2.4：命令探索

使用 `man` 或 `--help` 找出：

1. `ls` 的哪个选项可以按修改时间排序？
2. `grep` 的哪个选项可以只显示匹配的文件名而不显示具体内容？
3. `find` 如何查找空目录？
