// Define setElementStyles at the top
function setElementStyles(el, styles) {
    Object.assign(el.style, styles);
}

// Wrap all main logic inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {

    // Selectors for critical elements
    var footer        = document.querySelector('footer');
    var aboutSection  = document.querySelector('section#about');
    var mainContent = document.querySelector('main.main-content.col-xs-12.col-md-10');
    var sidebarNavbar = document.querySelector('nav#navbar-example');

    // --- Sidebar Navigation (#navbar-example) Setup ---
    //
    // Behavior:
    // 1. Sidebar is hidden until the #about section scrolls into view (aboutTop <= 50)<main id="mainContent" class="main-content col-xs-12 col-md-10">
    // 2. Once visible, the sidebar scrolls naturally with the page (position: relative)
    // 3. Once the user scrolls past 584px, the sidebar becomes sticky (position: fixed)
    // 4. On screens 989px wide or less, the sidebar is always hidden
    // 5. On resize, re-evaluate all conditions

    var STICKY_THRESHOLD = 584;  // px scrolled before sidebar becomes fixed
    var SHOW_THRESHOLD   = 0;   // px from top of viewport before sidebar appears
    var DESKTOP_WIDTH    = 989;  // min px width to show sidebar

    // Declared as var expression at DOMContentLoaded scope to avoid W082
    var handleSidebarScroll = function () {
        if (!sidebarNavbar || !aboutSection) { return; }

        var aboutTop  = aboutSection.getBoundingClientRect().top;
        var scrollY   = window.scrollY;
        var isDesktop = window.innerWidth > DESKTOP_WIDTH;

        // Always hide on mobile/tablet
        if (!isDesktop) {
            setElementStyles(sidebarNavbar, { display: 'none', position: 'relative', top: '0px' });
            return;
        }

        // Hide sidebar until #about section is near the top of the viewport
        if (aboutTop > SHOW_THRESHOLD) {
            setElementStyles(sidebarNavbar, { display: 'none', position: 'relative', top: '0px' });
            return;
        }

        // #about is in view - show sidebar
        // If scrolled past the sticky threshold, fix it to the top
        // Otherwise let it scroll naturally with the page
        if (scrollY > STICKY_THRESHOLD) {
            setElementStyles(sidebarNavbar, {
                display:  'block',
                position: 'fixed',
                top:      '0px',
                height:   '100%'
            });
        } else {
            setElementStyles(sidebarNavbar, {
                display:  'block',
                position: 'relative',
                top:      '0px',
                height:   ''
            });
        }
    };

    // Check if critical elements exist before attaching listeners
    if (footer && aboutSection && mainContent && sidebarNavbar) {

        // Initially hide the sidebar
        setElementStyles(sidebarNavbar, { display: 'none' });

        // Single unified listener for scroll and resize
        window.addEventListener('scroll', handleSidebarScroll);
        window.addEventListener('resize', handleSidebarScroll);

        // Set initial state on load
        handleSidebarScroll();

    } else {
        console.warn("One or more critical elements (footer, aboutSection, mainContent, sidebarNavbar) not found. Check HTML and script loading order.");
    }

    // --- Image modal code ---
    var modalImage = document.getElementById("modal-image");
    var closeBtn   = document.querySelector(".image-modal .close");
    var images     = document.querySelectorAll(".clickable-image");
    var modal      = document.querySelector('.image-modal');
    var focusedElementBeforeModal;

    var openModal = function (event) {
        var image = event.target;
        focusedElementBeforeModal = document.activeElement;
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        closeBtn.focus();
    };

    var closeModal = function () {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        modalImage.src = "";
        if (focusedElementBeforeModal) {
            focusedElementBeforeModal.focus();
        }
    };

    if (modal && modalImage && closeBtn) {
        images.forEach(function (img) {
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

}); // End of DOMContentLoaded