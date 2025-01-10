let todos = [];

function addTodo() {
    const input = document.querySelector('.todo-input');
    const todoText = input.value.trim();

    if (todoText) {
        const todo = { id: Date.now(), text: todoText };
        todos.push(todo);
        input.value = '';
        renderTodos();
    }
}

function deleteTodo(id) {
    const todoElement = document.getElementById(`todo-${id}`);
    todoElement.classList.add('removing');
    setTimeout(() => {
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
    }, 300); // Match the animation duration
}

function renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const div = document.createElement('div');
        div.id = `todo-${todo.id}`;
        div.className = 'todo-item';
        div.innerHTML = `
            <span>${todo.text}</span>
            <button onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        todoList.appendChild(div);
    });
}
function sendPrompt() {
    const promptInput = document.getElementById('prompt-input');
    const chatHistory = document.getElementById('chat-history');
    const prompt = promptInput.value.trim();

    if (!prompt) return;

    // Display user message
    chatHistory.innerHTML += `<div class="message prompt"><strong>You:</strong> ${prompt}</div>`;
    promptInput.value = '';

    // Simulate a response from Gemini
    setTimeout(() => {
        const response = `Gemini response to: "${prompt}"`; // Replace with actual response logic
        chatHistory.innerHTML += `<div class="message response"><strong>Gemini:</strong> ${response}</div>`;
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
    }, 1000); // Simulate a delay for response
}