// Small, dependency-free. Section reveal, active nav, gentle parallax on the portrait.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal blocks as they enter the viewport.
  var blocks = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    blocks.forEach(function (b) { b.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    blocks.forEach(function (b) { io.observe(b); });
  }

  // Mark the nav item for the section currently in view.
  var links = Array.prototype.slice.call(document.querySelectorAll(".site-nav a"));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window && targets.length) {
    var current = null;
    var nav = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          current = e.target.id;
          links.forEach(function (a) {
            var on = a.getAttribute("href") === "#" + current;
            if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    targets.forEach(function (t) { nav.observe(t); });
  }

  // Portrait drifts a little slower than the page.
  var img = document.querySelector(".portrait img");
  if (img && !reduce) {
    var ticking = false;
    var update = function () {
      var y = Math.min(window.scrollY, 600);
      img.style.transform = "scale(1.02) translateY(" + (y * 0.06) + "px)";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }
})();
