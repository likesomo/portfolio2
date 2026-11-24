// 포트폴리오 3종 뷰어 — 세 시안이 같이 쓴다. 마크업: [data-viewer] 안에 [data-doc] 탭, img[data-page], [data-prev] [data-next] [data-count] [data-thumbs]
(() => {
  const DOCS = {
    ai: { n: 20, name: "AI 활용 포트폴리오" },
    career: { n: 22, name: "경력 포트폴리오" },
    pr: { n: 12, name: "PR 문서" }
  };
  const src = (d, i) => `pages/${d}/p${String(i).padStart(2, "0")}.jpg`;
  document.querySelectorAll("[data-viewer]").forEach(root => {
    const img = root.querySelector("[data-page]"), count = root.querySelector("[data-count]");
    const prev = root.querySelector("[data-prev]"), next = root.querySelector("[data-next]"), thumbs = root.querySelector("[data-thumbs]");
    const tabs = [...root.querySelectorAll("[data-doc]")];
    let doc = "ai", page = 1;
    function build() {
      thumbs.innerHTML = "";
      for (let i = 1; i <= DOCS[doc].n; i++) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "vthumb"; b.setAttribute("aria-label", `${i}쪽`);
        b.innerHTML = `<img loading="lazy" src="${src(doc, i)}" alt=""><span>${i}</span>`;
        b.addEventListener("click", () => show(i));
        thumbs.appendChild(b);
      }
    }
    function show(i) {
      page = Math.min(Math.max(1, i), DOCS[doc].n);
      img.src = src(doc, page); img.alt = `${DOCS[doc].name} ${page}쪽`;
      count.textContent = `${page} / ${DOCS[doc].n}`;
      prev.disabled = page === 1; next.disabled = page === DOCS[doc].n;
      [...thumbs.children].forEach((b, k) => {
        const on = k + 1 === page; b.setAttribute("aria-current", on ? "true" : "false");
        if (on) thumbs.scrollTo({ left: b.offsetLeft - thumbs.clientWidth / 2 + b.clientWidth / 2, behavior: "smooth" });
      });
    }
    tabs.forEach(t => t.addEventListener("click", () => {
      doc = t.dataset.doc;
      tabs.forEach(x => x.setAttribute("aria-selected", x === t ? "true" : "false"));
      build(); show(1);
    }));
    prev.addEventListener("click", () => show(page - 1));
    next.addEventListener("click", () => show(page + 1));
    document.addEventListener("keydown", e => {
      const r = root.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      if (e.key === "ArrowLeft") show(page - 1);
      if (e.key === "ArrowRight") show(page + 1);
    });
    build(); show(1);
  });
})();
