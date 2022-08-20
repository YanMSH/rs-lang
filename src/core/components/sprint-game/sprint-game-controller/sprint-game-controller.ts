import { SprintGameView } from "../sprint-game-view/sprint-game-view";

export class SprintGameController {
  public sprintGameView: SprintGameView;
  constructor() {
    this.sprintGameView = new SprintGameView();
  }
  render() {
    this.sprintGameView.render();
  }
}