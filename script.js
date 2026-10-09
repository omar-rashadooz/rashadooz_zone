// الأخبار - كل خبر مربوط بصورته وملف المقال بتاعه
// date: تاريخ النشر بصيغة سنة-شهر-يوم (غيّره لتاريخ كل خبر الحقيقي)
// likes: العدد الأساسي للايكات (بيزيد عليه رقم عشوائي صغير مع كل فتحة للموقع)
const posts = [
  { id: 8, title: "Docker containers",                        category: "programming", date: "2026-10-09", likes: 176 },
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

// هل الزائر ضغط لايك؟ (محفوظ في متصفحه عشان القلب يفضل أحمر)
function loadMine() {
  try { return JSON.parse(localStorage.getItem("rz_mine")) || {}; }
  catch { return {}; }
}
function saveMine(data) {
  try { localStorage.setItem("rz_mine", JSON.stringify(data)); } catch {}
}
const mine = loadMine(); // { "1": true }

const feed = document.getElementById("feed");
const home = document.getElementById("home");
const contact = document.getElementById("contact");

// بناء كل البوستات
posts.forEach(p => {
  // العدد = الأساسي + رقم عشوائي صغير (يتغير مع كل فتحة)
  const base = p.likes + Math.floor(Math.random() * 13);
  const isLiked = !!mine[p.id];

  const article = document.createElement("article");
  article.className = "post";
  article.dataset.category = p.category;

  article.innerHTML = `
    <div class="post-head">
      <img class="avatar" src="logo.png" alt="">
      <div class="post-meta">
        <strong>RASHADOOZ ZONE</strong>
        <small>${p.category === "games" ? "Games" : "Programming"} · ${formatDate(p.date)}</small>
      </div>
    </div>
    <h2 class="post-title">${p.title}</h2>
    <img class="post-img" src="photo_num${p.id}.png" alt="${p.title}" loading="lazy">
    <div class="post-body collapsed">جاري التحميل...</div>
    <div class="post-actions">
      <button class="read-more">اقرأ المزيد</button>
      <button class="like-btn ${isLiked ? "liked" : ""}" aria-label="لايك">
        <span class="heart">${isLiked ? "♥" : "♡"}</span>
        <span class="count">${base + (isLiked ? 1 : 0)}</span>
      </button>
    </div>
  `;
  feed.appendChild(article);

  const body = article.querySelector(".post-body");
  const readBtn = article.querySelector(".read-more");
  const likeBtn = article.querySelector(".like-btn");

  // تحميل المقال من ملف subject_numX.txt
  fetch(`subject_num${p.id}.txt`)
    .then(r => { if (!r.ok) throw new Error(); return r.text(); })
    .then(text => { body.textContent = text.trim(); })
    .catch(() => { body.textContent = "تعذر تحميل المقال."; });

  readBtn.addEventListener("click", () => {
    const collapsed = body.classList.toggle("collapsed");
    readBtn.textContent = collapsed ? "اقرأ المزيد" : "إخفاء";
  });

  likeBtn.addEventListener("click", () => {
    mine[p.id] = !mine[p.id];
    saveMine(mine);
    likeBtn.classList.toggle("liked", mine[p.id]);
    likeBtn.querySelector(".heart").textContent = mine[p.id] ? "♥" : "♡";
    likeBtn.querySelector(".count").textContent = base + (mine[p.id] ? 1 : 0);
  });
});

// التنقل بين الأقسام
const links = document.querySelectorAll(".navbar a");

function applyFilter(filter) {
  links.forEach(a => a.classList.toggle("active", a.dataset.filter === filter));

  home.hidden = filter !== "home";
  contact.hidden = filter !== "contact";
  feed.hidden = !(filter === "programming" || filter === "games");

  document.querySelectorAll(".post").forEach(el => {
    el.hidden = el.dataset.category !== filter;
  });
}

function go(filter) {
  applyFilter(filter);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

links.forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); go(a.dataset.filter); });
});
document.querySelectorAll("[data-go]").forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); go(a.dataset.go); });
});

applyFilter("home");
