async function setElementStyles(el, styles) {
  Object.assign(el.style, styles);
}

document.addEventListener('DOMContentLoaded', (event) => {

    // Navbar
    const navbar = document.querySelector('#navbar');
    const footer = document.querySelector('footer');
    const about = document.querySelector('section#about');
    const mainContent = document.querySelector('main.col-md-10.col-sml-12.main-content');

    // Check if critical elements exist before proceeding
    if (navbar && footer && about && mainContent) {

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
            const aboutTop = about.getBoundingClientRect().top;
            // Check if the screen width is greater than 990px
            if (aboutTop <= 50) {
                if (window.innerWidth > 990) {
                    // Show the navbar
                    navbar.style.display = 'block';
                } else if (window.innerWidth < 989) {
                    // Hide the navbar
                    navbar.style.display = 'none';
                }
            } else {
                // If aboutTop is not <= 50, you probably want to hide the navbar
                // unless it's explicitly shown by some other condition.
                // For example, if it should only appear when scrolled past 'about'
                navbar.style.display = 'none';
            }
        };

        const navbarComputedStyle = window.getComputedStyle(navbar);
        const originalWidth = navbarComputedStyle.width;

        // Add a left margin to the main content to make space for the fixed navbar
        // Ensure originalWidth is not 'auto' or '0px' if it causes layout issues
        if (originalWidth && originalWidth !== 'auto' && originalWidth !== '0px') {
            setElementStyles(mainContent, {
                marginLeft: originalWidth,
            });
        }


        // Initially set navbar styles
        setElementStyles(navbar, {
            display: 'none', // This will hide it by default
            position: 'fixed',
            top: '0',
            left: '0',
        });

        // Attach handleScroll to the scroll event
        window.addEventListener("scroll", handleScroll);
        // Also call it once on load to set initial state based on scroll position
        handleScroll();

        // You might also want to re-evaluate handleScroll on resize
        window.addEventListener("resize", handleScroll);

    } else {
        console.warn("One or more critical elements (navbar, footer, about, mainContent) not found. Check HTML and script loading order.");
    }

    // Sidebar scroll logic (also place inside DOMContentLoaded if it's in the same file)
    // You have another window.addEventListener("scroll") here. Be careful about multiple listeners for the same event.
    // If this code is related to the main content loading, it also belongs here.
    var sidebar = document.querySelector(".sidebar"); // Define sidebar here to ensure it's found
    if (sidebar) { // Only add listener if sidebar exists
        window.addEventListener("scroll", function () {
            if (window.scrollY > 584) {
                //sidebar.style.display = "block"; // This line was commented out, ensure intended
                sidebar.style.position = "fixed";
                sidebar.style.top = "0px";
                sidebar.style.height = "100%";
            } else {
                sidebar.style.position = "relative";
                sidebar.style.top = "0px";
            }
        });
    }

    // Your image modal code is already correctly wrapped in DOMContentLoaded.
    // So you can remove the outer document.addEventListener("DOMContentLoaded", function () { ... });
    // and just place its contents directly inside this main DOMContentLoaded listener.
    // For now, I'll keep it as is, but it's redundant to have two DOMContentLoaded listeners if they're in the same file.

    // Image modal (already wrapped in DOMContentLoaded)
    // ... (modal code can stay here, or be merged into the main DOMContentLoaded)
    const modalImage = document.getElementById("modal-image");
    const closeBtn = document.querySelector(".close");
    const images = document.querySelectorAll(".clickable-image");
    const modal = document.querySelector('.image-modal');
    let focusedElementBeforeModal;

    // ... rest of the modal code (functions, event listeners, etc.)
    // Ensure all variables like modalImage, closeBtn, etc. are declared within this scope
    // or are globally accessible if defined outside.
    // The previous modal code was already inside a DOMContentLoaded, so you can either keep it as a separate one
    // or merge it into this main one. If it's a separate one, that's fine.
    // I'll assume for now the modal code block is entirely separate and functional.

}); // End of main DOMContentLoaded

// Keep the setElementStyles function outside if it's a helper function
// ... (modal code block as previously provided, if it's in its own DOMContentLoaded)