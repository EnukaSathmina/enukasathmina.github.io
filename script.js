document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const dropdown = document.querySelector(".cert-dropdown");
  const dropdownHeader = document.querySelector(".cert-dropdown-header");
  const typedRole = document.getElementById("typed-role");
  const revealItems = document.querySelectorAll(".reveal");
  const backToTop = document.querySelector(".back-to-top");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.classList.toggle("active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  if (dropdown && dropdownHeader) {
    dropdownHeader.addEventListener("click", function () {
      const isActive = dropdown.classList.toggle("active");
      dropdownHeader.setAttribute("aria-expanded", String(isActive));
    });
  }

  if (typedRole) {
    const roles = [
      "AI/ML Enthusiast",
      "Software Developer",
      "Python Developer",
      "Java Developer",
      "Web Developer"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeRole = function () {
      const currentRole = roles[roleIndex];
      const nextText = isDeleting
        ? currentRole.slice(0, charIndex - 1)
        : currentRole.slice(0, charIndex + 1);

      typedRole.textContent = nextText;
      charIndex = nextText.length;

      let delay = isDeleting ? 42 : 76;

      if (!isDeleting && nextText === currentRole) {
        delay = 1500;
        isDeleting = true;
      } else if (isDeleting && nextText === "") {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 260;
      }

      window.setTimeout(typeRole, delay);
    };

    typeRole();
  }

  const setActiveLink = function (activeId) {
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + activeId);
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    });

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  if ("IntersectionObserver" in window && revealItems.length) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -60px 0px"
    });

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index * 45, 240) + "ms";
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });
  }

  const handleScroll = function () {
    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 700);
    }

    if (!("IntersectionObserver" in window) && sections.length) {
      let currentId = "home";

      sections.forEach(function (section) {
        const sectionTop = section.offsetTop - 140;
        if (window.scrollY >= sectionTop) {
          currentId = section.id;
        }
      });

      setActiveLink(currentId);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
