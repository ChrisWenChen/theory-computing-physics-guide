---
sidebar_position: 3
sidebar_label: "3. Platform Setup"
---

# Chapter 3: Platform Environment Setup

> Sharpening the axe before chopping wood — spending half a day setting up the environment saves countless hours of frustration down the road.

## Chapter Goals

After completing this chapter, you should be able to:

- Understand the pros and cons of macOS, Ubuntu, and Windows
- Choose the right platform based on your needs
- Install and configure WSL on Windows
- Understand the differences between platforms in terms of file systems, paths, and permissions
- Handle common issues when working with files across platforms

## Motivation

Choosing and configuring an operating system is the first step of your research computing journey. Each platform has its strengths and weaknesses — there is no "best" platform, only the one "best suited for you." More importantly, you need to understand the differences between platforms, because your code will likely need to run on different platforms — for example, developing on your Mac but running on a Linux server.

## 3.1 macOS: Features and Recommendations

### Advantages

- **Unix-like system**: macOS is based on Darwin (BSD Unix) and comes with a full terminal and Shell environment
- **Great development experience**: A large number of development tools natively support macOS
- **High-quality hardware**: Apple Silicon (M-series) chips deliver strong performance with excellent battery life
- **Excellent graphical interface**: Smooth daily user experience

### Things to Note

- macOS does not ship with compilers like gcc; you need to install **Xcode Command Line Tools**
- Software installation is recommended via the **Homebrew** package manager
- M-series chips use ARM architecture; a small number of legacy software packages may need to run through Rosetta 2 translation
- Does not support Intel oneAPI

### Initial Setup Steps

```bash
# 1. Install Xcode Command Line Tools
xcode-select --install

# 2. Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 3. Verify installation
brew --version
gcc --version
git --version
```

### Recommended Tools to Install

```bash
brew install wget tree htop
brew install --cask iterm2 visual-studio-code
```

:::tip Good News for macOS Users
Terminal commands on macOS are almost fully compatible with Linux. You can directly use most commands in this tutorial without any additional configuration.
:::

## 3.2 Ubuntu: Features and Recommendations

### Advantages

- **The gold standard for research computing**: Servers and supercomputers almost universally run Linux
- **Broadest software support**: Scientific computing software typically prioritizes Linux support
- **Completely free and open source**: No licensing fees required
- **Powerful package manager**: `apt` can install most software with a single command
- **Low resource usage**: Runs faster on the same hardware compared to Windows and macOS

### Things to Note

- The desktop environment is not as polished or user-friendly as macOS and Windows
- Certain commercial software (e.g., Office, Adobe suite) does not have Linux versions
- Hardware drivers (especially for graphics cards and Wi-Fi) occasionally need manual configuration
- It is recommended to use **Ubuntu LTS** (Long Term Support) versions for stability and reliability

### Initial Setup Steps

```bash
# 1. Update the system
sudo apt update && sudo apt upgrade -y

# 2. Install basic development tools
sudo apt install -y build-essential git curl wget vim

# 3. Install commonly used tools
sudo apt install -y tree htop net-tools

# 4. Verify installation
gcc --version
git --version
python3 --version
```

### Ubuntu Version Selection

| Version | Type | Support Period | Recommendation |
|---------|------|---------------|----------------|
| Ubuntu 24.04 LTS | Long Term Support | 5 years | Recommended |
| Ubuntu 22.04 LTS | Long Term Support | 5 years | Stable and reliable |
| Ubuntu non-LTS | Regular | 9 months | Not recommended for research |

## 3.3 Windows: Features and Recommendations

### Advantages

- **Largest user base**: The most commonly used desktop operating system worldwide
- **Rich software ecosystem**: Good support for Office and various commercial software
- **Gaming and daily use**: Best experience
- **The arrival of WSL**: Has fundamentally improved the research computing experience on Windows

### Things to Note

- Native Windows command lines (cmd, PowerShell) differ significantly from Linux/macOS
- File paths use backslashes `\`, unlike the `/` on Unix systems
- Line endings are `\r\n` (CRLF), while Unix systems use `\n` (LF), which often causes cross-platform issues
- **Strongly recommended to install WSL** for a complete Linux environment within Windows

### Windows Terminal

Windows 11 comes with Windows Terminal, a modern terminal application that supports multiple tabs and can run PowerShell, cmd, and WSL simultaneously.

If you are using Windows 10, install Windows Terminal from the Microsoft Store.

## 3.4 Why WSL Is Recommended on Windows

**WSL (Windows Subsystem for Linux)** lets you run a Linux environment directly on Windows, without dual-booting or a virtual machine.

### Why Do You Need WSL?

1. The vast majority of research software is developed for Linux
2. Servers and supercomputers all run Linux; using the same environment locally reduces "it works on my machine" problems
3. A large number of tutorials and documentation default to Linux commands
4. Shell scripts only need to be written once — they work both locally and on servers

### WSL 2 Installation Steps

#### Method 1: One-Command Install (Recommended)

Open PowerShell **as Administrator** (right-click the Start menu → "Terminal (Admin)", or search for PowerShell → right-click → "Run as administrator"):

```powershell
# One-command WSL installation (installs Ubuntu by default)
wsl --install
```

After installation completes, **restart your computer**. After restarting, Ubuntu will launch automatically and ask you to set a username and password.

```powershell
# Verify installation
wsl --list --verbose
# Should display:
#   NAME      STATE           VERSION
# * Ubuntu    Running         2
```

:::tip If the one-command install succeeds, you can skip Method 2 and go directly to "Post-Installation Configuration".
:::

#### Method 2: Manual Install (If One-Command Install Fails)

If `wsl --install` reports an error, you need to manually enable Windows features:

**Step 1: Enable Windows Features**

Open **"Turn Windows features on or off"** (either way):
- Search for "Turn Windows features on or off" in the search bar
- Or run `optionalfeatures`

In the dialog that appears, check the following two items:

- ✅ **Windows Subsystem for Linux**
- ✅ **Virtual Machine Platform**

Click "OK", wait for the installation to complete, then **restart your computer**.

Alternatively, you can enable these via administrator PowerShell:

```powershell
# Enable WSL feature
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine Platform
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart the computer
Restart-Computer
```

**Step 2: Set WSL 2 as the Default Version**

After restarting, open PowerShell as administrator:

```powershell
wsl --set-default-version 2
```

**Step 3: Install Ubuntu**

```powershell
# List available distributions
wsl --list --online

# Install Ubuntu (24.04 LTS recommended)
wsl --install -d Ubuntu-24.04
```

After installation, Ubuntu will launch and ask you to set a username and password.

:::caution Installation Notes
- Requires **Windows 10 version 2004** or later, or **Windows 11**
- **Virtualization must be enabled in BIOS** (enabled by default on most computers; if you encounter errors, restart into BIOS and enable Intel VT-x or AMD-V)
- First installation requires downloading approximately 1 GB of data
- If you see "WSL 2 requires an update to its kernel component", visit https://aka.ms/wsl2kernel to download and install the Linux kernel update package
:::

### Post-Installation Configuration

```bash
# Execute in the WSL Ubuntu terminal

# 1. Update the system
sudo apt update && sudo apt upgrade -y

# 2. Install basic tools
sudo apt install -y build-essential git curl wget vim python3 python3-pip

# 3. Configure Git (replace with your information)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### File Access Between WSL and Windows

```bash
# Access Windows files from WSL
ls /mnt/c/Users/your_username/Desktop/

# Access WSL files from Windows Explorer
# Enter in the address bar: \\wsl$\Ubuntu\home\your_username\
```

:::caution Performance Tip
Keep your project files within the **WSL file system** (e.g., `/home/your_username/projects/`), not in the Windows file system (e.g., `/mnt/c/...`). Cross-filesystem operations will significantly reduce performance, especially for Git operations and compilation.
:::

## 3.5 File System and Line Ending Differences

### File System Differences

| Feature | macOS (APFS) | Linux (ext4) | Windows (NTFS) |
|---------|-------------|-------------|----------------|
| Case sensitivity | Not sensitive by default | Sensitive | Not sensitive |
| Max filename length | 255 bytes | 255 bytes | 255 characters |
| Path separator | `/` | `/` | `\` |
| Forbidden filename characters | `:` `/` | `/` | `\ / : * ? " < > \|` |
| Hidden file marker | Starts with `.` | Starts with `.` | File attribute |

:::caution Case Sensitivity
On Linux, `Data.csv` and `data.csv` are **two different files**. On macOS and Windows, they are the same file. This frequently causes problems in cross-platform collaboration.

**Recommendation: Always use lowercase letters in filenames to avoid ambiguity.**
:::

### Line Ending Differences

| System | Line Ending | Hexadecimal | Name |
|--------|------------|-------------|------|
| Linux / macOS | `\n` | `0x0A` | LF (Line Feed) |
| Windows | `\r\n` | `0x0D 0x0A` | CRLF (Carriage Return + Line Feed) |

This seemingly minor difference causes many problems:

```bash
# Shell scripts with Windows line endings will produce errors:
# /bin/bash^M: bad interpreter

# Check file line endings
file script.sh

# Convert line endings
# Install dos2unix
sudo apt install dos2unix

# Windows → Unix
dos2unix script.sh

# Unix → Windows
unix2dos script.sh
```

**Recommendation: Configure your editor to use LF line endings by default.** In VS Code, click "CRLF" in the bottom-right corner to switch to "LF", or search for `files.eol` in settings and set it to `\n`.

## 3.6 Permissions and Administrator Privileges

### Unix Permission Model (macOS / Linux)

Every file in a Unix system has permission attributes:

```bash
$ ls -l script.py
-rwxr-xr-- 1 student group 1234 Jan 15 10:00 script.py
```

The meaning of the permission string `rwxr-xr--`:

```
rwx    r-x    r--
 │      │      │
 │      │      └── Other users: read only
 │      └────────── Group members: read and execute
 └───────────────── File owner: read, write, and execute
```

| Permission | Letter | Number | Meaning |
|-----------|--------|--------|---------|
| Read | r | 4 | View file contents |
| Write | w | 2 | Modify file contents |
| Execute | x | 1 | Run the file (script/program) |

```bash
# Add execute permission
chmod +x script.sh

# Set permissions using numbers (owner: rwx, others: read only)
chmod 744 script.sh

# Recursively modify permissions for an entire directory
chmod -R 755 project/
```

### sudo — Superuser Privileges

Certain operations require administrator privileges (such as installing system-level software):

```bash
# Install software (requires sudo)
sudo apt install python3

# View a protected file
sudo cat /etc/shadow
```

:::caution Use sudo with Caution
`sudo` gives you full system control. Be especially careful when using commands like `sudo rm`, as they can delete system files.

**Principle: If you're not sure whether a command needs sudo, try without sudo first. Only consider using sudo when you get a "Permission denied" error.**
:::

### Windows Permissions

Windows uses a different permission model (ACL). Running a program as administrator is equivalent to `sudo` on Linux:

- Right-click a program → "Run as administrator"
- Or open the terminal as administrator

## 3.7 Path Style Differences

### Three Path Styles

```bash
# Linux
/home/student/research/simulation.py

# macOS
/Users/student/research/simulation.py

# Windows (native)
C:\Users\student\research\simulation.py

# Windows (within WSL)
/home/student/research/simulation.py       # WSL internal files
/mnt/c/Users/student/research/simulation.py  # Accessing Windows files
```

### Home Directory

| System | Home Directory | Shortcut |
|--------|---------------|----------|
| Linux | `/home/username` | `~` |
| macOS | `/Users/username` | `~` |
| Windows | `C:\Users\username` | `%USERPROFILE%` |
| WSL | `/home/username` | `~` |

### Spaces and Special Characters in Paths

Universal recommendations for all platforms:

```bash
# Avoid the following in project paths:
# - Spaces
# - Non-ASCII characters (e.g., Chinese characters)
# - Special characters (parentheses, exclamation marks, etc.)

# Recommended
/home/student/ising_model/
/home/student/quantum-espresso-runs/

# Not recommended
/home/student/Ising Model (2024)/
/home/student/quantum_computing_project/
```

## 3.8 Platform Selection Recommendations

### Quick Decision Table

| Your Situation | Recommended Platform | Reason |
|----------------|---------------------|--------|
| Just starting out, used to Windows | Windows + WSL | Keep your familiar daily environment, learn Linux through WSL |
| Have a Mac | macOS | Native Unix-like, works out of the box |
| Want the purest research experience | Ubuntu | Fully consistent with server environments |
| Need to run GPU computing | Ubuntu or Windows + WSL | Linux has the best CUDA support |
| Your lab has a unified requirement | Follow your lab | Easier communication and collaboration |

### Dual-Boot and Virtual Machines

If you want to use both Windows and Linux simultaneously:

| Option | Pros | Cons |
|--------|------|------|
| WSL | Easy to install, seamless integration with Windows | Minor compatibility issues in edge cases |
| Dual-boot | Best performance for each system | Switching requires a reboot |
| Virtual machine | Complete isolation, supports snapshots | Performance overhead |

:::tip Recommended Approach
For most physics students, **Windows + WSL** or **macOS** is the best choice. The former lets you have a complete Linux environment while keeping Windows for daily use; the latter naturally provides a Unix-like experience.

Regardless of which platform you use, this tutorial covers it. What matters is not which platform you choose, but **getting started and sticking with learning**.
:::

### Three-Platform Comparison Table

| Feature | macOS | Ubuntu | Windows + WSL |
|---------|-------|--------|--------------|
| Terminal availability | Out of the box | Out of the box | Requires WSL installation |
| Package manager | Homebrew | apt | apt (within WSL) |
| Scientific software compatibility | Good | Best | Good (via WSL) |
| GUI application experience | Excellent | Good | Excellent |
| Consistency with servers | High | Highest | High (within WSL) |
| Daily use | Excellent | Good | Excellent |
| Learning resource availability | Abundant | Most abundant | Abundant |
| Price | Expensive hardware | Free | OS is paid |

## FAQ

**Q: Do I have to learn Linux?**

A: If you are doing computational physics, the answer is "yes." All supercomputers and most computing servers run Linux. But you don't need to switch your personal computer to Linux — the macOS terminal experience is very close to Linux, and Windows can use Linux through WSL.

**Q: Is WSL performance adequate?**

A: For most learning and moderate-scale computing tasks, WSL 2 performance is nearly equivalent to native Linux. Truly large-scale computations should be submitted to your university's servers or supercomputers, not run on a personal computer.

**Q: I use macOS — do I need to install WSL?**

A: No. WSL is Windows-only. macOS comes with a Unix-like environment and does not need an additional Linux subsystem.

**Q: After installing WSL, are my original Windows files still there?**

A: Absolutely. WSL is an independent Linux environment and will not affect your Windows files. You can access Windows files from WSL through `/mnt/c/`.

**Q: Are line ending issues really that common?**

A: Very common. Almost everyone who transfers files between Windows and Linux encounters them. Configuring your editor (default to LF) and Git (`core.autocrlf = input`) can prevent most problems.

```bash
# Configure Git to automatically handle line endings
git config --global core.autocrlf input    # macOS / Linux / WSL
git config --global core.autocrlf true     # Native Windows environment
```

## Summary

- macOS is natively Unix-like, suitable for research development, and works out of the box
- Ubuntu is the standard platform for research computing; servers almost universally use it
- Windows can get a complete Linux experience through WSL
- Understanding file system differences (case sensitivity, path separators, line endings) can prevent many cross-platform issues
- Permission management is an important concept in Unix systems; use `sudo` wisely but cautiously
- Avoid spaces and non-ASCII characters in file and directory names; use English letters, underscores, and hyphens

## Exercises

### Exercise 3.1: Environment Verification

Based on your operating system, run the following commands in the terminal and record the results:

```bash
# Universal for all platforms (in a bash environment)
echo $SHELL           # Current Shell
uname -a              # System information
whoami                # Current username
pwd                   # Current directory
echo $HOME            # Home directory
```

### Exercise 3.2: WSL Installation (Windows Users)

If you are using Windows:

1. Follow the steps in Section 3.4 to install WSL
2. Run `lsb_release -a` in WSL to confirm the Ubuntu version
3. Run `ls /mnt/c/Users/` in WSL to verify you can access Windows files
4. Create a file `/home/your_username/test.txt`, then find it in Windows Explorer via the `\\wsl$\Ubuntu\` path

### Exercise 3.3: Line Ending Experiment

1. Create a file `test_crlf.txt` with a few lines of text in Windows Notepad
2. Copy the file to a WSL or Linux environment
3. Use `file test_crlf.txt` to check the line ending format
4. Use `dos2unix` to convert the line endings
5. Check the line ending format again

### Exercise 3.4: Permission Experiment (macOS / Linux / WSL)

1. Create a file `hello.sh` with the content `echo "Hello, physics!"`
2. Try running `./hello.sh` (you will get a permission error)
3. Use `chmod +x hello.sh` to add execute permission
4. Run `./hello.sh` again
5. Use `ls -l hello.sh` to observe the permission change

### Exercise 3.5: Cross-Platform Path Exercise

Write out the paths for the following files on different systems:

1. `notes.txt` on your desktop (write the path for macOS, Linux, Windows, and WSL respectively)
2. The absolute path to `projects/ising_model/main.py` under your home directory
3. The path to access `data.csv` on the Windows desktop from within WSL
