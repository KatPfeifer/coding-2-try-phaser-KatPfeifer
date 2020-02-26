import ExampleObject from '../objects/exampleObject';
import { GameObjects } from 'phaser';
import { Beam } from '../objects/Beam';

export default class MainScene extends Phaser.Scene {
  private background: any;
  private player: any;
  private cursorKeys: any;
  private tennisball: any;
  private bee: any;
  private playerspeed: any;
  private chocolate: any;
  private bone: any;
  private scoreLabel: any;
  private score: any;
  private bark: any;
  private music: any;

  constructor() {
    super({ key: 'MainScene' });
  }


  create() {
    this.playerspeed=200;
    this.background=this.add.tileSprite(0,0, this.scale.width*4, this.scale.height*4, "background");
   
    this.player=this.physics.add.image(this.scale.width/2, this.scale.height-64, "dog");
    this.player.setScale(.1);
    this.cursorKeys=this.input.keyboard.createCursorKeys();
    
    this.tennisball=this.physics.add.image(40, 90, "tennisball");
    this.tennisball.setScale(.08).setVelocity(150,170).setCollideWorldBounds(true).setBounce(1);
  
    this.bee=this.physics.add.image(0, 40, "bee");
    this.bee.setScale(0.06);
    this.resetBeePos(this.bee);

    this.chocolate=this.physics.add.image(0, 60, "chocolate");
    this.chocolate.setScale(0.08);
    this.resetChocPos(this.chocolate);

    this.bone=this.physics.add.image(0, 0, "bone");
    this.bone.setScale(0.08);
    this.resetBonePos(this.bone);

    this.bark=this.sound.add("bark");
    this.music=this.sound.add("music");

    let musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 1,
      seek: 1,
      loop: false,
      delay: 0
    }

    this.music.play(musicConfig);
    this.scoreLabel=this.add.bitmapText(10,5,"pixelFont", "SCORE", 16);
    this.score=0;
    this.scoreLabel.text="SCORE: "+ this.score;

    this.physics.add.overlap(this.player, this.bee, this.beesHurt, undefined, this);
    this.physics.add.overlap(this.player, this.chocolate, this.chocolateBad, undefined, this);
    this.physics.add.overlap(this.player, this.bone, this.boneGood, undefined, this);
    this.physics.add.overlap(this.player, this.tennisball, this.fetched, undefined, this);
  } 

  update() {
    this.background.tilePositionY-=0.5;
    this.movePlayerManager();
    this.moveBee(this.bee, 3);
    this.moveChoc(this.chocolate, 4);
    this.moveBone(this.bone, 3);
  }

  moveBee(bee, speed){
    bee.y+=speed;
    if (bee.y>this.scale.height){
      this.resetBeePos(bee);
    }
  }

  moveChoc(chocolate, speed){
    chocolate.y+=speed;
    if (chocolate.y>this.scale.height){
      this.resetChocPos(chocolate);
    }
  }

  moveBone(bone, speed){
    bone.x+=speed;
    if (bone.x>this.scale.width){
      this.resetBonePos(bone);
    }
  }

  resetBeePos(bee){
    bee.y=0;
    let randomX=Phaser.Math.Between(0, this.scale.width);
    bee.x=randomX;
  }

  resetChocPos(chocolate){
    chocolate.y=0;
    let randomX=Phaser.Math.Between(0, this.scale.height);
    chocolate.x=randomX;
  }

  resetBonePos(bone){
    bone.x=0;
    bone.y=Phaser.Math.Between(0, this.scale.width);
  }

  resetTennisballPos(tennisball){
    tennisball.x=Phaser.Math.Between(0, this.scale.width);
    tennisball.y=Phaser.Math.Between(0, this.scale.height);
  }

  beesHurt(player, bee){
    this.score-=20;
    if (this.playerspeed>20){
      this.playerspeed-=20;
    }
    this.resetBeePos(bee);
    this.scoreLabel.text="SCORE: "+ this.score;
  }

  chocolateBad(player, chocolate){
    this.score-=30;
    if (this.playerspeed>30){
      this.playerspeed-=30;
    }
    this.resetChocPos(chocolate);
    this.scoreLabel.text="SCORE: "+ this.score;
  }

  boneGood(player, bone){
    this.score+=30;
    if (this.playerspeed<250){
      this.playerspeed+=30;
    }
    this.resetBonePos(bone);
    this.scoreLabel.text="SCORE: "+ this.score;
  }

  fetched(player, tennisball){
    this.bark.play();
    this.score+=100;
    this.resetTennisballPos(tennisball);
    this.scoreLabel.text="SCORE: "+ this.score;
  }

  movePlayerManager(){
    if (this.cursorKeys.left.isDown){
      this.player.setVelocityX(-this.playerspeed);
    } else if (this.cursorKeys.right.isDown){
      this.player.setVelocityX(this.playerspeed);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.cursorKeys.down.isDown){
      this.player.setVelocityY(this.playerspeed);
    } else if (this.cursorKeys.up.isDown){
      this.player.setVelocityY(-this.playerspeed);
    } else {
      this.player.setVelocityY(0);
    }
  }
}
