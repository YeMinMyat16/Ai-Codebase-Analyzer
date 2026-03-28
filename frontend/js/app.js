document.addEventListener('DOMContentLoaded', () => {

    // Initialize Components
    const dashboard = new Dashboard('dashboard-root');
    const sidebar = new Sidebar('sidebar-root');
    
    // Setup ChatBar callback
    const chatBar = new ChatBar('chatbar-root', async (question) => {
        const config = sidebar.getValues();
        try {
            const result = await appState.askQuestion(config.folderPath, config.model, question);
            chatBar.addMessage(result.answer, 'bot');
        } catch (e) {
            chatBar.addMessage('⚠️ Error: ' + e.message, 'bot');
        }
    });

    // App State Management
    const appState = {
        async analyzeCodebase(folderPath, maxFiles, model) {
            const resp = await fetch('/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder_path: folderPath, max_files: maxFiles, model })
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.detail || 'Analysis failed');
            return data;
        },

        async askQuestion(folderPath, model, question) {
            const resp = await fetch('/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder_path: folderPath, model, question })
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.detail || 'Ask request failed');
            return data;
        }
    };

    // Attach Main Action
    document.getElementById('btn-analyze').addEventListener('click', async () => {
        const config = sidebar.getValues();
        if (!config.folderPath) {
            sidebar.showError('Folder path is required.');
            return;
        }

        sidebar.showError('');
        sidebar.setLoading(true);
        document.getElementById('dashboard-root').innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 animate-pulse pt-32">
                <i class="ph ph-circle-notch animate-spin text-6xl text-blue-500 mb-2"></i>
                <p class="text-xl">Analyzing ${config.folderPath} ...</p>
                <p class="text-sm text-gray-600">This might take a while depending on project size and LLM speed.</p>
            </div>
        `;

        try {
            const result = await appState.analyzeCodebase(config.folderPath, config.maxFiles, config.model);
            dashboard.render(result);
            sidebar.setLoading(false);
        } catch (e) {
            sidebar.setLoading(false);
            sidebar.showError(e.message);
            document.getElementById('dashboard-root').innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-red-500 pt-32 space-y-4">
                    <i class="ph ph-warning-circle text-6xl mb-2"></i>
                    <p class="font-bold">Analysis Failed</p>
                    <p class="text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 max-w-lg text-center">${e.message}</p>
                </div>
            `;
        }
    });

});
