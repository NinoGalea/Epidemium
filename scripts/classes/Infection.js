export class Infection {
    /**
     * An infection is the disease to simulate.
     * @param {string} name The name of the disease
     * @param {number} incubationPeriod Time before the person can start infect others
     * @param {number} duration Amount of time the infection is there, before it kills the host or vanishes 
     * @param {number} contagionRate Abitrary value to define how likely someone is to be contaminated
     * @param {number} mortalityRate Share of people that die once the duration is over
     * @param {number} recoveryRate Share of people that will recover and develop immunity to the disease 
     */
    constructor({
        name,
        incubationPeriod,
        duration,
        contagionRate,
        mortalityRate,
        recoveryRate
    }) {
        this.name = name;
        this.incubationPeriod = incubationPeriod;
        this.duration = duration;
        this.contagionRate = contagionRate;
        this.mortalityRate = mortalityRate;
        this.recoveryRate = recoveryRate;
    }
}