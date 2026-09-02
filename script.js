/**
 * iPhone Landing Page - Scroll-Driven Disassembly Animation
 */

const CONFIG = {
    totalFrames: 120,
    folder: 'IPHONE_FRAMES',
    prefix: 'ezgif-frame-',
    extension: '.jpg'
};

const state = {
    images: [],
    currentIndex: 1,
    isLoading: true,
    lastFrameDrawn: null,
    scrollProgress: 0
};

const dom = {
    loader: document.getElementById('loader'),
    loadPercent: document.getElementById('load-percent'),
    canvas: document.getElementById('animation-canvas'),
    progressFill: document.getElementById('progress-fill'),
    animationTrigger: document.getElementById('animation-trigger'),
    textStart: document.getElementById('text-start'),
    textMiddle: document.getElementById('text-middle'),
    textEnd: document.getElementById('text-end')
};

const ctx = dom.canvas.getContext('2d');

/**
 * Initialize the experience
 */
async function init() {
    await preloadImages();
    setupCanvas();
    setupEventListeners();

    // Hide loader
    dom.loader.style.opacity = '0';
    setTimeout(() => dom.loader.style.display = 'none', 800);
    state.isLoading = false;
}

/**
 * Preload all frames into memory
 */
async function preloadImages() {
    const loadPromises = [];

    for (let i = 1; i <= CONFIG.totalFrames; i++) {
        const frameNum = String(i).padStart(3, '0');
        const img = new Image();
        img.src = `${CONFIG.folder}/${CONFIG.prefix}${frameNum}${CONFIG.extension}`;

        const promise = new Promise((resolve) => {
            img.onload = () => {
                updateLoadProgress();
                resolve(img);
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${img.src}`);
                resolve(null);
            };
        });

        loadPromises.push(promise);
        state.images.push(img);
    }

    await Promise.all(loadPromises);
}

let loadedCount = 0;
function updateLoadProgress() {
    loadedCount++;
    const percent = Math.floor((loadedCount / CONFIG.totalFrames) * 100);
    dom.loadPercent.innerText = `${percent}%`;
}

/**
 * Configure canvas dimensions based on first image
 */
function setupCanvas() {
    const firstImg = state.images[0];
    if (!firstImg) return;

    // Set internal canvas resolution to match image
    dom.canvas.width = firstImg.naturalWidth;
    dom.canvas.height = firstImg.naturalHeight;

    // Initial draw
    drawFrame(1);
}

/**
 * Render a specific frame to the canvas
 */
function drawFrame(index) {
    const img = state.images[index - 1];
    if (!img) return;

    ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
    ctx.drawImage(img, 0, 0);
    state.lastFrameDrawn = index;
}

/**
 * Calculate animation progress and update visuals
 */
function handleScroll() {
    const rect = dom.animationTrigger.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Animation starts when the top of the trigger hits the top of the viewport
    // and ends when the bottom of the trigger hits the top of the viewport.
    // The trigger is 300vh, the wrapper is 100vh (sticky).
    // Actual scrollable distance is totalHeight - windowHeight.
    const totalScrollable = rect.height - windowHeight;
    const currentScroll = -rect.top;

    // Map scroll position to 0.0 - 1.0 range
    let progress = currentScroll / totalScrollable;
    progress = Math.max(0, Math.min(1, progress));

    state.scrollProgress = progress;

    // Update progress bar
    dom.progressFill.style.width = `${progress * 100}%`;

    // Map progress to frame index (1 to 30)
    const frameIndex = Math.floor(progress * (CONFIG.totalFrames - 1)) + 1;

    // Update milestone text
    updateMilestones(progress);

    // Request animation frame for smooth rendering
    requestAnimationFrame(() => {
        if (frameIndex !== state.lastFrameDrawn) {
            drawFrame(frameIndex);
        }
    });
}

/**
 * Trigger text overlays based on scroll progress
 */
function updateMilestones(progress) {
    // Start text: 0% to 30%
    dom.textStart.classList.toggle('active', progress > 0.05 && progress < 0.3);

    // Middle text: 40% to 60%
    dom.textMiddle.classList.toggle('active', progress > 0.4 && progress < 0.6);

    // End text: 70% to 100%
    dom.textEnd.classList.toggle('active', progress > 0.75);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle window resize to ensure canvas stays responsive
    window.addEventListener('resize', () => {
        // The canvas maintains aspect ratio via CSS 'object-fit: contain'
        // but we redraw the current frame to be safe.
        drawFrame(state.currentIndex);
    });
}

// Kick off the experience
init();
