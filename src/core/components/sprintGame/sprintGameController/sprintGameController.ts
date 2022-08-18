import { SprintGameView } from "../sprintGameView/sprintGameView";

export class SprintGameController {
  public sprintGameView: SprintGameView;
  constructor() {
    this.sprintGameView = new SprintGameView();
  }
  render() {
    this.sprintGameView.render();
  }
}