---
sidebar_position: 23
sidebar_label: "23. Zotero References"
---

# Chapter 23: Zotero and Reference Management

> Every paper you've read should be findable within 30 seconds.

## Chapter Goals

After reading this chapter, you should be able to:

- Install and configure Zotero and its core plugins
- Use Zotero Connector to save references with one click
- Build a systematic reference classification, tagging, and annotation system
- Integrate Zotero with LaTeX, Word, and Obsidian
- Implement reference library backup and multi-device synchronization

## Motivation

The first step in research is reading literature. You've probably downloaded dozens or even hundreds of PDFs, scattered across various folders:

```
Downloads/
├── paper.pdf
├── paper(1).pdf
├── quantum_computing_review.pdf
├── 1905.12345.pdf
├── important_paper_must_read.pdf
└── ...
```

Six months later, you have no idea which paper is about what, who wrote it, or where it was published. When writing a paper and needing citations, you have to search Google Scholar again for BibTeX.

**Zotero solves exactly this problem.** It is a free, open-source reference management tool that helps you systematically collect, organize, cite, and share academic literature.

---

## 23.1 Why You Should Build Reference Management Habits Early

| Without Reference Management | With Zotero |
|------------------------------|-------------|
| PDFs scattered everywhere | Unified management, instant retrieval |
| Citation formats entered manually | One-click citation insertion |
| BibTeX maintained manually | Auto-generated, auto-synced |
| Forgetting paper contents | Notes and annotations always accessible |
| Losing references when changing computers | Cloud sync, multi-device access |

:::tip The Sooner the Better
The benefits of reference management are **cumulative**. Start managing from your very first paper, and you'll thank yourself when writing your thesis.
:::

---

## 23.2 Installing Zotero

### Download and Install

Zotero supports macOS, Windows, and Linux:

```
Official download: https://www.zotero.org/download/
```

| Platform | Installation Method |
|----------|-------------------|
| macOS | Download `.dmg`, drag to Applications; or `brew install --cask zotero` |
| Windows | Download `.exe` installer |
| Ubuntu | Download `.tar.bz2` or use Flatpak: `flatpak install flathub org.zotero.Zotero` |

### Register a Zotero Account

Go to https://www.zotero.org/user/register to register an account, used for:

- Cloud syncing your reference library (300 MB free)
- Online library access
- Group collaboration

After installation, open Zotero and log in under `Edit → Settings → Sync`.

---

## 23.3 Browser Plugin (Zotero Connector)

Zotero Connector is Zotero's browser extension, allowing you to save references with one click while browsing the web.

### Installation

On the https://www.zotero.org/download/ page, click the Connector link for your browser:

- Chrome / Edge / Brave
- Firefox
- Safari

### Usage

1. Open a paper page (e.g., arXiv, Google Scholar, journal website)
2. Click the Zotero icon in the browser toolbar
3. Reference information is automatically saved to Zotero, and the PDF is auto-downloaded (if available)

### Supported Websites

Zotero Connector supports hundreds of academic websites, including:

- **arXiv**: Automatically extracts metadata and PDF
- **Google Scholar**: Captures search results
- **Web of Science / Scopus**: Major databases
- **Journal websites**: APS (Physical Review), Springer, Elsevier, Nature, etc.
- **Amazon / Douban**: Book information

:::info Batch Saving
On search result pages (e.g., Google Scholar), the Zotero icon changes to a folder shape. Click it to batch-select and save multiple references.
:::

---

## 23.4 Reference Items, Tags, and Collections

### Reference Items

Each reference record contains:

- **Metadata**: Title, authors, journal, year, DOI, arXiv ID, etc.
- **Attachments**: Full-text PDF, supplementary materials
- **Notes**: Your reading notes
- **Tags**: Custom classification tags

### Collections (Folders)

Organize references using collections, for example:

```
My Library
├── Topic 1: Ising Model
│   ├── Classic Papers
│   ├── Monte Carlo Methods
│   └── Finite-Size Scaling
├── Topic 2: Topological Insulators
├── Methods
│   ├── Monte Carlo
│   ├── DFT
│   └── Machine Learning
├── To Read
└── Courses
    ├── Statistical Mechanics
    └── Quantum Mechanics
```

:::tip One Paper Can Belong to Multiple Collections
Zotero's collections are "virtual classifications" — a single paper can appear in multiple collections simultaneously (without duplicate storage).
:::

### Tags

Tags provide more flexible classification than collections:

| Tag Type | Examples |
|----------|----------|
| Topic | `#ising-model`, `#monte-carlo`, `#phase-transition` |
| Status | `#to-read`, `#reading`, `#finished` |
| Importance | `#important`, `#key-paper` |
| Purpose | `#thesis`, `#proposal`, `#presentation` |
| Evaluation | `#well-written`, `#good-review` |

In Zotero, you can quickly filter references through the tag panel (bottom left).

---

## 23.5 PDF Management and Annotation

### Built-in PDF Reader

Zotero 6+ includes a built-in PDF reader that supports:

- **Highlighting**: Select text and choose a color
- **Notes**: Add annotations at highlighted sections
- **Area annotations**: Draw boxes around figures or equations
- **Color-coded tags**: Use different colors for different types (e.g., yellow=definition, red=key conclusion)

### Recommended Color Coding

| Color | Meaning | Use Case |
|-------|---------|----------|
| Yellow | Key conclusions | Core findings of the paper |
| Red | Important formulas | Formulas you need to use or derive |
| Green | Method descriptions | Algorithm and experimental method details |
| Blue | To verify | Content you don't understand or need to confirm |
| Purple | Worth citing | Passages you might cite when writing papers |

### Extracting Annotations

Right-click a reference item -> "Add Note from Annotations" to extract all PDF annotations into a note, convenient for viewing or exporting within Zotero.

---

## 23.6 Integration with LaTeX / Word / Obsidian

### LaTeX Integration: Better BibTeX Plugin

**Better BibTeX** is one of Zotero's most important plugins, used for generating and syncing `.bib` files.

#### Installation

1. Go to https://retorque.re/zotero-better-bibtex/installation/
2. Download the `.xpi` file
3. In Zotero: `Tools → Add-ons → Install Add-on From File`

#### Configure Auto-Export

1. Right-click your collection in Zotero -> "Export Collection"
2. Choose "Better BibTeX" as the format
3. Check "Keep updated" (auto-sync)
4. Choose save path (place it in your LaTeX project directory)

```bash
# Your LaTeX project directory
my_paper/
├── main.tex
├── references.bib    # ← Automatically maintained by Better BibTeX
├── figures/
└── ...
```

#### Citing in LaTeX

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

#### Citation Key Format

In `Settings → Better BibTeX → Citation Keys`, set the key format:

```
# Recommended format: author+year
[auth:lower][year]
# e.g.: onsager1944, newman1999

# If duplicates exist, suffix is added automatically:
# onsager1944a, onsager1944b
```

---

## 23.7 Library Synchronization and Backup

Zotero sync consists of two parts: **metadata sync** (item info, notes) and **attachment sync** (PDF files).

### Zotero Official Sync

- **Metadata**: Always synced via Zotero's official servers, free and unlimited
- **Free attachment quota**: 300 MB (fills up quickly when storing PDFs)
- **Paid plans**: 2 GB ($20/year), 6 GB ($60/year), Unlimited ($120/year)

### Syncing Attachments with Cloud Storage

The most flexible and economical approach is to use cloud storage to manage Zotero's attachment storage.

#### Option 1: WebDAV (Recommended)

Zotero natively supports the WebDAV protocol for syncing attachments. Configuration path: `Settings → Sync → File Syncing → WebDAV`

**Nutstore (Jianguoyun)** (recommended in mainland China):

```
URL: https://dav.jianguoyun.com/dav/zotero/
Username: your_email
Password: App-specific password (generated in Nutstore settings)
```

1. Create a folder named `zotero` in Nutstore
2. Generate an app-specific password in Nutstore settings
3. Enter the URL, username, and app password in Zotero
4. Click "Verify Server" to confirm the connection

:::caution WebDAV Notes
- Nutstore's free plan limits uploads to 1 GB per month, which is sufficient for normal reference management
- WebDAV syncs **encrypted zip files**, so you cannot browse PDFs directly on Nutstore's web interface
- If you need to view PDFs directly on Nutstore, use the "linked attachments" approach instead of WebDAV
:::

**Dropbox as WebDAV**:

Dropbox **does not natively support WebDAV**. If you want to use Dropbox to sync Zotero attachments, there are two alternatives:

1. **Use Zotero's "linked attachments" feature**:
   - Set Zotero's data directory to a path within your Dropbox sync folder
   - `Settings → Advanced → Files and Folders → Linked Attachment Base Directory` set to a folder in Dropbox
   - Note: paths must be consistent across multiple devices

2. **Use a third-party WebDAV bridge service** (not recommended, unstable)

#### Option 2: Directly Syncing the Data Directory with Cloud Storage

Place Zotero's **storage directory** inside a cloud-synced folder:

```bash
# Find Zotero's data directory
# macOS: ~/Zotero/storage/
# Linux: ~/Zotero/storage/
# Windows: C:\Users\<user>\Zotero\storage\
```

:::caution Important Warning
**Do not** place the entire Zotero data directory (which contains the `zotero.sqlite` database) in a cloud-synced folder. The database file will become corrupted if written to by multiple clients simultaneously.

**Correct approach**: Only sync the `storage` subdirectory (where PDFs are stored), or use WebDAV.
:::

### Recommended Sync Strategy

```
Metadata (item info, notes)  →  Zotero official sync (free, unlimited)
Attachments (PDF files)      →  WebDAV (Nutstore) or Zotero paid plan
.bib files                   →  Better BibTeX auto-export + Git management
```

### Backup

:::caution Sync Is Not Backup
Sync only keeps multiple devices consistent. If you accidentally delete a reference on one device, the deletion will be synced to all devices.

Periodically export your library as a backup: `File → Export Library` (choose Zotero RDF format, check "Export Files").
:::

---

## 23.8 A Recommended Workflow

### Daily Workflow

```
Step 1: Discover a paper
    │   Browse arXiv / Google Scholar / journal websites
    ▼
Step 2: One-click save
    │   Click the Zotero Connector icon
    ▼
Step 3: Organize and classify
    │   Add to collection, add tags (#to-read)
    ▼
Step 4: Read and annotate
    │   Annotate PDF using Zotero's built-in reader
    ▼
Step 5: Write reading notes
    │   Extract annotations, add personal summary
    ▼
Step 6: Cite
    │   Cite via Better BibTeX / Word plugin when writing papers
    ▼
Step 7: Sync
        Auto-sync to the cloud
```

### Recommended Plugin List

| Plugin | Function | Installation Link |
|--------|----------|-------------------|
| Better BibTeX | BibTeX management, citation keys, auto-export | retorque.re/zotero-better-bibtex |
| Zotero PDF Translate | In-PDF word translation | github.com/windingwind/zotero-pdf-translate |
| Zotero Style | Custom item display styles | github.com/MuiseDestiny/zotero-style |
| Zotero GPT | AI-assisted reading | github.com/MuiseDestiny/zotero-gpt |
| DOI Manager | Find and update DOIs | github.com/bwiernik/zotero-shortdoi |

:::info About ZotFile
In Zotero 7, most of ZotFile's features (PDF renaming, auto attachment management) are now built-in. If you're using Zotero 7+, you don't need to install ZotFile separately.
:::

### File Naming Rules

In `Settings → General → File Renaming`, configure the PDF naming rule:

```
{{ firstCreator }}_{{ year }}_{{ title | truncate(50) }}
# e.g.: Onsager_1944_Crystal Statistics I A Two-Dimensional
```

This way, even outside Zotero, you can identify PDF contents by filename.

---

## FAQ

**Q: How does Zotero compare to Mendeley / EndNote?**
A: Zotero is **free and open-source**, with a rich community plugin ecosystem and the best BibTeX support. Mendeley has added restrictions since being acquired by Elsevier. EndNote is paid software. For physics students, Zotero is strongly recommended.

**Q: Is the 300 MB free space enough?**
A: If you only sync metadata (not PDFs), it's practically unlimited. For syncing PDFs, consider the Nutstore WebDAV approach.

**Q: How do I handle the relationship between arXiv preprints and published versions?**
A: Zotero can manually merge duplicate items. Or just keep the published version and note the arXiv ID in Notes.

**Q: What about multi-person collaboration?**
A: Use Zotero Groups. Create a Group Library, invite members to join, and share references and notes.

---

## Summary

- **Zotero is the most recommended reference management tool for physics students** — free, open-source, and powerful
- Install the Zotero Connector browser plugin and build the habit of one-click saving
- Use collections + tags to build a classification system
- Install **Better BibTeX** for seamless LaTeX integration
- Configure Nutstore WebDAV or a Zotero paid plan for PDF synchronization
- Start managing from your very first paper — **the sooner the better**

---

## Exercises

1. Install Zotero and Zotero Connector, register a Zotero account
2. Save 5 papers from arXiv or Google Scholar to Zotero
3. Create a collection and tag system, classify the saved papers
4. Install Better BibTeX and export a `.bib` file
5. Insert citations using the exported `.bib` file in a simple LaTeX document
6. (Optional) Configure Nutstore WebDAV synchronization
