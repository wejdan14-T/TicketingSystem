// js/new_complaint.js

const titleInput   = document.getElementById("title");
const detailsInput = document.getElementById("details");
const prioritySel  = document.getElementById("priority");

const errBox = document.getElementById("mErr");
const okBox  = document.getElementById("mOk");

const submitBtn = document.getElementById("submitBtn");
const clearBtn  = document.getElementById("clearBtn");
const backBtn   = document.getElementById("backBtn");
const logoutBtn = document.getElementById("logoutBtn");

/* ----------------------------------------------------------
   حماية الصفحة عبر Firebase Auth
----------------------------------------------------------- */
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }
});

/* ----------------------------------------------------------
   إرسال الشكوى
----------------------------------------------------------- */

submitBtn.addEventListener("click", async () => {
  const title    = (titleInput.value || "").trim();
  const details  = (detailsInput.value || "").trim();
  const priority = (prioritySel.value || "").trim();

  errBox.style.display = "none";
  okBox.style.display  = "none";

  if (!title || !details) {
    errBox.textContent = "Please fill all fields.";
    errBox.style.display = "block";
    return;
  }

  const user = firebase.auth().currentUser;
  if (!user) {
    errBox.textContent = "Session expired. Please sign in again.";
    errBox.style.display = "block";
    location.href = "index.html";
    return;
  }

  const userEmail = user.email;

  try {
    await db.collection("tickets").add({
      type: "Complaint",
      title,
      priority,
      details,
      status: "Open",
      createdAt: new Date().toISOString(),
      createdBy: userEmail,
    });

    okBox.style.display = "block";

    setTimeout(() => {
      location.href = "my_tickets.html";
    }, 800);
  } catch (e) {
    console.error("Error saving complaint:", e);
    errBox.textContent = "Error saving complaint.";
    errBox.style.display = "block";
  }
});

/* ----------------------------------------------------------
   CLEAR
----------------------------------------------------------- */

clearBtn.addEventListener("click", () => {
  titleInput.value = "";
  detailsInput.value = "";
  prioritySel.value = "Medium";
  errBox.style.display = "none";
  okBox.style.display = "none";
});

/* ----------------------------------------------------------
   BACK + LOGOUT
----------------------------------------------------------- */

backBtn.addEventListener("click", () => {
  location.href = "user_dashboard.html";
});

logoutBtn.addEventListener("click", () => {
  firebase.auth().signOut();
});
