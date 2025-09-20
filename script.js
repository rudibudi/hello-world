diff --git a//dev/null b/script.js
index 0000000000000000000000000000000000000000..e3ebe4b28f6c5acaeab37f8aa8b8621d339c36ce 100644
--- a//dev/null
+++ b/script.js
@@ -0,0 +1,167 @@
+const storageKey = "todo-app-tasks";
+
+function generateId() {
+  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
+    return crypto.randomUUID();
+  }
+  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
+}
+const form = document.getElementById("todo-form");
+const input = document.getElementById("todo-input");
+const list = document.getElementById("todo-items");
+const count = document.getElementById("todo-count");
+const clearCompletedButton = document.getElementById("clear-completed");
+const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
+const itemTemplate = document.getElementById("todo-item-template");
+
+let tasks = loadTasks();
+let activeFilter = "all";
+
+render();
+
+form.addEventListener("submit", (event) => {
+  event.preventDefault();
+  const taskText = input.value.trim();
+
+  if (!taskText) {
+    input.focus();
+    return;
+  }
+
+  const newTask = {
+    id: generateId(),
+    text: taskText,
+    completed: false,
+    createdAt: Date.now(),
+  };
+
+  tasks = [newTask, ...tasks];
+  input.value = "";
+  saveTasks();
+  render();
+});
+
+list.addEventListener("click", (event) => {
+  const listItem = event.target.closest(".todo-item");
+  if (!listItem) return;
+
+  const taskId = listItem.dataset.id;
+
+  if (event.target.matches(".todo-item__checkbox")) {
+    toggleTaskCompletion(taskId, event.target.checked);
+  }
+
+  if (event.target.matches(".todo-item__delete")) {
+    deleteTask(taskId);
+  }
+});
+
+clearCompletedButton.addEventListener("click", () => {
+  tasks = tasks.filter((task) => !task.completed);
+  saveTasks();
+  render();
+});
+
+filterButtons.forEach((button) => {
+  button.addEventListener("click", () => {
+    setFilter(button.dataset.filter);
+  });
+});
+
+function loadTasks() {
+  try {
+    const raw = localStorage.getItem(storageKey);
+    if (!raw) return [];
+    const parsed = JSON.parse(raw);
+    if (!Array.isArray(parsed)) return [];
+    return parsed
+      .filter((task) => typeof task === "object" && task)
+      .map((task) => ({
+        id: task.id || generateId(),
+        text: String(task.text || ""),
+        completed: Boolean(task.completed),
+        createdAt: Number(task.createdAt) || Date.now(),
+      }))
+      .sort((a, b) => b.createdAt - a.createdAt);
+  } catch (error) {
+    console.error("Failed to load tasks", error);
+    return [];
+  }
+}
+
+function saveTasks() {
+  localStorage.setItem(storageKey, JSON.stringify(tasks));
+}
+
+function toggleTaskCompletion(id, completed) {
+  tasks = tasks.map((task) =>
+    task.id === id
+      ? {
+          ...task,
+          completed,
+        }
+      : task
+  );
+  saveTasks();
+  render();
+}
+
+function deleteTask(id) {
+  tasks = tasks.filter((task) => task.id !== id);
+  saveTasks();
+  render();
+}
+
+function setFilter(filter) {
+  if (filter === activeFilter) return;
+  activeFilter = filter;
+  filterButtons.forEach((button) => {
+    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
+  });
+  render();
+}
+
+function getVisibleTasks() {
+  switch (activeFilter) {
+    case "active":
+      return tasks.filter((task) => !task.completed);
+    case "completed":
+      return tasks.filter((task) => task.completed);
+    default:
+      return tasks;
+  }
+}
+
+function render() {
+  list.innerHTML = "";
+  const visibleTasks = getVisibleTasks();
+
+  if (!visibleTasks.length) {
+    const emptyMessage = document.createElement("li");
+    emptyMessage.className = "todo-item todo-item--empty";
+    emptyMessage.textContent = "No tasks to show. Enjoy your day!";
+    list.append(emptyMessage);
+  } else {
+    const fragment = document.createDocumentFragment();
+    visibleTasks.forEach((task) => {
+      const item = itemTemplate.content.firstElementChild.cloneNode(true);
+      const checkbox = item.querySelector(".todo-item__checkbox");
+      const text = item.querySelector(".todo-item__text");
+
+      item.dataset.id = task.id;
+      text.textContent = task.text;
+      checkbox.checked = task.completed;
+      item.classList.toggle("completed", task.completed);
+
+      fragment.append(item);
+    });
+    list.append(fragment);
+  }
+
+  const activeTasks = tasks.filter((task) => !task.completed).length;
+  count.textContent = `${activeTasks} ${activeTasks === 1 ? "task" : "tasks"}`;
+
+  const hasCompleted = tasks.some((task) => task.completed);
+  clearCompletedButton.disabled = !hasCompleted;
+  clearCompletedButton.classList.toggle("clear-completed--hidden", !hasCompleted);
+}
