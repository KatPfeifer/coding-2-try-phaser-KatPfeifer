import ExampleObject from '../objects/exampleObject';
import { GameObjects } from 'phaser';
import { Beam } from '../objects/Beam';

export default class gameScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private ship1: any;
  private ship2: any;
  private ship3: any;
  private background: any;
  private powerUps: any;
  private player: any;
  private cursorKeys: any;
  private spacebar: any;
  private projectiles: any;
  private enemies: any;

  constructor() {
    super({ key: 'gameScene' });
  }


  create() {
    this.background=this.add.tileSprite(0,0, this.scale.width*4, this.scale.height*4, "background");
    this.ship1=this.add.sprite(this.scale.width/2-50, this.scale.height/2-50, "ship");
    this.ship2=this.add.sprite(this.scale.width/2, this.scale.height/2, "ship2");
    this.ship3=this.add.sprite(this.scale.width/2+50, this.scale.height/2+50, "ship3");
    //this.player=this.physics.add.image(this.scale.width/2, this.scale.height-64, "dog");
    this.player=this.physics.add.sprite(this.scale.width/2-8, this.scale.height-64, "player");
    this.enemies=this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);
    

    
    
    this.powerUps = this.physics.add.group();

    var maxObjects =4;
    for (var i=0; i<= maxObjects; i++){
      var powerUp=this.physics.add.sprite(16,16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, this.scale.width, this.scale.height);

      if(Math.random()>0.5){
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }

      powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }

    

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on('gameobjectdown', this.destroyShip, this);
    this.cursorKeys=this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);
    this.spacebar=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.projectiles=this.add.group();

    this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
      projectile.destroy();
    });

    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, undefined, this);
  }

  pickPowerUp(player, powerUp){
    powerUp.disableBody(true, true);
  }

  hurtPlayer(player, enemy){
    this.resetShipPos(enemy);
    player.x = this.scale.width/2-8;
    player.y=this.scale.height-64;
  }

  hitEnemy(projectile, enemy){
    projectile.destroy();
    this.resetShipPos(enemy);
  }

  update() {
    this.moveShip(this.ship1,1);
    this.moveShip(this.ship2,2);
    this.moveShip(this.ship3,1);
    this.background.tilePositionY-=0.5;
    this.movePlayerManager();
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
      this.shootBeam();
    }
    for (var i=0; i<this.projectiles.getChildren().length; i++){
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }
  }

  movePlayerManager(){
    if(this.cursorKeys.left.isDown){
      this.player.setVelocityX(-200);
    }else if (this.cursorKeys.right.isDown){
      this.player.setVelocityX(200);
    }
    else {
      this.player.setVelocityX(0);
    }

    if(this.cursorKeys.up.isDown){
      this.player.setVelocityY(-200);
    } else if (this.cursorKeys.down.isDown){
      this.player.setVelocityY(200);
    }
    else {this.player.setVelocityY(0);}
  }

  moveItem(item, speed){
    item.y+=speed;
    if (item.y>this.scale.height){
      this.resetItemPos(item);
    }
  }

  resetItemPos(item){
    item.y=0;
    var randomX=Phaser.Math.Between(0, this.scale.width);
    item.x-randomX;
  }

  moveShip(ship, speed){
    ship.y+=speed;
    if (ship.y> this.scale.height){
      this.resetShipPos(ship);
    }
  }
  
  resetShipPos(ship){
    ship.y=0;
    var randomX=Phaser.Math.Between(0,this.scale.width);
    ship.x=randomX;
  }

  destroyShip(pointer, gameObject){
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  
  shootBeam(){
    var beam = new Beam(this);
  }
}
