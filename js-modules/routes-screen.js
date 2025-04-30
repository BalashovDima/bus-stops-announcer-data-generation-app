import ReorderContainer from './reorder-container.js'

export default class RoutesScreen {
    constructor(mainAppInstance, parentElement) {
        this.mainApp = mainAppInstance;
        this.parentElement = parentElement;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('routes-screen-wrapper');
        this.parentElement.appendChild(this.wrapper);
        
        this.createRouteControls();
        this.createRoutesContent();
    }

    createRouteControls() {
        this.routeControls = document.createElement('div');
        this.routeControls.classList.add('route-controls');
        this.wrapper.appendChild(this.routeControls);

        this.addRouteStopBtn = document.createElement('button');
        this.addRouteStopBtn.classList.add('button', 'add-route-stop-btn');
        this.addRouteStopBtn.title = 'Add stop to the selected route';
        this.addRouteStopBtn.textContent = 'Add stop';
        this.routeControls.appendChild(this.addRouteStopBtn);

        this.createRouteSelect();
        this.routeControls.appendChild(this.routesSelectContainer);
        
        this.createNewRouteBtn = document.createElement('button');
        this.createNewRouteBtn.classList.add('icon-button', 'create-new-route-btn');
        this.createNewRouteBtn.title = 'Create new route';
        this.createNewRouteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke-linecap="round"/>
            <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke-linecap="round"/>
        </svg>`;
        this.routeControls.appendChild(this.createNewRouteBtn);

        this.editRouteBtn = document.createElement('button');
        this.editRouteBtn.classList.add('icon-button', 'edit-route-btn');
        this.editRouteBtn.title = 'Edit selected route';
        this.editRouteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 21H21" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.0651 7.39423L7.09967 20.4114C6.72438 20.7882 6.21446 21 5.68265 21H4.00383C3.44943 21 3 20.5466 3 19.9922V18.2987C3 17.7696 3.20962 17.2621 3.58297 16.8873L16.5517 3.86681C19.5632 1.34721 22.5747 4.87462 20.0651 7.39423Z" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.3097 5.30981L18.7274 8.72755" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        this.routeControls.appendChild(this.editRouteBtn);
        
        this.deleteRouteBtn = document.createElement('button');
        this.deleteRouteBtn.classList.add('icon-button', 'delete-route-btn');
        this.deleteRouteBtn.title = 'Delete selected route';
        this.deleteRouteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        this.routeControls.appendChild(this.deleteRouteBtn);
    }

    createRouteSelect() {
        // div.routes-select-container
        //      div.selected-route-container
        //          input.route-input
        //          button.route-select-arrow
        //      div
        //      ul.route-select-list
        //          li.route-select-option
        //          .......
        //          li.route-select-option
        //      ul
        // div
        this.routesSelectContainer = document.createElement('div');
        this.routesSelectContainer.classList.add('routes-select-container');

        this.selectedRouteContainer = document.createElement('div');
        this.selectedRouteContainer.classList.add('selected-route-container', 'route-select-grid-layout');
        this.routesSelectContainer.appendChild(this.selectedRouteContainer);

        this.routeDisplayNumber = document.createElement('span');
        this.routeDisplayNumber.classList.add('route-display-number');
        this.routeDisplayNumber.title = 'Route display number';
        this.selectedRouteContainer.appendChild(this.routeDisplayNumber);

        this.routeInput = document.createElement('input');
        this.routeInput.classList.add('selected-route-input');
        this.routeInput.setAttribute('type', 'text');
        this.routeInput.setAttribute('placeholder', 'No routes available');
        this.routeInput.readOnly = true;
        this.selectedRouteContainer.appendChild(this.routeInput);

        this.routeSelectArrow = document.createElement('button');
        this.routeSelectArrow.classList.add('icon-button', 'route-select-arrow');
        this.routeSelectArrow.innerHTML = `
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve">
                <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"/>
            </svg> `;
        this.selectedRouteContainer.appendChild(this.routeSelectArrow);

        this.routeSelectList = document.createElement('ul');
        this.routeSelectList.classList.add('route-select-list', 'small-scrollbar', 'route-select-grid-layout');
        this.routeSelectList.dataset.numberOfRoutes = 0;
        this.routesSelectContainer.appendChild(this.routeSelectList);

        this.routeSelectArrow.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if(this.routeSelectList.classList.contains('active')) {
                this.hideDropdown();
            } else {
                this.showDropdown();
            }
        });

        this.routeSelectList.addEventListener('click', this.selectRoute.bind(this));
    }

    selectRoute(e) {
        const option = e.target.closest('.route-select-option');
        if(!option) return;

        // save stops data of previous route
        if(this.routeInput.hasAttribute('data-route-id')) {
            this.mainApp.data.updateRouteStops(this.getSelectedRouteId(), this.getSelectedRouteStops());
        }
        this.hideDropdown();

        const routeId = option.dataset.routeId;
        this.renderRoute(routeId);
    }

    renderRoute(routeId) {
        const route = this.mainApp.data.getRouteById(routeId);
        this.routeDisplayNumber.textContent = route.displayNumber;
        this.routeInput.value = route.name;
        this.routeInput.dataset.routeId = routeId;

        this.clearRouteContentStops();

        route.stops.forEach((stop) => {
            this.addRouteStopRow(stop);
        });
    }

    showDropdown() {
        this.mainApp.currentPopUp = 'routeSelect';
        this.routeSelectList.classList.add('active');
        this.routeSelectArrow.classList.add('active');
        this.selectedRouteContainer.classList.add('active');
    }

    hideDropdown() {
        this.routeSelectList.classList.remove('active');
        this.routeSelectArrow.classList.remove('active');
        this.selectedRouteContainer.classList.remove('active');
        this.mainApp.currentPopUp = null;
    }

    addRouteToList(route) {
        if(+this.routeSelectList.dataset.numberOfRoutes === 0) {
            this.routeInput.setAttribute('placeholder', 'Select Route');
            this.routeSelectList.dataset.numberOfRoutes = 1;
        } else {
            this.routeSelectList.dataset.numberOfRoutes++;
        }

        const option = document.createElement('li');
        option.classList.add('route-select-option');
        option.dataset.routeId = route.id;
        option.innerHTML = `
            <span class="route-select-option__display-number">${route.displayNumber}</span>
            <span class="route-select-option__name">${route.name}</span>
        `;
        this.routeSelectList.appendChild(option);
    }

    clearRoutesList() {
        this.routeSelectList.innerHTML = '';
        this.routeSelectList.dataset.numberOfRoutes = 0;
        this.routeInput.setAttribute('placeholder', 'No routes available');
        this.routeInput.value = '';
        delete this.routeInput.dataset.routeId;
    }

    createRoutesContent() {
        this.routesContentContainer = document.createElement('div');
        this.routesContentContainer.classList.add('routes-content__container', 'small-scrollbar');
        this.wrapper.appendChild(this.routesContentContainer);

        this.routesContentHeader = document.createElement('div');
        this.routesContentHeader.classList.add('routes-content__header', 'routes-content-grid-layout');
        this.routesContentContainer.appendChild(this.routesContentHeader);

        this.routesContentHeader.innerHTML = `
            <div class="header__number">#</div>
            <div class="header-ste">
                <div class="header-ste__svg">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 501.368 501.368" xml:space="preserve">
                    <g>
                        <g>
                            <g>
                                <path d="M120.995,255.996h248.853c54.933,0,99.52-43.093,99.52-96s-44.693-96-99.52-96H127.075
                                    c-6.08-35.84-40.853-59.627-76.693-51.84C18.275,19.089-3.485,49.809,0.462,82.343c4.48,36.48,38.4,61.44,74.24,55.467
                                    c26.88-4.587,47.893-25.6,52.48-52.48h242.773c43.093,0,78.187,33.493,78.187,74.667c0,41.173-35.093,74.667-78.187,74.667
                                    h-248.96c-54.933,0-99.627,43.093-99.627,96s44.693,96,99.52,96h173.333l-45.653,45.76c-4.267,4.053-4.373,10.88-0.213,15.04
                                    c4.16,4.16,10.88,4.373,15.04,0.213c0.107-0.107,0.213-0.213,0.213-0.213l63.893-63.893c4.16-4.16,4.16-10.88,0-15.04l-63.893-64
                                    c-4.267-4.053-10.987-3.947-15.04,0.213c-3.947,4.16-3.947,10.667,0,14.827l45.76,45.76H120.995
                                    c-43.2,0-78.293-33.493-78.293-74.667S77.795,255.996,120.995,255.996z M64.035,117.223c-23.573,0-42.667-19.093-42.667-42.667
                                    c0-23.573,19.093-42.667,42.667-42.667c23.573,0,42.667,19.093,42.667,42.667C106.702,98.129,87.608,117.223,64.035,117.223z"/>
                                <path d="M437.368,351.889c-35.307,0-64,28.693-64,64s28.693,64,64,64s64-28.693,64-64S472.782,351.996,437.368,351.889z
                                    M437.368,458.556c-23.573,0-42.667-19.093-42.667-42.667s19.093-42.667,42.667-42.667s42.667,19.093,42.667,42.667
                                    S460.942,458.556,437.368,458.556z"/>
                            </g>
                        </g>
                    </g>
                    </svg>
                    <span>start to end</span>
                </div>
                <!-- <div class="header-ste__name">Name</div> -->
            </div>

            <div class="header-ets">
                <div class="header-ets__svg">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 501.389 501.389" xml:space="preserve">
                    <g>
                        <g>
                            <g>
                                <path d="M501.12,420.818c-3.093-33.28-30.933-58.24-63.787-58.24c-31.253,0-57.813,22.613-63.04,53.333H131.52
                                    c-43.093,0-78.187-33.493-78.187-74.667s35.093-74.667,78.187-74.667h248.853c54.933,0,99.52-43.093,99.52-96
                                    s-44.693-96-99.52-96H207.04l45.76-45.76c4.053-4.267,3.947-10.987-0.213-15.04c-4.16-3.947-10.667-3.947-14.827,0l-64,64
                                    c-4.16,4.16-4.16,10.88,0,15.04l64,64c4.267,4.053,10.987,3.947,15.04-0.213c3.947-4.16,3.947-10.667,0-14.827l-45.76-45.867
                                    h173.333c43.093,0,78.187,33.493,78.187,74.667s-35.093,74.667-78.187,74.667H131.52c-54.933,0-99.52,43.093-99.52,96
                                    s44.693,96,99.52,96h242.773c5.973,35.52,40.213,59.2,75.84,52.053C481.92,482.898,504.107,453.138,501.12,420.818z
                                    M437.333,469.138c-23.573,0-42.667-19.093-42.667-42.667c0-23.573,19.093-42.667,42.667-42.667S480,402.898,480,426.471
                                    C480,450.044,460.907,469.138,437.333,469.138z"/>
                                <path d="M128,85.138c0-35.307-28.693-64-64-64c-35.307,0-64,28.693-64,64c0,35.307,28.693,64,64,64
                                    C99.307,149.138,127.893,120.551,128,85.138z M21.333,85.138c0-23.573,19.093-42.667,42.667-42.667
                                    c23.573,0,42.667,19.093,42.667,42.667c0,23.573-19.093,42.667-42.667,42.667C40.427,127.804,21.333,108.711,21.333,85.138z"/>
                            </g>
                        </g>
                    </g>
                    </svg>
                    <span>end to start</span>
                </div>
                <!-- <div class="header-ets__name">Name</div> -->
            </div>
            `;

        this.routesStopsReorder = new ReorderContainer({
            containerElementName: 'ol',
            dragHandleSelector: '.route-stop__drag-handle',
            reorderElementSelector: '.route-stop__row',

        });
        this.routesStopsReorder.enableReordering();
        this.routesContentBody = this.routesStopsReorder.element;
        this.routesContentBody.classList.add('routes-content__body', 'routes-content-grid-layout');
        this.routesContentBody.dataset.numberOfStops = 0;
        this.routesContentContainer.appendChild(this.routesContentBody);
        this.routesContentRows = [];

        this.noStopInRouteMessage = document.createElement('div');
        this.noStopInRouteMessage.classList.add('no-stop-in-route-message');
        this.noStopInRouteMessage.textContent = 'No stops in the selected route.';
        this.routesContentContainer.appendChild(this.noStopInRouteMessage);
    }

    addRouteStopRow(stops) {
        if(+this.routesContentBody.dataset.numberOfStops === 0) {
            this.hideNoStopsInRouteMessage();
            this.routesContentBody.dataset.numberOfStops = 1;
        } else {
            this.routesContentBody.dataset.numberOfStops++;
        }

        const row = document.createElement('div');
        row.classList.add('route-stop__row');
        this.routesContentBody.appendChild(row);

        const dragHandle = document.createElement('div');
        row.appendChild(dragHandle);
        dragHandle.classList.add('route-stop__drag-handle');
        dragHandle.innerHTML = `<svg viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                                <path d="M600 1440c132.36 0 240 107.64 240 240s-107.64 240-240 240-240-107.64-240-240 107.64-240 240-240Zm720 0c132.36 0 240 107.64 240 240s-107.64 240-240 240-240-107.64-240-240 107.64-240 240-240ZM600 720c132.36 0 240 107.64 240 240s-107.64 240-240 240-240-107.64-240-240 107.64-240 240-240Zm720 0c132.36 0 240 107.64 240 240s-107.64 240-240 240-240-107.64-240-240 107.64-240 240-240ZM600 0c132.36 0 240 107.64 240 240S732.36 480 600 480 360 372.36 360 240 467.64 0 600 0Zm720 0c132.36 0 240 107.64 240 240s-107.64 240-240 240-240-107.64-240-240S1187.64 0 1320 0Z" fill-rule="evenodd"/>
                            </svg>`;

        const steStop = document.createElement('div');
        steStop.classList.add('route-stop__ste-stop', 'route-stop');
        steStop.dataset.stopId = stops[0];
        if(stops[0] === '0') {
            steStop.textContent = 'No stop';
            steStop.classList.add('route-stop__no-stop', 'route-stop');
        } else {
            steStop.textContent = this.mainApp.data.getStopById(stops[0]).name;
        }
        row.appendChild(steStop);

        const etsStop = document.createElement('div');
        etsStop.classList.add('route-stop__ets-stop', 'route-stop');
        etsStop.dataset.stopId = stops[1];
        if(stops[1] === '0') {
            etsStop.textContent = 'No stop';
            etsStop.classList.add('route-stop__no-stop', 'route-stop');
        } else {
            etsStop.textContent = this.mainApp.data.getStopById(stops[1]).name;
        }
        row.appendChild(etsStop);
    }

    clearRouteContentStops() {
        this.routesContentBody.innerHTML = '';
        this.routesContentBody.dataset.numberOfStops = 0;
        this.showNoStopsInRouteMessage();
    }

    removeRouteStop(target) {
        const ste = target.closest('.route-stop__ste-stop');
        const ets = target.closest('.route-stop__ets-stop');
        let removedStopId = null;
        let removedStopName = '';

        if(ste) { // if stop is 'start-to-end' stop
            removedStopId = ste.dataset.stopId;
            const row = ste.closest('.route-stop__row'); // get the row div the stop is in
            if(row.querySelector('.route-stop__ets-stop').dataset.stopId === '0') {
                // if the there is no 'end-to-start' stop in the row, then remove the row as it's empty
                row.remove();
            } else {
                // else set the stop as empty (therefore removeing it)
                ste.dataset.stopId = '0';
                ste.classList.add('route-stop__no-stop');
                removedStopName = ste.textContent;
                ste.textContent = 'No stop';
            }
        } else if(ets) {
            removedStopId = ets.dataset.stopId;
            const row = ets.closest('.route-stop__row');
            if(row.querySelector('.route-stop__ste-stop').dataset.stopId === '0') {
                row.remove();
            } else {
                ets.dataset.stopId = '0';
                ets.classList.add('route-stop__no-stop');
                removedStopName = ets.textContent;
                ets.textContent = 'No stop';
            }
        }

        const routeStops = this.getSelectedRouteStops();
        this.mainApp.data.updateRouteStops(this.getSelectedRouteId(), routeStops);
        if(!routeStops.some((row) => {
            // some will return true if the removed stop is still in the route
            return (row[0] === removedStopId || row[1] === removedStopId);
        })) { 
            console.log('stop no longer in the route');
            // remove the route from the route list of the removed stop (if this stop is no longer in the route, if above checks it)
            this.mainApp.data.removeRouteFromStop(removedStopId, this.getSelectedRouteId());

            this.mainApp.stopsScreen.updateStopRouteCount(removedStopId);
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                            .then(() => console.log("Copied to clipboard!"))
                            .catch(err => alert("Failed to copy: " + err));
        }
        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-removed-stop-id-btn');
        copyButton.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" />
                <path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" />
            </svg>
            <span>Copy ID</span>`;
        this.mainApp.removedItemsHistory.addItem(
            `<b>Removed from route:</b> ${removedStopName}`,
            removedStopId,
            copyToClipboard,
            copyButton,
            50000
        );
    }

    hide() {
        this.wrapper.style.display = 'none';
    }

    show() {
        this.wrapper.style.display = 'flex';
    }

    hideNoStopsInRouteMessage() {
        this.noStopInRouteMessage.style.display = 'none';
    }

    showNoStopsInRouteMessage() {
        this.noStopInRouteMessage.style.display = 'flex';
    }

    getSelectedRouteStops() {
        const routeStopsData = [];

        const rows = [...this.routesContentBody.querySelectorAll('.route-stop__row')];

        rows.forEach((row) => {
            const stop = [];

            stop.push(row.querySelector('.route-stop__ste-stop').dataset.stopId);
            stop.push(row.querySelector('.route-stop__ets-stop').dataset.stopId);

            routeStopsData.push(stop);
        })

        return routeStopsData;
    }

    getSelectedRouteId() {
        return this.routeInput.dataset.routeId;
    }
}