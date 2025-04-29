export default class ContextMenu {
    constructor(mainAppInstance) {
        this.mainApp = mainAppInstance;

        this.createContextMenu();
    }

    createContextMenu() {
        this.contextMenuContainer = document.createElement('div');
        this.contextMenuContainer.classList.add('context-menu__container');
        document.body.appendChild(this.contextMenuContainer);
        this.contextMenuContainer.addEventListener('click', this.handleMenuClick.bind(this));
        
        this.copySubMenuButton = document.createElement('div');
        this.copySubMenuButton.classList.add('context-menu__item', 'context-menu__copy-submenu-button');
        this.copySubMenuButton.textContent = 'Copy...';
        this.copySubMenuButton.dataset.action = 'openCopySubMenu';
        this.contextMenuContainer.appendChild(this.copySubMenuButton);

        this.submenuButtonArrow = document.createElement('div');
        this.submenuButtonArrow.classList.add('submenu-button-arrow');
        this.submenuButtonArrow.innerHTML = `
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve">
                <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"/>
            </svg> `;
        this.copySubMenuButton.appendChild(this.submenuButtonArrow);

        this.copySubMenuContainer = document.createElement('div');
        this.copySubMenuContainer.classList.add('context-menu__copy-submenu');
        this.copySubMenuButton.appendChild(this.copySubMenuContainer);
           
        this.copySubMenuButton.addEventListener('mouseenter', this.handleSubMenuButtonMouseEnter.bind(this));
        this.copySubMenuButton.addEventListener('mouseleave', this.handleSubMenuButtonMouseLeave.bind(this));

        this.copySelectedTextButton = document.createElement('div');
        this.copySelectedTextButton.classList.add('context-menu__item');
        this.copySelectedTextButton.textContent = 'Selected text';
        this.copySelectedTextButton.dataset.action = 'copySelectedText';
        this.copySubMenuContainer.appendChild(this.copySelectedTextButton);

        this.copyStopId = document.createElement('div');
        this.copyStopId.classList.add('context-menu__item');
        this.copyStopId.textContent = 'Stop ID';
        this.copyStopId.dataset.action = 'copyStopId';
        this.copySubMenuContainer.appendChild(this.copyStopId);

        this.copyStopName = document.createElement('div');
        this.copyStopName.classList.add('context-menu__item');
        this.copyStopName.textContent = 'Stop name';
        this.copyStopName.dataset.action = 'copyStopName';
        this.copySubMenuContainer.appendChild(this.copyStopName);

        this.copyCoords = document.createElement('div');
        this.copyCoords.classList.add('context-menu__item');
        this.copyCoords.textContent = 'Stop coordinates';
        this.copyCoords.dataset.action = 'copyStopCoordinates';
        this.copySubMenuContainer.appendChild(this.copyCoords);

        this.copyAudioTrackNumber = document.createElement('div');
        this.copyAudioTrackNumber.classList.add('context-menu__item');
        this.copyAudioTrackNumber.textContent = 'Audio track number';
        this.copyAudioTrackNumber.dataset.action = 'copyAudioTrackNumber';
        this.copySubMenuContainer.appendChild(this.copyAudioTrackNumber);

        this.copyRadius = document.createElement('div');
        this.copyRadius.classList.add('context-menu__item');
        this.copyRadius.textContent = 'Stop radius';
        this.copyRadius.dataset.action = 'copyRadius';
        this.copySubMenuContainer.appendChild(this.copyRadius);

        this.showStopInfo = document.createElement('div');
        this.showStopInfo.classList.add('context-menu__item');
        this.showStopInfo.textContent = 'Stop info';
        this.showStopInfo.dataset.action = 'showStopInfo';
        this.contextMenuContainer.appendChild(this.showStopInfo);

        this.selectStop = document.createElement('div');
        this.selectStop.classList.add('context-menu__item');
        this.selectStop.textContent = 'Select stop';
        this.selectStop.dataset.action = 'selectStop';
        this.contextMenuContainer.appendChild(this.selectStop);
        
        this.removeStopFromRoute = document.createElement('div');
        this.removeStopFromRoute.classList.add('context-menu__item');
        this.removeStopFromRoute.textContent = 'Remove stop from route';
        this.removeStopFromRoute.dataset.action = 'removeStopFromRoute';
        this.contextMenuContainer.appendChild(this.removeStopFromRoute);

        this.editStop = document.createElement('div');
        this.editStop.classList.add('context-menu__item');
        this.editStop.textContent = 'Edit stop';
        this.editStop.dataset.action = 'editStop';
        this.contextMenuContainer.appendChild(this.editStop);
                
        this.deleteStop = document.createElement('div');
        this.deleteStop.classList.add('context-menu__item');
        this.deleteStop.textContent = 'Delete stop';
        this.deleteStop.dataset.action = 'deleteStop';
        this.contextMenuContainer.appendChild(this.deleteStop);
    }

    handleRightClick(event) {
        if(event.target.closest('.stops-list__row') !== null) {
            this.menuFor = 'stopsList';

            this.showStopInfo.style.display = 'none';
            this.selectStop.style.display = 'none';
            this.removeStopFromRoute.style.display = 'none';

            this.editStop.style.display = 'block';
            this.deleteStop.style.display = 'block';
            this.copySubMenuButton.style.display = 'flex';

            this.highlightedElement = event.target.closest('.stops-list__row');
            this.highlightedElement.classList.add('highlight-by-context-menu');
        } else if(event.target.closest('.route-stop__row') !== null) {
            this.menuFor = 'routeStop';

            const stop = event.target.closest('.route-stop');
            if(stop.dataset.stopId === '0') {
                this.selectStop.textContent = 'Select stop'
                this.showStopInfo.style.display = 'none';
                this.removeStopFromRoute.style.display = 'none';
                this.copySubMenuButton.style.display = 'none';
            } else {
                this.selectStop.textContent = 'Reselect stop'
                this.showStopInfo.style.display = 'block';
                this.removeStopFromRoute.style.display = 'block';
                this.copySubMenuButton.style.display = 'flex';
            }

            this.editStop.style.display = 'none';
            this.deleteStop.style.display = 'none';

            this.selectStop.style.display = 'block';

            this.highlightedElement = stop;
            this.highlightedElement.classList.add('highlight-by-context-menu');
        } else {
            return;
        }

        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            this.copySelectedTextButton.style.display = 'block';
        } else {
            this.copySelectedTextButton.style.display = 'none';
        }

        event.preventDefault();
        this.menuTarget = event.target;
        this.showContextMenu(event.clientX, event.clientY)
    }

    handleMenuClick(event) {
        const action = event.target.closest('.context-menu__item')?.dataset.action;
        if(action === undefined) return;

        const id = this.menuTarget.closest('.stops-list__row')?.dataset.stopId || this.menuTarget.closest('.route-stop')?.dataset.stopId;
        const stop = this.mainApp.data.getStopById(id);

        switch(action) {
            case 'openCopySubMenu':
                this.showCopySubMenu();
                return;
            case 'copySelectedText':
                // add custom notification for success/error to ui later
                navigator.clipboard.writeText(window.getSelection().toString())
                            .then(() => console.log("Copied to clipboard!"))
                            .catch(err => alert("Failed to copy: " + err));
                break;
            case 'copyStopId':
                // add custom notification for success/error to ui later
                navigator.clipboard.writeText(id)
                            .then(() => console.log("Copied to clipboard!"))
                            .catch(err => alert("Failed to copy: " + err));
                break;
            case 'copyStopName':
                // add custom notification for success/error to ui later
                navigator.clipboard.writeText(stop.name)
                            .then(() => console.log("Copied to clipboard!"))
                            .catch(err => alert("Failed to copy: " + err));
                break;
            case 'copyStopCoordinates':
                // add custom notification for success/error to ui later
                navigator.clipboard.writeText(`${stop.lat}, ${stop.lon}`)
                            .then(() => console.log("Copied to clipboard!"))
                            .catch(err => alert("Failed to copy: " + err));
                break;
            case 'copyAudioTrackNumber':
                // add custom notification for success/error to ui later
                navigator.clipboard.writeText(stop.audioTrackNumber)
                            .then(() => console.log("Copied to clipboard!"))
                            .catch(err => alert("Failed to copy: " + err));
                break;
            case 'copyRadius':
                // add custom notification for success/error to ui later
                navigator.clipboard.writeText(stop.radius)
                            .then(() => console.log("Copied to clipboard!"))
                            .catch(err => alert("Failed to copy: " + err));
                break;
            case 'showStopInfo':
                this.hideContextMenu();
                this.mainApp.addEditInfoStopScreen.showStopInfo(id);
                break;
            case 'editStop':
                this.hideContextMenu();
                this.mainApp.addEditInfoStopScreen.startStopEdit(id);
                break;
            case 'deleteStop':
                this.mainApp.stopsScreen.deleteStop(id);
                break;
            default:
                return;
        }

        this.hideContextMenu();
    }
 
    showContextMenu(cursorX, cursorY) {        
        const menuRect = this.contextMenuContainer.getBoundingClientRect();
        const subMenuRect = this.copySubMenuContainer.getBoundingClientRect();
        const spaceRight = window.innerWidth - cursorX;
        const spaceBottom = window.innerHeight - cursorY;
        let left = cursorX;
        let top = cursorY;

        // determine main menu position
        if(spaceRight < menuRect.width) {
            left = cursorX - menuRect.width;
        }
        if(spaceBottom < menuRect.height) {
            top = cursorY - menuRect.height;
        }

        // determine submenu position and set it
        if(spaceRight - menuRect.width < subMenuRect.width) {
            this.copySubMenuContainer.style.right = '100%';
            this.copySubMenuContainer.style.left = '';
        } else {
            this.copySubMenuContainer.style.left = '100%';
            this.copySubMenuContainer.style.right = '';
        }
        if(spaceBottom < subMenuRect.height) {
            this.copySubMenuContainer.style.top = `${spaceBottom - subMenuRect.height - 10}px`;
        } else {
            this.copySubMenuContainer.style.top = '0px';
        }

        // set main menu position and show it
        this.contextMenuContainer.style.left = left + 'px';
        this.contextMenuContainer.style.top = top + 'px';
        
        this.contextMenuContainer.style.opacity = '1';
        this.contextMenuContainer.style.transform = 'translateY(0)';
        this.contextMenuContainer.style.pointerEvents = 'all';

        this.mainApp.currentPopUp = 'contextMenu';
    }

    hideContextMenu() {
        this.highlightedElement.classList.remove('highlight-by-context-menu');
        this.hideCopySubMenu();
        this.hideSubMenuTimeout = null;
        this.contextMenuContainer.style.opacity = '0';
        this.contextMenuContainer.style.transform = 'translate(-10px, -20px)';
        this.contextMenuContainer.style.pointerEvents = 'none';
        this.mainApp.currentPopUp = null
    }

    showCopySubMenu() {
        clearTimeout(this.showSubMenuTimeout);
        this.showSubMenuTimeout = null;

        this.copySubMenuContainer.style.opacity = '1';
        this.copySubMenuContainer.style.transform = 'translateX(0)';
        this.copySubMenuContainer.style.pointerEvents = 'all';
    }

    hideCopySubMenu() {
        clearTimeout(this.hideSubMenuTimeout);
        this.hideSubMenuTimeout = null;

        this.copySubMenuContainer.style.opacity = '0';
        this.copySubMenuContainer.style.transform = 'translateX(-10px)';
        this.copySubMenuContainer.style.pointerEvents = 'none';
    }

    handleSubMenuButtonMouseEnter(e) {
        if(this.hideSubMenuTimeout !== null && this.hideSubMenuTimeout !== undefined) {
            clearTimeout(this.hideSubMenuTimeout);
            this.hideSubMenuTimeout = null;
            return;
        }

        this.showSubMenuTimeout = setTimeout(() => {
            this.showCopySubMenu();
        }, 550);
    }

    handleSubMenuButtonMouseLeave(e) {
        if(this.showSubMenuTimeout !== null && this.showSubMenuTimeout !== undefined) {
            clearTimeout(this.showSubMenuTimeout);
            this.showSubMenuTimeout = null;
            return;
        }
        
        this.hideSubMenuTimeout = setTimeout(() => {
            this.hideCopySubMenu();
        }, 600);
    }
}