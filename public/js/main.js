document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");
  setTimeout(() => loader?.classList.add("done"), 400);
  const menu = document.querySelector(".menu"),
    nav = document.querySelector(".nav nav");
  menu?.addEventListener("click", () => nav.classList.toggle("open"));
  document
    .querySelectorAll(".nav nav a")
    .forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open")),
    );
    
  const top = document.querySelector(".to-top");
  window.addEventListener("scroll", () =>
    top?.classList.toggle("show", scrollY > 500),
  );
  top?.addEventListener("click", () =>
    scrollTo({ top: 0, behavior: "smooth" }),
  );
  const type = document.querySelector(".type");
  if (type) {
    let words = type.dataset.words.split("|"),
      word = 0,
      char = 0,
      deleting = false;
    setInterval(() => {
      let w = words[word];
      type.textContent = deleting ? w.slice(0, char--) : w.slice(0, char++);
      if (!deleting && char > w.length + 5) deleting = true;
      if (deleting && char < 0) {
        deleting = false;
        word = (word + 1) % words.length;
        char = 0;
      }
    }, 90);
  }
  const observer = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((e) => observer.observe(e));
});

const form = document.querySelector("#contactForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        message: document.querySelector("#message").value
    };

    const response = await fetch("/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);
});