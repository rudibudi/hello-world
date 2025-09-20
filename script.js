const storageKey = "todo-app-tasks";
const completionStorageKey = "todo-app-completion-stats";
const audioPreferenceStorageKey = "todo-app-audio-preferences";

const completionSoundIds = [
  "completion-bright",
  "completion-soft",
  "completion-retro",
];

const milestoneSoundIds = [
  "milestone-fanfare",
  "milestone-rise",
  "milestone-celebration",
];

const DEFAULT_AUDIO_PREFERENCES = {
  completionSound: completionSoundIds[0],
  milestoneSound: milestoneSoundIds[0],
};

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
const completionSoundSelect = document.getElementById("completion-sound");
const milestoneSoundSelect = document.getElementById("milestone-sound");

let tasks = loadTasks();
let activeFilter = "all";
let totalCompletedTasks = loadCompletionCount();
let audioPreferences = loadAudioPreferences();

const soundEffects = createSoundEffects(() => audioPreferences);

initializeAudioPreferenceControls();
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
  soundEffects.playAddSound();
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

function normalizeAudioPreferences(preferences = {}) {
  const completionSound =
    preferences && completionSoundIds.includes(preferences.completionSound)
      ? preferences.completionSound
      : DEFAULT_AUDIO_PREFERENCES.completionSound;
  const milestoneSound =
    preferences && milestoneSoundIds.includes(preferences.milestoneSound)
      ? preferences.milestoneSound
      : DEFAULT_AUDIO_PREFERENCES.milestoneSound;
  return { completionSound, milestoneSound };
}

function loadAudioPreferences() {
  try {
    const raw = localStorage.getItem(audioPreferenceStorageKey);
    if (!raw) {
      return { ...DEFAULT_AUDIO_PREFERENCES };
    }
    const parsed = JSON.parse(raw);
    return normalizeAudioPreferences(parsed);
  } catch (error) {
    console.error("Failed to load audio preferences", error);
    return { ...DEFAULT_AUDIO_PREFERENCES };
  }
}

function saveAudioPreferences() {
  audioPreferences = normalizeAudioPreferences(audioPreferences);
  try {
    localStorage.setItem(
      audioPreferenceStorageKey,
      JSON.stringify(audioPreferences)
    );
  } catch (error) {
    console.error("Failed to save audio preferences", error);
  }
}

function updateAudioPreference(key, value) {
  const validIds =
    key === "completionSound"
      ? completionSoundIds
      : key === "milestoneSound"
      ? milestoneSoundIds
      : [];

  if (!validIds.includes(value)) {
    return false;
  }

  audioPreferences = normalizeAudioPreferences({
    ...audioPreferences,
    [key]: value,
  });
  saveAudioPreferences();
  return true;
}

function initializeAudioPreferenceControls() {
  if (completionSoundSelect) {
    completionSoundSelect.value = audioPreferences.completionSound;
    completionSoundSelect.addEventListener("change", () => {
      const selected = completionSoundSelect.value;
      if (!updateAudioPreference("completionSound", selected)) {
        completionSoundSelect.value = audioPreferences.completionSound;
        return;
      }
      soundEffects.playSoundById(selected);
    });
  }

  if (milestoneSoundSelect) {
    milestoneSoundSelect.value = audioPreferences.milestoneSound;
    milestoneSoundSelect.addEventListener("change", () => {
      const selected = milestoneSoundSelect.value;
      if (!updateAudioPreference("milestoneSound", selected)) {
        milestoneSoundSelect.value = audioPreferences.milestoneSound;
        return;
      }
      soundEffects.playSoundById(selected);
    });
  }
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

function createSoundEffects(getPreferences) {
  const resolvePreferences =
    typeof getPreferences === "function" ? getPreferences : () => DEFAULT_AUDIO_PREFERENCES;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (typeof AudioContextClass !== "function") {
    return {
      playCompletionSound() {},
      playMilestoneSound() {},
      playAddSound() {},
      playSoundById() {
        return false;
      },
    };
  }

  const context = new AudioContextClass();
  const masterGain = context.createGain();
  masterGain.gain.value = 0.22;
  masterGain.connect(context.destination);

  const soundLibrary = {
    "completion-bright": [
      { frequency: 660, duration: 0.16, type: "sine", volume: 0.6 },
      { frequency: 990, duration: 0.22, type: "triangle", volume: 0.55 },
    ],
    "completion-soft": [
      { frequency: 523.25, duration: 0.24, type: "sine", volume: 0.45 },
      { frequency: 659.25, duration: 0.18, type: "sine", volume: 0.4 },
    ],
    "completion-retro": [
      { frequency: 783.99, duration: 0.12, type: "square", volume: 0.5 },
      { frequency: 932.33, duration: 0.12, type: "square", volume: 0.45 },
      { frequency: 1174.66, duration: 0.14, type: "square", volume: 0.4 },
    ],
    "milestone-fanfare": [
      { frequency: 523.25, duration: 0.22, type: "square", volume: 0.7 },
      { frequency: 659.25, duration: 0.22, type: "square", volume: 0.68 },
      { frequency: 783.99, duration: 0.26, type: "sawtooth", volume: 0.65 },
      { frequency: 1046.5, duration: 0.32, type: "triangle", volume: 0.68 },
    ],
    "milestone-rise": [
      { frequency: 392, duration: 0.18, type: "triangle", volume: 0.58 },
      { frequency: 523.25, duration: 0.18, type: "triangle", volume: 0.62 },
      { frequency: 659.25, duration: 0.2, type: "sine", volume: 0.66 },
      { frequency: 880, duration: 0.28, type: "sine", volume: 0.64 },
    ],
    "milestone-celebration": [
      { frequency: 523.25, duration: 0.18, type: "triangle", volume: 0.6 },
      { frequency: 659.25, duration: 0.18, type: "triangle", volume: 0.6 },
      { frequency: 587.33, duration: 0.2, type: "triangle", volume: 0.58 },
      { frequency: 880, duration: 0.32, type: "sine", volume: 0.68 },
    ],
    "task-add-soft": [
      { frequency: 392, duration: 0.12, type: "sine", volume: 0.3 },
      { frequency: 523.25, duration: 0.16, type: "triangle", volume: 0.28 },
    ],
  };

  function ensureContext() {
    if (context.state === "suspended") {
      return context.resume().catch(() => {});
    }
    return Promise.resolve();
  }

  function playNotes(notes) {
    if (!Array.isArray(notes) || notes.length === 0) {
      return false;
    }
    ensureContext().then(() => {
      let startTime = context.currentTime + 0.05;
      notes.forEach((note) => {
        const { frequency, duration, type, volume } = {
          frequency: 440,
          duration: 0.2,
          type: "sine",
          volume: 0.5,
          ...note,
        };
        const oscillator = context.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);

        const gainNode = context.createGain();
        const effectiveVolume = Math.max(0.0001, Math.min(volume, 1));
        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.linearRampToValueAtTime(
          effectiveVolume,
          startTime + Math.min(0.04, duration / 2)
        );
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.05);

        startTime += duration * 0.85;
      });
    });
    return true;
  }

  function playSound(soundId) {
    const notes = soundLibrary[soundId];
    if (!notes) {
      return false;
    }
    return playNotes(notes);
  }

  function getNormalizedPreferences() {
    const raw = resolvePreferences();
    if (!raw || typeof raw !== "object") {
      return { ...DEFAULT_AUDIO_PREFERENCES };
    }
    return normalizeAudioPreferences(raw);
  }

  return {
    playCompletionSound() {
      const { completionSound } = getNormalizedPreferences();
      if (!playSound(completionSound)) {
        playSound(DEFAULT_AUDIO_PREFERENCES.completionSound);
      }
    },
    playMilestoneSound() {
      const { milestoneSound } = getNormalizedPreferences();
      if (!playSound(milestoneSound)) {
        playSound(DEFAULT_AUDIO_PREFERENCES.milestoneSound);
      }
    },
    playAddSound() {
      playSound("task-add-soft");
    },
    playSoundById(soundId) {
      return playSound(soundId);
    },
  };
}
