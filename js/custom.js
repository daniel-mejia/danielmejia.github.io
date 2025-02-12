
// Navbar
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

const overviewSection = document.querySelector('section#Overview');
const mainContent = document.querySelector('main.col-md-12 col-sml-12 main-content');
const navbarComputedStyle = window.getComputedStyle(navbar);
const originalWidth = navbarComputedStyle.width;

// Function to set element styles
async function setElementStyles(el, styles) {
  Object.assign(el.style, styles);
}

// Initially hide the navbar
setElementStyles(navbar, {
  display: 'none',
  position: 'fixed',
  top: '0',
  left: '0',
  width: '',
});

// Add a left margin to the main content to make space for the fixed navbar
setElementStyles(mainContent, {
  marginLeft: originalWidth,
});

// Function to set element styles
async function setElementStyles(el, styles) {
  Object.assign(el.style, styles);
}

// Initially set the margin-left to the main content
setElementStyles(mainContent, {
  marginLeft: originalWidth,
});

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


/*// Add scroll event listener
window.addEventListener('scroll', handleScroll);
document.addEventListener("DOMContentLoaded", function () {
  var isScrollspyEnabled = true;
  var toggleButton = document.getElementById("toggle-scrollspy");

  // Enable Scrollspy initially
  $('body').scrollspy({ target: '#navbar-example', offset: 50 });

  // Toggle button functionality
  toggleButton.addEventListener("click", function () {
    if (isScrollspyEnabled) {
      // Disable Scrollspy by removing the data-spy attribute and the plugin
      $('body').removeData('bs.scrollspy');
      $(window).off('scroll.bs.scrollspy'); // Remove the scroll event listener
      toggleButton.textContent = "Enable Scrollspy";
    } else {
      // Enable Scrollspy by re-initializing it
      $('body').scrollspy({ target: '#navbar-example', offset: 50 });
      toggleButton.textContent = "Disable Scrollspy";
    }
    isScrollspyEnabled = !isScrollspyEnabled;
  });
});*/

/*
const subLinks = ['Discovery Research', 'Information Architecture', 'Design Testing'];
const links = navbar.querySelectorAll('li');

links.forEach((link) => {
  if (subLinks.includes(link.textContent.trim())) {
    link.classList.add('sub-link');
  }
});
*/


// Image modal
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");
    const closeBtn = document.querySelector(".close");

    // Select all images in different sections
    const images = document.querySelectorAll(".clickable-image");

    // Open modal and update image
    function openModal(event) {
        const image = event.target; // Get the clicked image
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        modalImage.src = image.src; // Set modal image
        modalImage.alt = image.alt; // Preserve accessibility
        closeBtn.focus();
    }

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

    // Close modal function
    function closeModal() {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        modalImage.src = ""; // Clear image source
        images[0].focus(); // Return focus to the first image
    }

    // Close modal when clicking the close button
    closeBtn.addEventListener("click", closeModal);

    // Close modal when clicking outside the modal content
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal using the Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });
});
