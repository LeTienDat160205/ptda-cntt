//Đăng xuất với hộp thoại xác nhận
const logoutBtn = document.getElementById("Logout");
const logoutConfirm = document.getElementById("popupLogout");
const logoutConfirmYes = document.getElementById("logoutConfirmYes");
const logoutConfirmNo = document.getElementById("logoutConfirmNo");

logoutBtn &&
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (logoutConfirm) {
      logoutConfirm.classList.add("active");
      logoutConfirm.setAttribute("aria-hidden", "false");
    } else {
      // chuyển hướng
      window.location.href = "/auth/logout";
    }
    // ẩn user menu
    if (userMenu) userMenu.style.display = "none";
  });

// confirm
logoutConfirmYes &&
  logoutConfirmYes.addEventListener("click", () => {
    window.location.href = "/auth/logout";
  });
logoutConfirmNo &&
  logoutConfirmNo.addEventListener("click", () => {
    if (logoutConfirm) {
      logoutConfirm.classList.remove("active");
      logoutConfirm.setAttribute("aria-hidden", "true");
    }
  });
const closeLogoutBtn = document.getElementById("closeLogoutBtn");
closeLogoutBtn &&
  closeLogoutBtn.addEventListener("click", () => {
    if (logoutConfirm) {
      logoutConfirm.classList.remove("active");
      logoutConfirm.setAttribute("aria-hidden", "true");
    }
  });

// Nhấn X hoặc click ra ngoài để thoát
if (logoutConfirm) {
  logoutConfirm.addEventListener("click", (e) => {
    if (e.target === logoutConfirm) {
      logoutConfirm.classList.remove("active");
      logoutConfirm.setAttribute("aria-hidden", "true");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && logoutConfirm.classList.contains("active")) {
      logoutConfirm.classList.remove("active");
      logoutConfirm.setAttribute("aria-hidden", "true");
    }
  });
}
