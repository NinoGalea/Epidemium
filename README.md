# Epidemium
**A web-based epidemic simulator.**

Epidemium allows you to visualize the evolution of a disease in a population. To try it out for yourself, go to https://ninogalea.github.io/Epidemium.

## Setup
Once the page is loaded, you can fill in various fields concerning the disease and the population.
- Infection name: Name of the disease.
- Incubation period: Time in ticks during which an individual is infected but not contagious.
- Duration: Time in ticks during which an individual is contagious.
- Contagion rate: Rate ranging from 0 to 1 of the chance that an individual will be infected by another at each tick, but also dependent on distance.
- Mortality rate: Chance ranging from 0 to 1 of dying from the disease.
- Recovery rate: Chance ranging from 0 to 1 of becoming immune to the disease after surviving it.
- Population size: Number of individuals in the simulation.

## Simulation
Once the simulation has started, different colors represent different types of individuals:
- Blue: Healthy.
- Purple: Incubation phase. The individual will become contagious and move on to the next phase after the incubation period.
- Red: Infected. The individual is sick and likely to infect others. They will move on to the next phase after the disease has run its course.
- Turquoise: Vaccinated. Not implemented.
- Green: Cured. The individual can no longer be infected.

### Keyboard shortcuts
There are various shortcuts for viewing data.
- `Space bar`: Pause or resume the simulation.
- `G`: Show or hide the background.
- `I`: Show or hide statistics.
- `Right click`: Move the statistics window.

### Statistics
The statistics page displays information about the disease, the number of individuals in the simulation and the number for each type, as well as the number of ticks since the start of the simulation.
A graph is displayed, showing the evolution of the population shares in real time.

## Stopping and restarting
When the number of people in the incubation and infected phases is 0, the simulation stops (displayed on the statistics page, next to the number of ticks).
To restart the simulation at any time during the simulation, simply reload the page (`F5`, `Shift + R`, or `Cmd + R`).