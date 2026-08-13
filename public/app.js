const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Fetch and render all todos
async function fetchTodos() {
  try {
    const res = await fetch('/api/todos');
    const todos = await res.json();
    renderTodos(todos);
  } catch (err) {
    console.error('Failed to fetch todos:', err);
  }
}

// Render todos inside UL
function renderTodos(todos) {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.className = 'todo-title';
    span.textContent = todo.title;
    span.onclick = () => toggleTodo(todo.id);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => editTodo(todo.id, todo.title);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => deleteTodo(todo.id);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);
    todoList.appendChild(li);
  });
}

// Add a new todo
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = todoInput.value.trim();
  if (!title) return;

  try {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (res.ok) {
      todoInput.value = '';
      fetchTodos();
    }
  } catch (err) {
    console.error('Failed to add todo:', err);
  }
});

// Toggle todo state
async function toggleTodo(id) {
  try {
    await fetch(`/api/todos/${id}/toggle`, { method: 'PATCH' });
    fetchTodos();
  } catch (err) {
    console.error('Failed to toggle todo:', err);
  }
}

// Edit todo title
async function editTodo(id, currentTitle) {
  const newTitle = prompt('Edit your task:', currentTitle);
  if (newTitle === null || newTitle.trim() === '') return;

  try {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim() })
    });
    fetchTodos();
  } catch (err) {
    console.error('Failed to edit todo:', err);
  }
}

// Delete todo
async function deleteTodo(id) {
  try {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  } catch (err) {
    console.error('Failed to delete todo:', err);
  }
}

// Initial load
fetchTodos();