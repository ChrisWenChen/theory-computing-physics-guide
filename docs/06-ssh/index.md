---
sidebar_position: 6
sidebar_label: "6. SSH 与远程服务器"
---

# 第 6 章：SSH 与远程服务器

> 科研计算离不开远程服务器，而 SSH 是你连接它们的钥匙。

## 本章目标

- 理解 SSH 的基本原理和工作方式
- 掌握密码登录与密钥登录
- 学会生成和配置 SSH key
- 配置 `~/.ssh/config` 简化登录
- 使用 scp 和 rsync 传输文件
- 排查常见 SSH 连接错误

## 动机

在计算物理中，你几乎一定会用到远程服务器：

- 实验室/课题组的工作站
- 大学的 HPC（高性能计算）集群
- 云服务器（阿里云、AWS 等）
- GitHub（推送代码时也用 SSH）

所有这些场景都通过 **SSH（Secure Shell）** 协议连接。学会 SSH 是科研计算的必备技能。

---

## 6.1 为什么科研中一定会用 SSH

| 场景 | 为什么需要 SSH |
|------|--------------|
| 课题组工作站 | 从自己的笔记本远程连接到实验室的高性能机器 |
| HPC 集群 | 提交大规模计算任务，如分子动力学、第一性原理计算 |
| GitHub | 用 SSH key 免密码推送代码 |
| 云服务器 | 管理部署在远端的服务和计算任务 |

:::info
即使你现在只在自己的电脑上写代码，学会 SSH 也是早晚的事。越早学，越早受益。
:::

---

## 6.2 SSH 的基本原理

SSH 是一种加密的网络协议，用于在不安全的网络上安全地远程登录和执行命令。

```
你的电脑（client）  ──── 加密通道 ────  远程服务器（server）
    本地终端          ←→ SSH 协议 ←→      远程 shell
```

SSH 的安全性基于**非对称加密**：

- **公钥（public key）**：放在服务器上，任何人都可以看到
- **私钥（private key）**：保存在你的电脑上，**绝对不能泄露**

类比：公钥是锁，私钥是钥匙。你把锁（公钥）给服务器管理员安装在门上，只有你手里的钥匙（私钥）能打开。

---

## 6.3 用户名、主机、端口

SSH 连接的基本命令格式：

```bash
ssh username@hostname
ssh username@hostname -p port
```

- **username**：你在远程服务器上的用户名
- **hostname**：服务器地址（IP 或域名）
- **port**：SSH 端口，默认为 22

### 示例

```bash
# 连接到 IP 地址为 192.168.1.100 的服务器
ssh zhangsan@192.168.1.100

# 连接到域名为 hpc.university.edu 的集群
ssh zhangsan@hpc.university.edu

# 使用非默认端口
ssh zhangsan@server.example.com -p 2222
```

首次连接时会看到如下提示：

```
The authenticity of host '192.168.1.100 (192.168.1.100)' can't be established.
ED25519 key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

输入 `yes` 即可。这表示你信任这台服务器，之后它的指纹会被记录在 `~/.ssh/known_hosts` 文件中。

---

## 6.4 密码登录与密钥登录

### 密码登录

最简单的方式，但每次都要输入密码：

```bash
ssh zhangsan@192.168.1.100
# 输入密码...
```

### 密钥登录（推荐）

配置好后，无需输入密码，更安全也更方便：

```bash
ssh zhangsan@192.168.1.100
# 直接登录，无需密码！
```

| 对比 | 密码登录 | 密钥登录 |
|------|---------|---------|
| 方便性 | 每次输密码 | 免密码 |
| 安全性 | 可能被暴力破解 | 几乎不可能破解 |
| 适用场景 | 初次配置 | 日常使用 |
| 自动化 | 脚本中不方便使用 | 完美适配脚本和 CI/CD |

:::tip
强烈建议配置密钥登录。密码登录仅在初始配置时使用。
:::

---

## 6.5 生成 SSH key

### 第一步：生成密钥对

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

参数说明：
- `-t ed25519`：使用 Ed25519 算法（推荐，比 RSA 更短更安全）
- `-C "your_email@example.com"`：注释，通常填邮箱，方便识别

执行后会有如下交互：

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/zhangsan/.ssh/id_ed25519):
```

直接按 Enter 使用默认路径。

```
Enter passphrase (empty for no passphrase):
```

可以设置密码（passphrase）保护私钥，也可以直接按 Enter 留空。

:::caution passphrase 的取舍
- 设置 passphrase：更安全，但每次使用需要输入（可以用 `ssh-agent` 缓存）
- 不设置 passphrase：更方便，但如果私钥文件泄露，他人可以直接使用
- 建议：在个人电脑上可以不设置；在共享机器上建议设置
:::

### 第二步：查看生成的密钥

```bash
ls -la ~/.ssh/
# id_ed25519       ← 私钥（绝对不能分享！）
# id_ed25519.pub   ← 公钥（可以放心分享）
```

查看公钥内容：

```bash
cat ~/.ssh/id_ed25519.pub
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIxxxxxxxxxxxxxxxxx your_email@example.com
```

### 如果需要 RSA 密钥

某些老旧系统可能只支持 RSA：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

---

## 6.6 配置 ~/.ssh/config

`~/.ssh/config` 是 SSH 的配置文件，可以为不同的服务器设置别名和默认参数，大幅简化登录命令。

### 创建配置文件

```bash
touch ~/.ssh/config
chmod 600 ~/.ssh/config
```

### 配置示例

```ssh-config
# 实验室工作站
Host lab
    HostName 192.168.1.100
    User zhangsan
    Port 22
    IdentityFile ~/.ssh/id_ed25519

# HPC 集群
Host hpc
    HostName hpc.university.edu
    User zhangsan_2024
    Port 22
    IdentityFile ~/.ssh/id_ed25519

# 需要跳板机的内网服务器
Host internal
    HostName 10.0.0.50
    User zhangsan
    ProxyJump lab

# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519

# 所有主机的通用设置
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes
```

### 使用别名登录

配置好后，原来的长命令：

```bash
ssh zhangsan@192.168.1.100
```

变成了：

```bash
ssh lab
```

:::tip ServerAliveInterval
`ServerAliveInterval 60` 表示每 60 秒发送一个心跳包，防止 SSH 连接因空闲而被断开。这在网络不稳定或有防火墙超时的环境中非常有用。
:::

---

## 6.7 ssh-copy-id 与手动配置公钥

### 方法一：ssh-copy-id（推荐）

```bash
ssh-copy-id zhangsan@192.168.1.100
# 输入密码（最后一次需要输密码）
# 之后就可以免密码登录了
```

`ssh-copy-id` 会自动把你的公钥追加到远程服务器的 `~/.ssh/authorized_keys` 文件中。

### 方法二：手动复制

如果服务器上没有 `ssh-copy-id` 命令，可以手动操作：

```bash
# 1. 复制公钥内容
cat ~/.ssh/id_ed25519.pub

# 2. 登录远程服务器
ssh zhangsan@192.168.1.100

# 3. 在远程服务器上执行
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "粘贴你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

:::caution 权限很重要
SSH 对文件权限有严格要求。如果权限不正确，密钥登录会静默失败：

```bash
chmod 700 ~/.ssh                    # drwx------
chmod 600 ~/.ssh/authorized_keys    # -rw-------
chmod 600 ~/.ssh/id_ed25519         # -rw-------（私钥）
chmod 644 ~/.ssh/id_ed25519.pub     # -rw-r--r--（公钥）
chmod 600 ~/.ssh/config             # -rw-------
```
:::

### 验证免密登录

```bash
ssh lab    # 应该直接登录，无需输入密码
```

### 配置 GitHub SSH

```bash
# 1. 复制公钥
cat ~/.ssh/id_ed25519.pub
# （或在 macOS 上：pbcopy < ~/.ssh/id_ed25519.pub）

# 2. 打开 GitHub → Settings → SSH and GPG keys → New SSH key
# 3. 粘贴公钥内容

# 4. 测试连接
ssh -T git@github.com
# Hi zhangsan! You've successfully authenticated...
```

---

## 6.8 scp / rsync 传文件

### scp（Secure Copy）

scp 使用 SSH 协议传输文件，语法类似 `cp`：

```bash
# 上传文件到远程服务器
scp local_file.txt lab:/home/zhangsan/

# 上传目录（递归）
scp -r local_dir/ lab:/home/zhangsan/

# 从远程下载文件
scp lab:/home/zhangsan/result.dat ./

# 从远程下载目录
scp -r lab:/home/zhangsan/results/ ./

# 使用非默认端口
scp -P 2222 file.txt user@host:/path/
```

:::info
注意 scp 的端口参数是大写 `-P`，而 ssh 是小写 `-p`。
:::

### rsync（推荐）

rsync 比 scp 更强大，支持**增量同步**——只传输有变化的文件，速度更快：

```bash
# 上传目录到远程（增量同步）
rsync -avz local_dir/ lab:/home/zhangsan/remote_dir/

# 从远程下载目录
rsync -avz lab:/home/zhangsan/remote_dir/ ./local_dir/

# 显示传输进度
rsync -avz --progress local_dir/ lab:/remote_dir/

# 排除某些文件
rsync -avz --exclude='*.o' --exclude='__pycache__' local_dir/ lab:/remote_dir/

# 删除远程端多余的文件（镜像同步）
rsync -avz --delete local_dir/ lab:/remote_dir/
```

参数说明：
- `-a`：archive 模式，保留权限、时间戳等
- `-v`：verbose，显示详细信息
- `-z`：压缩传输

### scp vs rsync

| 特性 | scp | rsync |
|------|-----|-------|
| 增量同步 | 不支持 | 支持 |
| 断点续传 | 不支持 | 支持（`--partial`） |
| 排除文件 | 不支持 | 支持（`--exclude`） |
| 速度（大量小文件） | 较慢 | 较快 |
| 简单文件传输 | 够用 | 也够用 |

:::tip
日常传文件用 rsync 代替 scp。尤其是传大目录时，rsync 的增量同步会节省大量时间。
:::

---

## 6.9 常见报错：Permission denied, Host key verification failed

### Permission denied (publickey)

```
zhangsan@192.168.1.100: Permission denied (publickey).
```

**可能原因与解决方法：**

1. **公钥没有添加到服务器**
   ```bash
   ssh-copy-id zhangsan@192.168.1.100
   ```

2. **本地私钥权限不对**
   ```bash
   chmod 600 ~/.ssh/id_ed25519
   ```

3. **远程 authorized_keys 权限不对**
   ```bash
   # 在远程服务器上
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

4. **使用了错误的密钥文件**
   ```bash
   ssh -i ~/.ssh/correct_key zhangsan@host
   ```

5. **调试模式查看详细信息**
   ```bash
   ssh -vvv zhangsan@192.168.1.100
   ```

### Host key verification failed

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

**原因：** 服务器重装了系统或更换了 SSH key，导致指纹与之前记录的不一致。

**解决方法：**

```bash
# 删除旧的 host key 记录
ssh-keygen -R 192.168.1.100

# 重新连接
ssh zhangsan@192.168.1.100
# 确认新的指纹后输入 yes
```

:::caution 安全提醒
如果你没有预期到服务器变更，这个警告可能意味着**中间人攻击**。请先与服务器管理员确认。
:::

### Connection refused

```
ssh: connect to host 192.168.1.100 port 22: Connection refused
```

可能原因：
- SSH 服务没有启动：联系管理员 `sudo systemctl start sshd`
- 防火墙阻挡了端口
- 端口号不是 22：尝试 `ssh -p 2222 user@host`

### Connection timed out

```
ssh: connect to host 192.168.1.100 port 22: Connection timed out
```

可能原因：
- 网络不通：检查 `ping 192.168.1.100`
- 服务器不在同一网络：可能需要 VPN
- 防火墙规则

---

## 6.10 SSH 安全习惯

1. **使用密钥登录，禁用密码登录**（服务器管理员操作）
2. **私钥绝对不能分享**——不要上传到 GitHub、不要发送给他人
3. **为不同用途生成不同的密钥对**

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/id_github -C "github"
   ssh-keygen -t ed25519 -f ~/.ssh/id_hpc -C "hpc"
   ```

4. **定期检查 `authorized_keys`**，删除不再使用的公钥
5. **使用非默认端口**（服务器管理员操作，减少暴力扫描）
6. **不要在公共网络上使用密码登录 SSH**
7. **将 `.ssh` 目录排除在云同步之外**（如 iCloud、OneDrive）

:::tip
将以下内容添加到 `.gitignore` 中，避免意外提交 SSH 密钥：
```
.ssh/
*.pem
id_*
```
:::

---

## 常见问题

**Q: SSH 连接经常断开怎么办？**
A: 在 `~/.ssh/config` 中添加 `ServerAliveInterval 60` 和 `ServerAliveCountMax 3`，或在连接时使用 `ssh -o ServerAliveInterval=60 user@host`。

**Q: 如何在 Windows 上使用 SSH？**
A: Windows 10/11 自带 OpenSSH 客户端。在 PowerShell 或 CMD 中直接使用 `ssh` 命令。也可以在 WSL 中使用。

**Q: 如何同时连接多台服务器？**
A: 打开多个终端窗口，每个窗口连接一台服务器。或使用 `tmux`（后续章节介绍）在一个 SSH 会话中管理多个窗口。

**Q: SSH 密钥可以多台电脑共用吗？**
A: 技术上可以（复制私钥），但不推荐。建议每台电脑生成自己的密钥对，分别在服务器上添加公钥。

---

## 小结

- SSH 是连接远程服务器的标准工具，科研中必须掌握
- 使用 `ssh-keygen` 生成密钥对，用 `ssh-copy-id` 配置免密登录
- 配置 `~/.ssh/config` 可以大幅简化日常使用
- 用 `rsync` 代替 `scp` 传输文件，支持增量同步
- 遇到连接问题时，用 `ssh -vvv` 调试

---

## 练习

1. 生成一对 Ed25519 SSH 密钥
2. 查看生成的公钥内容，理解其结构
3. 配置 `~/.ssh/config`，为至少一台服务器设置别名
4. 使用 `ssh-copy-id` 配置免密登录
5. 用 `scp` 和 `rsync` 分别传输一个文件到远程服务器
6. 配置 GitHub SSH 密钥，并用 `ssh -T git@github.com` 测试
7. 故意制造一个权限错误（如 `chmod 777 ~/.ssh`），观察 SSH 连接失败后再恢复
