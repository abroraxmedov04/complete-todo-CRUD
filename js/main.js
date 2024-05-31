let token = window.localStorage.getItem("token");

console.log(token);

if (!token) {
  window.location.pathname = "../login.html";
}

const form = document.querySelector(".todo-form");
const elInputTodo = document.querySelector(".todo-input");
const elList = document.querySelector(".todo-list");
const todoTaskTemplate = document.querySelector(".todo-task-template").content;
const taskCounter = document.querySelector(".task-counter");
const logoutBtn = document.querySelector(".logout-btn");
const toggleBtn = document.querySelector(".btn-toggle-tasks");
const category = document.querySelector(".category");
const LOCALHOST = "192.168.1.104";

let todos = [];

function taskCounterFunc(arr) {
  taskCounter.textContent = arr.length;
}

function renderTodo() {
  elList.innerHTML = "";
  todos.forEach((item) => {
    let clone = todoTaskTemplate.cloneNode(true);
    let todoValueElement = clone.querySelector(".todo-value");
    todoValueElement.textContent = item.todo_value;
    if (item.completed) {
      todoValueElement.style.textDecoration = "line-through";
    }
    clone.querySelector(".delete-btn").dataset.id = item.id;
    clone.querySelector(".edit-btn").dataset.id = item.id;
    clone.querySelector(".complete-btn").dataset.id = item.id;
    elList.appendChild(clone);
  });
  taskCounterFunc(todos);
}

async function fetchTodos() {
  try {
    let response = await fetch(`http://${LOCALHOST}:5000/todo`, {
      headers: {
        Authorization: token,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch todos");
    todos = await response.json();
    renderTodo();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function postTodo() {
  try {
    let response = await fetch(`http://${LOCALHOST}:5000/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        text: elInputTodo.value.trim(),
      }),
    });
    if (!response.ok) throw new Error("Problem occurred while posting todo");
    elInputTodo.value = "";
    fetchTodos();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function deleteTask(id) {
  try {
    let response = await fetch(`http://${LOCALHOST}:5000/todo/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
    if (!response.ok) throw new Error("Can not delete");
    fetchTodos();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function editTask(id, editElement) {
  try {
    let response = await fetch(`http://${LOCALHOST}:5000/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        text: editElement,
      }),
    });
    if (!response.ok) throw new Error("Can not edit this content");
    fetchTodos();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function completeTask(id, btn) {
  try {
    btn.disabled = true;
    let response = await fetch(`http://${LOCALHOST}:5000/todo/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (!response.ok) throw new Error("Can not complete this task");
    fetchTodos();
  } catch (error) {
    console.error("Error:", error.message);
    btn.disabled = false;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  postTodo();
});

elList.addEventListener("click", (e) => {
  const id = e.target.dataset.id;

  // delete
  if (e.target.matches(".delete-btn")) {
    deleteTask(id);
  }

  // edit
  if (e.target.matches(".edit-btn")) {
    const liElement = e.target.closest(".task-item-li");
    if (liElement) {
      const textEdit = liElement.querySelector(".todo-value");
      const placeholderText = "Enter your text..";
      textEdit.setAttribute("data-placeholder", placeholderText);
      textEdit.contentEditable = "true";
      textEdit.focus({ preventScroll: true });
      textEdit.addEventListener("blur", () => {
        if (textEdit.textContent.trim() === "") {
          textEdit.textContent = placeholderText;
          textEdit.focus();
          textEdit.style.color = "red";
        } else {
          editTask(id, textEdit.textContent.trim());
        }
      });
    }
  }

  // complete
  if (e.target.matches(".complete-btn")) {
    const button = e.target;
    const parentElement = button.closest(".task-item-li");
    if (parentElement) {
      const textEdit = parentElement.querySelector(".todo-value");
      textEdit.style.textDecoration = "line-through";
      completeTask(id, button);
    }
  }
});

logoutBtn.addEventListener("click", () => {
  window.localStorage.removeItem("token");
  window.location.reload();
});

toggleBtn.addEventListener("click", (e) => {
  e.target.classList.toggle("active");

  if (e.target.classList.contains("active")) {
    e.target.textContent = "Show All Tasks";
    const completedTodos = todos.filter((item) => item.completed);
    category.textContent = "Completed tasks";
    renderTodoWithArray(completedTodos);
  } else {
    e.target.textContent = "Show Completed Tasks";
    renderTodoWithArray(todos);
    category.textContent = "All tasks";
  }
});

function renderTodoWithArray(array) {
  elList.innerHTML = "";
  array.forEach((item) => {
    let clone = todoTaskTemplate.cloneNode(true);
    let todoValueElement = clone.querySelector(".todo-value");
    todoValueElement.textContent = item.todo_value;
    if (item.completed) {
      todoValueElement.style.textDecoration = "line-through";
    }
    clone.querySelector(".delete-btn").dataset.id = item.id;
    clone.querySelector(".edit-btn").dataset.id = item.id;
    clone.querySelector(".complete-btn").dataset.id = item.id;
    elList.appendChild(clone);
  });
  taskCounterFunc(array);
}

fetchTodos();
