---
sidebar_position: 22
sidebar_label: "22. Vibe Coding"
---

# Chapter 22: How to "Vibe Code" a Computational Physics Project / Vibe Coding

> Don't chase perfection — first make it run, then make it run well.

## Chapter Goals

After reading this chapter, you should be able to:

- Understand the "vibe coding" philosophy and its applicable scenarios
- Master the iterative workflow for building computational physics projects from scratch
- Learn to leverage AI tools to decompose and implement tasks
- Complete a full physics simulation project (from idea to GitHub publication)

## Motivation

Many physics students face two extremes when approaching programming projects:

1. **Over-planning**: Drawing dozens of pages of UML diagrams before writing a single line of code, resulting in never getting started
2. **No planning**: Diving straight in, only to find halfway through that the structure is messy and impossible to extend

"Vibe coding" is a practical development approach between these two extremes: **Go with the flow, but with basic methodology to support you.**

---

## 22.1 What Is "Vibe Coding"

The "vibe coding" concept comes from Andrej Karpathy (OpenAI/Tesla AI lead):

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

In the context of computational physics, vibe coding means:

- **Rapid prototyping**: Write a minimal version first, verify the physics logic
- **Iterative improvement**: Add features, tests, and optimize performance round by round
- **AI-assisted**: Use ChatGPT, GitHub Copilot, and other tools to accelerate development
- **Don't chase perfection**: Code doesn't need to be beautiful from the start — as long as it runs and can be verified, that's fine

:::info Scope of Application
Vibe coding is suitable for small to medium-sized research projects (hundreds to a few thousand lines of code). If you're developing a large framework or software that needs long-term team maintenance, you'll need a more formal software engineering process.
:::

### Vibe Coding vs Traditional Development

| | Traditional Software Engineering | Vibe Coding |
|---|---|---|
| Starting point | Requirements docs, design docs | A physics problem |
| Pace | Waterfall or Agile sprints | Iterate as inspiration strikes |
| Code quality | Pursue standards from the start | Get it running first, refactor later |
| Testing | TDD (Test-Driven Development) | Check if results look right first, add tests later |
| Tools | IDE, CI/CD, code review | Editor + AI assistant |
| Best for | Team projects, production software | Research exploration, coursework, personal projects |

---

## 22.2 The Right Mindset: Verify First, Extend Later

### Core Principles

```
1. Make it work  — First make it run
2. Make it right — Then make it correct
3. Make it fast  — Finally make it fast
```

:::caution Common Beginner Mistake
Don't obsess over performance optimization in the first step. Make sure the physics results are correct first, then consider efficiency. A program that runs fast but gives wrong results is worthless.
:::

### Verification Methods

In computational physics, common methods for verifying code correctness:

| Method | Applicable Scenario | Example |
|--------|-------------------|---------|
| Analytical solution comparison | Cases with exact solutions | 1D harmonic oscillator, free particle |
| Limiting case checks | Known behavior at special parameters | Thermodynamic quantities at T->0 or T->inf |
| Conservation law checks | Systems with conservation laws | Energy conservation, particle number conservation |
| Literature comparison | Published numerical results | Critical temperature, critical exponents |
| Symmetry checks | Symmetries the system should satisfy | Spatial isotropy, time reversal |

---

## 22.3 Topic Suggestions: Ising Model, Schrodinger Equation, Random Walk, Molecular Dynamics

Here are computational physics projects suitable for vibe coding, sorted by difficulty:

### Beginner Level

| Project | Physics | Core Algorithm | Programming Difficulty |
|---------|---------|---------------|----------------------|
| 1D/2D Random Walk | Brownian motion | Random number generation | Low |
| Numerical Integration | Arbitrary potential | Simpson / Gauss quadrature | Low |
| Spring Oscillator | Classical mechanics | Euler / Verlet integration | Low |

### Intermediate Level

| Project | Physics | Core Algorithm | Programming Difficulty |
|---------|---------|---------------|----------------------|
| 2D Ising Model | Statistical mechanics | Metropolis Monte Carlo | Medium |
| 1D Schrodinger Equation | Quantum mechanics | Finite difference / Shooting method | Medium |
| Molecular Dynamics (LJ) | Materials science | Velocity Verlet | Medium |

### Advanced Level

| Project | Physics | Core Algorithm | Programming Difficulty |
|---------|---------|---------------|----------------------|
| XY Model and KT Transition | Statistical mechanics | Wolff cluster MC | High |
| 2D Schrodinger Equation | Quantum mechanics | Split-operator method | High |
| N-body Gravity Simulation | Astrophysics | Barnes-Hut / PM | High |

:::tip Topic Selection Principle
Choose a problem you **understand physically**. The premise of vibe coding is that you know what the results should "roughly look like".
:::

---

## 22.4 Using AI to Decompose Tasks

AI tools serve as **accelerators** in vibe coding, not replacements.

### How to Use AI for Task Decomposition

Effective ways to prompt AI:

```
Prompt: "I want to write a 2D Ising model Monte Carlo simulation in Python.
Please help me break this project into 5-7 small tasks that can be
implemented and verified incrementally."
```

AI might give you this decomposition:

```
Task 1: Create an L*L lattice, randomly initialize spins
Task 2: Implement energy calculation function (periodic boundary conditions)
Task 3: Implement single Metropolis flip
Task 4: Implement MC loop, compute energy and magnetization
Task 5: Add thermalization and measurement separation
Task 6: Sweep temperature, plot phase transition curve
Task 7: Add Wolff cluster algorithm, compare efficiency
```

### Notes on AI Usage

:::caution AI Is Not Omniscient
- AI-generated code **must be verified** — it may write code that looks correct but is physically wrong
- Don't copy-paste code you don't understand — you won't be able to debug when things go wrong
- AI doesn't know your specific research context — physical judgment is still on you
- Treat AI as "an experienced colleague who occasionally makes mistakes"
:::

### Recommended AI Tools

| Tool | Use Case | Price |
|------|----------|-------|
| GitHub Copilot | In-editor code completion | Free for students |
| ChatGPT / Claude | Conversational Q&A, code generation | Free/Paid |
| Cursor | AI-native editor | Free/Paid |

---

## 22.5 Building a Minimum Viable Version

### MVP (Minimum Viable Product) Thinking

Your first version should:

- Run without errors
- Be physically correct (even if simplified)
- Produce output that can be inspected

### Example: MVP for a 2D Ising Model

```python
# ising_mvp.py — Minimum viable 2D Ising model
import numpy as np

# Parameters
L = 16          # Lattice size
T = 2.27        # Temperature (near critical temperature)
steps = 100000  # MC steps

# Initialize random spin configuration
spins = np.random.choice([-1, 1], size=(L, L))

def energy(spins):
    """Compute total energy (periodic boundary)"""
    E = 0
    for i in range(L):
        for j in range(L):
            S = spins[i, j]
            nb = (spins[(i+1)%L, j] + spins[(i-1)%L, j] +
                  spins[i, (j+1)%L] + spins[i, (j-1)%L])
            E -= S * nb
    return E / 2  # Count each pair only once

def mc_step(spins, T):
    """One MC sweep (L*L flip attempts)"""
    for _ in range(L * L):
        i, j = np.random.randint(0, L, size=2)
        S = spins[i, j]
        nb = (spins[(i+1)%L, j] + spins[(i-1)%L, j] +
              spins[i, (j+1)%L] + spins[i, (j-1)%L])
        dE = 2 * S * nb
        if dE <= 0 or np.random.random() < np.exp(-dE / T):
            spins[i, j] *= -1

# Run simulation
for step in range(steps):
    mc_step(spins, T)
    if step % 10000 == 0:
        E = energy(spins)
        M = np.abs(spins.mean())
        print(f"Step {step:6d}: E/N = {E/L**2:.4f}, |M| = {M:.4f}")
```

Verification:

```bash
python ising_mvp.py
# Check: Near T=2.27, |M| should fluctuate between 0.3-0.8
# Check: At T=1.0, |M| should be close to 1
# Check: At T=4.0, |M| should be close to 0
```

---

## 22.6 Adding Tests and Visualization

### Second Iteration: Add Visualization

```python
# Add on top of MVP
import matplotlib.pyplot as plt

# Store measurement data
energies = []
magnetizations = []

for step in range(steps):
    mc_step(spins, T)
    if step % 100 == 0 and step > 20000:  # Skip thermalization
        energies.append(energy(spins) / L**2)
        magnetizations.append(np.abs(spins.mean()))

# Plot
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

axes[0].imshow(spins, cmap='coolwarm', interpolation='nearest')
axes[0].set_title(f"Spin configuration (T={T})")

axes[1].plot(energies)
axes[1].set_xlabel("Measurement")
axes[1].set_ylabel("E/N")
axes[1].set_title("Energy per site")

axes[2].plot(magnetizations)
axes[2].set_xlabel("Measurement")
axes[2].set_ylabel("|M|")
axes[2].set_title("Magnetization")

plt.tight_layout()
plt.savefig("ising_results.png", dpi=150)
plt.show()
```

### Add Basic Tests

```python
# tests/test_ising.py
import numpy as np
from ising_mvp import energy, mc_step

def test_energy_all_up():
    """Energy should be -2N when all spins are up"""
    L = 4
    spins = np.ones((L, L), dtype=int)
    E = energy(spins)
    assert E == -2 * L * L, f"Expected {-2*L*L}, got {E}"

def test_high_temperature():
    """Magnetization should be near 0 at high temperature"""
    L = 16
    spins = np.random.choice([-1, 1], size=(L, L))
    for _ in range(10000):
        mc_step(spins, T=100.0)
    M = np.abs(spins.mean())
    assert M < 0.3, f"|M| = {M}, expected near 0 at high T"

def test_low_temperature():
    """Magnetization should be near 1 at low temperature"""
    L = 8
    spins = np.ones((L, L), dtype=int)
    for _ in range(10000):
        mc_step(spins, T=0.5)
    M = np.abs(spins.mean())
    assert M > 0.9, f"|M| = {M}, expected near 1 at low T"

if __name__ == "__main__":
    test_energy_all_up()
    test_high_temperature()
    test_low_temperature()
    print("All tests passed!")
```

---

## 22.7 Refactoring and Performance Optimization

### Third Iteration: Refactor Code Structure

Split the single script into modules:

```
ising_project/
├── src/
│   ├── __init__.py
│   ├── model.py          # IsingModel class
│   ├── algorithms.py     # Metropolis, Wolff
│   └── observables.py    # Energy, magnetization, specific heat
├── scripts/
│   ├── run.py            # Main run script
│   └── plot.py           # Plotting script
├── tests/
│   └── test_model.py
├── configs/
│   └── default.yaml
└── README.md
```

### Performance Optimization Approaches

```python
# Optimization 1: Vectorized energy computation with NumPy
def energy_vectorized(spins):
    """Vectorized energy computation — 100x faster than loops"""
    return -(spins * (
        np.roll(spins, 1, axis=0) +
        np.roll(spins, -1, axis=0) +
        np.roll(spins, 1, axis=1) +
        np.roll(spins, -1, axis=1)
    )).sum() / 2

# Optimization 2: Precompute Boltzmann factors
# dE can only be -8, -4, 0, 4, 8
boltzmann = {dE: np.exp(-dE / T) for dE in [-8, -4, 0, 4, 8]}

# Optimization 3: Use Numba JIT compilation
from numba import njit

@njit
def mc_step_fast(spins, L, T):
    for _ in range(L * L):
        i = np.random.randint(0, L)
        j = np.random.randint(0, L)
        S = spins[i, j]
        nb = (spins[(i+1)%L, j] + spins[(i-1)%L, j] +
              spins[i, (j+1)%L] + spins[i, (j-1)%L])
        dE = 2 * S * nb
        if dE <= 0 or np.random.random() < np.exp(-dE / T):
            spins[i, j] = -S
```

:::tip Optimization Principles
1. **Profile first, optimize second** — use `cProfile` or `line_profiler` to find bottlenecks
2. **Vectorize first** — NumPy operations are 10-100x faster than Python loops
3. **Numba/Cython second** — effective for hot loops that can't be vectorized
4. **C/Fortran extensions last** — consider for extreme performance requirements
:::

---

## 22.8 Write Documentation and Publish to GitHub

### Write a Good README

````markdown
# 2D Ising Model Monte Carlo Simulation

A Python implementation of the 2D Ising model using
Metropolis and Wolff cluster algorithms.

## Features
- Metropolis single-spin-flip algorithm
- Wolff cluster algorithm
- Energy, magnetization, specific heat, susceptibility
- Finite-size scaling analysis

## Installation
```bash
git clone https://github.com/yourname/ising-mc.git
cd ising-mc
pip install -r requirements.txt
```

## Quick Start
```bash
python scripts/run.py --config configs/default.yaml
python scripts/plot.py --data data/output/
```

## Results
![Phase Diagram](results/figures/phase_diagram.png)

## References
- Onsager, L. (1944). Crystal Statistics.
- Newman, M. & Barkema, G. Monte Carlo Methods in Statistical Physics.
````

### Publish to GitHub

```bash
# Initialize repository
cd ising_project
git init
git add .
git commit -m "Initial commit: 2D Ising MC simulation"

# Create GitHub repository (using gh CLI)
gh repo create ising-mc --public --source=. --push

# Or manually add remote
git remote add origin https://github.com/yourname/ising-mc.git
git push -u origin main
```

---

## 22.9 A Complete Example Roadmap (2D Ising Model)

Here is a complete development roadmap showing the entire process from zero to publication:

```
Week 1: MVP
├── Day 1: Research and learn the Ising model and Metropolis algorithm
├── Day 2: Write MVP script (~50 lines), verify it runs
├── Day 3: Add print output, check energy and magnetization
├── Day 4: Compare with analytical solution (1D) or literature values (2D critical temperature)
└── Day 5: Fix bugs, ensure physics results are reasonable

Week 2: Feature Completion
├── Day 1: Add matplotlib visualization
├── Day 2: Implement temperature sweep, plot phase transition curve
├── Day 3: Write basic tests (limiting cases)
├── Day 4: Refactor into class and module structure
└── Day 5: Add configuration file (YAML)

Week 3: Optimization and Publication
├── Day 1: Performance profiling, identify bottlenecks
├── Day 2: NumPy vectorization or Numba acceleration
├── Day 3: Add Wolff cluster algorithm
├── Day 4: Write README, organize documentation
└── Day 5: Publish to GitHub
```

### Iteration Process Visualization

```
        Lines of code
  800 ┤                                    ╭──── v1.0 Release
      │                                 ╭──╯
  600 ┤                              ╭──╯
      │                           ╭──╯
  400 ┤                Refactor ╭──╯  Add Wolff
      │                  ╭──╯╭──╯
  200 ┤     Add viz  ╭──╯
      │           ╭──╯
   50 ┤  MVP ╭───╯
      │  ╭──╯
    0 ┼──╯─────────────────────────────────────
      Day1    5     10     15     20     25
```

### Verification Criteria for Each Stage

| Stage | Verification Criteria | Pass Condition |
|-------|----------------------|----------------|
| MVP | Runs, produces output | Energy and magnetization in reasonable range |
| Physics verification | Correct results | T_c ≈ 2.269 (2D square lattice) |
| Visualization | Phase transition visible | Phase transition curve matches textbook |
| Testing | Automated verification | All `pytest` tests pass |
| Performance | Can handle large systems | L=128 completes in a few minutes |
| Publication | Others can use it | Following README steps reproduces results |

---

## FAQ

**Q: Will vibe coding develop bad habits?**
A: No, as long as you do refactoring and testing in later stages. The key is **don't stay at the MVP stage forever**.

**Q: Can AI-generated code be used directly?**
A: It must be verified. Especially for physics-related parts — AI may get signs, boundary conditions, or units wrong.

**Q: Do solo projects need tests?**
A: Yes. Tests aren't for "others" — they're for "you three months from now when you've forgotten the details".

**Q: Should I start with Python or C++?**
A: For research projects, Python is recommended to start (faster development speed). Consider rewriting core parts in C/Fortran when performance bottlenecks appear.

---

## Summary

- **Vibe coding** is an iterative development approach well-suited for research projects
- Core workflow: **Make it work -> Make it right -> Make it fast**
- AI is a powerful assistive tool, but **physical judgment and code verification** are still on you
- Start from an MVP, gradually add tests, visualization, and optimization
- The ultimate goal is a **reproducible, documented, shareable** project

---

## Exercises

1. Choose one of the physics problems recommended in this chapter and write an MVP using the vibe coding approach (no more than 100 lines)
2. Use AI tools to help decompose your task — record what suggestions AI gave, which were useful, and which needed correction
3. Add at least 3 tests to your MVP (limiting case tests)
4. Do one round of refactoring on your MVP, splitting it into at least 2 files
5. Write a README and publish to GitHub (you can set it to private)
