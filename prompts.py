FILE_SUMMARY_PROMPT = """You are a senior software engineer. Analyze this code and explain:
1. What this file does
2. Key functions/classes
3. Any bugs or bad practices

Code:
{code_snippet}
"""

PROJECT_SUMMARY_PROMPT = """You are an expert system architect. Based on these file summaries:

{summaries}

Explain:
1. Overall purpose
2. System architecture
3. How components interact
4. Suggestions for improvement
"""

QA_PROMPT = """You are a codebase assistant. Based on this project context:

{summaries}

Answer this question:
{user_question}
"""
