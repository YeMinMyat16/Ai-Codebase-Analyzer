class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(data) {
        if (!data) return;

        // The exact UI layout provided by user
        let fileSummariesHTML = '';
        if (data.file_summaries) {
            for (const [filepath, summary] of Object.entries(data.file_summaries)) {
                // Parse markdown to HTML
                const formattedSummary = marked.parse(summary);
                fileSummariesHTML += `
                    <details class="group p-4 bg-[#1e293b] border border-[#334155] rounded-xl cursor-pointer">
                        <summary class="flex justify-between items-center font-medium text-gray-300 list-none">
                            <span class="flex items-center"><i class="ph ph-file-code mr-2 text-blue-400"></i> ${filepath}</span>
                            <span class="transition group-open:rotate-180"><svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                        </summary>
                        <div class="mt-4 group-open:animate-fadeIn prose prose-invert prose-sm prose-blue max-w-none text-gray-300">
                            ${formattedSummary}
                        </div>
                    </details>
                `;
            }
        } else {
            fileSummariesHTML = '<p class="text-sm text-gray-400">No file summaries available.</p>';
        }

        const projectSummary = data.project_summary || "No project summary returned.";
        const formattedProjectSummary = marked.parse(projectSummary);

        this.container.innerHTML = `
            <!-- HEADER -->
            <div class="mb-8 animate-fade-in-up">
                <h2 class="text-3xl font-bold text-white mb-2 flex items-center">
                    <i class="ph ph-chart-bar mr-3 text-blue-500"></i> Analysis Results
                </h2>
                <p class="text-gray-400 font-medium">
                    AI-powered insights for your local codebase
                </p>
            </div>

            <!-- STATS (Placeholders as per design, could be dynamically calculated in future) -->
            <div class="grid grid-cols-3 gap-6 mb-8">
                <div class="bg-[#111827] p-5 rounded-2xl shadow-lg border border-[#1e293b] flex flex-col justify-center relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition duration-500"></div>
                    <p class="text-sm text-gray-400 z-10 flex items-center"><i class="ph ph-activity mr-2"></i> Complexity</p>
                    <p class="text-2xl font-bold text-red-400 mt-2 z-10">High</p>
                </div>
                <div class="bg-[#111827] p-5 rounded-2xl shadow-lg border border-[#1e293b] flex flex-col justify-center relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition duration-500"></div>
                    <p class="text-sm text-gray-400 z-10 flex items-center"><i class="ph ph-wrench mr-2"></i> Maintainability</p>
                    <p class="text-2xl font-bold text-blue-400 mt-2 z-10">Good</p>
                </div>
                <div class="bg-[#111827] p-5 rounded-2xl shadow-lg border border-[#1e293b] flex flex-col justify-center relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-16 h-16 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition duration-500"></div>
                    <p class="text-sm text-gray-400 z-10 flex items-center"><i class="ph ph-shield-check mr-2"></i> File Scan</p>
                    <p class="text-2xl font-bold text-green-400 mt-2 z-10">Complete</p>
                </div>
            </div>

            <!-- CONTENT -->
            <div class="grid gap-6">

                <!-- SUMMARY -->
                <div class="bg-[#111827] p-6 rounded-2xl shadow-lg border border-[#1e293b]">
                    <h3 class="font-semibold mb-4 text-white text-lg flex items-center"><i class="ph ph-lightbulb text-yellow-500 mr-2"></i> Architecture Summary</h3>
                    <div class="bg-[#0f172a] p-6 rounded-xl border border-[#334155] h-80 overflow-y-auto custom-scrollbar">
                        <div class="prose prose-invert prose-blue max-w-none prose-sm sm:prose-base">
                            <!-- We map the backend AI output here -->
                            ${formattedProjectSummary}
                        </div>
                    </div>
                </div>

                <!-- FILE SUMMARIES -->
                <div class="bg-[#111827] p-6 rounded-2xl shadow-lg border border-[#1e293b]">
                    <h3 class="font-semibold mb-4 text-white flex items-center text-lg"><i class="ph ph-files text-emerald-400 mr-2"></i> File Insights</h3>
                    <div class="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        ${fileSummariesHTML}
                    </div>
                </div>

            </div>
        `;
    }
}
