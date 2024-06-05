document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => addTaskToDOM(task));
}

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const task = { id: Date.now(), text: taskText, completed: false };
        addTaskToDOM(task);
        saveTaskToStorage(task);
        taskInput.value = '';
    }
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('task-list');
    const taskItem = document.createElement('li');
    taskItem.setAttribute('data-id', task.id);
    taskItem.className = task.completed ? 'completed' : '';
    taskItem.innerHTML = `
        <span>${task.text}</span>
        <div>
            <button class="complete-button" onclick="toggleComplete(${task.id})">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            <button class="edit-button" onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    taskList.appendChild(taskItem);
}

function saveTaskToStorage(task) {
    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

function deleteTask(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.querySelector(`[data-id="${id}"]`).remove();
}

function editTask(id) {
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    const newText = prompt('Edit task:', taskItem.querySelector('span').textContent);
    if (newText !== null) {
        taskItem.querySelector('span').textContent = newText;
        let tasks = getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.id === id);
        tasks[taskIndex].text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function toggleComplete(id) {
    let tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.querySelector(`[data-id="${id}"]`).classList.toggle('completed');
    document.querySelector(`[data-id="${id}"] .complete-button`).textContent = tasks[taskIndex].completed ? 'Uncomplete' : 'Complete';
}

function filterTasks(status) {
    const tasks = getTasksFromStorage();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks
        .filter(task => {
            if (status === 'all') return true;
            if (status === 'completed') return task.completed;
            if (status === 'pending') return !task.completed;
        })
        .forEach(task => addTaskToDOM(task));
}
