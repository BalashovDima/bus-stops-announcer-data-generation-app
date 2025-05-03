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

        this.createRouteStopSelect();
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
        this.addRouteStopBtn.addEventListener('click', (e) => {
            this.addRouteStopRow(['0', '0']);
            this.routesContentContainer.scrollTo({ top: this.routesContentContainer.scrollHeight, behavior: 'smooth' });
        });

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
        this.createNewRouteBtn.addEventListener('click', this.startNewRouteCreation.bind(this));

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
        this.editRouteBtn.addEventListener('click', this.startRouteEdit.bind(this));
        
        this.deleteRouteBtn = document.createElement('button');
        this.deleteRouteBtn.classList.add('icon-button', 'delete-route-btn');
        this.deleteRouteBtn.title = 'Delete selected route';
        this.deleteRouteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        this.routeControls.appendChild(this.deleteRouteBtn);
        this.deleteRouteBtn.addEventListener('click', this.deleteSelectedRoute.bind(this));

        this.addEditRouteContainer = document.createElement('div');
        this.addEditRouteContainer.classList.add('add-edit-route__container');
        this.routeControls.appendChild(this.addEditRouteContainer);

        this.addEditRouteDisplayNumber = document.createElement('input');
        this.addEditRouteDisplayNumber.classList.add('add-edit-route__display-number');
        this.addEditRouteDisplayNumber.setAttribute('type', 'number');
        this.addEditRouteDisplayNumber.setAttribute('placeholder', '#');
        this.addEditRouteContainer.appendChild(this.addEditRouteDisplayNumber);
        this.addEditRouteDisplayNumber.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addEditRouteInput.focus();
            } else if (e.key === 'Escape') {
                this.cancelAddEditRouteBtn.click();
            }
        });

        this.addEditRouteInput = document.createElement('input');
        this.addEditRouteInput.classList.add('add-edit-route__input');
        this.addEditRouteInput.setAttribute('type', 'text');
        this.addEditRouteInput.setAttribute('placeholder', 'Enter route name');
        this.addEditRouteContainer.appendChild(this.addEditRouteInput);
        this.addEditRouteInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.confirmAddEditRouteBtn.click();
            } else if (e.key === 'Escape') {
                this.cancelAddEditRouteBtn.click();
            }
        });

        this.confirmAddEditRouteBtn = document.createElement('button');
        this.confirmAddEditRouteBtn.classList.add('icon-button', 'add-edit-route__confirm-btn');
        this.confirmAddEditRouteBtn.title = 'Confirm';
        this.confirmAddEditRouteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
            <polyline points="3.7 14.3 9.6 19 20.3 5" fill="none"  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </g>
        </svg>`;
        this.routeControls.appendChild(this.confirmAddEditRouteBtn);
        this.confirmAddEditRouteBtn.addEventListener('click', (e) => {
            let displayNumber = this.addEditRouteDisplayNumber.value;
            displayNumber = displayNumber === '' ? false : Number(displayNumber);
            const name = this.addEditRouteInput.value;
            if(!displayNumber || name === '') {
                this.addEditRouteContainer.classList.add('error');
                return;
            }

            if(this.addEditRouteInput.dataset.routeId === 'new') {
                const routeId = this.mainApp.data.addNewRoute(displayNumber, name);
                this.addRouteToList(this.mainApp.data.getRouteById(routeId)).click();
                this.cancelAddEditRouteBtn.click();
            } else {
                const routeOptionElement = this.routeSelectList.querySelector(`.route-select-option[data-route-id="${this.addEditRouteInput.dataset.routeId}"]`);
                routeOptionElement.querySelector('.route-select-option__display-number').textContent = displayNumber;
                routeOptionElement.querySelector('.route-select-option__name').textContent = name;
                this.routeInput.value = name;
                this.routeDisplayNumber.textContent = displayNumber;

                this.mainApp.data.editRoute(this.addEditRouteInput.dataset.routeId, displayNumber, name);
                this.cancelAddEditRouteBtn.click();
            }
        });
        
        this.cancelAddEditRouteBtn = document.createElement('button');
        this.cancelAddEditRouteBtn.classList.add('icon-button', 'add-edit-route__cancel-btn');
        this.cancelAddEditRouteBtn.title = 'Cancel';
        this.cancelAddEditRouteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L6.53035 18.5303C6.23745 18.8232 5.76258 18.8232 5.46969 18.5303C5.17679 18.2374 5.17679 17.7626 5.46968 17.4697L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967Z"/>
        </svg>`;
        this.routeControls.appendChild(this.cancelAddEditRouteBtn);
        this.cancelAddEditRouteBtn.addEventListener('click', (e) => {
            this.routeControls.classList.remove('edit');
        });
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
            this.removeEmptyStopRows();
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

    addRouteToList(route, insertIndex = -1) {
        if(+this.routeSelectList.dataset.numberOfRoutes === 0) {
            this.routeInput.setAttribute('placeholder', 'Select Route');
            this.routeSelectList.dataset.numberOfRoutes = 1;
            insertIndex = -1;
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

        if(insertIndex === -1) {
            this.routeSelectList.appendChild(option);
        } else {
            const sibling = this.routeSelectList.children[insertIndex];
            if (sibling) {
                this.routeSelectList.insertBefore(option, sibling);
            } else {
                this.routeSelectList.appendChild(option); 
            }
        }

        return option;
    }

    clearRoutesList() {
        this.routeSelectList.innerHTML = '';
        this.routeSelectList.dataset.numberOfRoutes = 0;
        this.routeInput.setAttribute('placeholder', 'No routes available');
        this.routeInput.value = '';
        this.routeDisplayNumber.textContent = '#';
        delete this.routeInput.dataset.routeId;
    }

    deleteSelectedRoute() {
        const routeId = this.getSelectedRouteId();
        this.mainApp.data.updateRouteStops(routeId, this.getSelectedRouteStops());

        this.routeSelectList.querySelector(`.route-select-option[data-route-id="${routeId}"]`).remove();
        this.routeSelectList.dataset.numberOfRoutes--;
        this.routeInput.value = '';
        this.routeDisplayNumber.textContent = '#';
        delete this.routeInput.dataset.routeId;
        
        this.clearRouteContentStops();

        const route = this.mainApp.data.deleteRoute(routeId);
        [...new Set(route.stops.flat())].forEach(stopId => this.mainApp.stopsScreen.updateStopRouteCount(stopId));

        this.mainApp.removedItemsHistory.addItem(
            `<b>Deleted route:</b> ${route.name}`,
            route,
            this.restoreRoute.bind(this)
        );
    }

    restoreRoute(restoreData) {
        const routeSelectOption = this.addRouteToList(restoreData, restoreData.insertIndex);
        this.mainApp.data.restoreRoute(restoreData);

        [...new Set(restoreData.stops.flat())].forEach(stopId => this.mainApp.stopsScreen.updateStopRouteCount(stopId));

        routeSelectOption.click();
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

    createRouteStopSelect() {
        this.routeStopSelectContainer = document.createElement('div');
        this.routeStopSelectContainer.classList.add('route-stop-select__container');
        this.wrapper.appendChild(this.routeStopSelectContainer);

        this.routeStopSelectInput = document.createElement('input');
        this.routeStopSelectInput.classList.add('route-stop-select__input');
        this.routeStopSelectInput.setAttribute('type', 'text');
        this.routeStopSelectInput.setAttribute('placeholder', 'Enter stop ID');
        this.routeStopSelectContainer.appendChild(this.routeStopSelectInput);


        this.routeStopSelectPaste = document.createElement('button');
        this.routeStopSelectPaste.classList.add('icon-button', 'route-stop-select__paste');
        this.routeStopSelectPaste.title = 'Paste';
        this.routeStopSelectPaste.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C11.2347 0 10.6293 0.125708 10.1567 0.359214C9.9845 0.44429 9.82065 0.544674 9.68861 0.62717L9.59036 0.688808C9.49144 0.751003 9.4082 0.803334 9.32081 0.853848C9.09464 0.984584 9.00895 0.998492 9.00053 0.999859C8.99983 0.999973 9.00019 0.999859 9.00053 0.999859C7.89596 0.999859 7 1.89543 7 3H6C4.34315 3 3 4.34315 3 6V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V6C21 4.34315 19.6569 3 18 3H17C17 1.89543 16.1046 1 15 1C15.0003 1 15.0007 1.00011 15 1C14.9916 0.998633 14.9054 0.984584 14.6792 0.853848C14.5918 0.80333 14.5086 0.751004 14.4096 0.688804L14.3114 0.62717C14.1793 0.544674 14.0155 0.44429 13.8433 0.359214C13.3707 0.125708 12.7653 0 12 0ZM16.7324 5C16.3866 5.5978 15.7403 6 15 6H9C8.25972 6 7.61337 5.5978 7.26756 5H6C5.44772 5 5 5.44772 5 6V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V6C19 5.44772 18.5523 5 18 5H16.7324ZM11.0426 2.15229C11.1626 2.09301 11.4425 2 12 2C12.5575 2 12.8374 2.09301 12.9574 2.15229C13.0328 2.18953 13.1236 2.24334 13.2516 2.32333L13.3261 2.37008C13.43 2.43542 13.5553 2.51428 13.6783 2.58539C13.9712 2.75469 14.4433 3 15 3V4H9V3C9.55666 3 10.0288 2.75469 10.3217 2.58539C10.4447 2.51428 10.57 2.43543 10.6739 2.37008L10.7484 2.32333C10.8764 2.24334 10.9672 2.18953 11.0426 2.15229Z"/>
            </svg>`;
        this.routeStopSelectContainer.appendChild(this.routeStopSelectPaste);

        this.routeStopSelectConfirm = document.createElement('button');
        this.routeStopSelectConfirm.classList.add('icon-button', 'route-stop-select__confirm');
        this.routeStopSelectConfirm.title = 'Confirm';
        this.routeStopSelectConfirm.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g id="Complete">
                <g id="tick">
                <polyline points="3.7 14.3 9.6 19 20.3 5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
                </g>
            </g>
            </svg>`;
        this.routeStopSelectContainer.appendChild(this.routeStopSelectConfirm);

        this.routeStopSelectText = document.createElement('span');
        this.routeStopSelectText.classList.add('route-stop-select__text');
        this.routeStopSelectContainer.appendChild(this.routeStopSelectText);

        
        this.routeStopSelectInput.addEventListener('input', () => {
            const stop = this.mainApp.data.getStopById(this.routeStopSelectInput.value.trim());

            if(stop) {
                this.routeStopSelectText.style.display = 'block';
                this.routeStopSelectText.textContent = stop.name;
                this.routeStopSelectText.classList.remove('error');
            } else {
                this.routeStopSelectText.style.display = 'none';
            }
        });

        this.routeStopSelectPaste.addEventListener('click', () => {
            navigator.clipboard.readText().then(text => {
                this.routeStopSelectInput.value = text;
                this.routeStopSelectInput.dispatchEvent(new Event('input', { bubbles: true }));
            }).catch(err => {
                console.error('Failed to read clipboard: ', err);
            });
        });

        this.routeStopSelectConfirm.addEventListener('click', () => {
            const stop = this.mainApp.data.getStopById(this.routeStopSelectInput.value.trim());

            if(stop) {
                this.setRouteStop(this.routeStopSelectTarget, stop.id, stop);

                this.hideRouteStopSelect();
            } else {
                this.routeStopSelectText.style.display = 'block';
                this.routeStopSelectText.textContent = 'Stop with this ID not found';
                this.routeStopSelectText.classList.add('error');
            }
        });
    }

    startNewRouteCreation() {
        this.routeControls.classList.add('edit');
        this.addEditRouteContainer.classList.remove('error');

        this.addEditRouteInput.value = '';
        this.addEditRouteInput.dataset.routeId = 'new';
        this.addEditRouteDisplayNumber.value = '';
        
        this.addEditRouteDisplayNumber.focus();
    }

    startRouteEdit() {
        this.routeControls.classList.add('edit');
        this.addEditRouteContainer.classList.remove('error');

        const route = this.mainApp.data.getRouteById(this.getSelectedRouteId());
        this.addEditRouteInput.value = route.name;
        this.addEditRouteInput.dataset.routeId = route.id;
        this.addEditRouteDisplayNumber.value = route.displayNumber;
        
        this.addEditRouteDisplayNumber.focus();
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

    showRouteStopSelect(target) {
        this.mainApp.currentPopUp = 'routeStopSelect';
        this.routeStopSelectTarget = target.closest('.route-stop');
        const routeStopRect = this.routeStopSelectTarget.getBoundingClientRect();
        
        this.routeStopSelectContainer.style.bottom = window.innerHeight - (routeStopRect.bottom - routeStopRect.height / 2 - 7) + 'px';
        this.routeStopSelectContainer.style.left = routeStopRect.left + routeStopRect.width / 2 + 'px';
        
        this.routeStopSelectText.style.display = 'none';
        this.routeStopSelectInput.value = '';
        this.routeStopSelectContainer.style.opacity = '1';
        this.routeStopSelectContainer.style.pointerEvents = 'all';
        this.routeStopSelectContainer.style.transform = 'translate(-50%, 0)';
        this.routeStopSelectInput.focus();
    }

    hideRouteStopSelect() {
        this.routeStopSelectTarget.classList.remove('highlight-by-context-menu');
        this.routeStopSelectContainer.style.opacity = '0';
        this.routeStopSelectContainer.style.pointerEvents = 'none';
        this.routeStopSelectContainer.style.transform = 'translate(-50%, 20px)';
        this.mainApp.currentPopUp = null;
    }

    setRouteStop(target, stopId, stopData = null) {
        let stop;
        if(!stopData) {
            stop = this.mainApp.getStopById(stopId);
        } else {
            stop = stopData;
        }
        
        const routeStop = target.closest('.route-stop');

        routeStop.dataset.stopId = stop.id;
        routeStop.textContent = stop.name;
        routeStop.classList.remove('route-stop__no-stop');

        // save added stop to data object
        this.mainApp.data.updateRouteStops(this.getSelectedRouteId(), this.getSelectedRouteStops());

        const route = this.mainApp.data.getRouteById(this.getSelectedRouteId());

        // check if the added stop was used in the route before 
        let count = 0;
        for (const [steId, etsId] of route.stops) {
            if (steId === stop.id || etsId === stop.id) {
                count++;
                if (count > 1) return; // early exit, no need to add this route to that stop's 'used in routes' list
            }
        }

        // add route to the stop's routes list 
        this.mainApp.data.addRouteToStop(stop.id, this.getSelectedRouteId());
        this.mainApp.stopsScreen.updateStopRouteCount(stop.id);
    }

    removeRouteStop(target) {
        const ste = target.closest('.route-stop__ste-stop');
        const ets = target.closest('.route-stop__ets-stop');
        let removedStopId = null;
        let removedStopName = 'error';

        if(ste) { // if stop is 'start-to-end' stop
            removedStopId = ste.dataset.stopId;
            const row = ste.closest('.route-stop__row'); // get the row div the stop is in
            if(row.querySelector('.route-stop__ets-stop').dataset.stopId === '0') {
                // if the there is no 'end-to-start' stop in the row, then remove the row as it's empty
                row.remove();
                removedStopName = ste.textContent;
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
                removedStopName = ets.textContent;
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
            copyButton
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
        });

        return routeStopsData;
    }

    getSelectedRouteId() {
        return this.routeInput.dataset.routeId;
    }

    removeEmptyStopRows() {
        const rows = this.routesContentBody.querySelectorAll('.route-stop__row');

        for(let i = 0; i < rows.length; i++) {
            if(rows[i].querySelector('.route-stop__ste-stop').dataset.stopId === '0') {
                if(rows[i].querySelector('.route-stop__ets-stop').dataset.stopId === '0') {
                    rows[i].remove();
                }
            }
        }
    }
}