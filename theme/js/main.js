(function () {
  "use strict";

  /* ---------- Mobile navigation toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close menu when a link is clicked (mobile)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Search modal (Pagefind) ---------- */
  var modal = document.getElementById("search-modal");
  var openers = document.querySelectorAll("[data-search-open]");
  var closers = document.querySelectorAll("[data-search-close]");
  var pagefindLoaded = false;

  function loadPagefind() {
    if (pagefindLoaded) return;
    pagefindLoaded = true;
    var script = document.createElement("script");
    script.src = "/pagefind/pagefind-ui.js";
    script.onload = function () {
      if (window.PagefindUI) {
        new window.PagefindUI({ element: "#search", showSubResults: true, showImages: false });
      }
    };
    script.onerror = function () {
      document.getElementById("search").innerHTML =
        '<p style="color:var(--color-text-muted)">Search index not built yet. Run <code>make search</code>.</p>';
    };
    document.body.appendChild(script);
  }

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    loadPagefind();
    var input = modal.querySelector("input");
    if (input) input.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  openers.forEach(function (el) { el.addEventListener("click", openModal); });
  closers.forEach(function (el) { el.addEventListener("click", closeModal); });

  /* ---------- Sidebar toggle (persisted) ---------- */
  var sidebarMain = document.querySelector('.site-main');
  var sidebarBtn = document.getElementById('sidebar-toggle');
  if (sidebarMain && sidebarBtn) {
    var HIDDEN_KEY = 'sidebar-hidden';
    function applySidebarState(hidden) {
      if (hidden) {
        sidebarMain.classList.add('sidebar-hidden');
        sidebarBtn.setAttribute('aria-pressed', 'true');
        sidebarBtn.title = 'Show sidebar';
      } else {
        sidebarMain.classList.remove('sidebar-hidden');
        sidebarBtn.setAttribute('aria-pressed', 'false');
        sidebarBtn.title = 'Hide sidebar';
      }
    }
    // Restore persisted state on load
    applySidebarState(localStorage.getItem(HIDDEN_KEY) === '1');
    sidebarBtn.addEventListener('click', function () {
      var nowHidden = !sidebarMain.classList.contains('sidebar-hidden');
      localStorage.setItem(HIDDEN_KEY, nowHidden ? '1' : '0');
      applySidebarState(nowHidden);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
    // Cmd/Ctrl + K opens search
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openModal();
    }
  });
})();
