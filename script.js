// Application State
const state = {
    currentStep: 0,
    selectedTree: null,
    selectedLights: null,
    placedOrnaments: []
};

// Light color schemes
const lightSchemes = {
    mixed: ['#ff0000', '#0000ff', '#ffff00', '#00ff00', '#ff00ff'],
    white: ['#ffffff', '#f0f0f0', '#e8e8e8'],
    yellow: ['#FFD700', '#FFA500', '#FFED4E'],
    orange: ['#ff8c00', '#ff6347', '#ff4500']
};

// Sound effects using Web Audio API
let audioContext;
let clickSound;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupWelcomeScreen();
    setupAudio();
});

// Setup Audio
function setupAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function playClickSound() {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Welcome Screen
function setupWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.addEventListener('click', startExperience);
}

function startExperience() {
    playClickSound();
    const welcomeScreen = document.getElementById('welcome-screen');
    const step1 = document.getElementById('step1');

    welcomeScreen.classList.remove('active');
    step1.classList.add('active');

    state.currentStep = 1;
    setupTreeSelection();
    updateNavigationArrows();
}

// Tree Selection (Step 1)
function setupTreeSelection() {
    const treeOptions = document.querySelectorAll('.tree-option');

    treeOptions.forEach(option => {
        option.addEventListener('click', function() {
            playClickSound();
            const treeType = this.dataset.tree;
            selectTree(treeType);
        });
    });
}

function selectTree(treeType) {
    state.selectedTree = treeType;

    const selectedTreeDiv = document.getElementById('selected-tree');
    selectedTreeDiv.className = `tree ${treeType}-tree`;

    // Enable next arrow after selection
    document.getElementById('next-arrow').classList.add('active');
}

// Lights Selection (Step 2)
function setupLightsSelection() {
    const lightOptions = document.querySelectorAll('.light-option');

    lightOptions.forEach(option => {
        option.addEventListener('click', function() {
            playClickSound();
            const lightsType = this.dataset.lights;
            selectLights(lightsType);
        });
    });
}

function selectLights(lightsType) {
    state.selectedLights = lightsType;

    const treeWithLights = document.getElementById('tree-with-lights');
    treeWithLights.className = `tree ${state.selectedTree}-tree`;

    const lightsContainer = treeWithLights.querySelector('.lights-container');
    lightsContainer.innerHTML = '';

    // Generate light positions
    const lightPositions = generateLightPositions();
    const colors = lightSchemes[lightsType];

    lightPositions.forEach((pos, index) => {
        const light = document.createElement('div');
        light.className = 'light';
        light.style.left = `${pos.x}%`;
        light.style.top = `${pos.y}%`;
        light.style.backgroundColor = colors[index % colors.length];
        light.style.color = colors[index % colors.length];
        light.style.animationDelay = `${Math.random() * 1.5}s`;
        lightsContainer.appendChild(light);
    });

    // Enable next arrow after selection
    document.getElementById('next-arrow').classList.add('active');
}

function generateLightPositions() {
    const positions = [];
    const numLights = 40; // Total number of lights
    const spirals = 3; // Number of times the garland wraps around

    for (let i = 0; i < numLights; i++) {
        const progress = i / numLights;

        // Y position goes from top to bottom
        const y = 15 + (progress * 65);

        // Width decreases as we go down the tree (triangle shape)
        const treeWidth = 60 - (progress * 50);

        // X position oscillates left to right (diagonal/spiral effect)
        const angle = progress * Math.PI * 2 * spirals;
        const x = 50 + (Math.sin(angle) * treeWidth / 2);

        positions.push({ x, y });
    }

    return positions;
}

// Ornaments Selection (Step 3)
function setupOrnamentsSelection() {
    const ornamentOptions = document.querySelectorAll('.ornament-option');
    const dropZone = document.getElementById('tree-with-ornaments');

    // Setup tree with lights
    dropZone.className = `tree ${state.selectedTree}-tree drop-zone`;
    const lightsContainer = dropZone.querySelector('.lights-container');
    lightsContainer.innerHTML = '';

    // Copy lights from step 2
    const lightPositions = generateLightPositions();
    const colors = lightSchemes[state.selectedLights];

    lightPositions.forEach((pos, index) => {
        const light = document.createElement('div');
        light.className = 'light';
        light.style.left = `${pos.x}%`;
        light.style.top = `${pos.y}%`;
        light.style.backgroundColor = colors[index % colors.length];
        light.style.color = colors[index % colors.length];
        light.style.animationDelay = `${Math.random() * 1.5}s`;
        lightsContainer.appendChild(light);
    });

    // Setup drag and drop
    ornamentOptions.forEach(option => {
        option.addEventListener('dragstart', handleDragStart);
    });

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);

    // Enable next arrow (can proceed even without placing ornaments)
    document.getElementById('next-arrow').classList.add('active');
}

let draggedOrnamentType = null;

function handleDragStart(e) {
    draggedOrnamentType = this.dataset.ornament;
    e.dataTransfer.effectAllowed = 'copy';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleDrop(e) {
    e.preventDefault();
    playClickSound();

    const dropZone = document.getElementById('tree-with-ornaments');
    const rect = dropZone.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Only allow ornaments within tree bounds
    if (y > 15 && y < 85 && x > 25 && x < 75) {
        placeOrnament(draggedOrnamentType, x, y);
    }
}

function placeOrnament(type, x, y) {
    const ornamentsContainer = document.querySelector('#tree-with-ornaments .ornaments-container');

    const ornament = document.createElement('div');
    ornament.className = `placed-ornament ornament-preview ${type}`;
    ornament.style.left = `${x}%`;
    ornament.style.top = `${y}%`;
    ornament.style.animationDelay = `${Math.random() * 3}s`;

    ornamentsContainer.appendChild(ornament);

    state.placedOrnaments.push({ type, x, y });
}

// Navigation
function updateNavigationArrows() {
    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');

    // Show/hide arrows based on current step
    if (state.currentStep > 0) {
        prevArrow.classList.add('active');
    } else {
        prevArrow.classList.remove('active');
    }

    // Next arrow is shown but not active until a choice is made
    // This is handled in each step's selection functions
}

document.getElementById('prev-arrow').addEventListener('click', () => {
    playClickSound();
    if (state.currentStep > 1) {
        goToPreviousStep();
    }
});

document.getElementById('next-arrow').addEventListener('click', () => {
    playClickSound();
    goToNextStep();
});

function goToPreviousStep() {
    const currentScreen = document.querySelector('.screen.active');
    currentScreen.classList.remove('active');

    state.currentStep--;

    const prevScreen = document.getElementById(`step${state.currentStep}`);
    prevScreen.classList.add('active');

    updateNavigationArrows();

    // Hide next arrow until selection is made again
    if (state.currentStep === 1 && !state.selectedTree) {
        document.getElementById('next-arrow').classList.remove('active');
    } else if (state.currentStep === 2 && !state.selectedLights) {
        document.getElementById('next-arrow').classList.remove('active');
    }
}

function goToNextStep() {
    const currentScreen = document.querySelector('.screen.active');

    // Validate selections
    if (state.currentStep === 1 && !state.selectedTree) return;
    if (state.currentStep === 2 && !state.selectedLights) return;

    currentScreen.classList.remove('active');

    state.currentStep++;

    if (state.currentStep === 2) {
        const step2 = document.getElementById('step2');
        step2.classList.add('active');
        setupLightsSelection();
        document.getElementById('next-arrow').classList.remove('active');
    } else if (state.currentStep === 3) {
        const step3 = document.getElementById('step3');
        step3.classList.add('active');
        setupOrnamentsSelection();
    } else if (state.currentStep === 4) {
        showFinale();
    }

    updateNavigationArrows();
}

// Finale Screen
function showFinale() {
    const currentScreen = document.querySelector('.screen.active');
    currentScreen.classList.remove('active');

    const finaleScreen = document.getElementById('finale');
    finaleScreen.classList.add('active');

    // Hide navigation arrows
    document.getElementById('prev-arrow').classList.remove('active');
    document.getElementById('next-arrow').classList.remove('active');

    // Setup final tree
    const finalTree = document.getElementById('final-tree');
    finalTree.className = `tree ${state.selectedTree}-tree`;

    // Add lights
    const lightsContainer = finalTree.querySelector('.lights-container');
    lightsContainer.innerHTML = '';

    const lightPositions = generateLightPositions();
    const colors = lightSchemes[state.selectedLights];

    lightPositions.forEach((pos, index) => {
        const light = document.createElement('div');
        light.className = 'light';
        light.style.left = `${pos.x}%`;
        light.style.top = `${pos.y}%`;
        light.style.backgroundColor = colors[index % colors.length];
        light.style.color = colors[index % colors.length];
        light.style.animationDelay = `${Math.random() * 1.5}s`;
        lightsContainer.appendChild(light);
    });

    // Add ornaments
    const ornamentsContainer = finalTree.querySelector('.ornaments-container');
    ornamentsContainer.innerHTML = '';

    state.placedOrnaments.forEach(orn => {
        const ornament = document.createElement('div');
        ornament.className = `placed-ornament ornament-preview ${orn.type}`;
        ornament.style.left = `${orn.x}%`;
        ornament.style.top = `${orn.y}%`;
        ornament.style.animationDelay = `${Math.random() * 3}s`;
        ornamentsContainer.appendChild(ornament);
    });

    // Start snowfall
    startSnowfall();

    // Play music
    playChristmasMusic();
}

// Snowfall Animation
function startSnowfall() {
    const canvas = document.getElementById('snowfall-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snowflakes = [];
    const numFlakes = 100;

    // Create snowflakes
    for (let i = 0; i < numFlakes; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            drift: Math.random() * 0.5 - 0.25
        });
    }

    function animateSnowfall() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.beginPath();

        snowflakes.forEach(flake => {
            ctx.moveTo(flake.x, flake.y);
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);

            flake.y += flake.speed;
            flake.x += flake.drift;

            if (flake.y > canvas.height) {
                flake.y = 0;
                flake.x = Math.random() * canvas.width;
            }

            if (flake.x > canvas.width) {
                flake.x = 0;
            } else if (flake.x < 0) {
                flake.x = canvas.width;
            }
        });

        ctx.fill();
        requestAnimationFrame(animateSnowfall);
    }

    animateSnowfall();

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Christmas Music using Web Audio API
function playChristmasMusic() {
    if (!audioContext) return;

    // Complete Jingle Bells melody
    const melody = [
        // Jingle bells, jingle bells, jingle all the way
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.6 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.6 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 783.99, duration: 0.3 }, // G
        { freq: 523.25, duration: 0.45 }, // C
        { freq: 587.33, duration: 0.15 }, // D
        { freq: 659.25, duration: 1.2 }, // E

        // Oh what fun it is to ride in a one-horse open sleigh
        { freq: 698.46, duration: 0.3 }, // F
        { freq: 698.46, duration: 0.3 }, // F
        { freq: 698.46, duration: 0.45 }, // F
        { freq: 698.46, duration: 0.15 }, // F
        { freq: 698.46, duration: 0.3 }, // F
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.15 }, // E
        { freq: 659.25, duration: 0.15 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 587.33, duration: 0.3 }, // D
        { freq: 587.33, duration: 0.3 }, // D
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 587.33, duration: 0.6 }, // D
        { freq: 783.99, duration: 0.6 }, // G

        // Jingle bells, jingle bells, jingle all the way
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.6 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.6 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 783.99, duration: 0.3 }, // G
        { freq: 523.25, duration: 0.45 }, // C
        { freq: 587.33, duration: 0.15 }, // D
        { freq: 659.25, duration: 1.2 }, // E

        // Oh what fun it is to ride in a one-horse open sleigh
        { freq: 698.46, duration: 0.3 }, // F
        { freq: 698.46, duration: 0.3 }, // F
        { freq: 698.46, duration: 0.45 }, // F
        { freq: 698.46, duration: 0.15 }, // F
        { freq: 698.46, duration: 0.3 }, // F
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.3 }, // E
        { freq: 659.25, duration: 0.15 }, // E
        { freq: 659.25, duration: 0.15 }, // E
        { freq: 783.99, duration: 0.3 }, // G
        { freq: 783.99, duration: 0.3 }, // G
        { freq: 698.46, duration: 0.3 }, // F
        { freq: 587.33, duration: 0.3 }, // D
        { freq: 523.25, duration: 1.2 }  // C
    ];

    let time = audioContext.currentTime;

    function playNote(note) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.12, time + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + note.duration);

        oscillator.start(time);
        oscillator.stop(time + note.duration);

        time += note.duration;
    }

    function playMelody() {
        time = audioContext.currentTime;
        melody.forEach(note => playNote(note));
    }

    // Play once, then repeat every 20 seconds (length of the melody)
    playMelody();
    setInterval(playMelody, 20000);
}
