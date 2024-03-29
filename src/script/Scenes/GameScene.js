import Phaser from "phaser";
import Card from "../Classes/Card";
import { constants } from "../constants";

export default class GameScene extends Phaser.Scene {

    constructor() {
        super('Game');
        this.lvl = "LEVEL4";
    }

    preload() {
        this.load.image('card', './assets/card.png');
        for (let item of constants[this.lvl].CARDS) {
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
        if (this.timeout <= 0) {
            this.timer.paused = true;
            this.sounds.timeout.play();
            this.restart();
        }
        this.timeoutText.setText(`Time: ${this.timeout--}`);
    }

    createTimer() {
        this.timer = this.time.addEvent({
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

        for (let item of constants[this.lvl].CARDS) {
            for (let i = 0; i < constants[this.lvl].ROWS; i++) {
                this.cards.push(new Card(this, item));
            }
        }

        this.input.on('gameobjectdown', this.onCardClicked, this);
    }

    restart() {
        if (!this.isStarted) return;
        this.isStarted = false;

        let count = 0;
        let asyncStart = () => {
            ++count;
            if (count >= this.cards.length) this.start()
        }

        this.cards.forEach(card => {
            card.move(this.sounds.pushCard, {
                x: this.sys.game.config.width + card.width,
                y: this.sys.game.config.height + card.height,
                delay: card.position.delayShow,
                callback: asyncStart,
            });
        });
    }

    start() {
        this.initGetCardsPositions()
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.timeout = constants[this.lvl].TIMEOUT;
        this.timer.paused = false;
        this.isStarted = true;
        this.initCard();
        this.showCards();
    }

    initCard() {
        let positions = Phaser.Utils.Array.Shuffle(this.positions);

        this.cards.forEach(card => {
            card.init(positions.pop());
        });
    }

    showCards() {
        this.cards.forEach(card => {
            card.depth = card.position.delayShow;
            card.move(this.sounds.pushCard, {
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delayShow,
            });
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
                card.open(0, () => {
                    if (this.openedCardsCount === (this.cards.length / 2)) {
                        this.sounds.complete.play();
                        card.close();
                        this.restart();
                    }
                });
                card.close(500);
                this.openedCard = null;
                return false;
            }
        } else {
            // if once card dot't open
            this.openedCard = card;
        }

        card.open(0, () => {
            // условие победы
            if (this.openedCardsCount === (this.cards.length / 2)) {
                this.sounds.complete.play();
                card.close();
                this.restart();
            }
        });
    }

    initGetCardsPositions() {
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + 10;
        let cardHeight = cardTexture.height + 10; // высота и ширина картиночки
        let positions = [];
        let offsetX = (this.sys.game.config.width - cardWidth * constants[this.lvl].COLS) / 2 + cardWidth / 2;
        let offsetY = (this.sys.game.config.height - cardHeight * constants[this.lvl].ROWS) / 2 + cardHeight / 2;
        let id = 0;

        for (let row = 0; row < constants[this.lvl].ROWS; row++) {
            for (let col = 0; col < constants[this.lvl].COLS; col++) {
                positions.push({
                    delayShow: ++id * 100,
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                })
            }
        }
        this.positions = positions;
    }

}