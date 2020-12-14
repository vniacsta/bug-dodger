const gameState = {
  score: 0
};

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('bug1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
    this.load.image('bug2', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_2.png');
    this.load.image('bug3', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_3.png');
    this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png');
    this.load.image('codey', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/codey.png');
  }

  create() {
    const platforms = this.physics.add.staticGroup();
  
    platforms.create(320, 350, 'platform').setScale(2, 0.5).refreshBody();

    gameState.scoreText = this.add.text(280, 340, 'Score: 0', { fontSize: '15px', fill: '#000' });

    this.player = this.physics.add.sprite(320, 300, 'codey').setScale(.5);
    
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, platforms);

    const bugs = this.physics.add.group();

    const bugList = ['bug1', 'bug2', 'bug3'];

    const bugGen = () => {
      const xCoord = Math.random() * 640;
      let randomBug = bugList[Math.floor(Math.random() * 3)];
      bugs.create(xCoord, 10, randomBug);
    };

    const bugGenLoop = this.time.addEvent({
      delay: 100,
      callback: bugGen,
      loop: true
    });

    this.physics.add.collider(bugs, platforms, bug => {
      bug.destroy();
      gameState.score += 10;
      gameState.scoreText.setText(`Score: ${gameState.score}`);	
    });

    this.physics.add.collider(this.player, bugs, () => {
        bugGenLoop.destroy();
        this.physics.pause();

        this.add.text(250, 150, '   Game Over\nClick to Restart', { fontSize: '15px', fill: '#000' });
        gameState.score = 0;

        this.input.on('pointerdown', () => {
          this.scene.restart();
        });
    });
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.player.setVelocityX(-200);

    } else if (cursors.right.isDown) {
      this.player.setVelocityX(200);

    } else {
      this.player.setVelocityX(0);
    }
  }
}
