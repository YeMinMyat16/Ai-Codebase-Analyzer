# 🧠 AI Codebase Analyzer

An automated local codebase visualization and analysis tool powered by **FastAPI**, **Streamlit**, and **Ollama**.
This tool allows you to recursively scan any local repository, generate detailed file-level architectural summaries using local LLMs (like `qwen2.5-coder` or `llama3`), and interactively ask questions about your code!

*(You can add a screenshot here by saving an image file like `screenshot.png` in this folder and adding `![App Screenshot](screenshot.png)` to this file!)*

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
You need to run both the FastAPI backend and the Streamlit frontend. Open two terminals:

**Terminal 1: Start Backend**
```bash
.\.venv\Scripts\activate
python -m uvicorn main:app --reload
```

**Terminal 2: Start Frontend**
```bash
.\.venv\Scripts\activate
python -m streamlit run app.py
```
Then, open your browser to `http://localhost:8501`.

## 📸 How to Add Screenshots
To add screenshots to this README:
1. Save your screenshot image (e.g., `analyzer-ui.png`) directly into your project folder.
2. Open this `README.md` file in an editor.
3. Add the following line of code wherever you want the image to appear:
`![My App UI](analyzer-ui.png)`
4. Commit and push the changes to GitHub!
