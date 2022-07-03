import { call } from "file-loader";
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
        this.scene.add.existing(this); // show card in the game
        this.setInteractive(); // unlock events
        this.opened = false;

    }

    init(position) {
        this.position = position;
        // hold close cards
        this.opened = false;
        this.setTexture('card');
        // set position for each card
        this.setPosition(-this.width, -this.height);
    }

    move(soundPush, position) {
        this.scene.tweens.add({
            targets: this,
            x: position.x,
            y: position.y,
            easy: 'Linear',
            duration: 250,
            delay: position.delay,
            onComplete: () => {
                this.setPosition(this.position.x, this.position.y);
                soundPush.play();
                if (position.callback) position.callback();
            }
        });
    }

    hide(delay, callback) {
        let texture = this.opened ? 'card' + this.value : 'card';
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            easy: 'Linear',
            duration: 150,
            delay: delay,
            onComplete: () => {
                this.show(delay, texture, callback);
            }
        });
    }

    show(delay, texture, callback) {
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            easy: 'Linear',
            duration: 150,
            delay: delay,
            changeCard: () => {
                this.setTexture(texture)
                if (callback) {
                    callback();
                }
            }
        });
    }

    open(delay, callback) {
        this.opened = true;
        this.hide(delay, callback);
    }

    close(delay = 0) {
        this.opened = false;
        this.hide(delay);
    }

}