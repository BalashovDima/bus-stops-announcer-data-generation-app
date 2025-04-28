import ReorderContainer from './reorder-container.js'

export default class RoutesScreen {
    constructor(mainAppInstance, parentElement) {
        this.mainApp = mainAppInstance;
        this.parentElement = parentElement;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('routes-screen-wrapper');
        this.parentElement.appendChild(this.wrapper);
        
        this.createRouteSelect();
        this.createRoutesContent();
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
        this.wrapper.appendChild(this.routesSelectContainer);

        this.selectedRouteContainer = document.createElement('div');
        this.selectedRouteContainer.classList.add('selected-route-container', 'route-select-grid-layout');
        this.routesSelectContainer.appendChild(this.selectedRouteContainer);

        this.routeDisplayNumber = document.createElement('span');
        this.routeDisplayNumber.classList.add('route-display-number');
        this.selectedRouteContainer.appendChild(this.routeDisplayNumber);

        this.routeInput = document.createElement('input');
        this.routeInput.classList.add('selected-route-input');
        this.routeInput.setAttribute('type', 'text');
        this.routeInput.setAttribute('placeholder', 'No routes available');
        this.routeInput.readOnly = true;
        this.selectedRouteContainer.appendChild(this.routeInput);

        this.routeSelectArrow = document.createElement('button');
        this.routeSelectArrow.classList.add('route-select-arrow');
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
            this.mainApp.data.updateRouteStops(this.routeInput.dataset.routeId, this.getSelectedRouteStops());
        }

        const routeId = option.dataset.routeId;
        const route = this.mainApp.data.getRouteById(routeId);
        this.routeDisplayNumber.textContent = route.displayNumber;
        this.routeInput.value = route.name;
        this.routeInput.dataset.routeId = routeId;
        this.hideDropdown();

        this.clearRouteContentStops();

        route.stops.forEach((stop) => {
            this.renderRouteStop(stop);
        });
    }

    showDropdown() {
        this.routeSelectList.classList.add('active');
        this.routeSelectArrow.classList.add('active');
        this.selectedRouteContainer.classList.add('active');
    }

    hideDropdown() {
        this.routeSelectList.classList.remove('active');
        this.routeSelectArrow.classList.remove('active');
        this.selectedRouteContainer.classList.remove('active');
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

    renderRouteStop(stop) {
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
        steStop.dataset.stopId = stop[0];
        if(stop[0] === '0') {
            steStop.textContent = 'No stop';
            steStop.classList.add('route-stop__no-stop', 'route-stop');
        } else {
            steStop.textContent = this.mainApp.data.getStopById(stop[0]).name;
        }
        row.appendChild(steStop);

        const etsStop = document.createElement('div');
        etsStop.classList.add('route-stop__ets-stop', 'route-stop');
        etsStop.dataset.stopId = stop[1];
        if(stop[1] === '0') {
            etsStop.textContent = 'No stop';
            etsStop.classList.add('route-stop__no-stop', 'route-stop');
        } else {
            etsStop.textContent = this.mainApp.data.getStopById(stop[1]).name;
        }
        row.appendChild(etsStop);
    }

    clearRouteContentStops() {
        this.routesContentBody.innerHTML = '';
        this.routesContentBody.dataset.numberOfStops = 0;
        this.showNoStopsInRouteMessage();
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
}