# Contributing Guide

Thank you for your interest in this project! We welcome contributions in the following ways.

## How to Contribute

### Reporting Issues

If you find errors, outdated content, or have suggestions for improvement, please submit them via [Issues](https://github.com/ChrisWenChen/theory-computing-physics-guide/issues).

When submitting an issue, please include:

- The chapter or page where the issue occurs
- A clear description of the problem
- A suggested fix, if possible

### Submitting Changes

1. **Fork** this repository
2. Create your feature branch: `git checkout -b feature/my-improvement`
3. Commit your changes: `git commit -m "Describe your changes"`
4. Push to your branch: `git push origin feature/my-improvement`
5. Create a **Pull Request**

### Content Contributions

We welcome the following types of contributions:

- Fixing typos or grammatical errors
- Supplementing or updating existing chapters
- Adding new tutorials or guides
- Improving code examples
- Translating content (Chinese/English)

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm start

# Build
npm run build
```

## Documentation Structure

Documentation is organized by chapter number under the `docs/` directory:

- `00-preface` ~ `05-editors`: Fundamentals
- `06-ssh` ~ `08-remote-tools`: Remote & Collaboration
- `09-markdown-latex` ~ `10-obsidian`: Docs & Knowledge Management
- `11-bash` ~ `18-julia`: Programming Languages & Computing Tools
- `19-ai-coding` ~ `22-vibe-coding`: Modern Dev Practices
- `23-zotero` ~ `24-sync-backup`: Data Management

## Writing Guidelines

- Write in Markdown following the [Docusaurus](https://docusaurus.io/) format
- Label code blocks with the language type (e.g., ` ```bash `, ` ```python `)
- Add a space between Chinese and English text (e.g., "使用 Python 进行计算")
- Keep content concise and practical, targeting physics students and researchers

## Code of Conduct

- Respect all contributors
- Provide constructive feedback
- Focus on improving content quality

## License

Your contributions will be licensed under the project's [CC BY-SA 4.0](LICENSE) license.
