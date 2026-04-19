---
sidebar_position: 2
sidebar_label: "2. Terminal Basics"
---

# Chapter 2: Terminal, Shell, and Command Line

> The command line is the "steering wheel" of research computing — you don't have to like it, but you must know how to use it.

## Chapter Goals

After completing this chapter, you should be able to:

- Open a terminal and enter commands
- Explain what a Shell does, and distinguish between bash, zsh, and PowerShell
- Use basic commands for file operations (create, move, copy, delete)
- View file contents
- Use `find` and `grep` to search for files and content
- Understand the role of the PATH environment variable
- Use pipes and redirection to combine commands

## Motivation

Why use the command line? Isn't the graphical interface good enough?

1. **Servers have no graphical interface**: When connecting to a supercomputer via SSH, the command line is all you have
2. **Batch operations**: Renaming 1000 files takes one line on the command line, but 1000 clicks in a graphical interface
3. **Reproducibility**: Write commands as scripts, and anyone can reproduce your operations
4. **Automation**: Submitting 100 computation jobs, scheduling data backups — all require the command line
5. **Speed**: Once proficient, the command line is much faster than a graphical interface

## 2.1 What Is a Terminal

A **terminal** is a program that lets you interact with the computer by typing text commands.

### How to Open a Terminal

**macOS:**
- `Command + Space`, type `Terminal`, press Enter
- Or go to `Applications → Utilities → Terminal`
- Recommended: use [iTerm2](https://iterm2.com/) as a replacement for the built-in terminal

**Ubuntu:**
- `Ctrl + Alt + T`
- Or search for Terminal in the application menu

**Windows:**
- Search for and open `Windows Terminal` (recommended)
- Or search for `PowerShell`
- If WSL is installed, you can select the Ubuntu tab in Windows Terminal

After opening the terminal, you will see an interface like this:

```bash
student@laptop:~$
```

This is called a **prompt**, and it is waiting for you to enter a command.

## 2.2 What Is a Shell

A Shell is a **command interpreter**. When you type a command in the terminal, the Shell reads, parses, and executes it.

For example, when you type:

```bash
pwd
```

The Shell runs the command and displays the result.

Note that a Shell and a terminal are **not the same thing**:

- **Terminal**: the interface where you type commands and see output
- **Shell**: the interpreter that actually runs inside that interface

Think of it this way:

> Terminal = the chat window; Shell = the person who understands and carries out your instructions

Common shells:

| Shell | System | Description |
|-------|--------|-------------|
| **bash** | Linux default | The most universal; available on virtually all Linux systems |
| **zsh** | macOS default | An enhanced version of bash with more features |
| **PowerShell** | Windows default | Syntax differs significantly from bash |
| **cmd** | Windows legacy | Limited functionality; rarely used in research |

:::tip Windows users
Install WSL and use bash/zsh inside it — you'll be able to follow the same commands as macOS/Linux users. **This tutorial defaults to bash syntax throughout.**
:::

### Check Your Current Shell

```bash
echo $SHELL
# Example output: /bin/bash or /bin/zsh
```

## 2.3 Differences Between CLI and GUI

| Feature | CLI (Command Line Interface) | GUI (Graphical User Interface) |
|---------|------------------------------|-------------------------------|
| Interaction | Type text commands | Mouse clicks |
| Learning curve | Steeper | Gentler |
| Batch operations | Very convenient | More difficult |
| Remote use | Convenient (SSH) | Often requires extra tools |
| Scriptability | Native support | Hard |
| Precise control | High | Medium |

In research, the two are typically **complementary**: you might use a GUI editor to write code, but use the CLI to compile, run, debug, and batch-process data.

### Example: Processing Experiment Data

Say you ran 100 experiments and each produced a data file.

**With a GUI**, you'd: open the folder → click through files one by one → manually copy, rename, and organize → import into analysis software. Intuitive, but slow and error-prone at scale.

**With the CLI**, three commands do the job:

```bash
mkdir results          # create a results folder
mv *.csv results/      # move all CSV files into it
wc -l results/*.csv    # count the lines in each file
```

If you need to repeat this regularly, wrap it in a script and run it in one go.

### Example: Edit Locally, Run Remotely

You write your program locally in VS Code (GUI), then use the CLI for the rest:

```bash
gcc main.c -o main     # compile
./main                 # run

ssh user@server        # log into a remote server to continue
```

:::tip CLI in the Age of AI
With AI coding assistants (Claude, GitHub Copilot, etc.), the CLI is easier to use than ever — describe what you want in plain English, let the AI generate the command, and paste it into your terminal. **Understanding CLI basics is what makes AI assistants genuinely useful to you.**
:::

## 2.4 Basic Commands: pwd, ls, cd, mkdir, cp, mv, rm

### pwd — Print the current directory

```bash
pwd
# Output: /home/student
```

`pwd` = **p**rint **w**orking **d**irectory. Whenever you forget where you are, use `pwd`.

### ls — List directory contents

```bash
ls              # List files and subdirectories in the current directory
ls -l           # Detailed information (permissions, size, date)
ls -la          # Include hidden files (files starting with .)
ls -lh          # Human-readable file sizes (KB, MB, GB)
ls research/    # List contents of a specific directory
```

Example output:

```
$ ls -lh
total 12K
drwxr-xr-x 2 student student 4.0K Jan 15 10:30 data
-rw-r--r-- 1 student student  856 Jan 15 09:20 simulation.py
-rw-r--r-- 1 student student 2.1K Jan 14 16:45 analysis.py
```

### cd — Change directory

```bash
cd research           # Enter the research subdirectory
cd /home/student      # Enter a directory specified by absolute path
cd ..                 # Go up one level
cd ~                  # Go to home directory
cd -                  # Go back to the previous directory
```

:::caution Common Mistake
```bash
cd research/data.txt   # Wrong! cd can only enter directories, not "enter" files
```
:::

### mkdir — Create a directory

```bash
mkdir my_project                  # Create a directory
mkdir -p project/src/utils        # Create nested directories (-p creates intermediate directories automatically)
```

### cp — Copy files or directories

```bash
cp file1.txt file2.txt            # Copy a file
cp file.txt backup/               # Copy to another directory
cp -r src_dir/ dest_dir/          # Copy an entire directory (requires -r)
```

### mv — Move or rename

```bash
mv old_name.py new_name.py        # Rename a file
mv data.csv results/              # Move a file to another directory
mv *.py scripts/                  # Move all .py files
```

### rm — Delete files or directories

```bash
rm unwanted_file.txt              # Delete a file
rm -r old_project/                # Delete a directory and its contents
rm -i important_file.txt          # Confirm before deleting (recommended)
```

:::danger rm has no recycle bin!
Files deleted by `rm` do **not** go to the recycle bin and are nearly impossible to recover. Always double-check the path when using `rm -r`.

**Never execute `rm -rf /` or `rm -rf ~`** — this will delete your entire system or all your files.
:::

### Practical Combination Example

```bash
# Create a standard directory structure for a new project
mkdir -p monte_carlo/{src,data,results,figures,docs}

# View the structure just created
ls monte_carlo/
# Output: data  docs  figures  results  src
```

## 2.5 Viewing File Contents: cat, less, head, tail

### cat — Output entire file contents

```bash
cat params.txt               # Display the full contents of a file
cat file1.txt file2.txt      # Display multiple files in sequence
```

Suitable for viewing small files. For large files, use `less`.

### less — Paginated viewing

```bash
less large_output.log
```

Controls within `less`:
- `Space` or `f`: Next page
- `b`: Previous page
- `/keyword`: Search for keyword
- `q`: Quit

### head and tail — View the beginning and end

```bash
head -n 20 data.csv           # View the first 20 lines
tail -n 10 simulation.log     # View the last 10 lines
tail -f simulation.log        # Follow the end of the file in real time (very useful for logs)
```

:::tip Practical Research Scenario
While a simulation is running, use `tail -f` to watch the output log in real time and monitor progress:
```bash
tail -f output.log
# Press Ctrl+C to stop following
```
:::

## 2.6 Searching and Wildcards: find, grep, wildcard

### Wildcards

```bash
ls *.py                    # All .py files
ls data_?.csv              # data_1.csv, data_2.csv, ... (? matches a single character)
ls result_[0-9]*.dat       # result_0.dat, result_123.dat, ...
```

### find — Search for files by criteria

```bash
# Find all .py files in the current directory and subdirectories
find . -name "*.py"

# Find files larger than 100 MB
find . -size +100M

# Find files modified in the last 7 days
find . -mtime -7 -name "*.dat"
```

### grep — Search within file contents

```bash
# Search for a keyword in a file
grep "energy" output.log

# Recursively search all files in a directory
grep -r "convergence" results/

# Show line numbers of matching lines
grep -n "error" simulation.log

# Case-insensitive search
grep -i "warning" output.log
```

:::tip grep is the "Swiss Army knife" of research
Want to know which file defines a certain variable? Need to find error messages in a massive log? `grep` is your best friend.

```bash
# Search for a specific function in all source code files
grep -r "def calculate_energy" *.py
```
:::

## 2.7 What Is the PATH Environment Variable

When you type a command (such as `python`), the Shell needs to know where the `python` program is located on disk. It finds it through the **PATH environment variable**.

```bash
# View PATH
echo $PATH
# Example output:
# /usr/local/bin:/usr/bin:/bin:/home/student/.local/bin
```

PATH is a series of directories separated by `:`. When you type `python`, the Shell searches these directories in order for a program named `python`.

### Check the Actual Location of a Command

```bash
which python
# Output: /usr/bin/python

which gcc
# Output: /usr/local/bin/gcc
```

### Why Is PATH Important?

- A `command not found` error usually means the program is not installed, or it is installed but its path is not in PATH
- After installing new software, you sometimes need to add its path to PATH
- When you have multiple versions of the same program, the order in PATH determines which one is used by default

```bash
# Temporarily add a path to PATH
export PATH="/new/software/bin:$PATH"

# Permanently add (write to config file)
echo 'export PATH="/new/software/bin:$PATH"' >> ~/.bashrc
```

## 2.8 Command Help: man, --help

Encountered an unfamiliar command, or forgot how to use a certain option?

```bash
# View the manual page (man page) for a command
man ls
man grep

# Quickly view help information
ls --help
python --help
```

In a `man` page, the controls are the same as `less` (Space to page down, `q` to quit).

:::info Build the Habit of Checking Documentation
Compared to search engines, `man` and `--help` can often give you accurate answers faster. Check the documentation first, then search online.
:::

## 2.9 Redirection and Pipes in the Terminal

### Redirection

Write the output of a command to a file instead of displaying it on the screen.

```bash
# Write output to a file (overwrites existing content)
ls -l > file_list.txt

# Append output to the end of a file
echo "simulation done" >> log.txt

# Redirect error output to a file
python script.py 2> errors.log

# Redirect both standard output and error output
python script.py > output.log 2>&1
```

### Pipes

Use `|` to send the output of one command as input to another command.

```bash
# View processes containing python
ps aux | grep python

# Count the number of source code files
find . -name "*.py" | wc -l

# View the largest files by space usage
du -sh * | sort -rh | head -10

# Search for specific content in output
cat simulation.log | grep "energy" | tail -5
```

Pipes are one of the most powerful features of the command line — they let you combine simple commands like building blocks to accomplish complex tasks.

### Practical Research Examples

```bash
# Extract final energy values from a large number of output files
grep "Total Energy" output_*.log | sort -t= -k2 -n

# Count lines of code
find . -name "*.py" -exec wc -l {} + | sort -n | tail

# Find all data files containing NaN
grep -l "nan" data_*.csv
```

## 2.10 Common Beginner Mistakes

### Mistake 1: Spaces in paths

```bash
# Wrong
cd My Documents

# Correct
cd "My Documents"
cd My\ Documents
```

:::tip Recommendation
When naming files and directories, **avoid using spaces**. Use underscores `_` or hyphens `-` instead.
```
# Recommended
monte_carlo_simulation/
ising-model/

# Not recommended
monte carlo simulation/
```
:::

### Mistake 2: Confusing files and directories

```bash
# Trying to view file contents, but research is a directory
cat research      # Wrong: cat cannot view directories

# Trying to enter a directory, but data.csv is a file
cd data.csv       # Wrong: cannot cd into a file
```

### Mistake 3: Executing commands in the wrong directory

```bash
# You think you're in the project directory, but you're actually in the home directory
rm -r data/   # This deletes data/ in the home directory, not the project's data/
```

**Build the habit: Always use `pwd` to confirm your current location before executing important operations.**

### Mistake 4: Forgetting to escape special characters

```bash
# Search for lines containing *
grep "E*" file.txt          # Wrong: * has special meaning in regex
grep "E\*" file.txt         # Correct: escape with \
grep -F "E*" file.txt       # Correct: use -F for fixed string matching
```

### Mistake 5: Windows line ending issues

If a script edited on Windows fails on Linux, it may be due to different line endings:

```bash
# Check the line ending format of a file
file script.sh
# If it shows "CRLF", conversion is needed

# Convert to Unix format
dos2unix script.sh
# Or
sed -i 's/\r$//' script.sh
```

## FAQ

**Q: Should I use the command line or the graphical interface?**

A: You can use the graphical interface for everyday use, but you must master the command line for research computing. When connecting to a server remotely, the command line is all you have.

**Q: Do I need to memorize all these commands?**

A: No. The commonly used ones (`cd`, `ls`, `cp`, `mv`, `rm`, `grep`) will stick after a few uses. For less common ones, just look them up with `man` or `--help`.

**Q: PowerShell commands are different from bash — what should I do?**

A: After installing WSL, you can use bash on Windows. Later chapters of this tutorial will guide you through the installation.

## Summary

- The terminal is the window, the Shell is the interpreter, and bash/zsh are the most commonly used Shells
- Core file operation commands: `pwd`, `ls`, `cd`, `mkdir`, `cp`, `mv`, `rm`
- Viewing files: `cat` (small files), `less` (large files), `head`/`tail` (beginning/end)
- Searching: `find` (find files), `grep` (search content), wildcards (pattern matching)
- PATH determines where the Shell looks for commands
- Pipes `|` and redirection `>` are the core mechanisms for combining commands
- Make good use of `man` and `--help` to look up documentation

## Exercises

### Exercise 2.1: Basic File Operations

Complete the following operations in your home directory:

1. Create the directory structure `physics_lab/experiment_01/{raw_data,analysis,plots}`
2. Create three empty files in `raw_data/`: `run_1.dat`, `run_2.dat`, `run_3.dat` (hint: use the `touch` command)
3. Copy `run_1.dat` as `run_1_backup.dat`
4. Move `run_3.dat` to the `analysis/` directory
5. List all files and directories under `physics_lab/` (recursively)
6. Delete the entire `physics_lab/` directory

### Exercise 2.2: grep in Practice

Create a file `energies.log` with the following content:

```
Step 1: Total Energy = -3.456 eV
Step 2: Total Energy = -3.461 eV
Step 3: Total Energy = -3.459 eV
WARNING: convergence not reached
Step 4: Total Energy = -3.462 eV
Step 5: Total Energy = -3.462 eV
INFO: convergence reached
```

Then:

1. Find all lines containing "Energy"
2. Find all lines containing "WARNING" or "ERROR"
3. Count the number of lines containing "Energy"
4. Extract the energy value from the last step

### Exercise 2.3: Pipe Combinations

1. Use a single command to count how many `.py` files are in the current directory and subdirectories
2. List the 5 largest files in the current directory
3. Check how many directories are in your PATH (hint: `echo $PATH | tr ':' '\n' | wc -l`)

### Exercise 2.4: Command Exploration

Use `man` or `--help` to find out:

1. Which option of `ls` sorts by modification time?
2. Which option of `grep` shows only matching filenames without the actual content?
3. How does `find` search for empty directories?
