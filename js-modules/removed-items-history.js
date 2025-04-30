export default class RemovedItemsHistory {
    constructor(mainAppInstance) {
        this.mainApp = mainAppInstance;

        this.create();
        this.itemsInHistory = 0;
    }

    create() {
        this.container = document.createElement('div');
        this.container.classList.add('removed-items-history', 'small-scrollbar');
        document.body.appendChild(this.container);

        const maxHeightStr = getComputedStyle(this.container).maxHeight
        this.maxHeight = maxHeightStr.endsWith('px') ? parseFloat(maxHeightStr) : Infinity;
    }

    addItem(htmlToShow, restoreData, undoCallback, customUndoBtn = null, timeoutDelay = 5000) {
        if(this.itemsInHistory === 0) {
            this.container.style.pointerEvents = 'all';
            this.container.style.opacity = 1;
        }

        const item = document.createElement('div');
        item.classList.add('removed-item');

        const itemContent = document.createElement('div');
        itemContent.innerHTML = htmlToShow;
        item.appendChild(itemContent);

        let undoBtn;
        if(customUndoBtn) {
            undoBtn = customUndoBtn;
        } else {
            undoBtn = document.createElement('button');
            undoBtn.classList.add('restore-removed');
            undoBtn.innerHTML = `
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M10 16.682l5.69 5.685 1.408-1.407-3.283-3.28h10.131c1.147 0 2.19.467 2.943 1.222a4.157 4.157 0 011.225 2.946 4.18 4.18 0 01-4.168 4.168h-5.628V28h5.522c3.387 0 6.16-2.77 6.16-6.157a6.117 6.117 0 00-1.81-4.343 6.143 6.143 0 00-4.35-1.805H13.815l3.283-3.285L15.69 11 10 16.682z" fill-rule="nonzero"/></svg>
                Undo`;
        }
        item.appendChild(undoBtn);


        // delete from history after delay
        item.dataset.timeoutIdentifier = setTimeout(() => {
            item.style.pointerEvents = 'none';

            if(this.container.getBoundingClientRect().height < this.maxHeight) {
                this.container.style.webkitMaskImage = '';
                this.container.style.maskImage = '';
            }

            requestAnimationFrame( () => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });

            setTimeout(() => {
                item.remove();
                this.itemsInHistory--;
                if (this.itemsInHistory === 0) {
                    this.container.style.opacity = '0';
                    this.container.style.pointerEvents = 'none';
                }
            }, 300);
        }, timeoutDelay);

        // add handler for the restore button
        undoBtn.addEventListener('click', (e) => {
            clearTimeout(item.dataset.timeoutIdentifier);
            item.remove();
            this.itemsInHistory--;
            if (this.itemsInHistory === 0) {
                this.container.style.opacity = '0';
                this.container.style.pointerEvents = 'none';
            }

            undoCallback(restoreData);
        });

        // increase items count and append the new item
        // mask shading effect if offerflowing
        this.itemsInHistory++;
        this.container.prepend(item);
        if(this.container.getBoundingClientRect().height >= this.maxHeight) {
            this.container.style.webkitMaskImage = 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.1) 100%)';
            this.container.style.maskImage = 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.1) 100%)';
        }
        
        // animate item appearing
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        });
    }
}