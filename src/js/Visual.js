import cardTemplate from "./cardTemplate";
import LocalStorageWork from "./LocalStorageWork";
import DnD from "./dnd";


export default class Visual {
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
                    this.locStorWork.setToLocalStorage(btn.closest('.column').firstElementChild.nextElementSibling.dataset.id, thisTextarea.value);
                }
                this.onCardMouseEvent();
                this.deleteCard();
                // DnD();
            })
        })
    }

    deleteCard() {
        document.querySelectorAll('.delete_card_button').forEach(btn => {
            btn.addEventListener('click', ev => {
                const card = ev.target.closest('.card');
                card.remove();
                this.locStorWork.deleteFromLocalStorage();
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
}