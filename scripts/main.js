import { Chunk, Chunks, chunkSize } from "./classes/Chunk.js";
import { Human, Humans } from "./classes/Human.js";
import { Infection } from "./classes/Infection.js";
import Settings from "./settings.js";
import { STEPS_COUNT, stopSimulation, togglePause, updateTime } from "./time.js";
import { main as Statistics } from "./statistics.js";

// Setup from user input
let disease;
const setupPage = document.querySelector('div#setup');
const form = document.querySelector('div#setup>form');
if (!form || !setupPage) throw new Error("Form element not found");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    disease = new Infection({
        name: formData.get('infectionName'),
        incubationPeriod: parseInt(formData.get('incubationPeriod')),
        duration: parseInt(formData.get('duration')),
        contagionRate: parseFloat(formData.get('contagionRate')),
        mortalityRate: parseFloat(formData.get('mortalityRate')),
        recoveryRate: parseFloat(formData.get('recoveryRate')),
    });
    Settings.POPULATION_SIZE = parseInt(formData.get('populationSize'));
    setup();
    setupPage.style.display = 'none';
});
export function getDisease() {
    return disease;
}

// Setup canvas
const CANVAS = document.querySelector('canvas');
if (!CANVAS) throw new Error("Canvas not found.");
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;
export { CANVAS };
export const ctx = CANVAS.getContext('2d');
if (!ctx) throw new Error("Your browser does not support canvas.");

// Setup keys event listeners
addEventListener("keydown", (event) => {
    if (Settings.IS_SIMULATION_RUNNING) {
        if (event.key == 'i' || event.key == 'I') {
            Settings.STATS_DISPLAY = !Settings.STATS_DISPLAY;
            displayStatsFrame();
        }
        if (event.key == 'g' || event.key == 'G') {
            Settings.SHOW_CHUNKS = !Settings.SHOW_CHUNKS;
        }
        if (event.code == 'Space') {
            togglePause();
            displayStatsFrame();
        }
    }
});

// Handle refresh
addEventListener('beforeunload', (event) => {
    if (Settings.IS_SIMULATION_RUNNING) {
        event.preventDefault();
    }
});

// Setup 
function setup() {
    // Setup chunks
    for (let i = 0; i < Math.ceil(CANVAS.width / chunkSize); i++) {
        for (let j = 0; j < Math.ceil(CANVAS.height / chunkSize); j++) {
            new Chunk({ x: i, y: j });
        }
    }

    // Setup humans
    for (let i = 0; i < Settings.POPULATION_SIZE; i++) {
        new Human({
            position: {
                x: Math.random() * 0.95 * CANVAS.width + 0.025 * CANVAS.width,
                y: Math.random() * 0.95 * CANVAS.height + 0.025 * CANVAS.height
            },
            status: "healthy",
        })
    }

    // Select random for first contamination
    Humans.get(Math.floor(Math.random() * Humans.size)).infect();

    // Start simulation
    Settings.IS_SIMULATION_RUNNING = true;
    setTimeout(main, 1000 * Settings.SIMULATION_SPEED / Settings.STEPS_PER_SECOND);
}


// Main loop
function main() {
    // Stop the loop if the simulation is not supposed to run
    if (!Settings.IS_SIMULATION_RUNNING) { displayStatsFrame(); };

    // Update simulation
    if (!Settings.PAUSED) {
        updateTime();
        clearScreen();
        updateHumans();
        drawHumans();
    }
    displayStatsFrame();
    stopAtEnd();

    // Launch a new loop
    setTimeout(main, 1000 * Settings.SIMULATION_SPEED / Settings.STEPS_PER_SECOND);
}

// Handler functions
function clearScreen() {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    if (Settings.SHOW_CHUNKS) {
        for (const chunk of Chunks.values()) {
            chunk.show();
        }
    }
}

function updateHumans() {
    for (const human of Humans.values()) {
        human.update();
    }
    Human.updateHistory();
}

function drawHumans() {
    for (const human of Humans.values()) {
        human.draw();
    }
}

function displayStatsFrame() {
    if (Settings.STATS_DISPLAY) {
        Statistics();
    }
}

function stopAtEnd() {
    const count = Human.count();
    if (count.incubating == 0 && count.infected == 0) {
        stopSimulation();
    }
}