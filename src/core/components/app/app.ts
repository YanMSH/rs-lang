import { SprintGameApp } from '../sprintGame/app/sprintGameApp';
export default class App {
  public sprintGameApp: SprintGameApp; 
  constructor() {
    this.sprintGameApp = new SprintGameApp();
  }
  starting() {
    this.sprintGameApp.starting();
    console.log('durak')
  }
}


