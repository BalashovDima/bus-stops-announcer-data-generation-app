export default class MainApp {
    constructor(rootElement) { 
        this.rootElement = rootElement;

        this.createStopsAndRoutesSwitch();
    }

    createStopsAndRoutesSwitch() {
        // switching between stops and routes
        this.stopsAndRoutesSwitch = document.createElement('div');
        this.stopsAndRoutesSwitch.classList.add('stops-and-routes-switch');
        this.rootElement.appendChild(this.stopsAndRoutesSwitch);

        const stopsButton = document.createElement('button');
        stopsButton.textContent = 'Stops';
        stopsButton.classList.add('switch-button', 'active');
        this.stopsAndRoutesSwitch.appendChild(stopsButton);

        const routesButton = document.createElement('button');
        routesButton.textContent = 'Routes';
        routesButton.classList.add('switch-button');
        this.stopsAndRoutesSwitch.appendChild(routesButton);

        const switchIndicator = document.createElement('div');
        switchIndicator.classList.add('switch-indicator');
        this.stopsAndRoutesSwitch.appendChild(switchIndicator);

        stopsButton.addEventListener('click', () => {
            routesButton.classList.remove('active');
            stopsButton.classList.add('active');
            switchIndicator.style.transform = `translateX(70%)`;
        });

        routesButton.addEventListener('click', () => {
            stopsButton.classList.remove('active');
            routesButton.classList.add('active');
            switchIndicator.style.transform = `translateX(315%)`;
        });
    }
}