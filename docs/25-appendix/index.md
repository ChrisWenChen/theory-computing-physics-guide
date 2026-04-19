---
sidebar_position: 25
sidebar_label: "25. 附录"
---

# 第 25 章：附录

> 速查、对照、参考——一页在手，天下我有。

## 本章目标

本章是全书的参考附录，提供：

- 常用终端命令速查表
- macOS / Ubuntu / Windows 三平台命令对照
- 常见报错与解决思路
- 新手最小安装清单
- 推荐学习资源

---

## 25.1 常见命令速查表 (Terminal Commands)

### 文件与目录操作

| 命令 | 功能 | 示例 |
|------|------|------|
| `ls` | 列出文件 | `ls -la` |
| `cd` | 切换目录 | `cd ~/research` |
| `pwd` | 显示当前目录 | `pwd` |
| `mkdir` | 创建目录 | `mkdir -p src/utils` |
| `rm` | 删除文件 | `rm file.txt` |
| `rm -r` | 删除目录 | `rm -r old_dir/` |
| `cp` | 复制 | `cp file.txt backup/` |
| `cp -r` | 复制目录 | `cp -r src/ src_backup/` |
| `mv` | 移动/重命名 | `mv old.py new.py` |
| `touch` | 创建空文件 | `touch README.md` |
| `cat` | 查看文件内容 | `cat config.yaml` |
| `less` | 分页查看 | `less long_output.log` |
| `head` | 查看前 N 行 | `head -20 data.csv` |
| `tail` | 查看后 N 行 | `tail -f simulation.log` |
| `wc` | 统计行/词/字符 | `wc -l data.csv` |
| `find` | 查找文件 | `find . -name "*.py"` |
| `tree` | 目录树 | `tree -L 2` |

### 文本处理

| 命令 | 功能 | 示例 |
|------|------|------|
| `grep` | 搜索文本 | `grep "error" log.txt` |
| `grep -r` | 递归搜索 | `grep -rn "def main" src/` |
| `sed` | 文本替换 | `sed -i 's/old/new/g' file.txt` |
| `awk` | 列处理 | `awk '{print $1, $3}' data.txt` |
| `sort` | 排序 | `sort -n -k2 data.txt` |
| `uniq` | 去重 | `sort data.txt \| uniq -c` |
| `cut` | 提取列 | `cut -d',' -f1,3 data.csv` |
| `diff` | 比较文件 | `diff file1.txt file2.txt` |

### 系统与进程

| 命令 | 功能 | 示例 |
|------|------|------|
| `top` / `htop` | 查看进程 | `htop` |
| `ps` | 列出进程 | `ps aux \| grep python` |
| `kill` | 终止进程 | `kill -9 12345` |
| `df` | 磁盘使用 | `df -h` |
| `du` | 目录大小 | `du -sh data/` |
| `free` | 内存使用 | `free -h`（Linux） |
| `which` | 命令位置 | `which python3` |
| `chmod` | 修改权限 | `chmod +x run.sh` |
| `chown` | 修改所有者 | `chown user:group file` |

### 网络

| 命令 | 功能 | 示例 |
|------|------|------|
| `ssh` | 远程登录 | `ssh user@server.edu` |
| `scp` | 远程复制 | `scp file.txt user@server:~/` |
| `rsync` | 增量同步 | `rsync -avh src/ dest/` |
| `wget` | 下载文件 | `wget https://example.com/data.tar.gz` |
| `curl` | HTTP 请求 | `curl -O https://example.com/file` |
| `ping` | 测试连通性 | `ping google.com` |

### Git

| 命令 | 功能 | 示例 |
|------|------|------|
| `git init` | 初始化仓库 | `git init` |
| `git clone` | 克隆仓库 | `git clone https://github.com/user/repo.git` |
| `git status` | 查看状态 | `git status` |
| `git add` | 暂存文件 | `git add src/model.py` |
| `git commit` | 提交 | `git commit -m "Add model"` |
| `git push` | 推送 | `git push origin main` |
| `git pull` | 拉取 | `git pull origin main` |
| `git log` | 查看历史 | `git log --oneline -10` |
| `git diff` | 查看差异 | `git diff HEAD~1` |
| `git branch` | 分支操作 | `git branch feature-x` |
| `git checkout` | 切换分支 | `git checkout feature-x` |
| `git merge` | 合并分支 | `git merge feature-x` |
| `git stash` | 暂存修改 | `git stash` / `git stash pop` |

---

## 25.2 macOS / Ubuntu / Windows 对照表

### 包管理器

| 操作 | macOS (Homebrew) | Ubuntu (apt) | Windows (winget) |
|------|-----------------|--------------|------------------|
| 安装包 | `brew install X` | `sudo apt install X` | `winget install X` |
| 搜索包 | `brew search X` | `apt search X` | `winget search X` |
| 升级包 | `brew upgrade X` | `sudo apt upgrade X` | `winget upgrade X` |
| 卸载包 | `brew uninstall X` | `sudo apt remove X` | `winget uninstall X` |
| 更新索引 | `brew update` | `sudo apt update` | （自动） |
| 列出已装 | `brew list` | `apt list --installed` | `winget list` |

### 系统操作

| 操作 | macOS | Ubuntu | Windows |
|------|-------|--------|---------|
| 打开终端 | Terminal / iTerm2 | Ctrl+Alt+T | Windows Terminal |
| 文件管理器 | Finder | Nautilus | Explorer |
| Shell | zsh（默认） | bash（默认） | PowerShell / bash (WSL) |
| 管理员权限 | `sudo` | `sudo` | 以管理员运行 / WSL 中 `sudo` |
| 查看 PATH | `echo $PATH` | `echo $PATH` | `echo $PATH`（bash）/ `$env:PATH`（PS） |
| 环境变量配置 | `~/.zshrc` | `~/.bashrc` | `~/.bashrc`（WSL） |

### Python 相关

| 操作 | macOS | Ubuntu | Windows |
|------|-------|--------|---------|
| 安装 Python | `brew install python` | `sudo apt install python3` | `winget install Python.Python.3.12` |
| 调用 Python | `python3` | `python3` | `python` 或 `python3` |
| 创建虚拟环境 | `python3 -m venv .venv` | `python3 -m venv .venv` | `python -m venv .venv` |
| 激活虚拟环境 | `source .venv/bin/activate` | `source .venv/bin/activate` | `.venv\Scripts\activate`（PS）或 `source .venv/bin/activate`（WSL） |
| pip 安装 | `pip install X` | `pip install X` | `pip install X` |

### 编译相关

| 操作 | macOS | Ubuntu | Windows (WSL) |
|------|-------|--------|---------------|
| C 编译器 | `gcc`（实际是 clang）或 `brew install gcc` | `sudo apt install gcc` | `sudo apt install gcc` |
| C++ 编译器 | `g++` 或 `clang++` | `g++` | `g++` |
| Fortran | `brew install gfortran` | `sudo apt install gfortran` | `sudo apt install gfortran` |
| Make | 自带 | `sudo apt install make` | `sudo apt install make` |
| CMake | `brew install cmake` | `sudo apt install cmake` | `sudo apt install cmake` |

---

## 25.3 常见报错与解决思路

### Python 相关

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `ModuleNotFoundError: No module named 'numpy'` | 未安装或不在当前环境中 | `pip install numpy`，检查虚拟环境 |
| `command not found: python` | Python 未安装或不在 PATH 中 | 安装 Python，检查 PATH |
| `PermissionError: [Errno 13]` | 没有文件权限 | 检查文件权限，不要用 `sudo pip install` |
| `SyntaxError: invalid syntax` | Python 版本不对或语法错误 | 检查 `python3 --version` |
| `externally-managed-environment` | Ubuntu 23.04+ PEP 668 保护 | 使用虚拟环境 |
| `RecursionError: maximum recursion depth exceeded` | 无限递归 | 检查递归终止条件 |

### Git 相关

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `fatal: not a git repository` | 不在 Git 仓库中 | `cd` 到仓库目录或 `git init` |
| `error: failed to push some refs` | 远程有更新 | 先 `git pull`，再 `git push` |
| `CONFLICT (content): Merge conflict` | 合并冲突 | 手动编辑冲突文件，`git add` + `git commit` |
| `Permission denied (publickey)` | SSH key 未配置 | 配置 SSH key，添加到 GitHub |
| `fatal: remote origin already exists` | 远程已存在 | `git remote set-url origin <new-url>` |

### 编译相关

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `gcc: command not found` | 未安装编译器 | 安装 gcc（见 25.2 节） |
| `undefined reference to 'xxx'` | 链接时找不到符号 | 检查库链接 `-lxxx`，检查函数声明 |
| `fatal error: xxx.h: No such file` | 缺少头文件 | 安装对应的 `-dev` 包 |
| `error: 'for' loop initial declarations` | C 标准太旧 | 加 `-std=c99` 或 `-std=c11` |
| `Segmentation fault (core dumped)` | 内存访问越界 | 用 `gdb` 调试，检查数组索引 |

### SSH 相关

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `Connection refused` | 服务器 SSH 未启动或端口错 | 确认服务器地址和端口 |
| `Connection timed out` | 网络不通 | 检查网络，检查防火墙 |
| `Host key verification failed` | 服务器指纹变更 | 删除 `~/.ssh/known_hosts` 中对应条目 |
| `Permission denied (publickey)` | SSH key 不匹配 | 检查 `~/.ssh/` 中的密钥配置 |

### 通用排错思路

```
1. 仔细阅读错误信息（从最后一行开始）
2. 复制错误信息到搜索引擎
3. 检查：版本是否正确？路径是否正确？权限是否足够？
4. 简化问题：用最小示例复现错误
5. 查看文档：官方文档 > Stack Overflow > 博客
6. 询问 AI：把完整错误信息给 ChatGPT/Claude
```

---

## 25.4 推荐课程和网站

### 在线课程

| 课程 | 平台 | 内容 |
|------|------|------|
| MIT Missing Semester | MIT OCW | 终端、Git、编辑器等工具 |
| Software Carpentry | 官网 | Shell、Git、Python 面向科研者 |
| CS 61A (Berkeley) | 官网 | Python 编程基础 |
| Computational Physics (各大学) | Coursera/edX | 数值方法和编程 |

### 常用网站

| 网站 | 用途 |
|------|------|
| [Stack Overflow](https://stackoverflow.com) | 编程问答 |
| [GitHub](https://github.com) | 代码托管和开源项目 |
| [arXiv](https://arxiv.org) | 物理预印本 |
| [Overleaf](https://www.overleaf.com) | 在线 LaTeX 编辑 |
| [NumPy 文档](https://numpy.org/doc/) | NumPy 参考 |
| [Matplotlib 画廊](https://matplotlib.org/gallery/) | 绘图示例 |
| [Learn X in Y Minutes](https://learnxinyminutes.com) | 快速学习编程语言 |
| [explainshell.com](https://explainshell.com) | 解释 Shell 命令 |
| [regex101.com](https://regex101.com) | 正则表达式测试 |

---

## 常见问题

**Q: 我应该背这些命令吗？**
A: 不需要全背。常用的 20-30 个命令会自然记住，其他的查表就行。重要的是**知道能做什么**，具体语法可以查。

**Q: macOS 上的 `sed` 和 Linux 不一样？**
A: 是的，macOS 用的是 BSD sed，Linux 用的是 GNU sed。主要区别是 `-i` 参数：macOS 需要 `sed -i '' 's/...'`，Linux 直接 `sed -i 's/...'`。安装 GNU sed：`brew install gnu-sed`。

**Q: 我应该用 Bash 还是 Zsh？**
A: macOS 默认是 Zsh，Linux 默认是 Bash。两者语法 95% 相同。建议用系统默认的，不必刻意切换。

---

## 小结

本章提供了日常使用的速查参考：

- **命令速查表**：文件操作、文本处理、系统管理、网络、Git
- **三平台对照表**：包管理、Python、编译工具的跨平台差异
- **报错速查**：Python、Git、编译、SSH 的常见错误及解决方案
- **学习资源**：课程、网站推荐

建议将本章加入书签，在遇到问题时随时查阅。
