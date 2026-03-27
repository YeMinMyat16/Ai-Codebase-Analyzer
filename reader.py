import os

MAX_LINES = 3000
ALLOWED_EXTENSIONS = {'.py', '.js', '.ts', '.html', '.css'}

def is_binary(filepath: str) -> bool:
    try:
        with open(filepath, 'tr') as check_file:
            check_file.read(1024)
            return False
    except UnicodeDecodeError:
        return True

def read_directory(folder_path: str, max_files: int = 50) -> dict[str, str]:
    """
    Recursively scans a folder and returns a dict mapping filepaths to their code.
    Enforces a max_files limit.
    """
    file_contents = {}
    file_count = 0

    if not os.path.isdir(folder_path):
        raise ValueError(f"Invalid directory: {folder_path}")

    for root, dirs, files in os.walk(folder_path):
        # Skip typical virtual environment, git, and cache folders
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('venv', 'node_modules', '__pycache__')]

        for file in files:
            if file_count >= max_files:
                return file_contents
            
            ext = os.path.splitext(file)[1].lower()
            if ext not in ALLOWED_EXTENSIONS:
                continue
                
            filepath = os.path.join(root, file)
            if is_binary(filepath):
                continue
                
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    if len(lines) > MAX_LINES:
                        continue # Skip huge files
                    
                    file_contents[filepath] = "".join(lines)
                    file_count += 1
            except Exception as e:
                print(f"Error reading {filepath}: {e}")
                
    return file_contents
