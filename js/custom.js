window.addEventListener("scroll", function () {
  var sidebar = document.querySelector(".sidebar");
  if (window.scrollY > 584) {
    sidebar.style.position = "fixed";
    sidebar.style.top = "0px";
  } else {
    sidebar.style.position = "relative";
    sidebar.style.top = "0px";
  }
});

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
});
