/* ----------------------------------------------------------
   Firebase Configuration & Initialization
   ملف مستقل يحتوي فقط على إعدادات Firebase
   يتم استدعاؤه داخل جميع صفحات المشروع
----------------------------------------------------------- */

// 1) firebaseConfig الخاص بمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyAHa4GHphfRQKNIBWyzKDtMkou2ddPdJkU",
  authDomain: "ticketingsystem-fa477.firebaseapp.com",
  projectId: "ticketingsystem-fa477",
  storageBucket: "ticketingsystem-fa477.firebasestorage.app",
  messagingSenderId: "767363695970",
  appId: "1:767363695970:web:ca65928add862b2d83183b",
  measurementId: "G-PN96S3KCFB"
};

// 2) تهيئة Firebase مرة واحدة
firebase.initializeApp(firebaseConfig);

// 3) تفعيل الخدمات المطلوبة في المشروع
const auth = firebase.auth();        // تسجيل الدخول / الخروج
const db   = firebase.firestore();   // قاعدة البيانات Firestore
