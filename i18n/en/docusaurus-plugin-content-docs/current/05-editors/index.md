---
sidebar_position: 5
sidebar_label: "5. Editors & IDEs"
---

# Chapter 5: Editors and IDEs

> Choose the right editor and your productivity doubles; choose the wrong one and it halves.

## Chapter Goals

- Understand the use cases for terminal editors and graphical editors
- Master basic nano operations — be able to quickly edit files on a server
- Master survival-level vim commands — at least be able to exit properly
- Become proficient with VS Code for research development
- Configure VS Code extensions suitable for computational physics

## Motivation

As a computational physics researcher, you will frequently edit code, configuration files, scripts, and documents. In different scenarios, you need different tools:

- Modifying a single line of configuration on a remote server via SSH → **nano** or **vim**
- Developing Python/C++ projects locally → **VS Code**
- Editing code on an HPC cluster without a graphical interface → **vim**

There is no "best editor," only the "best editor for the current scenario."

---

## 5.1 Why You Should Learn at Least One Terminal Editor

:::caution Real-World Scenario
You've connected to a remote server via SSH and need to modify a configuration file. The server has no graphical interface, no VS Code — only the terminal. You **must** know how to use a terminal editor.
:::

A terminal editor is a text editor that runs in the command line and does not require a graphical interface. Common ones include:

| Editor | Learning Difficulty | Features | Use Case |
|--------|-------------------|----------|----------|
| nano | Very low | Basic | Quick edits of small files |
| vim | Fairly high | Powerful | Heavy terminal users, server-side development |
| emacs | High | Extremely powerful | Users with specific preferences |

**Recommendation: Learn at least nano, and ideally also learn basic vim operations.**

---

## 5.2 nano: The Simplest Terminal Editor

nano is the easiest terminal editor to pick up, and it comes pre-installed on almost all Linux systems.

### Opening a File

```bash
nano filename.txt        # Open a file (creates it if it doesn't exist)
nano +10 filename.txt    # Open a file and jump to line 10
```

### Basic Operations

nano displays keyboard shortcut hints at the bottom, where `^` means the Ctrl key:

| Shortcut | Function |
|----------|----------|
| `Ctrl+O` | Save file (Write Out) |
| `Ctrl+X` | Exit |
| `Ctrl+K` | Cut current line |
| `Ctrl+U` | Paste |
| `Ctrl+W` | Search |
| `Ctrl+G` | Help |
| `Ctrl+C` | Show current line number |
| `Alt+U` | Undo |

### Typical Workflow

```bash
nano ~/.bashrc           # Open a configuration file
# Edit contents...
# Ctrl+O → Enter to save
# Ctrl+X to exit
```

:::tip
nano is well suited for quickly editing configuration files and writing short scripts. If you just need to change a few lines of code on a server, nano is more than enough.
:::

---

## 5.3 vim: The Classic Terminal Editor

vim (Vi IMproved) is a powerful editor with a steep learning curve. Its core philosophy is **modal editing** — keys have different meanings in different modes.

### vim Modes

```
Normal mode (default) ──→ Insert mode (press i)
       ↑                    │
       └────────────────────┘ (press Esc)
```

| Mode | Purpose | How to Enter |
|------|---------|-------------|
| Normal | Move cursor, delete, copy | Press `Esc` |
| Insert | Type text | Press `i` |
| Command | Execute commands (save, quit, etc.) | Press `:` in Normal mode |
| Visual | Select text | Press `v` in Normal mode |

### Survival-Level Commands (Must Memorize)

```
Open a file:       vim filename.txt
Enter edit mode:   Press i (enters Insert mode)
Exit edit mode:    Press Esc (returns to Normal mode)
Save and quit:     Type :wq then Enter
Quit without saving: Type :q! then Enter
Save:              Type :w then Enter
```

:::caution How to Exit vim
This is one of the most classic questions on the internet. The answer is:

1. Press `Esc` (make sure you're in Normal mode)
2. Type `:q!` (quit without saving) or `:wq` (save and quit)
3. Press `Enter`
:::

### Intermediate Commands (Recommended)

| Command | Function |
|---------|----------|
| `dd` | Delete current line |
| `yy` | Copy current line |
| `p` | Paste |
| `u` | Undo |
| `Ctrl+R` | Redo |
| `/keyword` | Search for keyword |
| `n` | Jump to next search result |
| `gg` | Jump to beginning of file |
| `G` | Jump to end of file |
| `:set number` | Show line numbers |
| `:%s/old/new/g` | Global find and replace |

### vim Configuration File

Create or edit `~/.vimrc`:

```vim
set number          " Show line numbers
set relativenumber  " Show relative line numbers
set tabstop=4       " Tab width of 4
set shiftwidth=4    " Indent width of 4
set expandtab       " Use spaces instead of tabs
set autoindent      " Auto indent
set hlsearch        " Highlight search results
set incsearch       " Incremental search
syntax on           " Syntax highlighting
```

### Tips for Learning vim

```bash
vimtutor            # vim's built-in interactive tutorial (about 30 minutes)
```

:::info
Don't try to learn all of vim's features at once. Start by memorizing the survival-level commands, and gradually learn new commands through daily use.
:::

---

## 5.4 VS Code: The Most Versatile Research Development Tool

[Visual Studio Code](https://code.visualstudio.com) is currently the most popular code editor — free, open source, cross-platform, with a rich extension ecosystem.

### Installation

Install via your system's package manager — this gives you automatic updates alongside your other tools:

```bash
# Windows (winget)
winget install Microsoft.VisualStudioCode

# macOS (Homebrew)
brew install --cask visual-studio-code

# Ubuntu (official apt repository — supports automatic future updates)
wget -qO- https://packages.microsoft.com/keys/microsoft.asc \
  | gpg --dearmor \
  | sudo tee /etc/apt/keyrings/microsoft.gpg > /dev/null
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/microsoft.gpg] \
  https://packages.microsoft.com/repos/code stable main" \
  | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update && sudo apt install code
```

If you prefer not to use a package manager, download the installer directly from the [official website](https://code.visualstudio.com) (`.exe` for Windows, `.dmg` for macOS, `.deb` for Ubuntu) and double-click to install.

### Opening VS Code from the Command Line

```bash
code .                  # Open the current directory
code filename.py        # Open a file
code --diff a.py b.py   # Compare two files
```

:::tip
macOS users need to set up the `code` command for first-time use: in VS Code, press `Cmd+Shift+P`, search for "Shell Command: Install 'code' command in PATH".
:::

---

## 5.5 Recommended VS Code Extensions

The following are the most practical VS Code extensions for computational physics research:

### Language Support

| Extension Name | Purpose |
|---------------|---------|
| **Python** (Microsoft) | Python language support, debugging, execution |
| **Pylance** (Microsoft) | Python intelligent completion, type checking |
| **C/C++** (Microsoft) | C/C++ language support, debugging |
| **CMake Tools** (Microsoft) | CMake project building |
| **Fortran** (fortls) | Fortran language support |
| **Julia** (julialang) | Julia language support |

### Research Tools

| Extension Name | Purpose |
|---------------|---------|
| **Jupyter** (Microsoft) | Run Jupyter Notebooks in VS Code |
| **LaTeX Workshop** (James Yu) | LaTeX writing and compilation |
| **Markdown All in One** | Markdown writing and preview |

### Remote Development

| Extension Name | Purpose |
|---------------|---------|
| **Remote - SSH** (Microsoft) | Edit code on remote servers via SSH |
| **WSL** (Microsoft) | Develop within WSL (essential for Windows users) |
| **Dev Containers** (Microsoft) | Develop in Docker containers |

### Productivity Tools

| Extension Name | Purpose |
|---------------|---------|
| **GitLens** (GitKraken) | Enhanced Git features, view code history |
| **Error Lens** | Display error messages inline with code |
| **indent-rainbow** | Color-code indentation levels |
| **Code Spell Checker** | Spell checking |

### Installing Extensions from the Command Line

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

## 5.6 Remote SSH / Jupyter / Python / CMake / LaTeX Extensions

### Remote SSH for Remote Development

This is one of the most useful VS Code features for research. It allows you to connect to a remote server via SSH and edit and run code as if you were working locally.

Steps:

1. Install the Remote - SSH extension
2. Press `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`), search for "Remote-SSH: Connect to Host"
3. Enter `user@hostname` or select from `~/.ssh/config`
4. VS Code will install a lightweight server component on the remote machine
5. After that, it works just like local editing

:::info
Remote SSH requires the remote server to be able to run VS Code Server. Most Linux servers support this, but some restricted HPC login nodes may not allow it.
:::

### VS Code with WSL (Windows Users)

If you're using WSL (Windows Subsystem for Linux) on Windows, VS Code can connect directly to your WSL Linux environment and work as if you were on native Linux.

#### Step 1: Install the WSL Extension

Install the **WSL** extension in VS Code (extension ID: `ms-vscode-remote.remote-wsl`):

```bash
code --install-extension ms-vscode-remote.remote-wsl
```

#### Step 2: Open VS Code from the WSL Terminal

The simplest approach is to run `code` directly from the WSL terminal:

```bash
# In the WSL terminal
cd ~/my-project
code .                  # Open the current directory
code filename.py        # Open a single file
```

On first run, VS Code will automatically install VS Code Server inside WSL. After that, it opens directly.

#### Step 3: Connect to WSL from the Windows Side

You can also connect from VS Code on the Windows side:

1. Press `Ctrl+Shift+P`, search for **"WSL: Connect to WSL"**
2. Select your WSL distribution (e.g., Ubuntu)
3. VS Code will reopen a new window with **"WSL: Ubuntu"** shown in the bottom-left corner

When successfully connected, you'll see a green WSL indicator in the bottom-left:

```
┌─────────────────────────────────┐
│  VS Code bottom-left shows:     │
│  ► WSL: Ubuntu                  │
└─────────────────────────────────┘
```

#### How It Works After Connecting

Once connected to WSL, all VS Code operations execute in the Linux environment:

- **Terminal** (`Ctrl+`` `): Opens bash/zsh from WSL, not Windows PowerShell
- **File Explorer**: Shows the WSL Linux filesystem (`/home/username/...`)
- **Python Interpreter**: Uses Python installed in WSL, not Windows Python
- **Compilers**: Uses gcc/gfortran from WSL, not Windows
- **Extensions**: Some extensions need to be reinstalled on the WSL side (VS Code will prompt you)

#### Filesystem Considerations

:::caution Performance Critical
**Always keep your projects in the WSL filesystem** (`/home/username/...`), not on the Windows filesystem (`/mnt/c/Users/...`).

Cross-filesystem operations (accessing files under `/mnt/c/` from WSL) are extremely slow, especially for operations involving many files (e.g., `git status`, `npm install`, Python virtual environments).
:::

```bash
# ✅ Correct: Project in the WSL filesystem
cd ~
mkdir -p projects
cd projects
git clone https://github.com/user/repo.git
code repo/

# ❌ Wrong: Project on the Windows filesystem (very slow)
cd /mnt/c/Users/username/Desktop/repo
code .
```

#### Copying Files Between WSL and Windows

```bash
# Copy from Windows to WSL
cp /mnt/c/Users/username/Downloads/data.csv ~/projects/

# Copy from WSL to Windows
cp ~/projects/result.png /mnt/c/Users/username/Desktop/

# Open the current WSL directory in Windows File Explorer
explorer.exe .
```

#### Verifying Connection Status

```bash
# Run in VS Code's terminal
uname -a        # Should show Linux ... microsoft-standard-WSL2
which python3   # Should be /usr/bin/python3 or a WSL path, not /mnt/c/...
echo $HOME      # Should be /home/username
```

#### Common Issues

**Q: VS Code says "Cannot reconnect to WSL"?**
A: Run `wsl --shutdown` in Windows PowerShell, then reopen WSL and VS Code.

**Q: Extensions don't work in WSL mode?**
A: Some extensions need to be installed separately on the WSL side. Open the Extensions panel (`Ctrl+Shift+X`) and look for an "Install in WSL" button.

**Q: The `code` command is not found in WSL?**
A: Make sure VS Code on the Windows side is added to PATH. Restart the WSL terminal, or run `export PATH="$PATH:/mnt/c/Users/$USER/AppData/Local/Programs/Microsoft VS Code/bin"`.

---

### Jupyter Notebook

After installing the Jupyter extension, VS Code can directly open and edit `.ipynb` files, with support for interactive execution and inline plotting.

### LaTeX Workshop

After configuring TeX Live, LaTeX Workshop can provide:
- Automatic compilation on save
- Real-time PDF preview
- Syntax highlighting and auto-completion
- Forward/inverse search (click on PDF to jump to source code)

---

## 5.7 When to Use nano, vim, or VS Code

| Scenario | Recommended Editor |
|----------|-------------------|
| SSH to a server to change one line of configuration | nano |
| Edit scripts on a server (no graphical interface) | vim or nano |
| Local Python/C++ project development | VS Code |
| Remote development (with stable network) | VS Code + Remote SSH |
| Writing LaTeX papers | VS Code + LaTeX Workshop |
| Editing Jupyter Notebooks | VS Code + Jupyter extension |
| Quickly viewing file contents | `cat` / `less` / `head` |

:::tip Practical Advice
- **Must learn** nano (takes 5 minutes to master)
- **Recommended to learn** basic vim operations (30-minute `vimtutor`)
- **Focus on mastering** VS Code (your daily development workhorse)
:::

---

## 5.8 Basic Configuration and Keyboard Shortcuts

### VS Code Keyboard Shortcuts

The following are the most commonly used shortcuts (macOS users: replace `Ctrl` with `Cmd`):

| Shortcut | Function |
|----------|----------|
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+P` | Quick Open file |
| `Ctrl+Shift+F` | Global search |
| `Ctrl+D` | Select next occurrence of the same word |
| `Ctrl+/` | Toggle comment |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+`` ` | Toggle terminal |
| `Ctrl+Shift+E` | Explorer |
| `Ctrl+Shift+G` | Git panel |
| `Ctrl+Shift+X` | Extensions panel |
| `Alt+Up/Down` | Move current line |
| `Ctrl+Shift+K` | Delete current line |
| `F2` | Rename symbol |
| `F12` | Go to definition |
| `Ctrl+Click` | Go to definition |
| `Ctrl+Shift+[` | Fold code block |
| `Ctrl+Shift+]` | Unfold code block |

### VS Code User Settings

Press `Ctrl+,` to open settings, or edit `settings.json`:

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

### Terminal Editor Shortcut Comparison

| Operation | nano | vim |
|-----------|------|-----|
| Save | `Ctrl+O` | `:w` |
| Quit | `Ctrl+X` | `:q` |
| Save and quit | `Ctrl+O` → `Ctrl+X` | `:wq` |
| Quit without saving | `Ctrl+X` → `N` | `:q!` |
| Search | `Ctrl+W` | `/keyword` |
| Undo | `Alt+U` | `u` |
| Cut line | `Ctrl+K` | `dd` |
| Paste | `Ctrl+U` | `p` |

---

## FAQ

**Q: VS Code is slow when opening large files — what should I do?**
A: For very large data files (>100MB), do not open them in VS Code. Use command-line tools like `head`, `tail`, or `less` to view them, or use specialized tools for processing.

**Q: Pasting code in vim messes up the indentation?**
A: Before pasting, type `:set paste`; after pasting, type `:set nopaste`.

**Q: VS Code Remote SSH won't connect?**
A: Check whether SSH can connect normally (test with `ssh user@host` in the terminal first). Confirm the remote server allows running processes. Check the VS Code Remote SSH output log.

**Q: Should I learn vim or emacs?**
A: Either works. vim is more widely available — virtually every server has it. If you have no particular preference, we recommend starting with vim.

---

## Summary

- **nano** is the simplest terminal editor, suitable for quick file edits
- **vim** is powerful with a steep learning curve, but mastering the basics is enough for most scenarios
- **VS Code** is the most recommended daily development tool; with extensions, it can meet nearly all research needs
- The **Remote SSH** extension lets you develop on remote servers as if working locally
- Remember vim's survival commands: `i` to enter edit mode, `Esc` to exit edit mode, `:wq` to save and quit, `:q!` to quit without saving

---

## Exercises

1. Use nano to create a file `hello.txt`, write "Hello, World!" in it, then save and exit
2. Use vim to open `hello.txt`, add "I am learning vim" on the second line, then save and exit
3. Complete the first two lessons of the `vimtutor` tutorial
4. Install VS Code, and install the Python, Remote SSH, and GitLens extensions
5. Configure `settings.json` in VS Code with your preferred font size and tab width
6. Try using VS Code's Remote SSH to connect to a remote server (if you have one available)
