---
sidebar_position: 23
sidebar_label: "23. Zotero 与文献管理"
---

# 第 23 章：Zotero 与文献管理

> 你读过的每一篇论文，都应该能在 30 秒内找到。

## 本章目标

读完本章后，你应该能：

- 安装和配置 Zotero 及其核心插件
- 使用 Zotero Connector 一键保存文献
- 建立系统的文献分类、标签和注释体系
- 将 Zotero 与 LaTeX、Word、Obsidian 协作
- 实现文献库的备份与多设备同步

## 动机

科研的第一步是读文献。你可能已经下载了几十甚至上百篇 PDF，散落在各个文件夹里：

```
Downloads/
├── paper.pdf
├── paper(1).pdf
├── quantum_computing_review.pdf
├── 1905.12345.pdf
├── 重要论文必读.pdf
└── ...
```

半年后你完全不记得哪篇是关于什么的、谁写的、发表在哪里。写论文时需要引用，又要去 Google Scholar 重新搜索 BibTeX。

**Zotero 解决的就是这个问题。** 它是一个免费、开源的文献管理工具，帮你系统地收集、组织、引用和分享学术文献。

---

## 23.1 为什么要尽早建立文献管理习惯

| 不用文献管理 | 用 Zotero |
|-------------|----------|
| PDF 散落各处 | 统一管理，随时检索 |
| 引用格式手动输入 | 一键插入引用 |
| BibTeX 手动维护 | 自动生成、自动同步 |
| 忘记论文内容 | 笔记和标注随时查看 |
| 换电脑丢文献 | 云端同步，多设备访问 |

:::tip 越早开始越好
文献管理的收益是**累积性**的。从第一篇论文就开始管理，到写毕业论文时你会感激自己。
:::

---

## 23.2 安装 Zotero

### 下载与安装

Zotero 支持 macOS、Windows 和 Linux：

```
官网下载：https://www.zotero.org/download/
```

| 平台 | 安装方式 |
|------|---------|
| macOS | 下载 `.dmg`，拖入 Applications；或 `brew install --cask zotero` |
| Windows | 下载 `.exe` 安装程序 |
| Ubuntu | 下载 `.tar.bz2` 或使用 Flatpak：`flatpak install flathub org.zotero.Zotero` |

### 注册 Zotero 账户

前往 https://www.zotero.org/user/register 注册账户，用于：

- 云端同步文献库（免费 300 MB）
- 在线文献库访问
- 群组协作

安装完成后，打开 Zotero，在 `Edit → Settings → Sync` 中登录你的账户。

---

## 23.3 浏览器插件 (Zotero Connector)

Zotero Connector 是 Zotero 的浏览器扩展，让你在浏览网页时一键保存文献。

### 安装

在 https://www.zotero.org/download/ 页面，点击对应浏览器的 Connector 链接：

- Chrome / Edge / Brave
- Firefox
- Safari

### 使用方法

1. 打开一篇论文页面（如 arXiv、Google Scholar、期刊网站）
2. 点击浏览器工具栏中的 Zotero 图标
3. 文献信息自动保存到 Zotero，PDF 自动下载（如果可获取）

### 支持的网站

Zotero Connector 支持数百个学术网站，包括：

- **arXiv**：自动抓取元数据和 PDF
- **Google Scholar**：抓取搜索结果
- **Web of Science / Scopus**：主流数据库
- **期刊网站**：APS (Physical Review), Springer, Elsevier, Nature 等
- **Amazon / 豆瓣**：书籍信息

:::info 批量保存
在搜索结果页面（如 Google Scholar），Zotero 图标会变成文件夹形状，点击后可以批量选择保存多篇文献。
:::

---

## 23.4 文献条目、标签、文件夹

### 文献条目

每条文献记录包含：

- **元数据**：标题、作者、期刊、年份、DOI、arXiv ID 等
- **附件**：PDF 全文、补充材料
- **笔记**：你的阅读笔记
- **标签**：自定义分类标签

### 文件夹（Collections）

用文件夹组织文献，例如：

```
我的文库
├── 📁 课题一：Ising 模型
│   ├── 📁 经典文献
│   ├── 📁 蒙特卡洛方法
│   └── 📁 有限尺度标度
├── 📁 课题二：拓扑绝缘体
├── 📁 方法论
│   ├── 📁 Monte Carlo
│   ├── 📁 DFT
│   └── 📁 机器学习
├── 📁 待读
└── 📁 课程
    ├── 📁 统计力学
    └── 📁 量子力学
```

:::tip 一篇文献可以属于多个文件夹
Zotero 的文件夹是"虚拟分类"，一篇文献可以同时出现在多个文件夹中（不会重复存储）。
:::

### 标签（Tags）

标签提供比文件夹更灵活的分类方式：

| 标签类型 | 示例 |
|---------|------|
| 主题 | `#ising-model`, `#monte-carlo`, `#phase-transition` |
| 状态 | `#to-read`, `#reading`, `#finished` |
| 重要性 | `#important`, `#key-paper` |
| 用途 | `#thesis`, `#proposal`, `#presentation` |
| 评价 | `#well-written`, `#good-review` |

在 Zotero 中，你可以通过标签面板（左下角）快速筛选文献。

---

## 23.5 PDF 管理与注释

### 内置 PDF 阅读器

Zotero 6+ 内置了 PDF 阅读器，支持：

- **高亮**：选中文本后选择颜色
- **笔记**：在高亮处添加注释
- **区域标注**：框选图表或公式
- **标签颜色**：用不同颜色代表不同类型（如黄色=定义，红色=关键结论）

### 推荐的颜色编码

| 颜色 | 含义 | 使用场景 |
|------|------|---------|
| 黄色 | 关键结论 | 论文的核心发现 |
| 红色 | 重要公式 | 需要使用或推导的公式 |
| 绿色 | 方法描述 | 算法和实验方法细节 |
| 蓝色 | 待查证 | 不理解或需要核实的内容 |
| 紫色 | 值得引用 | 写论文时可能引用的段落 |

### 提取注释

右键文献条目 → "Add Note from Annotations"，可以将所有 PDF 注释提取为一条笔记，方便在 Zotero 内查看或导出。

---

## 23.6 与 LaTeX / Word / Obsidian 协作

### 与 LaTeX 协作：Better BibTeX 插件

**Better BibTeX** 是 Zotero 最重要的插件之一，用于生成和同步 `.bib` 文件。

#### 安装

1. 前往 https://retorque.re/zotero-better-bibtex/installation/
2. 下载 `.xpi` 文件
3. 在 Zotero 中：`Tools → Add-ons → Install Add-on From File`

#### 配置自动导出

1. 在 Zotero 中右键你的文件夹 → "Export Collection"
2. 格式选择 "Better BibTeX"
3. 勾选 "Keep updated"（自动同步）
4. 选择保存路径（放在你的 LaTeX 项目目录中）

```bash
# 你的 LaTeX 项目目录
my_paper/
├── main.tex
├── references.bib    # ← Better BibTeX 自动维护
├── figures/
└── ...
```

#### 在 LaTeX 中引用

```latex
% main.tex
\documentclass{article}
\usepackage[backend=biber, style=phys]{biblatex}
\addbibresource{references.bib}

\begin{document}
The 2D Ising model was solved exactly by Onsager~\cite{onsager1944}.

\printbibliography
\end{document}
```

#### Citation Key 格式

在 `Settings → Better BibTeX → Citation Keys` 中设置 key 格式：

```
# 推荐格式：作者+年份
[auth:lower][year]
# 例如：onsager1944, newman1999

# 如果有重复，自动加后缀：
# onsager1944a, onsager1944b
```

---

## 23.7 文献库同步与备份

Zotero 的同步分为两部分：**元数据同步**（条目信息、笔记）和**附件同步**（PDF 文件）。

### Zotero 官方同步

- **元数据**：始终通过 Zotero 官方服务器同步，免费且不限量
- **附件免费额度**：300 MB（存 PDF 很快用完）
- **付费方案**：2 GB ($20/年)、6 GB ($60/年)、Unlimited ($120/年)

### 使用同步盘同步附件

最灵活也最经济的方案是用同步盘来管理 Zotero 的附件存储。

#### 方案一：WebDAV（推荐）

Zotero 原生支持 WebDAV 协议同步附件。配置路径：`Settings → Sync → File Syncing → WebDAV`

**坚果云**（中国大陆推荐）：

```
URL: https://dav.jianguoyun.com/dav/zotero/
用户名: 你的坚果云邮箱
密码: 应用专用密码（在 坚果云 → 账户信息 → 安全选项 → 第三方应用管理 中生成）
```

设置步骤：
1. 在坚果云中创建一个名为 `zotero` 的文件夹
2. 在坚果云账户设置中生成应用专用密码
3. 在 Zotero 中填入上述 URL、用户名和密码
4. 点击 "Verify Server" 确认连接成功

:::caution WebDAV 注意事项
- 坚果云免费版每月上传流量限制 1 GB，对于正常文献管理足够
- WebDAV 同步的是**加密的 zip 文件**，不能直接在坚果云网页上浏览 PDF
- 如果需要在坚果云上直接查看 PDF，应使用"链接附件"方案而非 WebDAV
:::

**Dropbox 作为 WebDAV**：

Dropbox **不原生支持 WebDAV**。如果你想用 Dropbox 同步 Zotero 附件，有两种替代方式：

1. **使用 Zotero 的"链接附件"功能**：
   - 将 Zotero 数据目录设为 Dropbox 同步文件夹中的路径
   - `Settings → Advanced → Files and Folders → Linked Attachment Base Directory` 设为 Dropbox 中的文件夹
   - 注意：多设备间路径必须一致

2. **使用第三方 WebDAV 桥接服务**（不推荐，不稳定）

#### 方案二：同步盘直接同步数据目录

将 Zotero 的**存储目录**放在同步盘中：

```bash
# 查看 Zotero 数据目录位置
# Zotero → Settings → Advanced → Files and Folders → Data Directory Location

# 默认位置：
# macOS: ~/Zotero/
# Linux: ~/Zotero/
# Windows: C:\Users\username\Zotero\
```

:::caution 重要警告
**不要**将整个 Zotero 数据目录（包含 `zotero.sqlite` 数据库）放在同步盘中。数据库文件被多个客户端同时写入会损坏。

**正确做法**：只同步 `storage` 子目录（存放 PDF 的地方），或者使用 WebDAV。
:::

### 推荐的同步策略

```
元数据（条目信息、笔记）  →  Zotero 官方同步（免费，不限量）
附件（PDF 文件）         →  WebDAV（坚果云）或 Zotero 付费方案
.bib 文件               →  Better BibTeX 自动导出 + Git 管理
```

### 备份

:::caution 同步不是备份
同步只是让多台设备保持一致。如果你在一台设备上误删了文献，同步会把删除操作同步到所有设备。

定期导出文献库作为备份：`File → Export Library`（选择 Zotero RDF 格式，勾选"Export Files"）。
:::

---

## 23.8 一个推荐工作流

### 日常工作流

```
Step 1: 发现论文
    │   浏览 arXiv / Google Scholar / 期刊网站
    ▼
Step 2: 一键保存
    │   点击 Zotero Connector 图标
    ▼
Step 3: 整理分类
    │   添加到文件夹、打标签（#to-read）
    ▼
Step 4: 阅读和标注
    │   用 Zotero 内置阅读器标注 PDF
    ▼
Step 5: 写阅读笔记
    │   提取注释，添加个人总结
    ▼
Step 6: 引用
    │   写论文时通过 Better BibTeX / Word 插件引用
    ▼
Step 7: 同步
        自动同步到云端
```

### 推荐插件清单

| 插件 | 功能 | 安装地址 |
|------|------|---------|
| Better BibTeX | BibTeX 管理、citation key、自动导出 | retorque.re/zotero-better-bibtex |
| Zotero PDF Translate | PDF 内划词翻译 | github.com/windingwind/zotero-pdf-translate |
| Zotero Style | 自定义条目显示样式 | github.com/MuiseDestiny/zotero-style |
| Zotero GPT | AI 辅助阅读 | github.com/MuiseDestiny/zotero-gpt |
| DOI Manager | 查找和更新 DOI | github.com/bwiernik/zotero-shortdoi |

:::info 关于 ZotFile
在 Zotero 7 中，原先 ZotFile 的大部分功能（PDF 重命名、自动附件管理）已经内置。如果你使用 Zotero 7+，不需要额外安装 ZotFile。
:::

### 文件命名规则

在 `Settings → General → File Renaming` 中配置 PDF 命名规则：

```
{{ firstCreator }}_{{ year }}_{{ title | truncate(50) }}
# 例如：Onsager_1944_Crystal Statistics I A Two-Dimensional
```

这样即使离开 Zotero，你也能通过文件名识别 PDF 内容。

---

## 常见问题

**Q: Zotero 和 Mendeley / EndNote 比怎么样？**
A: Zotero 是**免费开源**的，社区插件丰富，BibTeX 支持最好。Mendeley 被 Elsevier 收购后限制增多。EndNote 是收费软件。对于物理学生，强烈推荐 Zotero。

**Q: 300 MB 免费空间够用吗？**
A: 如果只同步元数据（不同步 PDF），几乎无限够用。同步 PDF 的话，建议用坚果云 WebDAV 方案。

**Q: 如何处理 arXiv 预印本和正式发表版本的关系？**
A: Zotero 可以手动合并重复条目。或者只保留正式发表版本，在 Notes 中记录 arXiv ID。

**Q: 多人协作怎么办？**
A: 使用 Zotero Groups。创建一个 Group Library，邀请成员加入，共享文献和笔记。

---

## 小结

- **Zotero 是物理学生最推荐的文献管理工具**——免费、开源、功能强大
- 安装 Zotero Connector 浏览器插件，养成一键保存的习惯
- 使用文件夹 + 标签建立分类体系
- 安装 **Better BibTeX** 实现与 LaTeX 的无缝协作
- 配置坚果云 WebDAV 或 Zotero 付费方案实现 PDF 同步
- 从第一篇论文开始管理，**越早越好**

---

## 练习

1. 安装 Zotero 和 Zotero Connector，注册 Zotero 账户
2. 从 arXiv 或 Google Scholar 保存 5 篇论文到 Zotero
3. 创建文件夹和标签体系，对保存的论文进行分类
4. 安装 Better BibTeX，导出一个 `.bib` 文件
5. 在一个简单的 LaTeX 文档中用导出的 `.bib` 文件插入引用
6. （可选）配置坚果云 WebDAV 同步
