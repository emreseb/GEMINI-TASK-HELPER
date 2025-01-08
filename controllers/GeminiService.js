class GeminiService {
    constructor() {
        this.chatHistory = document.getElementById('chat-history');
        this.promptInput = document.getElementById('prompt-input');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendPrompt(app.todoManager);
        });
    }

    async processGeminiCommand(prompt, todos) {
        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `Given this todo list: ${JSON.stringify(todos)}\n\nUser command: ${prompt}\n\nRespond with a JSON object containing:\n{action: 'add'|'edit'|'delete'|'info', taskId?: number, text?: string, deadline?: string, response: string}`
                })
            });

            const data = await response.json();
            try {
                return JSON.parse(data.response);
            } catch (e) {
                return {  response: data.response };
            }
        } catch (error) {
            console.error('Error:', error);
            return { 
                action: 'info', 
                response: 'Sorry, I encountered an error processing your request.' 
            };
        }
    }

    async sendPrompt(todoManager) {
        const prompt = this.promptInput.value;
        
        if (!prompt) return;

        this.addMessageToChat('You', prompt, 'prompt');
        this.promptInput.value = '';

        const result = await this.processGeminiCommand(prompt, todoManager.getTodos());
        
        // Process the command result
        switch(result.action) {
            case 'add':
                todoManager.addTodo(result.text, result.deadline);
                break;
            case 'edit':
                todoManager.editTodo(result.taskId, result.text, result.deadline);
                break;
            case 'delete':
                todoManager.deleteTodo(result.taskId);
                break;
        }

        this.addMessageToChat('Gemini', result.response, 'response');
    }

    addMessageToChat(sender, message, className) {
        this.chatHistory.innerHTML += `
            <div class="message ${className}">
                <strong>${sender}:</strong> ${message}
            </div>
        `;
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    }
}

// Make GeminiService available globally
window.GeminiService = GeminiService;