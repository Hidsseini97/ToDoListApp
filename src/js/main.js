// ------------------------------
// Data and Application Status
// ------------------------------
const initialCompleted = [
  {
    id: 1,
    title: "خرید میوه و سبزیجات و لبنیات برای خانه",
    description: "سوپرمارکت باران دریایی",
    priority: "متوسط",
    completed: true,
  },
  {
    id: 2,
    title: "تماس با محل فروشی در مورد تاخیر در ارسال",
    description: "",
    priority: "بالا",
    completed: true,
  },
  {
    id: 3,
    title: "جلسه با مرتضی در مورد مصاحبه با کارآموز جدید",
    description: "",
    priority: "متوسط",
    completed: true,
  },
];

// Saved tasks win over the demo data. An empty saved list ([]) is respected,
// so deleting everything does not bring the demo tasks back.
const STORAGE_KEY = "todo-tasks";

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch {}
  return [...initialCompleted];
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  } catch {}
}

const state = {
  tasks: loadTasks(),
  editingId: null,
  openMenuId: null,
};
const elements = {
  form: document.querySelector("#task-form"),
  title: document.querySelector("#task-title"),
  description: document.querySelector("#task-description"),
  priority: document.querySelector("#task-priority"),
  priorityTrigger: document.querySelector("#priority-trigger"),
  priorityMenu: document.querySelector("#priority-menu"),
  submit: document.querySelector("#submit-task"),
  activeList: document.querySelector("#active-list"),
  completedList: document.querySelector("#completed-list"),
  activeSection: document.querySelector("#active-section"),
  emptyState: document.querySelector("#empty-state"),
  activeSummary: document.querySelector("#active-summary"),
  activeCount: document.querySelector("#active-count"),
  completedCount: document.querySelector("#completed-count"),
  sidebar: document.querySelector("#sidebar"),
  backdrop: document.querySelector("#sidebar-backdrop"),
};

const numberFa = (number) =>
  String(number).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
const priorityStyles = {
  بالا: { stripe: "bg-[#ff5b3d]", badge: "bg-[#ffe1db] text-[#ff6049]" },
  متوسط: { stripe: "bg-[#ffa62b]", badge: "bg-[#ffedcf] text-[#ee951e]" },
  پایین: { stripe: "bg-[#0bb795]", badge: "bg-[#c9fff3] text-[#0baf91]" },
};
const baseTaskCard =
  "relative flex min-h-[92px] items-center overflow-visible rounded-[15px] border border-[#e1e0e5] bg-white px-6 py-5 shadow-[0_5px_17px_rgba(27,39,51,0.025)] group-data-[theme=dark]:border-[#354252] group-data-[theme=dark]:bg-[#171d26] max-[900px]:min-h-[78px] max-[900px]:px-4 max-[900px]:py-4";
const menuButton =
  "grid h-[35px] w-6 place-items-center border-0 bg-transparent max-[900px]:w-[19px]";
const actionButton =
  "grid h-8 w-8 place-items-center rounded-md border-0 bg-transparent text-[#77777a] hover:bg-[#f6faff] group-data-[theme=dark]:text-[#b6beca] group-data-[theme=dark]:hover:bg-[#1e2a3a]";

function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
}

// The task card is built with Tailwind utility classes.
function taskCard(task) {
  const styles = priorityStyles[task.priority] || priorityStyles.متوسط;
  const titleClass = task.completed ? " line-through" : "";
  const menuIsOpen = state.openMenuId === task.id;
  const menuActions = menuIsOpen
    ? '<div class="absolute left-[-6px] top-[58px] z-10 flex h-[42px] items-center rounded-[10px] border border-[#e1e0e5] bg-white p-1 shadow-[0_7px_20px_rgba(22,33,44,0.12)] group-data-[theme=dark]:border-[#354252] group-data-[theme=dark]:bg-[#171d26]">' +
      '<button data-action="edit" class="' +
      actionButton +
      '" type="button" aria-label="ویرایش"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16.5V20h3.5L18.9 8.6l-3.5-3.5L4 16.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m14.2 6.7 3.5 3.5M4 20h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>' +
      '<span class="mx-1 h-6 w-px bg-[#e1e0e5] group-data-[theme=dark]:bg-[#354252]"></span>' +
      '<button data-action="delete" class="' +
      actionButton +
      '" type="button" aria-label="حذف"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M10 11v6M14 11v6M7 7l1 13h8l1-13M9 7l1-3h4l1 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>'
    : "";

  return (
    '<article dir="ltr" data-task-card data-id="' +
    task.id +
    '" class="' +
    baseTaskCard +
    '">' +
    '<span class="pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]">' +
    '<span class="absolute inset-y-0 right-0 w-[5px] ' +
    styles.stripe +
    '"></span></span>' +
    '<div class="relative flex w-5 shrink-0 self-stretch items-center max-[900px]:w-[17px]">' +
    '<button data-menu-trigger class="' +
    menuButton +
    '" type="button" aria-label="گزینه‌های ' +
    escapeHtml(task.title) +
    '" aria-expanded="' +
    menuIsOpen +
    '">' +
    '<img class="h-[22px] w-[22px] max-[900px]:w-[19px]" src="./assets/icons/light/Frame 33317.svg" alt="" />' +
    "</button>" +
    menuActions +
    "</div>" +
    '<div dir="rtl" class="min-w-0 flex-1 px-[26px] text-right max-[900px]:px-[13px]">' +
    '<div class="flex flex-wrap items-start justify-start gap-4 max-[900px]:gap-2">' +
    '<h3 class="m-0 text-[17px] font-bold text-[#191c1e] group-data-[theme=dark]:text-[#f3f6fb] max-[900px]:text-[15px] max-[900px]:leading-[1.8]' +
    titleClass +
    '">' +
    escapeHtml(task.title) +
    "</h3>" +
    '<span class="whitespace-nowrap rounded-md px-[11px] py-1.5 text-[13px] font-bold max-[900px]:px-2 max-[900px]:py-[3px] max-[900px]:text-[11px] ' +
    styles.badge +
    '">' +
    task.priority +
    "</span>" +
    "</div>" +
    (task.description
      ? '<p class="m-0 mt-1.5 text-[15px] text-[#77777a] group-data-[theme=dark]:text-[#b6beca] max-[900px]:text-[13px] max-[900px]:leading-[1.8]">' +
        escapeHtml(task.description) +
        "</p>"
      : "") +
    "</div>" +
    '<input data-task-toggle class="order-3 h-[25px] w-[25px] shrink-0 accent-[#087ff5] max-[900px]:h-[23px] max-[900px]:w-[23px]" type="checkbox" ' +
    (task.completed ? "checked" : "") +
    ' aria-label="' +
    (task.completed ? "بازگرداندن" : "انجام شد") +
    " " +
    escapeHtml(task.title) +
    '" />' +
    "</article>"
  );
}

// Rendering Lists and Counters
function render() {
  const active = state.tasks.filter((task) => !task.completed);
  const completed = state.tasks.filter((task) => task.completed);
  elements.activeList.innerHTML = active.map(taskCard).join("");
  elements.completedList.innerHTML = completed.map(taskCard).join("");
  elements.activeSection.hidden = active.length === 0;
  elements.emptyState.hidden = active.length > 0;
  elements.activeSummary.textContent = active.length
    ? numberFa(active.length) + " تسک را باید انجام دهید."
    : "تسکی برای امروز نداری!";
  elements.activeCount.textContent =
    numberFa(active.length) + " تسک را باید انجام دهید.";
  elements.completedCount.textContent =
    numberFa(completed.length) + " تسک انجام شده است.";
}

// Tag picker: one button that opens a row with the three tags
const priorities = ["پایین", "متوسط", "بالا"];
const priorityBadgeBase =
  "block rounded-md px-[11px] py-1 text-[13px] font-bold";

elements.priorityMenu.innerHTML = priorities
  .map(
    (name) =>
      '<button type="button" role="option" data-priority="' +
      name +
      '" class="border-0 hover:brightness-95 ' +
      priorityBadgeBase +
      " " +
      priorityStyles[name].badge +
      '">' +
      name +
      "</button>",
  )
  .join("");

function setPriority(value) {
  elements.priority.value = value;
  // Mark the selected tag inside the open row.
  elements.priorityMenu
    .querySelectorAll("[data-priority]")
    .forEach((option) => {
      const selected = option.dataset.priority === value;
      option.setAttribute("aria-selected", String(selected));
      option.classList.toggle("ring-2", selected);
      option.classList.toggle("ring-current", selected);
    });
}

function setPriorityMenu(open) {
  elements.priorityMenu.dataset.open = String(open);
  elements.priorityTrigger.setAttribute("aria-expanded", String(open));
}

elements.priorityTrigger.addEventListener("click", () =>
  setPriorityMenu(elements.priorityMenu.dataset.open !== "true"),
);
elements.priorityMenu.addEventListener("click", (event) => {
  const option = event.target.closest("[data-priority]");
  if (!option) return;
  setPriority(option.dataset.priority);
  setPriorityMenu(false);
  elements.priorityTrigger.focus();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setPriorityMenu(false);
});

// Submit stays disabled until every text field has real content (add + edit).
function updateSubmitState() {
  elements.submit.disabled =
    !elements.title.value.trim() || !elements.description.value.trim();
}
elements.form.addEventListener("input", updateSubmitState);

let formShown = false;

// Animate the form open/closed. `hidden` is only set once the close finishes.
function animateForm(show, onDone) {
  const form = elements.form;
  if (show === formShown) return onDone?.();
  formShown = show;

  form.getAnimations().forEach((a) => a.cancel());

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    form.hidden = !show;
    return onDone?.();
  }

  form.hidden = false; // must be rendered to measure its natural size
  const s = getComputedStyle(form);
  const full = {
    height: s.height,
    opacity: 1,
    marginTop: s.marginTop,
    paddingTop: s.paddingTop,
    paddingBottom: s.paddingBottom,
    borderTopWidth: s.borderTopWidth,
    borderBottomWidth: s.borderBottomWidth,
  };
  const none = {
    height: "0px",
    opacity: 0,
    marginTop: "0px",
    paddingTop: "0px",
    paddingBottom: "0px",
    borderTopWidth: "0px",
    borderBottomWidth: "0px",
  };

  const anim = form.animate(show ? [none, full] : [full, none], {
    duration: 300,
    easing: "ease",
    fill: "forwards",
  });
  anim.onfinish = () => {
    form.hidden = !show;
    anim.cancel();
    onDone?.();
  };
}
// Add and Edit Form
function openForm(task = null) {
  state.editingId = task?.id ?? null;
  elements.form.hidden = false;
  elements.title.value = task?.title ?? "";
  elements.description.value = task?.description ?? "";
  setPriority(task?.priority ?? "متوسط");
  setPriorityMenu(false);
  updateSubmitState();
  elements.submit.textContent = task ? "ویرایش تسک" : "اضافه کردن تسک";
  elements.form.scrollIntoView({ behavior: "smooth", block: "center" });
  elements.title.focus({ preventScroll: true });
  animateForm(true, () =>
    elements.form.scrollIntoView({ behavior: "smooth", block: "center" }),
  );
}

function closeForm() {
  state.editingId = null;
  elements.form.hidden = true;
  elements.form.reset();
  setPriority("متوسط");
  setPriorityMenu(false);
  updateSubmitState();
  elements.submit.textContent = "اضافه کردن تسک";
}

document.querySelector("#open-add-task").addEventListener("click", () => {
  elements.form.hidden ? openForm() : closeForm();
});
document.querySelector("#cancel-task").addEventListener("click", closeForm);

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = elements.title.value.trim();
  const description = elements.description.value.trim();
  if (!title || !description) return;
  const priority = elements.priority.value;

  if (state.editingId) {
    const task = state.tasks.find((item) => item.id === state.editingId);
    Object.assign(task, { title, description, priority });
  } else {
    state.tasks.unshift({
      id: Date.now(),
      title,
      description,
      priority,
      completed: false,
    });
  }

  saveTasks();
  closeForm();
  render();
});

// Event delegation for cards that are re-rendered in each render.
document.addEventListener("click", (event) => {
  if (!event.target.closest("#priority-picker")) setPriorityMenu(false);

  const card = event.target.closest("[data-task-card]");

  if (!card) {
    // Only re-render when a card menu is actually open.
    if (state.openMenuId !== null) {
      state.openMenuId = null;
      render();
    }
    return;
  }

  const id = Number(card.dataset.id);
  if (event.target.closest("[data-menu-trigger]")) {
    state.openMenuId = state.openMenuId === id ? null : id;
    render();
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "delete") {
    state.tasks = state.tasks.filter((task) => task.id !== id);
    state.openMenuId = null;
    saveTasks();
    render();
  } else if (action === "edit") {
    const task = state.tasks.find((item) => item.id === id);
    state.openMenuId = null;
    openForm(task);
    render();
  }
});

// Animates cards moving between lists using the View Transitions API.
// Cards get a unique view-transition-name only while the transition runs, so
// the browser can match each old card with its new position.
function nameCards() {
  document.querySelectorAll("[data-task-card]").forEach((card) => {
    card.style.viewTransitionName = "task-" + card.dataset.id;
  });
}

function renderWithTransition() {
  if (!document.startViewTransition) {
    render();
    return;
  }
  nameCards();
  const transition = document.startViewTransition(() => {
    render();
    nameCards();
  });
  transition.finished.finally(() => {
    document.querySelectorAll("[data-task-card]").forEach((card) => {
      card.style.viewTransitionName = "";
    });
  });
}

document.addEventListener("change", (event) => {
  if (!event.target.matches("[data-task-toggle]")) return;
  const card = event.target.closest("[data-task-card]");
  const task = state.tasks.find((item) => item.id === Number(card.dataset.id));
  if (!task) return;
  task.completed = event.target.checked;
  saveTasks();
  renderWithTransition();
});

// Dark and light mode
const themeActiveClasses = [
  "bg-white",
  "text-[#191c1e]",
  "shadow-[0_2px_10px_rgba(17,24,39,0.04)]",
  "group-data-[theme=dark]:bg-[#171d26]",
  "group-data-[theme=dark]:text-[#f3f6fb]",
];

function setTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll("button[data-theme]").forEach((button) => {
    const active = button.dataset.theme === theme;
    themeActiveClasses.forEach((className) =>
      button.classList.toggle(className, active),
    );
  });
  localStorage.setItem("todo-theme", theme);
}

document.querySelectorAll("button[data-theme]").forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
});
setTheme(localStorage.getItem("todo-theme") || "light");

// The mobile menu is controlled by Tailwind's data attribute and variant.
function setSidebar(open) {
  elements.sidebar.dataset.open = String(open);
  elements.backdrop.dataset.open = String(open);
}
document
  .querySelector("#open-menu")
  .addEventListener("click", () => setSidebar(true));
elements.backdrop.addEventListener("click", () => setSidebar(false));
document
  .querySelectorAll("aside a")
  .forEach((link) => link.addEventListener("click", () => setSidebar(false)));

setPriority("متوسط");
updateSubmitState();
render();
