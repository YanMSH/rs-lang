export default class LevelPage {
    public renderLevelPage(wrapperClass: string, levelMessage: string) {
        const main = document.querySelector('main') as HTMLElement;
        main.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.classList.add(wrapperClass);
        wrapper.classList.add('level-block');
        const message = this.welcomeMessage(levelMessage);
        const buttons = this.renderLevelButtons();
        wrapper.append(message, buttons);
        main.append(wrapper);
    }
    private welcomeMessage(messageText: string) {
        const message = document.createElement('span');
        message.classList.add('message');
        message.innerText = messageText;
        return message;
    }

    private renderOneButtons(count: number) {
        const level = document.createElement('button');
        level.classList.add('level');
        level.innerText = `${count}`;
        level.setAttribute('data-level', `${count}`);
        return level;
    }

    private renderLevelButtons(maxLevel = 6) {
        const levelButtons = document.createElement('div');
        levelButtons.classList.add('level-buttons');
        for (let i = 1; i <= maxLevel; i += 1) {
            const button = this.renderOneButtons(i);
            levelButtons.append(button);
        }
        return levelButtons;
    }
}
