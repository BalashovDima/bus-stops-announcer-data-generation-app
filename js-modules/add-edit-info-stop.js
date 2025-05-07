export default class AddEditInfoStop {
    constructor(mainAppInstance) {
        this.mainApp = mainAppInstance;

        this.creaseBaseLayout();
        this.createUnsavedWarning();
    }

    creaseBaseLayout() {
        this.backgroundDiv = document.createElement('div');
        this.backgroundDiv.classList.add('add-edit-info__background');
        document.body.appendChild(this.backgroundDiv);

        this.container = document.createElement('div');
        this.container.classList.add('add-edit-info__container');
        this.backgroundDiv.appendChild(this.container);

        this.title = document.createElement('h2');
        this.title.classList.add('add-edit-info__title');
        this.title.innerText = 'Add new stop';
        this.container.appendChild(this.title);

        this.idContainer = document.createElement('div');
        this.idContainer.classList.add('add-edit-info__id-container');
        this.idContainer.innerHTML = '<span>ID:&nbsp;</span';
        this.container.appendChild(this.idContainer);

        this.idValue = document.createElement('span');
        this.idValue.classList.add('add-edit-info__id-value');
        this.idContainer.appendChild(this.idValue);

        this.copyIdBtn = document.createElement('button');
        this.copyIdBtn.classList.add('add-edit-info__copy-id-btn', 'icon-button');
        this.copyIdBtn.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" />
            <path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" />
        </svg>`;
        this.idContainer.appendChild(this.copyIdBtn);
        this.copyIdBtn.addEventListener('click', (e) => {
            navigator.clipboard.writeText(this.idValue.textContent)
                            .then(() => console.log("Copied to clipboard!"))
                            .catch(err => alert("Failed to copy: " + err));
        });

        this.creationTimestampSpan = document.createElement('span');
        this.creationTimestampSpan.classList.add('add-edit-info__creation-timestamp-span');
        this.container.appendChild(this.creationTimestampSpan);

        this.inputGridContainer = document.createElement('div');
        this.inputGridContainer.classList.add('add-edit-info__input-grid-container');
        this.container.appendChild(this.inputGridContainer);

        // name
        this.nameLabel = document.createElement('span');
        this.nameLabel.classList.add('add-edit-info__name-label');
        this.nameLabel.textContent = 'Name:'
        this.inputGridContainer.appendChild(this.nameLabel);
        this.nameTextarea = document.createElement('textarea');
        this.nameTextarea.classList.add('add-edit-info__name-textarea', 'small-scrollbar');
        this.nameTextarea.placeholder = 'Enter stop name';
        this.nameTextarea.rows = '1';
        this.inputGridContainer.appendChild(this.nameTextarea);
        this.nameTextarea.addEventListener("input", () => { // auto grow the textarea instead of scroll
            this.nameTextarea.style.height = "auto"; // Reset height
            this.nameTextarea.style.height = this.nameTextarea.scrollHeight + 2 + "px"; // Set new height
        });
        this.nameTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.latInput.focus();
            }
        });

        // latitude
        this.latLabel = document.createElement('span');
        this.latLabel.classList.add('add-edit-info__lat-label');
        this.latLabel.textContent = 'Latitude:'
        this.inputGridContainer.appendChild(this.latLabel);
        this.latInput = document.createElement('input');
        this.latInput.classList.add('add-edit-info__lat-input');
        this.latInput.type = 'number';
        this.latInput.placeholder = 'Enter lat coords';
        this.inputGridContainer.appendChild(this.latInput);
        this.latInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.lonInput.focus();
            }
        });

        // longitude
        this.lonLabel = document.createElement('span');
        this.lonLabel.classList.add('add-edit-info__lon-label');
        this.lonLabel.textContent = 'Longitude:'
        this.inputGridContainer.appendChild(this.lonLabel);
        this.lonInput = document.createElement('input');
        this.lonInput.classList.add('add-edit-info__lon-input');
        this.lonInput.type = 'number';
        this.lonInput.placeholder = 'Enter lon coords';
        this.inputGridContainer.appendChild(this.lonInput);
        this.lonInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.audioTrackNumberInput.focus();
            }
        });

        // audio track number
        this.audioTrackNumberLabel = document.createElement('span');
        this.audioTrackNumberLabel.classList.add('add-edit-info__audioTrackNumber-label');
        this.audioTrackNumberLabel.textContent = 'Audio track number:'
        this.inputGridContainer.appendChild(this.audioTrackNumberLabel);
        this.audioTrackNumberInput = document.createElement('input');
        this.audioTrackNumberInput.classList.add('add-edit-info__audioTrackNumber-input');
        this.audioTrackNumberInput.type = 'number';
        this.audioTrackNumberInput.placeholder = 'audio #';
        this.inputGridContainer.appendChild(this.audioTrackNumberInput);
        this.audioTrackNumberInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.radiusInput.focus();
            }
        });

        // radius
        this.radiusLabel = document.createElement('span');
        this.radiusLabel.classList.add('add-edit-info__radius-label');
        this.radiusLabel.textContent = 'Radius:'
        this.inputGridContainer.appendChild(this.radiusLabel);
        this.radiusInput = document.createElement('input');
        this.radiusInput.classList.add('add-edit-info__radius-input');
        this.radiusInput.type = 'number';
        this.radiusInput.placeholder = 'radius';
        this.inputGridContainer.appendChild(this.radiusInput);
        this.radiusInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if(this.title.textContent == 'Add new stop') {
                    this.addNewButton.click();
                } else if(this.title.textContent == 'Edit stop') {
                    this.saveEditButton.click();
                }
            }
        });

        // routes using
        this.routesUsingLabel = document.createElement('span');
        this.routesUsingLabel.classList.add('add-edit-info__routes-using-label');
        this.routesUsingLabel.textContent = 'Routes using:'
        this.inputGridContainer.appendChild(this.routesUsingLabel);
        this.routesUsingContainer = document.createElement('div');
        this.routesUsingContainer.classList.add('add-edit-info__routes-using-container');
        this.inputGridContainer.appendChild(this.routesUsingContainer);

        this.routesUsingNumber = document.createElement('span');
        this.routesUsingNumber.classList.add('add-edit-info__routes-using-number');
        this.routesUsingContainer.appendChild(this.routesUsingNumber);
        
        this.routesUsingList = document.createElement('ul');
        this.routesUsingList.classList.add('add-edit-info__routes-using-list', 'small-scrollbar');
        this.routesUsingContainer.appendChild(this.routesUsingList);

        // controls
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.classList.add('add-edit-info__controls-container');
        this.container.appendChild(this.controlsContainer);

        this.cancelButton = document.createElement('button');
        this.cancelButton.classList.add('button', 'add-edit-info__cancel-button');
        this.cancelButton.textContent = 'Cancel';
        this.controlsContainer.appendChild(this.cancelButton);
        this.cancelButton.addEventListener('click', this.cancelHandler.bind(this));

        this.addNewButton = document.createElement('button');
        this.addNewButton.classList.add('button', 'add-edit-info__add-new-button');
        this.addNewButton.textContent = 'Add stop';
        this.controlsContainer.appendChild(this.addNewButton);
        this.addNewButton.addEventListener('click', this.addNewStop.bind(this));

        this.saveEditButton = document.createElement('button');
        this.saveEditButton.classList.add('button', 'add-edit-info__save-edit-button');
        this.saveEditButton.textContent = 'Save';
        this.controlsContainer.appendChild(this.saveEditButton);
        this.saveEditButton.addEventListener('click', this.saveEdit.bind(this));

        this.closeButton = document.createElement('button');
        this.closeButton.classList.add('button', 'add-edit-info__close-button');
        this.closeButton.textContent = 'Close';
        this.controlsContainer.appendChild(this.closeButton);
        this.closeButton.addEventListener('click', this.closeHandler.bind(this));
    }

    addNewStop() {
        const name = this.nameTextarea.value;
        const lat = this.latInput.value;
        const lon = this.lonInput.value;
        const audio = this.audioTrackNumberInput.value;
        const radius = this.radiusInput.value;

        if(name === '' || lat === '' || lon === '' || audio === '' || radius === '') {
            alert("Fill in all inputs");
            return;
        }

        const stop = this.mainApp.data.addNewStop(name, Number(lat), Number(lon), Number(audio), Number(radius));

        // sort stops after adding a new one
        this.mainApp.data.sortStops(this.mainApp.stopsScreen.sortSelect.value, this.mainApp.stopsScreen.isSortAscending());
        this.mainApp.stopsScreen.clearStopsList();
        this.mainApp.data.stops.forEach(stop => this.mainApp.stopsScreen.renderStop(stop));
        this.mainApp.stopsScreen.scrollToStop(stop.id);

        this.hide();
    }

    createUnsavedWarning() {
        this.unsavedWarningBackground = document.createElement('div');
        this.unsavedWarningBackground.classList.add('add-edit-info__unsaved-warning__bg');
        this.backgroundDiv.appendChild(this.unsavedWarningBackground);

        this.unsavedWarningContainer = document.createElement('div');
        this.unsavedWarningContainer.classList.add('add-edit-info__unsaved-warning__container');
        this.unsavedWarningBackground.appendChild(this.unsavedWarningContainer);

        this.unsavedWarningText = document.createElement('span');
        this.unsavedWarningText.classList.add('add-edit-info__unsaved-warning__text');
        this.unsavedWarningText.textContent = 'You have unsaved changes.';
        this.unsavedWarningContainer.appendChild(this.unsavedWarningText);

        this.discardUnsavedControls = document.createElement('div');
        this.discardUnsavedControls.classList.add('add-edit-info__unsaved-warning__controls');
        this.unsavedWarningContainer.appendChild(this.discardUnsavedControls);

        this.discardUnsavedButton = document.createElement('button');
        this.discardUnsavedButton.classList.add('button','add-edit-info__unsaved-warning__discard');
        this.discardUnsavedButton.textContent = 'Discard';
        this.discardUnsavedControls.appendChild(this.discardUnsavedButton);

        this.keepEditingButton = document.createElement('button');
        this.keepEditingButton.classList.add('button','add-edit-info__unsaved-warning__keep-editing');
        this.keepEditingButton.textContent = 'Keep editing';
        this.discardUnsavedControls.appendChild(this.keepEditingButton);

        this.discardUnsavedButton.addEventListener('click', () => {
            this.hideUnsavedWarning();
            this.hide();
            this.mainApp.currentPopUp = null;
        });
        this.keepEditingButton.addEventListener('click', this.hideUnsavedWarning.bind(this));
    }

    hideUnsavedWarning() {
        this.unsavedWarningBackground.style.opacity = 0;
        this.unsavedWarningBackground.style.pointerEvents = 'none';
        this.unsavedWarningContainer.style.transform = 'scale(0.6)';
    }

    showUnsavedWarning() {
        this.unsavedWarningBackground.style.opacity = 1;
        this.unsavedWarningBackground.style.pointerEvents = 'all';
        this.unsavedWarningContainer.style.transform = 'scale(1)';
    }

    fillRouteUsing(stopId) {
        const routes = this.mainApp.data.getStopById(stopId).routes;

        this.routesUsingNumber.textContent = routes.length;

        if(routes.length === 0) {
            this.routesUsingNumber.style.left = '0';
            this.routesUsingList.style.display = 'none';
            return;
        } else {
            const rect = this.routesUsingNumber.getBoundingClientRect();
            this.routesUsingList.style.paddingRight = rect.width + 10 + 'px';
            this.routesUsingList.style.display = 'block';
        }
        
        this.routesUsingList.innerHTML = '';
        routes.forEach((routeId) => {
            const li = document.createElement('li');
            li.textContent = this.mainApp.data.getRouteById(routeId).name;
            this.routesUsingList.appendChild(li);
        });
    }

    startNewStopCreation() {
        this.nameTextarea.value = '';
        this.latInput.value = '';
        this.lonInput.value = '';
        this.audioTrackNumberInput.value = '';
        this.radiusInput.value = '';
        this.title.textContent = 'Add new stop';

        this.inputGridContainer.classList.remove('info');
        this.cancelButton.style.display = 'block';
        this.addNewButton.style.display = 'block';
        this.saveEditButton.style.display = 'none';
        this.closeButton.style.display = 'none';
        this.routesUsingLabel.style.display = 'none';
        this.routesUsingContainer.style.display = 'none';
        this.idContainer.style.display = 'none';
        this.creationTimestampSpan.style.display = 'none';

        this.show();
        this.mainApp.currentPopUp = 'newOrEditStop';
    }

    startStopEdit(stopId) {
        this.editingStopId = stopId;
        this.inputGridContainer.classList.remove('info');
        const stop = this.mainApp.data.getStopById(stopId);
        const creationDate = new Date(stop.creationTimestamp *1000);

        this.idValue.textContent = stop.id;
        this.creationTimestampSpan.textContent = `Creation time: ${creationDate.toLocaleDateString()} ${creationDate.toLocaleTimeString()}`;
        this.nameTextarea.value = stop.name;
        this.nameTextarea.style.height = "auto"; // Reset height
        this.nameTextarea.style.height = this.nameTextarea.scrollHeight + 2 + "px";
        this.latInput.value = stop.lat;
        this.lonInput.value = stop.lon;
        this.audioTrackNumberInput.value = stop.audioTrackNumber;
        this.radiusInput.value = stop.radius;
        this.title.textContent = 'Edit stop';

        this.fillRouteUsing(stopId);
        this.idContainer.style.display = 'flex';
        this.creationTimestampSpan.style.display = 'block';
        this.routesUsingLabel.style.display = 'block';
        this.routesUsingContainer.style.display = 'block';

        this.cancelButton.style.display = 'block';
        this.saveEditButton.style.display = 'block';
        this.addNewButton.style.display = 'none';
        this.closeButton.style.display = 'none';

        this.show();
        this.mainApp.currentPopUp = 'newOrEditStop';
    }

    showStopInfo(stopId) {
        this.inputGridContainer.classList.add('show-stop-info');
        this.inputGridContainer.classList.add('info');

        const stop = this.mainApp.data.getStopById(stopId);
        const creationDate = new Date(stop.creationTimestamp *1000);
        this.idValue.textContent = stop.id;
        this.creationTimestampSpan.textContent = `Creation time: ${creationDate.toLocaleDateString()} ${creationDate.toLocaleTimeString()}`;
        this.nameTextarea.value = stop.name;
        this.nameTextarea.style.height = "auto"; // Reset height
        this.nameTextarea.style.height = this.nameTextarea.scrollHeight + 2 + "px";
        this.nameTextarea.readOnly = true;
        this.latInput.value = stop.lat;
        this.latInput.readOnly = true;
        this.lonInput.value = stop.lon;
        this.lonInput.readOnly = true;
        this.audioTrackNumberInput.value = stop.audioTrackNumber;
        this.audioTrackNumberInput.readOnly = true;
        this.radiusInput.value = stop.radius;
        this.radiusInput.readOnly = true;
        this.title.textContent = 'Stop info';

        this.fillRouteUsing(stopId);
        this.idContainer.style.display = 'flex';
        this.creationTimestampSpan.style.display = 'block';
        this.routesUsingLabel.style.display = 'block';
        this.routesUsingContainer.style.display = 'block';

        this.closeButton.style.display = 'block';
        this.cancelButton.style.display = 'none';
        this.saveEditButton.style.display = 'none';
        this.addNewButton.style.display = 'none';

        this.show();
        this.mainApp.currentPopUp = 'stopInfo';
    }

    cancelHandler() {
        if(this.title.textContent == 'Add new stop') {
            if(this.nameTextarea.value !== '' || this.latInput.value !== '' || this.lonInput.value !== '' || this.audioTrackNumberInput.value !== '' || this.radiusInput.value !== '') {
                this.showUnsavedWarning();
            } else {
                this.hide();
                this.mainApp.currentPopUp = null;
            }
        } else if(this.title.textContent == 'Edit stop') {
            const oldStop = this.mainApp.data.getStopById(this.editingStopId);

            if(this.nameTextarea.value !== oldStop.name || 
                Number(this.latInput.value) !== oldStop.lat || 
                Number(this.lonInput.value) !== oldStop.lon || 
                Number(this.audioTrackNumberInput.value) !== oldStop.audioTrackNumber || 
                Number(this.radiusInput.value) !== oldStop.radius) {
                this.showUnsavedWarning();
            } else {
                this.hide();
                this.mainApp.currentPopUp = null;
            }
        }
    }

    closeHandler() {
        setTimeout(() => {
            this.inputGridContainer.classList.remove('show-stop-info');
        }, 500);
        
        this.nameTextarea.readOnly = false;
        this.latInput.readOnly = false;
        this.lonInput.readOnly = false;
        this.audioTrackNumberInput.readOnly = false;
        this.radiusInput.readOnly = false;
        
        this.hide();
        this.mainApp.currentPopUp = null;
    }

    saveEdit() {
        const oldStop = this.mainApp.data.getStopById(this.editingStopId);
        const name = this.nameTextarea.value;
        const lat = Number(this.latInput.value);
        const lon = Number(this.lonInput.value);
        const audio = Number(this.audioTrackNumberInput.value);
        const radius = Number(this.radiusInput.value);

        if(name !== oldStop.name || 
            lat !== oldStop.lat || 
            lon !== oldStop.lon || 
            audio !== oldStop.audioTrackNumber || 
            radius !== oldStop.radius) {
            this.mainApp.data.editStop(this.editingStopId, name, lat, lon, audio, radius);
            this.mainApp.stopsScreen.rerenderStop(this.editingStopId);
        }

        this.hide();
    }

    hide() {
        this.backgroundDiv.style.opacity = 0;
        this.backgroundDiv.style.pointerEvents = 'none';
        this.container.style.transform = 'translateY(-50px)';
    }
    
    show() {
        this.backgroundDiv.style.opacity = 1;
        this.backgroundDiv.style.pointerEvents = 'all';
        this.container.style.transform = 'translateY(0)';
    }
}