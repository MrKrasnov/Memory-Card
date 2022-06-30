class GameScene extends Phaser.Scene {
    constructor() {
        super('Game')
    }

    preload() {
        this.load.image('card', './assets/card.png');
        for (let item of config.cards) {
            this.load.image(`card${item}`, `./assets/openCard/card${item}.png`);
        }
    }

    create() {
        this.createCards();
        this.createText();
        this.start();
    }

    update() { }

    createText() {
        this.timeoutText = this.add.text(5, 5, "Time: 30", {
            font: '36px minecraft',
            fill: '#ffffff',
        });
    }

    createCards() {
        this.cards = [];

        for (let item of config.cards) {
            for (let i = 0; i < config.rows; i++) {
                this.cards.push(new Card(this, item));
            }
        }

        this.input.on('gameobjectdown', this.onCardClicked, this);
    }

    start() {
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.initCard();
    }

    initCard() {
        let positions = this.getCardsPositions();

        this.cards.forEach(card => {
            let position = positions.pop();
            // закрыть каждую карту
            card.close();
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
            this.start();
        }
    }

    getCardsPositions() {
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + 10;
        let cardHeight = cardTexture.height + 10; // высота и ширина картиночки
        let positions = [];
        let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2;
        let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;

        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                positions.push({
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                })
            }
        }
        return Phaser.Utils.Array.Shuffle(positions);
    }

}