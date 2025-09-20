const storageKey = "todo-app-tasks";
const completionStorageKey = "todo-app-completion-stats";

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-items");
const count = document.getElementById("todo-count");
const clearCompletedButton = document.getElementById("clear-completed");
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const itemTemplate = document.getElementById("todo-item-template");

let tasks = loadTasks();
let activeFilter = "all";
let totalCompletedTasks = loadCompletionCount();

const soundEffects = createSoundEffects();

render();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const taskText = input.value.trim();

  if (!taskText) {
    input.focus();
    return;
  }

  const newTask = {
    id: generateId(),
    text: taskText,
    completed: false,
    createdAt: Date.now(),
  };

  tasks = [newTask, ...tasks];
  input.value = "";
  saveTasks();
  render();
});

list.addEventListener("click", (event) => {
  const listItem = event.target.closest(".todo-item");
  if (!listItem) return;

  const taskId = listItem.dataset.id;

  if (event.target.matches(".todo-item__checkbox")) {
    toggleTaskCompletion(taskId, event.target.checked);
  }

  if (event.target.matches(".todo-item__delete")) {
    deleteTask(taskId);
  }
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setFilter(button.dataset.filter);
  });
});

function loadTasks() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((task) => typeof task === "object" && task)
      .map((task) => ({
        id: task.id || generateId(),
        text: String(task.text || ""),
        completed: Boolean(task.completed),
        createdAt: Number(task.createdAt) || Date.now(),
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Failed to load tasks", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function toggleTaskCompletion(id, completed) {
  const existingTask = tasks.find((task) => task.id === id);
  const wasCompleted = existingTask ? existingTask.completed : false;

  tasks = tasks.map((task) =>
    task.id === id
      ? {
          ...task,
          completed,
        }
      : task
  );

  if (!wasCompleted && completed) {
    handleTaskCompleted();
  }
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

function setFilter(filter) {
  if (filter === activeFilter) return;
  activeFilter = filter;
  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });
  render();
}

function getVisibleTasks() {
  switch (activeFilter) {
    case "active":
      return tasks.filter((task) => !task.completed);
    case "completed":
      return tasks.filter((task) => task.completed);
    default:
      return tasks;
  }
}

function render() {
  list.innerHTML = "";
  const visibleTasks = getVisibleTasks();

  if (!visibleTasks.length) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "todo-item todo-item--empty";
    emptyMessage.textContent = "No tasks to show. Enjoy your day!";
    list.append(emptyMessage);
  } else {
    const fragment = document.createDocumentFragment();
    visibleTasks.forEach((task) => {
      const item = itemTemplate.content.firstElementChild.cloneNode(true);
      const checkbox = item.querySelector(".todo-item__checkbox");
      const text = item.querySelector(".todo-item__text");

      item.dataset.id = task.id;
      text.textContent = task.text;
      checkbox.checked = task.completed;
      item.classList.toggle("completed", task.completed);

      fragment.append(item);
    });
    list.append(fragment);
  }

  const activeTasks = tasks.filter((task) => !task.completed).length;
  count.textContent = `${activeTasks} ${activeTasks === 1 ? "task" : "tasks"}`;

  const hasCompleted = tasks.some((task) => task.completed);
  clearCompletedButton.disabled = !hasCompleted;
  clearCompletedButton.classList.toggle("clear-completed--hidden", !hasCompleted);
}

function loadCompletionCount() {
  try {
    const raw = localStorage.getItem(completionStorageKey);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (typeof parsed === "number") {
      return parsed;
    }
    if (parsed && typeof parsed.totalCompleted === "number") {
      return parsed.totalCompleted;
    }
    return 0;
  } catch (error) {
    console.error("Failed to load completion stats", error);
    return 0;
  }
}

function saveCompletionCount() {
  localStorage.setItem(
    completionStorageKey,
    JSON.stringify({ totalCompleted: totalCompletedTasks })
  );
}

function handleTaskCompleted() {
  totalCompletedTasks += 1;
  saveCompletionCount();
  soundEffects.playCompletionSound();
  if (totalCompletedTasks > 0 && totalCompletedTasks % 5 === 0) {
    setTimeout(() => {
      soundEffects.playMilestoneSound();
    }, 180);
  }
}

function createSoundEffects() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (typeof AudioContextClass !== "function") {
    return {
      playCompletionSound() {},
      playMilestoneSound() {},
    };
  }

  const context = new AudioContextClass();
  const masterGain = context.createGain();
  masterGain.gain.value = 0.25;
  masterGain.connect(context.destination);

  function ensureContext() {
    if (context.state === "suspended") {
      return context.resume().catch(() => {});
    }
    return Promise.resolve();
  }

  function playNotes(notes) {
    if (!Array.isArray(notes) || !notes.length) return;
    ensureContext().then(() => {
      let startTime = context.currentTime + 0.05;
      notes.forEach((note) => {
        const { frequency, duration, type, volume } = {
          frequency: 440,
          duration: 0.2,
          type: "sine",
          volume: 1,
          ...note,
        };
        const oscillator = context.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);

        const gainNode = context.createGain();
        const effectiveVolume = Math.max(0, Math.min(volume, 1));
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(effectiveVolume, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.05);

        startTime += duration * 0.85;
      });
    });
  }

  return {
    playCompletionSound() {
      playNotes([
        { frequency: 660, duration: 0.18, type: "sine", volume: 0.8 },
        { frequency: 880, duration: 0.22, type: "triangle", volume: 0.7 },
      ]);
    },
    playMilestoneSound() {
      playNotes([
        { frequency: 523.25, duration: 0.2, type: "square", volume: 0.8 },
        { frequency: 659.25, duration: 0.2, type: "square", volume: 0.85 },
        { frequency: 783.99, duration: 0.26, type: "square", volume: 0.9 },
        { frequency: 1046.5, duration: 0.35, type: "triangle", volume: 1 },
      ]);
    },
  };
}
