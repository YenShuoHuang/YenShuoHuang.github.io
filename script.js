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
        if (!container) {
            console.error('Container not found');
            return;
        }

        // Load model-viewer script
        if (!customElements.get('model-viewer')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
            
            script.onload = function() {
                console.log('Model-viewer loaded successfully');
                createViewer();
            };
            
            script.onerror = function() {
                console.error('Failed to load model-viewer');
                showError('Failed to load 3D viewer library. Please check your internet connection.');
            };
            
            document.head.appendChild(script);
        } else {
            createViewer();
        }
    }

    function createViewer() {
        const container = document.getElementById('cesiumContainer');
        
        // Add spinner CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .loading-overlay {
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
        `;
        document.head.appendChild(style);

        // Create model-viewer
        container.innerHTML = `
            <model-viewer 
                id="brussels-model"
                src="brussels_3D/EU_park.gltf"
                alt="Brussels 3D Urban Model"
                camera-controls
                auto-rotate
                auto-rotate-delay="3000"
                rotation-per-second="30deg"
                shadow-intensity="1"
                camera-orbit="0deg 75deg 500m"
                field-of-view="45deg"
                min-camera-orbit="auto auto 100m"
                max-camera-orbit="auto auto 2000m"
                interpolation-decay="200"
                style="width: 100%; height: 700px; background: #e8f4f8;">
                
                <div slot="poster" class="loading-overlay">
                    <div class="spinner"></div>
                    <p style="font-size: 1.2rem; margin: 0.5rem 0;">Loading 3D Model...</p>
                    <p style="font-size: 0.9rem; opacity: 0.8; margin: 0;">This may take 30-60 seconds</p>
                </div>

                <div slot="progress-bar" style="background: rgba(255,255,255,0.3); height: 4px; width: 100%; position: absolute; bottom: 0;">
                    <div style="background: white; height: 100%; transition: width 0.3s;"></div>
                </div>
            </model-viewer>
        `;

        // Get model-viewer element
        const modelViewer = container.querySelector('#brussels-model');
        
        // Success handler
        modelViewer.addEventListener('load', () => {
            console.log('✓ Model loaded successfully');
        });

        // Progress handler
        modelViewer.addEventListener('progress', (event) => {
            const progress = event.detail.totalProgress;
            console.log(`Loading progress: ${(progress * 100).toFixed(1)}%`);
        });

        // Error handler
        modelViewer.addEventListener('error', (event) => {
            console.error('Model loading error:', event);
            showError('Failed to load 3D model. The file may be too large or in an incompatible format.');
        });
    }

    function showError(message) {
        const container = document.getElementById('cesiumContainer');
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 700px; background: #f8d7da; color: #721c24; flex-direction: column; padding: 2rem; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3 style="margin: 1rem 0;">Failed to Load 3D Model</h3>
                <p style="margin: 0.5rem 0;">${message}</p>
                <button onclick="document.getElementById('view-screenshot-btn').click()" style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
                    <i class="fas fa-image"></i> View Screenshot Instead
                </button>
            </div>
        `;
    }

    // Event listeners
    if (loadModelBtn) loadModelBtn.addEventListener('click', load3DViewer);
    if (viewScreenshotBtn) viewScreenshotBtn.addEventListener('click', showScreenshot);
    if (loadFromScreenshotBtn) loadFromScreenshotBtn.addEventListener('click', load3DViewer);
});
window.addEventListener('error', function(e) {
    console.error('Global error:', e);
    alert('Error: ' + e.message);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e);
    alert('Promise error: ' + e.reason);
});