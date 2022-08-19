import { SprintGameController } from '../sprintGameController/sprintGameController';

export class SprintGameApp {
  public sprintGameController: SprintGameController; 
  constructor() {
    this.sprintGameController = new SprintGameController();
  }
  starting() {
    this.sprintGameController.render();
  }
}
