# 🧠 AI Codebase Analyzer

An automated local codebase visualization and analysis tool powered by **FastAPI**, **HTML/JS (Tailwind)**, and **Ollama**.
This tool allows you to recursively scan any local repository, generate detailed file-level architectural summaries using local LLMs (like `qwen2.5-coder` or `llama3`), and interactively ask questions about your code!

<div align="center">
  <img src="Screenshots/Screenshot%202026-03-28%20150821.png" alt="App Screenshot" width="800">
  <br>
  <br>
  <img src="Screenshots/Screenshot%202026-03-28%20150838.png" alt="Analysis Results" width="800">
</div>

## ✨ Features
- **Local AI Privacy**: Your code never leaves your machine! It connects directly to your local Ollama instance.
- **Smart Caching**: Generates MD5 hashes for each file to cache summaries, resulting in instantaneous subsequent runs if the code hasn't changed.
- **Scalable Scanning**: Automatically skips binary files and massive scripts to protect context windows.
- **Project Overviews & Q&A**: Get high-level architecture breakdowns, or chat directly with the context of your codebase.

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- [Ollama](https://ollama.ai/) installed and running locally.
- At least one local LLM pulled. For example:
  ```bash
  ollama pull qwen2.5-coder:3b
  ```

### 2. Installation
Clone the repository and set up a Python virtual environment:
```bash
git clone https://github.com/YeMinMyat16/Ai-Codebase-Analyzer.git
cd Ai-Codebase-Analyzer
python -m venv .venv
.\.venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

### 3. Usage
You only need to run the unified FastAPI backend, which will automatically serve the modern web frontend.

**Start the Server**
```bash
.\.venv\Scripts\activate
python -m uvicorn main:app --reload
```

Then, open your browser to `http://localhost:8000`.

