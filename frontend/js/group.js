// <!-- javascript hiện cửa sổ tạo nhóm -->

const popupGroup = document.getElementById("popupGroup");
// nút để mở popup (dòng 1500)
const btnAddGroup = document.getElementById("btnAddGroup");
const closeGroupPopup = document.getElementById("closeGroupPopup"); // nút X
const cancelGroupBtn = document.getElementById("cancelGroupBtn"); // nút Huỷ

// Hàm mở popup
function openGroupPopup() {
  popupGroup.style.display = "flex";
  popupGroup.style.alignItems = "center";
  popupGroup.style.justifyContent = "center";
  popupGroup.style.backdropFilter = "blur(2px)";
}

// Hàm đóng popup
function closeGroup() {
  popupGroup.style.display = "none";
}

// Sự kiện mở popup
if (btnAddGroup) {
  btnAddGroup.addEventListener("click", openGroupPopup);
}

// Sự kiện đóng popup khi bấm nút X hoặc Huỷ
closeGroupPopup.addEventListener("click", closeGroup);
cancelGroupBtn.addEventListener("click", closeGroup);

// Đóng popup khi click ra ngoài phần nội dung
popupGroup.addEventListener("click", function (e) {
  if (e.target === popupGroup) {
    closeGroup();
  }
});
// ---------------------------------------------------
// Load danh sách nhóm đã tham gia
async function loadGroups() {
  const groupList = document.getElementById("groupList");
  if (!groupList) return;
  groupList.innerHTML =
    '<div style="text-align:center;color:var(--text-muted);padding:20px;">Đang tải...</div>';
  try {
    const res = await fetch("/groups/my-groups", {
      credentials: "same-origin",
    });
    if (!res.ok) throw new Error("Lỗi khi tải nhóm");
    const groups = await res.json();
    if (!Array.isArray(groups) || groups.length === 0) {
      groupList.innerHTML =
        '<div style="text-align:center;color:var(--text-muted);padding:20px;">Bạn chưa tham gia nhóm nào.</div>';
      return;
    }
    groupList.innerHTML = groups
      .map((g) => {
        const leaderName = g.leaderName || "Không rõ";
        return `
                      <div class="group-card" data-id="${g.id}" >
                        <div class="group-title">${g.groupName}</div>
                        <div class="group-leader">Nhóm trưởng: <span>${leaderName}</span></div>
                      </div>
                      `;
      })
      .join("");

    // Thêm sự kiện click sau khi render
    document.querySelectorAll(".group-card").forEach((card) => {
      card.addEventListener("click", () => {
        const groupId = card.getAttribute("data-id");
        window.location.href = `/groups/${groupId}`; // render group.ejs tương ứng
      });
    });
  } catch (err) {
    groupList.innerHTML =
      '<div style="color:#ef4444;text-align:center;padding:20px;">Lỗi khi tải danh sách nhóm.</div>';
  }
}
window.addEventListener("DOMContentLoaded", loadGroups);

// Xử lý submit tạo nhóm
const groupForm = document.getElementById("groupForm");
if (groupForm) {
  groupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const groupName = document.getElementById("groupName").value.trim();
    if (!groupName) return alert("Vui lòng nhập tên nhóm");
    try {
      const res = await fetch("/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupName }),
        credentials: "same-origin",
      });
      const data = await res.json();
      // if (!res.ok) throw new Error(data.error || 'Lỗi tạo nhóm');
      // alert('Tạo nhóm thành công!');
      if (!res.ok) {
        showToast(data.error || "Lỗi tạo nhóm", "error");
      } else {
        showToast("Tạo nhóm thành công!", "success");
      }

      groupForm.reset();
      document.getElementById("popupGroup").style.display = "none";
      loadGroups();
    } catch (err) {
      alert(err.message || "Lỗi khi tạo nhóm");
    }
  });
}
// ----------------------------------------------------------------------------------------------------------
// Javascript thêm thành viên
