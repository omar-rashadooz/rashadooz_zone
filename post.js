// صفحة الخبر: بتقرأ الرقم من الرابط (post.html?id=6)
const box = document.getElementById("post");
const id = Number(new URLSearchParams(location.search).get("id"));
const p = posts.find(x => x.id === id);

if (!p) {
  document.title = "الخبر غير موجود | RASHADOOZ ZONE";
  box.innerHTML = `
    <div class="contact">
      <h2>الخبر غير موجود</h2>
      <p>الرابط ده مش مظبوط أو الخبر اتحذف.</p>
      <p style="margin-top:14px"><a class="btn btn-red" href="index.html#home">الرجوع للرئيسية</a></p>
    </div>`;
} else {
  document.title = `${p.title} | RASHADOOZ ZONE`;

  // تظبيط زرار القسم في شريط التنقل
  document.querySelectorAll(".navbar a").forEach(a => {
    a.classList.toggle("active", a.dataset.filter === p.category);
  });

  const back = document.createElement("a");
  back.className = "back-link";
  back.href = `index.html#${p.category}`;
  back.textContent = "→ رجوع للأخبار";

  const article = document.createElement("article");
  article.className = "post";
  article.innerHTML = `
    <div class="post-head">
      <img class="avatar" src="logo.png" alt="">
      <div class="post-meta">
        <strong>RASHADOOZ ZONE</strong>
        <small>${p.category === "games" ? "Games" : "Programming"} · ${formatDate(p.date)}</small>
      </div>
    </div>
    <h2 class="post-title post-title-lg">${p.title}</h2>
    <img class="post-img" src="photo_num${p.id}.png" alt="${p.title}">
    <div class="post-body">جاري التحميل...</div>
    <div class="post-actions"></div>
  `;
  article.querySelector(".post-actions").appendChild(makeLikeButton(p));

  box.append(back, article);

  const body = article.querySelector(".post-body");
  fetch(`subject_num${p.id}.txt`)
    .then(r => { if (!r.ok) throw new Error(); return r.text(); })
    .then(text => { body.textContent = text.trim(); })
    .catch(() => { body.textContent = "تعذر تحميل المقال."; });
}
