---
sidebar_position: 15
sidebar_label: "15. Make 与 CMake"
---

# 第 15 章：Make 与 CMake

## 本章目标

- 理解为什么需要构建系统（build system）
- 掌握 Makefile 的基本语法：目标、依赖、规则
- 学会编写多文件 C 项目的 Makefile
- 理解 CMake 的核心思想和工作流程
- 能编写最小的 CMakeLists.txt
- 掌握 out-of-source build 和 Debug/Release 配置

## 动机

当你的项目只有一个 `.c` 文件时，一行 `gcc` 命令就够了。但真实的科研代码通常有几十甚至上百个源文件，手写编译命令既繁琐又容易出错。Make 和 CMake 帮你自动化这个过程——只重新编译修改过的文件，自动处理依赖关系。

---

## 15.1 为什么不能总手写编译命令

假设你有一个三文件项目：

```text
project/
├── main.c
├── physics.c
├── physics.h
├── utils.c
└── utils.h
```

手动编译：

```bash
gcc -c main.c -o main.o
gcc -c physics.c -o physics.o
gcc -c utils.c -o utils.o
gcc main.o physics.o utils.o -o simulation -lm
```

问题：
- 修改了 `physics.c`，你还是要重新编译所有文件吗？
- 添加新文件后，你记得更新命令吗？
- 编译选项（`-O2`、`-Wall`、`-lm`）散落各处，容易遗漏

:::info
Make 和 CMake 解决的核心问题：**只编译需要重新编译的文件，自动管理依赖关系**。
:::

---

## 15.2 Makefile 的基本思想

Makefile 描述了一系列**规则（rules）**，每条规则定义了：

```makefile
目标(target): 依赖(prerequisites)
	命令(recipe)     # 必须用 TAB 缩进！
```

:::caution
Makefile 中命令行**必须用 TAB 缩进**，不能用空格。这是最经典的 Makefile 坑之一。在 VS Code 中，确保你的编辑器对 Makefile 使用 TAB。
:::

最简单的例子：

```makefile
hello: hello.c
	gcc hello.c -o hello
```

```bash
make         # 构建默认目标（第一个目标）
make hello   # 构建指定目标
```

Make 的核心逻辑：
1. 检查目标文件是否存在
2. 如果存在，比较目标和依赖的修改时间
3. 如果依赖更新（更新时间晚于目标），重新执行命令
4. 否则跳过（"已是最新"）

---

## 15.3 目标、依赖、规则

### 多文件项目的 Makefile

```makefile
# 最终目标
simulation: main.o physics.o utils.o
	gcc main.o physics.o utils.o -o simulation -lm

# 各个 .o 文件的编译规则
main.o: main.c physics.h utils.h
	gcc -c main.c -o main.o

physics.o: physics.c physics.h
	gcc -c physics.c -o physics.o

utils.o: utils.c utils.h
	gcc -c utils.c -o utils.o

# 清理（伪目标）
clean:
	rm -f *.o simulation
```

### 依赖图

```text
simulation ← main.o    ← main.c, physics.h, utils.h
           ← physics.o ← physics.c, physics.h
           ← utils.o   ← utils.c, utils.h
```

### 伪目标 (Phony Targets)

```makefile
.PHONY: clean all

all: simulation

clean:
	rm -f *.o simulation
```

`.PHONY` 告诉 Make 这些目标不对应真实文件，每次都应该执行。

---

## 15.4 变量与常用模式

### 使用变量简化 Makefile

```makefile
# 编译器和选项
CC = gcc
CFLAGS = -Wall -Wextra -O2
LDFLAGS = -lm

# 源文件和目标
SRCS = main.c physics.c utils.c
OBJS = $(SRCS:.c=.o)
TARGET = simulation

# 默认目标
all: $(TARGET)

# 链接
$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $(TARGET) $(LDFLAGS)

# 模式规则：任意 .c -> .o
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

# 清理
.PHONY: clean
clean:
	rm -f $(OBJS) $(TARGET)
```

### 自动变量

| 变量 | 含义 |
|------|------|
| `$@` | 当前目标文件名 |
| `$<` | 第一个依赖文件名 |
| `$^` | 所有依赖文件名 |
| `$*` | 目标的"词干"（stem） |

:::tip
`wildcard` 和 `patsubst` 是 Make 的内置函数，可以自动收集源文件，避免手动列举。例如 `SRCS = $(wildcard src/*.c)`。
:::

---

## 15.5 CMake 的基本思想

CMake 不直接构建代码，而是**生成 Makefile**（或其他构建系统的配置文件）。

```text
CMakeLists.txt  →  cmake  →  Makefile  →  make  →  可执行文件
                          →  Ninja files → ninja → 可执行文件
                          →  VS .sln     → MSBuild → 可执行文件
```

**为什么用 CMake 而不是直接写 Makefile？**

| 对比 | Makefile | CMake |
|------|----------|-------|
| 跨平台 | 仅 Unix-like | Windows/macOS/Linux |
| 查找库 | 手动指定路径 | `find_package()` 自动查找 |
| IDE 集成 | 差 | VS Code、CLion 原生支持 |
| 学习曲线 | 低（小项目） | 中等 |
| 适用规模 | 小型项目 | 小型到大型 |

---

## 15.6 最小 CMake 项目

### 单文件项目

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

### 多文件项目

项目结构：
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

# 设置 C 标准
set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

# 编译选项
add_compile_options(-Wall -Wextra)

# 收集源文件
file(GLOB SOURCES "src/*.c")

# 创建可执行文件
add_executable(simulation ${SOURCES})

# 指定头文件目录
target_include_directories(simulation PRIVATE include)

# 链接数学库
target_link_libraries(simulation m)
```

---

## 15.7 编译 Debug / Release

### CMake 的构建类型

```bash
# Debug 构建（含调试信息，无优化）
cmake -DCMAKE_BUILD_TYPE=Debug ..
make

# Release 构建（无调试信息，最高优化）
cmake -DCMAKE_BUILD_TYPE=Release ..
make

# RelWithDebInfo（优化 + 调试信息，推荐日常开发）
cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo ..
make
```

| 构建类型 | 编译选项 | 用途 |
|----------|----------|------|
| `Debug` | `-g -O0` | 调试，断点可用 |
| `Release` | `-O3 -DNDEBUG` | 最终运行，最快速度 |
| `RelWithDebInfo` | `-O2 -g` | 性能分析 |
| `MinSizeRel` | `-Os` | 最小体积 |

### Out-of-Source Build

:::caution
**永远不要在源代码目录中直接运行 cmake**。使用 out-of-source build，保持源代码目录干净。
:::

```bash
# 推荐的工作流程
mkdir -p build/debug build/release

# Debug 构建
cd build/debug
cmake -DCMAKE_BUILD_TYPE=Debug ../..
make

# Release 构建
cd build/release
cmake -DCMAKE_BUILD_TYPE=Release ../..
make
```

---

## 15.8 与 VS Code 配合

### 安装扩展

1. **CMake Tools** — 提供 CMake 集成
2. **C/C++** — 提供 IntelliSense 和调试

### 使用 CMake Tools

1. 打开包含 `CMakeLists.txt` 的项目
2. VS Code 底栏会显示 CMake 工具栏
3. 选择 **Kit**（编译器）→ 选择 GCC
4. 选择 **Build Type** → Debug / Release
5. 点击 **Build** 按钮或按 `F7`
6. 点击 **Run** 按钮或按 `Shift+F5`

---

## 15.9 常见编译错误

### 错误速查表

| 错误信息 | 原因 | 解决方法 |
|----------|------|----------|
| `undefined reference to 'func'` | 链接时找不到函数 | 检查是否编译了所有源文件，是否链接了所需库 |
| `No such file or directory` | 找不到头文件 | 检查 `#include` 路径和 `-I` 选项 |
| `multiple definition of 'var'` | 变量重复定义 | 在头文件中用 `extern`，只在一个 `.c` 中定义 |
| `implicit declaration of function` | 函数未声明 | 添加头文件 `#include` 或函数声明 |
| `Makefile:5: *** missing separator` | 用了空格而非 TAB | 将缩进改为 TAB |
| `collect2: error: ld returned 1` | 链接错误 | 看前面的具体错误信息 |

### 调试技巧

```bash
# 查看 Make 的执行过程（不实际执行）
make -n

# 查看详细输出
make VERBOSE=1

# CMake 查看实际编译命令
cmake --build build -- VERBOSE=1

# 生成 compile_commands.json（供编辑器使用）
cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON ..
```

:::tip
当你遇到链接错误时，问自己两个问题：
1. 函数的**定义**在哪个 `.c` 文件里？那个文件编译了吗？
2. 函数在**外部库**里吗？链接了那个库吗（如 `-lm`、`-lfftw3`）？
:::

---

## 常见问题

**Q: 小项目需要用 CMake 吗？**
A: 如果只有 1-3 个文件，一个简单的 Makefile 就够了。当项目超过 5 个文件或需要跨平台时，考虑 CMake。

**Q: Make 和 CMake 能混用吗？**
A: 不建议。CMake 会生成自己的 Makefile，如果你手动修改生成的 Makefile，下次 `cmake` 会覆盖你的修改。

**Q: 为什么 `make clean` 后还有文件残留？**
A: 检查 `clean` 目标是否覆盖了所有生成文件。使用 out-of-source build 时，直接删除 `build/` 目录最干净。

**Q: CMake 找不到我的库怎么办？**
A: 尝试设置 `CMAKE_PREFIX_PATH`：
```bash
cmake -DCMAKE_PREFIX_PATH=/path/to/library ..
```

---

## 小结

- Make 通过目标-依赖-规则的模式自动化编译，只重新编译修改过的文件
- Makefile 中命令行必须用 **TAB** 缩进
- 使用变量 (`CC`, `CFLAGS`) 和模式规则 (`%.o: %.c`) 编写可维护的 Makefile
- CMake 是跨平台的构建系统生成器，适合中大型项目
- 始终使用 **out-of-source build**（`mkdir build && cd build && cmake ..`）
- Debug 构建用于调试，Release 构建用于最终运行
- VS Code + CMake Tools 提供良好的集成开发体验

---

## 练习

1. **基础 Make**：为一个两文件 C 项目（`main.c` + `math_utils.c`）手写 Makefile，验证只修改一个文件时只重新编译该文件
2. **变量与模式**：用变量和模式规则重构练习 1 的 Makefile，使其能自动处理新增源文件
3. **CMake 入门**：将练习 1 改用 CMake，分别进行 Debug 和 Release 构建
4. **Out-of-Source**：设置 out-of-source build，确保源代码目录保持干净
5. **实战**：找一个使用 CMake 的开源物理项目（如 LAMMPS 或 deal.II），阅读其 `CMakeLists.txt`，理解其构建结构
