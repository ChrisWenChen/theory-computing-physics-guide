---
sidebar_position: 15
sidebar_label: "15. Make & CMake"
---

# Chapter 15: Make and CMake

## Chapter Goals

- Understand why build systems are needed
- Master the basic Makefile syntax: targets, prerequisites, and recipes
- Learn to write Makefiles for multi-file C projects
- Understand the core concepts and workflow of CMake
- Be able to write a minimal CMakeLists.txt
- Master out-of-source builds and Debug/Release configurations

## Motivation

When your project has only one `.c` file, a single `gcc` command is enough. But real research code usually has dozens or even hundreds of source files, and manually writing compile commands is both tedious and error-prone. Make and CMake automate this process — only recompiling modified files and automatically handling dependencies.

---

## 15.1 Why You Can't Always Write Compile Commands by Hand

Suppose you have a three-file project:

```text
project/
├── main.c
├── physics.c
├── physics.h
├── utils.c
└── utils.h
```

Manual compilation:

```bash
gcc -c main.c -o main.o
gcc -c physics.c -o physics.o
gcc -c utils.c -o utils.o
gcc main.o physics.o utils.o -o simulation -lm
```

Problems:
- If you modified `physics.c`, do you still need to recompile all files?
- After adding a new file, do you remember to update the commands?
- Compilation options (`-O2`, `-Wall`, `-lm`) are scattered everywhere, easy to miss

:::info
The core problem that Make and CMake solve: **only compile files that need recompilation, and automatically manage dependencies**.
:::

---

## 15.2 The Basic Idea of Makefile

A Makefile describes a series of **rules**, each defining:

```makefile
target: prerequisites
	recipe     # Must be indented with TAB!
```

:::caution
Recipe lines in Makefiles **must be indented with TAB**, not spaces. This is one of the most classic Makefile pitfalls. In VS Code, make sure your editor uses TAB for Makefiles.
:::

The simplest example:

```makefile
hello: hello.c
	gcc hello.c -o hello
```

```bash
make         # Build the default target (first target)
make hello   # Build a specific target
```

Make's core logic:
1. Check if the target file exists
2. If it exists, compare modification times of target and prerequisites
3. If prerequisites are newer (modification time later than target), re-execute the recipe
4. Otherwise skip ("already up to date")

---

## 15.3 Targets, Prerequisites, and Rules

### Makefile for a Multi-File Project

```makefile
# Final target
simulation: main.o physics.o utils.o
	gcc main.o physics.o utils.o -o simulation -lm

# Compilation rules for each .o file
main.o: main.c physics.h utils.h
	gcc -c main.c -o main.o

physics.o: physics.c physics.h
	gcc -c physics.c -o physics.o

utils.o: utils.c utils.h
	gcc -c utils.c -o utils.o

# Clean (phony target)
clean:
	rm -f *.o simulation
```

### Dependency Graph

```text
simulation ← main.o    ← main.c, physics.h, utils.h
           ← physics.o ← physics.c, physics.h
           ← utils.o   ← utils.c, utils.h
```

### Phony Targets

```makefile
.PHONY: clean all

all: simulation

clean:
	rm -f *.o simulation
```

`.PHONY` tells Make that these targets do not correspond to real files and should always be executed.

---

## 15.4 Variables and Common Patterns

### Simplifying Makefiles with Variables

```makefile
# Compiler and options
CC = gcc
CFLAGS = -Wall -Wextra -O2
LDFLAGS = -lm

# Source files and targets
SRCS = main.c physics.c utils.c
OBJS = $(SRCS:.c=.o)
TARGET = simulation

# Default target
all: $(TARGET)

# Linking
$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $(TARGET) $(LDFLAGS)

# Pattern rule: any .c -> .o
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

# Clean
.PHONY: clean
clean:
	rm -f $(OBJS) $(TARGET)
```

### Automatic Variables

| Variable | Meaning |
|----------|---------|
| `$@` | Current target filename |
| `$<` | First prerequisite filename |
| `$^` | All prerequisite filenames |
| `$*` | Target's "stem" |

:::tip
`wildcard` and `patsubst` are Make's built-in functions that can automatically collect source files, avoiding manual listing. For example, `SRCS = $(wildcard src/*.c)`.
:::

---

## 15.5 The Basic Idea of CMake

CMake does not build code directly; instead, it **generates Makefiles** (or configuration files for other build systems).

```text
CMakeLists.txt  →  cmake  →  Makefile  →  make  →  Executable
                          →  Ninja files → ninja → Executable
                          →  VS .sln     → MSBuild → Executable
```

**Why use CMake instead of writing Makefiles directly?**

| Comparison | Makefile | CMake |
|------------|----------|-------|
| Cross-platform | Unix-like only | Windows/macOS/Linux |
| Finding libraries | Manually specify paths | `find_package()` auto-discovery |
| IDE integration | Poor | VS Code, CLion native support |
| Learning curve | Low (small projects) | Moderate |
| Suitable scale | Small projects | Small to large |

---

## 15.6 Minimal CMake Project

### Single-File Project

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(hello LANGUAGES C)

add_executable(hello hello.c)
```

```bash
mkdir build && cd build
cmake ..
make
./hello
```

### Multi-File Project

Project structure:
```text
project/
├── CMakeLists.txt
├── src/
│   ├── main.c
│   ├── physics.c
│   └── utils.c
└── include/
    ├── physics.h
    └── utils.h
```

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(simulation LANGUAGES C)

# Set C standard
set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

# Compilation options
add_compile_options(-Wall -Wextra)

# Collect source files
file(GLOB SOURCES "src/*.c")

# Create executable
add_executable(simulation ${SOURCES})

# Specify header file directory
target_include_directories(simulation PRIVATE include)

# Link math library
target_link_libraries(simulation m)
```

---

## 15.7 Debug / Release Builds

### CMake Build Types

```bash
# Debug build (with debug info, no optimization)
cmake -DCMAKE_BUILD_TYPE=Debug ..
make

# Release build (no debug info, maximum optimization)
cmake -DCMAKE_BUILD_TYPE=Release ..
make

# RelWithDebInfo (optimization + debug info, recommended for daily development)
cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo ..
make
```

| Build Type | Compiler Flags | Use Case |
|------------|---------------|----------|
| `Debug` | `-g -O0` | Debugging, breakpoints available |
| `Release` | `-O3 -DNDEBUG` | Final runs, maximum speed |
| `RelWithDebInfo` | `-O2 -g` | Performance profiling |
| `MinSizeRel` | `-Os` | Minimum binary size |

### Out-of-Source Build

:::caution
**Never run cmake directly in the source code directory.** Use out-of-source builds to keep the source directory clean.
:::

```bash
# Recommended workflow
mkdir -p build/debug build/release

# Debug build
cd build/debug
cmake -DCMAKE_BUILD_TYPE=Debug ../..
make

# Release build
cd build/release
cmake -DCMAKE_BUILD_TYPE=Release ../..
make
```

---

## 15.8 Working with VS Code

### Install Extensions

1. **CMake Tools** — Provides CMake integration
2. **C/C++** — Provides IntelliSense and debugging

### Using CMake Tools

1. Open a project containing a `CMakeLists.txt`
2. VS Code's bottom bar will show the CMake toolbar
3. Select a **Kit** (compiler) -> choose GCC
4. Select **Build Type** -> Debug / Release
5. Click the **Build** button or press `F7`
6. Click the **Run** button or press `Shift+F5`

---

## 15.9 Common Compilation Errors

### Error Quick Reference

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `undefined reference to 'func'` | Linker can't find function | Check if all source files are compiled, if required libraries are linked |
| `No such file or directory` | Can't find header file | Check `#include` paths and `-I` options |
| `multiple definition of 'var'` | Variable defined multiple times | Use `extern` in headers, define in only one `.c` file |
| `implicit declaration of function` | Function not declared | Add `#include` for the header file or add a function declaration |
| `Makefile:5: *** missing separator` | Used spaces instead of TAB | Change indentation to TAB |
| `collect2: error: ld returned 1` | Linking error | Check the specific error message above |

### Debugging Tips

```bash
# View Make's execution plan (dry run)
make -n

# View verbose output
make VERBOSE=1

# CMake: view actual compilation commands
cmake --build build -- VERBOSE=1

# Generate compile_commands.json (for editor use)
cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON ..
```

:::tip
When you encounter linking errors, ask yourself two questions:
1. Which `.c` file contains the function's **definition**? Was that file compiled?
2. Is the function in an **external library**? Did you link that library (e.g., `-lm`, `-lfftw3`)?
:::

---

## FAQ

**Q: Do small projects need CMake?**
A: If you only have 1-3 files, a simple Makefile is sufficient. When the project exceeds 5 files or needs to be cross-platform, consider CMake.

**Q: Can Make and CMake be used together?**
A: Not recommended. CMake generates its own Makefile, and if you manually modify the generated Makefile, the next `cmake` run will overwrite your changes.

**Q: Why are there leftover files after `make clean`?**
A: Check whether the `clean` target covers all generated files. When using out-of-source builds, simply deleting the `build/` directory is the cleanest approach.

**Q: What if CMake can't find my library?**
A: Try setting `CMAKE_PREFIX_PATH`:
```bash
cmake -DCMAKE_PREFIX_PATH=/path/to/library ..
```

---

## Summary

- Make automates compilation through the target-prerequisite-recipe pattern, only recompiling modified files
- Recipe lines in Makefiles must use **TAB** indentation
- Use variables (`CC`, `CFLAGS`) and pattern rules (`%.o: %.c`) to write maintainable Makefiles
- CMake is a cross-platform build system generator suitable for medium to large projects
- Always use **out-of-source builds** (`mkdir build && cd build && cmake ..`)
- Debug builds are for debugging; Release builds are for final runs
- VS Code + CMake Tools provides a good integrated development experience

---

## Exercises

1. **Basic Make**: Write a Makefile by hand for a two-file C project (`main.c` + `math_utils.c`), verify that modifying only one file recompiles only that file
2. **Variables and patterns**: Refactor Exercise 1's Makefile using variables and pattern rules so it can automatically handle newly added source files
3. **CMake intro**: Convert Exercise 1 to CMake, perform both Debug and Release builds
4. **Out-of-Source**: Set up an out-of-source build, ensure the source directory stays clean
5. **Real-world**: Find an open-source physics project that uses CMake (e.g., LAMMPS or deal.II), read its `CMakeLists.txt`, and understand its build structure
