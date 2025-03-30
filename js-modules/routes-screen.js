export default class RoutesScreen {
    constructor(parentElement) {
        this.parentElement = parentElement;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('routes-screen-wrapper');
        this.parentElement.appendChild(this.wrapper);
        
        this.createNoRoutesMessage();
    }

    hide() {
        this.wrapper.style.display = 'none';
    }

    show() {
        this.wrapper.style.display = 'flex';
    }

    createNoRoutesMessage() {
        this.noRoutesMessage = document.createElement('div');
        this.noRoutesMessage.classList.add('no-routes-message');
        this.noRoutesMessage.textContent = 'No routes available';
        this.wrapper.appendChild(this.noRoutesMessage);
    }

    hideNoRoutesMessage() {
        this.noRoutesMessage.style.display = 'none';
    }

    showNoRoutesMessage() {
        this.noRoutesMessage.style.display = 'flex';
    }
}