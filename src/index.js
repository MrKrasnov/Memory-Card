import Phaser from "phaser";
import GameScene from "./script/Scenes/GameScene";

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 720,
    backgroundColor: '#4488aa',
    scene: new GameScene,
};

const game = new Phaser.Game(config);