---
sidebar_position: 8
sidebar_label: "8. Remote Tools"
---

# Chapter 8: Remote Access Tools

**Remote Access Tools for Research Computing**

---

## Chapter Goals

After reading this chapter, you should be able to:

- Distinguish the fundamental differences between SSH, Termius, Tailscale, and AnyDesk
- Choose the appropriate remote access method based on the scenario
- Configure a remote connection setup suitable for daily research
- Understand the basic concepts of NAT traversal and VPN networking

---

## Motivation

In research, your computing tasks often do not run on the laptop in front of you — they may be on a lab workstation, a university supercomputing cluster, a cloud server, or even a desktop at home. You need a way to **remotely access** these machines.

But "remote access" is too broad a term. Command line vs. graphical interface? LAN vs. public network? Protocol vs. client? If you cannot tell these apart, you will waste time choosing tools.

---

## 8.1 Remote Access Scenario Overview

Common remote access scenarios in research include:

| Scenario | Requirement | Recommended Tool |
|----------|-------------|-----------------|
| Connect to university HPC cluster | Command-line operations, submit jobs | SSH |
| Connect back to lab workstation from a coffee shop | Command line + file transfer | SSH + Tailscale |
| Remotely help a classmate debug a GUI program | View and operate their desktop | AnyDesk |
| Temporarily log in to a server from phone/iPad | Mobile SSH | Termius |
| Access a lab machine with no public IP from home | NAT traversal / virtual networking | Tailscale |

:::tip Key Distinction
**SSH is a protocol**, Termius is an SSH **client**, Tailscale solves **network reachability**, and AnyDesk provides **graphical desktop sharing**. They solve entirely different problems and often need to be used in combination.
:::

---

## 8.2 SSH: Command-Line Remote Access

SSH (Secure Shell) is the foundational protocol for remote access. Chapter 6 covered SSH installation and configuration in detail; here is a brief review.

### Core Features

- Encrypted command-line remote login
- File transfer (`scp`, `sftp`)
- Port forwarding
- Key-based authentication

### Common Commands

```bash
# Log in to a remote server
ssh user@hostname

# Log in using a key
ssh -i ~/.ssh/my_key user@hostname

# Port forwarding: map remote Jupyter port to local
ssh -L 8888:localhost:8888 user@server

# Transfer files
scp local_file.txt user@server:/remote/path/
```

### SSH Config

Edit `~/.ssh/config` to greatly simplify connection commands:

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

After configuration, simply use `ssh lab-server` to connect.

---

## 8.3 Termius: Cross-Platform SSH Client

Termius is a **commercial SSH client** that supports macOS, Windows, Linux, iOS, and Android.

### Why Not Just Use ssh in the Terminal?

For most cases, the `ssh` command in the terminal is perfectly sufficient. Termius excels in:

- **Multi-device sync**: Sync server lists and keys across phone, tablet, and computer
- **Graphical management**: More user-friendly for those unfamiliar with command-line configuration
- **SFTP file management**: Built-in graphical file transfer
- **Snippet management**: Save frequently used command snippets

### Installation

```bash
# macOS
brew install --cask termius

# Windows (scoop)
scoop install termius

# Linux
sudo snap install termius-app
```

### Configuration Steps

1. Open Termius and register an account (free version has limited features)
2. Click **New Host** and enter the server address and username
3. Add an SSH key or password
4. Click connect

:::info Is It Worth Paying For?
The free version of Termius does not support sync or SFTP. If you primarily work on a single computer, the built-in terminal + `ssh` command is more than enough. Termius's main value lies in **mobile devices** and **multi-device sync**. Students can apply for the GitHub Education Pack to get free Premium access.
:::

---

## 8.4 Tailscale: Virtual Networking and NAT Traversal

### Background

Many lab workstations **do not have a public IP**, making direct SSH connections from off-campus impossible. Traditional solutions include:

- University VPN (usually slow)
- frp / ngrok and other NAT traversal tools (require a public-facing server)
- ZeroTier / Tailscale (WireGuard-based virtual networking)

### What Is Tailscale?

Tailscale is based on the WireGuard protocol and connects your devices into a **virtual LAN (VPN mesh)**. After installing Tailscale, each device gets a `100.x.x.x` virtual IP, and devices can communicate directly as if they were on the same local network.

### Installation and Configuration

```bash
# macOS
brew install tailscale

# Ubuntu/Debian
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Windows
# Download the installer from https://tailscale.com/download
```

### Usage Flow

1. Install Tailscale on **all devices that need to interconnect**
2. Log in with the same account (supports Google, GitHub, etc.)
3. Each device gets a Tailscale IP (e.g., `100.64.0.1`)
4. Then you can SSH directly using the Tailscale IP:

```bash
ssh user@100.64.0.2
```

### Typical Scenario

```
┌──────────────┐     Tailscale Network      ┌──────────────┐
│ Your laptop  │ ◄──────────────────────────► │ Lab workstation│
│ (coffee shop)│    100.64.0.1               │ (no public IP) │
│              │         ↕                   │  100.64.0.2    │
└──────────────┘         ↕                   └──────────────┘
                  ┌──────────────┐
                  │ Your phone   │
                  │  100.64.0.3  │
                  └──────────────┘
```

:::caution Important Notes
- The free version of Tailscale supports up to 100 devices, which is more than enough for personal use
- Some network environments (e.g., campus networks that restrict UDP) may affect connection quality
- Tailscale itself **does not provide SSH functionality** — it only solves network reachability; you still need an SSH service running on the target machine
:::

---

## 8.5 AnyDesk: Graphical Remote Desktop Control

### When Do You Need Graphical Remote Access?

- Running scientific software with a GUI (e.g., VESTA, Avogadro, ParaView)
- Remote demonstrations or helping classmates debug
- Accessing Windows/macOS machines that only have a desktop environment

### AnyDesk vs. Other Solutions

| Tool | Features |
|------|----------|
| AnyDesk | Low latency, cross-platform, free for personal use |
| TeamViewer | Similar features but more restrictions for free users |
| RDP (Windows) | Built into Windows, limited to Pro/Enterprise editions |
| VNC | Open source but complex to configure, mediocre performance |
| X11 Forwarding | Forwards individual windows via SSH, high latency |

### Installation

```bash
# macOS
brew install --cask anydesk

# Ubuntu
# Download the .deb package from https://anydesk.com/en/downloads
sudo dpkg -i anydesk_*.deb

# Windows
# Download from the official website or:
scoop install anydesk
```

### How to Use

1. Install AnyDesk on both machines
2. Note the remote machine's AnyDesk address (a string of numbers)
3. Enter that address on the local machine and request a connection
4. Confirm the connection request on the remote machine

:::tip Unattended Access
If you need unattended access (e.g., connecting to an unattended lab workstation), you can set a **password** on the remote machine: AnyDesk → Settings → Security → Unattended Access → Set Password.
:::

---

## 8.6 Differences and Applicable Scenarios

This is the most important section. Many beginners confuse these tools because they are all related to "remote access."

### Fundamental Differences

| Dimension | SSH | Termius | Tailscale | AnyDesk |
|-----------|-----|---------|-----------|---------|
| **Nature** | Communication protocol | SSH client software | Virtual networking tool | Remote desktop software |
| **What it solves** | Encrypted remote command line | Convenient SSH usage | Making devices reachable | Graphical remote control |
| **Analogy** | HTTP protocol | Chrome browser | Router/network cable | Remote desktop screen sharing |
| **Required?** | Yes (foundational) | No (has alternatives) | Depends on network | Depends on needs |
| **CLI/GUI** | CLI | GUI + CLI | Background service | GUI |
| **What it transfers** | Commands, files | Commands, files | Network packets | Screen image + input |

### Combined Usage Examples

```
Scenario: SSH from home to a lab Linux workstation with no public IP

Solution: Tailscale (networking) + SSH (connection)

                Tailscale virtual network
Home laptop ◄─────────────────────► Lab Linux
    │                                    │
    └── ssh user@100.64.0.2 ────────────►│
```

```
Scenario: Submit HPC jobs from an iPad

Solution: Termius (mobile SSH client)

iPad Termius App ──── SSH ────► HPC cluster (has public address)
```

---

## 8.7 Recommended Configuration Plans

### Plan 1: Minimal Setup (For Everyone)

Suitable for scenarios with a public IP or campus VPN:

1. Configure `~/.ssh/config`
2. Use key-based authentication (disable password login)
3. Use the terminal `ssh` command for daily work

### Plan 2: NAT Traversal Setup

Suitable when lab machines have no public IP:

1. Install Tailscale on all devices and log in with the same account
2. Note each device's Tailscale IP
3. SSH via Tailscale IPs
4. Use Tailscale IPs in `~/.ssh/config`:

```
Host lab-via-tailscale
    HostName 100.64.0.2
    User zhangsan
    IdentityFile ~/.ssh/id_ed25519
```

### Plan 3: Mobile Device Setup

1. Install Termius (phone/tablet)
2. Import SSH keys
3. Combine with Tailscale for connectivity from any network

### Plan 4: Graphical Remote Setup

When remote GUI access is needed:

1. Install AnyDesk and configure unattended access
2. Combine with Tailscale to reduce reliance on public IPs

---

## 8.8 Security and Privacy Considerations

:::caution Security Checklist
- **SSH keys > passwords**: Always prefer key-based authentication
- **Disable root login**: Edit `/etc/ssh/sshd_config` and set `PermitRootLogin no`
- **Change the default port**: Changing the SSH port from 22 to another port reduces scan attacks
- **Use a strong AnyDesk password**: Unattended access passwords should be at least 12 characters with mixed case and numbers
- **Tailscale ACL**: In shared Tailscale networks, configure access control lists
- **Do not save keys on public computers**: Clean up when done
:::

### SSH Hardening Example

```bash
# Edit the SSH server configuration
sudo nano /etc/ssh/sshd_config

# Recommended settings:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# Port 2222

# Restart the SSH service
sudo systemctl restart sshd
```

### Firewall Basics

```bash
# Ubuntu UFW firewall
sudo ufw allow 2222/tcp   # Allow custom SSH port
sudo ufw enable
sudo ufw status
```

---

## FAQ

:::info FAQ

**Q: Which tool should I learn first?**
A: Learn SSH first (Chapter 6). SSH is the foundation of all remote operations. Learn other tools as needed.

**Q: What is the difference between Tailscale and a VPN?**
A: Traditional VPNs use a client-server model (all traffic goes through a central server); Tailscale uses a mesh model (devices connect directly to each other). Tailscale is faster and better suited for connecting personal devices.

**Q: Will AnyDesk remote access be laggy?**
A: It depends on network bandwidth. It is very smooth on a LAN; when crossing the public internet, consider lowering the quality settings. For pure command-line operations, SSH is always more efficient than graphical remote access.

**Q: Can VS Code Remote SSH replace these tools?**
A: VS Code Remote SSH is an excellent development solution, but it solves the "remote development" problem. Network reachability (Tailscale) and graphical remote access (AnyDesk) are things it cannot replace.
:::

---

## Summary

| Tool | One-Line Summary |
|------|-----------------|
| SSH | The foundational protocol for remote command line — a must-learn |
| Termius | A graphical SSH client, useful on mobile devices |
| Tailscale | Virtual networking, solves the "can't connect" problem |
| AnyDesk | Remote desktop, used when GUI access is needed |

Core principle: **First solve network reachability (Tailscale), then choose the access method (SSH / AnyDesk), and finally choose the client (terminal / Termius)**.

---

## Exercises

1. **Basic**: Configure `~/.ssh/config` to enable one-command SSH access to your server
2. **Intermediate**: Install Tailscale on two devices and verify they can `ping` each other
3. **Intermediate**: Use SSH port forwarding to map a remote Jupyter Notebook to your local browser
4. **Exploration**: Install AnyDesk and try remotely controlling one computer from another
5. **Reflection**: Draw a diagram showing all the devices involved in your daily research and the connections between them — think about which tools are appropriate for each connection
