// Define setElementStyles at the top
async function setElementStyles(el, styles) {
  Object.assign(el.style, styles);
}

// Wrap all main logic inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', (event) => {

    // Selectors for critical elements
    const footer = document.querySelector('footer');
    const aboutSection = document.querySelector('section#about'); // Renamed
    const mainContent = document.querySelector('main.col-md-10.col-sml-12.main-content');
    const sidebarNavbar = document.querySelector('nav#navbar-example'); // Added for clarity

    // Check if critical elements exist before proceeding
    if (footer && aboutSection && mainContent && sidebarNavbar) {

        // --- Sidebar Navigation (#navbar-example) Setup ---
        // Function to handle scroll event for the SIDEBAR
        const handleSidebarScroll = () => {
            const aboutTop = aboutSection.getBoundingClientRect().top; // Use aboutSection
            // Check if the screen width is greater than 990px
            if (aboutTop <= 50) {
                if (window.innerWidth > 990) {
                    // Show the sidebar
                    sidebarNavbar.style.display = 'block'; // Target sidebarNavbar
                } else if (window.innerWidth < 989) {
                    // Hide the sidebar
                    sidebarNavbar.style.display = 'none'; // Target sidebarNavbar
                }
            } else {
                // If aboutTop is not <= 50, hide the sidebar
                sidebarNavbar.style.display = 'none'; // Target sidebarNavbar
            }
        };

        // Initially hide the sidebar until conditions are met
        setElementStyles(sidebarNavbar, {
            display: 'none', // Sidebar should be hidden by default
        });

        // Attach handleSidebarScroll to the scroll event
        window.addEventListener("scroll", handleSidebarScroll);
        // Call it once on load to set initial state based on scroll position
        handleSidebarScroll();

        // Re-evaluate on resize
        window.addEventListener("resize", handleSidebarScroll);

    } else {
        console.warn("One or more critical elements (footer, aboutSection, mainContent, sidebarNavbar) not found. Check HTML and script loading order.");
    }

    // --- Existing Sidebar fixed position logic (can be merged or kept separate) ---
    // If this refers to `sidebarNavbar`, you should update it.
    // This existing listener will conflict if you also have the handleSidebarScroll logic
    // setting position. You likely only want one to control the sidebar's position/display.
    // I recommend integrating this logic into handleSidebarScroll if it's the same sidebar.
    // For now, I'll update it to use sidebarNavbar for clarity.
    if (sidebarNavbar) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 584) {
                sidebarNavbar.style.position = "fixed";
                sidebarNavbar.style.top = "0px";
                sidebarNavbar.style.height = "100%";
                // handleSidebarScroll already manages display, so don't touch it here
            } else {
                sidebarNavbar.style.position = "relative";
                sidebarNavbar.style.top = "0px";
            }
        });
    }

    // --- Image modal code ---
    const modalImage = document.getElementById("modal-image");
    const closeBtn = document.querySelector(".close");
    const images = document.querySelectorAll(".clickable-image");
    const modal = document.querySelector('.image-modal');
    let focusedElementBeforeModal;

    // Move function declarations to the top of this scope (outside the if block)
    function openModal(event) {
        const image = event.target;
        focusedElementBeforeModal = document.activeElement;
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        closeBtn.focus();
    }

    function closeModal() {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        modalImage.src = "";
        if (focusedElementBeforeModal) {
            focusedElementBeforeModal.focus();
        }
    }

    // Now, the conditional block where they are used
    if (modal && modalImage && closeBtn) { // Basic check for modal elements
        images.forEach(img => {
            img.addEventListener("click", openModal);
            img.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    openModal(event);
                }
            });
        });

        closeBtn.addEventListener("click", closeModal);
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && modal.style.display === "flex") {
                closeModal();
            }
        });
    } else {
        console.warn("Image modal elements not found.");
    }

}); // End of main DOMContentLoaded