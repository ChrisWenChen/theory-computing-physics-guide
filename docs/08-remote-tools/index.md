---
sidebar_position: 8
sidebar_label: "8. 远程连接工具"
---

# 第 8 章：远程连接工具

**Remote Access Tools for Research Computing**

---

## 本章目标

读完本章后，你应该能够：

- 区分 SSH、Termius、Tailscale、AnyDesk 四类工具的本质区别
- 根据场景选择合适的远程访问方式
- 配置一套适合科研日常的远程连接方案
- 理解内网穿透与 VPN 组网的基本思路

---

## 动机

在科研中，你的计算任务往往不在面前的笔记本上运行——可能是实验室的工作站、学校的超算集群、云服务器，甚至是家里的台式机。你需要一种方式**远程访问**这些机器。

但"远程访问"这个词太宽泛了。命令行 vs 图形界面？局域网 vs 公网？协议 vs 客户端？这些区别搞不清楚，就容易在工具选择上浪费时间。

---

## 8.1 远程访问场景总览

科研中常见的远程访问场景包括：

| 场景 | 需求 | 推荐工具 |
|------|------|----------|
| 连接学校 HPC 集群 | 命令行操作、提交任务 | SSH |
| 在咖啡厅连回实验室工作站 | 命令行 + 文件传输 | SSH + Tailscale |
| 远程帮同学调试图形界面程序 | 看到并操作对方桌面 | AnyDesk |
| 手机/iPad 上临时登录服务器 | 移动端 SSH | Termius |
| 家里访问实验室没有公网 IP 的机器 | 内网穿透 / 组网 | Tailscale |

:::tip 关键区分
**SSH 是协议**，Termius 是 SSH 的**客户端**，Tailscale 解决的是**网络可达性**，AnyDesk 提供的是**图形桌面共享**。它们解决的问题完全不同，经常需要组合使用。
:::

---

## 8.2 SSH：命令行远程访问

SSH（Secure Shell）是远程访问的基础协议。第 6 章已经详细介绍了 SSH 的安装与配置，这里做简要回顾。

### 核心功能

- 加密的命令行远程登录
- 文件传输（`scp`、`sftp`）
- 端口转发（Port Forwarding）
- 密钥认证

### 常用命令

```bash
# 登录远程服务器
ssh user@hostname

# 使用密钥登录
ssh -i ~/.ssh/my_key user@hostname

# 端口转发：将远程的 Jupyter 端口映射到本地
ssh -L 8888:localhost:8888 user@server

# 传输文件
scp local_file.txt user@server:/remote/path/
```

### SSH Config 配置

编辑 `~/.ssh/config`，可以大幅简化连接命令：

```
Host lab-server
    HostName 192.168.1.100
    User zhangsan
    Port 22
    IdentityFile ~/.ssh/id_ed25519

Host hpc
    HostName hpc.university.edu
    User s2024001
    ForwardAgent yes
```

配置后只需 `ssh lab-server` 即可连接。

---

## 8.3 Termius：跨平台 SSH 客户端

Termius 是一个**商业 SSH 客户端**，支持 macOS、Windows、Linux、iOS、Android。

### 为什么不直接用终端里的 ssh？

对于大多数情况，终端里的 `ssh` 命令完全够用。Termius 的优势在于：

- **多设备同步**：在手机、平板、电脑之间同步服务器列表和密钥
- **图形化管理**：对不熟悉命令行配置的人更友好
- **SFTP 文件管理**：内置图形化文件传输
- **Snippet 管理**：保存常用命令片段

### 安装

```bash
# macOS
brew install --cask termius

# Windows（winget）
winget install Termius.Termius

# Linux（从官网下载 .deb 安装包）
# 访问 https://termius.com/download/linux 下载最新 .deb
sudo dpkg -i termius_*.deb
sudo apt install -f    # 自动补全缺少的依赖
```

### 配置步骤

1. 打开 Termius，注册账号（免费版功能有限）
2. 点击 **New Host**，填入服务器地址、用户名
3. 添加 SSH 密钥或密码
4. 点击连接

:::info 是否值得付费？
Termius 免费版不支持同步和 SFTP。如果你主要在一台电脑上工作，用系统自带的终端 + `ssh` 命令完全足够。Termius 的主要价值在于**移动端**和**多设备同步**。学生可以申请 GitHub Education Pack 获取免费 Premium。
:::

---

## 8.4 Tailscale：组网与内网穿透思路

### 问题背景

很多实验室的工作站**没有公网 IP**，从校外无法直接 SSH 连接。传统方案包括：

- 学校 VPN（通常很慢）
- frp / ngrok 等内网穿透工具（需要一台公网服务器）
- ZeroTier / Tailscale（基于 WireGuard 的虚拟组网）

### Tailscale 是什么？

Tailscale 基于 WireGuard 协议，将你的多台设备组成一个**虚拟局域网（VPN mesh）**。安装 Tailscale 后，每台设备会获得一个 `100.x.x.x` 的虚拟 IP，设备之间可以直接通信，就像在同一个局域网里。

### 安装与配置

```bash
# macOS
brew install --cask tailscale

# Windows（winget）
winget install Tailscale.Tailscale

# Ubuntu/Debian（官方脚本，自动配置 apt 源并安装）
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

### 使用流程

1. 在**所有需要互连的设备**上安装 Tailscale
2. 用同一个账号登录（支持 Google、GitHub 等）
3. 每台设备获得一个 Tailscale IP（如 `100.64.0.1`）
4. 之后可以直接用 Tailscale IP 进行 SSH 连接：

```bash
ssh user@100.64.0.2
```

### 典型场景

```
┌──────────────┐     Tailscale 网络      ┌──────────────┐
│  你的笔记本   │ ◄──────────────────────► │ 实验室工作站  │
│  (咖啡厅)    │    100.64.0.1            │  (无公网 IP)  │
│              │         ↕                │  100.64.0.2  │
└──────────────┘         ↕                └──────────────┘
                  ┌──────────────┐
                  │  你的手机     │
                  │  100.64.0.3  │
                  └──────────────┘
```

:::caution 注意事项
- Tailscale 免费版支持最多 100 台设备，个人使用足够
- 某些网络环境（如校园网限制 UDP）可能影响连接质量
- Tailscale 本身**不提供 SSH 功能**，它只解决网络可达性问题，你仍然需要在目标机器上运行 SSH 服务
:::

---

## 8.5 AnyDesk：图形界面远程控制

### 什么时候需要图形远程？

- 运行带 GUI 的科学软件（如 VESTA、Avogadro、ParaView）
- 远程演示或帮同学调试
- 访问只装了桌面环境的 Windows/macOS 机器

### AnyDesk vs 其他方案

| 工具 | 特点 |
|------|------|
| AnyDesk | 低延迟、跨平台、免费个人使用 |
| TeamViewer | 功能类似但对免费用户限制更多 |
| RDP (Windows) | Windows 自带，仅限 Pro/Enterprise 版 |
| VNC | 开源但配置复杂、性能一般 |
| X11 Forwarding | 通过 SSH 转发单个窗口，延迟大 |

### 安装

```bash
# macOS
brew install --cask anydesk

# Windows（winget）
winget install AnyDesk.AnyDesk

# Ubuntu（配置官方 apt 源）
wget -qO- https://keys.anydesk.com/repos/DEB-GPG-KEY \
  | gpg --dearmor \
  | sudo tee /etc/apt/keyrings/anydesk.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/anydesk.gpg] http://deb.anydesk.com/ all main" \
  | sudo tee /etc/apt/sources.list.d/anydesk.list
sudo apt update && sudo apt install anydesk
```

### 使用方式

1. 在两台机器上都安装 AnyDesk
2. 记下远程机器的 AnyDesk 地址（一串数字）
3. 在本地输入该地址，请求连接
4. 远程机器上确认连接请求

:::tip 无人值守访问
如果需要无人值守访问（比如连接实验室无人看管的工作站），可以在远程机器上设置**密码**：AnyDesk → 设置 → 安全 → 无人值守访问 → 设置密码。
:::

---

## 8.6 它们之间的区别与适用场景

这是最重要的一节。很多初学者会混淆这些工具，因为它们都和"远程"有关。

### 本质区别

| 维度 | SSH | Termius | Tailscale | AnyDesk |
|------|-----|---------|-----------|---------|
| **本质** | 通信协议 | SSH 客户端软件 | 虚拟组网工具 | 远程桌面软件 |
| **解决什么** | 加密远程命令行 | 方便使用 SSH | 让设备互相可达 | 图形界面远程操控 |
| **类比** | HTTP 协议 | Chrome 浏览器 | 路由器/网线 | 远程桌面投屏 |
| **是否必须** | 是（基础） | 否（有替代品） | 视网络环境 | 视需求 |
| **命令行/GUI** | 命令行 | GUI + 命令行 | 后台服务 | 图形界面 |
| **传输内容** | 命令、文件 | 命令、文件 | 网络数据包 | 屏幕画面+输入 |

### 组合使用示例

```
场景：从家里 SSH 连接实验室没有公网 IP 的 Linux 工作站

解决方案：Tailscale（组网） + SSH（连接）

                Tailscale 虚拟网络
家里笔记本 ◄─────────────────────► 实验室 Linux
    │                                    │
    └── ssh user@100.64.0.2 ────────────►│
```

```
场景：在 iPad 上提交 HPC 任务

解决方案：Termius（移动端 SSH 客户端）

iPad Termius App ──── SSH ────► HPC 集群（有公网地址）
```

---

## 8.7 推荐配置方案

### 方案一：最简方案（所有人）

适用于有公网 IP 或校园 VPN 的场景：

1. 配置好 `~/.ssh/config`
2. 使用密钥认证（禁用密码登录）
3. 日常用终端 `ssh` 命令即可

### 方案二：内网穿透方案

适用于实验室机器没有公网 IP 的场景：

1. 所有设备安装 Tailscale 并登录同一账号
2. 记住各设备的 Tailscale IP
3. 通过 Tailscale IP 使用 SSH 连接
4. 在 `~/.ssh/config` 中使用 Tailscale IP：

```
Host lab-via-tailscale
    HostName 100.64.0.2
    User zhangsan
    IdentityFile ~/.ssh/id_ed25519
```

### 方案三：移动端方案

1. 安装 Termius（手机/平板）
2. 导入 SSH 密钥
3. 配合 Tailscale 实现任意网络下连接

### 方案四：图形远程方案

需要远程 GUI 时：

1. 安装 AnyDesk 并设置无人值守访问
2. 配合 Tailscale 可以减少对公网 IP 的依赖

---

## 8.8 安全与隐私注意事项

:::caution 安全清单
- **SSH 密钥 > 密码**：始终优先使用密钥认证
- **禁用 root 登录**：编辑 `/etc/ssh/sshd_config`，设置 `PermitRootLogin no`
- **更改默认端口**：将 SSH 端口从 22 改为其他端口可减少扫描攻击
- **AnyDesk 密码要强**：无人值守密码至少 12 位，包含大小写和数字
- **Tailscale ACL**：在多人共享的 Tailscale 网络中，配置访问控制列表
- **不要在公共电脑上保存密钥**：用完要清理
:::

### SSH 安全加固示例

```bash
# 编辑 SSH 服务端配置
sudo nano /etc/ssh/sshd_config

# 推荐设置：
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# Port 2222

# 重启 SSH 服务
sudo systemctl restart sshd
```

### 防火墙基础

```bash
# Ubuntu UFW 防火墙
sudo ufw allow 2222/tcp   # 允许自定义 SSH 端口
sudo ufw enable
sudo ufw status
```

---

## 常见问题

:::info FAQ

**Q: 我应该先学哪个工具？**
A: 先学 SSH（第 6 章）。SSH 是一切远程操作的基础。其他工具按需学习。

**Q: Tailscale 和 VPN 有什么区别？**
A: 传统 VPN 是 client-server 模式（所有流量经过中心服务器），Tailscale 是 mesh 模式（设备之间直连）。Tailscale 更快、更适合个人设备互联。

**Q: 用 AnyDesk 远程会不会很卡？**
A: 取决于网络带宽。局域网内非常流畅；跨公网时建议降低画质设置。对于纯命令行操作，SSH 永远比图形远程更高效。

**Q: 我可以用 VS Code Remote SSH 代替这些工具吗？**
A: VS Code Remote SSH 是一个优秀的开发方案，但它解决的是"远程开发"问题。网络可达性（Tailscale）和图形远程（AnyDesk）是它无法替代的。
:::

---

## 小结

| 工具 | 一句话总结 |
|------|-----------|
| SSH | 远程命令行的基础协议，必学 |
| Termius | SSH 的图形客户端，移动端有用 |
| Tailscale | 虚拟组网，解决"连不上"的问题 |
| AnyDesk | 远程桌面，需要 GUI 时使用 |

核心原则：**先解决网络可达性（Tailscale），再选择访问方式（SSH / AnyDesk），最后选择客户端（终端 / Termius）**。

---

## 练习

1. **基础**：配置 `~/.ssh/config`，实现一键 SSH 连接你的服务器
2. **进阶**：在两台设备上安装 Tailscale，验证可以互相 `ping` 通
3. **进阶**：使用 SSH 端口转发，将远程 Jupyter Notebook 映射到本地浏览器
4. **探索**：安装 AnyDesk，尝试从一台电脑远程控制另一台
5. **思考**：画一张图，标出你日常科研中涉及的所有设备及它们之间的连接方式，思考哪些工具适合哪条连接
