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

        this.load.audio('card', './assets/sounds/card.mp3');
        this.load.audio('complete', './assets/sounds/complete.mp3');
        this.load.audio('success', './assets/sounds/success.mp3');
        this.load.audio('theme', './assets/sounds/theme.mp3');
        this.load.audio('timeout', './assets/sounds/timeout.mp3');
        this.load.audio('pushCard', './assets/sounds/sound_push_card.mp3');
    }

    create() {
        this.createSounds();
        this.createTimer();
        this.createCards();
        this.createText();
        this.start();
    }

    update() { }

    createSounds() {
        this.sounds = {
            card: this.sound.add('card'),
            complete: this.sound.add('complete'),
            success: this.sound.add('success'),
            theme: this.sound.add('theme'),
            timeout: this.sound.add('timeout'),
            pushCard: this.sound.add('pushCard')
        }
        this.sounds.theme.loop = true;
        this.sounds.theme.play({
            volume: 0.1
        });

    }

    onTimerTick() {
        if (this.timeout < 0) {
            this.sounds.timeout.play();
            this.start();
        }
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
        this.showCards();
    }

    initCard() {
        let positions = this.getCardsPositions();

        this.cards.forEach(card => {
            card.init(positions.pop());
        });
    }

    showCards() {
        this.cards.forEach(card => {
            card.move(this.sounds.pushCard);
        });
    }

    onCardClicked(pointer, card) {
        this.sounds.card.play();
        if (card.opened) {
            return false;
        }
        // уже есть открытая карта
        if (this.openedCard) {
            if (this.openedCard.value === card.value) {
                // if the images are the same
                this.openedCard = null;
                this.sounds.success.play();
                ++this.openedCardsCount;
            } else {
                // if images are different
                this.openedCard.close();
                card.open(0);
                card.close(500);
                this.openedCard = null;
                return false;
            }
        } else {
            // if once card dot't open
            this.openedCard = card;
        }

        card.open();

        if (this.openedCardsCount === (this.cards.length / 2)) {
            this.sounds.complete.play();
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
        let id = 0;

        for (let row = 0; row < constants.ROWS; row++) {
            for (let col = 0; col < constants.COLS; col++) {
                positions.push({
                    delayShow: ++id * 100,
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                })
            }
        }
        return Phaser.Utils.Array.Shuffle(positions);
    }

}