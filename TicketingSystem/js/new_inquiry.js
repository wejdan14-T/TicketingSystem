// js/new_inquiry.js

const titleInput    = document.getElementById("title");
const detailsInput  = document.getElementById("details");
const categoryInput = document.getElementById("category");

const errBox = document.getElementById("mErr");
const okBox  = document.getElementById("mOk");

const submitBtn = document.getElementById("submitBtn");
const clearBtn  = document.getElementById("clearBtn");
const backBtn   = document.getElementById("backBtn");
const logoutBtn = document.getElementById("logoutBtn");

/* ----------------------------------------------------------
   حماية الصفحة بالتأكد من تسجيل الدخول
----------------------------------------------------------- */
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }
});

/* ----------------------------------------------------------
   زر الإرسال
----------------------------------------------------------- */
submitBtn.addEventListener("click", async () => {
  const title    = (titleInput.value || "").trim();
  const details  = (detailsInput.value || "").trim();
  const category = (categoryInput.value || "").trim();

  errBox.style.display = "none";
  okBox.style.display  = "none";

  if (!title || !details) {
    errBox.textContent = "Please fill all required fields.";
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
      type: "Inquiry",
      title,
      details,
      category: category || "",
      priority: "Medium",
      status: "Open",
      createdAt: new Date().toISOString(),
      createdBy: userEmail,
    });

    okBox.style.display = "block";

    setTimeout(() => {
      location.href = "my_tickets.html";
    }, 900);
  } catch (e) {
    console.error("Error saving inquiry:", e);
    errBox.textContent = "Error saving inquiry.";
    errBox.style.display = "block";
  }
});

/* ----------------------------------------------------------
   زر Clear
----------------------------------------------------------- */
clearBtn.addEventListener("click", () => {
  titleInput.value    = "";
  detailsInput.value  = "";
  categoryInput.value = "";
  errBox.style.display = "none";
  okBox.style.display  = "none";
});

/* ----------------------------------------------------------
   الرجوع والخروج
----------------------------------------------------------- */
backBtn.addEventListener("click", () => {
  location.href = "user_dashboard.html";
});

logoutBtn.addEventListener("click", () => {
  firebase.auth().signOut();
});
