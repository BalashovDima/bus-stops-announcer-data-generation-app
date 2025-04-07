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
            <div class="header-cell name-cell">Name</div>
            <div class="header-cell coords-cell">Coordinates</div>
            <div class="header-cell audio-cell">Audio</div>
            <div class="header-cell radius-cell">Radius</div>
            <div class="header-cell routes-cell">Routes using</div>
        `;
        
        this.stopsListBody = document.createElement('div');
        this.stopsListBody.classList.add('stops-list__body', 'stops-list-grid-layout');
        this.stopsListBody.dataset.numberOfStops = 0;
        this.stopsListContainer.appendChild(this.stopsListBody);

        this.createPinUnpinHeaderButton();
    }

    createPinUnpinHeaderButton() {
        this.pinHeaderButton = document.createElement('div');
        this.pinHeaderButton.classList.add('stops-list__pin-header');
        this.stopsListHeader.appendChild(this.pinHeaderButton);

        this.pinHeaderButton.innerHTML = `
        <svg class='pin' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.579 14.579L11.6316 17.5264L10.7683 16.6631C10.3775 16.2723 10.1579 15.7422 10.1579 15.1894V13.1053L7.21052 10.158L5 9.42111L9.42111 5L10.158 7.21052L13.1053 10.1579L15.1894 10.1579C15.7422 10.1579 16.2722 10.3775 16.6631 10.7683L17.5264 11.6316L14.579 14.579ZM14.579 14.579L19 19" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <svg class='pin-slash' style="display: none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.579 14.579L11.6316 17.5264L11.0526 16.9474M14.579 14.579L17.5264 11.6316L16.9474 11.0526M14.579 14.579L19 19M5 19L10.1579 13.8421M19 5L13.8421 10.1579M13.8421 10.1579L13.1053 10.1579L10.158 7.21052L9.42111 5L5 9.42111L7.21052 10.158L10.1579 13.1053V13.8421M13.8421 10.1579L10.1579 13.8421" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;

        this.pinHeaderButton.addEventListener('click', (e) => {
            if (this.stopsListHeader.classList.contains('sticky')) {
                this.pinHeaderButton.querySelector('.pin').style.display = 'block';
                this.pinHeaderButton.querySelector('.pin-slash').style.display = 'none';
                this.stopsListHeader.classList.remove('sticky');
            } else {
                this.pinHeaderButton.querySelector('.pin').style.display = 'none';
                this.pinHeaderButton.querySelector('.pin-slash').style.display = 'block';
                this.stopsListHeader.classList.add('sticky');
            }
        });
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