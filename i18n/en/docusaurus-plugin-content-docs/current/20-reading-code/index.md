---
sidebar_position: 20
sidebar_label: "20. Reading Code"
---

# Chapter 20: How to Read Other People's Code / Reading Code

> You spend 80% of your time reading code and only 20% writing it.

## Chapter Goals

After reading this chapter, you should be able to:

- Understand why reading code is a more important skill than writing code
- Master a systematic code reading workflow
- Know what to focus on in different types of files
- Conduct effective code reviews
- Build your own code reading notes system

## Motivation

In research, you frequently need to:

- Take over project code left by senior lab members
- Reproduce computational results from papers
- Understand the internal implementation of an open-source library
- Participate in collaborative coding within your research group

All these scenarios require you to efficiently **read and understand other people's code**. Yet most courses only teach you how to write code, never how to read it.

---

## 20.1 Why "Being Able to Read Code" Matters More Than "Being Able to Write Code"

In actual research work, the vast majority of code you deal with is not written by you:

| Scenario | Estimated Proportion |
|----------|---------------------|
| Reading and understanding others' code | ~40% |
| Modifying existing code | ~25% |
| Debugging and troubleshooting | ~15% |
| Writing new code from scratch | ~20% |

:::tip Core Insight
**Writing code is expression; reading code is comprehension.** Someone who can't read code usually writes poor code too — because they've never seen what "good code" looks like.
:::

The ability to read code helps you:

- Get up to speed on new projects faster
- Reproduce others' work more accurately
- Learn excellent programming patterns and techniques
- Spot potential issues during code review

---

## 20.2 Start with the README

When you get a project, **the first thing to do is always read the README**.

A good README typically contains:

```markdown
# Project Name

## Introduction
What the project does and what problem it solves

## Installation
How to install dependencies, compile, and run

## Usage Examples
Basic usage and example commands

## Project Structure
Description of directories and files

## License
Open-source license
```

If there's no README, look for these alternatives:

- `INSTALL` or `INSTALL.md` — installation instructions
- `CONTRIBUTING.md` — contribution guide, usually contains project structure information
- `docs/` directory — formal documentation
- GitHub/GitLab Wiki pages

:::caution Projects Without a README
If a project doesn't even have a README, it's either a personal draft or the author doesn't value documentation. Reading difficulty will increase significantly — be mentally prepared.
:::

---

## 20.3 Look at the Directory Structure

Before reading specific code, use `tree` or `ls -R` to see the project's overall structure:

```bash
# View the first two levels of directory structure
tree -L 2

# If tree is not available, use find
find . -maxdepth 2 -type f | head -40
```

### Common Directory Structure Patterns

**Python project:**

```
my_project/
├── src/ or my_project/    # Source code
│   ├── __init__.py
│   ├── main.py
│   └── utils.py
├── tests/                  # Tests
├── docs/                   # Documentation
├── setup.py or pyproject.toml
├── requirements.txt
└── README.md
```

**C/C++ project:**

```
my_project/
├── src/                    # Source files (.c, .cpp)
├── include/                # Header files (.h, .hpp)
├── lib/                    # Third-party libraries
├── build/                  # Build output (usually in .gitignore)
├── tests/
├── Makefile or CMakeLists.txt
└── README.md
```

**Fortran computational physics project:**

```
my_simulation/
├── src/                    # Source files (.f90, .f)
├── mod/                    # Module files
├── input/                  # Input parameter files
├── output/                 # Computation results
├── scripts/                # Post-processing scripts
├── Makefile
└── README
```

---

## 20.4 Find the Entry Point

The entry point is where the program starts executing. Finding it means you've found the "starting point" of the code.

| Language | Common Entry Files | Indicator |
|----------|-------------------|-----------|
| Python | `main.py`, `app.py`, `__main__.py` | `if __name__ == "__main__":` |
| C/C++ | `main.c`, `main.cpp` | `int main(int argc, char* argv[])` |
| Fortran | `main.f90`, `program.f90` | `program xxx` |
| Shell | `run.sh`, `submit.sh` | `#!/bin/bash` |

### Tips for Finding Entry Files

```bash
# Python: search for main function
grep -rn "if __name__" *.py src/

# C/C++: search for main function
grep -rn "int main" src/

# Fortran: search for program statement
grep -rn "^program " src/

# Check targets in Makefile
head -30 Makefile
```

:::info Reading Order
After finding the entry file, read following the program's **execution order**, not alphabetical file order. This way you can understand how data flows.
:::

---

## 20.5 Read Configuration, Dependencies, and Build Method

Different file types tell you different things:

### Dependency Files — What Libraries the Project Uses

| File | Language/Tool | What to Look For |
|------|--------------|-----------------|
| `requirements.txt` | Python (pip) | Dependency list and versions |
| `pyproject.toml` | Python (modern) | Dependencies, build config, project metadata |
| `environment.yml` | Python (conda) | conda environment and dependencies |
| `package.json` | JavaScript/Node | Dependencies and script commands |
| `CMakeLists.txt` | C/C++ (CMake) | Compile options, linked libraries |
| `Makefile` | General | Compile commands, options, linker flags |
| `Cargo.toml` | Rust | Dependencies and build config |

### Configuration Files — How the Project Runs

```bash
# View all configuration files
ls -la *.cfg *.ini *.yaml *.yml *.toml *.json 2>/dev/null

# Check .gitignore — which files are excluded
cat .gitignore
```

### Build Files — How to Compile/Run

```bash
# Makefile: see what targets exist
grep "^[a-zA-Z].*:" Makefile

# CMake: see project name and dependencies
head -30 CMakeLists.txt

# Python: see setup configuration
cat setup.py        # or pyproject.toml
```

---

## 20.6 Trace the Data Flow

The key to understanding code is tracing **how data flows**:

1. **Input**: Where does data come from? (files, command-line arguments, standard input)
2. **Processing**: What transformations does data go through? (function call chain)
3. **Output**: Where are results written? (files, screen, database)

### A Practical Tracing Workflow

```
Command-line arguments → Read config file → Initialize physical system
    → Main loop (time stepping / Monte Carlo sampling)
    → Compute observables → Write output files
```

### Using Editor Tools to Assist Tracing

In VS Code:

- **Ctrl+Click** (or **Cmd+Click**): Jump to function definition
- **Ctrl+Shift+F**: Global search for function or variable names
- **F12**: Go to Definition
- **Shift+F12**: Find All References
- **Ctrl+Shift+O**: View symbol list in the file (functions, classes)

```bash
# Search for function call relationships from the command line
grep -rn "function_name" src/
```

---

## 20.7 Read Tests and Examples

Test code is the best "documentation" for understanding project behavior:

```python
# tests/test_ising.py
def test_magnetization_at_zero_temperature():
    """Magnetization should be ±1 at zero temperature"""
    model = IsingModel(L=10, T=0.01)
    model.run(steps=1000)
    assert abs(model.magnetization()) > 0.99
```

From this test you immediately know:

- There is an `IsingModel` class
- It requires system size `L` and temperature `T` at construction
- It has a `run()` method for simulation
- It has a `magnetization()` method to compute magnetization

:::tip Reading Priority
**Example code > Test code > Documentation > Source code**. Read usage patterns first, then implementation details.
:::

### Common Example Locations

```
examples/           # Example scripts
notebooks/          # Jupyter notebook examples
demo/               # Demo code
tests/              # Tests (also a form of usage example)
docs/tutorials/     # Tutorials
```

---

## 20.8 Basic Principles of Code Review

Whether reviewing others' code or self-reviewing, the following checklist is very useful:

### Code Review Checklist

```markdown
## Functionality
- [ ] Does the code implement the expected functionality?
- [ ] Are edge cases handled? (empty input, extreme parameters)
- [ ] Are physical units consistent? (common bug in computational physics)

## Readability
- [ ] Are variable and function names meaningful?
- [ ] Are necessary comments present? (especially code corresponding to physics formulas)
- [ ] Are functions too long? (consider splitting if over 50 lines)

## Correctness
- [ ] Are array indices correct? (off-by-one errors)
- [ ] Is numerical precision sufficient? (float vs double)
- [ ] Are random seeds controllable? (reproducibility)

## Performance
- [ ] Are there unnecessary repeated computations?
- [ ] Can loops be vectorized?
- [ ] Is memory allocation reasonable?

## Engineering Standards
- [ ] Are there tests?
- [ ] Does it follow the project's coding style?
- [ ] Has documentation been updated?
```

### Mindset During Review

- The goal is to **improve the code**, not to "nitpick"
- Ask questions rather than outright rejecting: "Would using `numpy.dot` be faster here?"
- Distinguish between "must fix" and "suggested improvement"
- Be more encouraging to newcomers, stricter on core logic

---

## 20.9 How to Take Your Own Reading Notes

Taking notes while reading code greatly improves understanding efficiency.

### Recommended Note Template

```markdown
# Project Name

## Basic Information
- Language: Python 3.10
- Purpose: 2D Ising model Monte Carlo simulation
- Repository: https://github.com/xxx/ising-mc

## Directory Structure
src/
├── ising.py        # Core model class
├── mc.py           # Monte Carlo algorithm
├── analysis.py     # Data analysis
└── plot.py         # Plotting script

## Entry Point and Execution Flow
main.py → Read config.yaml → Create IsingModel → Run MC → Output results

## Key Functions
- `IsingModel.__init__()`: Initialize lattice
- `metropolis_step()`: Single Metropolis update
- `measure()`: Measure energy and magnetization

## Things I Don't Understand
- Cluster update algorithm details at mc.py:45
- Bootstrap error estimation implementation in analysis.py

## Potential Improvements
- Not using NumPy vectorization, loops are slow
- No tests written
```

### Recommended Note-Taking Tools

| Tool | Best For |
|------|----------|
| Obsidian | Long-term knowledge management, supports bidirectional links |
| Markdown files | Place in project directory, travels with the project |
| Paper notes | Drawing call graphs, data flow diagrams |
| VS Code comments | Temporary marks, delete after reading |

---

## Complete Code Reading Workflow

Here is the recommended step-by-step reading process:

```
Step 1: Read README and documentation
    │   Understand what the project does and how to use it
    ▼
Step 2: Look at directory structure
    │   Build an overall impression of the project
    ▼
Step 3: Read dependencies and build configuration
    │   Understand the tech stack and how to run it
    ▼
Step 4: Find the entry file
    │   Determine where the program starts executing
    ▼
Step 5: Trace the main flow
    │   Follow the call chain from the entry point
    ▼
Step 6: Read tests and examples
    │   Understand expected behavior and usage patterns
    ▼
Step 7: Dive into key modules
    │   Focus on core algorithms and data structures
    ▼
Step 8: Take notes, record questions
    │   Organize understanding, mark things you don't understand
    ▼
Step 9: Try modifying and running
        Verify your understanding through hands-on work
```

:::tip Golden Rule
**Don't try to understand all the code at once.** First understand the overall structure and main flow, then dive into details as needed. It's like reading a book — look at the table of contents and abstract first, then read the chapters that interest you.
:::

---

## Using AI Agents to Assist Code Reading

AI Agents (such as Claude Code, OpenCode — see Chapter 19) can significantly accelerate the code reading process. An Agent runs directly in your project directory, can read all files, search the codebase, and understand context, making it far more efficient than manually reading file by file.

### Typical Usage

```bash
cd ~/research/some_project
claude

# Have the Agent analyze the project structure
> Analyze the directory structure of this project —
> what does each folder and main file do?

# Understand core algorithms
> Explain the conjugate_gradient function in src/solver.f90 in detail,
> using language a physicist can understand

# Trace data flow
> Starting from main.py, how does input data get processed
> step by step into the final results?

# Find key parameters
> Where are all the physical parameters (temperature, coupling constants, etc.)
> defined in this project? How do I modify them?
```

### Combining Agent with Traditional Reading

An Agent doesn't replace manual reading — it accelerates your understanding:

| Step | Do Manually | Let the Agent Do |
|------|-------------|------------------|
| Read README | Read it yourself | Read it yourself |
| Analyze directory structure | Look through it yourself | Agent gives a quick overview |
| Find entry file | Search file by file | Agent locates it directly |
| Understand core algorithms | Read + look up references | Agent explains + you verify |
| Trace call chains | Use IDE jump features | Agent maps out call relationships |
| Understand build system | Read Makefile/CMakeLists | Agent explains the build process |

:::caution
An Agent's explanations may be incorrect, especially regarding physical meaning. Always verify the Agent's explanations with your physics knowledge. Agents are good at explaining code structure and syntax, but physical judgment is your responsibility.
:::

---

## FAQ

**Q: The codebase is too large. Where do I start?**
A: Start from the entry file and only trace the execution path you care about. Ignore modules that aren't relevant for now.

**Q: The code has no comments. What do I do?**
A: Infer intent from function and variable names, understand behavior from tests, and if necessary, run the code with added print statements for debugging.

**Q: I can't understand the implementation of an algorithm?**
A: First read the theoretical description of the algorithm (papers, textbooks). Understanding the principles first makes reading the code implementation much easier.

**Q: How much time should I spend reading code?**
A: For a medium-scale project (a few thousand lines), spending 2-4 hours to understand the main structure is reasonable. You don't need to aim for 100% understanding.

---

## Summary

- **Reading code is a skill that requires deliberate practice** — it doesn't automatically improve with programming experience
- Follow a systematic reading workflow: README -> Directory structure -> Config files -> Entry file -> Main flow -> Tests
- Use your editor's jump and search features to improve efficiency
- **Taking notes** is key to improving understanding and retention
- Code review is both practice in reading code and an important part of team collaboration

---

## Exercises

1. Pick a Python library you use frequently (e.g., `numpy` or `matplotlib`), browse its directory structure on GitHub, and find the entry file
2. Find a project from a senior lab member, read through it using this chapter's workflow, and write reading notes
3. Read a small open-source computational physics project (e.g., an Ising model implementation on GitHub) and complete the code review checklist
4. Add a README to one of your own projects, ensuring others can understand your project through the README
5. Practice using VS Code's "Go to Definition" and "Find All References" features to trace call relationships in a piece of code
