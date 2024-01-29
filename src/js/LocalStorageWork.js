import cardTemplate from "./cardTemplate";

export default class LocalStorageWork {

    getFromLocalStorage() {
        if (localStorage.getItem('TODO') || localStorage.getItem('INPROGRESS') || localStorage.getItem('DONE')) {
            Object.keys(localStorage).forEach(key => {
                const values = localStorage.getItem(key).split('\n');
                console.log(values);
                values.forEach(value => {
                    document.querySelector(`[data-id="${key.split('_')[0]}"]`).insertAdjacentHTML('beforeend', cardTemplate(value));
                })
            })
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
            if(container.children.length >= 1) {
                localStorage.setItem(container.dataset.id, container.innerText);
            } else {
                localStorage.removeItem(container.dataset.id);
            }
            if(!localStorage.getItem(container.dataset.id)) {
                localStorage.removeItem(container.dataset.id);
            }
        })
    }
}