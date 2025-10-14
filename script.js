// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        nav.style.background = 'white';
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.research-card, .pub-entry').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Fullscreen functionality for BREEZE app
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const breezeContainer = document.getElementById('breeze-container');
    const breezeIframe = document.getElementById('breeze-iframe');
    
    if (fullscreenBtn && breezeContainer) {
        fullscreenBtn.addEventListener('click', function() {
            if (!breezeContainer.classList.contains('fullscreen')) {
                // Enter fullscreen
                breezeContainer.classList.add('fullscreen');
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
                
                // Try to use native fullscreen API
                if (breezeContainer.requestFullscreen) {
                    breezeContainer.requestFullscreen();
                } else if (breezeContainer.webkitRequestFullscreen) {
                    breezeContainer.webkitRequestFullscreen();
                } else if (breezeContainer.mozRequestFullScreen) {
                    breezeContainer.mozRequestFullScreen();
                } else if (breezeContainer.msRequestFullscreen) {
                    breezeContainer.msRequestFullscreen();
                }
            } else {
                // Exit fullscreen
                exitFullscreen();
            }
        });
        
        // Handle ESC key and native fullscreen exit
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement && 
                !document.msFullscreenElement) {
                exitFullscreen();
            }
        }
        
        function exitFullscreen() {
            breezeContainer.classList.remove('fullscreen');
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
            
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
});