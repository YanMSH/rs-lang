import { SprintGameView } from "../sprint-game-view/sprint-game-view";
import LevelPage from "../sprint-game-view/level-page";
import { sprintLevelMessage } from "../../../core/constants/level-const";
import Storage from '../../../core/components/service/storage/storage';
export class SprintGameController {
  public sprintGameView: SprintGameView;
  public levelPage: LevelPage;
  public sprintLevelMessage: string;
  public storage: Storage;

  constructor() {
    this.sprintGameView = new SprintGameView();
    this.levelPage = new LevelPage();
    this.sprintLevelMessage = sprintLevelMessage;
    this.storage = new Storage();
  }
  render() {
    this.sprintGameView.render();
  }
  chooseLevel() {
    this.levelPage.renderLevelPage('wrapper-sprint', this.sprintLevelMessage);
    const level = document.querySelectorAll('.level');
    level.forEach((elem) => {
      elem.addEventListener('click', () => {
        const buttonLevel = elem.getAttribute('data-level') as string;
        this.sprintGameView.render();
        this.storage.set('sprintLevel', buttonLevel);
      });
    });
  }
}