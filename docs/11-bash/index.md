---
sidebar_position: 11
sidebar_label: "11. Bash 脚本与自动化"
---

# 第 11 章：Bash 脚本与自动化

**Bash Scripting and Automation**

---

## 本章目标

读完本章后，你应该能够：

- 编写包含变量、条件判断、循环和函数的 Bash 脚本
- 处理命令行参数
- 用脚本实现批量重命名、参数扫描、自动编译等任务
- 理解并行执行的基本方法
- 调试 Bash 脚本

---

## 动机

科研中有大量重复性工作：用 20 组不同参数跑同一个程序、把 100 个输出文件重命名、每天编译代码后运行测试。**Bash 脚本可以把这些工作自动化**。如果一件事你要做两次以上，就值得写成脚本——脚本**可重复、可记录、可分享、少犯错**。

---

## 11.1 为什么脚本能显著提升效率

### 第一个脚本

创建文件 `hello.sh`：

```bash
#!/bin/bash
echo "Hello, computational physics!"
echo "当前时间：$(date)"
echo "当前目录：$(pwd)"
```

运行方式：

```bash
chmod +x hello.sh
./hello.sh
# 或者：bash hello.sh
```

`#!/bin/bash` 叫做 **shebang**，告诉系统用哪个解释器来执行这个脚本。

---

## 11.2 变量、字符串、数组

```bash
# 赋值（等号两边不能有空格！）
name="Zhang San"
n_steps=10000
temperature=2.27

echo "步数：$n_steps，温度：${temperature}"

# 命令替换
current_dir=$(pwd)
file_count=$(ls *.dat 2>/dev/null | wc -l)
```

:::caution 常见错误
`name = "Zhang San"` 会报错——等号两边**不能有空格**。
:::

### 字符串操作

```bash
filename="result_T2.27_L32.dat"
echo ${#filename}             # 长度
echo ${filename/.dat/.csv}    # 替换后缀
echo ${filename%.dat}         # 删除后缀 → result_T2.27_L32
echo ${filename#result_}      # 删除前缀 → T2.27_L32.dat
```

### 数组

```bash
temperatures=(1.0 1.5 2.0 2.27 2.5 3.0 3.5 4.0)

echo ${temperatures[0]}      # 1.0
echo ${temperatures[@]}      # 所有元素
echo ${#temperatures[@]}     # 长度：8

for T in "${temperatures[@]}"; do
    echo "Temperature: $T"
done
```

---

## 11.3 if / for / while

### 条件判断

```bash
file="output.dat"
if [ -f "$file" ]; then
    echo "$file 存在，共 $(wc -l < "$file") 行"
else
    echo "$file 不存在，请先运行模拟"
    exit 1
fi
```

常用测试条件：`-f file`（文件存在）、`-d dir`（目录存在）、`-z "$str"`（字符串为空）、`"$a" -eq "$b"`（整数相等）、`"$a" -lt "$b"`（小于）。

### for 循环

```bash
# 遍历数值
for i in $(seq 1 10); do echo "Run $i"; done

# C 风格
for ((i=0; i<10; i++)); do echo "Index: $i"; done

# 遍历文件
for file in results/*.dat; do echo "处理：$file"; done
```

### while 循环

```bash
# 等待任务完成
while [ ! -f "done.flag" ]; do
    echo "等待计算完成..."; sleep 10
done

# 逐行读取文件
while IFS= read -r line; do
    echo "参数：$line"
done < parameters.txt
```

---

## 11.4 函数

```bash
run_simulation() {
    local temperature=$1
    local lattice_size=$2
    local output_dir="results/T${temperature}_L${lattice_size}"

    mkdir -p "$output_dir"
    ./ising_mc --temperature "$temperature" \
               --size "$lattice_size" \
               --output "$output_dir/data.dat"

    if [ $? -eq 0 ]; then echo "  完成"; return 0
    else echo "  失败"; return 1; fi
}

run_simulation 2.27 32
run_simulation 2.50 64
```

:::info 关于 local
在函数中用 `local` 声明的变量只在函数内部可见，不会污染全局变量。
:::

---

## 11.5 命令行参数

```bash
#!/bin/bash
# usage: ./run.sh --temperature 2.27 --size 32

temperature=""
size=16  # 默认值

while [[ $# -gt 0 ]]; do
    case $1 in
        --temperature|-T) temperature="$2"; shift 2 ;;
        --size|-L)        size="$2"; shift 2 ;;
        --help|-h)        echo "Usage: $0 --temperature T --size L"; exit 0 ;;
        *)                echo "未知参数：$1"; exit 1 ;;
    esac
done

if [ -z "$temperature" ]; then
    echo "错误：必须指定 --temperature"; exit 1
fi
echo "温度：$temperature，尺寸：$size"
```

---

## 11.6 批量重命名与批量处理

### 批量重命名

```bash
for file in output_*.txt; do
    new_name=$(echo "$file" | sed 's/output_/result_/' | sed 's/.txt/.dat/')
    mv "$file" "$new_name"
    echo "$file → $new_name"
done
```

---

## 11.7 调用 Python / 编译程序 / 提交任务

### 自动编译并运行

```bash
#!/bin/bash
set -e  # 任何命令失败就停止

echo "=== 编译 ==="
gfortran -O2 -o ising_mc ising_mc.f90

echo "=== 运行 ==="
./ising_mc < input.txt > output.dat

echo "=== 画图 ==="
python3 plot_results.py output.dat
```

### 参数扫描

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
    echo "T=$T 完成"
done
```

### 批量提交 HPC 任务

```bash
for T in 1.0 2.0 2.27 3.0 4.0; do
    sbatch --job-name="ising_T${T}" \
           --output="logs/ising_T${T}.out" \
           --export=TEMPERATURE="$T" \
           job_template.slurm
    echo "已提交：ising_T${T}"
done
```

---

## 11.8 并行执行简介

```bash
# 方式一：& 后台运行 + wait
for T in 1.0 2.0 3.0 4.0; do
    ./ising_mc --temperature "$T" --output "result_T${T}.dat" &
done
wait
echo "所有模拟完成"

# 方式二：GNU Parallel（需安装：brew install parallel / apt install parallel）
parallel -j 4 ./ising_mc --temperature {} --output result_T{}.dat \
    ::: 1.0 1.5 2.0 2.27 2.5 3.0 3.5 4.0
```

:::caution 并行注意事项
- 确保并行任务**不会写入同一个文件**
- 注意 CPU 核心数，不要启动过多并行任务
- 在 HPC 集群上请使用调度器（SLURM/PBS），不要在登录节点上并行跑重计算
:::

---

## 11.9 调试 bash 脚本

```bash
#!/bin/bash
set -e            # 遇到错误立即退出
set -u            # 使用未定义变量时报错
set -x            # 打印每条命令（调试时开启）
set -o pipefail   # 管道中任何命令失败则整体失败

# 推荐组合
set -euo pipefail
```

调试方式：

```bash
bash -x my_script.sh          # 运行时打印每条命令
echo "DEBUG: var=$var"         # 打印关键变量
```

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `command not found` | 路径错误或未安装 | `which command_name` |
| `unary operator expected` | 变量为空 | 变量加引号 `"$var"` |
| `permission denied` | 无执行权限 | `chmod +x script.sh` |
| 空格导致意外行为 | 文件名含空格 | 变量加引号 `"$file"` |

---

## 11.10 一个真实科研脚本案例

```bash
#!/bin/bash
#============================================================
# Ising 模型蒙特卡洛模拟：温度扫描自动化脚本
# 用法：./sweep.sh [--recompile] [--parallel N]
#============================================================
set -euo pipefail

SRC="src/ising_mc.f90"
EXE="bin/ising_mc"
RESULT_DIR="results/$(date +%Y%m%d_%H%M%S)"
TEMPERATURES=(1.5 1.8 2.0 2.1 2.2 2.269 2.3 2.5 2.8 3.2)

# [1/4] 编译
mkdir -p bin
gfortran -O3 -march=native -o "$EXE" "$SRC"

# [2/4] 准备目录，记录参数
mkdir -p "$RESULT_DIR"
echo "日期：$(date)" > "$RESULT_DIR/parameters.txt"
echo "温度：${TEMPERATURES[*]}" >> "$RESULT_DIR/parameters.txt"

# [3/4] 运行模拟
for T in "${TEMPERATURES[@]}"; do
    ./"$EXE" --temperature "$T" --output "$RESULT_DIR/T${T}.dat"
    echo "  T=$T 完成"
done

# [4/4] 汇总结果
summary="$RESULT_DIR/summary.dat"
echo "# T  E/N  M  Cv  Chi" > "$summary"
for T in "${TEMPERATURES[@]}"; do
    tail -1 "$RESULT_DIR/T${T}.dat" >> "$summary"
done
echo "完成！结果：$RESULT_DIR"
```

:::tip 脚本设计原则
1. **`set -euo pipefail`** — 出错立即停止
2. **参数可配置** — 通过命令行参数控制行为
3. **记录元信息** — 将运行参数保存到文件
4. **时间戳目录** — 每次运行的结果互不干扰
5. **自动汇总** — 减少手动数据处理
:::

---

## 常见问题

:::info FAQ
**Q: Bash 和 Shell 有什么区别？**
A: Shell 是统称，Bash 是最常用的一种。zsh（macOS 默认）语法大部分兼容。

**Q: 写复杂逻辑用 Bash 还是 Python？**
A: 超过 100 行或涉及复杂数据处理用 Python。Bash 擅长调用程序、文件操作、流程控制。

**Q: Windows 上怎么运行 Bash 脚本？**
A: 使用 WSL 或 Git Bash。WSL 是更完整的方案。

**Q: `set -e` 会不会太严格？**
A: 大多数情况下 `set -e` 是好的。某些命令允许失败时可以用 `command || true`。
:::

---

## 小结

- Bash 脚本是科研自动化的基础工具
- 掌握**变量、循环、条件、函数**就能解决大多数自动化需求
- 参数扫描、批量处理、自动编译运行是最常见的应用场景
- 用 `set -euo pipefail` 让脚本更健壮
- 超过 100 行的复杂逻辑考虑改用 Python

---

## 练习

1. **基础**：写一个脚本，接受目录名参数，统计其中 `.py` 和 `.f90` 文件数量
2. **批量处理**：将 `data/` 下所有 `.csv` 文件的第一行提取到 `headers.txt`
3. **参数扫描**：为你的计算程序写一个参数扫描脚本
4. **自动化**：写一个"编译 → 运行 → 画图"一键流程脚本
5. **并行**：用 `&` + `wait` 或 GNU Parallel 实现并行参数扫描
6. **调试**：故意引入一个 bug，用 `set -x` 和 `set -u` 定位它
