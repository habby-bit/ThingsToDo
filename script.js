const listContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const noListContainer = document.querySelector(
    "[data-no-list-display-container]"
);
const listDisplayContainer = document.querySelector(
    "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTasksButton = document.querySelector(
    "[data-clear-complete-tasks-button]"
);

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

if (lists.length === 0 || selectedListId === null) {
    listDisplayContainer.style.display = "none";
    noListContainer.style.display = "";
}

const noList = document.createElement("h1");
const text = document.createTextNode("Add/Select a list to see it here!");

const noListSecondText = document.createElement("h3");
const secondText = document.createTextNode(
    "(You can add tasks to the list once you've created it)"
);

noList.appendChild(text);
noListSecondText.appendChild(secondText);

noList.classList.add("noList");
noListSecondText.classList.add("noListSecondText");

noListContainer.appendChild(noList);
noListContainer.appendChild(noListSecondText);

listContainer.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "li") {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
});

tasksContainer.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "input") {
        const selectedList = lists.find((list) => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(
            (task) => task.id === e.target.id
        );
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);
    }
});

clearCompleteTasksButton.addEventListener("click", (e) => {
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
    saveAndRender();
});

deleteListButton.addEventListener("click", (e) => {
    lists = lists.filter((list) => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
});

newListForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const listName = newListInput.value;

    if (listName == null || listName === "") return;

    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = newTaskInput.value;

    if (taskName == null || taskName === "") return;

    const task = createTask(taskName);
    newTaskInput.value = null;

    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
});

const createList = (name) => {
    return { id: Date.now().toString(), name: name, tasks: [] };
};

const createTask = (name) => {
    return { id: Date.now().toString(), name: name, complete: false };
};

const saveAndRender = () => {
    save();
    render();
};

const save = () => {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
};

const render = () => {
    clearElement(listContainer);
    renderLists();

    const selectedList = lists.find((list) => list.id === selectedListId);

    if (selectedListId == null || lists.length === 0) {
        listDisplayContainer.style.display = "none";
        noListContainer.style.display = "";
    } else {
        noListContainer.style.display = "none";
        listDisplayContainer.style.display = "";
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
};

const renderTasks = (selectedList) => {
    selectedList.tasks.forEach((task) => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector("input");
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    });
};

const renderTaskCount = (selectedList) => {
    const incompleteTaskCount = selectedList.tasks.filter(
        (task) => !task.complete
    ).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
};

const renderLists = () => {
    lists.forEach((list) => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;

        if (list.id === selectedListId) {
            listElement.classList.add("active-list");
        }

        listContainer.appendChild(listElement);
    });
};

const clearElement = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

render();
