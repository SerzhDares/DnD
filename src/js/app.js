// TODO: write code here
import Visual from './Visual';
import LocalStorageWork from './LocalStorageWork';
import DnD from './dnd';

const view = new Visual();
const lsw = new LocalStorageWork();
lsw.getFromLocalStorage();
view.init();
DnD();
