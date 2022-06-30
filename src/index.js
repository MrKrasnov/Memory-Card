const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 720,
    backgroundColor: '#4488aa',
    cols: 5,
    rows: 2,
    cards: [1, 2, 3, 4, 5],
    scene: new GameScene,
};
let game = new Phaser.Game(config);

