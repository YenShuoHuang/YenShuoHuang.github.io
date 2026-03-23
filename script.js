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

// 3D Model Loading with Model-Viewer (Most Reliable)
document.addEventListener('DOMContentLoaded', function() {
    const loadModelBtn = document.getElementById('load-model-btn');
    const viewScreenshotBtn = document.getElementById('view-screenshot-btn');
    const loadFromScreenshotBtn = document.getElementById('load-from-screenshot-btn');
    const modelWarning = document.getElementById('model-warning');
    const modelScreenshot = document.getElementById('model-screenshot');
    const modelContainer = document.getElementById('model-container');

    let viewerLoaded = false;

    function load3DViewer() {
        if (modelWarning) modelWarning.style.display = 'none';
        if (modelScreenshot) modelScreenshot.style.display = 'none';
        if (modelContainer) modelContainer.style.display = 'block';
        
        if (!viewerLoaded) {
            initModelViewer();
            viewerLoaded = true;
        }
    }

    function showScreenshot() {
        if (modelWarning) modelWarning.style.display = 'none';
        if (modelContainer) modelContainer.style.display = 'none';
        if (modelScreenshot) modelScreenshot.style.display = 'block';
    }

    function initModelViewer() {
        const container = document.getElementById('cesiumContainer');
        if (!container) return;

        // Load model-viewer
        if (!customElements.get('model-viewer')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
            script.onload = createViewer;
            script.onerror = function() {
                showError('Failed to load 3D viewer library.');
            };
            document.head.appendChild(script);
        } else {
            createViewer();
        }
    }

    function createViewer() {
        const container = document.getElementById('cesiumContainer');
        
        container.innerHTML = `
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .loading-screen {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    flex-direction: column;
                    padding: 2rem;
                }
                .spinner {
                    border: 4px solid rgba(255,255,255,0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1.5rem;
                }
            </style>
            <model-viewer 
                id="brussels-model"
                src="brussels_3D/EU_park.gltf"
                alt="Brussels 3D Model"
                camera-controls
                auto-rotate
                auto-rotate-delay="3000"
                shadow-intensity="1"
                camera-orbit="45deg 75deg 500m"
                min-camera-orbit="auto auto 100m"
                max-camera-orbit="auto auto 2000m"
                style="width: 100%; height: 700px; background: #e8f4f8;">
                
                <div slot="poster" class="loading-screen">
                    <div class="spinner"></div>
                    <p style="font-size: 1.2rem; margin: 0.5rem 0;">Loading 3D Model...</p>
                    <p style="font-size: 0.9rem; opacity: 0.8;">This may take 30-60 seconds</p>
                </div>
            </model-viewer>
        `;

        const modelViewer = container.querySelector('#brussels-model');
        
        modelViewer.addEventListener('load', () => {
            console.log('✓ Model loaded successfully');
        });

        modelViewer.addEventListener('error', (event) => {
            console.error('Model error:', event.detail);
            showError('Failed to load 3D model. The file may be corrupted or too large.');
        });
    }

    function showError(message) {
        const container = document.getElementById('cesiumContainer');
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 700px; background: #f8d7da; color: #721c24; flex-direction: column; padding: 2rem; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>Failed to Load 3D Model</h3>
                <p style="max-width: 500px;">${message}</p>
                <button onclick="document.getElementById('view-screenshot-btn').click()" style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    View Screenshot Instead
                </button>
            </div>
        `;
    }

    if (loadModelBtn) loadModelBtn.addEventListener('click', load3DViewer);
    if (viewScreenshotBtn) viewScreenshotBtn.addEventListener('click', showScreenshot);
    if (loadFromScreenshotBtn) loadFromScreenshotBtn.addEventListener('click', load3DViewer);
});
// ── Navigation Dropdown (touch support for mobile) ───────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.nav-dropdown');
    if (!dropdown) return;

    const menu = dropdown.querySelector('.dropdown-menu');

    // Toggle on tap for mobile (hover handles desktop)
    dropdown.querySelector('a').addEventListener('click', function(e) {
        // Only intercept on touch devices — desktop uses CSS hover
        if (window.matchMedia('(hover: none)').matches) {
            e.preventDefault();
            const isOpen = menu.style.display === 'block';
            menu.style.display = isOpen ? '' : 'block';
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            menu.style.display = '';
        }
    });
});
