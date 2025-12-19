function initCarousel(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsId);
    const cards = track.querySelectorAll('.product-card');
    
    let currentIndex = 0;
    let itemsPerPage = 4;
    
    function updateItemsPerPage() {
        const width = window.innerWidth;
        if (width <= 480) {
            itemsPerPage = 1;
        } else if (width <= 768) {
            itemsPerPage = 2;
        } else if (width <= 1200) {
            itemsPerPage = 3;
        } else {
            itemsPerPage = 4;
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

// Initialize both carousels
initCarousel('carouselTrack', 'carouselDots');
initCarousel('carouselTrack2', 'carouselDots2');

