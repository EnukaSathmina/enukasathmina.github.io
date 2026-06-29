document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const certCategories = document.querySelectorAll(".cert-category");
  const certificatePreviews = document.querySelectorAll(".certificate-preview");
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

  if (certCategories.length) {
    const syncCertPanel = function (category) {
      const toggle = category.querySelector(".cert-category-toggle");
      const panel = category.querySelector(".cert-category-panel");
      const isOpen = category.classList.contains("is-open");

      if (!toggle || !panel) {
        return;
      }

      toggle.setAttribute("aria-expanded", String(isOpen));
      panel.style.maxHeight = isOpen ? panel.scrollHeight + "px" : "0px";
    };

    const syncAllCertPanels = function () {
      certCategories.forEach(syncCertPanel);
    };

    certCategories.forEach(function (category) {
      const toggle = category.querySelector(".cert-category-toggle");

      syncCertPanel(category);

      if (toggle) {
        toggle.addEventListener("click", function () {
          category.classList.toggle("is-open");
          syncCertPanel(category);
        });
      }
    });

    window.addEventListener("resize", syncAllCertPanels);

    document.querySelectorAll(".certificate-preview img").forEach(function (image) {
      image.addEventListener("load", syncAllCertPanels);
    });
  }

  if (certificatePreviews.length) {
    const imageExtensions = ["png", "jpg", "jpeg", "webp", "gif", "avif"];
    const pdfExtension = "pdf";

    const getExtension = function (path) {
      return path.split("?")[0].split("#")[0].split(".").pop().toLowerCase();
    };

    const getPreviewCandidates = function (certificateSrc, explicitPreview) {
      const cleanSrc = certificateSrc.split("?")[0].split("#")[0];
      const dotIndex = cleanSrc.lastIndexOf(".");
      const basePath = dotIndex >= 0 ? cleanSrc.slice(0, dotIndex) : cleanSrc;
      const candidates = [];

      if (explicitPreview) {
        candidates.push(explicitPreview);
      }

      ["png", "webp", "jpg", "jpeg"].forEach(function (extension) {
        candidates.push(basePath + "-preview." + extension);
      });

      return candidates;
    };

    const loadImage = function (src) {
      return new Promise(function (resolve, reject) {
        const image = new Image();

        image.onload = function () {
          resolve(src);
        };

        image.onerror = reject;
        image.src = src;
      });
    };

    const syncOpenCertPanels = function () {
      certCategories.forEach(function (category) {
        const panel = category.querySelector(".cert-category-panel");
        if (panel && category.classList.contains("is-open")) {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    };

    const renderImagePreview = function (preview, src) {
      const image = document.createElement("img");

      image.src = src;
      image.alt = "";
      image.addEventListener("load", syncOpenCertPanels);

      preview.classList.remove("is-pdf");
      preview.classList.add("is-image");
      preview.replaceChildren(image);
      syncOpenCertPanels();
    };

    const renderPdfPreview = function (preview) {
      preview.classList.remove("is-image");
      preview.classList.add("is-pdf");
      preview.replaceChildren();
      preview.insertAdjacentHTML("beforeend", [
        '<div class="pdf-particles" aria-hidden="true"><i></i><i></i><i></i></div>',
        '<div class="pdf-preview-card">',
        '<span class="pdf-document-icon"></span>',
        '<strong>PDF</strong>',
        '<span>Certificate File</span>',
        '</div>'
      ].join(""));
      syncOpenCertPanels();
    };

    certificatePreviews.forEach(function (preview) {
      const card = preview.closest(".certificate-card");
      const link = card ? card.querySelector(".certificate-button") : null;
      const certificateSrc = preview.dataset.certificateSrc || (link ? link.getAttribute("href") : "");
      const previewSrc = preview.dataset.previewSrc || "";

      if (!certificateSrc) {
        renderPdfPreview(preview);
        return;
      }

      const extension = getExtension(certificateSrc);

      if (imageExtensions.includes(extension)) {
        renderImagePreview(preview, certificateSrc);
        return;
      }

      if (extension === pdfExtension) {
        const candidates = getPreviewCandidates(certificateSrc, previewSrc);

        candidates.reduce(function (chain, candidate) {
          return chain.catch(function () {
            return loadImage(candidate);
          });
        }, Promise.reject()).then(function (resolvedPreview) {
          renderImagePreview(preview, resolvedPreview);
        }).catch(function () {
          renderPdfPreview(preview);
        });
      }
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
