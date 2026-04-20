---
sidebar_position: 19
sidebar_label: "19. Agent-Assisted Research"
---

# Chapter 19: Agent-Assisted Research: Claude Code and OpenCode

> AI is your research assistant, not your replacement. Understanding your work is always your responsibility.

## Chapter Goals

After reading this chapter, you should be able to:

- Understand the critical difference between an **agent** and a **chatbox**
- Install and configure Claude Code (via subscription or API key)
- Understand the positioning and basic usage of OpenCode
- Use AI agents for research tasks far beyond programming: derivations, literature review, LaTeX, data processing
- Identify the applicable boundaries and limitations of agent-assisted research
- Be aware of security and cost considerations

## Motivation

As a graduate student in theoretical or computational physics, you regularly face situations like:

- Needing to verify a lengthy derivation of a Green's function or a partition function
- Inheriting thousands of lines of Fortran code from a former lab member that you cannot understand
- Wanting to quickly survey what methods people use for a particular problem in the literature
- Having to convert data formats, generate plots, or batch-process simulation outputs
- Struggling with LaTeX compilation errors, BibTeX formatting, or table layout
- Needing to port MATLAB code to Python, or add unit tests to existing code

An AI **agent** can help with all of these -- and it can do so far more efficiently than a chatbox. But the premise is: **you must be able to understand and evaluate the results the agent provides**.

## 19.1 Agent vs. Chatbox: A Fundamental Distinction

The most important concept in this chapter is the difference between an **agent** and a **chatbox**.

### What is a chatbox?

A chatbox (like the ChatGPT web interface or the Claude web interface) is a text-in, text-out conversation window. You type a question, it gives an answer. If you want it to work on your code, you must:

1. Manually copy your code and paste it into the chat
2. Read the response and manually copy the suggested changes back
3. Run the code yourself and paste error messages back if something goes wrong
4. Repeat

This copy-paste loop is tedious, error-prone, and breaks your workflow.

### What is an agent?

An agent (like Claude Code or OpenCode) runs **directly in your terminal** and interacts with your environment. It can:

- **Read files** in your project without you copying anything
- **Execute commands** (compile, run scripts, install packages) and see the output
- **Edit files** directly -- making precise changes to your code, LaTeX documents, or data scripts
- **Search** your codebase or directory tree for relevant content
- **Iterate autonomously**: if a compilation fails, the agent sees the error, diagnoses it, edits the file, and retries

In short: a chatbox is like texting a knowledgeable friend. An agent is like having that friend sit at your computer and work alongside you.

### Comparison

| Aspect | Chatbox (e.g., ChatGPT web) | Agent (e.g., Claude Code) |
|--------|------------------------------|---------------------------|
| Interaction | Copy-paste text | Direct access to your files and terminal |
| Context | Only what you paste | Sees your full project structure |
| Execution | You run everything manually | Can run commands and see results |
| Iteration | Manual back-and-forth | Autonomous edit-run-debug cycles |
| Workflow | Interrupts your work | Integrates into your work |

:::tip When to use which
A chatbox is fine for quick, isolated questions ("What is the commutator of angular momentum operators?"). An agent is better for any task that involves your actual files: debugging code, processing data, writing LaTeX, verifying derivations against your notes.
:::

## 19.2 This Is Not Just About Programming

A common misconception is that tools like Claude Code are only for software developers. In reality, an agent is useful for almost every aspect of research in theoretical and computational physics:

### Deriving and Verifying Mathematical Formulas

```bash
claude
> I'm computing the second-order energy correction in time-independent
> perturbation theory. I got this expression: [paste your derivation].
> Please verify each step and point out any errors.
```

```bash
> Derive the partition function for the 2D Ising model on a 2x2 lattice
> with periodic boundary conditions. Show every step explicitly.
```

The agent can perform symbolic manipulations step by step, and you can check each step against your own work. This is far more useful than looking up the final answer -- it helps you find *where* a derivation went wrong.

### Searching and Summarizing Literature Concepts

```bash
> Explain the difference between the Lanczos algorithm and the Davidson
> algorithm for finding eigenvalues of sparse matrices.
> When would I prefer one over the other in condensed matter physics?
```

```bash
> What numerical methods are commonly used for solving the
> Boltzmann transport equation? Give a brief overview of each approach
> with key references.
```

The agent draws on broad training data to give you an organized starting point. You should always verify claims against actual papers, but this can save hours of initial literature searching.

### Understanding Complex Physics Code

```bash
> Explain the main loop in src/dmrg_sweep.f90.
> What is the purpose of the truncation step at line 245?
> How does this relate to the density matrix renormalization group algorithm?
```

Unlike a chatbox, the agent can read the actual file, understand its context within the project, and relate the code to the physics.

### Automating Repetitive Research Tasks

```bash
> I have 50 output files in data/runs/ with the naming pattern
> run_T{temperature}_L{size}.dat. Each file has columns:
> step, energy, magnetization.
> For each file, compute the mean and standard deviation of the energy
> (discarding the first 1000 steps as thermalization).
> Save the results to a summary CSV with columns: T, L, E_mean, E_std.
```

```bash
> Read the data in results/spectrum.csv and plot the eigenvalues
> as a function of the coupling parameter g. Use matplotlib,
> label the axes, and save as figures/spectrum.pdf.
```

The agent writes the script, runs it, checks for errors, and produces the output -- all without you writing a single line of boilerplate.

### LaTeX Writing and Debugging

```bash
> I'm getting "Undefined control sequence" on line 47 of paper.tex.
> Read the file and fix the error.
```

```bash
> Reformat the table in paper.tex (the one starting at line 120)
> to use the booktabs package with proper \toprule, \midrule, \bottomrule.
```

```bash
> I have a list of DOIs in references.txt. Generate a BibTeX file
> with proper entries for each one.
```

## 19.3 Claude Code and OpenCode

### Claude Code

Claude Code is a **command-line AI agent** released by Anthropic. It runs directly in your terminal and can read files, execute commands, edit code, search your codebase, and explain logic and errors -- all within your project environment.

**Two ways to access Claude Code:**

1. **Subscription (Max plan):** Anthropic offers a Max subscription plan that includes Claude Code usage. You log in with your Anthropic account and get a monthly allocation of usage. This is the simplest option if you want predictable costs.

2. **API key:** You can also use Claude Code with a pay-as-you-go API key from the Anthropic Console. You pay per token (input and output). This gives you more flexibility and is better if your usage varies significantly.

### OpenCode

OpenCode is an open-source terminal AI agent inspired by Claude Code, but supporting multiple AI model backends (Claude, GPT, local models via Ollama, etc.).

### Comparison

| Aspect | Claude Code | OpenCode |
|--------|-------------|----------|
| Developer | Anthropic (commercial) | Open-source community |
| Model | Claude (Anthropic) | Configurable: Claude, GPT, local models |
| Access | Subscription (Max plan) or API key | Depends on chosen backend model |
| Installation | npm | go install or download binary |
| Source code | Closed source | Open source |
| Maturity | High | Under active development |

## 19.4 Installation

### Installing Claude Code

Prerequisites: Node.js 18+ required.

```bash
# Install Node.js (if not already installed)
# macOS
brew install node

# Ubuntu / WSL
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

### Installing OpenCode

```bash
# Install using the official script (recommended)
curl -fsSL https://opencode.ai/install | bash

# Or download pre-compiled binaries from:
# https://github.com/opencode-ai/opencode/releases

# Verify installation
opencode --version
```

## 19.5 Login and API Configuration

### Claude Code

**Option A: Subscription (Max plan)**

```bash
# First run will guide you through login with your Anthropic account
claude
# Follow the browser-based authentication flow
```

**Option B: API key**

```bash
# Set the API key as an environment variable
export ANTHROPIC_API_KEY="sk-ant-..."

# Add it to your shell configuration for persistence
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.bashrc
source ~/.bashrc

# Then start Claude Code
claude
```

:::caution API Key Security
- **Never** commit API keys to a Git repository
- **Never** write API keys in plaintext in shared scripts or documents
- Use environment variables or dedicated secrets management tools
- Rotate your API keys regularly
:::

### OpenCode

```bash
# OpenCode supports multiple configuration methods
# Create .opencode.json in the project directory or use environment variables
export ANTHROPIC_API_KEY="sk-ant-..."   # For Claude backend
export OPENAI_API_KEY="sk-..."          # For GPT backend

# First run
opencode
```

## 19.6 What Agents Are Good For

### Explaining and Understanding Code

When you inherit unfamiliar research code:

```bash
claude
> Explain the main logic of src/monte_carlo.f90,
> especially the metropolis_step function and how it implements
> detailed balance.
```

### Debugging Errors

```bash
> I got this error when compiling:
> "undefined reference to `dgemm_'"
> What does this mean? How do I fix it?
```

### Verifying Derivations

```bash
> I'm trying to show that the Hubbard model at half-filling maps to
> the Heisenberg model in the large-U limit via a Schrieffer-Wolff
> transformation. Here's my derivation so far: [paste notes].
> Check each step and identify where I made an error.
```

### Data Processing and Visualization

```bash
> Read all .csv files in the results/ directory.
> For each file, extract the second column, compute its Fourier transform,
> and plot the power spectrum. Save all plots to figures/.
```

### LaTeX and Writing Assistance

```bash
> Read my draft at paper/main.tex. Fix all LaTeX compilation errors,
> then check that all equation references (\ref, \eqref) point to
> existing labels.
```

### Refactoring and Testing

```bash
> Split the run_simulation function in simulation.py into smaller functions,
> each responsible for a clear step. Then write pytest tests for each.
```

:::tip Tips for Effective Use
1. **Provide context**: Tell the agent what research you are doing, what physics the code implements
2. **Ask specific questions**: Instead of "how is this code", ask "what is the time complexity of this function" or "is this boundary condition implementation correct for a periodic lattice"
3. **Work in steps**: Do not ask the agent to do too much at once; break tasks into smaller pieces
4. **Verify results**: Always check whether the agent's output is correct, especially for derivations and numerical code
:::

## 19.7 What Agents Are Not Good For

### Do Not Blindly Accept Generated Results

AI agents can produce output that looks correct but has subtle problems:

- **Numerical precision issues**: The agent may not consider floating-point precision or catastrophic cancellation
- **Missing boundary conditions**: Physical boundary conditions require your expert judgment
- **Inappropriate algorithm choices**: The agent may not know the special structure of your problem
- **Outdated information**: The agent's training data has a cutoff date; recent papers or package versions may not be covered
- **Mathematical errors**: While agents are good at algebra, they can still make sign errors or drop terms in long derivations

### Do Not Skip Understanding

```
Bad approach:
  Ask the agent to generate a Lanczos algorithm implementation,
  use it directly to compute eigenvalues without reading the code.

Good approach:
  1. Study the Lanczos algorithm yourself first
  2. Try implementing it (even imperfectly)
  3. Ask the agent to review your implementation and point out issues
  4. Ask the agent to explain its suggested improvements
  5. Only adopt changes you understand
```

### Do Not Use for Work Requiring Originality

- Core algorithms and derivations in your paper should be ones you understand and can explain
- Reviewers may ask about implementation details or derivation steps
- Using an agent for assistance is fine, but you must be able to independently reproduce and explain every step

:::caution Academic Integrity
When using AI assistance for coursework, follow the policies of your institution and course. Even when AI use is permitted, make sure you understand the work you ultimately submit. For research publications, check journal policies on AI-assisted writing and disclose AI usage as required.
:::

## 19.8 A Research Assistance Example

Suppose you inherited a Monte Carlo simulation of the Ising model from a former lab member. You need to understand it, fix a bug, add a measurement, and produce publication-quality plots.

### Step 1: Understand the Code Structure

```bash
cd ~/research/ising_model
claude
> Analyze the directory structure of this project and explain the role
> of each main file. What physics does this code simulate?
```

### Step 2: Understand the Core Algorithm

```bash
> Explain in detail the metropolis_step function in src/metropolis.c.
> How does it compute the acceptance probability?
> Is the implementation consistent with the Metropolis-Hastings algorithm
> as described in Newman & Barkema Chapter 3?
```

### Step 3: Find and Fix a Bug

```bash
> When I run the simulation, the energy does not converge at high temperature.
> Check whether the energy difference calculation in metropolis_step is correct,
> paying special attention to the periodic boundary conditions.
```

### Step 4: Add a New Measurement

```bash
> I need to measure the spin-spin correlation function C(r) = <s_i s_{i+r}>
> as a function of distance r. Explain the implementation approach,
> then add this measurement to measurements.c.
```

### Step 5: Produce Publication Plots

```bash
> Read the output files in data/. Plot the specific heat C_v as a function
> of temperature T for lattice sizes L=16, 32, 64, 128 on the same figure.
> Use matplotlib with publication-quality settings (appropriate fonts,
> legend, axis labels with units). Save as figures/specific_heat.pdf.
```

:::info Notice the Workflow
At every step you are **actively guiding the agent**, not passively waiting. You ask questions, the agent provides information and takes actions, and you make the scientific judgments. This is agent-assisted research done right.
:::

## 19.9 Security and Cost Considerations

### Cost

| Tool | Pricing Model |
|------|---------------|
| Claude Code (Max plan) | Monthly subscription with included usage allocation |
| Claude Code (API key) | Pay per token (input/output token count) |
| OpenCode | Depends on backend model; free with local models |

Tips for controlling costs:

1. **Set API usage limits**: If using an API key, set monthly spending caps in the Anthropic Console
2. **Avoid sending large files**: Do not have the agent read entire data files; only send the relevant portions
3. **Reduce unnecessary conversation rounds**: Provide sufficient context upfront
4. **Use appropriate models**: For simple tasks, smaller/cheaper models may suffice

### Security

- **Do not let agents process sensitive data**: Unpublished key results, collaborators' private code, or export-controlled material
- **Be aware of data transmission**: Your code and files are sent to remote servers when using cloud models
- **Local model option**: If data confidentiality requirements are high, consider using OpenCode with local models (e.g., via Ollama)
- **Review agent actions**: Claude Code can execute shell commands -- always confirm what it is about to do when prompted

:::caution Confidential Data
If your research involves confidential data, patent-related code, or content restricted by collaboration agreements, consult your advisor and your institution's policies before using online AI tools. Once code is sent to an API, it may be used for model training (depending on the service provider's policies).
:::

### Recommended Security Practices

```bash
# Exclude API key files in .gitignore
echo ".env" >> .gitignore
echo ".anthropic" >> .gitignore

# Use a .env file to manage API keys (never commit to Git)
echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env
```

## FAQ

**Q: What is the difference between Claude Code and the web version of Claude?**

A: Claude Code is an agent that runs in your terminal. It directly reads your project files, executes commands, and edits code. The web version of Claude is a chatbox -- you must manually paste code in and copy results out. The agent workflow is dramatically more efficient for any task involving your actual files.

**Q: Can I use agent-generated code or text in a paper?**

A: You can, but you must understand every line and be able to take full responsibility for it. Many journals now have policies on AI-assisted writing -- check the relevant guidelines (e.g., Nature, Science, APS journals all have specific policies). The core principle: if you can explain and defend it, it is yours.

**Q: Should I use the Max subscription or an API key?**

A: The Max subscription gives predictable monthly costs and is simpler to set up. The API key is pay-as-you-go and better if your usage varies a lot (heavy some weeks, zero others). For most graduate students, starting with the subscription is easier.

**Q: Are local models or cloud models better?**

A: Cloud models (Claude, GPT-4) are significantly more capable but have privacy and cost considerations. Local models (e.g., via Ollama) are free and private but considerably less capable, especially for complex physics reasoning. Choose based on your needs.

**Q: I am just learning to program. Should I use an agent?**

A: Yes, but be mindful of balance. Have the agent **explain** concepts and errors rather than directly **generate** answers. The goal during the learning phase is to build understanding, not to maximize throughput. Use the agent as a tutor, not as a shortcut.

**Q: How much does it cost approximately?**

A: With the Max subscription, costs are fixed at the plan price. With API keys, typical daily use (a few dozen interactions per day) runs roughly $10-30 per month. Heavy use may cost more. Set a monthly spending cap to avoid surprises.

## Summary

- AI **agents** (Claude Code, OpenCode) are fundamentally different from **chatboxes** -- they work directly in your environment
- Claude Code can be accessed via a **Max subscription** or an **API key**
- Agents are useful far beyond programming: derivations, literature search, data processing, LaTeX, visualization
- Best use cases: understanding code, verifying derivations, automating repetitive tasks, debugging
- Not suitable for: blindly accepting generated results, skipping understanding, processing sensitive data
- **Understanding is always your responsibility** -- the agent assists, you decide

## Exercises

1. Install Claude Code and use it to explain the example code from any chapter of this guide
2. Take a derivation from your coursework or research. Have the agent verify it step by step. Did it catch any errors? Did it make any errors itself?
3. Find a piece of code you wrote previously, and have the agent point out possible improvements. Evaluate whether its suggestions are scientifically and numerically sound
4. Use the agent to automate a repetitive task: batch-process some data files, generate a plot, or reformat a LaTeX table
5. Intentionally write code with a bug (e.g., wrong sign in an energy calculation), and have the agent find and explain the bug
6. (Optional) Use OpenCode to configure a local model and compare its capabilities with a cloud model for a physics-related task
