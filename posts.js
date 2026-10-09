// ===== بيانات الأخبار + دوال مشتركة (بتستخدمها الصفحة الرئيسية وصفحة الخبر) =====
// date: تاريخ النشر بصيغة سنة-شهر-يوم (غيّره لتاريخ كل خبر الحقيقي)
// likes: العدد الأساسي للايكات (بيزيد عليه رقم عشوائي صغير مع كل زيارة)
// خبر جديد: ضيف سطر هنا + صورة photo_numX.png + مقال subject_numX.txt
const posts = [
  { id: 8, title: "الأسطورة Docker",                        category: "programming", date: "2026-10-09", likes: 176 },
  { id: 7, title: "اختيار محرر الأكواد المناسب",            category: "programming", date: "2026-10-09", likes: 131 },
  { id: 6, title: "أزمة الرامات العالمية",                  category: "programming", date: "2026-10-09", likes: 94  },
  { id: 1, title: "البرمجة مع الـ AI",                    category: "programming", date: "2026-10-09", likes: 142 },
  { id: 2, title: "The New Version",                        category: "programming", date: "2026-10-09", likes: 63  },
  { id: 3, title: "بعد 14 عام.. ماين كرافت تضيف بُعد جديد", category: "games",       date: "2026-10-09", likes: 205 },
  { id: 4, title: "أفضل موقع لمودات ماين كرافت",            category: "games",       date: "2026-10-09", likes: 118 },
  { id: 5, title: "ألعاب PS2 أسطورية",                      category: "games",       date: "2026-10-09", likes: 87  }
];

const MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

// "منذ X أسبوع · شهر سنة"
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const weeks = Math.floor((Date.now() - d.getTime()) / (7 * 24 * 60 * 60 * 1000));
  let ago;
  if (weeks <= 0) ago = "هذا الأسبوع";
  else if (weeks === 1) ago = "منذ أسبوع";
  else if (weeks === 2) ago = "منذ أسبوعين";
  else if (weeks <= 10) ago = `منذ ${weeks} أسابيع`;
  else ago = `منذ ${weeks} أسبوعًا`;
  return `${ago} · ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// مقتطف قصير من المقال للكارت
function makeExcerpt(text, max = 160) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return flat.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// هل الزائر ضغط لايك؟ (محفوظ في متصفحه عشان القلب يفضل أحمر)
function loadMine() {
  try { return JSON.parse(localStorage.getItem("rz_mine")) || {}; }
  catch { return {}; }
}
function saveMine(data) {
  try { localStorage.setItem("rz_mine", JSON.stringify(data)); } catch {}
}
const mine = loadMine(); // { "1": true }

// العدد الأساسي للخبر: ثابت طول الزيارة، ويتغير بين زيارة وزيارة
function getBase(p) {
  const key = "rz_base_" + p.id;
  try {
    let v = sessionStorage.getItem(key);
    if (v === null) {
      v = p.likes + Math.floor(Math.random() * 13);
      sessionStorage.setItem(key, v);
    }
    return Number(v);
  } catch {
    return p.likes + Math.floor(Math.random() * 13);
  }
}

// زرار اللايك (نفسه في الفيد وفي صفحة الخبر)
function makeLikeButton(p) {
  const base = getBase(p);
  const btn = document.createElement("button");
  btn.className = "like-btn";
  btn.setAttribute("aria-label", "لايك");
  btn.innerHTML = `<span class="heart"></span><span class="count"></span>`;

  function paint() {
    const liked = !!mine[p.id];
    btn.classList.toggle("liked", liked);
    btn.querySelector(".heart").textContent = liked ? "♥" : "♡";
    btn.querySelector(".count").textContent = base + (liked ? 1 : 0);
  }
  paint();

  btn.addEventListener("click", () => {
    mine[p.id] = !mine[p.id];
    saveMine(mine);
    paint();
  });
  return btn;
}
