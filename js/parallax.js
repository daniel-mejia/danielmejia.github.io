function mr_parallax() {
    /* jshint validthis: true */

    // Find the correct transform property for this browser
    function getSupportedTransformProp(props) {
        for (var i = 0; i < props.length; i++) {
            if ("undefined" !== typeof document.body.style[props[i]]) {
                return props[i];
            }
        }
        return null;
    }

    // Get the height of the nav bar, accounting for absolute/fixed positioning
    function getNavHeight() {
        var navHeight = 0;
        if (isViuVariant()) {
            navHeight = jQuery(".viu").find("nav:first").outerHeight(true);
            var navPos = jQuery(".viu").find("nav:first").css("position");
            if (navPos === "absolute" || navPos === "fixed") {
                navHeight = 0;
            }
        } else {
            navHeight = jQuery(document).find("nav:first").outerHeight(true);
        }
        return navHeight;
    }

    // Easing function for smooth scroll assist
    function easeScroll(current, start, change, duration) {
        var prev = current - 1;
        prev /= duration;
        current /= duration;
        prev--;
        current--;
        var a = change * (current * current * current * current * current + 1) + start;
        var b = change * (prev * prev * prev * prev * prev + 1) + start;
        return a - b;
    }

    // Main animation loop
    function animationLoop() {
        if (needsProfileUpdate) {
            var count = parallaxElements.length;
            var scrollPos = getScrollPosition();
            while (count--) {
                updateParallaxElement(parallaxElements[count], scrollPos, translatePrefix, translateSuffix);
            }
            needsProfileUpdate = false;
        }

        if (scrollAssistActive) {
            scrollDelta += -scrollVelocity * easeScroll(scrollStep, 0, scrollAmount, scrollDuration);
            if (scrollDelta > scrollThreshold || -scrollThreshold > scrollDelta) {
                scrollContainer.scrollBy(0, scrollDelta);
                scrollDelta = 0;
            }
            scrollStep++;
            if (scrollStep > scrollDuration) {
                scrollStep = 0;
                scrollAssistActive = false;
                scrollComplete = true;
                scrollVelocity = 0;
                scrollAccum = 0;
                scrollExtra = 0;
                scrollDelta = 0;
            }
        }

        requestAnimationFrame(animationLoop);
    }

    // Apply parallax transform to a single element
    function updateParallaxElement(el, scrollPos, prefix, suffix) {
        var viu = isViuVariant();
        if (viu) {
            if (scrollPos + viewportHeight - navOffset > el.elemTop && scrollPos - navOffset < el.elemBottom) {
                if (el.isFirstSection) {
                    el.imageHolder.style[transformProp] = prefix + scrollPos / 2 + suffix;
                } else {
                    el.imageHolder.style[transformProp] = prefix + (scrollPos - el.elemTop - navOffset) / 2 + suffix;
                }
            }
        } else {
            if (scrollPos + viewportHeight > el.elemTop && scrollPos < el.elemBottom) {
                if (el.isFirstSection) {
                    el.imageHolder.style[transformProp] = prefix + scrollPos / 2 + suffix;
                } else {
                    el.imageHolder.style[transformProp] = prefix + (scrollPos + viewportHeight - el.elemTop) / 2 + suffix;
                }
            }
        }
    }

    // FIX: Use window.scrollY instead of deprecated document.body.scrollTop
    function getScrollPosition() {
        if (scrollContainer !== window) {
            return scrollContainer.scrollTop;
        }
        return window.scrollY;
    }

    // Mark that parallax elements need recalculating on next frame
    function flagUpdate() {
        needsProfileUpdate = true;
    }

    // FIX: Handle wheel events for scroll assist
    // Uses addEventListener with { passive: false } to allow preventDefault in Chrome
    function handleWheel(e) {
        if (self.mr_scrollAssist === true) {
            if (e.preventDefault) { e.preventDefault(); }
            if (e.deltaMode === 1) {
                scrollVelocity = -e.deltaY / 3;
            } else if (Math.abs(e.deltaY) === 100) {
                scrollVelocity = -e.deltaY / 120;
            } else {
                scrollVelocity = -e.deltaY / 40;
            }
            scrollVelocity = scrollVelocity < -maxVelocity ? -maxVelocity : scrollVelocity;
            scrollVelocity = scrollVelocity > maxVelocity ? maxVelocity : scrollVelocity;
            scrollAssistActive = true;
            scrollStep = scrollAssistStartStep;
        }
    }

    function isFunction(fn) {
        return typeof fn === "function";
    }

    // Check if we are in the Viu theme variant
    function isViuVariant() {
        return typeof window.mr_variant !== "undefined";
    }

    // --- State variables ---
    var parallaxElements,
        transformProps    = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"],
        transformProp     = getSupportedTransformProp(transformProps),
        translatePrefix   = "translate3d(0,",
        translateSuffix   = "px,0)",
        viewportHeight    = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        navOffset         = 0,
        scrollAssistActive    = false,
        scrollComplete        = true,
        scrollStep            = 0,
        scrollVelocity        = 0,
        scrollAccum           = 0,
        scrollExtra           = 0,
        maxVelocity           = 2.2,
        scrollAssistStartStep = 2,
        scrollAmount          = 350,
        scrollThreshold       = 1,
        scrollDuration        = 35,
        scrollDelta           = 0,
        scrollContainer       = window,
        needsProfileUpdate    = false,
        self                  = this;

    this.mr_scrollAssist = jQuery("body").hasClass("scroll-assist") ? true : false;

    // FIX: Use jQuery 3.x compatible .on("ready") and .on("load")
    jQuery(document).ready(function () {
        self.documentReady();
    });

    jQuery(window).on("load", function () {
        self.windowLoad();
    });

    this.getScrollingState = function () {
        return scrollStep > 0 ? true : false;
    };

    this.documentReady = function (callback) {
        viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        // Use 2D translate if body has parallax-2d class
        if (jQuery("body").hasClass("parallax-2d")) {
            translatePrefix = "translate(0,";
            translateSuffix = "px)";
        }

        // FIX: More reliable mobile detection using pointer and touch APIs
        var isMobile = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;

        if (isMobile) {
            jQuery(".parallax").removeClass("parallax");
        } else {
            self.profileParallaxElements();
            self.setupParallax();
        }

        if (isFunction(callback)) {
            callback();
        }
    };

    this.windowLoad = function () {
        viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        navOffset = getNavHeight();
        window.mr_parallax.profileParallaxElements();
    };

    this.setupParallax = function () {
        // Set up Viu variant scroll container
        if (isViuVariant()) {
            scrollContainer = jQuery(".viu").get(0);
            if (typeof scrollContainer !== "undefined") {
                scrollContainer.scrollBy = function (x, y) {
                    this.scrollTop += y;
                    this.scrollLeft += x;
                };
            }
        }

        if (typeof scrollContainer !== "undefined") {
            scrollContainer.addEventListener("scroll", flagUpdate, false);

            // FIX: Use native wheel event with { passive: false } to allow preventDefault
            // This replaces the old addWheelListener polyfill which caused Chrome warnings
            scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

            window.addEventListener("resize", function () {
                viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                navOffset = getNavHeight();
                self.profileParallaxElements();
            }, false);

            animationLoop();
        }
    };

    this.profileParallaxElements = function () {
        parallaxElements = [];
        navOffset = getNavHeight();

        var viu = isViuVariant();
        var selector = ".parallax > .background-image-holder, .parallax ul.slides > li > .background-image-holder, .parallax ul.slides .owl-item > li > .background-image-holder";

        if (viu) {
            selector = ".viu .parallax > .background-image-holder, .viu .parallax ul.slides > li > .background-image-holder, .parallax ul.slides .owl-item > li > .background-image-holder";
        }

        jQuery(selector).each(function () {
            var section  = jQuery(this).closest(".parallax");
            var elemTop  = viu ? section.position().top : section.offset().top;

            parallaxElements.push({
                section:        section.get(0),
                outerHeight:    section.outerHeight(),
                elemTop:        elemTop,
                elemBottom:     elemTop + section.outerHeight(),
                isFirstSection: section.is(":nth-of-type(1)") ? true : false,
                imageHolder:    jQuery(this).get(0)
            });

            var scrollPos = getScrollPosition();
            if (viu) {
                if (section.is(":nth-of-type(1)")) {
                    self.mr_setTranslate3DTransform(jQuery(this).get(0), scrollPos === 0 ? 0 : scrollPos / 2);
                } else {
                    self.mr_setTranslate3DTransform(jQuery(this).get(0), (scrollPos - elemTop - navOffset) / 2);
                }
            } else {
                if (section.is(":nth-of-type(1)")) {
                    self.mr_setTranslate3DTransform(jQuery(this).get(0), scrollPos === 0 ? 0 : scrollPos / 2);
                } else {
                    self.mr_setTranslate3DTransform(jQuery(this).get(0), (scrollPos + viewportHeight - elemTop) / 2);
                }
            }
        });
    };

    this.mr_setTranslate3DTransform = function (element, value) {
        element.style[transformProp] = translatePrefix + value + translateSuffix;
    };
}

window.mr_parallax = new mr_parallax();