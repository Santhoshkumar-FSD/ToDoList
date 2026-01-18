let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");

let todoList = JSON.parse(localStorage.getItem('todoList')) || [
  {
    text: "Learn HTML",
    uniqueNo: 1,
    createdAt: new Date().toLocaleString()
  },
  {
    text: "Learn CSS",
    uniqueNo: 2,
    createdAt: new Date().toLocaleString()
  },
  {
    text: "Learn JavaScript",
    uniqueNo: 3,
    createdAt: new Date().toLocaleString()
  },
  {
    text: "Learn React JS",
    uniqueNo: 4,
    createdAt: new Date().toLocaleString()
  }
];

let todosCount = todoList.length;

function saveTodos() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function onTodoStatusChange(checkboxId, labelId) {
  let checkboxElement = document.getElementById(checkboxId);
  let labelElement = document.getElementById(labelId);

  labelElement.classList.toggle('checked');
}

function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(todoId);

  todoItemsContainer.removeChild(todoElement);
}

function createAndAppendTodo(todo) {
  let todoId = 'todo' + todo.uniqueNo;
  let checkboxId = 'checkbox' + todo.uniqueNo;
  let labelId = 'label' + todo.uniqueNo;

  let todoElement = document.createElement("li");
  todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
  todoElement.id = todoId;
  todoItemsContainer.appendChild(todoElement);

  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = checkboxId;

  inputElement.onclick = function () {
    onTodoStatusChange(checkboxId, labelId);
  }

  inputElement.classList.add("checkbox-input");
  todoElement.appendChild(inputElement);

  let labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container", "d-flex", "flex-row");
  todoElement.appendChild(labelContainer);

  let labelElement = document.createElement("label");
  labelElement.setAttribute("for", checkboxId);
  labelElement.id = labelId;
  labelElement.classList.add("checkbox-label");
  labelElement.textContent = todo.text;
  labelContainer.appendChild(labelElement);

  // new: created-at meta
  let metaElement = document.createElement("span");
  metaElement.classList.add("todo-meta");
  metaElement.textContent = todo.createdAt ? todo.createdAt : "";
  labelContainer.appendChild(metaElement);

  let deleteIconContainer = document.createElement("div");
  deleteIconContainer.classList.add("delete-icon-container");
  labelContainer.appendChild(deleteIconContainer);

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("far", "fa", "fa-trash", "delete-icon");

  deleteIcon.onclick = function () {
    onDeleteTodo(todoId);
  };

  deleteIconContainer.appendChild(deleteIcon);
}

for (let todo of todoList) {
  createAndAppendTodo(todo);
}


function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(todoId);

  // Find and remove from todoList
  let todoIndex = todoList.findIndex(todo => 'todo' + todo.uniqueNo === todoId);
  if (todoIndex !== -1) {
    todoList.splice(todoIndex, 1);
    saveTodos();
  }

  // Fix height so we can animate height -> 0
  todoElement.style.height = todoElement.offsetHeight + "px";
  // Force reflow to ensure the browser registers the height
  todoElement.offsetHeight;

  // Add fade-out class (CSS will handle opacity, transform and height)
  todoElement.classList.add('fade-out');

  // After transition ends, remove the element from DOM
  todoElement.addEventListener('transitionend', function handler(event) {
    // we only need to run this once
    todoElement.removeEventListener('transitionend', handler);
    if (todoElement.parentNode === todoItemsContainer) {
      todoItemsContainer.removeChild(todoElement);
    }
  });
}

function onAddTodo() {
  let userInputElement = document.getElementById("todoUserInput");
  let userInputValue = userInputElement.value;

  if (userInputValue === "") {
    alert("Enter Valid Text");
    return;
  }

  todosCount = todosCount + 1;

  let newTodo = {
    text: userInputValue,
    uniqueNo: todosCount,
    createdAt: new Date().toLocaleString()
  };

  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  saveTodos();
  userInputElement.value = "";
}

addTodoButton.onclick = function () {
  onAddTodo();
}
