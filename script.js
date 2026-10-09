// الأخبار الخمسة - كل خبر مربوط بصورته وملف المقال بتاعه
const posts = [
  { id: 1, title: "البرمجة مع الـ AI",                 category: "programming" },
  { id: 2, title: "The New Version",                    category: "programming" },
  { id: 3, title: "بعد 14 عام.. ماين كرافت تضيف بُعد جديد", category: "games" },
  { id: 4, title: "أفضل موقع لمودات ماين كرافت",        category: "games" },
  { id: 5, title: "ألعاب PS2 أسطورية",                  category: "games" }
];

const feed = document.getElementById("feed");
const contact = document.getElementById("contact");

// بناء كل البوستات
posts.forEach(p => {
  const article = document.createElement("article");
  article.className = "post";
  article.dataset.category = p.category;

  article.innerHTML = `
    <div class="post-head">
      <div class="avatar">R</div>
      <div class="post-meta">
        <strong>RASHADOOZ ZONE</strong>
        <small>${p.category === "games" ? "Games" : "Programming"}</small>
      </div>
    </div>
    <h2 class="post-title">${p.title}</h2>
    <img src="photo_num${p.id}.png" alt="${p.title}" loading="lazy">
    <div class="post-body collapsed">جاري التحميل...</div>
    <button class="read-more">اقرأ المزيد</button>
  `;
  feed.appendChild(article);

  const body = article.querySelector(".post-body");
  const btn = article.querySelector(".read-more");

  // تحميل المقال من ملف subject_numX.txt
  fetch(`subject_num${p.id}.txt`)
    .then(r => { if (!r.ok) throw new Error(); return r.text(); })
    .then(text => { body.textContent = text.trim(); })
    .catch(() => { body.textContent = "تعذر تحميل المقال."; });

  btn.addEventListener("click", () => {
    const collapsed = body.classList.toggle("collapsed");
    btn.textContent = collapsed ? "اقرأ المزيد" : "إخفاء";
  });
});

// التنقل بين الأقسام
const links = document.querySelectorAll(".navbar a");

function applyFilter(filter) {
  links.forEach(a => a.classList.toggle("active", a.dataset.filter === filter));

  if (filter === "contact") {
    feed.hidden = true;
    contact.hidden = false;
    return;
  }
  contact.hidden = true;
  feed.hidden = false;
  document.querySelectorAll(".post").forEach(el => {
    el.hidden = !(filter === "all" || el.dataset.category === filter);
  });
}

links.forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    applyFilter(a.dataset.filter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

applyFilter("all");
