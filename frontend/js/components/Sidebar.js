class Sidebar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <aside class="w-64 fixed top-0 left-0 h-full bg-[#111827] border-r border-[#1e293b] flex flex-col items-center py-6 px-4 z-20 shadow-xl">
                <div class="mb-10 w-full">
                    <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
                        <i class="ph ph-brain mr-2 text-blue-400"></i>AI Analyzer
                    </h1>
                </div>

                <div class="flex-1 w-full space-y-6">
                    <div>
                        <label class="block text-sm font-semibold text-gray-400 mb-2">Folder Path</label>
                        <div class="relative">
                            <i class="ph ph-folder absolute left-3 top-3 text-gray-500"></i>
                            <input type="text" id="config-folder" value="." 
                                class="w-full bg-[#1e293b] text-gray-300 rounded-xl py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 placeholder-gray-500 text-sm transition"
                                placeholder="C:\\path\\to\\project">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-400 mb-2">Max Files</label>
                        <input type="range" id="config-max-files" min="1" max="200" value="50" 
                            class="w-full accent-blue-500 rounded-lg cursor-pointer">
                        <div class="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1</span>
                            <span id="config-max-files-display" class="font-bold text-gray-300">50</span>
                            <span>200</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-400 mb-2">Ollama Model</label>
                        <div class="relative">
                            <select id="config-model" class="w-full bg-[#1e293b] text-gray-300 rounded-xl py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 appearance-none text-sm cursor-pointer transition">
                                <option value="qwen2.5-coder:3b">qwen2.5-coder:3b</option>
                                <option value="deepseek-coder:1.3b">deepseek-coder:1.3b</option>
                                <option value="qwen2.5-coder">qwen2.5-coder</option>
                                <option value="deepseek-coder">deepseek-coder</option>
                            </select>
                            <i class="ph ph-caret-down absolute right-3 top-3 text-gray-500 pointer-events-none"></i>
                        </div>
                    </div>
                </div>

                <div class="w-full mt-auto">
                    <button id="btn-analyze" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition duration-200 transform hover:scale-[1.02] shadow-[0_0_15px_rgba(37,99,235,0.4)] flex justify-center items-center">
                        <i class="ph ph-rocket-launch text-lg mr-2"></i> Analyze
                    </button>
                    <p id="error-message" class="text-xs text-red-400 mt-3 text-center hidden"></p>
                </div>
            </aside>
        `;

        this.attachEvents();
    }

    attachEvents() {
        const slider = document.getElementById('config-max-files');
        const display = document.getElementById('config-max-files-display');
        slider.addEventListener('input', (e) => {
            display.textContent = e.target.value;
        });
    }

    getValues() {
        return {
            folderPath: document.getElementById('config-folder').value.trim() || '.',
            maxFiles: parseInt(document.getElementById('config-max-files').value, 10),
            model: document.getElementById('config-model').value
        };
    }

    setLoading(isLoading) {
        const btn = document.getElementById('btn-analyze');
        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = `<i class="ph ph-circle-notch animate-spin text-lg mr-2"></i> Analyzing...`;
            btn.classList.replace('bg-blue-600', 'bg-blue-800');
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            btn.disabled = false;
            btn.innerHTML = `<i class="ph ph-rocket-launch text-lg mr-2"></i> Analyze`;
            btn.classList.replace('bg-blue-800', 'bg-blue-600');
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    showError(msg) {
        const err = document.getElementById('error-message');
        if (msg) {
            err.textContent = msg;
            err.classList.remove('hidden');
        } else {
            err.classList.add('hidden');
        }
    }
}
