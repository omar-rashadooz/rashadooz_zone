// الصفحة الرئيسية: الفيد + التنقل + البحث (البيانات والدوال المشتركة في posts.js)
const feed = document.getElementById("feed");
const home = document.getElementById("home");
const contact = document.getElementById("contact");
const searchInput = document.getElementById("search");

// نص كل مقال بعد التطبيع (للبحث): { id: "..." }
const texts = {};

// تطبيع النص العربي/الإنجليزي: حروف صغيرة، من غير تشكيل، وتوحيد الهمزات والتاء المربوطة
function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

// رسالة "مفيش نتايج"
const noResults = document.createElement("p");
noResults.className = "no-results";
noResults.hidden = true;
noResults.textContent = "مفيش نتايج للبحث ده.";
feed.appendChild(noResults);

// بناء كارت لكل خبر
posts.forEach(p => {
  const url = `post.html?id=${p.id}`;
  const article = document.createElement("article");
  article.className = "post";
  article.dataset.category = p.category;
  article.dataset.id = p.id;

  article.innerHTML = `
    <div class="post-head">
      <img class="avatar" src="logo.png" alt="">
      <div class="post-meta">
        <strong>RASHADOOZ ZONE</strong>
        <small>${p.category === "games" ? "Games" : "Programming"} · ${formatDate(p.date)}</small>
      </div>
    </div>
    <a class="post-link" href="${url}">
      <h2 class="post-title">${p.title}</h2>
      <img class="post-img" src="photo_num${p.id}.png" alt="${p.title}" loading="lazy">
    </a>
    <p class="post-excerpt">جاري التحميل...</p>
    <div class="post-actions">
      <a class="read-more" href="${url}">اقرأ المزيد</a>
    </div>
  `;
  article.querySelector(".post-actions").appendChild(makeLikeButton(p));
  feed.insertBefore(article, noResults);

  // مقتطف من ملف subject_numX.txt + تخزين النص للبحث
  const excerpt = article.querySelector(".post-excerpt");
  fetch(`subject_num${p.id}.txt`)
    .then(r => { if (!r.ok) throw new Error(); return r.text(); })
    .then(text => {
      excerpt.textContent = makeExcerpt(text);
      texts[p.id] = normalize(text);
      if (searchInput.value.trim()) render(); // نحدّث النتايج لو فيه بحث شغال
    })
    .catch(() => { excerpt.textContent = ""; });
});

// آخر خبر في كل قسم (الأحدث بالتاريخ، ولو التاريخ واحد فاللي في أول القايمة)
const latestBox = document.getElementById("latest");
[
  { category: "programming", label: "آخر خبر في البرمجة" },
  { category: "games",       label: "آخر خبر في الألعاب" }
].forEach(({ category, label }) => {
  const p = posts
    .filter(x => x.category === category)
    .reduce((best, x) => (!best || x.date > best.date ? x : best), null);
  if (!p) return;

  const a = document.createElement("a");
  a.className = "latest-card";
  a.href = `post.html?id=${p.id}`;
  a.innerHTML = `
    <span class="latest-label">${label}</span>
    <img src="photo_num${p.id}.png" alt="${p.title}" loading="lazy">
    <div class="latest-info">
      <h3>${p.title}</h3>
      <small>${formatDate(p.date)}</small>
    </div>
  `;
  latestBox.appendChild(a);
});

// التنقل بين الأقسام + البحث
const links = document.querySelectorAll(".navbar a");
const SECTIONS = ["home", "programming", "games", "contact"];
let currentFilter = "home";

function render() {
  const q = normalize(searchInput.value);

  // وضع البحث: بيدوّر في كل الأخبار من كل الأقسام
  if (q) {
    links.forEach(a => a.classList.remove("active"));
    home.hidden = true;
    contact.hidden = true;
    feed.hidden = false;

    let found = 0;
    document.querySelectorAll(".post").forEach(el => {
      const p = posts.find(x => x.id === Number(el.dataset.id));
      const hay = normalize(p.title) + " " + (texts[p.id] || "");
      const match = hay.includes(q);
      el.hidden = !match;
      if (match) found++;
    });
    noResults.hidden = found > 0;
    return;
  }

  // الوضع العادي: القسم الحالي
  noResults.hidden = true;
  links.forEach(a => a.classList.toggle("active", a.dataset.filter === currentFilter));
  home.hidden = currentFilter !== "home";
  contact.hidden = currentFilter !== "contact";
  feed.hidden = !(currentFilter === "programming" || currentFilter === "games");

  document.querySelectorAll(".post").forEach(el => {
    el.hidden = el.dataset.category !== currentFilter;
  });
}

function applyFilter(filter) {
  currentFilter = filter;
  render();
}

function go(filter) {
  searchInput.value = "";
  applyFilter(filter);
  history.replaceState(null, "", "#" + filter);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

links.forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); go(a.dataset.filter); });
});
document.querySelectorAll("[data-go]").forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); go(a.dataset.go); });
});
searchInput.addEventListener("input", render);

// الرجوع من صفحة الخبر بيفتح القسم الصح (index.html#games مثلًا)
const fromHash = location.hash.slice(1);
applyFilter(SECTIONS.includes(fromHash) ? fromHash : "home");
