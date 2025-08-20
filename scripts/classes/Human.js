import { ctx, getDisease } from "../main.js";
import Settings from "../settings.js";
import { STEPS_COUNT } from "../time.js";
import { Chunk, Chunks, chunkSize } from "./Chunk.js";

export const Humans = new Map();
export const HumansCountHistory = new Array();

export class Human {
    /**
     * @param {Object} position 
     * @param {number} position.x 
     * @param {number} position.y
     * @param {"healthy" | "incubating" | "infected" | "vaccinated" | "cured" | "dead"} status 
     */
    constructor({
        position,
        status
    }) {
        this.id = Humans.size;
        this.position = position;
        this.radius = 10;
        this.updateChunk();

        this.status = status;
        this.infectionTimestamp = null;

        Humans.set(this.id, this);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = Settings.COLORS[this.status.toUpperCase()] ? Settings.COLORS[this.status.toUpperCase()] : '#000000';
        ctx.fill();
    }

    /**
     * Updates the human by analysing its neighbours
     */
    update() {
        this.updateChunk();

        // Get neighbours
        const chunk = Chunks.get(`${this.chunkPosition.x}_${this.chunkPosition.y}`);
        if (!chunk) return;
        /** @type {Array<string>} */
        var neighbours = [];
        for (var n of chunk.neighbours) {
            var c = Chunks.get(n);
            if (!c) continue;
            neighbours = neighbours.concat(c.humans);
        }



        // Update based of the status, distance with the neighbours, ect
        switch (this.status) {
            case "healthy":
                for (const neighbourID of neighbours) {
                    /** @type {Human | null} */
                    const neighbour = Humans.get(neighbourID);
                    if (!neighbour) continue;

                    // If not contaminated, ignore
                    if (neighbour.status !== "infected") continue;

                    // Get distance
                    const distance = Math.sqrt(Math.pow(this.position.x - neighbour.position.x, 2) + Math.pow(this.position.y - neighbour.position.y, 2)) - this.radius - neighbour.radius;
                    const chanceToGetContaminated = (distance) => { return (Settings.SIMULATION_SPEED / Settings.STEPS_PER_SECOND) * (getDisease().contagionRate / (2 * (distance) + 0.01)) };
                    const random = Math.random();
                    if (random <= chanceToGetContaminated(distance)) {
                        this.incubate();
                    }
                }
                break;

            case "incubating":
                if (STEPS_COUNT - this.infectionTimestamp >= getDisease().incubationPeriod) {
                    this.infect();
                }
                break;

            case "infected":
                if (STEPS_COUNT - this.infectionTimestamp >= getDisease().incubationPeriod + getDisease().duration) {
                    if (Math.random() < getDisease().mortalityRate) {
                        this.die();
                    } else {
                        if (Math.random() > getDisease().recoveryRate) {
                            this.recover();
                        } else {
                            this.cure();
                        }
                    }
                }
                break;

            default:
                break;
        }
    }

    /**
     * Updates the chunk position of the human as well as the concerned chunk human list. 
     */
    updateChunk() {
        // Compare old and updated position
        var old = this.chunkPosition ?? null;
        this.chunkPosition = { x: Math.floor(this.position.x / chunkSize), y: Math.floor(this.position.y / chunkSize) };

        // Add human to new chunk if needed
        const newChunk = Chunks.get(`${this.chunkPosition.x}_${this.chunkPosition.y}`);
        if (!newChunk) return;
        if (newChunk.humans.indexOf(this.id) == -1) {
            newChunk.humans.push(this.id);
        }

        // Remove human from old chunk
        if (old && old != this.chunkPosition) {
            const oldChunk = Chunks.get(`${old.x}_${old.y}`);
            if (!oldChunk) return;
            const index = oldChunk.humans.indexOf(this.id);
            if (index > -1) oldChunk.humans.slice(index, 1);
        }
    }

    /**
     * Infects a human with the disease
     */
    incubate() {
        this.infectionTimestamp = STEPS_COUNT;
        this.status = "incubating";
    }

    /**
     * Stops the incubating process and goes to the infectious status
     */
    infect() {
        this.status = "infected";
    }

    /**
     * Kills a human
    */
    die() {
        this.status = "dead";
    }

    /**
     * Make a human get back to the default status
     */
    recover() {
        this.status = "healthy";
    }

    /**
     * Cures a human
     */
    cure() {
        this.status = "cured";
    }

    static count() {
        const statuses = {
            healthy: 0,
            incubating: 0,
            infected: 0,
            vaccinated: 0,
            cured: 0,
            dead: 0
        };
        for (const Human of Humans.values()) {
            statuses[Human.status]++;
        }
        return statuses;
    }

    static updateHistory() {
        HumansCountHistory.push(Human.count());
    }

    static countHistory() {
        return HumansCountHistory;
    }
}