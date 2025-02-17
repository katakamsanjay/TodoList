document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const taskList = document.getElementById('task-list');
  const addTaskBtn = document.getElementById('add-task');
  const taskTitle = document.getElementById('task-title');
  const taskDesc = document.getElementById('task-desc');
  const taskDue = document.getElementById('task-due');
  const search = document.getElementById('search');
  const filter = document.getElementById('filter');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Theme Toggle
  themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  });

  // Add Task
  addTaskBtn.addEventListener('click', () => {
    const title = taskTitle.value.trim();
    const desc = taskDesc.value.trim();
    const due = taskDue.value;

    if (title) {
      const task = { id: Date.now(), title, desc, due, completed: false };
      tasks.push(task);
      saveTasks();
      renderTasks();
      taskTitle.value = '';
      taskDesc.value = '';
      taskDue.value = '';
    }
  });

  // Render Tasks
  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item';
      taskItem.draggable = true;
      taskItem.innerHTML = `
        <div>
          <h3>${task.title}</h3>
          <p>${task.desc}</p>
          <small>Due: ${task.due}</small>
        </div>
        <div class="task-actions">
          <button onclick="toggleComplete(${task.id})">✔️</button>
          <button onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      `;
      if (task.completed) taskItem.classList.add('completed');
      taskList.appendChild(taskItem);
    });
  }

  // Save Tasks to Local Storage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Toggle Complete
  window.toggleComplete = (id) => {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks();
    renderTasks();
  };

  // Delete Task
  window.deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  };

  // Drag and Drop
  let dragStartIndex;
  taskList.addEventListener('dragstart', (e) => {
    dragStartIndex = [...taskList.children].indexOf(e.target);
    e.target.classList.add('dragging');
  });

  taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const closest = [...taskList.children].reduce((closest, child, index) => {
      const box = child.getBoundingClientRect();
      const offset = e.clientY - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, index };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).index;

    if (closest !== dragStartIndex) {
      const temp = tasks[dragStartIndex];
      tasks.splice(dragStartIndex, 1);
      tasks.splice(closest, 0, temp);
      dragStartIndex = closest;
      saveTasks();
      renderTasks();
    }
  });

  // Initial Render
  renderTasks();
});
