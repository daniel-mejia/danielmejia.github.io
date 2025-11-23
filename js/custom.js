// Define setElementStyles at the top
async function setElementStyles(el, styles) {
  Object.assign(el.style, styles);
}

// Wrap all main logic inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', (event) => {

    // Selectors for critical elements
    const mainNavbar = document.querySelector('#navbar'); // Renamed to avoid confusion
    const footer = document.querySelector('footer');
    const aboutSection = document.querySelector('section#about'); // Renamed
    const mainContent = document.querySelector('main.col-md-10.col-sml-12.main-content');
    const sidebarNavbar = document.querySelector('nav#navbar-example'); // Added for clarity

    // Check if critical elements exist before proceeding
    if (mainNavbar && footer && aboutSection && mainContent && sidebarNavbar) {

        // --- Main Navbar (#navbar) Setup ---
        // Ensure main navbar is visible by default and fixed
        setElementStyles(mainNavbar, {
            display: 'block', // Changed to block (or its natural display type)
            position: 'fixed',
            top: '0',
            left: '0',
            // You might need to adjust width or other properties here
            // based on how you want your main navbar to appear.
            // Example: width: '100vw', zIndex: '1000', etc.
        });

        const mainNavbarComputedStyle = window.getComputedStyle(mainNavbar);
        const mainNavbarOriginalWidth = mainNavbarComputedStyle.width;

        // Add a left margin to the main content to make space for the fixed mainNavbar
        if (mainNavbarOriginalWidth && mainNavbarOriginalWidth !== 'auto' && mainNavbarOriginalWidth !== '0px') {
            setElementStyles(mainContent, {
                marginLeft: mainNavbarOriginalWidth,
            });
        }

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


        // IntersectionObserver for footer (if still relevant for mainNavbar, otherwise remove/adjust)
        const data = {
            footerHeight: footer.getBoundingClientRect().height,
        };
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mainNavbar.style.maxHeight = `calc(100vh - ${data.footerHeight}px)`;
                } else {
                    mainNavbar.style.maxHeight = '100vh';
                }
            });
        });
        observer.observe(footer);


        // Attach handleSidebarScroll to the scroll event
        window.addEventListener("scroll", handleSidebarScroll);
        // Call it once on load to set initial state based on scroll position
        handleSidebarScroll();

        // Re-evaluate on resize
        window.addEventListener("resize", handleSidebarScroll);

    } else {
        console.warn("One or more critical elements (mainNavbar, footer, aboutSection, mainContent, sidebarNavbar) not found. Check HTML and script loading order.");
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

    // --- Image modal code (keep as is or merge into this DOMContentLoaded block) ---
    // ... (modal code)

}); // End of main DOMContentLoaded