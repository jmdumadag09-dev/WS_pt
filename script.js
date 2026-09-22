// let paragraph = document.querySelector("#myParagraph");

// let parent = paragraph.parentElement;

// let newParagraph = document.createElement('p');

// newParagraph.textContent = "This is a new paragraph.";

// parent.insertBefore(newParagraph, paragraph );

//let list = document.querySelector('#myList');
//let secondItem = document.querySelector('#second');

//let newItem = document.createElement('li');
//newItem.textContent = "First Item";

//list.insertBefore(newItem, secondItem );

// ==========================================
// JAVASCRIPT DOM - STUDENT TASK MANAGER
// ==========================================


// ==========================================
// 1. SELECTING DOM ELEMENTS
// ==========================================

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const categorySelect = document.getElementById("categorySelect");

const taskList = document.getElementById("taskList");

const errorMessage = document.getElementById("errorMessage");

const searchInput = document.getElementById("searchInput");

const filterSelect = document.getElementById("filterSelect");

const totalTasks = document.getElementById("totalTasks");

const pendingTasks = document.getElementById("pendingTasks");

const completedTasks = document.getElementById("completedTasks");

const emptyMessage = document.getElementById("emptyMessage");

const clearButton = document.getElementById("clearButton");

const keyDisplay = document.getElementById("keyDisplay");


// ==========================================
// 2. DATA
// ==========================================

let tasks = [];


// ==========================================
// 3. FORM SUBMISSION
// ==========================================

taskForm.addEventListener("submit", function(event) {

    // Prevent the page from refreshing
    event.preventDefault();


    // Get input value
    const taskName = taskInput.value.trim();

    const category = categorySelect.value;


    // ==========================================
    // 4. VALIDATION
    // ==========================================

    if (taskName === "") {

        errorMessage.textContent =
            "Please enter a task.";

        taskInput.focus();

        return;
    }


    // Remove error message
    errorMessage.textContent = "";


    // ==========================================
    // 5. CREATE TASK OBJECT
    // ==========================================

    const task = {

        id: Date.now(),

        name: taskName,

        category: category,

        completed: false

    };


    // Add task to array
    tasks.push(task);


    // ==========================================
    // 6. DISPLAY TASK
    // ==========================================

    displayTasks();


    // Clear input
    taskInput.value = "";

    taskInput.focus();

});


// ==========================================
// 7. DISPLAY TASKS
// ==========================================

function displayTasks() {

    // Remove existing tasks
    taskList.innerHTML = "";


    // Get search keyword
    const searchKeyword =
        searchInput.value.toLowerCase();


    // Get selected filter
    const filter =
        filterSelect.value;


    // Filter tasks
    const filteredTasks = tasks.filter(function(task) {

        const matchesSearch =
            task.name.toLowerCase()
                .includes(searchKeyword);


        const matchesFilter =
            filter === "all" ||

            (filter === "pending" &&
                task.completed === false) ||

            (filter === "completed" &&
                task.completed === true);


        return matchesSearch && matchesFilter;

    });


    // ==========================================
    // 8. EMPTY MESSAGE
    // ==========================================

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    // ==========================================
    // 9. CREATE DOM ELEMENTS
    // ==========================================

    filteredTasks.forEach(function(task) {

        // Create list item
        const li = document.createElement("li");

        li.classList.add("task");


        // Add completed class
        if (task.completed) {

            li.classList.add("completed");

        }


        // Store task ID in data attribute
        li.dataset.id = task.id;


        // Create task content
        const taskContent =
            document.createElement("div");

        taskContent.classList.add("task-content");


        // Create title
        const title =
            document.createElement("div");

        title.classList.add("task-title");

        title.textContent = task.name;


        // Create category
        const category =
            document.createElement("div");

        category.classList.add("task-category");

        category.textContent =
            `Category: ${task.category}`;


        // Add title and category
        taskContent.appendChild(title);

        taskContent.appendChild(category);


        // ==========================================
        // CREATE BUTTONS
        // ==========================================

        const actions =
            document.createElement("div");

        actions.classList.add("task-actions");


        // Complete button
        const completeButton =
            document.createElement("button");

        completeButton.classList.add(
            "complete-button"
        );

        completeButton.dataset.action = "complete";

        completeButton.textContent =
            task.completed
                ? "Undo"
                : "Complete";


        // Delete button
        const deleteButton =
            document.createElement("button");

        deleteButton.classList.add(
            "delete-button"
        );

        deleteButton.dataset.action = "delete";

        deleteButton.textContent =
            "Delete";


        // Add buttons
        actions.appendChild(completeButton);

        actions.appendChild(deleteButton);


        // Add everything to li
        li.appendChild(taskContent);

        li.appendChild(actions);


        // Add task to list
        taskList.appendChild(li);

    });


    // Update statistics
    updateStatistics();

}


// ==========================================
// 10. EVENT DELEGATION
// ==========================================

taskList.addEventListener("click", function(event) {

    // Find the button that was clicked
    const button =
        event.target.closest("button");


    // If something other than a button was clicked
    if (!button) {

        return;

    }


    // Find the task element
    const taskElement =
        button.closest(".task");


    // Get task ID
    const taskId =
        Number(taskElement.dataset.id);


    // Get action
    const action =
        button.dataset.action;


    // ==========================================
    // COMPLETE TASK
    // ==========================================

    if (action === "complete") {

        const task =
            tasks.find(function(task) {

                return task.id === taskId;

            });


        if (task) {

            task.completed =
                !task.completed;

        }

    }


    // ==========================================
    // DELETE TASK
    // ==========================================

    if (action === "delete") {

        tasks =
            tasks.filter(function(task) {

                return task.id !== taskId;

            });

    }


    // Display updated tasks
    displayTasks();

});


// ==========================================
// 11. SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function() {

        displayTasks();

    }
);


// ==========================================
// 12. FILTER
// ==========================================

filterSelect.addEventListener(
    "change",
    function() {

        displayTasks();

    }
);


// ==========================================
// 13. KEYBOARD EVENT
// ==========================================

taskInput.addEventListener(
    "keydown",
    function(event) {

        keyDisplay.textContent =
            `Last key pressed: ${event.key}`;


        // Enter key
        if (event.key === "Enter") {

            event.preventDefault();

            taskForm.dispatchEvent(
                new Event("submit")
            );

        }

    }
);


// ==========================================
// 14. CLEAR ALL TASKS
// ==========================================

clearButton.addEventListener(
    "click",
    function() {

        if (tasks.length === 0) {

            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to delete all tasks?"
            );


        if (confirmed) {

            tasks = [];

            displayTasks();

        }

    }
);


// ==========================================
// 15. UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    pendingTasks.textContent =
        pending;

}


// ==========================================
// 16. DOM TRAVERSAL EXAMPLE
// ==========================================

// Example of parent-child relationship

console.log("Task list:", taskList);

console.log(
    "Parent:",
    taskList.parentElement
);

console.log(
    "Children:",
    taskList.children
);


// ==========================================
// 17. INITIAL DISPLAY
// ==========================================

displayTasks();