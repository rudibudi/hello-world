const storageKey = "todo-app-tasks";
const completionStorageKey = "todo-app-completion-stats";
const soundPreferenceStorageKey = "todo-app-sound-preferences";
const themePreferenceStorageKey = "todo-app-theme-preference";

const defaultSoundPreferences = {
  completion: "chime",
  milestone: "celebration",
};

const defaultThemeKey = "lavender";

const soundPresets = {
  completion: {
    chime: {
      label: "Bright chime",
      notes: [
        { frequency: 660, duration: 0.18, type: "sine", volume: 0.8 },
        { frequency: 880, duration: 0.22, type: "triangle", volume: 0.7 },
      ],
    },
    sparkle: {
      label: "Sparkle trail",
      notes: [
        { frequency: 783.99, duration: 0.12, type: "sine", volume: 0.75 },
        { frequency: 987.77, duration: 0.14, type: "sine", volume: 0.65 },
        { frequency: 1318.51, duration: 0.16, type: "triangle", volume: 0.55 },
      ],
    },
    pop: {
      label: "Soft pop",
      notes: [
        { frequency: 392, duration: 0.12, type: "square", volume: 0.75 },
        { frequency: 523.25, duration: 0.14, type: "sine", volume: 0.65 },
        { frequency: 659.25, duration: 0.16, type: "triangle", volume: 0.6 },
      ],
    },
    mute: {
      label: "Mute",
      notes: [],
    },
  },
  milestone: {
    celebration: {
      label: "Celebration fanfare",
      notes: [
        { frequency: 523.25, duration: 0.2, type: "square", volume: 0.8 },
        { frequency: 659.25, duration: 0.2, type: "square", volume: 0.85 },
        { frequency: 783.99, duration: 0.26, type: "square", volume: 0.9 },
        { frequency: 1046.5, duration: 0.35, type: "triangle", volume: 1 },
      ],
    },
    ascent: {
      label: "Ascending bells",
      notes: [
        { frequency: 392, duration: 0.18, type: "sine", volume: 0.65 },
        { frequency: 523.25, duration: 0.18, type: "sine", volume: 0.7 },
        { frequency: 659.25, duration: 0.2, type: "triangle", volume: 0.75 },
        { frequency: 880, duration: 0.24, type: "triangle", volume: 0.8 },
      ],
    },
    mellow: {
      label: "Mellow chords",
      notes: [
        { frequency: 329.63, duration: 0.32, type: "sine", volume: 0.7 },
        { frequency: 415.3, duration: 0.34, type: "sine", volume: 0.65 },
        { frequency: 493.88, duration: 0.36, type: "triangle", volume: 0.6 },
      ],
    },
    mute: {
      label: "Mute",
      notes: [],
    },
  },
};

const themePresets = {
  lavender: {
    label: "Lavender dusk",
    description: "Dreamy purples with a rosy skyline.",
    properties: {
      "background-gradient": "radial-gradient(circle at top, #8ec5fc, #e0c3fc)",
      "surface-color": "rgba(255, 255, 255, 0.85)",
      "surface-border": "rgba(0, 0, 0, 0.08)",
      "surface-border-soft": "rgba(0, 0, 0, 0.05)",
      "surface-shadow": "rgba(0, 0, 0, 0.15)",
      "surface-elevated": "rgba(255, 255, 255, 0.85)",
      "surface-elevated-shadow": "rgba(0, 0, 0, 0.08)",
      "text-color": "#1a1a1a",
      "muted-text-color": "rgba(26, 26, 26, 0.6)",
      "heading-color": "#312e81",
      "accent-gradient": "linear-gradient(135deg, #6366f1, #8b5cf6)",
      "accent-color": "#6366f1",
      "accent-color-strong": "#8b5cf6",
      "accent-contrast-text": "#ffffff",
      "accent-pill-background": "rgba(99, 102, 241, 0.1)",
      "accent-pill-text": "#4338ca",
      "accent-focus-border": "#5b21b6",
      "accent-focus-ring": "rgba(91, 33, 182, 0.2)",
      "accent-shadow": "rgba(99, 102, 241, 0.3)",
      "dialog-backdrop": "rgba(17, 24, 39, 0.35)",
      "button-surface": "rgba(255, 255, 255, 0.7)",
    },
    preview: {
      gradient: "linear-gradient(135deg, #8ec5fc, #e0c3fc)",
      accent: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    },
  },
  aurora: {
    label: "Aurora breeze",
    description: "Fresh teals and sunshine accents.",
    properties: {
      "background-gradient": "radial-gradient(circle at top, #a1ffce, #faffd1)",
      "surface-color": "rgba(255, 255, 255, 0.82)",
      "surface-border": "rgba(13, 148, 136, 0.18)",
      "surface-border-soft": "rgba(13, 148, 136, 0.1)",
      "surface-shadow": "rgba(15, 118, 110, 0.18)",
      "surface-elevated": "rgba(255, 255, 255, 0.9)",
      "surface-elevated-shadow": "rgba(15, 118, 110, 0.12)",
      "text-color": "#064e3b",
      "muted-text-color": "rgba(6, 78, 59, 0.65)",
      "heading-color": "#047857",
      "accent-gradient": "linear-gradient(135deg, #1fb6ff, #39f3bb)",
      "accent-color": "#0ea5e9",
      "accent-color-strong": "#14b8a6",
      "accent-contrast-text": "#f0fdfa",
      "accent-pill-background": "rgba(20, 184, 166, 0.16)",
      "accent-pill-text": "#0f766e",
      "accent-focus-border": "#0d9488",
      "accent-focus-ring": "rgba(13, 148, 136, 0.28)",
      "accent-shadow": "rgba(14, 165, 233, 0.28)",
      "dialog-backdrop": "rgba(14, 116, 144, 0.35)",
      "button-surface": "rgba(255, 255, 255, 0.78)",
    },
    preview: {
      gradient: "linear-gradient(135deg, #a1ffce, #faffd1)",
      accent: "linear-gradient(135deg, #1fb6ff, #39f3bb)",
    },
  },
  midnight: {
    label: "Midnight neon",
    description: "Moody blues with electric highlights.",
    properties: {
      "background-gradient": "radial-gradient(circle at top, #1a2a6c, #0f172a 55%, #000428 90%)",
      "surface-color": "rgba(15, 23, 42, 0.92)",
      "surface-border": "rgba(148, 163, 184, 0.18)",
      "surface-border-soft": "rgba(148, 163, 184, 0.12)",
      "surface-shadow": "rgba(2, 6, 23, 0.65)",
      "surface-elevated": "rgba(17, 24, 39, 0.95)",
      "surface-elevated-shadow": "rgba(15, 23, 42, 0.5)",
      "text-color": "#f1f5f9",
      "muted-text-color": "rgba(226, 232, 240, 0.72)",
      "heading-color": "#c7d2fe",
      "accent-gradient": "linear-gradient(135deg, #6366f1, #22d3ee)",
      "accent-color": "#818cf8",
      "accent-color-strong": "#22d3ee",
      "accent-contrast-text": "#ffffff",
      "accent-pill-background": "rgba(99, 102, 241, 0.25)",
      "accent-pill-text": "#c7d2fe",
      "accent-focus-border": "#22d3ee",
      "accent-focus-ring": "rgba(34, 211, 238, 0.35)",
      "accent-shadow": "rgba(129, 140, 248, 0.35)",
      "dialog-backdrop": "rgba(15, 23, 42, 0.6)",
      "button-surface": "rgba(17, 24, 39, 0.75)",
    },
    preview: {
      gradient: "linear-gradient(135deg, #1a2a6c, #111827)",
      accent: "linear-gradient(135deg, #6366f1, #22d3ee)",
    },
  },
};

let currentTheme = applyTheme(loadThemePreference());

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
const settingsButton = document.getElementById("open-settings");
const settingsDialog = document.getElementById("settings-dialog");
const closeSettingsButton = document.getElementById("close-settings");
const themeOptionsContainer = document.getElementById("theme-options");

const themeOptionElements = new Map();

let tasks = loadTasks();
let activeFilter = "all";
let totalCompletedTasks = loadCompletionCount();

let soundPreferences = loadSoundPreferences();
const soundEffects = createSoundEffects(soundPreferences);

setupSettingsDialog();
setupThemeControls();
setupSoundControls();

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

function loadSoundPreferences() {
  try {
    const raw = localStorage.getItem(soundPreferenceStorageKey);
    if (!raw) {
      return { ...defaultSoundPreferences };
    }
    const parsed = JSON.parse(raw);
    return sanitizeSoundPreferences(parsed);
  } catch (error) {
    console.error("Failed to load sound preferences", error);
    return { ...defaultSoundPreferences };
  }
}

function saveSoundPreferences(preferences) {
  try {
    localStorage.setItem(
      soundPreferenceStorageKey,
      JSON.stringify(sanitizeSoundPreferences(preferences))
    );
  } catch (error) {
    console.error("Failed to save sound preferences", error);
  }
}

function sanitizeSoundPreferences(preferences = {}) {
  const completionPreference =
    preferences && typeof preferences === "object"
      ? preferences.completion
      : undefined;
  const milestonePreference =
    preferences && typeof preferences === "object"
      ? preferences.milestone
      : undefined;

  return {
    completion: getValidSoundPreset("completion", completionPreference),
    milestone: getValidSoundPreset("milestone", milestonePreference),
  };
}

function isValidSoundPreset(type, value) {
  return Boolean(value && soundPresets[type] && soundPresets[type][value]);
}

function getValidSoundPreset(type, value) {
  if (isValidSoundPreset(type, value)) {
    return value;
  }
  return defaultSoundPreferences[type];
}

function setupSoundControls() {
  const mappings = [
    { select: completionSoundSelect, type: "completion" },
    { select: milestoneSoundSelect, type: "milestone" },
  ];

  mappings.forEach(({ select, type }) => {
    if (!select || !soundPresets[type]) return;

    select.innerHTML = "";
    Object.entries(soundPresets[type]).forEach(([value, preset]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = preset.label;
      select.append(option);
    });

    const preferredValue = soundPreferences[type] || defaultSoundPreferences[type];
    select.value = preferredValue;

    select.addEventListener("change", (event) => {
      const requestedValue = event.target.value;
      const validatedValue = getValidSoundPreset(type, requestedValue);
      if (validatedValue !== requestedValue) {
        select.value = validatedValue;
      }

      soundPreferences = sanitizeSoundPreferences({
        ...soundPreferences,
        [type]: validatedValue,
      });
      saveSoundPreferences(soundPreferences);
      soundEffects.updatePreference(type, soundPreferences[type]);

      if (type === "completion") {
        soundEffects.playCompletionSound();
      } else if (type === "milestone") {
        soundEffects.playMilestoneSound();
      }
    });
  });
}

function setupThemeControls() {
  if (!themeOptionsContainer) {
    return;
  }

  themeOptionElements.clear();
  themeOptionsContainer.innerHTML = "";

  const fragment = document.createDocumentFragment();

  Object.entries(themePresets).forEach(([value, config]) => {
    const option = document.createElement("label");
    option.className = "theme-option";
    if (value === currentTheme) {
      option.classList.add("theme-option--active");
    }

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "theme";
    input.value = value;
    input.className = "theme-option__radio";
    input.checked = value === currentTheme;

    const preview = document.createElement("span");
    preview.className = "theme-option__preview";
    if (config.preview && typeof config.preview === "object") {
      if (config.preview.gradient) {
        preview.style.setProperty("--preview-gradient", config.preview.gradient);
      }
      if (config.preview.accent) {
        preview.style.setProperty("--preview-accent", config.preview.accent);
      }
    }

    const text = document.createElement("span");
    text.className = "theme-option__text";

    const name = document.createElement("span");
    name.className = "theme-option__name";
    name.textContent = config.label;

    const description = document.createElement("span");
    description.className = "theme-option__description";
    description.textContent = config.description;

    text.append(name, description);
    option.append(input, preview, text);

    themeOptionElements.set(value, option);
    fragment.append(option);
  });

  themeOptionsContainer.append(fragment);

  if (!themeOptionsContainer.dataset.initialized) {
    themeOptionsContainer.addEventListener("change", handleThemeOptionChange);
    themeOptionsContainer.dataset.initialized = "true";
  }

  updateThemeOptionSelection();
}

function handleThemeOptionChange(event) {
  const target = event.target;
  if (!target || !target.matches("input[name='theme']")) {
    return;
  }
  setThemePreference(target.value);
}

function setThemePreference(themeKey) {
  const validatedTheme = getValidThemePreset(themeKey);
  if (validatedTheme === currentTheme) {
    updateThemeOptionSelection();
    return;
  }

  currentTheme = applyTheme(validatedTheme);
  saveThemePreference(currentTheme);
  updateThemeOptionSelection();
}

function updateThemeOptionSelection() {
  themeOptionElements.forEach((element, value) => {
    const input = element.querySelector(".theme-option__radio");
    const isActive = value === currentTheme;
    element.classList.toggle("theme-option--active", isActive);
    if (input) {
      input.checked = isActive;
    }
  });
}

function setupSettingsDialog() {
  if (!settingsDialog || !settingsButton) {
    return;
  }

  settingsButton.addEventListener("click", () => {
    openSettingsDialog();
  });

  if (closeSettingsButton) {
    closeSettingsButton.addEventListener("click", () => {
      closeSettingsDialog();
    });
  }

  settingsDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSettingsDialog();
  });

  settingsDialog.addEventListener("click", (event) => {
    if (event.target === settingsDialog) {
      closeSettingsDialog();
    }
  });

  settingsDialog.addEventListener("close", () => {
    setSettingsButtonExpanded(false);
  });
}

function openSettingsDialog() {
  if (!settingsDialog) {
    return;
  }

  if (typeof settingsDialog.showModal === "function") {
    if (!settingsDialog.open) {
      settingsDialog.showModal();
    }
  } else {
    settingsDialog.setAttribute("open", "open");
  }

  setSettingsButtonExpanded(true);

  requestAnimationFrame(() => {
    updateThemeOptionSelection();
    const firstInteractive = settingsDialog.querySelector(
      "button, input, select, textarea, [href], [tabindex]:not([tabindex='-1'])"
    );
    if (firstInteractive && typeof firstInteractive.focus === "function") {
      firstInteractive.focus();
    }
  });
}

function closeSettingsDialog() {
  if (!settingsDialog) {
    return;
  }

  if (typeof settingsDialog.close === "function") {
    if (settingsDialog.open) {
      settingsDialog.close();
    }
  } else {
    settingsDialog.removeAttribute("open");
  }

  setSettingsButtonExpanded(false);
}

function loadThemePreference() {
  try {
    const stored = localStorage.getItem(themePreferenceStorageKey);
    if (!stored) {
      return defaultThemeKey;
    }
    return getValidThemePreset(stored);
  } catch (error) {
    console.error("Failed to load theme preference", error);
    return defaultThemeKey;
  }
}

function saveThemePreference(themeKey) {
  try {
    localStorage.setItem(themePreferenceStorageKey, getValidThemePreset(themeKey));
  } catch (error) {
    console.error("Failed to save theme preference", error);
  }
}

function getValidThemePreset(themeKey) {
  if (themeKey && typeof themeKey === "string" && themePresets[themeKey]) {
    return themeKey;
  }
  return defaultThemeKey;
}

function applyTheme(themeKey) {
  const validatedTheme = getValidThemePreset(themeKey);
  const root = document.documentElement;

  const baseTheme = themePresets[defaultThemeKey];
  if (baseTheme && baseTheme.properties) {
    Object.entries(baseTheme.properties).forEach(([variable, value]) => {
      root.style.setProperty(`--${variable}`, value);
    });
  }

  const theme = themePresets[validatedTheme];
  if (theme && theme.properties) {
    Object.entries(theme.properties).forEach(([variable, value]) => {
      root.style.setProperty(`--${variable}`, value);
    });
  }

  return validatedTheme;
}

function setSettingsButtonExpanded(isExpanded) {
  if (!settingsButton) {
    return;
  }
  settingsButton.setAttribute("aria-expanded", String(Boolean(isExpanded)));
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

function createSoundEffects(initialPreferences = defaultSoundPreferences) {
  let currentPreferences = sanitizeSoundPreferences(initialPreferences);
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (typeof AudioContextClass !== "function") {
    return {
      playCompletionSound() {},
      playMilestoneSound() {},
      updatePreference(type, value) {
        if (isValidSoundPreset(type, value)) {
          currentPreferences = {
            ...currentPreferences,
            [type]: value,
          };
        }
      },
      getPreferences() {
        return { ...currentPreferences };
      },
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

  function playPreset(type) {
    if (!soundPresets[type]) return;
    const preset = soundPresets[type][currentPreferences[type]];
    if (!preset || !Array.isArray(preset.notes)) return;
    playNotes(preset.notes);
  }

  return {
    playCompletionSound() {
      playPreset("completion");
    },
    playMilestoneSound() {
      playPreset("milestone");
    },
    updatePreference(type, value) {
      if (isValidSoundPreset(type, value)) {
        currentPreferences = {
          ...currentPreferences,
          [type]: value,
        };
      }
    },
    getPreferences() {
      return { ...currentPreferences };
    },
  };
}
