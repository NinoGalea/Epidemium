import Settings from "./settings.js";

export var STEPS_COUNT = 0;

export function updateTime() {
    if (!Settings.PAUSED) {
        STEPS_COUNT += Settings.SIMULATION_SPEED;
    }
}

export function togglePause() {
    Settings.PAUSED = !Settings.PAUSED;
}

export function stopSimulation () {
    Settings.PAUSED = true;
    Settings.SIMULATION_SPEED = 0.0;
}