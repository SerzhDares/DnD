/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/cardTemplate.js
function cardTemplate(text) {
  return `<div class="card">
                <span class="card_text">${text}</span>
                <button class="button delete_card_button"></button>
            </div>`;
}
;// CONCATENATED MODULE: ./src/js/LocalStorageWork.js

class LocalStorageWork {
  getFromLocalStorage() {
    if (localStorage.getItem('TODO') || localStorage.getItem('INPROGRESS') || localStorage.getItem('DONE')) {
      Object.keys(localStorage).forEach(key => {
        const values = localStorage.getItem(key).split('\n');
        console.log(values);
        values.forEach(value => {
          document.querySelector(`[data-id="${key.split('_')[0]}"]`).insertAdjacentHTML('beforeend', cardTemplate(value));
        });
      });
    }
  }
  setToLocalStorage(key, value) {
    if (localStorage.getItem(key)) {
      localStorage.setItem(key, localStorage.getItem(key) + '\n' + value);
    } else {
      localStorage.setItem(key, value);
    }
  }
  deleteFromLocalStorage() {
    document.querySelectorAll('.cards-container').forEach(container => {
      if (container.children.length >= 1) {
        localStorage.setItem(container.dataset.id, container.innerText);
      } else {
        localStorage.removeItem(container.dataset.id);
      }
      if (!localStorage.getItem(container.dataset.id)) {
        localStorage.removeItem(container.dataset.id);
      }
    });
  }
}
;// CONCATENATED MODULE: ./src/js/dnd.js

function DnD() {
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
      if (!container.querySelector('.card:not(.emptySectionHiddenCard)') && !container.querySelector('.emptySectionHiddenCard')) {
        const emptySectionHiddenCard = document.createElement('div');
        emptySectionHiddenCard.classList.add('card', 'emptySectionHiddenCard');
        container.append(emptySectionHiddenCard);
      } else if (container.querySelectorAll('.emptySectionHiddenCard').length > 1 || container.querySelectorAll('.card').length > 1) {
        const emptySectionHiddenCard = container.querySelector('.emptySectionHiddenCard');
        emptySectionHiddenCard && container.removeChild(emptySectionHiddenCard);
      }
    });
  };
  processEmptySections();
  const shifts = {
    //координаты позиции передвигаемой карточки
    shiftX: 0,
    shiftY: 0,
    set: (clientX, clientY, movingElement) => {
      shifts.shiftX = clientX - movingElement.getBoundingClientRect().left;
      shifts.shiftY = clientY - movingElement.getBoundingClientRect().top;
    }
  };
  const moveAt = (element, pageX, pageY) => {
    //перетаскивает карточку на позицию в соответствии с координатами
    element.style.left = pageX - shifts.shiftX + 'px';
    element.style.top = pageY - shifts.shiftY + 'px';
  };
  const getElementCoordinates = (node, searchCoordsBy) => {
    //получение координат центра перемещаемой карточки
    const rect = node.getBoundingClientRect();
    return {
      top: searchCoordsBy == 'by-center' ? rect.top + rect.height / 2 : rect.top + 10,
      left: rect.left + rect.width / 2
    };
  };
  const isAbove = (nodeA, nodeB) => {
    //возвращает true или false в зависимости от того, какой элемент находится выше
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };
  const getElementBelow = (movingElement, searchCoordsBy) => {
    //получение элемента, над которым находтся перемещаемая карточка
    const movingElementCenter = getElementCoordinates(movingElement, searchCoordsBy);
    movingElement.hidden = true;
    elementBelow = document.elementFromPoint(movingElementCenter.left, movingElementCenter.top);
    movingElement.hidden = false;
    return elementBelow;
  };
  const createPlaceholder = () => {
    //создание "призрачной" карточки
    placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    if (!movingElement.classList.contains('delete_card_button')) {
      movingElement.parentNode.insertBefore(placeholder, movingElement);
    }
  };
  const onMouseMove = e => {
    if (!isDraggingStarted) {
      isDraggingStarted = true;
      if (!movingElement.classList.contains('delete_card_button')) {
        createPlaceholder();
        movingElement.classList.add('dragged');
      }
    }
    if (movingElement && movingElement.classList.contains('card') && !movingElement.classList.contains('delete_card_button')) {
      moveAt(movingElement, e.pageX, e.pageY);
    } else {
      return;
    }
    elementBelow = getElementBelow(movingElement, 'by-center');
    if (!elementBelow) return;
    let droppableBelow = elementBelow.closest('.card');
    if (currentDroppable != droppableBelow) {
      currentDroppable = droppableBelow;
      if (currentDroppable && !movingElement.classList.contains('delete_card_button')) {
        if (!isAbove(movingElement, currentDroppable) || currentDroppable.classList.contains('emptySectionHiddenCard')) {
          currentDroppable.parentNode.insertBefore(placeholder, currentDroppable);
        } else {
          currentDroppable.parentNode.insertBefore(placeholder, currentDroppable.nextElementSibling);
        }
      }
    }
  };
  const setMovingElement = e => {
    //выбор перетаскиваемой карточки, запись в переменную
    movingElement = e.target;
  };
  const onMouseDown = e => {
    //действия при нажатии кнопки мыши
    setMovingElement(e);
    shifts.set(e.clientX, e.clientY, movingElement);
    document.addEventListener('mousemove', onMouseMove); //логика перемещения карточки
    movingElement.onmouseup = onMouseUp;
  };
  const onMouseUp = () => {
    //действия при отжатии кнопки мыши
    if (!isDraggingStarted) {
      document.removeEventListener('mousemove', onMouseMove);
      movingElement.onmouseup = null;
      return;
    }
    if (movingElement && !movingElement.classList.contains('delete_card_button') && !movingElement.classList.contains('emptySectionHiddenCard')) {
      if (placeholder) {
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
  };
  cards.forEach(card => {
    card.onmousedown = onMouseDown;
    card.ondragstart = () => {
      return false;
    };
  });
}
;// CONCATENATED MODULE: ./src/js/Visual.js



class Visual {
  constructor() {
    this.newCardArr = document.querySelectorAll('.new_card_button');
    this.closeAddArr = document.querySelectorAll('.close_add_button');
    this.addNewCardBtns = document.querySelectorAll('.add_button');
    this.locStorWork = new LocalStorageWork();
  }
  init() {
    this.addNewCardBlock();
    this.closeAddNewCardBlock();
    this.addNewCard();
    this.onCardMouseEvent();
    this.deleteCard();
  }
  addNewCardBlock() {
    this.newCardArr.forEach(el => {
      el.addEventListener('click', ev => {
        ev.target.classList.add('hide');
        el.previousElementSibling.classList.remove('hide');
      });
    });
  }
  closeAddNewCardBlock() {
    this.closeAddArr.forEach(el => {
      el.addEventListener('click', () => {
        const closestAcc = el.closest('.add_card_container');
        closestAcc.classList.add('hide');
        closestAcc.firstElementChild.value = '';
        closestAcc.nextElementSibling.classList.remove('hide');
      });
    });
  }
  addNewCard() {
    this.addNewCardBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const thisTextarea = btn.closest('.add_card_container').firstElementChild;
        if (thisTextarea.value !== '') {
          btn.closest('.add_card_container').previousElementSibling.insertAdjacentHTML('beforeend', cardTemplate(thisTextarea.value));
          this.locStorWork.setToLocalStorage(btn.closest('.column').firstElementChild.nextElementSibling.dataset.id, thisTextarea.value);
        }
        this.onCardMouseEvent();
        this.deleteCard();
        DnD();
      });
    });
  }
  deleteCard() {
    document.querySelectorAll('.delete_card_button').forEach(btn => {
      btn.addEventListener('click', ev => {
        const card = ev.target.closest('.card');
        card.remove();
        this.locStorWork.deleteFromLocalStorage();
      });
    });
  }
  onCardMouseEvent() {
    document.querySelectorAll('.card').forEach(card => {
      if (card && !card.classList.contains('emptySectionHiddenCard')) {
        card.addEventListener('mouseover', () => {
          card.querySelector('.delete_card_button').style.color = '#000';
        });
        card.addEventListener('mouseout', () => {
          card.querySelector('.delete_card_button').style.color = '#fff';
        });
      }
    });
  }
}
;// CONCATENATED MODULE: ./src/js/app.js
// TODO: write code here



const view = new Visual();
const lsw = new LocalStorageWork();
lsw.getFromLocalStorage();
view.init();
DnD();
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;