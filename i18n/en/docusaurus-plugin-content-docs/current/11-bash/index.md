---
sidebar_position: 11
sidebar_label: "11. Bash Scripting"
---

# Chapter 11: Bash Scripting and Automation

**Bash Scripting and Automation**

---

## Chapter Goals

After reading this chapter, you should be able to:

- Write Bash scripts with variables, conditionals, loops, and functions
- Handle command-line arguments
- Use scripts to perform batch renaming, parameter sweeps, automated compilation, and more
- Understand basic methods for parallel execution
- Debug Bash scripts

---

## Motivation

Research involves a great deal of repetitive work: running the same program with 20 different parameter sets, renaming 100 output files, or compiling code and running tests every day. **Bash scripts can automate all of this**. If you need to do something more than twice, it is worth writing a script — scripts are **repeatable, documentable, shareable, and less error-prone**.

---

## 11.1 Why Scripts Can Dramatically Improve Efficiency

### Your First Script

Create a file `hello.sh`:

```bash
#!/bin/bash
echo "Hello, computational physics!"
echo "Current time: $(date)"
echo "Current directory: $(pwd)"
```

How to run it:

```bash
chmod +x hello.sh
./hello.sh
# Or: bash hello.sh
```

`#!/bin/bash` is called a **shebang**, which tells the system which interpreter to use for executing this script.

---

## 11.2 Variables, Strings, and Arrays

```bash
# Assignment (no spaces around the equals sign!)
name="Zhang San"
n_steps=10000
temperature=2.27

echo "Steps: $n_steps, Temperature: ${temperature}"

# Command substitution
current_dir=$(pwd)
file_count=$(ls *.dat 2>/dev/null | wc -l)
```

:::caution Common Mistake
`name = "Zhang San"` will cause an error — there must be **no spaces** around the equals sign.
:::

### String Operations

```bash
filename="result_T2.27_L32.dat"
echo ${#filename}             # Length
echo ${filename/.dat/.csv}    # Replace extension
echo ${filename%.dat}         # Remove extension → result_T2.27_L32
echo ${filename#result_}      # Remove prefix → T2.27_L32.dat
```

### Arrays

```bash
temperatures=(1.0 1.5 2.0 2.27 2.5 3.0 3.5 4.0)

echo ${temperatures[0]}      # 1.0
echo ${temperatures[@]}      # All elements
echo ${#temperatures[@]}     # Length: 8

for T in "${temperatures[@]}"; do
    echo "Temperature: $T"
done
```

---

## 11.3 if / for / while

### Conditionals

```bash
file="output.dat"
if [ -f "$file" ]; then
    echo "$file exists, total $(wc -l < "$file") lines"
else
    echo "$file does not exist, please run the simulation first"
    exit 1
fi
```

Common test conditions: `-f file` (file exists), `-d dir` (directory exists), `-z "$str"` (string is empty), `"$a" -eq "$b"` (integers are equal), `"$a" -lt "$b"` (less than).

### for Loop

```bash
# Iterate over numbers
for i in $(seq 1 10); do echo "Run $i"; done

# C-style
for ((i=0; i<10; i++)); do echo "Index: $i"; done

# Iterate over files
for file in results/*.dat; do echo "Processing: $file"; done
```

### while Loop

```bash
# Wait for a task to finish
while [ ! -f "done.flag" ]; do
    echo "Waiting for computation to finish..."; sleep 10
done

# Read a file line by line
while IFS= read -r line; do
    echo "Parameter: $line"
done < parameters.txt
```

---

## 11.4 Functions

```bash
run_simulation() {
    local temperature=$1
    local lattice_size=$2
    local output_dir="results/T${temperature}_L${lattice_size}"

    mkdir -p "$output_dir"
    ./ising_mc --temperature "$temperature" \
               --size "$lattice_size" \
               --output "$output_dir/data.dat"

    if [ $? -eq 0 ]; then echo "  Done"; return 0
    else echo "  Failed"; return 1; fi
}

run_simulation 2.27 32
run_simulation 2.50 64
```

:::info About local
Variables declared with `local` inside a function are only visible within that function and will not pollute the global scope.
:::

---

## 11.5 Command-Line Arguments

```bash
#!/bin/bash
# usage: ./run.sh --temperature 2.27 --size 32

temperature=""
size=16  # Default value

while [[ $# -gt 0 ]]; do
    case $1 in
        --temperature|-T) temperature="$2"; shift 2 ;;
        --size|-L)        size="$2"; shift 2 ;;
        --help|-h)        echo "Usage: $0 --temperature T --size L"; exit 0 ;;
        *)                echo "Unknown argument: $1"; exit 1 ;;
    esac
done

if [ -z "$temperature" ]; then
    echo "Error: --temperature is required"; exit 1
fi
echo "Temperature: $temperature, Size: $size"
```

---

## 11.6 Batch Renaming and Batch Processing

### Batch Renaming

```bash
for file in output_*.txt; do
    new_name=$(echo "$file" | sed 's/output_/result_/' | sed 's/.txt/.dat/')
    mv "$file" "$new_name"
    echo "$file → $new_name"
done
```

---

## 11.7 Calling Python / Compiled Programs / Submitting Jobs

### Auto-Compile and Run

```bash
#!/bin/bash
set -e  # Stop on any command failure

echo "=== Compiling ==="
gfortran -O2 -o ising_mc ising_mc.f90

echo "=== Running ==="
./ising_mc < input.txt > output.dat

echo "=== Plotting ==="
python3 plot_results.py output.dat
```

### Parameter Sweep

```bash
#!/bin/bash
temperatures=(1.0 1.5 2.0 2.1 2.2 2.27 2.3 2.4 2.5 3.0 3.5 4.0)

for T in "${temperatures[@]}"; do
    output_dir="scan/T${T}"
    mkdir -p "$output_dir"

    cat > "$output_dir/input.txt" << EOF
temperature = $T
lattice_size = 32
mc_steps = 100000
EOF

    ./ising_mc < "$output_dir/input.txt" > "$output_dir/output.dat"
    echo "T=$T done"
done
```

### Batch HPC Job Submission

```bash
for T in 1.0 2.0 2.27 3.0 4.0; do
    sbatch --job-name="ising_T${T}" \
           --output="logs/ising_T${T}.out" \
           --export=TEMPERATURE="$T" \
           job_template.slurm
    echo "Submitted: ising_T${T}"
done
```

---

## 11.8 Introduction to Parallel Execution

```bash
# Method 1: & for background execution + wait
for T in 1.0 2.0 3.0 4.0; do
    ./ising_mc --temperature "$T" --output "result_T${T}.dat" &
done
wait
echo "All simulations complete"

# Method 2: GNU Parallel (install: brew install parallel / apt install parallel)
parallel -j 4 ./ising_mc --temperature {} --output result_T{}.dat \
    ::: 1.0 1.5 2.0 2.27 2.5 3.0 3.5 4.0
```

:::caution Parallel Execution Caveats
- Ensure parallel tasks **do not write to the same file**
- Be mindful of the number of CPU cores; do not launch too many parallel tasks
- On HPC clusters, use the scheduler (SLURM/PBS); do not run heavy computations in parallel on login nodes
:::

---

## 11.9 Debugging Bash Scripts

```bash
#!/bin/bash
set -e            # Exit immediately on error
set -u            # Error on undefined variables
set -x            # Print each command (enable when debugging)
set -o pipefail   # Fail the pipeline if any command fails

# Recommended combination
set -euo pipefail
```

Debugging methods:

```bash
bash -x my_script.sh          # Print each command during execution
echo "DEBUG: var=$var"         # Print key variables
```

| Problem | Cause | Solution |
|---------|-------|----------|
| `command not found` | Wrong path or not installed | `which command_name` |
| `unary operator expected` | Variable is empty | Quote the variable `"$var"` |
| `permission denied` | No execute permission | `chmod +x script.sh` |
| Unexpected behavior from spaces | Filename contains spaces | Quote the variable `"$file"` |

---

## 11.10 A Real-World Research Script Example

```bash
#!/bin/bash
#============================================================
# Ising Model Monte Carlo Simulation: Temperature Sweep Script
# Usage: ./sweep.sh [--recompile] [--parallel N]
#============================================================
set -euo pipefail

SRC="src/ising_mc.f90"
EXE="bin/ising_mc"
RESULT_DIR="results/$(date +%Y%m%d_%H%M%S)"
TEMPERATURES=(1.5 1.8 2.0 2.1 2.2 2.269 2.3 2.5 2.8 3.2)

# [1/4] Compile
mkdir -p bin
gfortran -O3 -march=native -o "$EXE" "$SRC"

# [2/4] Prepare directories and record parameters
mkdir -p "$RESULT_DIR"
echo "Date: $(date)" > "$RESULT_DIR/parameters.txt"
echo "Temperatures: ${TEMPERATURES[*]}" >> "$RESULT_DIR/parameters.txt"

# [3/4] Run simulations
for T in "${TEMPERATURES[@]}"; do
    ./"$EXE" --temperature "$T" --output "$RESULT_DIR/T${T}.dat"
    echo "  T=$T done"
done

# [4/4] Summarize results
summary="$RESULT_DIR/summary.dat"
echo "# T  E/N  M  Cv  Chi" > "$summary"
for T in "${TEMPERATURES[@]}"; do
    tail -1 "$RESULT_DIR/T${T}.dat" >> "$summary"
done
echo "Complete! Results: $RESULT_DIR"
```

:::tip Script Design Principles
1. **`set -euo pipefail`** — Stop immediately on errors
2. **Configurable parameters** — Control behavior via command-line arguments
3. **Record metadata** — Save run parameters to a file
4. **Timestamped directories** — Keep results from each run separate
5. **Automatic summarization** — Reduce manual data processing
:::

---

## FAQ

:::info FAQ
**Q: What is the difference between Bash and Shell?**
A: "Shell" is a generic term; Bash is the most commonly used shell. zsh (the default on macOS) is mostly syntax-compatible.

**Q: Should I use Bash or Python for complex logic?**
A: Use Python for scripts over 100 lines or involving complex data processing. Bash excels at invoking programs, file operations, and flow control.

**Q: How do I run Bash scripts on Windows?**
A: Use WSL or Git Bash. WSL provides a more complete solution.

**Q: Is `set -e` too strict?**
A: In most cases, `set -e` is a good practice. For commands that are allowed to fail, use `command || true`.
:::

---

## Summary

- Bash scripts are a fundamental tool for research automation
- Mastering **variables, loops, conditionals, and functions** covers most automation needs
- Parameter sweeps, batch processing, and automated compile-and-run are the most common use cases
- Use `set -euo pipefail` to make scripts more robust
- For complex logic exceeding 100 lines, consider switching to Python

---

## Exercises

1. **Basics**: Write a script that accepts a directory name as an argument and counts the number of `.py` and `.f90` files in it
2. **Batch Processing**: Extract the first line of every `.csv` file in `data/` into `headers.txt`
3. **Parameter Sweep**: Write a parameter sweep script for your computational program
4. **Automation**: Write a one-click "compile, run, plot" workflow script
5. **Parallel**: Implement a parallel parameter sweep using `&` + `wait` or GNU Parallel
6. **Debugging**: Intentionally introduce a bug and locate it using `set -x` and `set -u`
