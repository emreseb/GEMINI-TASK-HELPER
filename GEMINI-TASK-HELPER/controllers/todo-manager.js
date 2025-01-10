class TodoManager {
    constructor() {
        this.todos = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelector('.todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
    }

    getTodos() {
        return this.todos;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');
    }
    
    addTodo(text, deadline) {
        const input = document.querySelector('.todo-input');
        const deadlineInput = document.querySelector('#deadline-input');
        
        const todoText = text || input.value.trim();
        const todoDeadline = deadline || deadlineInput.value;
        
        if (todoText) {
            this.todos.push({
                id: Date.now(),
                text: todoText,
                deadline: todoDeadline,
                isEditing: false
            });
            input.value = '';
            deadlineInput.value = '';
            this.sortTodos();
            this.renderTodos();
        }
    }

    sortTodos() {
        this.todos.sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });
    }

    getUrgencyClass(deadline) {
        if (!deadline) return '';
        const now = new Date();
        const taskDate = new Date(deadline);
        const diffHours = (taskDate - now) / (1000 * 60 * 60);
        
        if (diffHours < 24) return 'urgent';
        if (diffHours < 72) return 'soon';
        return '';
    }

    toggleEdit(id) {
        this.todos = this.todos.map(todo => ({
            ...todo,
            isEditing: todo.id === id ? !todo.isEditing : false
        }));
        this.renderTodos();
    }

    saveEdit(id) {
        const todoItem = document.querySelector(`#todo-${id}`);
        const newText = todoItem.querySelector('.edit-input').value;
        const newDeadline = todoItem.querySelector('.edit-deadline').value;
        
        if (newText.trim()) {
            this.editTodo(id, newText, newDeadline);
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.renderTodos();
    }

    editTodo(id, newText, newDeadline) {
        this.todos = this.todos.map(todo => 
            todo.id === id 
                ? { ...todo, text: newText || todo.text, deadline: newDeadline || todo.deadline, isEditing: false }
                : todo
        );
        this.sortTodos();
        this.renderTodos();
    }

    renderTodos() {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';
        
        this.todos.forEach((todo, index) => {
            const div = document.createElement('div');
            div.id = `todo-${todo.id}`;
            div.className = `todo-item ${this.getUrgencyClass(todo.deadline)} ${todo.isEditing ? 'edit-mode' : ''}`;
            
            if (todo.isEditing) {
                const editForm = document.createElement('div');
                editForm.className = 'edit-form';
                
                editForm.innerHTML = `
                    <input type="text" class="edit-input" value="${todo.text}">
                    <input type="datetime-local" class="edit-deadline" value="${todo.deadline}">
                    <div class="button-group">
                        <button onclick="app.todoManager.saveEdit(${todo.id})" class="edit-btn">Save</button>
                        <button onclick="app.todoManager.toggleEdit(${todo.id})" class="delete-btn">Cancel</button>
                    </div>
                `;
                
                div.appendChild(editForm);
            } else {
                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'todo-details';
                
                const textDiv = document.createElement('div');
                textDiv.className = 'todo-text';
                textDiv.textContent = `${index + 1}. ${todo.text}`;
                
                const deadlineDiv = document.createElement('div');
                deadlineDiv.className = 'deadline';
                if (todo.deadline) {
                    deadlineDiv.textContent = `Due: ${this.formatDate(todo.deadline)}`;
                }
                
                detailsDiv.appendChild(textDiv);
                detailsDiv.appendChild(deadlineDiv);
                div.appendChild(detailsDiv);

                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'button-group';

                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.textContent = 'Edit';
                editBtn.onclick = () => this.toggleEdit(todo.id);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => this.deleteTodo(todo.id);

                buttonGroup.appendChild(editBtn);
                buttonGroup.appendChild(deleteBtn);
                div.appendChild(buttonGroup);
            }
            
            todoList.appendChild(div);
        });
    }
}

// Make TodoManager available globally
window.TodoManager = TodoManager;