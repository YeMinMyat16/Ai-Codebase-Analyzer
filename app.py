import streamlit as st
import requests

API_URL = "http://127.0.0.1:8000"

st.set_page_config(page_title="AI Codebase Analyzer", layout="wide")

st.title("🧠 AI Codebase Analyzer")
st.markdown("Analyze your local codebase using local LLMs (via Ollama).")

# Sidebar for config
with st.sidebar:
    st.header("Configuration")
    folder_path = st.text_input("Folder Path", value=".")
    max_files = st.slider("Max Files to Analyze", min_value=1, max_value=200, value=50)
    model_name = st.selectbox("Ollama Model", ["qwen2.5-coder:3b", "deepseek-coder:1.3b", "qwen2.5-coder", "deepseek-coder"])
    
if "analyzed" not in st.session_state:
    st.session_state.analyzed = False
if "analysis_results" not in st.session_state:
    st.session_state.analysis_results = None

if st.button("🚀 Analyze Codebase"):
    if not folder_path:
        st.error("Please provide a valid folder path.")
    else:
        with st.spinner(f"Analyzing {folder_path} ... This may take a while depending on project size."):
            try:
                payload = {
                    "folder_path": folder_path,
                    "max_files": max_files,
                    "model": model_name
                }
                response = requests.post(f"{API_URL}/analyze", json=payload)
                
                if response.status_code == 200:
                    st.session_state.analysis_results = response.json()
                    st.session_state.analyzed = True
                    st.success("Analysis complete!")
                else:
                    st.error(f"Error: {response.json().get('detail', 'Unknown error')}")
            except requests.exceptions.ConnectionError:
                st.error("Failed to connect to backend. Is FastAPI running?")

# Display Results
if st.session_state.analyzed and st.session_state.analysis_results:
    tabs = st.tabs(["🏗 Project Summary", "📄 File Summaries", "💬 Ask Q&A"])
    
    with tabs[0]:
        st.subheader("Project Architecture & Overview")
        st.markdown(st.session_state.analysis_results["project_summary"])
        
    with tabs[1]:
        st.subheader("Individual File Insights")
        file_summaries = st.session_state.analysis_results["file_summaries"]
        for filepath, summary in file_summaries.items():
            with st.expander(f"📁 {filepath}"):
                st.markdown(summary)
                
    with tabs[2]:
        st.subheader("Chat with your Codebase")
        user_q = st.text_input("Ask a question about the project:")
        if st.button("Ask"):
            if user_q:
                with st.spinner("Thinking..."):
                    try:
                        resp = requests.post(f"{API_URL}/ask", json={
                            "folder_path": folder_path,
                            "question": user_q,
                            "model": model_name
                        })
                        if resp.status_code == 200:
                            st.markdown("### Answer")
                            st.write(resp.json()["answer"])
                        else:
                            st.error(f"Error: {resp.json().get('detail', 'Unknown error')}")
                    except requests.exceptions.ConnectionError:
                        st.error("Failed to connect to backend.")
            else:
                st.warning("Please enter a question.")
