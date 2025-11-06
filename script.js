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
            document.head.appendChild(cesiumScript);
        } else {
            initCesiumViewer();
        }
    }

    function initCesiumViewer() {
        try {
            // Set Cesium Ion token (free account)
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk';

            const viewer = new Cesium.Viewer('cesiumContainer', {
                terrainProvider: Cesium.createWorldTerrain(),
                animation: false,
                timeline: false,
                baseLayerPicker: false,
                geocoder: false,
                homeButton: true,
                sceneModePicker: false,
                navigationHelpButton: true,
                fullscreenButton: true,
                vrButton: false,
                infoBox: false,
                selectionIndicator: false
            });

            // Brussels coordinates
            const longitude = 4.3517;
            const latitude = 50.8503;
            const height = 0;

            // Position for the model
            const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            
            // Orientation
            const heading = Cesium.Math.toRadians(0);
            const pitch = 0;
            const roll = 0;
            const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

            // Add the GLTF model
            const modelEntity = viewer.entities.add({
                name: 'Brussels Urban Model',
                position: position,
                orientation: orientation,
                model: {
                    uri: 'brussels_3D/EU_park.gltf',
                    minimumPixelSize: 128,
                    maximumScale: 20000,
                    scale: 1.0
                }
            });

            // Fly to the model
            viewer.flyTo(modelEntity, {
                duration: 2,
                offset: new Cesium.HeadingPitchRange(
                    Cesium.Math.toRadians(0),
                    Cesium.Math.toRadians(-45),
                    500
                )
            });

            console.log('3D Model loaded successfully');

        } catch (error) {
            console.error('Error initializing Cesium viewer:', error);
            alert('Failed to load 3D viewer. Please try again or view the screenshot instead.');
        }
    }

    // Event listeners
    if (loadModelBtn) loadModelBtn.addEventListener('click', load3DViewer);
    if (viewScreenshotBtn) viewScreenshotBtn.addEventListener('click', showScreenshot);
    if (loadFromScreenshotBtn) loadFromScreenshotBtn.addEventListener('click', load3DViewer);
});