// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initNavigation();
  initMobileMenu();
  initSmoothScrolling();
  initScrollEffects();
  initScrollToTop();
  initReadMoreFunctionality();
  initContactForm();
  initAnimations();
});

// Navigation functionality
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  // Add active class to current section
  function updateActiveNav() {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  // Update active nav on scroll
  window.addEventListener("scroll", updateActiveNav);

  // Initial call
  updateActiveNav();
}

// Mobile menu functionality
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!hamburger || !navMenu) return;

  // Toggle mobile menu
  hamburger.addEventListener("click", function () {
    const hamburgerIcon = document.querySelector(".hamburger-icon");
    const closeIcon = document.querySelector(".close-icon");

    navMenu.classList.toggle("active");
    document.body.classList.toggle("menu-open");

    // Toggle icons
    if (navMenu.classList.contains("active")) {
      hamburgerIcon.style.display = "none";
      closeIcon.style.display = "inline-block";
    } else {
      hamburgerIcon.style.display = "inline-block";
      closeIcon.style.display = "none";
    }
  });

  // Close menu when clicking on nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const hamburgerIcon = document.querySelector(".hamburger-icon");
      const closeIcon = document.querySelector(".close-icon");

      navMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
      hamburgerIcon.style.display = "inline-block";
      closeIcon.style.display = "none";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      const hamburgerIcon = document.querySelector(".hamburger-icon");
      const closeIcon = document.querySelector(".close-icon");

      navMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
      hamburgerIcon.style.display = "inline-block";
      closeIcon.style.display = "none";
    }
  });
}

// Smooth scrolling functionality
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Scroll effects (header background, animations)
function initScrollEffects() {
  const header = document.querySelector(".header");

  function updateHeaderOnScroll() {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeaderOnScroll);

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".stat-item, .skill-item, .project-card, .contact-item"
  );

  animateElements.forEach((el) => {
    observer.observe(el);
  });
}

// Scroll to Top Button functionality
function initScrollToTop() {
  const scrollTopBtn = document.getElementById("scroll-top");

  if (!scrollTopBtn) return;

  let isVisible = false;
  let fadeTimeout;

  // Show/hide scroll to top button based on scroll position
  function toggleScrollTopButton() {
    if (window.pageYOffset > 300) {
      showButton();
    } else {
      hideButton();
    }
  }

  // Show button with fade-in effect
  function showButton() {
    if (!isVisible) {
      isVisible = true;
      clearTimeout(fadeTimeout);

      // Set display and start with opacity 0
      scrollTopBtn.style.display = "flex";
      scrollTopBtn.style.opacity = "0";

      // Force reflow then animate to opacity 1
      scrollTopBtn.offsetHeight; // Force reflow
      scrollTopBtn.style.transition = "opacity 0.3s ease";
      scrollTopBtn.style.opacity = "1";
    }
  }

  // Hide button with fade-out effect
  function hideButton() {
    if (isVisible) {
      isVisible = false;
      clearTimeout(fadeTimeout);

      // Start fade out
      scrollTopBtn.style.transition = "opacity 0.4s ease";
      scrollTopBtn.style.opacity = "0";

      // Hide completely after fade out completes
      fadeTimeout = setTimeout(() => {
        if (!isVisible) {
          // Double check visibility state
          scrollTopBtn.style.display = "none";
        }
      }, 400); // Match the transition duration
    }
  }

  // Scroll to top when button is clicked
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Add event listeners
  window.addEventListener("scroll", toggleScrollTopButton);
  scrollTopBtn.addEventListener("click", scrollToTop);

  // Initial setup
  scrollTopBtn.style.display = "none";
  scrollTopBtn.style.opacity = "0";
  toggleScrollTopButton();
}

// Read More/Read Less functionality for mobile
function initReadMoreFunctionality() {
  // Only apply on mobile screens
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function setupReadMore() {
    if (!isMobile()) {
      // Remove mobile classes and buttons on larger screens
      const textContainers = document.querySelectorAll(
        ".project-content .text-container"
      );
      textContainers.forEach((container) => {
        const paragraph = container.querySelector("p");
        if (paragraph) {
          paragraph.classList.remove("truncated", "expanded");
        }
        const controlsContainer = container.querySelector(
          ".read-more-controls"
        );
        if (controlsContainer) {
          controlsContainer.remove();
        }
      });
      return;
    }

    const textContainers = document.querySelectorAll(
      ".project-content .text-container"
    );

    textContainers.forEach((container, index) => {
      const paragraph = container.querySelector("p");
      if (!paragraph) return;

      // Set unique ID for aria-controls
      const paragraphId = `project-text-${index}`;
      paragraph.id = paragraphId;

      // Preserve expanded state
      const wasExpanded = paragraph.classList.contains("expanded");

      // Always check if text overflows when truncated
      paragraph.classList.remove("expanded");
      paragraph.classList.add("truncated");
      const isOverflowing = paragraph.scrollWidth > paragraph.clientWidth;

      // Get or create controls container
      let controlsContainer = container.querySelector(".read-more-controls");
      let readMoreBtn, readLessBtn;

      if (!isOverflowing) {
        // Text fits in one line, remove controls if they exist
        paragraph.classList.remove("truncated");
        if (controlsContainer) {
          controlsContainer.remove();
        }
        return;
      }

      // Create controls container if it doesn't exist
      if (!controlsContainer) {
        controlsContainer = document.createElement("div");
        controlsContainer.className = "read-more-controls";

        // Create read more button
        readMoreBtn = document.createElement("button");
        readMoreBtn.className = "read-more-btn";
        readMoreBtn.textContent = "read more";
        readMoreBtn.setAttribute("type", "button");
        readMoreBtn.setAttribute("aria-controls", paragraphId);

        // Create read less button
        readLessBtn = document.createElement("button");
        readLessBtn.className = "read-less-btn";
        readLessBtn.textContent = "read less";
        readLessBtn.setAttribute("type", "button");
        readLessBtn.setAttribute("aria-controls", paragraphId);

        // Add buttons to controls container
        controlsContainer.appendChild(readMoreBtn);
        controlsContainer.appendChild(readLessBtn);

        // Add controls container after the paragraph
        container.appendChild(controlsContainer);

        // Read more click handler
        readMoreBtn.addEventListener("click", function () {
          paragraph.classList.remove("truncated");
          paragraph.classList.add("expanded");
          paragraph.setAttribute("data-expanded", "true");
          readMoreBtn.hidden = true;
          readLessBtn.hidden = false;
          readMoreBtn.setAttribute("aria-expanded", "true");
          readLessBtn.setAttribute("aria-expanded", "true");
        });

        // Read less click handler
        readLessBtn.addEventListener("click", function () {
          paragraph.classList.remove("expanded");
          paragraph.classList.add("truncated");
          paragraph.removeAttribute("data-expanded");
          readLessBtn.hidden = true;
          readMoreBtn.hidden = false;
          readMoreBtn.setAttribute("aria-expanded", "false");
          readLessBtn.setAttribute("aria-expanded", "false");
        });
      } else {
        // Get existing buttons
        readMoreBtn = controlsContainer.querySelector(".read-more-btn");
        readLessBtn = controlsContainer.querySelector(".read-less-btn");
      }

      // Set initial state based on preserved expansion state
      if (wasExpanded || paragraph.getAttribute("data-expanded") === "true") {
        paragraph.classList.remove("truncated");
        paragraph.classList.add("expanded");
        readMoreBtn.hidden = true;
        readLessBtn.hidden = false;
        readMoreBtn.setAttribute("aria-expanded", "true");
        readLessBtn.setAttribute("aria-expanded", "true");
      } else {
        paragraph.classList.add("truncated");
        paragraph.classList.remove("expanded");
        readMoreBtn.hidden = false;
        readLessBtn.hidden = true;
        readMoreBtn.setAttribute("aria-expanded", "false");
        readLessBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Initial setup
  setupReadMore();

  // Re-setup on window resize
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setupReadMore, 250);
  });
}

// Initialize EmailJS
function initEmailJS() {
  // Initialize EmailJS with your public key
  // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
  emailjs.init("Xeeq8SMPCLXbDkWEn");
}

// Contact form functionality with EmailJS
function initContactForm() {
  const contactForm = document.querySelector(".contact-form");

  if (!contactForm) return;

  // Initialize EmailJS
  initEmailJS();

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formInputs = this.querySelectorAll("input");
    const name = formInputs[0].value; // First input (name)
    const email = formInputs[1].value; // Second input (email)
    const subject = formInputs[2].value; // Third input (subject)
    const message = this.querySelector("textarea").value;

    // Basic validation
    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    // Prepare form submission
    const submitBtn = this.querySelector(".btn-primary");
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // EmailJS template parameters
    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message,
      to_name: "Elaph", // Replace with your name
    };

    // Send email using EmailJS
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS service and template IDs
    emailjs
      .send("service_08a6r8e", "template_av1dt2d", templateParams)
      .then(function (response) {
        console.log("Email sent successfully:", response);
        showNotification(
          "Message sent successfully! I'll get back to you soon.",
          "success"
        );
        contactForm.reset();
      })
      .catch(function (error) {
        console.error("Email sending failed:", error);
        showNotification(
          "Failed to send message. Please try again later.",
          "error"
        );
      })
      .finally(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "success"
            ? "#4CAF50"
            : type === "error"
            ? "#f44336"
            : "#2196F3"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

  const content = notification.querySelector(".notification-content");
  content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;

  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;

  // Add to DOM
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Close functionality
  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Initialize animations
function initAnimations() {
  // Add CSS for animations
  const style = document.createElement("style");
  style.textContent = `
        .stat-item,
        .skill-item,
        .project-card,
        .contact-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .stat-item.animate-in,
        .skill-item.animate-in,
        .project-card.animate-in,
        .contact-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .header.scrolled {
            background: rgba(26, 26, 26, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }
        
        .nav-link.active {
            color: var(--primary-color);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
        
        /* Mobile menu styles */
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 70px;
                right: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background: rgba(26, 26, 26, 0.98);
                backdrop-filter: blur(10px);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 2rem;
                transition: right 0.3s ease;
            }
            
            .nav-menu.active {
                right: 0;
            }
            
            .nav-menu li {
                margin: 1rem 0;
            }
            
            .nav-link {
                font-size: 1.2rem;
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px);
            }
            
            body.menu-open {
                overflow: hidden;
            }
        }
    `;

  document.head.appendChild(style);
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance optimization for scroll events
const debouncedScrollHandler = debounce(() => {
  // Any additional scroll handling can go here
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

// Add loading animation
window.addEventListener("load", function () {
  document.body.classList.add("loaded");

  // Add loading styles
  const loadingStyle = document.createElement("style");
  loadingStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;

  document.head.appendChild(loadingStyle);
});
