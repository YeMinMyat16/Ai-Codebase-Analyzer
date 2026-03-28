class ChatBar {
    constructor(containerId, onSendCallback) {
        this.container = document.getElementById(containerId);
        this.onSendCallback = onSendCallback;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="fixed bottom-0 right-0 left-64 bg-[#111827] border-t border-[#1e293b] p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-10 flex flex-col justify-end backdrop-blur-md bg-opacity-90">
                
                <!-- Chat History / Messages Window (Hidden unless active) -->
                <div id="chat-messages" class="w-full max-w-4xl mx-auto mb-4 max-h-64 overflow-y-auto space-y-4 px-2 hidden">
                </div>

                <!-- Input Area -->
                <div class="w-full max-w-4xl mx-auto relative flex items-center">
                    <input type="text" id="chat-input" 
                        class="w-full bg-[#1e293b] border border-gray-700 rounded-full py-4 px-6 pr-16 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition"
                        placeholder="Ask a question about the codebase (e.g. 'Where is the main loop?')" autocomplete="off">
                    
                    <button id="send-btn" class="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="ph ph-paper-plane-right text-xl"></i>
                    </button>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        const input = document.getElementById('chat-input');
        const btn = document.getElementById('send-btn');

        const handleSend = () => {
            const question = input.value.trim();
            if (question) {
                this.addMessage(question, 'user');
                input.value = '';
                btn.innerHTML = '<i class="ph ph-circle-notch animate-spin text-xl"></i>';
                btn.disabled = true;
                input.disabled = true;
                
                this.onSendCallback(question).then(() => {
                    btn.innerHTML = '<i class="ph ph-paper-plane-right text-xl"></i>';
                    btn.disabled = false;
                    input.disabled = false;
                    input.focus();
                });
            }
        };

        btn.addEventListener('click', handleSend);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    addMessage(text, role) {
        const history = document.getElementById('chat-messages');
        history.classList.remove('hidden');

        const isUser = role === 'user';
        const bg = isUser ? 'bg-blue-600' : 'bg-[#1e293b] border border-gray-700';
        const align = isUser ? 'self-end' : 'self-start';
        const borderRadius = isUser ? 'rounded-tl-2xl rounded-bl-2xl rounded-tr-xl' : 'rounded-tr-2xl rounded-br-2xl rounded-tl-xl';
        
        let formattedText = text;
        if (!isUser) {
            formattedText = marked.parse(text);
        }

        const msgDiv = document.createElement('div');
        msgDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} w-full animate-fade-in-up`;
        msgDiv.innerHTML = `
            <div class="${bg} ${borderRadius} p-4 max-w-2xl text-sm leading-relaxed text-gray-200 shadow-md ${!isUser ? 'prose prose-invert prose-sm prose-blue max-w-none' : ''}">
                ${formattedText}
            </div>
        `;
        
        history.appendChild(msgDiv);
        history.scrollTop = history.scrollHeight;
    }
}
