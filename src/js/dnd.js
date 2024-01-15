import cardTemplate from "./cardTemplate";

export default class DnD {
    constructor() {
        this.newCardArr = document.querySelectorAll('.new_card_button');
        this.closeAddArr = document.querySelectorAll('.close_add_button');
        this.addNewCardBtns = document.querySelectorAll('.add_button');
    }

    getFromLocalStorage() {
        if (localStorage.length !== 0) {
            Object.keys(localStorage).forEach(key => {
                const value = localStorage.getItem(key);
                if (value !== '\n') {
                    document.querySelector(`[data-id="${key}"]`).insertAdjacentHTML('beforeend', cardTemplate(value));
                }
            })
        }
    }

    addNewCardBlock() {
        this.newCardArr.forEach(el => {
            el.addEventListener('click', ev => {
                ev.target.classList.add('hide');
                el.previousElementSibling.classList.remove('hide');
            })
        })
    }

    closeAddNewCardBlock() {
        this.closeAddArr.forEach(el => {
            el.addEventListener('click', () => {
                const closestAcc = el.closest('.add_card_container');
                closestAcc.classList.add('hide');
                closestAcc.firstElementChild.value = '';
                closestAcc.nextElementSibling.classList.remove('hide');

            })
        })
    }

    addNewCard() {
        this.addNewCardBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const thisTextarea = btn.closest('.add_card_container').firstElementChild;
                if (thisTextarea.value !== '') {
                    btn.closest('.add_card_container').previousElementSibling.insertAdjacentHTML('beforeend', cardTemplate(thisTextarea.value));
                    this.deleteCard();
                    this.onCardMouseEvent();
                    this.setToLocalStorage(btn.closest('.column').firstElementChild.nextElementSibling.dataset.id, thisTextarea.value);
                }
            })
        })
    }

    deleteCard() {
        document.querySelectorAll('.delete_card_button').forEach(btn => {
            btn.addEventListener('click', () => {
                localStorage.removeItem(btn.closest('.card'));
                btn.closest('.card').remove();
            })
        })
    }

    onCardMouseEvent() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseover', () => {
                card.lastElementChild.style.color = '#000';
            })
            card.addEventListener('mouseout', () => {
                card.lastElementChild.style.color = '#fff';
            })
        })
    }

    setToLocalStorage(key, value) {
        if (localStorage.getItem(key)) {
            localStorage.setItem(key, localStorage.getItem(key) + '\n' + value); 
        } else {
            localStorage.setItem(key, value);
        }
        
    }
}