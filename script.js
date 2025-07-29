const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#task-input");
const dateTimeInput = document.querySelector("#datetime-input");
const categoryInput = document.querySelector("#category-input");
const tasksContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const countValue = document.querySelector(".count-value");

let tasks = [];

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const displayCount = () => {
  const incompleteCount = tasks.filter(task => !task.completed).length;
  countValue.innerText = incompleteCount;
};

const renderTasks = () => {
  tasksContainer.innerHTML = '<p id="pending-tasks">You have <span class="count-value">0</span> task(s) to complete.</p>';
  tasks.forEach((task, index) => {
    const taskHTML = document.createElement("div");
    taskHTML.className = "task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;

    const taskInfo = document.createElement("div");
    const taskName = document.createElement("span");
    taskName.className = "taskname";
    taskName.innerText = task.name;
    if (task.completed) taskName.classList.add("completed");

    taskInfo.appendChild(taskName);
    if (task.category) {
      const categorySpan = document.createElement("span");
      categorySpan.className = "category";
      categorySpan.innerText = task.category;
      taskInfo.appendChild(document.createElement("br"));
      taskInfo.appendChild(categorySpan);
    }
    if (task.datetime) {
      const dateSpan = document.createElement("span");
      dateSpan.className = "datetime";
      dateSpan.innerText = new Date(task.datetime).toLocaleString();
      taskInfo.appendChild(document.createElement("br"));
      taskInfo.appendChild(dateSpan);
    }

    const editBtn = document.createElement("button");
    editBtn.className = "edit";
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.onclick = () => {
      newTaskInput.value = task.name;
      categoryInput.value = task.category || "";
      dateTimeInput.value = task.datetime || "";
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.innerHTML = '<i class="far fa-trash-alt"></i>';
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    };

    taskHTML.appendChild(checkbox);
    taskHTML.appendChild(taskInfo);
    taskHTML.appendChild(editBtn);
    taskHTML.appendChild(deleteBtn);

    tasksContainer.appendChild(taskHTML);
  });
  displayCount();
};

const addTask = () => {
  const taskName = newTaskInput.value.trim();
  const dateTimeValue = dateTimeInput.value;
  const categoryValue = categoryInput.value.trim();

  error.style.display = "none";
  if (!taskName) {
    setTimeout(() => {
      error.style.display = "block";
    }, 200);
    return;
  }

  tasks.push({
    name: taskName,
    datetime: dateTimeValue,
    category: categoryValue,
    completed: false
  });

  saveTasks();
  renderTasks();

  newTaskInput.value = "";
  dateTimeInput.value = "";
  categoryInput.value = "";
};

addBtn.addEventListener("click", addTask);

window.onload = () => {
  const stored = localStorage.getItem("tasks");
  tasks = stored ? JSON.parse(stored) : [];
  renderTasks();
};
