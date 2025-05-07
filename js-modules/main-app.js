import Data from './data.js';
import StopsScreen from './stops-screen.js';
import RoutesScreen from './routes-screen.js';
import ContextMenu from './context-menu.js';
import AddEditInfoStop from './add-edit-info-stop.js';
import RemovedItemsHistory from './removed-items-history.js';

export default class MainApp {
    constructor(rootElement) { 
        window.app = this;
        this.data = new Data();
        this.contextMenu = new ContextMenu(this);

        rootElement.addEventListener('contextmenu', this.contextMenu.handleRightClick.bind(this.contextMenu));

        this.rootElement = rootElement;

        this.createControls();
        this.stopsScreen = new StopsScreen(this, this.rootElement);
        this.routesScreen = new RoutesScreen(this, this.rootElement);
        this.routesScreen.hide();
        this.addEditInfoStopScreen = new AddEditInfoStop(this);
        this.removedItemsHistory = new RemovedItemsHistory(this);

        this.stopsScreen.addNewStopButton.addEventListener('click', this.addEditInfoStopScreen.startNewStopCreation.bind(this.addEditInfoStopScreen));
        
        this.data.readFromFile("./example-data.json").then(() => {
            this.stopsScreen.sortSelect.value = this.data.sortCriteria;
            if(this.data.sortIsAscending) {
                this.stopsScreen.sortAscendDescendBtn.classList.add('ascending');
                this.stopsScreen.sortAscendDescendBtn.classList.remove('descending');
            } else {
                this.stopsScreen.sortAscendDescendBtn.classList.remove('ascending');
                this.stopsScreen.sortAscendDescendBtn.classList.add('descending');
            }

            this.data.stops.forEach(stop => this.stopsScreen.renderStop(stop));

            this.data.routes.forEach(route => this.routesScreen.addRouteToList(route));
        });

        this.routesButton.click();
        setTimeout(selectFourthRoute.bind(this), 10);

        function selectFourthRoute() {
            setTimeout(() => {
                if(this.routesScreen.routeSelectList.childNodes[3]) {
                    this.routesScreen.routeSelectList.childNodes[3].click();
                } else {
                    selectFourthRoute();
                }
            }, 200);
        }

        document.addEventListener('mousedown', (event) => {
            if(this.currentPopUp) {
                switch (this.currentPopUp) {
                    case 'contextMenu':
                        if(!this.contextMenu.contextMenuContainer.contains(event.target)) {
                            this.contextMenu.hideContextMenu();
                        }
                        break;
                    case 'routesInfo':
                        if(!this.stopsScreen.routesInfoContainer.contains(event.target)) {
                            this.stopsScreen.hideStopRoutesInfo();
                        }
                        break;
                    case 'routeSelect':
                        if(!this.routesScreen.routesSelectContainer.contains(event.target)) {
                            this.routesScreen.hideDropdown();
                        }
                        break;
                    case 'routeStopSelect':
                        if(!this.routesScreen.routeStopSelectContainer.contains(event.target)) {
                            this.routesScreen.hideRouteStopSelect();
                        }
                        break;
                    case 'newOrEditStop':
                        if(!this.addEditInfoStopScreen.container.contains(event.target)) {
                            this.addEditInfoStopScreen.cancelButton.click();
                        }
                        break;
                    case 'stopInfo':
                        if(!this.addEditInfoStopScreen.container.contains(event.target)) {
                            this.addEditInfoStopScreen.closeButton.click();
                        }
                        break;
                }
            }
        });

        window.addEventListener("scroll", (event) => {
            if(this.currentPopUp) {
                switch (this.currentPopUp) {
                    case 'contextMenu':
                        if(!this.contextMenu.contextMenuContainer.contains(event.target)) {
                            this.contextMenu.hideContextMenu();
                        }
                        break;
                    case 'routesInfo':
                        if(!this.stopsScreen.routesInfoContainer.contains(event.target)) {
                            this.stopsScreen.hideStopRoutesInfo();
                        }
                        break;
                    case 'routeSelect':
                        if(!this.routesScreen.routesSelectContainer.contains(event.target)) {
                            this.routesScreen.hideDropdown();
                        }
                        break;
                    case 'routeStopSelect':
                        if(!this.routesScreen.routeStopSelectContainer.contains(event.target)) {
                            this.routesScreen.hideRouteStopSelect();
                        }
                        break;
                }
            }
        }, true);
    }

    createControls() {
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.classList.add('controls-container');
        this.createStopsAndRoutesSwitch(this.controlsContainer);
        this.rootElement.appendChild(this.controlsContainer);

        this.fileControls = document.createElement('div');
        this.fileControls.classList.add('file-controls');
        this.controlsContainer.appendChild(this.fileControls);
        this.fileControls.innerHTML = `
            <button id="open-file" class="file-control__icon icon-button">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 9.50195V8.74985C20 7.50721 18.9926 6.49985 17.75 6.49985H12.0247L9.64368 4.51995C9.23959 4.18393 8.73063 3.99997 8.20509 3.99997H4.24957C3.00724 3.99997 2 5.00686 1.99957 6.24919L1.99561 17.7492C1.99518 18.9921 3.00266 20 4.24561 20H4.27196C4.27607 20 4.28019 20 4.28431 20H18.4693C19.2723 20 19.9723 19.4535 20.167 18.6745L21.9169 11.6765C22.1931 10.5719 21.3577 9.50195 20.2192 9.50195H20ZM4.24957 5.49997H8.20509C8.38027 5.49997 8.54993 5.56129 8.68462 5.6733L11.2741 7.82652C11.4088 7.93852 11.5784 7.99985 11.7536 7.99985H17.75C18.1642 7.99985 18.5 8.33563 18.5 8.74985V9.50195H6.42385C5.39136 9.50195 4.49137 10.2047 4.241 11.2064L3.49684 14.1837L3.49957 6.24971C3.49971 5.8356 3.83546 5.49997 4.24957 5.49997ZM5.69623 11.5701C5.77969 11.2362 6.07969 11.002 6.42385 11.002H20.2192C20.3819 11.002 20.5012 11.1548 20.4617 11.3126L18.7119 18.3107C18.684 18.4219 18.584 18.5 18.4693 18.5H4.28431C4.12167 18.5 4.00233 18.3472 4.04177 18.1894L5.69623 11.5701Z" />
                </svg>
            </button>
            <button id="save-file" class="file-control__icon icon-button">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5.75C3 4.23122 4.23122 3 5.75 3H15.7145C16.5764 3 17.4031 3.34241 18.0126 3.9519L20.0481 5.98744C20.6576 6.59693 21 7.42358 21 8.28553V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM5.75 4.5C5.05964 4.5 4.5 5.05964 4.5 5.75V18.25C4.5 18.9404 5.05964 19.5 5.75 19.5H6V14.25C6 13.0074 7.00736 12 8.25 12H15.75C16.9926 12 18 13.0074 18 14.25V19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V8.28553C19.5 7.8214 19.3156 7.37629 18.9874 7.0481L16.9519 5.01256C16.6918 4.75246 16.3582 4.58269 16 4.52344V7.25C16 8.49264 14.9926 9.5 13.75 9.5H9.25C8.00736 9.5 7 8.49264 7 7.25V4.5H5.75ZM16.5 19.5V14.25C16.5 13.8358 16.1642 13.5 15.75 13.5H8.25C7.83579 13.5 7.5 13.8358 7.5 14.25V19.5H16.5ZM8.5 4.5V7.25C8.5 7.66421 8.83579 8 9.25 8H13.75C14.1642 8 14.5 7.66421 14.5 7.25V4.5H8.5Z" />
                </svg>
            </button>
        `;
        this.openFileButton = this.fileControls.querySelector('#open-file');
        this.saveFileButton = this.fileControls.querySelector('#save-file');

        this.generateCodeButton = document.createElement('button');
        this.generateCodeButton.textContent = 'generate code';
        this.generateCodeButton.classList.add('generate-code-button');
        this.controlsContainer.appendChild(this.generateCodeButton);

        this.openFileButton.addEventListener('click', this.openFile.bind(this));
        this.saveFileButton.addEventListener('click', () => {
            // if a route is selected, then update route stops in case changes were made (like reordering)
            if(this.routesScreen.routeInput.hasAttribute('data-route-id')) {
                this.data.updateRouteStops(this.routesScreen.routeInput.dataset.routeId, this.routesScreen.getSelectedRouteStops());
            }
            const filename = prompt('Enter filename:', 'bus-stops-anouncer-data.json');
            if(filename === null) return;
            this.data.saveToFile(filename);
        });
    }

    async openFile() {
        try {
            const [fileHandle] = await window.showOpenFilePicker();
            const file = await fileHandle.getFile();
            
            this.data.readFromFile(file).then(() => {
                this.stopsScreen.sortSelect.value = this.data.sortCriteria;
                if(this.data.sortIsAscending) {
                    this.stopsScreen.sortAscendDescendBtn.classList.add('ascending');
                    this.stopsScreen.sortAscendDescendBtn.classList.remove('descending');
                } else {
                    this.stopsScreen.sortAscendDescendBtn.classList.remove('ascending');
                    this.stopsScreen.sortAscendDescendBtn.classList.add('descending');
                }

                this.stopsScreen.clearStopsList();
                this.routesScreen.clearRoutesList();
                this.routesScreen.clearRouteContentStops();

                this.data.stops.forEach(stop => this.stopsScreen.renderStop(stop));
                this.data.routes.forEach(stop => this.routesScreen.addRouteToList(stop));
            });

        } catch (err) {
            console.error("File selection cancelled or error:", err);
        }
    }

    createStopsAndRoutesSwitch(parentElement) {
        // switching between stops and routes
        this.stopsAndRoutesSwitch = document.createElement('div');
        this.stopsAndRoutesSwitch.classList.add('stops-and-routes-switch');
        parentElement.appendChild(this.stopsAndRoutesSwitch);

        this.stopsButton = document.createElement('button');
        this.stopsButton.textContent = 'Stops';
        this.stopsButton.classList.add('switch-button', 'active');
        this.stopsAndRoutesSwitch.appendChild(this.stopsButton);

        this.routesButton = document.createElement('button');
        this.routesButton.textContent = 'Routes';
        this.routesButton.classList.add('switch-button');
        this.stopsAndRoutesSwitch.appendChild(this.routesButton);

        const switchIndicator = document.createElement('div');
        switchIndicator.classList.add('switch-indicator');
        this.stopsAndRoutesSwitch.appendChild(switchIndicator);

        this.stopsButton.addEventListener('click', () => {
            this.routesButton.classList.remove('active');
            this.stopsButton.classList.add('active');
            switchIndicator.style.transform = `translateX(70%)`;

            this.stopsScreen.show();
            this.routesScreen.hide();
        });

        this.routesButton.addEventListener('click', () => {
            this.stopsButton.classList.remove('active');
            this.routesButton.classList.add('active');
            switchIndicator.style.transform = `translateX(315%)`;

            this.routesScreen.show();
            this.stopsScreen.hide();
        });
    }
}