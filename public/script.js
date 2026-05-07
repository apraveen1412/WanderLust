const navbarToggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".navbar-collapse");

if (navbarToggler && navbarCollapse) {

    document.addEventListener("click", (e) => {

        const clickedInsideNavbar =
            navbarCollapse.contains(e.target) ||
            navbarToggler.contains(e.target);

        // close only if:
        // navbar is open AND click happened outside
        if (
            navbarCollapse.classList.contains("show") &&
            !clickedInsideNavbar
        ) {
            navbarToggler.click();
        }
    });

}