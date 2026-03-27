from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from analyzer import run_analysis, answer_user_question
import os

app = FastAPI(title="AI Codebase Analyzer API")

class AnalyzeRequest(BaseModel):
    folder_path: str
    max_files: int = 50
    model: str = "qwen2.5-coder"

class AskRequest(BaseModel):
    folder_path: str
    question: str
    model: str = "qwen2.5-coder"

@app.post("/analyze")
def api_analyze(req: AnalyzeRequest):
    if not os.path.exists(req.folder_path):
        raise HTTPException(status_code=400, detail="Folder path does not exist.")
    
    try:
        result = run_analysis(req.folder_path, max_files=req.max_files, model=req.model)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        # Do not return raw combining string to save bandwidth, keep it in backend cache
        return {
            "project_summary": result["project_summary"],
            "file_summaries": result["file_summaries"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
def api_ask(req: AskRequest):
    if not os.path.exists(req.folder_path):
        raise HTTPException(status_code=400, detail="Folder path does not exist.")
        
    try:
        answer = answer_user_question(req.folder_path, req.question, req.model)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
