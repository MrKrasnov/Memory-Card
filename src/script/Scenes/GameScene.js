import Phaser from "phaser";
import Card from "../Classes/Card";
import { constants } from "../constants";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game')
    }

    preload() {
        this.load.image('card', './assets/card.png');
        for (let item of constants.CARDS) {
            this.load.image(`card${item}`, `./assets/openCard/card${item}.png`);
        }
    }

    create() {
        this.createTimer();
        this.createCards();
        this.createText();
        this.start();
    }

    update() { }

    onTimerTick() {
        if (this.timeout < 0) this.start();
        this.timeoutText.setText(`Time: ${this.timeout--}`);
    }

    createTimer() {
        this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true,
        });
    }

    createText() {
        this.timeoutText = this.add.text(5, 5, "", {
            font: '36px minecraft',
            fill: '#ffffff',
        });
    }

    createCards() {
        this.cards = [];

        for (let item of constants.CARDS) {
            for (let i = 0; i < constants.ROWS; i++) {
                this.cards.push(new Card(this, item));
            }
        }

        this.input.on('gameobjectdown', this.onCardClicked, this);
    }

    start() {
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.timeout = constants.TIMEOUT;
        this.initCard();
    }

    initCard() {
        let positions = this.getCardsPositions();

        this.cards.forEach(card => {
            let position = positions.pop();
            // закрыть каждую карту
            card.opened = false;
            card.setTexture('card');
            // меняем для каждой карточки позиции
            card.setPosition(position.x, position.y);
        });
    }

    onCardClicked(pointer, card) {
        if (card.opened) {
            return false;
        }
        // уже есть открытая карта
        if (this.openedCard) {
            if (this.openedCard.value === card.value) {
                // если картинки равны - запомнить
                this.openedCard = null;
                ++this.openedCardsCount;
            } else {
                // если картинки разные скрыть их
                this.openedCard.close();
                card.open(0);
                card.close(500);
                this.openedCard = null;
                return false;
            }
        } else {
            // ещё не открывалась карта
            this.openedCard = card;
        }

        card.open();

        if (this.openedCardsCount === (this.cards.length / 2)) {
            card.close();
            this.start();
        }
    }

    getCardsPositions() {
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + 10;
        let cardHeight = cardTexture.height + 10; // высота и ширина картиночки
        let positions = [];
        let offsetX = (this.sys.game.config.width - cardWidth * constants.COLS) / 2 + cardWidth / 2;
        let offsetY = (this.sys.game.config.height - cardHeight * constants.ROWS) / 2 + cardHeight / 2;

        for (let row = 0; row < constants.ROWS; row++) {
            for (let col = 0; col < constants.COLS; col++) {
                positions.push({
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                })
            }
        }
        return Phaser.Utils.Array.Shuffle(positions);
    }

}