function initCarousel(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsId);
    // Support both product and testimonial cards
    const cards = track.querySelectorAll('.product-card, .testimonial-card');
    
    let currentIndex = 0;
    let itemsPerPage = 4;
    
    function updateItemsPerPage() {
        const width = window.innerWidth;
        // Check if this is a testimonials carousel
        const isTestimonials = track.id.includes('carouselTrack3');
        
        if (width <= 480) {
            itemsPerPage = 1;
        } else if (width <= 768) {
            itemsPerPage = isTestimonials ? 2 : 2; // Show 2 testimonials on tablets
        } else if (width <= 1200) {
            itemsPerPage = isTestimonials ? 2 : 3; // Keep showing 2 testimonials
        } else {
            itemsPerPage = isTestimonials ? 3 : 4; // Show 3 testimonials on large screens
        }
    }
    
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalPages = Math.ceil(cards.length / itemsPerPage);
        
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            console.log("i");
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        const totalPages = Math.ceil(cards.length / itemsPerPage);
        currentIndex = Math.max(0, Math.min(index, totalPages - 1));
        
        const cardWidth = cards[0].offsetWidth + 20;
        const offset = currentIndex * itemsPerPage * cardWidth;
        track.style.transform = `translateX(-${offset}px)`;
        
        updateDots();
    }
    
    updateItemsPerPage();
    createDots();
    
    window.addEventListener('resize', () => {
        updateItemsPerPage();
        createDots();
        goToSlide(0);
    });
}

// Testimonials show more functionality
function initTestimonialsShowMore() {
    const showMoreBtn = document.getElementById('showMoreTestimonials');
    const additionalTestimonials = document.getElementById('carouselTrack3More');
    
    if (showMoreBtn && additionalTestimonials) {
        showMoreBtn.addEventListener('click', function() {
            if (additionalTestimonials.style.display === 'none') {
                additionalTestimonials.style.display = 'flex';
                showMoreBtn.textContent = 'Show Less Reviews';
                initCarousel('carouselTrack3More', 'carouselDots3More');
            } else {
                additionalTestimonials.style.display = 'none';
                showMoreBtn.textContent = 'Show More Reviews';
            }
        });
    }
}

// Initialize all carousels
document.addEventListener('DOMContentLoaded', function() {
    initCarousel('carouselTrack', 'carouselDots');
    initCarousel('carouselTrack2', 'carouselDots2');
    initCarousel('carouselTrack3', 'carouselDots3');
    initTestimonialsShowMore();
});

// Testimonials View More functionality
document.addEventListener('DOMContentLoaded', function() {
    const viewMoreBtn = document.getElementById('viewMoreTestimonials');
    const hiddenTestimonials = document.querySelector('.hidden-testimonials');

    if (viewMoreBtn && hiddenTestimonials) {
        viewMoreBtn.addEventListener('click', function() {
            hiddenTestimonials.classList.toggle('show');
            viewMoreBtn.textContent = hiddenTestimonials.classList.contains('show') ? 'View Less' : 'View More';
        });
    }
});
