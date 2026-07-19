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

if(stars.length && inputRating){ // review stars 
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const coinFlipFrames = [
        { transform: 'rotateY(0deg) scale(1)' },
        { transform: 'rotateY(90deg) scale(1.25)', offset: 0.35 },
        { transform: 'rotateY(100deg) scale(1.5)', offset: 0.5 },
        { transform: 'rotateY(180deg) scale(1.25)', offset: 0.65 },
        { transform: 'rotateY(360deg) scale(1)' }
    ];
    const coinFlipTiming = { duration: 600, easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)' };

    stars.forEach((star)=>{
        star.addEventListener('click', (e)=>{
            e.preventDefault();

            // Clicking the star that already matches the current rating
            // clears the rating back to empty (this is the toggle feature).
            const clickedValue = star.dataset.value;
            const isClearing = inputRating.value === clickedValue;
            const rating = isClearing ? '0' : clickedValue;
            inputRating.value = isClearing ? '' : rating;

            stars.forEach((s)=>{
                if(s.dataset.value <= rating){
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid');
                }
                else{
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular');
                }
            });

            // Coin flip plays only on the n-th star that was actually
            // clicked, not on the other stars filled in alongside it.
            // Element.animate() always plays a fresh instance immediately,
            // so it doesn't depend on reflow timing or class-change tricks.
            if(!prefersReducedMotion){
                star.animate(coinFlipFrames, coinFlipTiming);
            }
        });
    });
}