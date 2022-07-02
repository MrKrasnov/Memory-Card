import Phaser from "phaser";
/**
 * Represents a card.
 */
export default class Card extends Phaser.GameObjects.Sprite {
    /**
   * Makes a new dot and initializes it.
   * @param {Phaser.Scene} scene - The scene that this belongs to
   * @param {value} value - The card image which can obtain behind the card
   */
    constructor(scene, value) {
        super(scene, 0, 0, 'card')
        this.scene = scene;
        this.value = value;
        this.scene.add.existing(this); // добавляет на экран
        this.setInteractive(); // разрешает взаимодействие с событиями
        this.opened = false;

    }

    init(position) {
        // закрыть каждую карту
        this.position = position;
        this.opened = false;
        this.setTexture('card');
        // меняем для каждой карточки позиции
        this.setPosition(-this.width, -this.height);
    }

    move(soundPush) {
        this.scene.tweens.add({
            targets: this,
            x: this.position.x,
            y: this.position.y,
            easy: 'Linear',
            duration: 250,
            delay: this.position.delayShow,
            onComplete: () => {
                this.setPosition(this.position.x, this.position.y);
                soundPush.play();
            }
        });
    }

    hide(delay) {
        let texture = this.opened ? 'card' + this.value : 'card';
        this.hideVar = this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            easy: 'Linear',
            duration: 150,
            delay: delay,
            onComplete: () => {
                this.show(delay, texture);
            }
        });
    }

    show(delay, texture) {
        this.showVar = this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            easy: 'Linear',
            duration: 150,
            delay: delay,
            changeCard: () => this.setTexture(texture)
        });
    }

    open(delay = 0) {
        this.opened = true;
        this.hide(delay);
    }

    close(delay = 0) {
        this.opened = false;
        this.hide(delay);
    }

}