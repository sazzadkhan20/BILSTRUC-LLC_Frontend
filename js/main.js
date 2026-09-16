(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("primaryNav");
  var toggle = document.getElementById("navToggle");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("contactForm");
  var statusEl = document.getElementById("formStatus");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setHeaderState() {
    if (!header || header.classList.contains("page-header")) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav a[href^='#']");

  function updateActiveNav() {
    if (!sections.length || !navLinks.length) return;
    var current = "";
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === "#" + current);
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  document.querySelectorAll(".faq-item").forEach(function (item) {
    var button = item.querySelector(".faq-question");
    if (!button) return;

    button.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item").forEach(function (other) {
        other.classList.remove("is-open");
        var otherBtn = other.querySelector(".faq-question");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function showStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = "form-status is-visible " + type;
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !phone || !message) {
        showStatus("Please complete all required fields before sending.", "error");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus("Please enter a valid email address.", "error");
        return;
      }

      var subject = encodeURIComponent("Service request from " + name);
      var body = encodeURIComponent(
        "Name: " + name +
        "\nEmail: " + email +
        "\nPhone: " + phone +
        "\nSMS Consent: " + (form.smsConsent.checked ? "Yes" : "No") +
        "\n\nMessage:\n" + message
      );

      showStatus("Opening your email app so you can send the request to BILSTRUC LLC.", "success");
      window.location.href = "mailto:bilstrucllc@gmail.com?subject=" + subject + "&body=" + body;
      form.reset();
    });
  }
})();
