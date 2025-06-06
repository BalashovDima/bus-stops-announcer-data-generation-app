export default class StopsScreen {
    constructor(mainAppInstance, parentElement) {
        this.mainApp = mainAppInstance;
        this.parentElement = parentElement;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('stops-screen-wrapper');
        this.parentElement.appendChild(this.wrapper);
        
        this.createToolbar();
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

    createToolbar() {
        this.toolbar = document.createElement('div');
        this.toolbar.classList.add('stops-toolbar');
        this.wrapper.appendChild(this.toolbar);

        this.sortBox = document.createElement('div');
        this.sortBox.classList.add('stops-toolbar__sort-box');
        this.sortBox.innerHTML = `
            <span class="sorb-box__label">Sort by:</span>
            <select class="stops-toolbar__sort-select">
                <option class="stops-toolbar__sort-option" value="creationTimestamp">Add order</option>
                <option class="stops-toolbar__sort-option" value="name">Name</option>
                <option class="stops-toolbar__sort-option" value="audioTrackNumber">Audio</option>
                <option class="stops-toolbar__sort-option" value="radius">Radius</option>
                <option class="stops-toolbar__sort-option" value="routes">Routes</option>
            </select>
            <div class="sort-ascend-descend-indicator ascending">
                <svg class="ascending" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.00012 3V21M7.00012 21L3.00012 17M7.00012 21L11.0001 17M14.0001 21H21.0001M14.0001 15H19.0001M14.0001 9H17.0001M14.0001 3H15.0001" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg class="descending" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 3V21M7 21L3 17M7 21L11 17M14 3H21M14 9H19M14 15H17M14 21H15" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `;
        this.toolbar.appendChild(this.sortBox);

        this.sortSelect = this.sortBox.querySelector('.stops-toolbar__sort-select');
        this.sortAscendDescendBtn = this.sortBox.querySelector('.sort-ascend-descend-indicator');

        this.sortSelect.addEventListener('change', (e) => {
            this.mainApp.data.sortStops(this.sortSelect.value, this.isSortAscending());

            this.clearStopsList();
            this.mainApp.data.stops.forEach(stop => this.renderStop(stop));

            // apply filter after rerendering everything
            this.filterStops(this.searchInput.value);
        });
        
        this.sortAscendDescendBtn.addEventListener('click', (e) => {
            if(this.sortAscendDescendBtn.classList.contains('ascending')) {
                this.sortAscendDescendBtn.classList.remove('ascending');
                this.sortAscendDescendBtn.classList.add('descending');
            } else {
                this.sortAscendDescendBtn.classList.remove('descending');
                this.sortAscendDescendBtn.classList.add('ascending');
            }

            this.mainApp.data.sortStops(this.sortSelect.value, this.isSortAscending());

            this.clearStopsList();
            this.mainApp.data.stops.forEach(stop => this.renderStop(stop));
            
            // apply filter after rerendering everything
            this.filterStops(this.searchInput.value);
        });

        this.searchContainer = document.createElement('div');
        this.searchContainer.classList.add('stops-toolbar__search-container');
        this.searchContainer.innerHTML = `
            <input type="text" class="stops-toolbar__search-input" placeholder="Search by id, name, coordinates, audio, radius"/>
        `;
        this.toolbar.appendChild(this.searchContainer);
        this.searchInput = this.searchContainer.querySelector('.stops-toolbar__search-input');
        this.searchInput.addEventListener('input', (e) => {
            this.filterStops(this.searchInput.value);
        });

        this.addNewStopButton = document.createElement('button');
        this.addNewStopButton.classList.add('button', 'stops-toolbar__add-new-stop');
        this.addNewStopButton.textContent = 'Add new stop';
        this.toolbar.appendChild(this.addNewStopButton);

        this.stopsShownContainer = document.createElement('div');
        this.stopsShownContainer.classList.add('stops-list__stops-shown-container');
        this.stopsShownContainer.innerHTML = `
            <span class="stops-shown-text">
                showing <span class="stops-shown"></span>/</span><span class="stops-total"></span> stops`;
        this.stopsShownText = this.stopsShownContainer.querySelector('.stops-shown-text');
        this.stopsShownSpan = this.stopsShownContainer.querySelector('.stops-shown');
        this.stopsTotalSpan = this.stopsShownContainer.querySelector('.stops-total');
        this.toolbar.appendChild(this.stopsShownContainer);
    }

    isSortAscending() {
        if(this.sortAscendDescendBtn.classList.contains('ascending')) {
            return true;
        } else {
            return false;
        }
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
        this.stopsTotalSpan.textContent = 0;
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

    filterStops(term) {
        if(term === '') {
            this.stopsShownText.style.display = 'none';
            [...this.stopsListBody.querySelectorAll(`.stops-list__row`)].forEach((row) => {
                row.style.display = '';
            });
            return;
        }

        this.stopsShownText.style.display = 'inline-block';
        this.stopsShownSpan.textContent = 0;

        const lowerTerm = term.toLowerCase();
        this.mainApp.data.stops.forEach((item) => {
            const row = this.stopsListBody.querySelector(`.stops-list__row[data-stop-id="${item.id}"]`);
            const matches = Object.values(item)
                .some(val => String(val).toLowerCase().includes(lowerTerm));
            if(matches) {
                row.style.display = '';
                this.stopsShownSpan.textContent++;
            } else {
                row.style.display = 'none';
            }
        });
    }

    renderStop(stop) {
        if(+this.stopsListBody.dataset.numberOfStops === 0) {
            this.hideNoStopsMessage();
            this.stopsListBody.dataset.numberOfStops = 1;
            this.stopsTotalSpan.textContent = 1;
        } else {
            this.stopsListBody.dataset.numberOfStops++;
            this.stopsTotalSpan.textContent++;
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
                <span class="routes-cell__count">${stop.routes.length}</span>
                <span class="show-routes">show</span>
            </div>
        `;
        this.stopsListBody.appendChild(row);
    }

    rerenderStop(stopId) {
        const stopRow = this.stopsListBody.querySelector(`.stops-list__row[data-stop-id="${stopId}"]`);

        const stop = this.mainApp.data.getStopById(stopId);
        stopRow.innerHTML = `
            <div class="name-cell">${stop.name}</div>
            <div class="coords-cell">
                <span>Lat: ${stop.lat.toFixed(5)}</span>
                <span>Lon: ${stop.lon.toFixed(5)}</span>
            </div>
            <div class="audio-cell">${stop.audioTrackNumber}</div>
            <div class="radius-cell">${stop.radius}</div>
            <div class="routes-cell">
                <span class="routes-cell__count">${stop.routes.length}</span>
                <span class="show-routes">show</span>
            </div>
        `;
    }

    updateStopRouteCount(stopId) {
        if(stopId === '0') return;
        
        const stop = this.mainApp.data.getStopById(stopId);
        if(!stop) {
            console.error("Can't update stop's routes count. Stop not found.")
            return;
        }

        const stopRow = this.stopsListBody.querySelector(`.stops-list__row[data-stop-id="${stopId}"] .routes-cell__count`).textContent = stop.routes.length;
    }

    scrollToStop(stopId) {
        const stopRow = this.stopsListBody.querySelector(`.stops-list__row[data-stop-id="${stopId}"]`);

        stopRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    deleteStop(stopId) {
        const stop = this.mainApp.data.getStopById(stopId);
        const currentlyRenderedRouteId = this.mainApp.routesScreen.routeInput.dataset.routeId;
        const deletedStopInCurrentRoute = stop.routes.some((id)=>id === currentlyRenderedRouteId);
        
        if(deletedStopInCurrentRoute) { 
            // if deleted stop is in the route that's currently selected then update route stops in case there was reordering done
            this.mainApp.data.updateRouteStops(this.mainApp.routesScreen.routeInput.dataset.routeId, this.mainApp.routesScreen.getSelectedRouteStops());
        }

        // delete the stop visually 
        const stopRow = this.stopsListBody.querySelector(`.stops-list__row[data-stop-id="${stopId}"]`);
        stopRow.remove();
        this.stopsListBody.dataset.numberOfStops--;
        this.stopsTotalSpan.textContent--;

        // delete the stop from data and record restoreData
        const restoreData = this.mainApp.data.deleteStop(stopId);

        if(deletedStopInCurrentRoute) {
            // if deleted stop is in the route that's currently selected, then rerender that route (it might be better to only remove the specific stops but i'm lazy to implement that)
            this.mainApp.routesScreen.renderRoute(currentlyRenderedRouteId);
        }

        // add deleted stop to history to allow restoring
        this.mainApp.removedItemsHistory.addItem(
            `<b>Deleted:</b> ${stop.name}`,
            restoreData,
            this.restoreStop.bind(this)
        );
    }

    restoreStop(restoreData) {
        const currentlyRenderedRouteId = this.mainApp.routesScreen.routeInput.dataset.routeId;
        const deletedStopInCurrentRoute = restoreData.routes.some((route)=>route.id === currentlyRenderedRouteId);

        if(deletedStopInCurrentRoute) { 
            // if deleted stop was in the route that's currently selected then update route stops in case there was reordering or editing done
            this.mainApp.data.updateRouteStops(this.mainApp.routesScreen.routeInput.dataset.routeId, this.mainApp.routesScreen.getSelectedRouteStops());
        }

        this.mainApp.data.restoreStop(restoreData);

        // sort stops after restoring
        this.mainApp.data.sortStops(this.sortSelect.value, this.isSortAscending());
        this.clearStopsList();
        this.mainApp.data.stops.forEach(stop => this.renderStop(stop));
        this.scrollToStop(restoreData.id);

        if(deletedStopInCurrentRoute) {
            // if deleted stop was in the route that's currently selected, then rerender that route (it might be better to modify/add the specific stops but i'm lazy to implement that)
            this.mainApp.routesScreen.renderRoute(currentlyRenderedRouteId);
        }
    }

    clearStopsList() {
        this.stopsListBody.innerHTML = '';
        this.stopsListBody.dataset.numberOfStops = 0;
        this.stopsTotalSpan.textContent = 0;
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
        this.mainApp.currentPopUp = 'routesInfo';
        this.routesInfoHeader.textContent = stop.name;
        this.routesInfoHeader.title = stop.name;
        this.routesInfoList.innerHTML = '';
        stop.routes.forEach(routeId => {
            const li = document.createElement('li');
            li.textContent = this.mainApp.data.getRouteById(routeId).name;
            this.routesInfoList.appendChild(li);
        });

        const infoRect = this.routesInfoContainer.getBoundingClientRect();
        const right = buttonRect.right - infoRect.width + 5;
        const top = buttonRect.bottom;

        this.routesInfoContainer.style.top = top + 'px';
        this.routesInfoContainer.style.left = right + 'px';

        this.routesInfoContainer.style.opacity = '1';
        this.routesInfoContainer.style.pointerEvents = 'all';
        this.routesInfoContainer.style.transform = 'translate(0, 0)';
    }

    hideStopRoutesInfo(event) {
        this.routesInfoContainer.style.opacity = '0';
        this.routesInfoContainer.style.pointerEvents = 'none';
        this.routesInfoContainer.style.transform = 'translate(10px, -5px)';
        this.mainApp.currentPopUp = null;
    }
}