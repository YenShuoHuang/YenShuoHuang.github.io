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
// 3D Model Loading with Cesium (Fixed - No Web Workers)
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
        // CRITICAL: Set base URL BEFORE loading Cesium
        window.CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.109/Build/Cesium/';
        
        // Load Cesium CSS
        if (!document.querySelector('link[href*="cesium"]')) {
            const cesiumCSS = document.createElement('link');
            cesiumCSS.rel = 'stylesheet';
            cesiumCSS.href = window.CESIUM_BASE_URL + 'Widgets/widgets.css';
            document.head.appendChild(cesiumCSS);
        }

        // Load Cesium JS (non-module version)
        if (!window.Cesium) {
            const cesiumScript = document.createElement('script');
            // IMPORTANT: NOT type="module"
            cesiumScript.src = window.CESIUM_BASE_URL + 'Cesium.js';
            cesiumScript.async = false; // Load synchronously
            cesiumScript.onload = function() {
                console.log('Cesium loaded, initializing...');
                // Wait a bit for Cesium to fully initialize
                setTimeout(initCesiumViewer, 500);
            };
            cesiumScript.onerror = function(e) {
                console.error('Failed to load Cesium library:', e);
                showError('Failed to load 3D viewer library. Please check your internet connection.');
            };
            document.head.appendChild(cesiumScript);
        } else {
            initCesiumViewer();
        }
    }

    function initCesiumViewer() {
        try {
            console.log('Initializing Cesium viewer...');
            console.log('Cesium version:', Cesium.VERSION);

            // CRITICAL FIX: Force Cesium to NOT use web workers
            if (typeof Cesium !== 'undefined') {
                // Disable web workers for task processor
                Cesium.TaskProcessor.prototype._getWebWorkerResource = function() {
                    return undefined;
                };
            }

            const container = document.getElementById('cesiumContainer');
            if (!container) {
                throw new Error('Container element not found');
            }

            // Create viewer with minimal features
            const viewer = new Cesium.Viewer(container, {
                // Use simple imagery provider (no Ion token needed)
                imageryProvider: new Cesium.TileMapServiceImageryProvider({
                    url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
                }),
                
                // No terrain provider
                terrainProvider: new Cesium.EllipsoidTerrainProvider(),
                
                // Disable features that use web workers
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
                
                // Performance options
                requestRenderMode: false,
                maximumRenderTimeChange: Infinity
            });

            // Disable depth testing
            viewer.scene.globe.depthTestAgainstTerrain = false;

            console.log('Viewer created successfully');

            // Brussels coordinates
            const longitude = 4.3517;
            const latitude = 50.8503;
            const height = 50;

            // Create position
            const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            
            // Create orientation (identity - no rotation)
            const heading = Cesium.Math.toRadians(0);
            const pitch = Cesium.Math.toRadians(0);
            const roll = Cesium.Math.toRadians(0);
            const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

            // Model path
            const modelPath = window.location.origin + '/' + 
                (window.location.pathname.includes('YenShuoHuang.github.io') ? '' : '') + 
                'brussels_3D/EU_park.gltf';
            
            console.log('Loading model from:', modelPath);

            // Create model primitive (alternative to entity)
            try {
                const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
                    position,
                    hpr,
                    Cesium.Ellipsoid.WGS84
                );

                const model = viewer.scene.primitives.add(
                    Cesium.Model.fromGltf({
                        url: modelPath,
                        modelMatrix: modelMatrix,
                        scale: 1.0,
                        minimumPixelSize: 64,
                        maximumScale: 20000,
                        allowPicking: false,
                        
                        // CRITICAL: Disable async operations
                        asynchronous: false,
                        incrementallyLoadTextures: false
                    })
                );

                console.log('Model primitive added');

                // Set initial camera view
                viewer.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 600),
                    orientation: {
                        heading: Cesium.Math.toRadians(0),
                        pitch: Cesium.Math.toRadians(-45),
                        roll: 0.0
                    }
                });

                // Model ready callback
                model.readyPromise.then(function(m) {
                    console.log('✓ Model loaded successfully');
                    
                    // Zoom to model
                    const boundingSphere = m.boundingSphere;
                    viewer.camera.flyToBoundingSphere(boundingSphere, {
                        duration: 2,
                        offset: new Cesium.HeadingPitchRange(0, -0.5, boundingSphere.radius * 3)
                    });
                }).catch(function(error) {
                    console.error('Model loading error:', error);
                    showError('Failed to load 3D model: ' + error.message);
                });

            } catch (modelError) {
                console.error('Error adding model:', modelError);
                showError('Failed to add 3D model to scene: ' + modelError.message);
            }

        } catch (error) {
            console.error('Error initializing Cesium viewer:', error);
            showError('Failed to initialize 3D viewer: ' + error.message);
        }
    }

    function showError(message) {
        const container = document.getElementById('cesiumContainer');
        if (container) {
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8d7da; color: #721c24; flex-direction: column; padding: 2rem; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3 style="margin: 1rem 0;">3D Viewer Error</h3>
                    <p style="margin: 0.5rem 0; max-width: 500px;">${message}</p>
                    <button onclick="document.getElementById('view-screenshot-btn').click()" style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
                        <i class="fas fa-image"></i> View Screenshot Instead
                    </button>
                </div>
            `;
        }
    }

    // Event listeners
    if (loadModelBtn) loadModelBtn.addEventListener('click', load3DViewer);
    if (viewScreenshotBtn) viewScreenshotBtn.addEventListener('click', showScreenshot);
    if (loadFromScreenshotBtn) loadFromScreenshotBtn.addEventListener('click', load3DViewer);

    // Global error handler
    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('importScripts')) {
            console.error('Web worker error caught:', e);
            e.preventDefault();
            return true;
        }
    });
});
window.addEventListener('error', function(e) {
    console.error('Global error:', e);
    alert('Error: ' + e.message);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e);
    alert('Promise error: ' + e.reason);
});