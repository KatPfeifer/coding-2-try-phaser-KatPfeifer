export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image('background', "assets/images/background.png");
    this.load.image("dog", "assets/images/dog.png");
    this.load.image('tennisball', "assets/images/tennisball.jpg");
    this.load.image('bee', "assets/images/bee.png");
    this.load.image('chocolate', "assets/images/chocolate.png");
    this.load.image('bone', "assets/images/bone.png");
  }

  create() {
    this.scene.start('MainScene');
  }
}
