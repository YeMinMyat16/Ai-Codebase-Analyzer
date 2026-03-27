import requests
from prompts import FILE_SUMMARY_PROMPT, PROJECT_SUMMARY_PROMPT, QA_PROMPT

OLLAMA_API_URL = "http://localhost:11434/api/generate"

def call_ollama(prompt: str, model: str = "qwen2.5-coder") -> str:
    """Helper to send prompt to Ollama and get response."""
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=120)
        response.raise_for_status()
        return response.json().get("response", "")
    except requests.exceptions.RequestException as e:
        print(f"Ollama API error: {e}")
        return f"Error connecting to Ollama: {e}"

def summarize_file(filepath: str, code_snippet: str, model: str = "qwen2.5-coder") -> str:
    """Summarizes a specific file."""
    # Truncate strictly for the local LLM if the file is large
    # Even if max lines is 3000, context window might complain
    if len(code_snippet) > 10000:
        code_snippet = code_snippet[:10000] + "\n...[TRUNCATED]"

    prompt = FILE_SUMMARY_PROMPT.format(code_snippet=code_snippet)
    return call_ollama(prompt, model)

def summarize_project(summaries: str, model: str = "qwen2.5-coder") -> str:
    """Generates overarching architectural review based on file summaries."""
    # Ensure context fits within context window, slice roughly
    if len(summaries) > 16000:
        summaries = summaries[:16000] + "\n...[TRUNCATED context]"
        
    prompt = PROJECT_SUMMARY_PROMPT.format(summaries=summaries)
    return call_ollama(prompt, model)

def answer_question(context: str, question: str, model: str = "qwen2.5-coder") -> str:
    """Answers a question using provided context."""
    if len(context) > 16000:
        context = context[:16000] + "\n...[TRUNCATED context]"
        
    prompt = QA_PROMPT.format(summaries=context, user_question=question)
    return call_ollama(prompt, model)
