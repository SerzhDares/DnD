export default function DnD() {

    const cardsContainer = document.querySelectorAll('.cards-container');

    let actualElement;

    const onMouseUp = e => {
        const mouseUpCard = e.target;

        cardsContainer.forEach(container => {
            container.insertBefore(actualElement, mouseUpCard);
        })
        
        actualElement.classList.remove('dragged');
        actualElement = undefined;

        document.documentElement.removeEventListener('mouseup', onMouseUp);
        document.documentElement.removeEventListener('mouseover', onMouseOver);
    }

    const onMouseOver = e => {
        console.log(e);

        actualElement.style.top = e.clientY + 'px';
        actualElement.style.left = e.clientX + 'px';
    }

    cardsContainer.forEach(container => {
        container.addEventListener('mousedown', e => {
            e.preventDefault();
            actualElement = e.target;
            actualElement.classList.add('dragged');

            document.documentElement.addEventListener('mouseup', onMouseUp);
            document.documentElement.addEventListener('mouseover', onMouseOver);
        })
    })

}

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

