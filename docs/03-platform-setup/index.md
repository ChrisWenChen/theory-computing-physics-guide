---
sidebar_position: 3
sidebar_label: "3. 三个平台的环境准备"
---

# 第 3 章：三个平台的环境准备

> 磨刀不误砍柴工——花半天时间配好环境，省下未来无数小时的折腾。

## 本章目标

学完本章后，你应该能：

- 了解 macOS、Ubuntu 和 Windows 各自的优缺点
- 根据自己的需求选择合适的平台
- 在 Windows 上安装和配置 WSL
- 理解不同平台在文件系统、路径和权限方面的差异
- 处理跨平台文件时的常见问题

## 动机

选择和配置操作系统是你科研计算之旅的第一步。不同平台各有优劣，没有"最好的"，只有"最适合你的"。更重要的是，你需要理解平台之间的差异，因为你的代码很可能需要在不同平台上运行——比如在自己的 Mac 上开发，在 Linux 服务器上运行。

## 3.1 macOS 的特点与建议

### 优势

- **类 Unix 系统**：macOS 基于 Darwin（BSD Unix），自带完整的终端和 Shell 环境
- **开发体验好**：大量开发工具原生支持 macOS
- **硬件质量高**：Apple Silicon (M 系列) 芯片性能强劲，续航出色
- **图形界面优秀**：日常使用体验流畅

### 注意事项

- macOS 不自带 gcc 等编译器，需要安装 **Xcode Command Line Tools**
- 软件安装推荐使用 **Homebrew** 包管理器
- M 系列芯片是 ARM 架构，少数老旧软件可能需要通过 Rosetta 2 转译运行
- 不支持Intel oneAPI

### 初始配置步骤

```bash
# 1. 安装 Xcode Command Line Tools
xcode-select --install

# 2. 安装 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 3. 验证安装
brew --version
gcc --version
git --version
```

### 推荐安装的工具

```bash
brew install wget tree htop
brew install --cask iterm2 visual-studio-code
```

:::tip macOS 用户的好消息
macOS 的终端命令与 Linux 几乎完全兼容。本教程中的大部分命令你都可以直接使用，无需任何额外配置。
:::

## 3.2 Ubuntu 的特点与建议

### 优势

- **科研计算的黄金标准**：服务器和超算几乎都用 Linux
- **软件支持最广**：科学计算软件通常优先支持 Linux
- **完全免费开源**：无需任何授权费用
- **包管理器强大**：`apt` 可以一行命令安装大部分软件
- **资源占用低**：相同硬件上比 Windows 和 macOS 运行更快

### 注意事项

- 桌面环境的美观度和易用性不如 macOS 和 Windows
- 某些商业软件（如 Office、Adobe 系列）没有 Linux 版本
- 硬件驱动（尤其是显卡和 Wi-Fi）偶尔需要手动配置
- 建议使用 **Ubuntu LTS**（长期支持版本），稳定可靠

### 初始配置步骤

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装基本开发工具
sudo apt install -y build-essential git curl wget vim

# 3. 安装常用工具
sudo apt install -y tree htop net-tools

# 4. 验证安装
gcc --version
git --version
python3 --version
```

### Ubuntu 版本选择

| 版本 | 类型 | 支持周期 | 建议 |
|------|------|---------|------|
| Ubuntu 24.04 LTS | 长期支持 | 5 年 | 推荐 |
| Ubuntu 22.04 LTS | 长期支持 | 5 年 | 稳定可靠 |
| Ubuntu 非 LTS 版 | 常规 | 9 个月 | 不建议用于科研 |

## 3.3 Windows 的特点与建议

### 优势

- **用户最多**：最常用的系统
- **软件生态丰富**：Office、各种商业软件支持良好
- **游戏和日常使用**：体验最好
- **WSL 的出现**：彻底改善了 Windows 上的科研计算体验

### 注意事项

- 原生 Windows 的命令行（cmd、PowerShell）与 Linux/macOS 差异很大
- 文件路径使用反斜杠 `\`，与 Unix 系统的 `/` 不同
- 换行符是 `\r\n`（CRLF），而 Unix 系统是 `\n`（LF），常导致跨平台问题
- **强烈建议安装 WSL**，在 Windows 中获得完整的 Linux 环境

### Windows Terminal

Windows 11 自带 Windows Terminal，是一个现代化的终端应用，支持多标签页，可以同时运行 PowerShell、cmd 和 WSL。

推荐安装 **Windows Terminal Preview**，界面更美观，功能也更新：

```powershell
# 用 winget 一行安装（无需打开 Microsoft Store）
winget install Microsoft.WindowsTerminal.Preview
```

如果使用 Windows 10 且没有 `winget`，可以在 Microsoft Store 搜索 "Windows Terminal Preview" 安装。

### Windows 原生开发环境

虽然科研计算强烈推荐 WSL，但了解 Windows 原生的开发工具链同样重要，尤其在不方便使用 WSL、或需要与 Windows 软件深度集成时。

#### winget — Windows 内置包管理器

Windows 10（2004 及以上）和 Windows 11 内置了 `winget`，类似于 Linux 的 `apt` 或 macOS 的 `brew`，可以直接在 PowerShell 中使用：

```powershell
# 安装常用开发工具
winget install Git.Git
winget install Microsoft.VisualStudioCode
winget install Python.Python.3.12

# 搜索可用软件
winget search gcc

# 一键升级所有已安装软件
winget upgrade --all
```

#### Scoop — 轻量社区包管理器

Scoop 专注于开发者工具，安装软件无需管理员权限，适合需要管理多版本工具链的高级用户。安装方式见 [scoop.sh](https://scoop.sh)。日常使用推荐优先使用 winget。

#### MSYS2 — Windows 上的 GCC 工具链

MSYS2 提供在 Windows 上原生运行的 GCC 编译器和 Unix 工具，编译出的程序可以直接在 Windows 上运行（不依赖 WSL 或 Linux）：

```powershell
# 通过 winget 安装 MSYS2
winget install MSYS2.MSYS2

# 然后在 MSYS2 终端（MINGW64）中安装编译器
pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-make
```

:::tip 原生 Windows 还是 WSL？
对于计算物理研究，**WSL 是更好的选择**：科研软件大多面向 Linux 开发，WSL 与服务器环境完全一致，且性能接近原生 Linux。

原生 Windows 工具链（MSYS2 等）更适合需要开发 Windows 原生应用，或与 Windows 生态深度集成的场景。
:::

## 3.4 Windows 上为什么建议安装 WSL

**WSL (Windows Subsystem for Linux)** 让你在 Windows 上直接运行 Linux 环境，无需双系统或虚拟机。

### 为什么需要 WSL？

1. 科研软件绝大部分针对 Linux 开发
2. 服务器和超算都是 Linux，在本地使用相同环境可以减少"在我电脑上能跑"的问题
3. 大量教程和文档默认使用 Linux 命令
4. Shell 脚本只需写一份，本地和服务器通用

### WSL 2 安装步骤

#### 方法一：一键安装（推荐）

以**管理员身份**打开 PowerShell（右键开始菜单 → "终端(管理员)" 或搜索 PowerShell → 右键 → "以管理员身份运行"）：

```powershell
# 一键安装 WSL（默认安装 Ubuntu）
wsl --install
```

安装完成后**重启电脑**。重启后 Ubuntu 会自动启动，要求你设置用户名和密码。

```powershell
# 验证安装
wsl --list --verbose
# 应该显示：
#   NAME      STATE           VERSION
# * Ubuntu    Running         2
```

:::tip 如果一键安装成功，可以跳过方法二，直接进入"安装后的初始配置"。
:::

#### 方法二：手动安装（一键安装失败时使用）

如果 `wsl --install` 报错，需要手动启用 Windows 功能：

**步骤 1：启用 Windows 功能**

打开 **"启用或关闭 Windows 功能"**（两种方式任选）：
- 搜索栏搜索"启用或关闭 Windows 功能"
- 或运行 `optionalfeatures`

在弹出的窗口中，勾选以下两项：

- ✅ **适用于 Linux 的 Windows 子系统**（Windows Subsystem for Linux）
- ✅ **虚拟机平台**（Virtual Machine Platform）

:::info Windows 11 用户
在 Windows 11 上，**虚拟机平台** 可能已默认启用，或在列表中显示为灰色/不可勾选状态。这说明该功能已经开启，无需任何操作，继续下一步即可。
:::

点击"确定"，等待安装完成后**重启电脑**。

也可以在管理员 PowerShell 中用命令启用：

```powershell
# 启用 WSL 功能
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 启用虚拟机平台
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 重启电脑
Restart-Computer
```

**步骤 2：设置 WSL 2 为默认版本**

重启后，以管理员身份打开 PowerShell：

```powershell
wsl --set-default-version 2
```

**步骤 3：安装 Ubuntu**

```powershell
# 查看可用的发行版
wsl --list --online

# 安装 Ubuntu（推荐 24.04 LTS）
wsl --install -d Ubuntu-24.04
```

安装完成后，Ubuntu 会启动并要求设置用户名和密码。

:::caution 安装注意事项
- 需要 **Windows 10 版本 2004** 及以上，或 **Windows 11**
- 需要在 **BIOS 中启用虚拟化**（大部分电脑默认已启用；如果遇到报错，重启进入 BIOS，找到 Intel VT-x 或 AMD-V 并启用）
- 首次安装需要联网下载约 1 GB 数据
- 如果提示"WSL 2 需要更新内核组件"，请访问 https://aka.ms/wsl2kernel 下载并安装 Linux 内核更新包
:::

### 安装后的初始配置

```bash
# 在 WSL Ubuntu 终端中执行

# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装基本工具
sudo apt install -y build-essential git curl wget vim python3 python3-pip

# 3. 配置 Git（替换为你的信息）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### WSL 与 Windows 的文件互访

```bash
# 在 WSL 中访问 Windows 文件
ls /mnt/c/Users/你的用户名/Desktop/

# 在 Windows 资源管理器中访问 WSL 文件
# 在地址栏输入: \\wsl$\Ubuntu\home\你的用户名\
```

:::caution 性能建议
将你的项目文件放在 **WSL 文件系统内**（如 `/home/你的用户名/projects/`），而不是 Windows 文件系统中（如 `/mnt/c/...`）。跨文件系统操作会显著降低性能，尤其是 Git 操作和编译。
:::

## 3.5 文件系统与换行符差异

### 文件系统差异

| 特性 | macOS (APFS) | Linux (ext4) | Windows (NTFS) |
|------|-------------|-------------|----------------|
| 大小写敏感 | 默认不敏感 | 敏感 | 不敏感 |
| 最大文件名长度 | 255 字节 | 255 字节 | 255 字符 |
| 路径分隔符 | `/` | `/` | `\` |
| 文件名禁用字符 | `:` `/` | `/` | `\ / : * ? " < > \|` |
| 隐藏文件标记 | `.` 开头 | `.` 开头 | 文件属性 |

:::caution 大小写敏感性
Linux 上 `Data.csv` 和 `data.csv` 是**两个不同的文件**。而 macOS 和 Windows 上它们是同一个文件。这在跨平台协作时经常引发问题。

**建议：文件名一律使用小写字母，避免歧义。**
:::

### 换行符差异

| 系统 | 换行符 | 十六进制 | 名称 |
|------|--------|---------|------|
| Linux / macOS | `\n` | `0x0A` | LF (Line Feed) |
| Windows | `\r\n` | `0x0D 0x0A` | CRLF (Carriage Return + Line Feed) |

这个看似微小的差异会导致很多问题：

```bash
# Shell 脚本如果有 Windows 换行符，会报错：
# /bin/bash^M: bad interpreter

# 检查文件换行符
file script.sh

# 转换换行符
# 安装 dos2unix
sudo apt install dos2unix

# Windows → Unix
dos2unix script.sh

# Unix → Windows
unix2dos script.sh
```

**建议：配置你的编辑器默认使用 LF 换行符。** 在 VS Code 中，点击右下角的 "CRLF" 切换为 "LF"，或在设置中搜索 `files.eol` 设为 `\n`。

## 3.6 权限与管理员权限

### Unix 权限模型 (macOS / Linux)

Unix 系统中每个文件都有权限属性：

```bash
$ ls -l script.py
-rwxr-xr-- 1 student group 1234 Jan 15 10:00 script.py
```

权限字符串 `rwxr-xr--` 的含义：

```
rwx    r-x    r--
 │      │      │
 │      │      └── 其他用户：只读
 │      └────────── 同组用户：读和执行
 └───────────────── 文件所有者：读、写、执行
```

| 权限 | 字母 | 数字 | 含义 |
|------|------|------|------|
| 读 | r | 4 | 查看文件内容 |
| 写 | w | 2 | 修改文件内容 |
| 执行 | x | 1 | 运行文件（脚本/程序） |

```bash
# 添加执行权限
chmod +x script.sh

# 用数字设置权限（所有者读写执行，其他人只读）
chmod 744 script.sh

# 递归修改整个目录的权限
chmod -R 755 project/
```

### sudo —— 超级用户权限

某些操作需要管理员权限（如安装系统级软件）：

```bash
# 安装软件（需要 sudo）
sudo apt install python3

# 查看受保护的文件
sudo cat /etc/shadow
```

:::caution 谨慎使用 sudo
`sudo` 给你完全的系统控制权。使用 `sudo rm` 等命令时要特别小心，因为它可以删除系统文件。

**原则：如果不确定一个命令是否需要 sudo，先不加 sudo 试一下。只有在提示 "Permission denied" 时再考虑使用 sudo。**
:::

### Windows 权限

Windows 使用不同的权限模型（ACL）。以管理员身份运行程序相当于 Linux 的 `sudo`：

- 右键点击程序 → "以管理员身份运行"
- 或者以管理员身份打开终端

## 3.7 路径风格差异

### 三种路径风格

```bash
# Linux
/home/student/research/simulation.py

# macOS
/Users/student/research/simulation.py

# Windows (原生)
C:\Users\student\research\simulation.py

# Windows (WSL 中)
/home/student/research/simulation.py       # WSL 内部文件
/mnt/c/Users/student/research/simulation.py  # 访问 Windows 文件
```

### 家目录

| 系统 | 家目录 | 快捷表示 |
|------|--------|---------|
| Linux | `/home/用户名` | `~` |
| macOS | `/Users/用户名` | `~` |
| Windows | `C:\Users\用户名` | `%USERPROFILE%` |
| WSL | `/home/用户名` | `~` |

### 路径中的空格和特殊字符

所有平台通用的建议：

```bash
# 项目路径中避免使用：
# - 空格
# - 中文字符
# - 特殊字符（括号、感叹号等）

# 推荐
/home/student/ising_model/
/home/student/quantum-espresso-runs/

# 不推荐
/home/student/Ising Model (2024)/
/home/student/量子计算项目/
```

## 3.8 平台选择建议

### 快速决策表

| 你的情况 | 推荐平台 | 理由 |
|----------|---------|------|
| 刚开始，用惯了 Windows | Windows + WSL | 保留熟悉的日常环境，通过 WSL 学习 Linux |
| 有 Mac | macOS | 原生类 Unix，开箱即用 |
| 想要最纯粹的科研体验 | Ubuntu | 与服务器环境完全一致 |
| 需要跑 GPU 计算 | Ubuntu 或 Windows + WSL | Linux 对 CUDA 支持最好 |
| 课题组有统一要求 | 跟课题组走 | 方便交流和协作 |

### 双系统和虚拟机

如果你想同时使用 Windows 和 Linux：

| 方案 | 优点 | 缺点 |
|------|------|------|
| WSL | 安装简单，与 Windows 无缝集成 | 少数边缘场景有兼容性问题 |
| 双系统 | 各系统性能最好 | 切换需要重启 |
| 虚拟机 | 完全隔离，可以快照 | 性能有损耗 |

:::tip 推荐方案
对于大部分物理学生，**Windows + WSL** 或者 **macOS** 是最好的选择。前者让你在保留 Windows 日常使用的同时拥有完整的 Linux 环境，后者天然提供类 Unix 体验。

无论你用什么平台，本教程都会覆盖到。重要的不是选哪个平台，而是**开始使用并坚持学习**。
:::

### 三平台对比总表

| 特性 | macOS | Ubuntu | Windows + WSL |
|------|-------|--------|--------------|
| 终端可用性 | 开箱即用 | 开箱即用 | 需安装 WSL |
| 包管理器 | Homebrew | apt | apt (WSL 内) |
| 科学软件兼容性 | 好 | 最好 | 好 (通过 WSL) |
| GUI 应用体验 | 优秀 | 良好 | 优秀 |
| 与服务器一致性 | 高 | 最高 | 高 (WSL 内) |
| 日常使用 | 优秀 | 良好 | 优秀 |
| 学习资料丰富度 | 丰富 | 最丰富 | 丰富 |
| 价格 | 硬件贵 | 免费 | 系统付费 |

## 常见问题

**Q：我必须学 Linux 吗？**

A：如果你要做计算物理，答案是"是的"。所有超算和大部分计算服务器都运行 Linux。但你不需要把个人电脑换成 Linux——macOS 的终端体验非常接近 Linux，Windows 通过 WSL 也可以使用 Linux。

**Q：WSL 性能够用吗？**

A：对于大部分学习和中等规模的计算任务，WSL 2 的性能几乎等同于原生 Linux。真正的大规模计算应该提交到学校的服务器或超算上，而不是在个人电脑上跑。

**Q：我用 macOS，需要装 WSL 吗？**

A：不需要。WSL 是 Windows 专用的。macOS 自带类 Unix 环境，不需要额外的 Linux 子系统。

**Q：安装 WSL 后，原来的 Windows 文件还在吗？**

A：完全在。WSL 是一个独立的 Linux 环境，不会影响你的 Windows 文件。你可以从 WSL 中通过 `/mnt/c/` 访问 Windows 文件。

**Q：换行符问题真的很常见吗？**

A：非常常见。几乎每个在 Windows 和 Linux 之间传输文件的人都会遇到。配置好编辑器（默认使用 LF）和 Git（`core.autocrlf = input`）可以避免大部分问题。

```bash
# 配置 Git 自动处理换行符
git config --global core.autocrlf input    # macOS / Linux / WSL
git config --global core.autocrlf true     # Windows 原生环境
```

## 小结

- macOS 原生类 Unix，适合科研开发，开箱即用
- Ubuntu 是科研计算的标准平台，服务器几乎都用它
- Windows 通过 WSL 可以获得完整的 Linux 体验
- 理解文件系统差异（大小写、路径分隔符、换行符）可以避免很多跨平台问题
- 权限管理是 Unix 系统的重要概念，善用但谨慎使用 `sudo`
- 文件和目录命名避免空格和中文，使用英文、下划线和连字符

## 练习

### 练习 3.1：环境验证

根据你的操作系统，在终端中运行以下命令并记录结果：

```bash
# 所有平台通用（bash 环境下）
echo $SHELL           # 当前 Shell
uname -a              # 系统信息
whoami                # 当前用户名
pwd                   # 当前目录
echo $HOME            # 家目录
```

### 练习 3.2：WSL 安装（Windows 用户）

如果你使用 Windows：

1. 按照 3.4 节的步骤安装 WSL
2. 在 WSL 中运行 `lsb_release -a` 确认 Ubuntu 版本
3. 在 WSL 中运行 `ls /mnt/c/Users/` 验证可以访问 Windows 文件
4. 创建一个文件 `/home/你的用户名/test.txt`，然后在 Windows 资源管理器中通过 `\\wsl$\Ubuntu\` 路径找到它

### 练习 3.3：换行符实验

1. 在 Windows 记事本中创建一个包含几行文字的文件 `test_crlf.txt`
2. 将文件复制到 WSL 或 Linux 环境中
3. 使用 `file test_crlf.txt` 检查换行符格式
4. 使用 `dos2unix` 转换换行符
5. 再次检查换行符格式

### 练习 3.4：权限实验（macOS / Linux / WSL）

1. 创建一个文件 `hello.sh`，内容为 `echo "Hello, physics!"`
2. 尝试运行 `./hello.sh`（会报权限错误）
3. 使用 `chmod +x hello.sh` 添加执行权限
4. 再次运行 `./hello.sh`
5. 使用 `ls -l hello.sh` 查看权限变化

### 练习 3.5：跨平台路径练习

写出以下文件在不同系统中的路径：

1. 你桌面上的 `notes.txt`（分别写出 macOS、Linux、Windows、WSL 中的路径）
2. 你家目录下 `projects/ising_model/main.py` 的绝对路径
3. 在 WSL 中访问 Windows 桌面上 `data.csv` 的路径
