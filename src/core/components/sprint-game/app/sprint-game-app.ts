import { SprintGameController } from '../sprint-game-controller/sprint-game-controller';

export class SprintGameApp {
  public sprintGameController: SprintGameController; 
  constructor() {
    this.sprintGameController = new SprintGameController();
  }
  starting() {
    this.sprintGameController.render();
  }
}
