export default class StopsScreen {
    constructor(mainAppInstance, parentElement) {
        this.mainApp = mainAppInstance;
        this.parentElement = parentElement;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('stops-screen-wrapper');
        this.parentElement.appendChild(this.wrapper);
        
        this.createStopsList();
        this.createNoStopsMessage();
        this.createRoutesInfoContainer();

        this.stopsListBody.addEventListener('click', this.handleBodyClick.bind(this));
    }

    hide() {
        this.wrapper.style.display = 'none';
    }

    show() {
        this.wrapper.style.display = 'flex';
    }

    createStopsList() {
        this.stopsListContainer = document.createElement('div');
        this.stopsListContainer.classList.add('stops-list__container', 'small-scrollbar');
        this.wrapper.appendChild(this.stopsListContainer);

        this.stopsListHeader = document.createElement('div');
        this.stopsListHeader.classList.add('stops-list__header', 'stops-list-grid-layout');
        this.stopsListContainer.appendChild(this.stopsListHeader);

        this.stopsListHeader.innerHTML = `
            <div class="name-cell">Name</div>
            <div class="coords-cell">Coordinates</div>
            <div class="audio-cell">Audio</div>
            <div class="radius-cell">Radius</div>
            <div class="routes-cell">Routes using</div>
        `;
        
        this.stopsListBody = document.createElement('div');
        this.stopsListBody.classList.add('stops-list__body', 'stops-list-grid-layout');
        this.stopsListBody.dataset.numberOfStops = 0;
        this.stopsListContainer.appendChild(this.stopsListBody);
    }

    renderStop(stop) {
        if(+this.stopsListBody.dataset.numberOfStops === 0) {
            this.hideNoStopsMessage();
            this.stopsListBody.dataset.numberOfStops = 1;
        } else {
            this.stopsListBody.dataset.numberOfStops++;
        }

        const row = document.createElement('div');
        row.classList.add('stops-list__row');
        row.dataset.stopId = stop.id;
        row.innerHTML = `
            <div class="name-cell">${stop.name}</div>
            <div class="coords-cell">
                <span>Lat: ${stop.lat.toFixed(5)}</span>
                <span>Lon: ${stop.lon.toFixed(5)}</span>
            </div>
            <div class="audio-cell">${stop.audioTrackNumber}</div>
            <div class="radius-cell">${stop.radius}</div>
            <div class="routes-cell">
                ${stop.routes.length}
                <span class="show-routes">show</span>
            </div>
        `;
        this.stopsListBody.appendChild(row);
    }

    clearStopsList() {
        this.stopsListBody.innerHTML = '';
        this.stopsListBody.dataset.numberOfStops = 0;
        this.showNoStopsMessage();
    }

    createNoStopsMessage() {
        this.noStopsMessage = document.createElement('div');
        this.noStopsMessage.classList.add('no-stops-message');
        this.noStopsMessage.textContent = 'No stops available. Open a file or create a new stop.';
        this.stopsListContainer.appendChild(this.noStopsMessage);
    }

    hideNoStopsMessage() {
        this.noStopsMessage.style.display = 'none';
    }

    showNoStopsMessage() {
        this.noStopsMessage.style.display = 'block';
    }

    handleBodyClick(event) {
        const row = event.target.closest('.stops-list__row');
        if (!row) return;

        const stopId = row.dataset.stopId;
        const stop = this.mainApp.data.getStopById(stopId);
        
        if (event.target.classList.contains('show-routes')) {
            const rect = event.target.getBoundingClientRect();
            this.showRoutesInfo(stop, rect);
        }
    }

    createRoutesInfoContainer() {
        this.routesInfoContainer = document.createElement('div');
        this.routesInfoContainer.classList.add('routes-info-container', 'small-scrollbar');
        document.body.appendChild(this.routesInfoContainer);

        const closeButton = document.createElement('button');
        closeButton.classList.add('routes-info__close-button');
        closeButton.textContent = '+';
        closeButton.addEventListener('click', this.hideStopRoutesInfo.bind(this));
        this.routesInfoContainer.appendChild(closeButton);

        this.routesInfoHeader = document.createElement('div');
        this.routesInfoHeader.classList.add('routes-info-header');
        this.routesInfoContainer.appendChild(this.routesInfoHeader);

        const routesInfoListWrapper = document.createElement('div');
        routesInfoListWrapper.classList.add('routes-info-list-wrapper', 'small-scrollbar');
        this.routesInfoContainer.appendChild(routesInfoListWrapper);

        this.routesInfoList = document.createElement('ul');
        this.routesInfoList.classList.add('routes-info-list');
        routesInfoListWrapper.appendChild(this.routesInfoList);
    }

    showRoutesInfo(stop, buttonRect) {
        this.routesInfoHeader.textContent = stop.name;
        this.routesInfoHeader.title = stop.name;
        this.routesInfoList.innerHTML = '';
        stop.routes.forEach(routeId => {
            const li = document.createElement('li');
            li.textContent = this.mainApp.data.getRouteById(routeId).name;
            this.routesInfoList.appendChild(li);
        });

        this.routesInfoContainer.style.display = 'block';
        const infoRect = this.routesInfoContainer.getBoundingClientRect();
        const right = buttonRect.right - infoRect.width + 5;
        const top = buttonRect.bottom;

        this.routesInfoContainer.style.top = top + 'px';
        this.routesInfoContainer.style.left = right + 'px';
    }

    hideStopRoutesInfo(event) {
        this.routesInfoContainer.style.display = 'none';
    }
}