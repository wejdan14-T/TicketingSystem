// js/user_dashboard.js

const hdrEmailEl = document.getElementById("hdrEmail");
const helloEl    = document.getElementById("hello");

const kOpenEl = document.getElementById("k_open");
const kProgEl = document.getElementById("k_prog");
const kResEl  = document.getElementById("k_res");
const kAllEl  = document.getElementById("k_all");

const logoutBtn = document.getElementById("logoutBtn");

/* ----------------------------------------------------------
   حماية الصفحة عبر Firebase Auth
----------------------------------------------------------- */
firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  const email = user.email || "";

  if (hdrEmailEl) {
    hdrEmailEl.textContent = email;
  }
  if (helloEl) {
    helloEl.textContent = `Hi, ${email}`;
  }

  await loadKPIs(email);
});

/* ----------------------------------------------------------
   تحميل الإحصائيات من Firestore
----------------------------------------------------------- */
async function loadKPIs(email) {
  try {
    const snap = await db
      .collection("tickets")
      .where("createdBy", "==", email)
      .get();

    const all = snap.docs.map((d) => d.data());

    const openCount = all.filter((t) => t.status === "Open").length;
    const progCount = all.filter(
      (t) => t.status === "InProgress" || t.status === "In Progress"
    ).length;
    const resCount = all.filter((t) => t.status === "Resolved").length;

    if (kOpenEl) kOpenEl.textContent = openCount;
    if (kProgEl) kProgEl.textContent = progCount;
    if (kResEl)  kResEl.textContent  = resCount;
    if (kAllEl)  kAllEl.textContent  = all.length;
  } catch (err) {
    console.error("KPIs error:", err);
  }
}

/* ----------------------------------------------------------
   تفعيل بطاقات التنقل
----------------------------------------------------------- */
document.querySelectorAll(".nav-card").forEach((card) => {
  card.addEventListener("click", () => {
    const href = card.getAttribute("data-href");
    if (href) {
      location.href = href;
    }
  });
});

/* ----------------------------------------------------------
   تسجيل الخروج
----------------------------------------------------------- */
logoutBtn.addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .finally(() => {
      // بإمكانك مسح localStorage إن كنت تستخدمه للأدوار
      localStorage.removeItem("ts_current_user_role");
      localStorage.removeItem("ts_current_user_email");
      location.href = "index.html";
    });
});
