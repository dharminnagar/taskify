// const axios = require('axios');

const API_URL = 'http://localhost:3001/todos';

// Fetch existing todos when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // fetch todos
    fetchTodos();
});

// Fetch todos from backend
function fetchTodos() {
    //  write here

    axios.get(API_URL, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.data) {

            }
            response.data.forEach(todo => addTodoToDOM(todo));
        })
        .catch(error => console.error('Error fetching todos:', error));

    // fetch(API_URL)
    //     .then(response => response.json())
    //     .then(todos => {
    //         todos.forEach(todo => addTodoToDOM(todo));
    //     })
    //     .catch(error => console.error('Error fetching todos:', error));
}

// Add a new todo to the DOM
function addTodoToDOM(todo) {
    const task = document.querySelector('#todo-list');
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
    todoItem.setAttribute('data-id', todo.id);

    const leftContainer = document.createElement('div');
    leftContainer.classList.add('left-container');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id, todo.completed));

    const title = document.createElement('span');
    title.textContent = todo.task;

    // --------

    const rightContainer = document.createElement('div');
    rightContainer.classList.add('right-container');

    const editButton = document.createElement('div');
    editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`;
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', () => {
        title.contentEditable = true;
        title.focus();
        title.addEventListener('blur', () => {
            updateTodo(todo.id, title.textContent);
        }, { once: true });
        console.log(todo.task);
    }
    );

    const deleteButton = document.createElement('div');
    deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    leftContainer.appendChild(checkbox);
    leftContainer.appendChild(title);

    rightContainer.appendChild(editButton);
    rightContainer.appendChild(deleteButton);

    todoItem.appendChild(leftContainer);
    todoItem.appendChild(rightContainer);

    task.appendChild(todoItem);

    task.scrollTo({ top: task.scrollHeight, behavior: 'smooth' });
}

// Add a new todo
document.getElementById('add-todo-btn').addEventListener('click', () => {
    //  write here
    const title = document.getElementById('todo-input');
    // console.log(title);
    if (!title.value) {
        console.error('Input not found');
        return;
    }

    const newTodo = { task: title.value, completed: false };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
    })
        .then(response => response.json())
        .then(todo => {
            addTodoToDOM(todo);
            title.value = '';
        })
        .catch(error => console.error('Error adding todo:', error));
});

// Toggle todo completion
function toggleTodo(id, completed) {
    //    write here
    // todos.find(todo => todo.id === id).completed = !completed;

    fetch(API_URL + `/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
    })
        .then(response => response.json())
        .then(todo => {
            const todoItem = document.querySelector(`[data-id='${id}']`);
            todoItem.querySelector('span').classList.toggle('completed', todo.completed);
            console.log(todoItem);
        })
        .catch(error => console.error('Error toggling todo:', error));
}

// Update a todo
function updateTodo(id, task) {
    fetch(API_URL + `/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
    })
        .then(response => response.json())
        .then(todo => {
            const todoItem = document.querySelector(`[data-id='${id}']`);
            todoItem.querySelector('span').textContent = todo.task;

            todoItem.querySelector('span').contentEditable = false;
            console.log(todoItem);
        })
        .catch(error => console.error('Error updating todo:', error));
}

// Delete a todo
function deleteTodo(id) {
    // write here
    // todos.filter(todo => todo.id !== id);
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
        .then(() => {
            const todoItem = document.querySelector(`[data-id='${id}']`);
            todoItem.remove();
        })
        .catch(error => console.error('Error deleting todo:', error));
}

const todoList = document.getElementById('todo-list');

todoList.addEventListener('scroll', () => {
    if (todoList.scrollTop > 0) {
        if (!todoList.classList.contains('scrolled')) {
            // Add a slight delay to smoothly apply the fade effect
            setTimeout(() => todoList.classList.add('scrolled'), 100);
        }
    } else {
        todoList.classList.remove('scrolled');
    }
});

// Enter should add a new todo from the input field
document.getElementById('todo-input').addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        document.getElementById('add-todo-btn').click();
    }
});

// Enter should update the new todo when editing from contenteditable
document.getElementById('todo-list').addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        event.target.blur();
    }
});