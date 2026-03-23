---
sidebar_position: 6
sidebar_label: "6. SSH Remote Access"
---

# Chapter 6: SSH and Remote Servers

> Scientific computing relies on remote servers, and SSH is your key to connecting to them.

## Chapter Goals

- Understand the basic principles and workings of SSH
- Master password-based and key-based authentication
- Learn to generate and configure SSH keys
- Configure `~/.ssh/config` to simplify login
- Use scp and rsync to transfer files
- Troubleshoot common SSH connection errors

## Motivation

In computational physics, you will almost certainly use remote servers:

- Lab/research group workstations
- University HPC (High-Performance Computing) clusters
- Cloud servers (AWS, GCP, etc.)
- GitHub (SSH is also used when pushing code)

All of these scenarios connect through the **SSH (Secure Shell)** protocol. Learning SSH is an essential skill for research computing.

---

## 6.1 Why SSH Is Indispensable in Research

| Scenario | Why SSH Is Needed |
|----------|------------------|
| Research group workstation | Remotely connect from your laptop to the lab's high-performance machine |
| HPC cluster | Submit large-scale computing tasks, such as molecular dynamics or first-principles calculations |
| GitHub | Use SSH keys for password-free code pushing |
| Cloud server | Manage services and computing tasks deployed remotely |

:::info
Even if you currently only write code on your own computer, learning SSH is inevitable. The sooner you learn it, the sooner you benefit.
:::

---

## 6.2 Basic Principles of SSH

SSH is an encrypted network protocol used to securely log in and execute commands remotely over insecure networks.

```
Your computer (client)  ──── Encrypted channel ────  Remote server (server)
    Local terminal        ←→ SSH protocol ←→          Remote shell
```

SSH security is based on **asymmetric encryption**:

- **Public key**: Placed on the server, anyone can see it
- **Private key**: Stored on your computer, **must never be leaked**

Analogy: The public key is a lock, and the private key is the key. You give the lock (public key) to the server administrator to install on the door, and only the key (private key) in your hand can open it.

---

## 6.3 Username, Host, and Port

The basic SSH connection command format:

```bash
ssh username@hostname
ssh username@hostname -p port
```

- **username**: Your username on the remote server
- **hostname**: Server address (IP or domain name)
- **port**: SSH port, default is 22

### Example

```bash
# Connect to a server with IP address 192.168.1.100
ssh zhangsan@192.168.1.100

# Connect to a cluster with domain name hpc.university.edu
ssh zhangsan@hpc.university.edu

# Use a non-default port
ssh zhangsan@server.example.com -p 2222
```

When connecting for the first time, you will see a prompt like this:

```
The authenticity of host '192.168.1.100 (192.168.1.100)' can't be established.
ED25519 key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Type `yes` to proceed. This means you trust this server, and its fingerprint will be recorded in the `~/.ssh/known_hosts` file.

---

## 6.4 Password Login vs. Key-Based Login

### Password Login

The simplest method, but you need to enter your password every time:

```bash
ssh zhangsan@192.168.1.100
# Enter password...
```

### Key-Based Login (Recommended)

Once configured, no password is needed — more secure and convenient:

```bash
ssh zhangsan@192.168.1.100
# Logged in directly, no password needed!
```

| Comparison | Password Login | Key-Based Login |
|------------|---------------|-----------------|
| Convenience | Enter password every time | Password-free |
| Security | Vulnerable to brute-force attacks | Nearly impossible to crack |
| Use case | Initial setup | Daily use |
| Automation | Inconvenient in scripts | Perfect for scripts and CI/CD |

:::tip
It is strongly recommended to configure key-based login. Use password login only during initial setup.
:::

---

## 6.5 Generating SSH Keys

### Step 1: Generate a Key Pair

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Parameter explanation:
- `-t ed25519`: Use the Ed25519 algorithm (recommended — shorter and more secure than RSA)
- `-C "your_email@example.com"`: A comment, usually your email, for identification

After execution, you will see the following interaction:

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/zhangsan/.ssh/id_ed25519):
```

Press Enter to use the default path.

```
Enter passphrase (empty for no passphrase):
```

You can set a passphrase to protect the private key, or press Enter to leave it empty.

:::caution Passphrase Trade-offs
- Setting a passphrase: More secure, but requires input each time (you can use `ssh-agent` to cache it)
- No passphrase: More convenient, but if the private key file is leaked, anyone can use it directly
- Recommendation: On a personal computer, you can skip it; on shared machines, set one
:::

### Step 2: View the Generated Keys

```bash
ls -la ~/.ssh/
# id_ed25519       ← Private key (never share this!)
# id_ed25519.pub   ← Public key (safe to share)
```

View the public key contents:

```bash
cat ~/.ssh/id_ed25519.pub
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIxxxxxxxxxxxxxxxxx your_email@example.com
```

### If You Need RSA Keys

Some legacy systems may only support RSA:

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

---

## 6.6 Configuring ~/.ssh/config

`~/.ssh/config` is the SSH configuration file. You can set aliases and default parameters for different servers, greatly simplifying login commands.

### Create the Configuration File

```bash
touch ~/.ssh/config
chmod 600 ~/.ssh/config
```

### Configuration Example

```ssh-config
# Lab workstation
Host lab
    HostName 192.168.1.100
    User zhangsan
    Port 22
    IdentityFile ~/.ssh/id_ed25519

# HPC cluster
Host hpc
    HostName hpc.university.edu
    User zhangsan_2024
    Port 22
    IdentityFile ~/.ssh/id_ed25519

# Internal server requiring a jump host
Host internal
    HostName 10.0.0.50
    User zhangsan
    ProxyJump lab

# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519

# Global settings for all hosts
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes
```

### Login Using Aliases

After configuration, the long command:

```bash
ssh zhangsan@192.168.1.100
```

Becomes simply:

```bash
ssh lab
```

:::tip ServerAliveInterval
`ServerAliveInterval 60` means a heartbeat packet is sent every 60 seconds to prevent the SSH connection from being dropped due to inactivity. This is very useful in environments with unstable networks or firewall timeouts.
:::

---

## 6.7 ssh-copy-id and Manual Public Key Configuration

### Method 1: ssh-copy-id (Recommended)

```bash
ssh-copy-id zhangsan@192.168.1.100
# Enter password (the last time you need to enter it)
# After this, you can log in without a password
```

`ssh-copy-id` automatically appends your public key to the `~/.ssh/authorized_keys` file on the remote server.

### Method 2: Manual Copy

If the server does not have the `ssh-copy-id` command, you can do it manually:

```bash
# 1. Copy the public key contents
cat ~/.ssh/id_ed25519.pub

# 2. Log in to the remote server
ssh zhangsan@192.168.1.100

# 3. Execute on the remote server
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "paste your public key content here" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

:::caution Permissions Matter
SSH has strict requirements for file permissions. Key-based login will silently fail if permissions are incorrect:

```bash
chmod 700 ~/.ssh                    # drwx------
chmod 600 ~/.ssh/authorized_keys    # -rw-------
chmod 600 ~/.ssh/id_ed25519         # -rw------- (private key)
chmod 644 ~/.ssh/id_ed25519.pub     # -rw-r--r-- (public key)
chmod 600 ~/.ssh/config             # -rw-------
```
:::

### Verify Password-Free Login

```bash
ssh lab    # Should log in directly without entering a password
```

### Configure GitHub SSH

```bash
# 1. Copy the public key
cat ~/.ssh/id_ed25519.pub
# (Or on macOS: pbcopy < ~/.ssh/id_ed25519.pub)

# 2. Go to GitHub → Settings → SSH and GPG keys → New SSH key
# 3. Paste the public key content

# 4. Test the connection
ssh -T git@github.com
# Hi zhangsan! You've successfully authenticated...
```

---

## 6.8 Transferring Files with scp / rsync

### scp (Secure Copy)

scp uses the SSH protocol to transfer files, with syntax similar to `cp`:

```bash
# Upload a file to the remote server
scp local_file.txt lab:/home/zhangsan/

# Upload a directory (recursive)
scp -r local_dir/ lab:/home/zhangsan/

# Download a file from the remote server
scp lab:/home/zhangsan/result.dat ./

# Download a directory from the remote server
scp -r lab:/home/zhangsan/results/ ./

# Use a non-default port
scp -P 2222 file.txt user@host:/path/
```

:::info
Note that scp uses uppercase `-P` for the port parameter, while ssh uses lowercase `-p`.
:::

### rsync (Recommended)

rsync is more powerful than scp, supporting **incremental synchronization** — only transferring changed files, making it faster:

```bash
# Upload a directory to remote (incremental sync)
rsync -avz local_dir/ lab:/home/zhangsan/remote_dir/

# Download a directory from remote
rsync -avz lab:/home/zhangsan/remote_dir/ ./local_dir/

# Show transfer progress
rsync -avz --progress local_dir/ lab:/remote_dir/

# Exclude certain files
rsync -avz --exclude='*.o' --exclude='__pycache__' local_dir/ lab:/remote_dir/

# Delete extra files on the remote end (mirror sync)
rsync -avz --delete local_dir/ lab:/remote_dir/
```

Parameter explanation:
- `-a`: Archive mode, preserves permissions, timestamps, etc.
- `-v`: Verbose, shows detailed information
- `-z`: Compress during transfer

### scp vs rsync

| Feature | scp | rsync |
|---------|-----|-------|
| Incremental sync | Not supported | Supported |
| Resume transfer | Not supported | Supported (`--partial`) |
| Exclude files | Not supported | Supported (`--exclude`) |
| Speed (many small files) | Slower | Faster |
| Simple file transfer | Sufficient | Also sufficient |

:::tip
Use rsync instead of scp for daily file transfers. Especially when transferring large directories, rsync's incremental sync saves a significant amount of time.
:::

---

## 6.9 Common Errors: Permission denied, Host key verification failed

### Permission denied (publickey)

```
zhangsan@192.168.1.100: Permission denied (publickey).
```

**Possible causes and solutions:**

1. **Public key not added to the server**
   ```bash
   ssh-copy-id zhangsan@192.168.1.100
   ```

2. **Incorrect local private key permissions**
   ```bash
   chmod 600 ~/.ssh/id_ed25519
   ```

3. **Incorrect remote authorized_keys permissions**
   ```bash
   # On the remote server
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

4. **Using the wrong key file**
   ```bash
   ssh -i ~/.ssh/correct_key zhangsan@host
   ```

5. **Debug mode for detailed information**
   ```bash
   ssh -vvv zhangsan@192.168.1.100
   ```

### Host key verification failed

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

**Cause:** The server was reinstalled or its SSH key was replaced, causing the fingerprint to differ from the previously recorded one.

**Solution:**

```bash
# Remove the old host key record
ssh-keygen -R 192.168.1.100

# Reconnect
ssh zhangsan@192.168.1.100
# Confirm the new fingerprint and type yes
```

:::caution Security Warning
If you did not expect the server to change, this warning may indicate a **man-in-the-middle attack**. Verify with the server administrator first.
:::

### Connection refused

```
ssh: connect to host 192.168.1.100 port 22: Connection refused
```

Possible causes:
- SSH service is not running: Contact the administrator — `sudo systemctl start sshd`
- Firewall is blocking the port
- The port is not 22: Try `ssh -p 2222 user@host`

### Connection timed out

```
ssh: connect to host 192.168.1.100 port 22: Connection timed out
```

Possible causes:
- Network is unreachable: Check with `ping 192.168.1.100`
- Server is on a different network: You may need a VPN
- Firewall rules

---

## 6.10 SSH Security Practices

1. **Use key-based login and disable password login** (server administrator action)
2. **Never share your private key** — do not upload it to GitHub or send it to others
3. **Generate separate key pairs for different purposes**

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/id_github -C "github"
   ssh-keygen -t ed25519 -f ~/.ssh/id_hpc -C "hpc"
   ```

4. **Regularly check `authorized_keys`** and remove public keys that are no longer in use
5. **Use a non-default port** (server administrator action, reduces brute-force scanning)
6. **Do not use password-based SSH login on public networks**
7. **Exclude the `.ssh` directory from cloud sync** (e.g., iCloud, OneDrive)

:::tip
Add the following to your `.gitignore` to avoid accidentally committing SSH keys:
```
.ssh/
*.pem
id_*
```
:::

---

## FAQ

**Q: What should I do if my SSH connection keeps dropping?**
A: Add `ServerAliveInterval 60` and `ServerAliveCountMax 3` to `~/.ssh/config`, or use `ssh -o ServerAliveInterval=60 user@host` when connecting.

**Q: How do I use SSH on Windows?**
A: Windows 10/11 comes with a built-in OpenSSH client. Use the `ssh` command directly in PowerShell or CMD. You can also use it within WSL.

**Q: How do I connect to multiple servers simultaneously?**
A: Open multiple terminal windows, each connecting to a different server. Or use `tmux` (covered in a later chapter) to manage multiple windows within a single SSH session.

**Q: Can SSH keys be shared across multiple computers?**
A: Technically yes (by copying the private key), but it is not recommended. It is better to generate a separate key pair on each computer and add each public key to the server individually.

---

## Summary

- SSH is the standard tool for connecting to remote servers — an essential skill in research
- Use `ssh-keygen` to generate key pairs and `ssh-copy-id` to set up password-free login
- Configuring `~/.ssh/config` can greatly simplify daily usage
- Use `rsync` instead of `scp` for file transfers — it supports incremental sync
- When encountering connection issues, debug with `ssh -vvv`

---

## Exercises

1. Generate an Ed25519 SSH key pair
2. View the generated public key contents and understand its structure
3. Configure `~/.ssh/config` with an alias for at least one server
4. Use `ssh-copy-id` to set up password-free login
5. Transfer a file to a remote server using both `scp` and `rsync`
6. Configure a GitHub SSH key and test with `ssh -T git@github.com`
7. Intentionally create a permission error (e.g., `chmod 777 ~/.ssh`), observe the SSH connection failure, then restore it
