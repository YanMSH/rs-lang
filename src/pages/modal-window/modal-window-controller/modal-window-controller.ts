import ModalWindowView from '../modal-window-view/modal-window-view';
import { Stat } from '../../../core/types/controller-types';
import Storage from '../../../core/components/service/storage/storage'; 

export default class ModalWindowController {
    public modal: ModalWindowView;
    public storage: Storage;

    constructor() {
    this.modal = new ModalWindowView();
    this.storage = new Storage();
}

renderModalWindow() {
    const statistic = JSON.parse(this.storage.get('gameStatistic') as string) as Stat;
    this.modal.createModalWindow(statistic);
    }
}