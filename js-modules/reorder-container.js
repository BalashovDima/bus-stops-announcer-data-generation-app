export default class ReorderContainer {
    constructor({containerElementName = 'div', 
                dragStartCallback = () => {},
                dragEndCallback = () => {},
                dragMoveCallback = () => {},
                dragHandleSelector = undefined,
                reorderElementSelector = undefined
    } = {}) {
        this.dragStartCallback = dragStartCallback;
        this.dragEndCallback = dragEndCallback;
        this.dragMoveCallback = dragMoveCallback;
        this.dragHandleSelector = dragHandleSelector;
        this.reorderElementSelector = reorderElementSelector;

        this.element = document.createElement(containerElementName);
        
        this.isReorderEnabled = false;
        this.itemsGap = 0;

        this.boundPointerDownHandler = this.handlePointerDown.bind(this);
        this.boundPointerUpHandler = this.handlePointerUp.bind(this);
        this.boundPointerMoveHandler = this.handlePointerMove.bind(this);
    }

    enableReordering() {
        if (this.isReorderEnabled) return;
        this.isReorderEnabled = true;
        
        this.element.addEventListener('pointerdown', this.boundPointerDownHandler)
        this.element.addEventListener('pointerup', this.boundPointerUpHandler);
    }
    
    disableReordering() {
        if (!this.isReorderEnabled) return;
        this.isReorderEnabled = false;
        
        this.element.removeEventListener('pointerdown', this.boundPointerDownHandler)
        this.element.removeEventListener('pointerup', this.boundPointerUpHandler);
    }

    handlePointerDown(e) {
        if(e.target.closest(this.dragHandleSelector) === null) return;

        this.itemBeingDragged = e.target.closest('.route-stop__row');
        this.itemBeingDragged.classList.add('dragging'); 
        this.element.style.userSelect = 'none'; 
        document.body.style.cursor = 'grabbing';

        const containerRect = this.element.getBoundingClientRect();
        const itemRect = this.itemBeingDragged.getBoundingClientRect();
        this.startY = e.y - containerRect.top; // starting coordinates relative to the container of reordering items 
        this.minYOffset = containerRect.top - itemRect.top;
        this.maxYOffset = containerRect.bottom - itemRect.bottom;

        this.items = [...this.element.querySelectorAll(this.reorderElementSelector)];
        for(let i = 0; i < this.items.indexOf(this.itemBeingDragged); i++) {
            this.items[i].dataset.isAbove = '';
        }
        this.setItemsGap();

        this.element.setPointerCapture(e.pointerId); // set pointer to the container of reordering items
        this.element.addEventListener('pointermove', this.boundPointerMoveHandler);
    }

    handlePointerUp(e) {
        if (this.itemBeingDragged === null) return;
    
        const reorderedItems = [];

        this.items.forEach((item, index) => {
            if (item === this.itemBeingDragged) {
                return;
            }
            if (!item.hasAttribute('data-is-toggled')) {
                reorderedItems[index] = item;
                return;
            }
            const newIndex = item.hasAttribute('data-is-above') ? index + 1 : index - 1;
            reorderedItems[newIndex] = item;
        })

        for (let index = 0; index < this.items.length; index++) {
            const item = reorderedItems[index]
            if (typeof item === 'undefined') {
                reorderedItems[index] = this.itemBeingDragged;
            }
        }

        reorderedItems.forEach((item) => {
            this.element.appendChild(item);
        })

        // Cleanup
        this.items.forEach((item) => {
            item.style.transform = '';
            item.removeAttribute('data-is-above');
            item.removeAttribute('data-is-toggled');
        });
    
        this.itemBeingDragged.classList.remove('dragging');
        this.itemBeingDragged = null;
        this.element.style.userSelect = '';
        document.body.style.cursor = '';
        
        this.element.releasePointerCapture(e.pointerId);
        this.element.removeEventListener('pointermove', this.boundPointerMoveHandler);
    }
    
    
    handlePointerMove(e) {
        const yOffset = e.offsetY - this.startY;
        const clampedYOffset = Math.min(this.maxYOffset, Math.max(yOffset, this.minYOffset)); // prevents from dragging out of parent
        this.itemBeingDragged.style.transform = `translateY(${clampedYOffset}px)`;
        
        const itemBeingDraggedRect = this.itemBeingDragged.getBoundingClientRect();
        const itemBeingDraggedY = itemBeingDraggedRect.top + itemBeingDraggedRect.height / 2;

        if(yOffset <= this.minYOffset) { // if item should be at the top
            // then set all items below
            this.items.forEach((item) => {
                if(item.classList.contains('dragging')) return;
                
                if (item.hasAttribute('data-is-above')) {
                    // so move down all that were above
                    item.dataset.isToggled = '';
                } else {
                    // don't move those that were below
                    delete item.dataset.isToggled;
                }
            });
        } else if(yOffset >= this.maxYOffset) { // if item should be at the bottom
            // then set all items above
            this.items.forEach((item) => {
                if(item.classList.contains('dragging')) return;
                
                if (item.hasAttribute('data-is-above')) {
                    // so don't move all that were above
                    delete item.dataset.isToggled;
                } else {
                    // and move up those that were below
                    item.dataset.isToggled = '';
                }
            });
        } else { // else determine what item to move and what to not move
            this.items.forEach((item) => {
                if(item.classList.contains('dragging')) return;
    
                const itemRect = item.getBoundingClientRect();
                const itemY = itemRect.top + itemRect.height / 2;
                if (item.hasAttribute('data-is-above')) {
                    // if a
                    if (itemBeingDraggedY <= itemY ) {
                        item.dataset.isToggled = '';
                    } else {
                        delete item.dataset.isToggled;
                    }
                } else {
                    if (itemBeingDraggedY >= itemY) {
                        item.dataset.isToggled = '';
                    } else {
                        delete item.dataset.isToggled;
                    }
                }
            })
        }

        // Update position
        this.items.forEach((item) => {
            if(item.classList.contains('dragging')) return;

            if (item.hasAttribute('data-is-toggled')) {
                const direction = item.hasAttribute('data-is-above') ? 1 : -1;
                item.style.transform = `translateY(${direction * (itemBeingDraggedRect.height + this.itemsGap)}px)`
            } else {
                item.style.transform = '';
            }
        });
    }

    setItemsGap() {
        if (this.items.length <= 1) {
            this.itemsGap = 0;
            return;
        }

        const item1 = this.items[0];
        const item2 = this.items[1];

        const item1Rect = item1.getBoundingClientRect();
        const item2Rect = item2.getBoundingClientRect();

        this.itemsGap = Math.abs(item1Rect.bottom - item2Rect.top);
    }
}