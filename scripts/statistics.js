import Settings from "./settings.js";
import { CANVAS, ctx, disease } from "./main.js";
import { Human } from "./classes/Human.js";
import { STEPS_COUNT } from "./time.js";

export function main() {
    // Calculate boundaries
    const statsPopup = {
        x: Math.min(CANVAS.width * 2 / 3, CANVAS.width - 200) + 5,
        y: 5,
        w: Math.min(CANVAS.width / 3, CANVAS.width - 200) - 10,
        h: CANVAS.height / 2 - 10,
        fontSize: 15
    }

    // Background
    ctx.fillStyle = "#000000";
    ctx.fillRect(statsPopup.x - 5, statsPopup.y - 5, statsPopup.w + 10, statsPopup.h + 10);
    ctx.fillStyle = "#303030";
    ctx.fillRect(Math.min(CANVAS.width * 2 / 3, CANVAS.width - 200) + 5, 5, Math.min(CANVAS.width / 3, CANVAS.width - 200) - 10, CANVAS.height / 2 - 10);

    // Population data
    const population = Human.count();
    const total = population.healthy + population.incubating + population.infected + population.vaccinated + population.cured + population.dead;
    ctx.textAlign = "left"
    ctx.fillStyle = "#ffffff";
    ctx.font = `${statsPopup.fontSize}px sans-serif`
    ctx.fillText(`Total population: ${total}`, statsPopup.x + 2, statsPopup.y + statsPopup.fontSize);
    ctx.fillText(`Alive / Dead: ${total - population.dead} / ${population.dead}`, statsPopup.x + 2, statsPopup.y + 2 * statsPopup.fontSize);
    ctx.fillStyle = Settings.COLORS.HEALTHY;
    ctx.fillText(`Healthy: ${population.healthy}`, statsPopup.x + 2, statsPopup.y + 3 * statsPopup.fontSize);
    ctx.fillStyle = Settings.COLORS.INCUBATING;
    ctx.fillText(`Incubating: ${population.incubating}`, statsPopup.x + 2, statsPopup.y + 4 * statsPopup.fontSize);
    ctx.fillStyle = Settings.COLORS.INFECTED;
    ctx.fillText(`Infected: ${population.infected}`, statsPopup.x + 2, statsPopup.y + 5 * statsPopup.fontSize);
    ctx.fillStyle = Settings.COLORS.VACCINATED;
    ctx.fillText(`Vaccinated: ${population.vaccinated}`, statsPopup.x + 2, statsPopup.y + 6 * statsPopup.fontSize);
    ctx.fillStyle = Settings.COLORS.CURED;
    ctx.fillText(`Cured: ${population.cured}`, statsPopup.x + 2, statsPopup.y + 7 * statsPopup.fontSize);

    // Display disease data
    ctx.textAlign = "right"
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${Settings.PAUSED ? '(Paused) ' : ' '}${STEPS_COUNT}`, statsPopup.x + statsPopup.w - 5, statsPopup.y + 1 * statsPopup.fontSize);
    ctx.fillText(`Infection: ${disease.name}`, statsPopup.x + statsPopup.w - 5, statsPopup.y + 2 * statsPopup.fontSize);
    ctx.fillText(`Incubation period: ${disease.incubationPeriod}`, statsPopup.x + statsPopup.w - 5, statsPopup.y + 3 * statsPopup.fontSize);
    ctx.fillText(`Duration: ${disease.duration}`, statsPopup.x + statsPopup.w - 5, statsPopup.y + 4 * statsPopup.fontSize);
    ctx.fillText(`Contagion rate: ${disease.contagionRate}`, statsPopup.x + statsPopup.w - 5, statsPopup.y + 5 * statsPopup.fontSize);
    ctx.fillText(`Mortality rate: ${disease.mortalityRate}`, statsPopup.x + statsPopup.w - 5, statsPopup.y + 6 * statsPopup.fontSize);
    ctx.fillText(`Recovery rate: ${disease.recoveryRate}`, statsPopup.x + statsPopup.w - 5, statsPopup.y + 7 * statsPopup.fontSize);

    // Display graph
    const graphData = {
        x: statsPopup.x + 5,
        y: statsPopup.fontSize * 9,
        w: statsPopup.w - 10,
        h: statsPopup.h - statsPopup.fontSize * 9 - 5,
    }
    const history = Human.countHistory();
    ctx.fillStyle = "#aaaaaa"
    ctx.fillRect(graphData.x, graphData.y, graphData.w, graphData.h);

    const columnWidth = graphData.w / history.length;
    const data = new Array();

    // For each timestamp, get the height
    for (let i = 0; i < history.length; i++) {
        const values = history[i];
        const heights = {
            healthy: values.healthy / total * graphData.h,
            incubating: values.incubating / total * graphData.h,
            infected: values.infected / total * graphData.h,
            vaccinated: values.vaccinated / total * graphData.h,
            cured: values.cured / total * graphData.h,
            dead: values.dead / total * graphData.h
        }

        // Draw each rectangle
        ctx.fillStyle = Settings.COLORS.HEALTHY;
        ctx.fillRect(graphData.x + columnWidth * i, graphData.y, columnWidth, heights.healthy);
        ctx.fillStyle = Settings.COLORS.INCUBATING;
        ctx.fillRect(graphData.x + columnWidth * i, graphData.y + heights.healthy, columnWidth, heights.incubating);
        ctx.fillStyle = Settings.COLORS.INFECTED;
        ctx.fillRect(graphData.x + columnWidth * i, graphData.y + heights.healthy + heights.incubating, columnWidth, heights.infected);
        ctx.fillStyle = Settings.COLORS.VACCINATED;
        ctx.fillRect(graphData.x + columnWidth * i, graphData.y + heights.healthy + heights.incubating + heights.infected, columnWidth, heights.vaccinated);
        ctx.fillStyle = Settings.COLORS.CURED;
        ctx.fillRect(graphData.x + columnWidth * i, graphData.y + heights.healthy + heights.incubating + heights.infected + heights.vaccinated, columnWidth, heights.cured);
        ctx.fillStyle = Settings.COLORS.DEAD;
        ctx.fillRect(graphData.x + columnWidth * i, graphData.y + heights.healthy + heights.incubating + heights.infected + heights.vaccinated + heights.cured, columnWidth, heights.dead);
    }

}