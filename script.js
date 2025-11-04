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

// 3D Model Loading with Warning
document.addEventListener('DOMContentLoaded', function() {
    const loadModelBtn = document.getElementById('load-model-btn');
    const viewScreenshotBtn = document.getElementById('view-screenshot-btn');
    const loadFromScreenshotBtn = document.getElementById('load-from-screenshot-btn');
    const modelWarning = document.getElementById('model-warning');
    const modelScreenshot = document.getElementById('model-screenshot');
    const modelContainer = document.getElementById('model-container');
    const brusselsModel = document.getElementById('brussels-model');

    // Function to load 3D model
    function load3DModel() {
        // Hide warning and screenshot
        if (modelWarning) modelWarning.style.display = 'none';
        if (modelScreenshot) modelScreenshot.style.display = 'none';
        
        // Show model container
        if (modelContainer) modelContainer.style.display = 'block';
        
        // Load the model source (lazy loading)
        if (brusselsModel && !brusselsModel.getAttribute('src')) {
            brusselsModel.setAttribute('src', 'brussels_3D/EU_park.gltf');
            
            // Track loading
            brusselsModel.addEventListener('load', function() {
                console.log('3D Model loaded successfully');
            });
            
            brusselsModel.addEventListener('error', function(error) {
                console.error('Error loading 3D model:', error);
                alert('Failed to load 3D model. Please check your internet connection and try again.');
            });
        }
    }

    // Function to show screenshot
    function showScreenshot() {
        if (modelWarning) modelWarning.style.display = 'none';
        if (modelContainer) modelContainer.style.display = 'none';
        if (modelScreenshot) modelScreenshot.style.display = 'block';
    }

    // Event listeners
    if (loadModelBtn) {
        loadModelBtn.addEventListener('click', load3DModel);
    }

    if (viewScreenshotBtn) {
        viewScreenshotBtn.addEventListener('click', showScreenshot);
    }

    if (loadFromScreenshotBtn) {
        loadFromScreenshotBtn.addEventListener('click', load3DModel);
    }

    // Optional: Check if user is on mobile and show different message
    if (window.innerWidth < 768) {
        const warningContent = document.querySelector('.warning-content > p');
        if (warningContent) {
            warningContent.innerHTML = 'This interactive 3D model is a large file and may not work well on mobile devices:';
        }
    }

    // Optional: Save user preference
    const modelPreference = localStorage.getItem('load3DModelAuto');
    if (modelPreference === 'true') {
        // Auto-load if user previously agreed (optional feature)
        // load3DModel();
    }
});
