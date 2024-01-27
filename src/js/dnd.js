export default function DnD() {

    const cardsContainers = document.querySelectorAll('.cards-container');
    const cards = document.querySelectorAll('.card');
    let currentDroppable = null; //место, куда мы можем "бросить" карточку
    let placeholder; //"призрачная" карточка
    let isDraggingStarted = false; //состояние процесса DnD
    let movingElement; //перетаскиваемая карточка
    let elementBelow; //элемент, ниже перетаскиваемой карточки

    const processEmptySections = () => {
        cardsContainers.forEach(container => {
            if(!container.querySelector('.card:not(.emptySectionHiddenCard)')) {
                const emptySectionHiddenCard = document.createElement('div');
                emptySectionHiddenCard.classList.add('card', 'emptySectionHiddenCard');
                container.append(emptySectionHiddenCard);
            } else {
                const emptySectionHiddenCard = container.querySelector('.emptySectionHiddenCard');
                emptySectionHiddenCard && container.removeChild(emptySectionHiddenCard);
            }
        })
    }

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
        movingElement.parentNode.insertBefore(placeholder, movingElement);
    }

    const onMouseMove = e => {
        if(!isDraggingStarted) {
            isDraggingStarted = true;
            createPlaceholder();
            movingElement.classList.add('dragged');
        }
        moveAt(movingElement, e.pageX, e.pageY);

        elementBelow = getElementBelow(movingElement, 'by-center');
        if(!elementBelow) return;
        let droppableBelow = elementBelow.closest('.card');
        if(currentDroppable != droppableBelow) {
            currentDroppable = droppableBelow;
            if(currentDroppable) {
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

    const onMouseUp = () => { //действия при отжатии кнопки мыши
        if(!isDraggingStarted) {
            document.removeEventListener('mousemove', onMouseMove);
            movingElement.onmouseup = null;
            return;
        }
        placeholder.parentNode.insertBefore(movingElement, placeholder);
        movingElement.classList.remove('dragged');
        document.removeEventListener('mousemove', onMouseMove);
        isDraggingStarted = false;
        placeholder && placeholder.parentNode.removeChild(placeholder);
        movingElement.onmouseup = null;
        movingElement = null;

        processEmptySections();
    }


    const onMouseDown = e => { //действия при нажатии кнопки мыши
        setMovingElement(e);
        shifts.set(e.clientX, e.clientY, movingElement);
        document.addEventListener('mousemove', onMouseMove); //логика перемещения карточки
        movingElement.onmouseup = onMouseUp;
    }

    cards.forEach(card => {
        card.onmousedown = onMouseDown;
        card.ondragstart = () => {
            return false;
        }
    })
}

// export default function DnD() {

//     const cardsContainer = document.querySelectorAll('.cards-container');

//     let actualElement;

//     const onMouseUp = e => {
//         const mouseUpCard = e.target;

//         cardsContainer.forEach(container => {
//             container.insertBefore(actualElement, mouseUpCard);
//         })
        
//         actualElement.classList.remove('dragged');
//         actualElement = undefined;

//         document.documentElement.removeEventListener('mouseup', onMouseUp);
//         document.documentElement.removeEventListener('mouseover', onMouseOver);
//     }

//     const onMouseOver = e => {
//         console.log(e);

//         actualElement.style.top = e.clientY + 'px';
//         actualElement.style.left = e.clientX + 'px';
//     }

//     cardsContainer.forEach(container => {
//         container.addEventListener('mousedown', e => {
//             e.preventDefault();
//             actualElement = e.target;
//             actualElement.classList.add('dragged');

//             document.documentElement.addEventListener('mouseup', onMouseUp);
//             document.documentElement.addEventListener('mouseover', onMouseOver);
//         })
//     })

// }

// export default class DnD {
//     constructor() {
//         this.cardsContainer = document.querySelectorAll('.cards-container');
//         this.actualElement;
//     }

//     onMouseDown() {
//         this.cardsContainer.forEach(container => {
//             container.addEventListener('mousedown', e => {
//                 e.preventDefault();

//                 this.actualElement = e.target;
//                 this.actualElement.classList.add('dragged');
//             })

//             container.addEventListener('mouseup', e => {
//                 this.actualElement.classList.remove('dragged');
//                 this.actualElement = undefined;
//             });

//             container.addEventListener('mouseover', e => {
//                 e.target.style.top = e.clientY + 'px';
//                 e.target.style.left = e.clientX + 'px';
//             })
            
//         })
//     }


    // onMouseOver(e) {
    //     e.target.style.top = e.clientY + 'px';
    //     e.target.style.left = e.clientX + 'px';
    // }
// }

