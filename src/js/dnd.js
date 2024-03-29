import LocalStorageWork from "./LocalStorageWork";

export default function DnD() {

    const ls = new LocalStorageWork();
    const cardsContainers = document.querySelectorAll('.cards-container');
    const cards = document.querySelectorAll('.card');
    let currentDroppable = null; //место, куда мы можем "бросить" карточку
    let placeholder; //"призрачная" карточка
    let isDraggingStarted = false; //состояние процесса DnD
    let movingElement; //перетаскиваемая карточка
    let elementBelow; //элемент, ниже перетаскиваемой карточки

    const processEmptySections = () => {
        cardsContainers.forEach(container => {
            if(!container.querySelector('.card:not(.emptySectionHiddenCard)') && !container.querySelector('.emptySectionHiddenCard')) {
                const emptySectionHiddenCard = document.createElement('div');
                emptySectionHiddenCard.classList.add('card', 'emptySectionHiddenCard');
                container.append(emptySectionHiddenCard);
            } else if (container.querySelectorAll('.emptySectionHiddenCard').length > 1 || container.querySelectorAll('.card').length > 1) {
                const emptySectionHiddenCard = container.querySelector('.emptySectionHiddenCard');
                emptySectionHiddenCard && container.removeChild(emptySectionHiddenCard);
            }
        })
    }

    processEmptySections();

    const shifts = { //координаты позиции передвигаемой карточки
        shiftX: 0,
        shiftY: 0,
        set: (clientX, clientY, movingElement) => {
            shifts.shiftX = clientX - movingElement.getBoundingClientRect().left;
            shifts.shiftY = clientY - movingElement.getBoundingClientRect().top;
        },
    }

    const moveAt = (element, pageX, pageY) => { //перетаскивает карточку на позицию в соответствии с координатами
        element.style.left = pageX - shifts.shiftX + 'px';
        element.style.top = pageY - shifts.shiftY + 'px';
    }

    const getElementCoordinates = (node, searchCoordsBy) => { //получение координат центра перемещаемой карточки
        const rect = node.getBoundingClientRect();
        return {
            top: searchCoordsBy == 'by-center' ? rect.top + rect.height / 2 : rect.top + 10,
            left: rect.left + rect.width / 2,
        };
    }

    const isAbove = (nodeA, nodeB) => { //возвращает true или false в зависимости от того, какой элемент находится выше
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();

        return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
    }

    const getElementBelow = (movingElement, searchCoordsBy) => { //получение элемента, над которым находтся перемещаемая карточка
        const movingElementCenter = getElementCoordinates(movingElement, searchCoordsBy);
        movingElement.hidden = true;
        elementBelow = document.elementFromPoint(movingElementCenter.left, movingElementCenter.top);
        movingElement.hidden = false;
        return elementBelow;
    }

    const createPlaceholder = () => { //создание "призрачной" карточки
        placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        if(!movingElement.classList.contains('delete_card_button')){
            movingElement.parentNode.insertBefore(placeholder, movingElement);
        }
    }

    const onMouseMove = e => {
        if(!isDraggingStarted) {
            isDraggingStarted = true;
            if(!movingElement.classList.contains('delete_card_button')) {
                createPlaceholder();
                movingElement.classList.add('dragged');
            }
        }
        if(movingElement && movingElement.classList.contains('card') && !movingElement.classList.contains('delete_card_button')) {
            moveAt(movingElement, e.pageX, e.pageY);
        } else {
            return;
        }

        elementBelow = getElementBelow(movingElement, 'by-center');
        if(!elementBelow) return;
        let droppableBelow = elementBelow.closest('.card');
        if(currentDroppable != droppableBelow) {
            currentDroppable = droppableBelow;
            if(currentDroppable && !movingElement.classList.contains('delete_card_button')) {
                if(!isAbove(movingElement, currentDroppable) || currentDroppable.classList.contains('emptySectionHiddenCard')) {
                    currentDroppable.parentNode.insertBefore(placeholder, currentDroppable);
                } else {
                    currentDroppable.parentNode.insertBefore(placeholder, currentDroppable.nextElementSibling);
                }
            }
        }
    }

    const setMovingElement = e => { //выбор перетаскиваемой карточки, запись в переменную
        movingElement = e.target;
    }

    const onMouseDown = e => { //действия при нажатии кнопки мыши
        setMovingElement(e);
        shifts.set(e.clientX, e.clientY, movingElement);
        document.addEventListener('mousemove', onMouseMove); //логика перемещения карточки
        movingElement.onmouseup = onMouseUp;
    }

    const onMouseUp = () => { //действия при отжатии кнопки мыши
        if(!isDraggingStarted) {
            document.removeEventListener('mousemove', onMouseMove);
            movingElement.onmouseup = null;
            return;
        }
        if(movingElement && !movingElement.classList.contains('delete_card_button') && !movingElement.classList.contains('emptySectionHiddenCard')) {
            if(placeholder) {
                placeholder.parentNode.insertBefore(movingElement, placeholder);
            }
            movingElement.classList.remove('dragged');
            movingElement.style.left = 0;
            movingElement.style.top = 0;
            document.removeEventListener('mousemove', onMouseMove);
            isDraggingStarted = false;
            placeholder && placeholder.parentNode.removeChild(placeholder);
        }
        movingElement.onmouseup = null;
        movingElement = null;

        processEmptySections();
        ls.deleteFromLocalStorage();
    }

    cards.forEach(card => {
        card.onmousedown = onMouseDown;
        card.ondragstart = () => {
            return false;
        }
    })
}