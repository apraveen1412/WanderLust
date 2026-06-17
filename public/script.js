// Navbar
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


// show
const showWishlist = document.querySelector('.showWishlist');

if (showWishlist) {
    showWishlist.addEventListener('click', (e) => {
        e.preventDefault();

        showWishlist.classList.toggle('fa-regular');
        showWishlist.classList.toggle('fa-solid');
        showWishlist.classList.toggle('pop');

        if (showWishlist.classList.contains('fa-solid')) {
            showWishlist.style.color = 'rgb(255, 89, 119)';
        } else {
            showWishlist.style.color = '';
        }

        setTimeout(() => {
            showWishlist.classList.remove('pop');
        }, 300);
    });
}


// new and edit
const needsValidation = document.querySelector('.needs-validation');
if(needsValidation){
    
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (() => {
      'use strict'
    
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.querySelectorAll('.needs-validation')
    
      // Loop over them and prevent submission
      Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
      
          form.classList.add('was-validated')
        }, false)
      })
    })()
}

// review
// rating
const stars = document.querySelectorAll('.stars');
const inputRating = document.querySelector('#rating');
if(stars && inputRating){
    stars.forEach((star)=>{
        star.addEventListener('click', (e)=>{
            e.preventDefault();
            const rating = star.dataset.value;
            inputRating.value = rating;

            stars.forEach((s)=>{
                if(s.dataset.value <= rating){
                    s.classList.toggle('fa-regular');
                    s.classList.toggle('fa-solid');
                }
                else{
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular');
                }
            });
        });
    });
}