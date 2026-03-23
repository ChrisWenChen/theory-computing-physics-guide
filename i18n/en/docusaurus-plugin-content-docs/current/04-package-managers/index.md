---
sidebar_position: 4
sidebar_label: "4. Package Managers"
---

# Chapter 4: Package Managers

> Install software with a single command, instead of searching the internet for installers.

## Chapter Goals

- Understand the role and advantages of package managers
- Master the mainstream package managers on macOS, Ubuntu, and Windows
- Learn to search, install, upgrade, and uninstall packages
- Understand mirror source configuration and common troubleshooting

## Motivation

In research computing, you need to frequently install various tools: compilers (gcc, gfortran), version control (git), scripting languages (Python), text processing tools (wget, curl, tree), and more. If you go to the official website every time to download an installer and manually configure paths, it is not only inefficient but also error-prone.

A **package manager** is like a "software store + automated installation script" that lets you install, upgrade, and uninstall with a single command, while automatically handling dependencies.

---

## 4.1 Why You Need a Package Manager

| Manual Installation | Package Manager |
|--------------------|-----------------|
| Download `.exe` / `.dmg` / `.tar.gz` from the official website | One command: `brew install git` |
| Manually configure the PATH environment variable | Automatically configured |
| Upgrading requires re-downloading | `brew upgrade git` |
| Uninstalling leaves residual files | `brew uninstall git` for a clean removal |
| Dependency conflicts are hard to troubleshoot | Dependencies resolved automatically |

:::tip Core Principle
**Reproducibility** is a fundamental requirement of research. By installing software with a package manager, you can write your installation steps as a script and recreate the environment on a new machine with one click.
:::

---

## 4.2 macOS: Homebrew

[Homebrew](https://brew.sh) is the most popular package manager on macOS, and it also supports Linux.

### Installing Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installation, follow the prompts to add Homebrew to your PATH:

```bash
# Apple Silicon (M1/M2/M3/M4)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Intel Mac
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

### Common Commands

```bash
brew search python        # Search for packages
brew install python        # Install
brew upgrade python        # Upgrade
brew uninstall python      # Uninstall
brew list                  # List installed packages
brew info python           # View package information
brew update                # Update Homebrew itself
brew doctor                # Diagnose issues
```

### Installing GUI Applications (Cask)

```bash
brew install --cask visual-studio-code
brew install --cask iterm2
brew install --cask google-chrome
```

:::info Speeding Up for Users in mainland China
If Homebrew downloads are slow, you can use the Tsinghua University mirror:

```bash
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
```

Add the above to your `~/.zprofile` or `~/.bash_profile`.
:::

---

## 4.3 Ubuntu: apt

`apt` (Advanced Package Tool) is the default package manager for Debian/Ubuntu systems.

### Common Commands

```bash
sudo apt update              # Update the package index (recommended before each installation)
sudo apt install git         # Install
sudo apt upgrade git         # Upgrade a single package
sudo apt full-upgrade        # Upgrade all packages
sudo apt remove git          # Uninstall (keep config files)
sudo apt purge git           # Completely uninstall (including config files)
sudo apt autoremove          # Clean up unneeded dependencies
apt search python3           # Search (no sudo needed)
apt show python3             # View package information
```

:::caution Note about sudo
On Ubuntu, installing and uninstalling software requires administrator privileges — prefix commands with `sudo`. Searching and viewing information does not require it.
:::

### Mirror Sources in mainland China

Edit `/etc/apt/sources.list` and replace `archive.ubuntu.com` with a mirror site:

```bash
# Back up the original file
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

# Use the Tsinghua mirror (example for Ubuntu 22.04 jammy)
sudo sed -i 's|archive.ubuntu.com|mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list
sudo apt update
```

---

## 4.4 Windows: winget / scoop

### winget (Built into Windows)

Windows 10/11 comes with `winget` (Windows Package Manager):

```powershell
winget search python          # Search
winget install Python.Python.3.12   # Install
winget upgrade Python.Python.3.12   # Upgrade
winget uninstall Python.Python.3.12 # Uninstall
winget list                   # List installed packages
```

### scoop (Recommended for Developers)

[Scoop](https://scoop.sh) is better suited for developers and does not require administrator privileges to install software:

```powershell
# Install scoop (run in PowerShell)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Common commands
scoop search git
scoop install git
scoop update git
scoop uninstall git
scoop list
```

Add commonly used buckets (software sources):

```powershell
scoop bucket add extras
scoop bucket add versions
scoop bucket add java
```

:::tip WSL Users
If you are already using WSL (Windows Subsystem for Linux), use `apt` directly within the Linux environment — the experience is identical to native Ubuntu. Use `winget` or `scoop` to manage tools on the Windows side.
:::

---

## 4.5 How to Search, Install, Upgrade, and Uninstall Software

The following table summarizes common operations across the three platforms:

| Operation | macOS (Homebrew) | Ubuntu (apt) | Windows (scoop) |
|-----------|-----------------|--------------|-----------------|
| Search | `brew search X` | `apt search X` | `scoop search X` |
| Install | `brew install X` | `sudo apt install X` | `scoop install X` |
| Upgrade | `brew upgrade X` | `sudo apt upgrade X` | `scoop update X` |
| Uninstall | `brew uninstall X` | `sudo apt remove X` | `scoop uninstall X` |
| List installed | `brew list` | `apt list --installed` | `scoop list` |
| Update index | `brew update` | `sudo apt update` | `scoop update` |

---

## 4.6 Package Manager vs. Manual Installation

### When to Use a Package Manager

- Installing common tools: git, gcc, python, cmake, wget, curl
- Installing system-level libraries: openblas, fftw, hdf5
- When you need to set up an environment quickly

### When to Install Manually

- You need a specific version not available in the package manager
- You need custom compile options (e.g., enabling specific CPU instruction set optimizations)
- Installing the latest development version
- On HPC clusters without root privileges, using the `module` system or compiling to `$HOME`

:::info
On high-performance computing (HPC) clusters, software is typically managed using the `module` system rather than package managers. This will be covered in later chapters.
:::

---

## 4.7 Common Pitfalls: Permissions, Mirrors, and PATH Conflicts

### Permission Issues

```bash
# Error: Permission denied
$ apt install git
E: Could not open lock file - open (13: Permission denied)

# Solution: add sudo
$ sudo apt install git
```

:::caution Never Run Homebrew with sudo
```bash
# Wrong approach
sudo brew install python   # Do not do this

# Correct approach
brew install python        # Correct
```
Homebrew is designed to run without root. If you encounter permission issues, run `brew doctor` to diagnose.
:::

### PATH Conflicts

Installed a new version of Python but the terminal still shows the old one? It might be a PATH ordering issue:

```bash
# Check which python is currently in use
which python3
# /usr/bin/python3  <-- old version bundled with the system

# Check PATH
echo $PATH

# Homebrew's path should come before the system path
export PATH="/opt/homebrew/bin:$PATH"
```

### Network Issues (Users in mainland China)

If download speeds are extremely slow or connections time out, refer to the mirror source configurations in each section. Common mirror sites:

| Mirror Site | URL |
|------------|-----|
| Tsinghua University TUNA | https://mirrors.tuna.tsinghua.edu.cn |
| USTC (University of Science and Technology of China) | https://mirrors.ustc.edu.cn |
| Alibaba Cloud | https://developer.aliyun.com/mirror |

### Package Not Found

```bash
# Can't find it with apt? Update the index first
sudo apt update

# Still can't find it? It might be in the universe repository
sudo add-apt-repository universe
sudo apt update
```

---

## 4.8 Installing the Essential Toolkit

The following are commonly used basic tools in research computing that you should install first on a new environment:

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

### Windows (scoop)

```powershell
scoop install git wget curl python cmake
scoop bucket add extras
scoop install vscode
```

### Verify Installation

```bash
git --version
python3 --version
gcc --version
cmake --version
```

:::tip One-Click Script
You can write the commands above into a shell script `setup.sh`, so that on a new machine you only need to run `bash setup.sh`. This is the **reproducibility** that package managers provide.
:::

---

## FAQ

**Q: Homebrew installation is too slow — what should I do?**
A: Configure the Tsinghua or USTC mirror source; see Section 4.2.

**Q: `pip install` on Ubuntu gives the error "externally-managed-environment"?**
A: Ubuntu 23.04+ enables PEP 668 protection by default. Use a virtual environment: `python3 -m venv myenv && source myenv/bin/activate`.

**Q: Should I use scoop or winget on Windows?**
A: For development tools, scoop is recommended (no admin privileges needed, better path management). For regular GUI applications, you can use winget. The two can coexist.

**Q: Where does the package manager install software?**
A: Homebrew installs to `/opt/homebrew/` (Apple Silicon) or `/usr/local/` (Intel). apt installs to `/usr/`. scoop installs to `~/scoop/`.

---

## Summary

- Package managers are essential tools for modern development and research — **always prefer using a package manager to install software**
- macOS uses **Homebrew**, Ubuntu uses **apt**, Windows uses **scoop** or **winget**
- Users in mainland China should configure **mirror sources** to speed up downloads
- When encountering issues, first check PATH, permissions, and network connectivity

---

## Exercises

1. Install a package manager on your system (if you haven't already)
2. Use the package manager to install `git`, `wget`, and `tree`, and verify that the installation was successful
3. Use the `search` command to find `python`-related packages and observe the output
4. Try configuring a mirror source in mainland China and compare download speeds before and after
5. Write a `setup.sh` script that contains installation commands for all the basic tools you need
