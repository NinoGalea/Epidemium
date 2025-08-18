import { Chunk, Chunks, chunkSize } from "./classes/Chunk.js";
import { Human, Humans } from "./classes/Human.js";
import { Infection } from "./classes/Infection.js";
import Settings from "./settings.js";
import { updateTime } from "./time.js";

// Setup canvas
const CANVAS = document.querySelector('canvas');
if (!CANVAS) throw new Error("Canvas not found.");
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;
export const ctx = CANVAS.getContext('2d');
if (!ctx) throw new Error("Your browser does not support canvas.");

// Setup chunks
for (let i = 0; i < Math.ceil(CANVAS.width / chunkSize); i++) {
    for (let j = 0; j < Math.ceil(CANVAS.height / chunkSize); j++) {
        var c = new Chunk({ x: i, y: j });
        c.show();
    }
}

// Setup disease
export var disease = new Infection({
    name: "Disease",
    incubationPeriod: 250,
    duration: 500,
    contagionRate: 4,
    mortalityRate: 0.1,
    recoveryRate: 0.5
})

// Setup humans
for (let i = 0; i < Settings.POPULATION_SIZE; i++) {
    new Human({
        position: { 
            x: Math.random() * 0.95 * CANVAS.width + 0.025 * CANVAS.width, 
            y: Math.random() * 0.95 * CANVAS.height + 0.025 * CANVAS.height },
        status: "healthy",
    })
}


// Select random for first contamination
Humans.get(Math.floor(Math.random() * Humans.size)).infect();
console.log(Humans);

// Main loop
function main() {
    // Update simulation
    updateTime();
    updateHumans();
    drawHumans();

    // Launch a new loop
    setTimeout(main, 1000 * Settings.SIMULATION_SPEED / Settings.STEPS_PER_SECOND);
}
setTimeout(main, 1000 * Settings.SIMULATION_SPEED / Settings.STEPS_PER_SECOND);

// Handler functions
function drawHumans() {
    for (const human of Humans.values()) {
        human.draw();
    }
}

function updateHumans() {
    for (const human of Humans.values()) {
        human.update();
    }
}