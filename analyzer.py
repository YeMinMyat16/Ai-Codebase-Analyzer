import os
import json
import hashlib
from reader import read_directory
from summarizer import summarize_file, summarize_project, answer_question

CACHE_FILE = ".analyzer_cache.json"

def get_file_hash(content: str) -> str:
    return hashlib.md5(content.encode('utf-8')).hexdigest()

def load_cache(folder_path: str) -> dict:
    cache_path = os.path.join(folder_path, CACHE_FILE)
    if os.path.exists(cache_path):
        try:
            with open(cache_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def save_cache(folder_path: str, cache_data: dict):
    cache_path = os.path.join(folder_path, CACHE_FILE)
    try:
        with open(cache_path, 'w', encoding='utf-8') as f:
            json.dump(cache_data, f, indent=4)
    except Exception as e:
        print(f"Error saving cache: {e}")

def run_analysis(folder_path: str, max_files: int = 50, model: str = "qwen2.5-coder") -> dict:
    files_content = read_directory(folder_path, max_files=max_files)
    if not files_content:
        return {"error": "No valid source files found in the directory."}
        
    cache_data = load_cache(folder_path)
    file_summaries = {}
    
    for filepath, content in files_content.items():
        rel_path = os.path.relpath(filepath, folder_path)
        content_hash = get_file_hash(content)
        
        # Check cache
        if rel_path in cache_data and cache_data[rel_path].get("hash") == content_hash:
            print(f"Using cached summary for {rel_path}")
            file_summaries[rel_path] = cache_data[rel_path]["summary"]
        else:
            print(f"Analyzing {rel_path}...")
            summary = summarize_file(rel_path, content, model)
            file_summaries[rel_path] = summary
            cache_data[rel_path] = {
                "hash": content_hash,
                "summary": summary
            }

    save_cache(folder_path, cache_data)
    
    # Combine summaries for project-level analysis
    combined_summaries = ""
    for rel_path, summary in file_summaries.items():
        combined_summaries += f"--- File: {rel_path} ---\n{summary}\n\n"
        
    print("Generating project-level summary...")
    project_summary = summarize_project(combined_summaries, model)
    
    return {
        "project_summary": project_summary,
        "file_summaries": file_summaries,
        "raw_combined_summaries": combined_summaries  # Useful for QA context
    }

def answer_user_question(folder_path: str, question: str, model: str = "qwen2.5-coder") -> str:
    # Build context from cache if it exists, otherwise we'd need to re-run analysis
    cache_data = load_cache(folder_path)
    if not cache_data:
        return "No cached analysis found for this folder. Please run the analysis first."
        
    combined_summaries = ""
    for rel_path, data in cache_data.items():
        combined_summaries += f"--- File: {rel_path} ---\n{data.get('summary', '')}\n\n"
        
    return answer_question(combined_summaries, question, model)
