// js/new_request.js

const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");
const titleInput    = document.getElementById("title");
const detailsInput  = document.getElementById("details");

const errBox = document.getElementById("mErr");
const okBox  = document.getElementById("mOk");

const submitBtn = document.getElementById("submitBtn");
const clearBtn  = document.getElementById("clearBtn");
const backBtn   = document.getElementById("backBtn");
const logoutBtn = document.getElementById("logoutBtn");

/* ----------------------------------------------------------
   حماية الصفحة (حسب التصميم السابق: باستخدام localStorage)
----------------------------------------------------------- */
(function protectPage() {
  const role  = localStorage.getItem("ts_current_user_role");
  const email = localStorage.getItem("ts_current_user_email");
  if (role !== "user" || !email) {
    location.href = "index.html";
  }
})();

/* ----------------------------------------------------------
   إرسال التذكرة
----------------------------------------------------------- */
submitBtn.addEventListener("click", async () => {
  const category   = (categoryInput.value || "").trim();
  const priority   = (priorityInput.value || "").trim();
  const titleVal   = (titleInput.value || "").trim();
  const detailsVal = (detailsInput.value || "").trim();
  const createdBy  = (localStorage.getItem("ts_current_user_email") || "").toLowerCase();

  errBox.style.display = "none";
  okBox.style.display  = "none";

  if (!category || !priority || !titleVal || !detailsVal) {
    errBox.textContent = "Please fill all fields.";
    errBox.style.display = "block";
    return;
  }

  try {
    await db.collection("tickets").add({
      type: "Request",
      category,
      priority,
      title: titleVal,
      details: detailsVal,
      status: "Open",
      createdAt: new Date().toISOString(),
      createdBy, // أهم تعديل: الاعتماد على البريد من localStorage
    });

    okBox.style.display = "block";

    setTimeout(() => {
      location.href = "my_tickets.html";
    }, 900);
  } catch (error) {
    console.error("Error saving ticket:", error);
    errBox.textContent = "Error saving ticket. Try again.";
    errBox.style.display = "block";
  }
});

/* ----------------------------------------------------------
   CLEAR
----------------------------------------------------------- */
clearBtn.addEventListener("click", () => {
  categoryInput.value = "";
  priorityInput.value = "Medium";
  titleInput.value    = "";
  detailsInput.value  = "";
  errBox.style.display = "none";
  okBox.style.display  = "none";
});

/* ----------------------------------------------------------
   BACK + LOGOUT
----------------------------------------------------------- */
backBtn.addEventListener("click", () => {
  location.href = "user_dashboard.html";
});

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  firebase.auth().signOut().finally(() => {
    location.href = "index.html";
  });
});
