// الصفحة الرئيسية: الفيد + التنقل (البيانات والدوال المشتركة في posts.js)
const feed = document.getElementById("feed");
const home = document.getElementById("home");
const contact = document.getElementById("contact");

// بناء كارت لكل خبر
posts.forEach(p => {
  const url = `post.html?id=${p.id}`;
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
  feed.appendChild(article);

  // مقتطف من ملف subject_numX.txt
  const excerpt = article.querySelector(".post-excerpt");
  fetch(`subject_num${p.id}.txt`)
    .then(r => { if (!r.ok) throw new Error(); return r.text(); })
    .then(text => { excerpt.textContent = makeExcerpt(text); })
    .catch(() => { excerpt.textContent = ""; });
});

// التنقل بين الأقسام
const links = document.querySelectorAll(".navbar a");
const SECTIONS = ["home", "programming", "games", "contact"];

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
  history.replaceState(null, "", "#" + filter);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

links.forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); go(a.dataset.filter); });
});
document.querySelectorAll("[data-go]").forEach(a => {
  a.addEventListener("click", e => { e.preventDefault(); go(a.dataset.go); });
});

// الرجوع من صفحة الخبر بيفتح القسم الصح (index.html#games مثلًا)
const fromHash = location.hash.slice(1);
applyFilter(SECTIONS.includes(fromHash) ? fromHash : "home");
