// js/my_tickets.js

/* ----------------------------------------------------------
   مراجع العناصر العامة
----------------------------------------------------------- */

const rowsEl = document.getElementById("rows");
const emptyEl = document.getElementById("empty");
const viewDialog = document.getElementById("viewDialog");
const hdrEmailEl = document.getElementById("hdrEmail");

const statusFilterEl = document.getElementById("statusFilter");
const searchEl = document.getElementById("search");
const applyBtn = document.getElementById("applyBtn");
const clearBtn = document.getElementById("clearBtn");
const backBtn = document.getElementById("backBtn");
const logoutBtn = document.getElementById("logoutBtn");
const closeViewBtn = document.getElementById("closeViewBtn");

const modalTitleEl = document.getElementById("m_title");
const modalBodyEl = document.getElementById("m_body");
const modalMetaEl = document.getElementById("m_meta");

let currentUser = null;
let allTickets = [];

/* ----------------------------------------------------------
   حماية الصفحة عبر Firebase Auth
----------------------------------------------------------- */

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  currentUser = user;
  if (hdrEmailEl) {
    hdrEmailEl.textContent = user.email || "";
  }

  loadTickets();
});

/* ----------------------------------------------------------
   تحميل التذاكر من Firestore للمستخدم الحالي فقط
----------------------------------------------------------- */

async function loadTickets() {
  if (!currentUser) return;

  rowsEl.innerHTML = "";
  emptyEl.style.display = "none";

  const email = currentUser.email;

  try {
    const snap = await db
      .collection("tickets")
      .where("createdBy", "==", email)
      .orderBy("createdAt", "desc")
      .get();

    allTickets = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    renderTickets();
  } catch (err) {
    console.error("Error loading tickets (index issue or rules):", err);
  }
}

/* ----------------------------------------------------------
   عرض الجدول
----------------------------------------------------------- */

function renderTickets() {
  const q = (searchEl.value || "").toLowerCase();
  const s = statusFilterEl.value;

  const filtered = allTickets.filter((t) => {
    const statusOk = !s || t.status === s;
    const queryOk =
      !q ||
      (t.title || "").toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q);

    return statusOk && queryOk;
  });

  rowsEl.innerHTML = "";

  filtered.forEach((t) => {
    const tr = document.createElement("tr");
    const createdAtText = t.createdAt
      ? new Date(t.createdAt).toLocaleString()
      : "";

    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.type || ""}</td>
      <td>${t.title || ""}</td>
      <td><span class="status ${t.status}">${t.status}</span></td>
      <td>${createdAtText}</td>
      <td><button class="btn outline" data-ticket-id="${t.id}">View</button></td>
    `;

    rowsEl.appendChild(tr);
  });

  emptyEl.style.display = filtered.length ? "none" : "block";

  // ربط أزرار View بعد بناء الصف
  rowsEl.querySelectorAll("button[data-ticket-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-ticket-id");
      openView(id);
    });
  });
}

/* ----------------------------------------------------------
   عرض التفاصيل داخل Modal
----------------------------------------------------------- */

function openView(id) {
  const t = allTickets.find((x) => x.id === id);
  if (!t) return;

  const createdAtText = t.createdAt
    ? new Date(t.createdAt).toLocaleString()
    : "-";

  modalTitleEl.textContent = `${t.type || ""} – ${t.title || ""}`;

  modalBodyEl.textContent = `
Category: ${t.category || "-"}
Priority: ${t.priority || "-"}
Status: ${t.status || "-"}
Created: ${createdAtText}

Details:
${t.details || "-"}
`.trim();

  modalMetaEl.textContent = `By: ${t.createdBy || "-"}`;

  if (typeof viewDialog.showModal === "function") {
    viewDialog.showModal();
  } else {
    viewDialog.setAttribute("open", "open");
  }
}

/* ----------------------------------------------------------
   أزرار التحكم
----------------------------------------------------------- */

applyBtn.addEventListener("click", renderTickets);

clearBtn.addEventListener("click", () => {
  statusFilterEl.value = "";
  searchEl.value = "";
  renderTickets();
});

backBtn.addEventListener("click", () => {
  location.href = "user_dashboard.html";
});

logoutBtn.addEventListener("click", () => {
  firebase.auth().signOut();
});

closeViewBtn.addEventListener("click", () => {
  viewDialog.close();
});
