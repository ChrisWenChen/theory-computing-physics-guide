---
sidebar_position: 24
sidebar_label: "24. Sync & Backup"
---

# Chapter 24: Sync, Backup, and Data Management

> If you lose the data, the experiment was done for nothing.

## Chapter Goals

After reading this chapter, you should be able to:

- Recognize the real risk of data loss and develop preventive awareness
- Distinguish between the concepts of "sync" and "backup"
- Reasonably choose and use cloud sync tools
- Establish categorized management strategies for code, data, notes, and papers
- Understand and practice the 3-2-1 backup principle
- Avoid common sync and backup mistakes

## Motivation

The following scenarios are all too common in research:

- Laptop water damage/loss, months of code and data gone
- Hard drive suddenly fails, thesis left at a version from one week ago
- Accidentally deleted a critical data file, recycle bin also emptied
- Synced virtual environments and `node_modules` to cloud storage, filling up all the space
- File version conflicts between two computers, unsure which is the latest

**All these problems can be avoided with a proper sync and backup strategy.**

---

## 24.1 Why "Data Loss" Is a Real Risk

### Common Causes of Data Loss

| Cause | Probability | Impact |
|-------|-------------|--------|
| Hard drive failure | Medium | All local data lost |
| Accidental deletion | High | Specific files lost |
| Computer lost/damaged | Low | All local data lost |
| Ransomware/virus | Low-Medium | Data encrypted or destroyed |
| Sync conflict overwrite | Medium | File overwritten by wrong version |
| System crash | Medium | Unsaved work lost |

:::caution Real Cases
- A graduate student's hard drive failed before graduation, three years of computation data completely lost, graduation delayed by half a year
- A postdoc accidentally deleted a directory containing all simulation results, with no backup
- A lab group's server was hit by ransomware, three students' data affected
:::

---

## 24.2 The Role of Dropbox / OneDrive / Nutstore

### Comparison of Major Cloud Sync Tools

| Feature | Dropbox | OneDrive | Nutstore | Google Drive |
|---------|---------|----------|----------|-------------|
| Free space | 2 GB | 5 GB | 1 GB/month upload | 15 GB |
| Paid plan | Expensive | 1 TB with Microsoft 365 | Affordable | Google One |
| Speed in mainland China | Slow/Requires VPN | Moderate | Fast | Slow/Requires VPN |
| Selective sync | Supported | Supported | Supported | Supported |
| Version history | 30 days/180 days | 30 days | Supported | 30 days |
| WebDAV | Not supported | Not supported | Supported | Not supported |
| Linux client | Official support | Unofficial | Official support | Unofficial |

### Selection Recommendations

- **Users in mainland China**: Nutstore (fast speed, good WebDAV support, works well with Zotero)
- **Have Microsoft 365**: OneDrive (1 TB large storage)
- **International collaboration**: Dropbox or Google Drive
- **Multi-platform sync**: Nutstore or Dropbox (good Linux support)

:::info Sync is not Backup
The primary purpose of cloud sync is **multi-device access**. If you accidentally delete a file on one device, the sync tool will propagate the deletion to all devices. Therefore, sync **cannot replace backup**.
:::

---

## 24.3 What to Sync and What Not to Sync

### Suitable for Syncing

| Type | Reason | Tool |
|------|--------|------|
| Paper drafts (LaTeX/Word) | Need multi-device editing | Nutstore / OneDrive |
| Research notes | Access and edit anytime | Nutstore / Obsidian Sync |
| Config files (dotfiles) | Keep multiple machines consistent | Git + GitHub |
| Small scripts | Convenient to use on different machines | Git |
| Literature PDFs (via Zotero) | Multi-device reading | Zotero + WebDAV |
| Slides | For meetings/presentations | Nutstore / OneDrive |

### Not Suitable for Syncing

| Type | Reason | Correct Approach |
|------|--------|-----------------|
| Virtual environments (`.venv/`, `venv/`) | Large, platform-incompatible | `requirements.txt` + rebuild |
| `node_modules/` | Extremely large | `package.json` + `npm install` |
| Build artifacts (`build/`, `*.o`) | Can be regenerated | Makefile + recompile |
| Large datasets (> 1 GB) | Takes up space, slow to sync | Dedicated storage or Git LFS |
| `.git/` directory | Will conflict with Git | Use Git for code, don't sync .git |
| Temporary files, cache | No value | Ignore |

:::caution Serious Warning
**Never use cloud sync tools to sync a Git repository's `.git/` directory.** This will corrupt the repository. Manage code with Git, don't put it in a sync folder — or exclude the `.git/` directory in your sync tool.
:::

---

## 24.4 Management Recommendations for Code, Data, Notes, and Papers

### Code Management

```
Management method: Git + GitHub/GitLab
Backup method: Push to remote repository
Notes:
  - Don't commit sensitive information (keys, passwords)
  - Don't commit large binary files
  - Use .gitignore to exclude unnecessary files
```

### Data Management

```
Small data (< 100 MB): Include in Git repository with code
Medium data (100 MB - 10 GB): Git LFS or shared storage
Large data (> 10 GB): Dedicated storage (server, NAS)
Notes:
  - Record data source and generation method
  - Raw data is read-only — don't modify it
  - Processed data can be regenerated
```

### Notes Management

```
Management method: Obsidian / Markdown files
Sync method: Nutstore / Obsidian Sync / Git
Backup method: Cloud sync + local backup
Notes:
  - Use Markdown format, avoid proprietary formats
  - Regularly organize and archive
```

### Paper Management

```
Management method: LaTeX + Git
Sync method: Overleaf (online) or Git + cloud sync
Backup method: Git + Overleaf + local backup
Notes:
  - Commit after each important revision
  - Save PDFs of all versions
  - Manage references with Zotero + Better BibTeX
```

---

## 24.5 Local Backup, Cloud Backup, and Version Control

### Comparison of Three Protection Methods

| Method | Protects Against | Doesn't Protect Against | Tools |
|--------|-----------------|------------------------|-------|
| Version control (Git) | Every code change | Large data files | Git, GitHub |
| Cloud sync | Multi-device access | Accidental deletion (syncs deletion) | Nutstore, OneDrive |
| Local backup | Complete data copy | Catastrophic events (fire, etc.) | Time Machine, rsync |
| Cloud backup | Off-site data copy | Nothing | Backblaze, Alibaba Cloud OSS |

### Local Backup Tools

**macOS: Time Machine**

```bash
# After connecting an external drive, the system will prompt whether to use it for Time Machine
# Or configure manually:
# System Settings → General → Time Machine → Add Backup Disk
```

**Linux: rsync**

```bash
# Backup to external drive
rsync -avh --progress ~/research/ /mnt/backup/research/

# Incremental backup (only copy changed files)
rsync -avh --delete ~/research/ /mnt/backup/research/

# Scheduled automatic backup (add to crontab)
crontab -e
# Backup every day at 2 AM
# 0 2 * * * rsync -avh --delete ~/research/ /mnt/backup/research/
```

**Windows: File History**

```
Settings → Update & Security → Backup → Back up using File History
```

---

## 24.6 A Recommended Directory Structure

### Root Directory for Research Work

```
~/research/                    # or D:\research\ (Windows)
│
├── projects/                  # Research projects (Git managed)
│   ├── ising-model/           # Project 1
│   ├── topological-insulator/ # Project 2
│   └── md-simulation/         # Project 3
│
├── papers/                    # Paper writing (Git managed)
│   ├── paper-2025-ising/
│   └── thesis/
│
├── notes/                     # Research notes (cloud synced)
│   ├── courses/
│   ├── seminars/
│   └── reading-notes/
│
├── literature/                # Literature (Zotero managed)
│   └── zotero-storage/        # Zotero attachment directory
│
├── presentations/             # Talks and slides (cloud synced)
│   ├── group-meeting/
│   └── conferences/
│
├── data/                      # Shared data (dedicated storage for large data)
│   ├── raw/                   # Raw data (read-only)
│   └── processed/             # Processed data
│
└── tools/                     # Personal tools and scripts
    ├── dotfiles/              # Config files (Git managed)
    └── scripts/               # Common scripts
```

### Directory Management Principles

| Principle | Description |
|-----------|-------------|
| Separate directories by type | Code, papers, notes, and data in different places |
| Each project is independent | One directory per project with complete information |
| Use appropriate tools | Code with Git, notes with cloud sync, literature with Zotero |
| Consistent naming conventions | Use lowercase and hyphens, no spaces |
| Regular cleanup and archival | Move completed projects to `archive/` |

:::tip Don't Put Everything on the Desktop
`Desktop/` and `Downloads/` are only temporary staging areas. Downloaded files should be filed into the correct directory within 24 hours.
:::

---

## 24.7 Common Mistakes: Syncing Virtual Environments and Large Datasets

### Mistake 1: Syncing Virtual Environments

```bash
# Wrong: putting .venv in a sync directory
~/Dropbox/project/.venv/     # Hundreds of MB, cross-platform incompatible

# Correct: only sync requirements.txt
~/Dropbox/project/requirements.txt    # A few KB

# Rebuild environment on new machine
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Mistake 2: Syncing node_modules

```bash
# node_modules can have tens of thousands of small files, hundreds of MB
~/OneDrive/web-project/node_modules/   # Wrong

# Correct approach
~/OneDrive/web-project/package.json    # Right
npm install   # Reinstall
```

### Mistake 3: Syncing .git Directory

```bash
# .git directory contains many small files, conflicts with sync tools
~/Dropbox/my-repo/.git/    # May corrupt repository

# Correct approach: manage code with Git, don't put in sync directory
~/projects/my-repo/         # Git managed
~/Dropbox/notes/           # Cloud sync managed
```

### Mistake 4: Syncing Large Data Files

```bash
# Multi-GB HDF5 files should not be in a sync directory
~/OneDrive/project/data/huge_dataset.hdf5   # Wrong

# Correct approach
# Put large data in local or server dedicated storage
# Only sync data metadata and processing scripts
~/OneDrive/project/data/README.md           # Data description
~/OneDrive/project/scripts/process_data.py  # Processing script
```

### Cloud Sync Exclusion Rules

Most sync tools support excluding specific folders:

```bash
# Nutstore: add exclusion rules in client settings
# Exclude the following patterns:
.venv/
venv/
node_modules/
__pycache__/
build/
.git/
*.pyc
*.o
```

---

## 24.8 The 3-2-1 Backup Principle

### What Is 3-2-1 Backup

```
3 — Keep at least 3 copies of data
2 — Store on 2 different types of media
1 — Keep 1 copy off-site
```

### Practical Application Example

```
Copy 1: Local computer (working copy)
    │   Media: SSD/HDD
    │
Copy 2: External drive or NAS
    │   Media: External HDD
    │   Method: Weekly rsync / Time Machine
    │
Copy 3: Cloud
        Media: Cloud storage
        Method: Git push / Cloud sync / Cloud backup
```

### 3-2-1 in Practice for Research Data

| Data Type | Copy 1 | Copy 2 | Copy 3 |
|-----------|--------|--------|--------|
| Code | Local computer | GitHub | Clone on server |
| Papers | Local computer | Overleaf/Git | Cloud sync |
| Notes | Local computer | Cloud sync | Git repository |
| Computation data | Local computer | Server | External drive |
| Literature PDFs | Local computer | Zotero cloud | Nutstore WebDAV |

:::tip Minimum Cost Solution
- Code: Git + GitHub (free)
- Notes and papers: Nutstore free tier
- Local backup: Buy a 1 TB external drive (about $40)
- Total cost around $40, protecting all important data
:::

### Backup Verification

:::caution Unverified Backups Are Not Backups
Regularly check that your backups are actually usable:

1. Restore a file from backup monthly to confirm content is correct
2. Check that the external drive is working properly
3. Confirm cloud sync is up to date
4. Test cloning and running code from a Git repository on a new device
:::

---

## FAQ

**Q: Is using only Git enough?**
A: Git only manages code (text files). It's not suitable for managing large data, paper PDFs, notes, etc. You need a combination of Git + cloud sync + local backup.

**Q: Is the Nutstore free tier sufficient?**
A: For notes and small file sync, the free tier is generally sufficient (1 GB/month upload, 3 GB/month download). If you need to sync many PDFs, consider upgrading or using OneDrive.

**Q: Is a NAS worth buying?**
A: If you have large amounts of computation data (tens of GB or more), a NAS is a good investment. Otherwise, an external drive is sufficient.

**Q: How do I handle server data backup?**
A: Most research institutions' servers have their own backup policies. But don't rely on them entirely — always keep a local copy of important results.

---

## Summary

- **Data loss is a real risk** — don't rely on luck
- **Sync is not the same as backup** — sync solves multi-device access, backup solves data safety
- Different types of data use different management tools: code with Git, notes with cloud sync, literature with Zotero
- **Don't sync** virtual environments, node_modules, .git directories, or large data files
- Follow the **3-2-1 backup principle**: 3 copies, 2 types of media, 1 off-site
- Regularly verify that backups are usable

---

## Exercises

1. Review your current file organization, restructure following this chapter's recommended layout
2. Check your cloud sync directories and exclude files that shouldn't be synced (virtual environments, caches, etc.)
3. Set up a local backup solution (Time Machine / rsync / File History)
4. Confirm all your code repositories have remote backups (`git remote -v`)
5. List your "cannot lose" data items and check whether each one satisfies the 3-2-1 principle
6. Restore a file from backup to verify that the backup is actually working
