import { ctx } from "../main.js";

export const chunkSize = 100;

/**
 * @type {Map<String, Chunk>}
 */
export const Chunks = new Map();

export class Chunk {
    constructor({ x, y }) {
        this.x = x;
        this.y = y;

        this.bounds = [
            { x: this.x * chunkSize, y: this.y * chunkSize },
            { x: (this.x + 1) * chunkSize, y: this.y * chunkSize },
            { x: this.x * chunkSize, y: (this.y + 1) * chunkSize },
            { x: (this.x + 1) * chunkSize, y: (this.y + 1) * chunkSize },
        ];

        // List of IDs
        this.humans = [];

        Chunks.set(`${this.x}_${this.y}`, this);
    }

    /**
     * @returns {Array<string>}
     */
    get neighbours() {
        var neighbours = [];
        for (let i = this.x - 1; i < this.x + 2; i++) {
            for (let j = this.y - 1; j < this.y + 2; j++) {
                if (i == 0 && j == 0) continue;
                neighbours.push(`${i}_${j}`);
            }
        }
        return neighbours;
    }

    show() {
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        ctx.font = "10px sans-serif";
        ctx.strokeRect(this.bounds[0].x, this.bounds[0].y, chunkSize, chunkSize);
        ctx.fillText(`(${this.x}, ${this.y})`, this.x * chunkSize + 3, this.y * chunkSize + 10);
    }

    static getChunk({ x, y }) {
        const chunk = { x: x / chunkSize, y: y / chunkSize };
        if (Chunks.get(`${chunk.x}_${chunk.y}`)) {
            return Chunks.get(`${chunk.x}_${chunk.y}`);
        }
    }
} 