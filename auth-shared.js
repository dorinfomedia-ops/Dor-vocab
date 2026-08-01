import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth, db } from "./firebase-config.js";

// טוען את מסמך users/{uid} של המשתמש המחובר. מחזיר null אם אינו קיים.
export async function getOwnProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

// מוודא שהמשתמש קיים, פעיל, ומה-role שלו נמצא ברשימת התפקידים המותרים.
// אם לא - מנתק אותו מיד וזורק שגיאה. לעולם לא משאירים משתמש לא מאומת מחובר.
export async function requireRole(user, allowedRoles) {
  const profile = await getOwnProfile(user.uid);
  if (!profile) {
    await signOut(auth);
    throw new Error('החשבון עדיין לא הוגדר במערכת. פנה למנהל המערכת או למורה שלך.');
  }
  if (profile.active === false) {
    await signOut(auth);
    throw new Error('החשבון אינו פעיל. פנה למנהל המערכת או למורה שלך.');
  }
  if (!allowedRoles.includes(profile.role)) {
    await signOut(auth);
    throw new Error('החשבון אינו מורשה להיכנס במסלול זה.');
  }
  return profile;
}

// ממיר קודי שגיאה טכניים של Firebase להודעות ידידותיות בעברית
export function friendlyError(error) {
  const code = error?.code || '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'פרטי ההתחברות אינם נכונים.';
  if (code.includes('too-many-requests')) return 'בוצעו יותר מדי ניסיונות. נסה שוב מאוחר יותר.';
  if (code.includes('popup-closed')) return 'חלון ההתחברות נסגר לפני שהפעולה הושלמה.';
  if (code.includes('popup-blocked')) return 'הדפדפן חסם את חלון ההתחברות.';
  if (code.includes('network-request-failed')) return 'יש בעיית חיבור. נסה שוב.';
  if (code.includes('operation-not-allowed')) return 'שיטת ההתחברות עדיין לא הופעלה ב-Firebase.';
  if (code.includes('configuration-not-found')) return 'שיטת ההתחברות הזו עדיין לא מוגדרת ב-Firebase. יש להפעיל אותה ב-Console תחת Authentication.';
  if (code.includes('invalid-email')) return 'כתובת האימייל אינה תקינה.';
  if (code.includes('user-disabled')) return 'החשבון הזה הושבת.';
  return error?.message || 'לא הצלחנו להתחבר. נסה שוב.';
}

export function setBusy(button, busy, label) {
  if (!button.dataset.label) button.dataset.label = button.textContent;
  button.disabled = busy;
  button.textContent = busy ? label : button.dataset.label;
}
