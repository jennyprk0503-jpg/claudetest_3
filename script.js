// Application State
const state = {
    currentStep: 0,
    choices: {
        shape: 'oval',
        color: '#ffc0cb',
        pattern: 'none',
        patternColor: '#ffffff'
    },
    colors1: [],
    colors2: []
};

// Steps configuration
const steps = [
    {
        name: 'Shape Selection',
        type: 'shape',
        options: ['round', 'square', 'oval']
    },
    {
        name: 'Color Selection',
        type: 'color',
        options: [] // Will be populated with random colors
    },
    {
        name: 'Pattern Selection',
        type: 'pattern',
        options: ['none', 'polka-dots', 'grid', 'stripes']
    },
    {
        name: 'Pattern Color',
        type: 'pattern-color',
        options: [] // Will be populated with random colors
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateRandomColors();
    setupWelcomeScreen();
});

// Generate random colors
function generateRandomColors() {
    state.colors1 = [
        generateRandomColor(),
        generateRandomColor(),
        generateRandomColor()
    ];
    state.colors2 = [
        generateRandomColor(),
        generateRandomColor(),
        generateRandomColor()
    ];
    steps[1].options = state.colors1;
    steps[3].options = state.colors2;
}

function generateRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 40);
    const lightness = 50 + Math.floor(Math.random() * 30);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Welcome Screen Setup
function setupWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.addEventListener('click', startExperience);
}

function startExperience() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const selectionScreen = document.getElementById('selection-screen');

    welcomeScreen.classList.remove('active');
    selectionScreen.classList.add('active');

    setupSelectionScreen();
}

// Selection Screen Setup
function setupSelectionScreen() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.addEventListener('click', goToPreviousStep);
    nextBtn.addEventListener('click', goToNextStep);

    renderStep();
}

function renderStep() {
    const step = steps[state.currentStep];
    const optionsContainer = document.getElementById('options-container');
    const stepIndicator = document.getElementById('step-indicator');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Update step indicator
    stepIndicator.textContent = step.name;

    // Update navigation buttons
    prevBtn.disabled = state.currentStep === 0;
    nextBtn.textContent = state.currentStep === steps.length - 1 ? 'Finish' : '>';

    // Clear options container
    optionsContainer.innerHTML = '';
    optionsContainer.className = 'options-container fade-in';

    // Render options based on step type
    step.options.forEach(option => {
        const optionElement = createOptionElement(step.type, option);
        optionsContainer.appendChild(optionElement);
    });

    // Render current nail
    renderNail();
}

function createOptionElement(type, option) {
    const div = document.createElement('div');
    div.className = `option ${type}-option`;

    switch(type) {
        case 'shape':
            div.innerHTML = createShapePreview(option);
            div.addEventListener('click', () => selectShape(option));
            break;
        case 'color':
            div.style.backgroundColor = option;
            div.addEventListener('click', () => selectColor(option));
            break;
        case 'pattern':
            div.innerHTML = createPatternPreview(option);
            div.addEventListener('click', () => selectPattern(option));
            break;
        case 'pattern-color':
            div.style.backgroundColor = option;
            div.addEventListener('click', () => selectPatternColor(option));
            break;
    }

    return div;
}

function createShapePreview(shape) {
    let path = '';
    switch(shape) {
        case 'round':
            path = '<ellipse cx="25" cy="30" rx="20" ry="25" fill="#e0e0e0" stroke="#999" stroke-width="2"/>';
            break;
        case 'square':
            path = '<rect x="5" y="5" width="40" height="50" rx="5" fill="#e0e0e0" stroke="#999" stroke-width="2"/>';
            break;
        case 'oval':
            path = '<ellipse cx="25" cy="30" rx="18" ry="28" fill="#e0e0e0" stroke="#999" stroke-width="2"/>';
            break;
    }
    return `<svg class="shape-preview" viewBox="0 0 50 60">${path}</svg>`;
}

function createPatternPreview(pattern) {
    const baseNail = '<rect x="5" y="5" width="50" height="60" rx="10" fill="#ffc0cb"/>';
    let patternSvg = '';

    switch(pattern) {
        case 'none':
            return `<svg class="pattern-preview" viewBox="0 0 60 70">
                ${baseNail}
                <text x="30" y="40" text-anchor="middle" font-size="12" fill="#666">None</text>
            </svg>`;
        case 'polka-dots':
            patternSvg = `
                <circle cx="15" cy="20" r="4" fill="#333"/>
                <circle cx="30" cy="25" r="4" fill="#333"/>
                <circle cx="45" cy="20" r="4" fill="#333"/>
                <circle cx="20" cy="40" r="4" fill="#333"/>
                <circle cx="40" cy="45" r="4" fill="#333"/>
            `;
            break;
        case 'grid':
            patternSvg = `
                <line x1="10" y1="10" x2="10" y2="60" stroke="#333" stroke-width="1"/>
                <line x1="20" y1="10" x2="20" y2="60" stroke="#333" stroke-width="1"/>
                <line x1="30" y1="10" x2="30" y2="60" stroke="#333" stroke-width="1"/>
                <line x1="40" y1="10" x2="40" y2="60" stroke="#333" stroke-width="1"/>
                <line x1="50" y1="10" x2="50" y2="60" stroke="#333" stroke-width="1"/>
                <line x1="5" y1="15" x2="55" y2="15" stroke="#333" stroke-width="1"/>
                <line x1="5" y1="25" x2="55" y2="25" stroke="#333" stroke-width="1"/>
                <line x1="5" y1="35" x2="55" y2="35" stroke="#333" stroke-width="1"/>
                <line x1="5" y1="45" x2="55" y2="45" stroke="#333" stroke-width="1"/>
                <line x1="5" y1="55" x2="55" y2="55" stroke="#333" stroke-width="1"/>
            `;
            break;
        case 'stripes':
            patternSvg = `
                <line x1="0" y1="15" x2="60" y2="15" stroke="#333" stroke-width="3"/>
                <line x1="0" y1="25" x2="60" y2="25" stroke="#333" stroke-width="3"/>
                <line x1="0" y1="35" x2="60" y2="35" stroke="#333" stroke-width="3"/>
                <line x1="0" y1="45" x2="60" y2="45" stroke="#333" stroke-width="3"/>
                <line x1="0" y1="55" x2="60" y2="55" stroke="#333" stroke-width="3"/>
            `;
            break;
    }

    return `<svg class="pattern-preview" viewBox="0 0 60 70">${baseNail}${patternSvg}</svg>`;
}

// Selection handlers
function selectShape(shape) {
    state.choices.shape = shape;
    renderNail();
}

function selectColor(color) {
    state.choices.color = color;
    renderNail();
}

function selectPattern(pattern) {
    state.choices.pattern = pattern;
    renderNail();
}

function selectPatternColor(color) {
    state.choices.patternColor = color;
    renderNail();
}

// Render current nail with choices
function renderNail() {
    const nailContainer = document.getElementById('single-nail');
    const { shape, color, pattern, patternColor } = state.choices;

    let nailSvg = '';

    // Create nail shape
    switch(shape) {
        case 'round':
            nailSvg += `<ellipse cx="100" cy="150" rx="60" ry="80" fill="${color}" stroke="#d4a5a5" stroke-width="3"/>`;
            break;
        case 'square':
            nailSvg += `<rect x="40" y="70" width="120" height="160" rx="15" fill="${color}" stroke="#d4a5a5" stroke-width="3"/>`;
            break;
        case 'oval':
            nailSvg += `<ellipse cx="100" cy="150" rx="50" ry="90" fill="${color}" stroke="#d4a5a5" stroke-width="3"/>`;
            break;
    }

    // Add pattern
    if (pattern !== 'none') {
        nailSvg += createNailPattern(shape, pattern, patternColor);
    }

    nailContainer.innerHTML = nailSvg;
}

function createNailPattern(shape, pattern, color) {
    let patternSvg = '';

    switch(pattern) {
        case 'polka-dots':
            patternSvg = `
                <circle cx="70" cy="110" r="8" fill="${color}"/>
                <circle cx="100" cy="130" r="8" fill="${color}"/>
                <circle cx="130" cy="110" r="8" fill="${color}"/>
                <circle cx="80" cy="160" r="8" fill="${color}"/>
                <circle cx="120" cy="170" r="8" fill="${color}"/>
                <circle cx="100" cy="190" r="8" fill="${color}"/>
            `;
            break;
        case 'grid':
            patternSvg = `
                <line x1="60" y1="80" x2="60" y2="220" stroke="${color}" stroke-width="2"/>
                <line x1="80" y1="80" x2="80" y2="220" stroke="${color}" stroke-width="2"/>
                <line x1="100" y1="80" x2="100" y2="220" stroke="${color}" stroke-width="2"/>
                <line x1="120" y1="80" x2="120" y2="220" stroke="${color}" stroke-width="2"/>
                <line x1="140" y1="80" x2="140" y2="220" stroke="${color}" stroke-width="2"/>
                <line x1="50" y1="100" x2="150" y2="100" stroke="${color}" stroke-width="2"/>
                <line x1="50" y1="120" x2="150" y2="120" stroke="${color}" stroke-width="2"/>
                <line x1="50" y1="140" x2="150" y2="140" stroke="${color}" stroke-width="2"/>
                <line x1="50" y1="160" x2="150" y2="160" stroke="${color}" stroke-width="2"/>
                <line x1="50" y1="180" x2="150" y2="180" stroke="${color}" stroke-width="2"/>
                <line x1="50" y1="200" x2="150" y2="200" stroke="${color}" stroke-width="2"/>
            `;
            break;
        case 'stripes':
            patternSvg = `
                <line x1="40" y1="100" x2="160" y2="100" stroke="${color}" stroke-width="5"/>
                <line x1="40" y1="120" x2="160" y2="120" stroke="${color}" stroke-width="5"/>
                <line x1="40" y1="140" x2="160" y2="140" stroke="${color}" stroke-width="5"/>
                <line x1="40" y1="160" x2="160" y2="160" stroke="${color}" stroke-width="5"/>
                <line x1="40" y1="180" x2="160" y2="180" stroke="${color}" stroke-width="5"/>
                <line x1="40" y1="200" x2="160" y2="200" stroke="${color}" stroke-width="5"/>
            `;
            break;
    }

    return patternSvg;
}

// Navigation
function goToPreviousStep() {
    if (state.currentStep > 0) {
        state.currentStep--;
        renderStep();
    }
}

function goToNextStep() {
    if (state.currentStep < steps.length - 1) {
        state.currentStep++;
        renderStep();
    } else {
        showFinalScreen();
    }
}

// Final Screen
function showFinalScreen() {
    const selectionScreen = document.getElementById('selection-screen');
    const finalScreen = document.getElementById('final-screen');

    selectionScreen.classList.remove('active');
    finalScreen.classList.add('active');

    renderFinalHand();
}

function renderFinalHand() {
    const finalNails = document.querySelectorAll('.final-nail');
    const nailPositions = [
        { x: 80, y: 185, width: 36, height: 25 },  // Thumb
        { x: 120, y: 105, width: 32, height: 25 }, // Index
        { x: 150, y: 75, width: 32, height: 28 },  // Middle
        { x: 180, y: 95, width: 32, height: 26 },  // Ring
        { x: 210, y: 133, width: 28, height: 22 }  // Pinky
    ];

    finalNails.forEach((nailElement, index) => {
        const pos = nailPositions[index];
        const { shape, color, pattern, patternColor } = state.choices;

        let nailSvg = '';

        // Create nail shape based on position
        const cx = pos.x;
        const cy = pos.y;
        const rx = pos.width / 2;
        const ry = pos.height / 2;

        switch(shape) {
            case 'round':
                nailSvg += `<ellipse cx="${cx}" cy="${cy}" rx="${rx + 2}" ry="${ry + 2}" fill="${color}" stroke="#d4a5a5" stroke-width="1"/>`;
                break;
            case 'square':
                nailSvg += `<rect x="${cx - rx}" y="${cy - ry}" width="${pos.width}" height="${pos.height}" rx="${rx / 3}" fill="${color}" stroke="#d4a5a5" stroke-width="1"/>`;
                break;
            case 'oval':
                nailSvg += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry + 2}" fill="${color}" stroke="#d4a5a5" stroke-width="1"/>`;
                break;
        }

        // Add pattern to final nails
        if (pattern !== 'none') {
            nailSvg += createFinalNailPattern(cx, cy, rx, ry, pattern, patternColor);
        }

        nailElement.innerHTML = nailSvg;
    });
}

function createFinalNailPattern(cx, cy, rx, ry, pattern, color) {
    let patternSvg = '';
    const scale = 0.3; // Scale down patterns for smaller nails

    switch(pattern) {
        case 'polka-dots':
            patternSvg = `
                <circle cx="${cx - rx/2}" cy="${cy - ry/2}" r="${3 * scale * 10}" fill="${color}"/>
                <circle cx="${cx + rx/2}" cy="${cy - ry/2}" r="${3 * scale * 10}" fill="${color}"/>
                <circle cx="${cx}" cy="${cy}" r="${3 * scale * 10}" fill="${color}"/>
                <circle cx="${cx - rx/3}" cy="${cy + ry/2}" r="${3 * scale * 10}" fill="${color}"/>
                <circle cx="${cx + rx/3}" cy="${cy + ry/2}" r="${3 * scale * 10}" fill="${color}"/>
            `;
            break;
        case 'grid':
            const gridSpacing = rx / 2;
            patternSvg = `
                <line x1="${cx - rx}" y1="${cy - ry}" x2="${cx - rx}" y2="${cy + ry}" stroke="${color}" stroke-width="1"/>
                <line x1="${cx}" y1="${cy - ry}" x2="${cx}" y2="${cy + ry}" stroke="${color}" stroke-width="1"/>
                <line x1="${cx + rx}" y1="${cy - ry}" x2="${cx + rx}" y2="${cy + ry}" stroke="${color}" stroke-width="1"/>
                <line x1="${cx - rx}" y1="${cy - ry/2}" x2="${cx + rx}" y2="${cy - ry/2}" stroke="${color}" stroke-width="1"/>
                <line x1="${cx - rx}" y1="${cy}" x2="${cx + rx}" y2="${cy}" stroke="${color}" stroke-width="1"/>
                <line x1="${cx - rx}" y1="${cy + ry/2}" x2="${cx + rx}" y2="${cy + ry/2}" stroke="${color}" stroke-width="1"/>
            `;
            break;
        case 'stripes':
            patternSvg = `
                <line x1="${cx - rx}" y1="${cy - ry/2}" x2="${cx + rx}" y2="${cy - ry/2}" stroke="${color}" stroke-width="2"/>
                <line x1="${cx - rx}" y1="${cy}" x2="${cx + rx}" y2="${cy}" stroke="${color}" stroke-width="2"/>
                <line x1="${cx - rx}" y1="${cy + ry/2}" x2="${cx + rx}" y2="${cy + ry/2}" stroke="${color}" stroke-width="2"/>
            `;
            break;
    }

    return patternSvg;
}
