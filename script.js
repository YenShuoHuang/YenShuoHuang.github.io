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
// 3D Model Loading with Cesium (Fixed)
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
            loadCesium();
            viewerLoaded = true;
        }
    }

    function showScreenshot() {
        if (modelWarning) modelWarning.style.display = 'none';
        if (modelContainer) modelContainer.style.display = 'none';
        if (modelScreenshot) modelScreenshot.style.display = 'block';
    }

    function loadCesium() {
        // Set base URL before loading Cesium
        window.CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/';
        
        // Load Cesium CSS
        if (!document.querySelector('link[href*="cesium"]')) {
            const cesiumCSS = document.createElement('link');
            cesiumCSS.rel = 'stylesheet';
            cesiumCSS.href = window.CESIUM_BASE_URL + 'Widgets/widgets.css';
            document.head.appendChild(cesiumCSS);
        }

        // Load Cesium JS
        if (!window.Cesium) {
            const cesiumScript = document.createElement('script');
            cesiumScript.src = window.CESIUM_BASE_URL + 'Cesium.js';
            cesiumScript.onload = initCesiumViewer;
            cesiumScript.onerror = function() {
                console.error('Failed to load Cesium library');
                alert('Failed to load 3D viewer library. Please check your internet connection.');
            };
            document.head.appendChild(cesiumScript);
        } else {
            initCesiumViewer();
        }
    }

    function initCesiumViewer() {
        try {
            console.log('Initializing Cesium viewer...');

            // Create viewer without terrain provider
            const viewer = new Cesium.Viewer('cesiumContainer', {
                imageryProvider: new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://tile.openstreetmap.org/'
                }),
                terrainProvider: undefined, // No terrain
                baseLayerPicker: false,
                geocoder: false,
                homeButton: true,
                sceneModePicker: false,
                navigationHelpButton: false,
                animation: false,
                timeline: false,
                fullscreenButton: true,
                vrButton: false,
                infoBox: false,
                selectionIndicator: false
            });

            console.log('Viewer created successfully');

            // Brussels coordinates
            const longitude = 4.3517;
            const latitude = 50.8503;
            const height = 50;

            // Create position
            const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            
            // Create orientation
            const heading = Cesium.Math.toRadians(0);
            const pitch = 0;
            const roll = 0;
            const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

            // Model path
            const modelPath = 'brussels_3D/EU_park.gltf';
            console.log('Loading model from:', modelPath);

            // Add model entity
            const modelEntity = viewer.entities.add({
                name: 'Brussels Urban Model',
                position: position,
                orientation: orientation,
                model: {
                    uri: modelPath,
                    minimumPixelSize: 64,
                    maximumScale: 20000
                }
            });

            console.log('Model entity added');

            // Set camera position
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 500),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-45),
                    roll: 0.0
                }
            });

            // Zoom to model
            setTimeout(() => {
                viewer.zoomTo(modelEntity);
            }, 2000);

            console.log('3D Model viewer initialized successfully');

        } catch (error) {
            console.error('Error initializing Cesium viewer:', error);
            document.getElementById('cesiumContainer').innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8d7da; color: #721c24; flex-direction: column; padding: 2rem; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>Failed to Initialize 3D Viewer</h3>
                    <p>Error: ${error.message}</p>
                    <button onclick="document.getElementById('view-screenshot-btn').click()" class="btn-primary" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        View Screenshot Instead
                    </button>
                </div>
            `;
        }
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