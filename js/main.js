/*
1- take user input
2- add data to storage
3- display tasks
4- check 
5- display checked tasks
6- delete for task
7- clear all
8- search
9- update
*/

const userInputTask = document.getElementById("userInputTask");
const tasksBox = document.getElementById("tasks");
const finishedTasksBox = document.getElementById("finishedTasks");
const errorMsg = document.getElementById("errorMsg");

let tasks;
let finishedTasks;
// check there are is any  Tasks in local storage or not
if (localStorage.getItem("tasks") == null) {
  tasks = [];
} else {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  displayTasks(tasks);
}

// check there are is any finished Tasks in local storage or not

if (localStorage.getItem("finishedTasks") == null) {
  finishedTasks = [];
} else {
  finishedTasks = JSON.parse(localStorage.getItem("finishedTasks"));
  displayFinishedTasks(finishedTasks);
}

// Add Tasks
function addTask() {
  // check if user enter task or not
  if (userInputTask.value.trim() === "") {
    swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You Must Write Any Task",
      theme: "dark",
    });
    return;
  }

  errorMsg.classList.add("d-none");
  tasks.push(userInputTask.value);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  swal.fire({
    icon: "success",
    title: "Good Work",
    text: "Your Task Added Successfuly",
    theme: "dark",
  });
  displayTasks(tasks, tasks.length - 1);
  userInputTask.value = "";
}
//  Display tasks
function displayTasks(array, newIndex = -1) {
  let toDoTasks = "";
  for (let i = 0; i < array.length; i++) {
    toDoTasks += `
    <div class="col-lg-7 ${i === newIndex ? "adding" : ""}">
    <div class="task d-flex justify-content-between p-2 rounded-2">
        <p class=" m-0 d-flex align-items-center "> ${array[i]}</p>
        <div class="icons ">
            <button class="btn edit">
                <i class="fa-solid fa-edit"></i>
            </button>
            <button onclick="checkTask(${i})" class="btn check">
                <i class="fa-solid fa-check "></i>
            </button>
            <button onclick="deleteTask(this,${i})" class="btn delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>
</div>
`;
  }
  tasksBox.innerHTML = toDoTasks;
}

//  Display finished tasks
function displayFinishedTasks(array, newIndex = -1) {
  let finishedToDoTasks = "";

  for (let i = 0; i < array.length; i++) {
    finishedToDoTasks += `
    <div class="col-lg-7 ${i === newIndex ? "adding" : ""}">
      <div class="task d-flex justify-content-between p-2 rounded-2">
          <p class="m-0 d-flex align-items-center text-decoration-line-through">${
            array[i]
          }</p>
          <div class="icons">
              <button class="btn">
                  <i class="fa-solid fa-redo"></i>
              </button>
              <button onclick="deleteFinishedTask(this, ${i})" class="btn delete">
                  <i class="fa-solid fa-trash"></i>
              </button>
          </div>
      </div>
    </div>
    `;
  }

  finishedTasksBox.innerHTML = finishedToDoTasks;
}

// check task and add to finished tasks
function checkTask(index) {
  finishedTasks.push(tasks[index]);
  tasks.splice(index, 1);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks));

  displayTasks(tasks);
  displayFinishedTasks(finishedTasks, finishedTasks.length - 1); // 👈 animate this one
}

// Delete Task from tasks using sweet alert

function deleteTask(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9E78CF",
    cancelButtonColor: "#d33",
    theme: "dark",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks(tasks);
      Swal.fire({
        title: "Deleted!",
        text: "Your task has been deleted.",
        icon: "success",
      });
    }
  });
}

// Delete Task from finished tasks using sweet alert

function deleteFinishedTask(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9E78CF",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      finishedTasks.splice(index, 1);
      localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks));
      displayFinishedTasks(finishedTasks);
      console.log("hi");
      Swal.fire({
        title: "Deleted!",
        text: "Your task has been deleted.",
        icon: "success",
      });
    }
  });
}

// Clear all Tasks
function clearAll() {
  Swal.fire({
    title: "Are you sure?",

    text: "You won't be able to revert this! ",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9E78CF",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      tasks = [];
      finishedTasks = [];
      localStorage.removeItem("tasks");
      localStorage.removeItem("finishedTasks");
      displayTasks(tasks);
      displayFinishedTasks(finishedTasks);
      Swal.fire({
        title: "Deleted!",
        text: "Your task has been deleted.",
        icon: "success",
      });
    }
  });
}

// search for task
function searchTask(searchValue) {
  const search = searchValue.toLowerCase();
  const todoRusult = tasks.filter((task) =>
    task.toLowerCase().includes(search)
  );
  const finishedRusult = finishedTasks.filter((task) =>
    task.toLowerCase().includes(search)
  );
  // search for to do tasks
  if (todoRusult.length === 0) {
    tasksBox.innerHTML = `<h2 class="text-danger text-center">No Tasks Found</h2>`;
  } else {
    displayTasks(todoRusult);
  }
  // search for finished tasks

  if (finishedRusult.length === 0) {
    finishedTasksBox.innerHTML = `<h2 class="text-danger text-center">No finished Tasks Found</h2>`;
  } else {
    displayFinishedTasks(finishedRusult);
  }
}
