---
sidebar_position: 5
sidebar_label: "5. 编辑器与 IDE"
---

# 第 5 章：编辑器与 IDE

> 选对编辑器，事半功倍；选错编辑器，事倍功半。

## 本章目标

- 理解终端编辑器和图形编辑器各自的适用场景
- 掌握 nano 的基本操作——能在服务器上快速编辑文件
- 掌握 vim 的生存级别命令——至少能正常退出
- 熟练使用 VS Code 进行科研开发
- 配置适合计算物理的 VS Code 插件

## 动机

作为计算物理的研究者，你会频繁编辑代码、配置文件、脚本和文档。在不同的场景下，你需要不同的工具：

- 在远程服务器上通过 SSH 修改一行配置 → **nano** 或 **vim**
- 在本地开发 Python/C++ 项目 → **VS Code**
- 在没有图形界面的 HPC 集群上编辑代码 → **vim**

没有"最好的编辑器"，只有"最适合当前场景的编辑器"。

---

## 5.1 为什么要学至少一个终端编辑器

:::caution 真实场景
你通过 SSH 登录了远程服务器，需要修改一个配置文件。服务器上没有图形界面，没有 VS Code，只有终端。你**必须**会用终端编辑器。
:::

终端编辑器（terminal editor）是在命令行中运行的文本编辑器，不需要图形界面。常见的有：

| 编辑器 | 学习难度 | 功能 | 适用场景 |
|-------|---------|------|---------|
| nano | 很低 | 基础 | 快速编辑小文件 |
| vim | 较高 | 强大 | 重度终端用户、服务器开发 |
| emacs | 高 | 极其强大 | 有特殊偏好的用户 |

**建议：至少学会 nano，推荐再学 vim 基础操作。**

---

## 5.2 nano：最简单的终端编辑器

nano 是最容易上手的终端编辑器，几乎所有 Linux 系统都预装了它。

### 打开文件

```bash
nano filename.txt        # 打开文件（不存在则创建）
nano +10 filename.txt    # 打开文件并跳到第 10 行
```

### 基本操作

nano 的底部会显示快捷键提示，`^` 表示 Ctrl 键：

| 快捷键 | 功能 |
|-------|------|
| `Ctrl+O` | 保存文件（Write Out） |
| `Ctrl+X` | 退出 |
| `Ctrl+K` | 剪切当前行 |
| `Ctrl+U` | 粘贴 |
| `Ctrl+W` | 搜索 |
| `Ctrl+G` | 帮助 |
| `Ctrl+C` | 显示当前行号 |
| `Alt+U` | 撤销 |

### 典型工作流

```bash
nano ~/.bashrc           # 打开配置文件
# 编辑内容...
# Ctrl+O → Enter 保存
# Ctrl+X 退出
```

:::tip
nano 适合快速编辑配置文件、写简短脚本。如果你只是需要在服务器上改几行代码，nano 完全够用。
:::

---

## 5.3 vim：最经典的终端编辑器

vim（Vi IMproved）是一个强大但学习曲线陡峭的编辑器。它的核心理念是**模式编辑**——不同模式下按键有不同含义。

### vim 的模式

```
Normal 模式（默认）──→ Insert 模式（按 i）
       ↑                    │
       └────────────────────┘（按 Esc）
```

| 模式 | 用途 | 进入方式 |
|------|------|---------|
| Normal | 移动光标、删除、复制 | 按 `Esc` |
| Insert | 输入文字 | 按 `i` |
| Command | 执行命令（保存、退出等） | 在 Normal 模式下按 `:` |
| Visual | 选择文本 | 在 Normal 模式下按 `v` |

### 生存级别命令（必须记住）

```
打开文件：  vim filename.txt
进入编辑：  按 i（进入 Insert 模式）
退出编辑：  按 Esc（回到 Normal 模式）
保存退出：  输入 :wq 然后 Enter
不保存退出：输入 :q! 然后 Enter
保存：      输入 :w 然后 Enter
```

:::caution 如何退出 vim
这是互联网上最经典的问题之一。答案是：

1. 按 `Esc`（确保在 Normal 模式）
2. 输入 `:q!`（不保存退出）或 `:wq`（保存退出）
3. 按 `Enter`
:::

### 进阶命令（推荐掌握）

| 命令 | 功能 |
|------|------|
| `dd` | 删除当前行 |
| `yy` | 复制当前行 |
| `p` | 粘贴 |
| `u` | 撤销 |
| `Ctrl+R` | 重做 |
| `/keyword` | 搜索 keyword |
| `n` | 跳到下一个搜索结果 |
| `gg` | 跳到文件开头 |
| `G` | 跳到文件末尾 |
| `:set number` | 显示行号 |
| `:%s/old/new/g` | 全局替换 |

### vim 配置文件

创建或编辑 `~/.vimrc`：

```vim
set number          " 显示行号
set relativenumber  " 显示相对行号
set tabstop=4       " Tab 宽度为 4
set shiftwidth=4    " 缩进宽度为 4
set expandtab       " 用空格代替 Tab
set autoindent      " 自动缩进
set hlsearch        " 搜索高亮
set incsearch       " 增量搜索
syntax on           " 语法高亮
```

### 学习 vim 的建议

```bash
vimtutor            # vim 自带的交互式教程（约 30 分钟）
```

:::info
不要试图一次学会 vim 的所有功能。先记住生存级别的命令，日常使用中逐步学习新命令。
:::

---

## 5.4 VS Code：最通用的科研开发工具

[Visual Studio Code](https://code.visualstudio.com) 是目前最流行的代码编辑器，免费、开源、跨平台，拥有丰富的插件生态。

### 安装

推荐通过系统包管理器安装，安装后可随系统统一更新：

```bash
# Windows（winget）
winget install Microsoft.VisualStudioCode

# macOS（Homebrew）
brew install --cask visual-studio-code

# Ubuntu（配置官方 apt 源，支持后续自动更新）
wget -qO- https://packages.microsoft.com/keys/microsoft.asc \
  | gpg --dearmor \
  | sudo tee /etc/apt/keyrings/microsoft.gpg > /dev/null
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/microsoft.gpg] \
  https://packages.microsoft.com/repos/code stable main" \
  | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update && sudo apt install code
```

不使用包管理器的话，也可以直接从[官网](https://code.visualstudio.com)下载安装包（Windows `.exe`、macOS `.dmg`、Ubuntu `.deb`），下载后双击安装即可。

### 从命令行打开 VS Code

```bash
code .                  # 打开当前目录
code filename.py        # 打开文件
code --diff a.py b.py   # 对比两个文件
```

:::tip
macOS 用户首次使用 `code` 命令，需要在 VS Code 中按 `Cmd+Shift+P`，搜索 "Shell Command: Install 'code' command in PATH"。
:::

---

## 5.5 VS Code 推荐插件

以下是计算物理科研中最实用的 VS Code 插件：

### 语言支持

| 插件名 | 用途 |
|-------|------|
| **Python** (Microsoft) | Python 语言支持、调试、运行 |
| **Pylance** (Microsoft) | Python 智能补全、类型检查 |
| **C/C++** (Microsoft) | C/C++ 语言支持、调试 |
| **CMake Tools** (Microsoft) | CMake 项目构建 |
| **Fortran** (fortls) | Fortran 语言支持 |
| **Julia** (julialang) | Julia 语言支持 |

### 科研工具

| 插件名 | 用途 |
|-------|------|
| **Jupyter** (Microsoft) | 在 VS Code 中运行 Jupyter Notebook |
| **LaTeX Workshop** (James Yu) | LaTeX 编写与编译 |
| **Markdown All in One** | Markdown 编写与预览 |

### 远程开发

| 插件名 | 用途 |
|-------|------|
| **Remote - SSH** (Microsoft) | 通过 SSH 连接远程服务器编辑代码 |
| **WSL** (Microsoft) | 在 WSL 中开发（Windows 用户必装） |
| **Dev Containers** (Microsoft) | 在 Docker 容器中开发 |

### 效率工具

| 插件名 | 用途 |
|-------|------|
| **GitLens** (GitKraken) | 增强 Git 功能，查看代码历史 |
| **Error Lens** | 在代码行内显示错误信息 |
| **indent-rainbow** | 用颜色区分缩进层级 |
| **Code Spell Checker** | 拼写检查 |

### 命令行安装插件

```bash
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension ms-vscode.cpptools
code --install-extension ms-vscode.cmake-tools
code --install-extension ms-toolsai.jupyter
code --install-extension James-Yu.latex-workshop
code --install-extension ms-vscode-remote.remote-ssh
code --install-extension eamodio.gitlens
```

---

## 5.6 Remote SSH / Jupyter / Python / CMake / LaTeX 插件

### Remote SSH 远程开发

这是科研中最有用的 VS Code 功能之一。它允许你通过 SSH 连接到远程服务器，像在本地一样编辑和运行代码。

使用步骤：

1. 安装 Remote - SSH 插件
2. 按 `Ctrl+Shift+P`（macOS: `Cmd+Shift+P`），搜索 "Remote-SSH: Connect to Host"
3. 输入 `user@hostname` 或从 `~/.ssh/config` 选择
4. VS Code 会在远程服务器上安装一个轻量级服务端
5. 之后就像在本地编辑一样

:::info
Remote SSH 需要远程服务器能运行 VS Code Server。大部分 Linux 服务器都支持，但某些受限的 HPC 登录节点可能不允许。
:::

### VS Code 连接 WSL（Windows 用户）

如果你在 Windows 上使用 WSL（Windows Subsystem for Linux），VS Code 可以直接连接到 WSL 中的 Linux 环境，像在原生 Linux 上一样开发。

#### 第一步：安装 WSL 插件

在 VS Code 中安装 **WSL** 插件（扩展 ID：`ms-vscode-remote.remote-wsl`）：

```bash
code --install-extension ms-vscode-remote.remote-wsl
```

#### 第二步：从 WSL 终端打开 VS Code

最简单的方式是在 WSL 终端中直接运行 `code`：

```bash
# 在 WSL 终端中
cd ~/my-project
code .                  # 打开当前目录
code filename.py        # 打开单个文件
```

第一次运行时，VS Code 会自动在 WSL 中安装 VS Code Server，之后会直接打开。

#### 第三步：从 Windows 侧连接 WSL

你也可以从 Windows 侧的 VS Code 连接：

1. 按 `Ctrl+Shift+P`，搜索 **"WSL: Connect to WSL"**
2. 选择你的 WSL 发行版（如 Ubuntu）
3. VS Code 会重新打开一个窗口，左下角会显示 **"WSL: Ubuntu"**

连接成功后，左下角会显示绿色的 WSL 标识：

```
┌─────────────────────────────────┐
│  VS Code 窗口左下角显示：         │
│  ► WSL: Ubuntu                  │
└─────────────────────────────────┘
```

#### 连接后的工作方式

连接 WSL 后，VS Code 的所有操作都在 Linux 环境中执行：

- **终端** (`Ctrl+`` `)：打开的是 WSL 中的 bash/zsh，不是 Windows 的 PowerShell
- **文件浏览器**：显示的是 WSL 中的 Linux 文件系统（`/home/username/...`）
- **Python 解释器**：使用 WSL 中安装的 Python，而不是 Windows 的 Python
- **编译器**：使用 WSL 中的 gcc/gfortran，而不是 Windows 的
- **插件**：部分插件需要在 WSL 侧重新安装（VS Code 会提示）

#### 文件系统注意事项

:::caution 性能关键
**始终把项目放在 WSL 文件系统中**（`/home/username/...`），而不是 Windows 文件系统（`/mnt/c/Users/...`）。

跨文件系统操作（从 WSL 访问 `/mnt/c/` 下的文件）会非常慢，尤其是涉及大量文件的操作（如 `git status`、`npm install`、Python 虚拟环境等）。
:::

```bash
# ✅ 正确：项目放在 WSL 文件系统
cd ~
mkdir -p projects
cd projects
git clone https://github.com/user/repo.git
code repo/

# ❌ 错误：项目放在 Windows 文件系统（速度极慢）
cd /mnt/c/Users/username/Desktop/repo
code .
```

#### 在 WSL 和 Windows 之间复制文件

```bash
# 从 Windows 复制到 WSL
cp /mnt/c/Users/username/Downloads/data.csv ~/projects/

# 从 WSL 复制到 Windows
cp ~/projects/result.png /mnt/c/Users/username/Desktop/

# 在 Windows 资源管理器中打开当前 WSL 目录
explorer.exe .
```

#### 验证连接状态

```bash
# 在 VS Code 的终端中运行
uname -a        # 应该显示 Linux ... microsoft-standard-WSL2
which python3   # 应该是 /usr/bin/python3 或 WSL 中的路径，而不是 /mnt/c/...
echo $HOME      # 应该是 /home/username
```

#### 常见问题

**Q: VS Code 提示 "Cannot reconnect to WSL"？**
A: 在 Windows 的 PowerShell 中运行 `wsl --shutdown`，然后重新打开 WSL 和 VS Code。

**Q: 插件在 WSL 模式下不工作？**
A: 部分插件需要在 WSL 侧单独安装。打开插件面板（`Ctrl+Shift+X`），查看是否有 "Install in WSL" 按钮。

**Q: WSL 中的 `code` 命令找不到？**
A: 确保 Windows 侧的 VS Code 已添加到 PATH。重启 WSL 终端，或运行 `export PATH="$PATH:/mnt/c/Users/$USER/AppData/Local/Programs/Microsoft VS Code/bin"`。

---

### Jupyter Notebook

安装 Jupyter 插件后，VS Code 可以直接打开和编辑 `.ipynb` 文件，支持交互式运行和内联绘图。

### LaTeX Workshop

配置好 TeX Live 后，LaTeX Workshop 可以实现：
- 保存时自动编译
- 实时 PDF 预览
- 语法高亮与自动补全
- 正向/反向搜索（点击 PDF 跳到源码）

---

## 5.7 何时用 nano，何时用 vim，何时用 VS Code

| 场景 | 推荐编辑器 |
|------|----------|
| SSH 到服务器改一行配置 | nano |
| 在服务器上编辑脚本（无图形界面） | vim 或 nano |
| 本地开发 Python/C++ 项目 | VS Code |
| 远程开发（有稳定网络） | VS Code + Remote SSH |
| 写 LaTeX 论文 | VS Code + LaTeX Workshop |
| 编辑 Jupyter Notebook | VS Code + Jupyter 插件 |
| 快速查看文件内容 | `cat` / `less` / `head` |

:::tip 实用建议
- **必须学会** nano（5 分钟即可掌握）
- **推荐学会** vim 基础操作（30 分钟 `vimtutor`）
- **重点掌握** VS Code（日常开发主力）
:::

---

## 5.8 基本配置与快捷键

### VS Code 快捷键

以下是最常用的快捷键（macOS 用 `Cmd` 替换 `Ctrl`）：

| 快捷键 | 功能 |
|-------|------|
| `Ctrl+Shift+P` | 命令面板（Command Palette） |
| `Ctrl+P` | 快速打开文件 |
| `Ctrl+Shift+F` | 全局搜索 |
| `Ctrl+D` | 选中下一个相同的词 |
| `Ctrl+/` | 注释/取消注释 |
| `Ctrl+B` | 切换侧边栏 |
| `Ctrl+`` ` | 切换终端 |
| `Ctrl+Shift+E` | 资源管理器 |
| `Ctrl+Shift+G` | Git 面板 |
| `Ctrl+Shift+X` | 插件面板 |
| `Alt+Up/Down` | 移动当前行 |
| `Ctrl+Shift+K` | 删除当前行 |
| `F2` | 重命名符号 |
| `F12` | 跳转到定义 |
| `Ctrl+Click` | 跳转到定义 |
| `Ctrl+Shift+[` | 折叠代码块 |
| `Ctrl+Shift+]` | 展开代码块 |

### VS Code 用户设置

按 `Ctrl+,` 打开设置，或编辑 `settings.json`：

```json
{
    "editor.fontSize": 14,
    "editor.tabSize": 4,
    "editor.wordWrap": "on",
    "editor.minimap.enabled": false,
    "editor.formatOnSave": true,
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "terminal.integrated.fontSize": 13,
    "python.defaultInterpreterPath": "python3",
    "editor.rulers": [80, 120],
    "files.trimTrailingWhitespace": true
}
```

### 终端编辑器快捷键对比

| 操作 | nano | vim |
|------|------|-----|
| 保存 | `Ctrl+O` | `:w` |
| 退出 | `Ctrl+X` | `:q` |
| 保存并退出 | `Ctrl+O` → `Ctrl+X` | `:wq` |
| 不保存退出 | `Ctrl+X` → `N` | `:q!` |
| 搜索 | `Ctrl+W` | `/keyword` |
| 撤销 | `Alt+U` | `u` |
| 剪切行 | `Ctrl+K` | `dd` |
| 粘贴 | `Ctrl+U` | `p` |

---

## 常见问题

**Q: VS Code 打开大文件很卡怎么办？**
A: 对于非常大的数据文件（>100MB），不要用 VS Code 打开。用命令行工具 `head`、`tail`、`less` 查看，或用专门的工具处理。

**Q: vim 里粘贴代码缩进全乱了？**
A: 在粘贴前输入 `:set paste`，粘贴后输入 `:set nopaste`。

**Q: VS Code Remote SSH 连接不上？**
A: 检查 SSH 是否能正常连接（先在终端测试 `ssh user@host`）。确认远程服务器允许运行进程。查看 VS Code 的 Remote SSH 输出日志。

**Q: 应该学 vim 还是 emacs？**
A: 都可以。vim 更普及，几乎所有服务器都有。如果没有特殊偏好，建议先学 vim。

---

## 小结

- **nano** 是最简单的终端编辑器，适合快速修改文件
- **vim** 功能强大，学习曲线陡峭，但掌握基础命令即可应对大多数场景
- **VS Code** 是最推荐的日常开发工具，配合插件可以满足几乎所有科研需求
- **Remote SSH** 插件让你可以在远程服务器上像本地一样开发
- 记住 vim 的生存命令：`i` 进入编辑，`Esc` 退出编辑，`:wq` 保存退出，`:q!` 不保存退出

---

## 练习

1. 用 nano 创建一个文件 `hello.txt`，写入 "Hello, World!"，保存退出
2. 用 vim 打开 `hello.txt`，在第二行添加 "I am learning vim"，保存退出
3. 完成 `vimtutor` 教程的前两课
4. 安装 VS Code，并安装 Python、Remote SSH、GitLens 三个插件
5. 在 VS Code 中配置 `settings.json`，设置你喜欢的字体大小和 Tab 宽度
6. 尝试用 VS Code 的 Remote SSH 连接到一台远程服务器（如果有的话）
