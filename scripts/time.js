import Settings from "./settings.js";

export var STEPS_COUNT = 0;

export function updateTime() {
    STEPS_COUNT =+ Settings.STEPS_PER_SECOND;
}