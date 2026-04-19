---
sidebar_position: 25
sidebar_label: "25. Appendix"
---

# Chapter 25: Appendix

> Quick reference, cross-platform comparison, and resources — one page to rule them all.

## Chapter Goals

This chapter is a reference appendix for the entire book, providing:

- Common terminal command quick reference
- macOS / Ubuntu / Windows three-platform command comparison
- Common errors and troubleshooting approaches
- Recommended learning resources

---

## 25.1 Common Terminal Commands Quick Reference

### File and Directory Operations

| Command | Function | Example |
|---------|----------|---------|
| `ls` | List files | `ls -la` |
| `cd` | Change directory | `cd ~/research` |
| `pwd` | Show current directory | `pwd` |
| `mkdir` | Create directory | `mkdir -p src/utils` |
| `rm` | Delete file | `rm file.txt` |
| `rm -r` | Delete directory | `rm -r old_dir/` |
| `cp` | Copy | `cp file.txt backup/` |
| `cp -r` | Copy directory | `cp -r src/ src_backup/` |
| `mv` | Move/rename | `mv old.py new.py` |
| `touch` | Create empty file | `touch README.md` |
| `cat` | View file contents | `cat config.yaml` |
| `less` | Paginated viewing | `less long_output.log` |
| `head` | View first N lines | `head -20 data.csv` |
| `tail` | View last N lines | `tail -f simulation.log` |
| `wc` | Count lines/words/characters | `wc -l data.csv` |
| `find` | Find files | `find . -name "*.py"` |
| `tree` | Directory tree | `tree -L 2` |

### Text Processing

| Command | Function | Example |
|---------|----------|---------|
| `grep` | Search text | `grep "error" log.txt` |
| `grep -r` | Recursive search | `grep -rn "def main" src/` |
| `sed` | Text replacement | `sed -i 's/old/new/g' file.txt` |
| `awk` | Column processing | `awk '{print $1, $3}' data.txt` |
| `sort` | Sort | `sort -n -k2 data.txt` |
| `uniq` | Deduplicate | `sort data.txt \| uniq -c` |
| `cut` | Extract columns | `cut -d',' -f1,3 data.csv` |
| `diff` | Compare files | `diff file1.txt file2.txt` |

### System and Processes

| Command | Function | Example |
|---------|----------|---------|
| `top` / `htop` | View processes | `htop` |
| `ps` | List processes | `ps aux \| grep python` |
| `kill` | Terminate process | `kill -9 12345` |
| `df` | Disk usage | `df -h` |
| `du` | Directory size | `du -sh data/` |
| `free` | Memory usage | `free -h` (Linux) |
| `which` | Command location | `which python3` |
| `chmod` | Change permissions | `chmod +x run.sh` |
| `chown` | Change ownership | `chown user:group file` |

### Network

| Command | Function | Example |
|---------|----------|---------|
| `ssh` | Remote login | `ssh user@server.edu` |
| `scp` | Remote copy | `scp file.txt user@server:~/` |
| `rsync` | Incremental sync | `rsync -avh src/ dest/` |
| `wget` | Download file | `wget https://example.com/data.tar.gz` |
| `curl` | HTTP request | `curl -O https://example.com/file` |
| `ping` | Test connectivity | `ping google.com` |

### Git

| Command | Function | Example |
|---------|----------|---------|
| `git init` | Initialize repository | `git init` |
| `git clone` | Clone repository | `git clone https://github.com/user/repo.git` |
| `git status` | View status | `git status` |
| `git add` | Stage files | `git add src/model.py` |
| `git commit` | Commit | `git commit -m "Add model"` |
| `git push` | Push | `git push origin main` |
| `git pull` | Pull | `git pull origin main` |
| `git log` | View history | `git log --oneline -10` |
| `git diff` | View differences | `git diff HEAD~1` |
| `git branch` | Branch operations | `git branch feature-x` |
| `git checkout` | Switch branch | `git checkout feature-x` |
| `git merge` | Merge branch | `git merge feature-x` |
| `git stash` | Stash changes | `git stash` / `git stash pop` |

---

## 25.2 macOS / Ubuntu / Windows Comparison

### Package Managers

| Operation | macOS (Homebrew) | Ubuntu (apt) | Windows (winget) |
|-----------|-----------------|--------------|------------------|
| Install package | `brew install X` | `sudo apt install X` | `winget install X` |
| Search package | `brew search X` | `apt search X` | `winget search X` |
| Upgrade package | `brew upgrade X` | `sudo apt upgrade X` | `winget upgrade X` |
| Uninstall package | `brew uninstall X` | `sudo apt remove X` | `winget uninstall X` |
| Update index | `brew update` | `sudo apt update` | (automatic) |
| List installed | `brew list` | `apt list --installed` | `winget list` |

### System Operations

| Operation | macOS | Ubuntu | Windows |
|-----------|-------|--------|---------|
| Open terminal | Terminal / iTerm2 | Ctrl+Alt+T | Windows Terminal |
| File manager | Finder | Nautilus | Explorer |
| Shell | zsh (default) | bash (default) | PowerShell / bash (WSL) |
| Admin privileges | `sudo` | `sudo` | Run as admin / `sudo` in WSL |
| View PATH | `echo $PATH` | `echo $PATH` | `echo $PATH` (bash) / `$env:PATH` (PS) |
| Env variable config | `~/.zshrc` | `~/.bashrc` | `~/.bashrc` (WSL) |

### Python-Related

| Operation | macOS | Ubuntu | Windows |
|-----------|-------|--------|---------|
| Install Python | `brew install python` | `sudo apt install python3` | `winget install Python.Python.3.12` |
| Invoke Python | `python3` | `python3` | `python` or `python3` |
| Create virtual env | `python3 -m venv .venv` | `python3 -m venv .venv` | `python -m venv .venv` |
| Activate virtual env | `source .venv/bin/activate` | `source .venv/bin/activate` | `.venv\Scripts\activate` (PS) or `source .venv/bin/activate` (WSL) |
| pip install | `pip install X` | `pip install X` | `pip install X` |

### Compilation-Related

| Operation | macOS | Ubuntu | Windows (WSL) |
|-----------|-------|--------|---------------|
| C compiler | `gcc` (actually clang) or `brew install gcc` | `sudo apt install gcc` | `sudo apt install gcc` |
| C++ compiler | `g++` or `clang++` | `g++` | `g++` |
| Fortran | `brew install gfortran` | `sudo apt install gfortran` | `sudo apt install gfortran` |
| Make | Built-in | `sudo apt install make` | `sudo apt install make` |
| CMake | `brew install cmake` | `sudo apt install cmake` | `sudo apt install cmake` |

---

## 25.3 Common Errors and Troubleshooting

### Python-Related

| Error | Cause | Solution |
|-------|-------|---------|
| `ModuleNotFoundError: No module named 'numpy'` | Not installed or not in current environment | `pip install numpy`, check virtual environment |
| `command not found: python` | Python not installed or not in PATH | Install Python, check PATH |
| `PermissionError: [Errno 13]` | No file permissions | Check file permissions, don't use `sudo pip install` |
| `SyntaxError: invalid syntax` | Wrong Python version or syntax error | Check `python3 --version` |
| `externally-managed-environment` | Ubuntu 23.04+ PEP 668 protection | Use a virtual environment |
| `RecursionError: maximum recursion depth exceeded` | Infinite recursion | Check recursion termination condition |

### Git-Related

| Error | Cause | Solution |
|-------|-------|---------|
| `fatal: not a git repository` | Not in a Git repository | `cd` to the repo directory or `git init` |
| `error: failed to push some refs` | Remote has updates | `git pull` first, then `git push` |
| `CONFLICT (content): Merge conflict` | Merge conflict | Manually edit conflicting files, `git add` + `git commit` |
| `Permission denied (publickey)` | SSH key not configured | Configure SSH key, add to GitHub |
| `fatal: remote origin already exists` | Remote already exists | `git remote set-url origin <new-url>` |

### Compilation-Related

| Error | Cause | Solution |
|-------|-------|---------|
| `gcc: command not found` | Compiler not installed | Install gcc (see Section 25.2) |
| `undefined reference to 'xxx'` | Symbol not found during linking | Check library linking `-lxxx`, check function declaration |
| `fatal error: xxx.h: No such file` | Missing header file | Install the corresponding `-dev` package |
| `error: 'for' loop initial declarations` | C standard too old | Add `-std=c99` or `-std=c11` |
| `Segmentation fault (core dumped)` | Memory access out of bounds | Debug with `gdb`, check array indices |

### SSH-Related

| Error | Cause | Solution |
|-------|-------|---------|
| `Connection refused` | Server SSH not running or wrong port | Confirm server address and port |
| `Connection timed out` | Network unreachable | Check network, check firewall |
| `Host key verification failed` | Server fingerprint changed | Delete the corresponding entry in `~/.ssh/known_hosts` |
| `Permission denied (publickey)` | SSH key mismatch | Check key configuration in `~/.ssh/` |

### General Troubleshooting Approach

```
1. Read the error message carefully (start from the last line)
2. Copy the error message into a search engine
3. Check: Is the version correct? Is the path correct? Are permissions sufficient?
4. Simplify the problem: reproduce the error with a minimal example
5. Check documentation: official docs > Stack Overflow > blog posts
6. Ask AI: give the full error message to ChatGPT/Claude
```

---

## 25.4 Recommended Courses and Websites

### Online Courses

| Course | Platform | Content |
|--------|----------|---------|
| MIT Missing Semester | MIT OCW | Terminal, Git, editors, and other tools |
| Software Carpentry | Official site | Shell, Git, Python for researchers |
| CS 61A (Berkeley) | Official site | Python programming fundamentals |
| Computational Physics (various universities) | Coursera/edX | Numerical methods and programming |

### Useful Websites

| Website | Purpose |
|---------|---------|
| [Stack Overflow](https://stackoverflow.com) | Programming Q&A |
| [GitHub](https://github.com) | Code hosting and open-source projects |
| [arXiv](https://arxiv.org) | Physics preprints |
| [Overleaf](https://www.overleaf.com) | Online LaTeX editing |
| [NumPy Documentation](https://numpy.org/doc/) | NumPy reference |
| [Matplotlib Gallery](https://matplotlib.org/gallery/) | Plotting examples |
| [Learn X in Y Minutes](https://learnxinyminutes.com) | Quick language learning |
| [explainshell.com](https://explainshell.com) | Explain shell commands |
| [regex101.com](https://regex101.com) | Regular expression testing |

---

## FAQ

**Q: Should I memorize all these commands?**
A: No need to memorize everything. The 20-30 commonly used commands will be remembered naturally through use. For the rest, just look them up. What matters is **knowing what's possible** — you can always look up the exact syntax.

**Q: Is `sed` on macOS different from Linux?**
A: Yes, macOS uses BSD sed while Linux uses GNU sed. The main difference is the `-i` parameter: macOS requires `sed -i '' 's/...'`, Linux uses `sed -i 's/...'` directly. Install GNU sed: `brew install gnu-sed`.

**Q: Should I use Bash or Zsh?**
A: macOS defaults to Zsh, Linux defaults to Bash. Their syntax is 95% identical. It's recommended to use your system's default — no need to switch intentionally.

---

## Summary

This chapter provides quick reference for daily use:

- **Command quick reference**: File operations, text processing, system management, network, Git
- **Three-platform comparison**: Package management, Python, and compilation tool differences across platforms
- **Error quick reference**: Common errors and solutions for Python, Git, compilation, and SSH
- **Learning resources**: Recommended courses and websites

Consider bookmarking this chapter for quick reference when you encounter problems.
