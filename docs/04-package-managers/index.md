---
sidebar_position: 4
sidebar_label: "4. 包管理器"
---

# 第 4 章：包管理器

> 用一条命令安装软件，而不是满世界找安装包。

## 本章目标

- 理解包管理器（package manager）的作用与优势
- 掌握 macOS、Ubuntu、Windows 三大平台的主流包管理器
- 学会搜索、安装、升级、卸载软件包
- 了解中国大陆镜像源配置与常见问题排查

## 动机

在科研计算中，你需要频繁安装各种工具：编译器（gcc, gfortran）、版本控制（git）、脚本语言（Python）、文本处理工具（wget, curl, tree）等。如果每次都去官网下载安装包、手动配置路径，不仅效率低下，还容易出错。

**包管理器**就像一个"软件商店 + 自动安装脚本"，让你用一行命令完成安装、升级和卸载，同时自动处理依赖关系。

---

## 4.1 为什么需要包管理器

| 手动安装 | 包管理器 |
|---------|---------|
| 去官网下载 `.exe` / `.dmg` / `.tar.gz` | 一条命令 `brew install git` |
| 手动配置环境变量 PATH | 自动配置 |
| 升级需要重新下载 | `brew upgrade git` |
| 卸载残留文件 | `brew uninstall git` 干净卸载 |
| 依赖冲突难以排查 | 自动解决依赖 |

:::tip 核心理念
**可复现性（reproducibility）** 是科研的基本要求。用包管理器安装软件，你可以把安装步骤写成脚本，在新机器上一键重现环境。
:::

---

## 4.2 macOS: Homebrew

[Homebrew](https://brew.sh) 是 macOS 上最流行的包管理器，也支持 Linux。

### 安装 Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装完成后，按照提示将 Homebrew 添加到 PATH：

```bash
# Apple Silicon (M1/M2/M3/M4)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Intel Mac
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

### 常用命令

```bash
brew search python        # 搜索软件包
brew install python        # 安装
brew upgrade python        # 升级
brew uninstall python      # 卸载
brew list                  # 列出已安装的包
brew info python           # 查看包信息
brew update                # 更新 Homebrew 本身
brew doctor                # 诊断问题
```

### 安装 GUI 应用（Cask）

```bash
brew install --cask visual-studio-code
brew install --cask iterm2
brew install --cask google-chrome
```

:::info 中国大陆用户加速
如果 Homebrew 下载速度很慢，可以使用清华大学镜像源：

```bash
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
```

将以上内容添加到 `~/.zprofile` 或 `~/.bash_profile` 中。
:::

---

## 4.3 Ubuntu: apt

`apt`（Advanced Package Tool）是 Debian/Ubuntu 系统的默认包管理器。

### 常用命令

```bash
sudo apt update              # 更新软件包索引（每次安装前建议先执行）
sudo apt install git         # 安装
sudo apt upgrade git         # 升级单个包
sudo apt full-upgrade        # 升级所有包
sudo apt remove git          # 卸载（保留配置文件）
sudo apt purge git           # 完全卸载（包括配置文件）
sudo apt autoremove          # 清理不再需要的依赖
apt search python3           # 搜索（不需要 sudo）
apt show python3             # 查看包信息
```

:::caution 注意 sudo
在 Ubuntu 上，安装和卸载软件需要管理员权限，命令前要加 `sudo`。搜索和查看信息不需要。
:::

### 中国大陆镜像源

编辑 `/etc/apt/sources.list`，将 `archive.ubuntu.com` 替换为镜像站：

```bash
# 备份原文件
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

# 使用清华源（以 Ubuntu 22.04 jammy 为例）
sudo sed -i 's|archive.ubuntu.com|mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list
sudo apt update
```

---

## 4.4 Windows: winget

### winget（Windows 自带）

Windows 10/11 自带 `winget`（Windows Package Manager），是 Windows 上的首选包管理器：

```powershell
winget search python                # 搜索
winget install Python.Python.3.12   # 安装
winget upgrade Python.Python.3.12   # 升级
winget uninstall Python.Python.3.12 # 卸载
winget list                         # 列出已安装的包
winget upgrade --all                # 升级所有已安装的包
```

:::tip 关于 Scoop
[Scoop](https://scoop.sh) 是另一个社区包管理器，安装软件无需管理员权限，适合需要管理多版本工具链的高级用户。winget 覆盖的软件已经足够日常科研使用，建议优先使用 winget。
:::

:::tip WSL 用户
如果你已经在使用 WSL（Windows Subsystem for Linux），Linux 环境内直接使用 `apt`，与原生 Ubuntu 体验一致。Windows 侧的工具用 `winget` 管理。
:::

---

## 4.5 如何搜索、安装、升级、卸载软件

下表总结了三大平台的常用操作：

| 操作 | macOS (Homebrew) | Ubuntu (apt) | Windows (winget) |
|------|-----------------|--------------|------------------|
| 搜索 | `brew search X` | `apt search X` | `winget search X` |
| 安装 | `brew install X` | `sudo apt install X` | `winget install X` |
| 升级 | `brew upgrade X` | `sudo apt upgrade X` | `winget upgrade X` |
| 卸载 | `brew uninstall X` | `sudo apt remove X` | `winget uninstall X` |
| 列出已安装 | `brew list` | `apt list --installed` | `winget list` |
| 更新索引 | `brew update` | `sudo apt update` | （自动） |

---

## 4.6 包管理器与手动安装的区别

### 什么时候用包管理器

- 安装通用工具：git, gcc, python, cmake, wget, curl
- 安装系统级库：openblas, fftw, hdf5
- 需要快速搭建环境

### 什么时候手动安装

- 需要特定版本，包管理器里没有
- 需要自定义编译选项（如启用特定 CPU 指令集优化）
- 安装最新的开发版本
- HPC 集群上没有 root 权限，使用 `module` 系统或自行编译到 `$HOME`

:::info
在高性能计算（HPC）集群上，通常使用 `module` 系统管理软件，而不是包管理器。这会在后续章节介绍。
:::

---

## 4.7 常见坑：权限、镜像、路径冲突

### 权限问题

```bash
# 错误：Permission denied
$ apt install git
E: Could not open lock file - open (13: Permission denied)

# 解决：加上 sudo
$ sudo apt install git
```

:::caution 永远不要用 sudo 运行 Homebrew
```bash
# 错误做法
sudo brew install python   # ❌ 不要这样做

# 正确做法
brew install python        # ✅
```
Homebrew 设计为非 root 运行。如果遇到权限问题，运行 `brew doctor` 诊断。
:::

### PATH 冲突

安装了新版 Python 但终端里还是旧版？可能是 PATH 顺序问题：

```bash
# 查看当前使用的是哪个 python
which python3
# /usr/bin/python3  <-- 系统自带的旧版

# 查看 PATH
echo $PATH

# Homebrew 的路径应该在系统路径前面
export PATH="/opt/homebrew/bin:$PATH"
```

### 网络问题（中国大陆用户）

如果下载速度极慢或连接超时，请参考各节中的镜像源配置。常用镜像站：

| 镜像站 | 地址 |
|-------|------|
| 清华大学 TUNA | https://mirrors.tuna.tsinghua.edu.cn |
| 中国科技大学 USTC | https://mirrors.ustc.edu.cn |
| 阿里云 | https://developer.aliyun.com/mirror |

### 软件包找不到

```bash
# apt 搜索不到？先更新索引
sudo apt update

# 还是找不到？可能在 universe 仓库
sudo add-apt-repository universe
sudo apt update
```

---

## 4.8 安装基础工具集

以下是科研计算中常用的基础工具，建议在新环境中首先安装：

### macOS

```bash
brew install git wget curl tree htop cmake gcc
brew install python
brew install --cask visual-studio-code
```

### Ubuntu

```bash
sudo apt update
sudo apt install -y git wget curl tree htop cmake build-essential
sudo apt install -y python3 python3-pip python3-venv
```

### Windows (winget)

```powershell
winget install Git.Git
winget install Python.Python.3.12
winget install Kitware.CMake
winget install Microsoft.VisualStudioCode
```

### 验证安装

```bash
git --version
python3 --version
gcc --version
cmake --version
```

:::tip 一键脚本
你可以把上面的命令写成一个 shell 脚本 `setup.sh`，这样在新机器上只需运行 `bash setup.sh` 即可。这就是包管理器带来的**可复现性**。
:::

---

## 常见问题

**Q: Homebrew 安装太慢怎么办？**
A: 配置清华或中科大镜像源，参见 4.2 节。

**Q: Ubuntu 上 `pip install` 报错 "externally-managed-environment"？**
A: Ubuntu 23.04+ 默认启用了 PEP 668 保护。请使用虚拟环境：`python3 -m venv myenv && source myenv/bin/activate`。

**Q: 包管理器安装的软件在哪里？**
A: Homebrew 在 `/opt/homebrew/`（Apple Silicon）或 `/usr/local/`（Intel）。apt 在 `/usr/`。winget 通常安装到 `Program Files` 或用户目录。

---

## 小结

- 包管理器是现代开发和科研的基本工具，**优先使用包管理器安装软件**
- macOS 用 **Homebrew**，Ubuntu 用 **apt**，Windows 用 **winget**
- 中国大陆用户记得配置**镜像源**以加速下载
- 遇到问题时，先检查 PATH、权限和网络

---

## 练习

1. 在你的系统上安装包管理器（如果还没有的话）
2. 使用包管理器安装 `git`、`wget`、`tree`，并验证安装成功
3. 使用 `search` 命令查找 `python` 相关的包，观察输出
4. 尝试配置中国大陆镜像源，比较配置前后的下载速度
5. 编写一个 `setup.sh` 脚本，包含你需要的所有基础工具安装命令
