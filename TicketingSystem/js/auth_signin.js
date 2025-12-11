// js/auth_signin.js

// UID الأدمن
const ADMIN_UID = "GiOAqZAYIOYI2QwvmVeCDmEg9mF2";

// عنصر رسالة الخطأ
const errorBox = document.getElementById("error");

// دالة مساعدة لعرض الأخطاء للمستخدم
function showError(message) {
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.style.display = "block";
}

// إخفاء رسالة الخطأ في البداية
if (errorBox) {
  errorBox.style.display = "none";
}

// حدث زر تسجيل الدخول
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const emailInput = document.getElementById("email");
  const passInput  = document.getElementById("password");

  const email = emailInput.value.trim();
  const pass  = passInput.value.trim();

  errorBox.style.display = "none";

  if (!email || !pass) {
    showError("Please enter email and password.");
    return;
  }

  try {
    const result = await auth.signInWithEmailAndPassword(email, pass);
    const user = result.user;

    if (!user) {
      showError("Invalid email or password.");
      return;
    }

    // تحديد الدور حسب UID
    if (user.uid === ADMIN_UID) {
      localStorage.setItem("ts_current_user_role", "admin");
      localStorage.setItem("ts_current_user_email", email);
      location.href = "admin_dashboard.html";
    } else {
      localStorage.setItem("ts_current_user_role", "user");
      localStorage.setItem("ts_current_user_email", email);
      location.href = "user_dashboard.html";
    }
  } catch (err) {
    console.error("Login error:", err);
    showError("Invalid email or password.");
  }
});
