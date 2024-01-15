// TODO: write code here
import DnD from './dnd';

console.log('app.js bundled');
const dnd = new DnD();
dnd.getFromLocalStorage();
dnd.addNewCardBlock();
dnd.closeAddNewCardBlock();
dnd.addNewCard();
