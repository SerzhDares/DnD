export default function cardTemplate(text) {
    return `<div class="card" draggable="true">
                <span class="card_text">${text}</span>
                <button class="button delete_card_button"></button>
            </div>`;
}