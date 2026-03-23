---
sidebar_position: 0
sidebar_label: "0. Preface"
---

# Chapter 0: Preface

> Before you start "doing research," learn how to "do research with a computer."

## Chapter Goals

After reading this chapter, you should be able to:

- Understand why theoretical/computational physics students need systematic training in computing environments
- Know the intended audience and scope of this guide
- Choose a reading path based on your operating system
- Create a learning plan that fits your situation

## 0.1 Who Is This Guide For?

This guide is written for:

- **Upper-level physics undergraduates**: About to join a research group and need to do numerical computation, data analysis, or theory-assisted derivations on a computer
- **First-year graduate students**: Just starting in computational physics, condensed matter, high-energy, or astrophysics, and discovering that "knowing a bit of Python" is far from enough
- **Self-learners**: Interested in theoretical/computational physics and want to build a complete research computing workflow
- **Senior grad students who need to catch up**: Have been "getting by," and want to systematically organize their computing environment

:::info You don't need to be a "computer expert"
This guide assumes you can turn on a computer, browse the web, and install software — that's all. Every concept will be introduced from scratch.
:::

### A Typical Dilemma

You may have encountered situations like these:

1. Your advisor says "run a Monte Carlo simulation in Fortran," but you don't even know how to install a Fortran compiler
2. A senior student gives you a Python script, it throws `ModuleNotFoundError`, and you have no idea how to fix it
3. You want to transfer code to a supercomputer, but you don't know how to use SSH
4. You need to modify a figure in a paper, but you've forgotten which version of the code you used
5. You got a new computer, and it took two days to set up your environment again

The root of these problems isn't that you're "not smart enough" — it's that **nobody systematically taught you how to build and manage a research computing environment**.

## 0.2 What You'll Be Able to Do After This Guide

After completing this guide, you will have the following capabilities:

| Capability | Concrete Skills |
|------------|----------------|
| Command-line operation | Fluently use the terminal for everyday file management and running programs |
| Environment management | Independently install and configure Python, C/C++, Fortran, and other language environments |
| Version control | Use Git to manage code, use GitHub for collaboration |
| Remote computing | Connect to servers and supercomputers via SSH, submit jobs |
| Documentation | Write notes and papers with Markdown and LaTeX |
| Project organization | Organize research project directory structures properly |
| Data processing | Use NumPy, SciPy, Matplotlib, and other scientific computing tools |
| Parallel computing | Understand the basic usage of OpenMP and MPI |

## 0.3 Three Platforms: macOS / Ubuntu / Windows

This guide covers all three major operating systems:

### macOS

- Very popular in the physics community
- Comes with a Unix-like environment; terminal and shell work out of the box
- Installing tools via Homebrew is very convenient

### Ubuntu (Linux)

- The standard system for supercomputers and servers
- Best support for scientific computing software
- Also perfectly usable as a desktop OS, especially for heavy local computation

### Windows

- The most common desktop OS
- Used to be inconvenient for research computing, but **WSL (Windows Subsystem for Linux)** has greatly improved the situation
- This guide will walk you through installing and configuring WSL to give you a near-native Linux experience on Windows

:::tip Platform recommendation
If you're just starting out, don't agonize over which platform to use. This guide will note differences between the three platforms at every key step. Just use the computer you have.
:::

## 0.4 How to Use This Guide

### Reading Strategies

- **Read sequentially**: If you're a complete beginner, read from Chapter 0 through Chapter 8 to build fundamentals
- **Jump around as needed**: If you already have some background, skip directly to chapters you need
- **Use it as a reference**: After your environment is set up, come back when you run into problems

### Hands-On Practice

Every chapter has **verification tests** and **exercises**. Be sure to actually do them — don't just read.

```
Learning programming is like learning to swim — reading tutorials won't do it.
```

### Notation

This guide uses the following markers to distinguish platform-specific content:

- 🍎 macOS only
- 🐧 Ubuntu / Linux only
- 🪟 Windows only
- Content without a marker applies to all platforms

## 0.5 Minimal Roadmap: What to Read First

If your time is limited, here is the **minimum viable path**:

```
Chapter 0  Preface (you are here)
  ↓
Chapter 1  Computer Basics (quick read)
  ↓
Chapter 2  Terminal and Command Line ⭐ Core
  ↓
Chapter 3  Platform Environment Setup ⭐ Core
  ↓
Chapter 7  Git Version Control ⭐ Core
  ↓
Chapter 12 Python Environment Management ⭐ Core
  ↓
Chapter 13 Scientific Python
```

After this, you'll have the basic skills needed to start computational physics research.

The remaining chapters can be learned when needed. For example:

- Need to use a server? → Chapter 6 SSH + Chapter 8 Remote Tools
- Need to write a paper? → Chapter 9 Markdown and LaTeX
- Need to run parallel programs? → Chapter 16 OpenMP and MPI

## 0.6 Common Misconceptions

### Misconception 1: "I'll master Python first, then learn everything else"

Python itself is only one part of the toolchain. If you can't manage virtual environments, use the command line, or use Git, you won't be able to do research efficiently no matter how well you know Python syntax. **Breadth of toolchain matters more than depth in a single language.**

### Misconception 2: "I'll just use Jupyter Notebook"

Jupyter Notebook is a great interactive tool, but it can't replace:
- Version control (`.ipynb` diffs are nearly unreadable)
- Reproducible batch computation
- Submitting long-running jobs on a server
- Modular code organization

### Misconception 3: "Setting up environments is too much hassle — if it runs, it's fine"

"Good enough" environments tend to break at moments like:
- Getting a new computer
- Needing to reproduce results on a server
- Coming back to the code six months later
- Collaborating with others

Investing time in building a proper workflow saves enormous amounts of time in the long run.

### Misconception 4: "Linux is too hard; I'll just stick with Windows"

Modern Windows with WSL provides a very good Linux experience. You don't need to "abandon Windows," but you do need to learn to work in a Unix-like environment, because nearly all servers and supercomputers run Linux.

### Misconception 5: "AI can handle everything for me"

AI coding assistants (like GitHub Copilot, ChatGPT) are genuinely useful, but if you don't understand basic concepts, you won't be able to:
- Judge whether AI-generated code is correct
- Debug environment problems that AI can't solve
- Understand the advice AI gives you

**Foundational knowledge makes you an effective user of AI — not a passenger.**

## Research Workflow Overview

A typical computational physics research workflow involves:

```
 ┌─────────────────────────────────────────────────────────┐
 │              Research Workflow Overview                  │
 ├─────────────────────────────────────────────────────────┤
 │                                                         │
 │  1. Literature & Notes    ──→  Zotero + Markdown/Obsidian│
 │         ↓                                               │
 │  2. Theory & Derivation   ──→  Pen + Markdown + LaTeX   │
 │         ↓                                               │
 │  3. Write Code            ──→  Editor + Python/C++/Fortran│
 │         ↓                                               │
 │  4. Version Control       ──→  Git + GitHub             │
 │         ↓                                               │
 │  5. Local Testing         ──→  Terminal + Debugger       │
 │         ↓                                               │
 │  6. Submit to Server      ──→  SSH + SLURM              │
 │         ↓                                               │
 │  7. Data Analysis & Plots ──→  NumPy + Matplotlib       │
 │         ↓                                               │
 │  8. Write Paper           ──→  LaTeX + BibTeX           │
 │         ↓                                               │
 │  9. Backup & Archive      ──→  Git + Cloud Storage      │
 │                                                         │
 └─────────────────────────────────────────────────────────┘
```

This guide covers every technical step in the above workflow **except the physics itself**. It won't teach you quantum mechanics or statistical mechanics, but it will ensure that the technical side never becomes a bottleneck in your research.

## From "Knowing a Bit of Python" to "Independent Research"

Many physics students' computing skills stall at "knowing a bit of Python":

- Can write a few lines in Jupyter Notebook to make a plot
- Knows `numpy` and `matplotlib`
- Copies a senior student's code, tweaks parameters, and it runs

But independent research requires:

- Compiling and running others' C++ / Fortran programs on a server
- Managing Python environments for multiple projects without interference
- Using Git to track code changes and roll back to any historical version
- Writing Makefiles to automate build processes
- Using shell scripts to submit batch computation jobs
- Organizing data, code, and papers in a disciplined way

**The gap between these two levels is exactly what this guide aims to close.**

## Summary

- This guide is for physics students who need to systematically learn their computing environment
- Covers macOS, Ubuntu, and Windows
- Starts from zero and progressively builds a complete research computing workflow
- Recommended: complete the core chapters along the minimal roadmap first, then expand as needed
- Hands-on practice is the most important way to learn

## Next Step

Ready? Let's start with Chapter 1 and learn about the basic structure of a computer.

[Go to Chapter 1 →](../01-computer-basics/index.md)
