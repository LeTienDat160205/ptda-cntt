// ===== Theme =====
const THEME_KEY = "workhub-theme";
const themeBtn = document.getElementById("btnTheme");
const themeIcon = document.getElementById("themeIcon");

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  themeBtn.title = t === "dark" ? "Chuyển sang sáng" : "Chuyển sang tối";
  themeBtn.setAttribute("aria-pressed", t === "dark");
  themeIcon.innerHTML =
    t === "dark"
      ? `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke-width="2"/>`
      : `<circle cx="12" cy="12" r="5" stroke-width="2"/> 
                 <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke-width="2"/>`;
}
function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}
applyTheme(getPreferredTheme());
themeBtn.addEventListener("click", toggleTheme);

// Tabs (toolbar)
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Right panels
const notifPanel = document.getElementById("notifPanel");
const notifPanelContent = document.getElementById("notifPanelContent");
const calendarPanel = document.getElementById("calendarPanel");
const calendarPanelContent = document.getElementById("calendarPanelContent");
const closeNotifPanel = document.getElementById("closeNotifPanel");
const closeCalendarPanel = document.getElementById("closeCalendarPanel");
const btnNotif = document.getElementById("btnNotif");
const btnCalendar = document.getElementById("btnCalendar");

let panelOrder = [];
function showPanel(panel) {
  if (panelOrder.includes(panel)) {
    closePanel(panel);
    return;
  }
  panelOrder = [panel, ...panelOrder];
  if (panelOrder.length > 2) panelOrder = panelOrder.slice(0, 2);

  notifPanel.classList.remove("top", "bottom", "show");
  calendarPanel.classList.remove("top", "bottom", "show");

  function renderNotif() {
    notifPanelContent.innerHTML = `
            <div class="notif-list">
              <div class="notif-item"><div class="notif-dot"></div>Nội dung thông báo</div>
              <div class="notif-item"><div class="notif-dot"></div>Nội dung thông báo</div>
              <div class="notif-item"><div class="notif-dot"></div>Nội dung thông báo</div>
              <div class="notif-item"><div class="notif-dot"></div>Nội dung thông báo</div>
            </div>
          `;
  }
  function renderCalendar() {
    calendarPanelContent.innerHTML = `
            <div class="calendar-card" id="calendarCard">
              <div class="calendar-head">
                <div>
                  <div class="calendar-title" id="titleDay">Hôm nay</div>
                  <div class="calendar-sub" id="subMonth"></div>
                </div>
                <div>
                  <button class="btn" id="prevMth">◀</button>
                  <button class="btn" id="nextMth">▶</button>
                </div>
              </div>
              <div class="calendar-grid" id="calGrid"></div>
            </div>
          `;
    setTimeout(initCalendar, 0);
  }

  if (panelOrder.length === 1) {
    if (panelOrder[0] === "notif") {
      notifPanel.classList.add("show", "top");
      renderNotif();
    } else {
      calendarPanel.classList.add("show", "top");
      renderCalendar();
    }
  } else {
    if (panelOrder[0] === "notif" && panelOrder[1] === "calendar") {
      notifPanel.classList.add("show", "top");
      calendarPanel.classList.add("show", "bottom");
      renderNotif();
    } else {
      calendarPanel.classList.add("show", "top");
      notifPanel.classList.add("show", "bottom");
      renderCalendar();
    }
  }
}
function closePanel(panel) {
  panelOrder = panelOrder.filter((p) => p !== panel);
  notifPanel.classList.remove("top", "bottom", "show");
  calendarPanel.classList.remove("top", "bottom", "show");
  if (panelOrder.length === 1) {
    if (panelOrder[0] === "notif") {
      notifPanel.classList.add("show", "top");
    } else {
      calendarPanel.classList.add("show", "top");
    }
  }
}
btnNotif.onclick = () => showPanel("notif");
btnCalendar.onclick = () => showPanel("calendar");
closeNotifPanel && (closeNotifPanel.onclick = () => closePanel("notif"));
closeCalendarPanel &&
  (closeCalendarPanel.onclick = () => closePanel("calendar"));
document.addEventListener("mousedown", (e) => {
  if (
    notifPanel.classList.contains("show") &&
    !notifPanel.contains(e.target) &&
    !btnNotif.contains(e.target)
  )
    closePanel("notif");
  if (
    calendarPanel.classList.contains("show") &&
    !calendarPanel.contains(e.target) &&
    !btnCalendar.contains(e.target)
  )
    closePanel("calendar");
});

function initCalendar() {
  const calGrid = document.getElementById("calGrid");
  const titleDay = document.getElementById("titleDay");
  const subMonth = document.getElementById("subMonth");
  const prevMth = document.getElementById("prevMth");
  const nextMth = document.getElementById("nextMth");

  let view = new Date();
  function headText(d) {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      month: "short",
      day: "2-digit",
    }).format(d);
  }
  function buildCalendar(date) {
    const y = date.getFullYear(),
      m = date.getMonth();
    titleDay.textContent = headText(new Date());
    subMonth.textContent = new Intl.DateTimeFormat("vi-VN", {
      month: "long",
      year: "numeric",
    })
      .format(new Date(y, m, 1))
      .toUpperCase();
    const first = new Date(y, m, 1);
    const start = (first.getDay() + 6) % 7; // Monday first
    const days = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();
    const parts = [];
    ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].forEach((d) =>
      parts.push(`<div class="dow">${d}</div>`)
    );
    for (let i = 0; i < 42; i++) {
      let label,
        cls = "cell";
      if (i < start) {
        label = prevDays - start + i + 1;
        cls += " faded";
      } else if (i < start + days) {
        label = i - start + 1;
      } else {
        label = i - (start + days) + 1;
        cls += " faded";
      }
      const today = new Date();
      if (
        y === today.getFullYear() &&
        m === today.getMonth() &&
        label === today.getDate() &&
        !cls.includes("faded")
      )
        cls += " today";
      parts.push(`<div class="${cls}">${label}</div>`);
    }
    calGrid.innerHTML = parts.join("");
  }
  prevMth.addEventListener("click", () => {
    view.setMonth(view.getMonth() - 1);
    buildCalendar(view);
  });
  nextMth.addEventListener("click", () => {
    view.setMonth(view.getMonth() + 1);
    buildCalendar(view);
  });
  buildCalendar(view);
}
