// Navbar
const navbar = document.querySelector('nav#navbar-example');
const footer = document.querySelector('footer');
const data = {
  footerHeight: footer.getBoundingClientRect().height,
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
        if (entry.isIntersecting) {
          navbar.style.maxHeight = `calc(100vh - ${data.footerHeight}px)`;
        } else {
          navbar.style.maxHeight = '100vh';
        }
      });
    });
observer.observe(footer);

// Function to handle scroll event
const handleScroll = () => {
  const overviewTop = overviewSection.getBoundingClientRect().top;
  // Check if the screen width is greater than 990px
  if (window.innerWidth > 990) {
    if (overviewTop <= 50) {
      // Show the navbar
      navbar.style.display = 'block';
    } else {
      // Hide the navbar
      navbar.style.display = 'none';
    }
  }
};

const overviewSection = document.querySelector('section#Overview');
const mainContent = document.querySelector('main.col-md-12 col-sml-12 main-content');
const navbarComputedStyle = window.getComputedStyle(navbar);
const originalWidth = navbarComputedStyle.width;

// Add a left margin to the main content to make space for the fixed navbar
setElementStyles(mainContent, {
  marginLeft: originalWidth,
});

// Initially hide the navbar
setElementStyles(navbar, {
  display: 'none',
  position: 'fixed',
  top: '0',
  left: '0',
});

// Function to set element styles
async function setElementStyles(el, styles) {
  Object.assign(el.style, styles);
}

window.addEventListener("scroll", function () {
  var sidebar = document.querySelector(".sidebar");
  if (window.scrollY > 584) {
    sidebar.style.display = "block";
    sidebar.style.position = "fixed";
    sidebar.style.top = "0px";
    sidebar.style.height = "100%";
  } else {
    sidebar.style.position = "relative";
    sidebar.style.top = "0px";
  }
});

// Image modal
document.addEventListener("DOMContentLoaded", function () {
    const modalImage = document.getElementById("modal-image");
    const closeBtn = document.querySelector(".close");
    const images = document.querySelectorAll(".clickable-image");
    const modal = document.querySelector('.image-modal');
    let focusedElementBeforeModal;

    // Attach event listeners to each image
    images.forEach(img => {
        img.addEventListener("click", openModal);

        // Enable "Enter" or "Space" key to open modal
        img.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                openModal(event);
            }
        });
    });

    // Open modal and update image
    function openModal(event) {
        const image = event.target; // Get the clicked image
        if (modal) {
            focusedElementBeforeModal = document.activeElement;
            modal.style.display = "flex";
            modal.setAttribute("aria-hidden", "false");
            modalImage.src = image.src; // Set modal image
            modalImage.alt = image.alt; // Preserve accessibility
            closeBtn.focus();
        }
    }

    // Close modal function
    function closeModal() {
        if (modal) {
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
            modalImage.src = ""; // Clear image source
            if (focusedElementBeforeModal) {
                focusedElementBeforeModal.focus();
            }
        }
    }

    // Close modal when clicking the close button
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Close modal when clicking outside the modal content
    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal using the Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal && modal.style.display === "flex") {
            closeModal();
        }
    });
});