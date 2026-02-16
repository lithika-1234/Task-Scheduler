let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

requestNotificationPermission();

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>
                <b>${task.title}</b><br>
                ${task.deadline} ${task.time} • ${task.priority}
            </span>
            <div class="task-buttons">
                <button onclick="completeTask(${index})">✔</button>
                <button onclick="deleteTask(${index})">🗑</button>
            </div>
        `;

        list.appendChild(li);
    });
}

function addTask() {
    const title = document.getElementById("title").value;
    const deadline = document.getElementById("deadline").value;
    const time = document.getElementById("time").value;
    const priority = document.getElementById("priority").value;

    if (!title || !deadline || !time) {
        alert("Enter title, date, and time");
        return;
    }

    const datetime = new Date(`${deadline}T${time}`);

    tasks.push({
        title,
        deadline,
        time,
        datetime,
        priority,
        completed: false,
        notified: false
    });

    saveTasks();
    renderTasks();
}

function completeTask(index) {
    tasks[index].completed = true;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

/* ---------- NOTIFICATION CHECKER ---------- */
setInterval(() => {
    const now = new Date();

    tasks.forEach(task => {
        if (!task.completed && !task.notified) {
            const taskTime = new Date(task.datetime);

            if (now >= taskTime) {
                if (Notification.permission === "granted") {
                    new Notification("Task overdue!", {
                        body: task.title + " was not completed on time."
                    });
                }

                task.notified = true;
                saveTasks();
            }
        }
    });
}, 30000); // checks every 30 seconds

renderTasks();
