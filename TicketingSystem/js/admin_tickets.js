// js/admin_tickets.js

/* ----------------------------------------------------------
   حماية صفحة الأدمن
----------------------------------------------------------- */

const ADMIN_UID = "GiOAqZAYIOYI2QwvmVeCDmEg9mF2"; // UID الأدمن الصحيح

const rows  = document.getElementById("rows");
const empty = document.getElementById("empty");
const dlg   = document.getElementById("dlg");

let allTickets = [];
let currentTicketId = null;

firebase.auth().onAuthStateChanged((user) => {
  if (!user || user.uid !== ADMIN_UID) {
    location.href = "index.html";
    return;
  }
  loadTickets();
});

/* ----------------------------------------------------------
   تحميل جميع التذاكر من Firestore
----------------------------------------------------------- */

async function loadTickets() {
  try {
    rows.innerHTML = "";
    empty.style.display = "none";

    const snap = await db
      .collection("tickets")
      .orderBy("createdAt", "desc")
      .get();

    allTickets = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render();
  } catch (err) {
    console.error("Error loading tickets:", err);
  }
}

/* ----------------------------------------------------------
   فلترة وعرض التذاكر
----------------------------------------------------------- */

function render() {
  const typeF = document.getElementById("typeFilter").value;
  const statF = document.getElementById("statusFilter").value;
  const q = document
    .getElementById("search")
    .value.trim()
    .toLowerCase();

  const filtered = allTickets.filter((t) =>
    (!typeF || t.type === typeF) &&
    (!statF || t.status === statF) &&
    (!q ||
      (t.title || "").toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q))
  );

  rows.innerHTML = "";

  filtered.forEach((t) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.type || ""}</td>
      <td>${t.title || ""}</td>
      <td>${t.createdBy || ""}</td>
      <td><span class="status ${t.status}">${t.status}</span></td>
      <td>${t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}</td>
      <td><button class="btn outline" data-ticket-id="${t.id}">Open</button></td>
    `;
    rows.appendChild(tr);
  });

  empty.style.display = filtered.length ? "none" : "block";

  // ربط أزرار Open بعد إعادة بناء الجدول
  rows.querySelectorAll("button[data-ticket-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-ticket-id");
      openTicket(id);
    });
  });
}

/* ----------------------------------------------------------
   فتح تذكرة
----------------------------------------------------------- */

function openTicket(id) {
  const t = allTickets.find((x) => x.id === id);
  if (!t) return;

  const titleEl = document.getElementById("m_title");
  const bodyEl = document.getElementById("m_body");
  const statusEl = document.getElementById("m_status");
  const notesEl = document.getElementById("m_notes");

  titleEl.textContent = `${t.type} – ${t.title} (${t.id})`;

  const createdAtText = t.createdAt
    ? new Date(t.createdAt).toLocaleString()
    : "-";

  bodyEl.textContent = `
Category: ${t.category || "-"}
Priority: ${t.priority || "-"}
Status: ${t.status}
Created: ${createdAtText}
By: ${t.createdBy || "-"}

Details:
${t.details || "-"}

Notes:
${t.notes || "-"}
`.trim();

  statusEl.value = t.status || "Open";
  notesEl.value = t.notes || "";

  currentTicketId = id;

  if (typeof dlg.showModal === "function") {
    dlg.showModal();
  } else {
    dlg.setAttribute("open", "open");
  }
}

/* ----------------------------------------------------------
   حفظ التعديلات في Firestore
----------------------------------------------------------- */

document.getElementById("saveBtn").onclick = async () => {
  if (!currentTicketId) return;

  const newStatus = document.getElementById("m_status").value;
  const newNotes = document.getElementById("m_notes").value;

  try {
    await db
      .collection("tickets")
      .doc(currentTicketId)
      .update({
        status: newStatus,
        notes: newNotes,
      });

    dlg.close();
    await loadTickets();
  } catch (err) {
    console.error("Error updating ticket:", err);
  }
};

/* ----------------------------------------------------------
   غلق المودال
----------------------------------------------------------- */

document.getElementById("closeDlgBtn").addEventListener("click", () => {
  dlg.close();
});

/* ----------------------------------------------------------
   فلترة
----------------------------------------------------------- */

document.getElementById("applyBtn").onclick = render;

document.getElementById("clearBtn").onclick = () => {
  document.getElementById("typeFilter").value = "";
  document.getElementById("statusFilter").value = "";
  document.getElementById("search").value = "";
  render();
};

/* ----------------------------------------------------------
   تسجيل الخروج
----------------------------------------------------------- */

document.getElementById("logoutBtn").onclick = () => {
  firebase.auth().signOut();
};
