// <!-- XỬ LÝ AVATAR -->
document.addEventListener("DOMContentLoaded", () => {
  const avatarPreview = document.getElementById("avatarPreview");
  const avatarWrapper =
    document.getElementById("avatarWrapper") || avatarPreview.parentElement;

  const userName = "<%= user.name || 'User' %>";
  const avatarSrc = "<%= user.avatarPath || '' %>";

  // Nếu người dùng chưa có ảnh avatar thật
  if (!avatarSrc || avatarSrc.includes("default-avatar")) {
    // Ẩn ảnh thật
    avatarPreview.style.display = "none";

    // Tạo avatar chữ cái đầu tiên
    const initial = userName.trim()
      ? userName.trim().charAt(0).toUpperCase()
      : "?";

    // Kiểm tra màu trong localStorage
    const colorKey = `avatarColor_${userName}`;
    let bgColor = localStorage.getItem(colorKey);

    // Nếu chưa có thì random 1 lần
    if (!bgColor) {
      const colors = [
        "#f87171",
        "#fb923c",
        "#facc15",
        "#4ade80",
        "#60a5fa",
        "#a78bfa",
        "#f472b6",
      ];
      bgColor = colors[Math.floor(Math.random() * colors.length)];
      localStorage.setItem(colorKey, bgColor);
    }

    // Tạo avatar bằng chữ
    const letterAvatar = document.createElement("div");
    letterAvatar.textContent = initial;
    letterAvatar.style.cssText = `width: 100%;height: 100%;border-radius: 50%;background: ${bgColor};color: white;font-weight: 600; font-size: 1.2rem;display: flex;align-items: center;justify-content: center;`;
    avatarWrapper.appendChild(letterAvatar);
  } else {
    // Có ảnh thật thì hiển thị ảnh
    avatarPreview.src = avatarSrc;
    avatarPreview.style.display = "block";
  }

  // ====== Khi người dùng chọn ảnh mới ======
  const avatarInput = document.getElementById("avatarInput");
  if (avatarInput) {
    avatarInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        // Nếu đã có avatar chữ thì xóa
        const existingLetter = avatarWrapper.querySelector("div");
        if (existingLetter) existingLetter.remove();

        // Hiển thị ảnh mới
        avatarPreview.src = reader.result;
        avatarPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }
});

// <!-- ========== /WORKHUB SETTINGS OVERLAY ========== -->
// ----------------------------------------------------------------------------------------------------------
// <!-- javascript mở trang cài đặt -->
const whOverlay = document.getElementById("whSettings");
const whBtnOpen = document.getElementById("OpenSettings");
const whBtnClose = document.getElementById("whClose");

// Move settings overlay outside of profile popup
if (whOverlay && whOverlay.parentElement.classList.contains("popup-content")) {
  document.body.appendChild(whOverlay);
}

if (whBtnOpen) {
  whBtnOpen.addEventListener("click", () => {
    whOverlay.style.display = "block";
    if (userMenu) userMenu.style.display = "none";
  });
}
if (whBtnClose) {
  whBtnClose.addEventListener("click", () => {
    whOverlay.style.display = "none";
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && whOverlay.style.display === "block") {
    whOverlay.style.display = "none";
  }
});

// Tabs trong trang cài đặt
document.querySelectorAll(".wh-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".wh-tab")
      .forEach((t) => t.classList.remove("wh-active"));
    document
      .querySelectorAll(".wh-panel")
      .forEach((p) => p.classList.remove("wh-show"));
    tab.classList.add("wh-active");
    document
      .querySelector(`.wh-panel[data-tab="${tab.dataset.tab}"]`)
      ?.classList.add("wh-show");
  });
});

// Sidebar highlight
document.querySelectorAll(".wh-nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".wh-nav-item")
      .forEach((b) => b.classList.remove("wh-active"));
    btn.classList.add("wh-active");
  });
});
// ---------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------
// <!-- javascript đóng popup hiện thông tin -->
// Lấy phần tử popup và nút đóng
const popupProfile = document.getElementById("popupProfile");
const closeProfileBtn = document.getElementById("closeProfileBtn");

// ===== Account menu & profile popup =====
const openProfile = document.getElementById("openProfile");
const userMenu = document.getElementById("userMenu");
openProfile.addEventListener("click", function (e) {
  e.stopPropagation();
  userMenu.style.display =
    userMenu.style.display === "block" ? "none" : "block";
});
document.addEventListener("mousedown", function (e) {
  if (!openProfile.contains(e.target)) {
    userMenu.style.display = "none";
  }
});
document.getElementById("Profile").onclick = function () {
  document.getElementById("popupProfile").style.display = "flex";
  document.getElementById("popupProfile").setAttribute("aria-hidden", "false");
  userMenu.style.display = "none";
};

// Khi bấm nút X thì ẩn popup
closeProfileBtn.addEventListener("click", function () {
  popupProfile.style.display = "none";
});
// <!-- javascript sửa thông tin trong trang cài đặt-->

const editBtn = document.getElementById("editProfileBtn");
const saveBtn = document.getElementById("saveProfileBtn");

editBtn.addEventListener("click", () => {
  // Ẩn nút "Sửa"
  editBtn.style.display = "none";

  // Hiện nút "Xác nhận"
  saveBtn.style.display = "inline-block";

  // Mở khóa các input (trừ username và email)
  document
    .querySelectorAll("input[readonly], select[disabled]")
    .forEach((el) => {
      const fieldName = el.getAttribute("name");
      if (fieldName !== "username" && fieldName !== "email") {
        el.removeAttribute("readonly");
        el.removeAttribute("disabled");
        el.style.background = "#fff";
      }
    });
});

// Khi bấm "Xác nhận" thì đổi lại nút "Sửa"
saveBtn.addEventListener("click", () => {
  editBtn.style.display = "inline-block";
  saveBtn.style.display = "none";
});

// <!-- javascript sửa ảnh và avatar-->
const profileForm = document.getElementById("profileForm");
const avatarInput = document.getElementById("avatarInput");
const backgroundInput = document.getElementById("backgroundInput");
const confirmOverlay = document.getElementById("confirmOverlay");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

// Khi chọn ảnh mới -> hiện popup xác nhận
avatarInput.addEventListener("change", handleImageChange);
backgroundInput.addEventListener("change", handleImageChange);

function handleImageChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  previewImage(
    event,
    event.target.id === "avatarInput" ? "avatarPreview" : "bgPreview"
  );
  confirmOverlay.style.display = "flex";
}

// Hàm xem trước ảnh
function previewImage(event, previewId) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById(previewId).src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Khi bấm “Xác nhận” => submit form + đóng popup
confirmYes.addEventListener("click", () => {
  confirmOverlay.style.display = "none";
  profileForm.submit(); // gửi form để backend lưu vào DB
  popupProfile.style.display = "none"; // đóng popup thông tin
});

// Khi bấm “Hủy” => đóng popup xác nhận
confirmNo.addEventListener("click", () => {
  confirmOverlay.style.display = "none";
  avatarInput.value = "";
  backgroundInput.value = "";
});
