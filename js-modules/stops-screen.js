export default class StopsScreen {
    constructor(parentElement) {
        this.parentElement = parentElement;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('stops-screen-wrapper');
        this.parentElement.appendChild(this.wrapper);
        
        this.createNoStopsMessage();
    }

    hide() {
        this.wrapper.style.display = 'none';
    }

    show() {
        this.wrapper.style.display = 'flex';
    }

    createNoStopsMessage() {
        this.noStopsMessage = document.createElement('div');
        this.noStopsMessage.classList.add('no-stops-message');
        this.noStopsMessage.textContent = 'No stops available';
        this.wrapper.appendChild(this.noStopsMessage);
    }

    hideNoStopsMessage() {
        this.noStopsMessage.style.display = 'none';
    }

    showNoStopsMessage() {
        this.noStopsMessage.style.display = 'flex';
    }
}