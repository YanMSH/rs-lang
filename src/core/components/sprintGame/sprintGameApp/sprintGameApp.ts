import '../sprintGame.css';
import { SprintGameController } from '../sprintGameController/sprintGameController';

export class SprintGameApp {
  public sprintGameController: SprintGameController; 
  constructor() {
    this.sprintGameController = new SprintGameController();
  }
  start() {
    this.sprintGameController.render();
  }
}
