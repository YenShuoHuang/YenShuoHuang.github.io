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
        // Use CDN (fixes 404 errors)
        window.CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/';
        
        const cesiumCSS = document.createElement('link');
        cesiumCSS.rel = 'stylesheet';
        cesiumCSS.href = 'https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/Widgets/widgets.css';
        document.head.appendChild(cesiumCSS);

        const cesiumScript = document.createElement('script');
        cesiumScript.src = 'https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/Cesium.js';
        cesiumScript.onload = initCesiumViewer;
        cesiumScript.onerror = function() {
            showError('Failed to load Cesium library from CDN.');
        };
        document.head.appendChild(cesiumScript);
    }

    function initCesiumViewer() {
        try {
            console.log('Cesium version:', Cesium.VERSION);

            // Disable web workers
            if (typeof Cesium !== 'undefined') {
                Cesium.TaskProcessor.prototype._getWebWorkerResource = function() {
                    return undefined;
                };
            }

            const container = document.getElementById('cesiumContainer');
            if (!container) {
                throw new Error('Container element not found');
            }

            const viewer = new Cesium.Viewer(container, {
                imageryProvider: new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://tile.openstreetmap.org/'
                }),
                terrainProvider: new Cesium.EllipsoidTerrainProvider(),
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

            viewer.scene.globe.depthTestAgainstTerrain = false;
            viewer.scene.globe.enableLighting = false;

            console.log('Viewer created');

            const longitude = 4.3517;
            const latitude = 50.8503;
            const height = 50;

            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000),
                orientation: {
                    heading: 0,
                    pitch: Cesium.Math.toRadians(-45),
                    roll: 0
                }
            });

            console.log('Camera positioned');

            // Use entity API (correct for Cesium 1.109)
            const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            const heading = Cesium.Math.toRadians(0);
            const pitch = 0;
            const roll = 0;
            const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

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

            console.log('Model entity added');

            // Fly to model
            setTimeout(function() {
                viewer.flyTo(modelEntity, {
                    duration: 3,
                    offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-30), 500)
                }).then(function() {
                    console.log('✓ Model visible');
                }).catch(function(error) {
                    console.error('Fly error:', error);
                });
            }, 2000);

        } catch (error) {
            console.error('Init error:', error);
            showError('Failed to initialize: ' + error.message);
        }
    }

    function showError(message) {
        const container = document.getElementById('cesiumContainer');
        if (container) {
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8d7da; color: #721c24; flex-direction: column; padding: 2rem; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>3D Viewer Error</h3>
                    <p style="max-width: 500px;">${message}</p>
                    <button onclick="document.getElementById('view-screenshot-btn').click()" style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        View Screenshot
                    </button>
                </div>
            `;
        }
    }

    if (loadModelBtn) loadModelBtn.addEventListener('click', load3DViewer);
    if (viewScreenshotBtn) viewScreenshotBtn.addEventListener('click', showScreenshot);
    if (loadFromScreenshotBtn) loadFromScreenshotBtn.addEventListener('click', load3DViewer);

    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('importScripts')) {
            e.preventDefault();
            return true;
        }
    });
});