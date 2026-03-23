---
sidebar_position: 21
sidebar_label: "21. Project Organization"
---

# Chapter 21: How to Organize a Computational Physics Project / Project Organization

> Good project structure is the foundation of reproducible research.

## Chapter Goals

After reading this chapter, you should be able to:

- Design a clear, well-structured directory layout for computational physics projects
- Understand the responsibilities of `src/`, `include/`, `scripts/`, `docs/`, `data/`, `tests/` directories
- Write standardized configuration and parameter files
- Manage computation inputs, outputs, and logs
- Meet the minimum requirements for research reproducibility
- Use project templates to quickly bootstrap new projects

## Motivation

Have you ever encountered these situations?

- Your folder is full of `test1.py`, `test2_final.py`, `test2_final_v2.py`
- You come back to your own code six months later and have no idea which version is the final one
- Your advisor asks you to reproduce results from three months ago, but the parameters are lost
- A junior student takes over your project and spends two weeks figuring out how to run it

The root cause of these problems is **a lack of project organization standards**.

---

## 21.1 What a Research Project Should Look Like

### Minimum Viable Structure

A computational physics project needs at least:

```
my_project/
├── README.md           # Project description (required)
├── src/                # Source code
├── data/               # Data (input/output)
├── scripts/            # Helper scripts (plotting, post-processing)
├── docs/               # Documentation and notes
├── .gitignore          # Git ignore rules
└── requirements.txt    # Dependency list (Python projects)
```

### Recommended Full Structure

```
ising_monte_carlo/
├── README.md
├── LICENSE
├── .gitignore
├── requirements.txt        # or environment.yml
│
├── src/                    # Core source code
│   ├── __init__.py
│   ├── model.py            # Physics model definition
│   ├── algorithm.py        # Algorithm implementation
│   ├── observables.py      # Observable computation
│   └── io.py               # Input/output handling
│
├── include/                # Header files (C/C++/Fortran projects)
│   └── constants.h
│
├── scripts/                # Helper scripts
│   ├── run_simulation.sh   # Run script
│   ├── plot_results.py     # Plotting script
│   ├── analyze.py          # Data analysis
│   └── submit_job.slurm    # HPC job submission script
│
├── tests/                  # Tests
│   ├── test_model.py
│   └── test_algorithm.py
│
├── configs/                # Configuration files
│   ├── default.yaml
│   ├── high_temp.yaml
│   └── critical_point.yaml
│
├── data/                   # Data directory
│   ├── input/              # Input data
│   └── output/             # Output results (usually not tracked by Git)
│
├── results/                # Final results and figures
│   ├── figures/
│   └── tables/
│
├── docs/                   # Documentation
│   ├── notes.md            # Research notes
│   └── methods.md          # Methods description
│
├── notebooks/              # Jupyter notebooks (exploratory analysis)
│   └── exploration.ipynb
│
└── Makefile                # or CMakeLists.txt
```

:::tip Principle
**Every file should have a clear home.** If you don't know where a file should go, it means your directory structure needs improvement.
:::

---

## 21.2 src / include / scripts / docs / data / tests

### `src/` — Core Source Code

Stores the core logic of your project. Each file should have a single responsibility:

```python
# src/model.py — Physics model definition
class IsingModel:
    def __init__(self, L, T, J=1.0):
        self.L = L          # Lattice size
        self.T = T          # Temperature
        self.J = J          # Coupling constant
        self.spins = np.random.choice([-1, 1], size=(L, L))
```

### `include/` — Header Files (C/C++/Fortran)

```c
// include/constants.h
#ifndef CONSTANTS_H
#define CONSTANTS_H

#define KB 1.380649e-23    // Boltzmann constant (J/K)
#define PI 3.14159265358979

#endif
```

### `scripts/` — Helper Scripts

Not core logic, but used for running, analysis, plotting, etc.:

```bash
#!/bin/bash
# scripts/run_simulation.sh
# Batch run simulations at different temperatures

for T in 1.0 1.5 2.0 2.27 2.5 3.0 3.5 4.0; do
    echo "Running T=$T ..."
    python -m src.main --config configs/default.yaml --temperature $T
done
```

### `docs/` — Documentation and Notes

```markdown
<!-- docs/methods.md -->
# Methods Description

## Metropolis Algorithm
This project uses the standard Metropolis-Hastings algorithm...
Acceptance probability: P = min(1, exp(-ΔE / kT))

## References
- Newman & Barkema, "Monte Carlo Methods in Statistical Physics"
```

### `data/` — Data

```
data/
├── input/                  # Initial configurations, parameter files
│   └── initial_config.npy
└── output/                 # Simulation output (usually not tracked by Git)
    ├── T1.0_L32.dat
    ├── T2.0_L32.dat
    └── T2.27_L32.dat
```

### `tests/` — Tests

```python
# tests/test_model.py
import pytest
from src.model import IsingModel

def test_energy_fully_aligned():
    """When all spins are up, energy should be -2*J*N"""
    model = IsingModel(L=4, T=1.0)
    model.spins[:] = 1  # All spins up
    E = model.total_energy()
    expected = -2 * model.J * model.L**2
    assert E == expected
```

---

## 21.3 Configuration and Parameter Files

**Never hardcode parameters in your code.** Use configuration files to manage all variable parameters.

### YAML Format (Recommended)

```yaml
# configs/default.yaml
simulation:
  model: "ising_2d"
  lattice_size: 32
  temperature: 2.27
  coupling: 1.0
  boundary: "periodic"

algorithm:
  method: "metropolis"
  thermalization_steps: 10000
  measurement_steps: 50000
  measurement_interval: 10

output:
  directory: "data/output"
  save_config: true
  save_snapshots: false
  snapshot_interval: 1000

random:
  seed: 42
```

### JSON Format

```json
{
  "simulation": {
    "model": "ising_2d",
    "lattice_size": 32,
    "temperature": 2.27
  },
  "algorithm": {
    "method": "metropolis",
    "thermalization_steps": 10000,
    "measurement_steps": 50000
  }
}
```

### Loading Configuration in Code

```python
# src/config.py
import yaml

def load_config(path):
    with open(path, 'r') as f:
        config = yaml.safe_load(f)
    return config

# Usage
config = load_config("configs/default.yaml")
L = config["simulation"]["lattice_size"]
T = config["simulation"]["temperature"]
```

:::caution YAML vs JSON
- **YAML**: Supports comments, better readability — recommended for configuration files
- **JSON**: Stricter, no comments — suitable for machine-to-machine data exchange
- **INI/CFG**: Usable for simple cases, but does not support nested structures
:::

---

## 21.4 Input/Output Standards

### Input Standards

- Use command-line arguments to specify the configuration file path
- Support command-line arguments to override values in the configuration file
- Use standard formats for input files (YAML, JSON, HDF5, NumPy)

```python
# Use argparse for command-line argument handling
import argparse

parser = argparse.ArgumentParser(description="2D Ising Monte Carlo")
parser.add_argument("--config", type=str, required=True,
                    help="Path to config file")
parser.add_argument("--temperature", type=float, default=None,
                    help="Override temperature in config")
parser.add_argument("--output-dir", type=str, default=None,
                    help="Override output directory")
args = parser.parse_args()
```

### Output Standards

Output filenames should contain key parameter information:

```python
# Good naming
output_file = f"ising_L{L}_T{T:.4f}_seed{seed}.dat"
# e.g.: ising_L32_T2.2700_seed42.dat

# Bad naming
output_file = "result.dat"       # Cannot distinguish between runs
output_file = "result_final.dat" # "final" is meaningless
```

### Output File Headers

```python
# Write metadata at the beginning of output files
with open(output_file, 'w') as f:
    f.write(f"# Ising 2D Monte Carlo Simulation\n")
    f.write(f"# Date: {datetime.now().isoformat()}\n")
    f.write(f"# L={L}, T={T}, J={J}, seed={seed}\n")
    f.write(f"# Columns: step, energy, magnetization\n")
    for step, E, M in results:
        f.write(f"{step} {E:.6e} {M:.6e}\n")
```

---

## 21.5 Logging and Results Management

### Using the Python logging Module

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("simulation.log"),
        logging.StreamHandler()  # Also output to screen
    ]
)

logger = logging.getLogger(__name__)

logger.info(f"Starting simulation: L={L}, T={T}")
logger.info(f"Thermalization: {therm_steps} steps")
logger.warning("Temperature is below critical point")
logger.error("Configuration file not found")
```

### Organizing Results Directories

```
results/
├── 2025-01-15_phase_diagram/
│   ├── run_config.yaml          # A copy of the configuration used
│   ├── ising_L32_T2.27.dat
│   ├── phase_diagram.pdf
│   └── notes.md                 # Notes about this computation
│
└── 2025-02-03_finite_size/
    ├── run_config.yaml
    ├── L16/ L32/ L64/ L128/
    ├── scaling_analysis.pdf
    └── notes.md
```

:::tip Timestamp Naming
Use date prefixes for results directories to make it easy to sort and trace back by time.
:::

---

## 21.6 Minimum Requirements for Reproducible Experiments

Research reproducibility is a core requirement. Here is the minimum checklist:

| Element | Description | How to Achieve |
|---------|-------------|----------------|
| Code version | Which version of the code was used | Git commit hash |
| Parameter record | All parameters are recorded | Configuration file + output file header |
| Random seed | Random processes are repeatable | Fix and record the seed |
| Environment info | Software versions, compiler versions | `requirements.txt` / `environment.yml` |
| Run command | How to run the program | README or script |
| Raw data | Raw output of computations | Saved in `data/output/` |

### Recording Git Information in Output

```python
import subprocess

def get_git_info():
    commit = subprocess.check_output(
        ["git", "rev-parse", "HEAD"]
    ).decode().strip()
    status = subprocess.check_output(
        ["git", "status", "--short"]
    ).decode().strip()
    return commit, status

commit, status = get_git_info()
logger.info(f"Git commit: {commit}")
if status:
    logger.warning(f"Uncommitted changes:\n{status}")
```

:::caution Reproducibility Red Line
If you cannot obtain the same results with the same code and parameters in a new environment, your research has a problem. **Before publishing a paper, have at least one colleague successfully reproduce your results.**
:::

---

## 21.7 Project Template Example

### One-Click Project Structure Creation

````bash
#!/bin/bash
# scripts/create_project.sh
# Usage: bash create_project.sh my_new_project

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: bash create_project.sh <project_name>"
    exit 1
fi

mkdir -p "$PROJECT_NAME"/{src,tests,scripts,configs,data/{input,output},results/figures,docs,notebooks}

# Create README
cat > "$PROJECT_NAME/README.md" << 'EOF'
# Project Name

## Description
Brief description of the project.

## Installation
```bash
pip install -r requirements.txt
```

## Usage
```bash
python -m src.main --config configs/default.yaml
```

## Project Structure
- `src/` — Core source code
- `tests/` — Unit tests
- `scripts/` — Helper scripts
- `configs/` — Configuration files
- `data/` — Input/output data
- `results/` — Figures and analysis results
- `docs/` — Documentation
EOF

# Create .gitignore
cat > "$PROJECT_NAME/.gitignore" << 'EOF'
# Python
__pycache__/
*.pyc
*.egg-info/
.venv/
venv/

# Data (large files)
data/output/
*.hdf5
*.h5

# Build
build/
*.o
*.mod

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Results (optional, may want to keep)
# results/
EOF

# Create empty requirements.txt
cat > "$PROJECT_NAME/requirements.txt" << 'EOF'
numpy>=1.24
scipy>=1.10
matplotlib>=3.7
pyyaml>=6.0
pytest>=7.0
EOF

# Create default configuration
cat > "$PROJECT_NAME/configs/default.yaml" << 'EOF'
# Default configuration
simulation:
  name: "unnamed"
  # Add your parameters here

output:
  directory: "data/output"
  save_config: true

random:
  seed: 42
EOF

# Create __init__.py
touch "$PROJECT_NAME/src/__init__.py"

echo "Project '$PROJECT_NAME' created successfully!"
echo "Next steps:"
echo "  cd $PROJECT_NAME"
echo "  git init"
echo "  python -m venv .venv"
echo "  source .venv/bin/activate"
echo "  pip install -r requirements.txt"
````

### Using cookiecutter Templates

If you frequently create similar projects, you can use `cookiecutter`:

```bash
pip install cookiecutter

# Use a community template
cookiecutter https://github.com/audreyfeldroy/cookiecutter-pypackage

# Or create your own template
```

---

## `.gitignore` Essentials

A good `.gitignore` should exclude:

```gitignore
# Build artifacts
build/
*.o
*.mod
*.exe

# Python cache
__pycache__/
*.pyc
.venv/

# Large data files
data/output/
*.hdf5
*.npy
*.csv

# Editor temporary files
.vscode/settings.json
*.swp
*~

# System files
.DS_Store
Thumbs.db

# Keys and sensitive information
*.key
*.pem
.env
```

:::info What Should Be Tracked by Git
- All source code
- Configuration file templates
- Documentation and README
- Test code
- Small input data (< 1 MB)
- Makefile / CMakeLists.txt / pyproject.toml
:::

---

## FAQ

**Q: What if the data is too large for Git?**
A: Use Git LFS (Large File Storage), or store large data on shared storage/cloud drives and document how to obtain the data in the README.

**Q: Should notebooks be tracked in Git?**
A: Exploratory notebooks can be tracked, but production code should be extracted from notebooks into `src/`. Use the `nbstripout` tool to strip notebook outputs before committing.

**Q: Should I use YAML or JSON for configuration files?**
A: YAML is recommended. It supports comments and is more readable. JSON is better suited for data exchange between programs.

**Q: How large is "too large" for a project?**
A: If `src/` exceeds 50 files, consider splitting into multiple submodules. If the project involves multiple independent research directions, consider splitting into separate repositories.

---

## Summary

- **A clear directory structure** is the foundation of project maintainability
- Use configuration files to manage parameters — **never hardcode**
- Output filenames should contain key parameters, and file headers should contain metadata
- **Reproducibility** is the bottom line of research — record code version, parameters, and environment
- Use project templates to quickly bootstrap new projects and maintain consistency
- Use `.gitignore` wisely — don't commit large files and caches to Git

---

## Exercises

1. Use the template script from this chapter to create a new project and initialize a Git repository
2. Reorganize the directory structure of one of your existing projects, adding a README and `.gitignore`
3. Convert a script with hardcoded parameters to use a YAML configuration file
4. Add metadata headers to your simulation output (date, parameters, Git commit)
5. Check whether your project meets all elements in the "minimum reproducibility checklist"
