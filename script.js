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
// 3D Model Loading with Cesium
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
        // Load Cesium CSS
        if (!document.querySelector('link[href*="cesium"]')) {
            const cesiumCSS = document.createElement('link');
            cesiumCSS.rel = 'stylesheet';
            cesiumCSS.href = 'https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/Widgets/widgets.css';
            document.head.appendChild(cesiumCSS);
        }

        // Load Cesium JS
        if (!window.Cesium) {
            const cesiumScript = document.createElement('script');
            cesiumScript.src = 'https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/Cesium.js';
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
            // Create viewer with minimal dependencies
            const viewer = new Cesium.Viewer('cesiumContainer', {
                // Use default imagery and terrain (no Ion token needed)
                imageryProvider: new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://a.tile.openstreetmap.org/'
                }),
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
                selectionIndicator: false,
                shouldAnimate: false
            });

            // Remove terrain provider (causes issues without Ion token)
            viewer.scene.globe.depthTestAgainstTerrain = false;

            // Brussels coordinates
            const longitude = 4.3517;
            const latitude = 50.8503;
            const height = 50; // Slightly above ground

            // Calculate position
            const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            
            // Calculate orientation
            const heading = Cesium.Math.toRadians(0);
            const pitch = Cesium.Math.toRadians(0);
            const roll = Cesium.Math.toRadians(0);
            const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

            // Load model with error handling
            const modelPath = window.location.pathname.includes('YenShuoHuang.github.io') 
                ? '/brussels_3D/EU_park.gltf'  // GitHub Pages path
                : 'brussels_3D/EU_park.gltf';   // Local path

            console.log('Loading model from:', modelPath);

            const modelEntity = viewer.entities.add({
                name: 'Brussels Urban Model',
                position: position,
                orientation: orientation,
                model: {
                    uri: modelPath,
                    minimumPixelSize: 64,
                    maximumScale: 10000,
                    scale: 1.0,
                    runAnimations: false
                }
            });

            // Set initial camera view
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 800),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-45),
                    roll: 0.0
                }
            });

            // Fly to model after short delay
            setTimeout(() => {
                viewer.flyTo(modelEntity, {
                    duration: 3,
                    offset: new Cesium.HeadingPitchRange(
                        Cesium.Math.toRadians(0),
                        Cesium.Math.toRadians(-30),
                        400
                    )
                }).catch(err => {
                    console.error('Error flying to model:', err);
                });
            }, 1000);

            // Listen for model load events
            modelEntity.model.readyPromise.then(model => {
                console.log('Model loaded successfully');
            }).catch(error => {
                console.error('Error loading model:', error);
                alert('Failed to load 3D model. The file may be too large or in an incompatible format. Please try viewing the screenshot instead.');
            });

        } catch (error) {
            console.error('Error initializing Cesium viewer:', error);
            alert('Failed to initialize 3D viewer: ' + error.message);
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