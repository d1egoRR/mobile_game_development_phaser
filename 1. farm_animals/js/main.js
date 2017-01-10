//this game will have only 1 state
var GameState = {
    
    //load the game assets before the game starts
    preload: function() {
        this.load.image('background', 'assets/images/background.png');
        /*this.load.image('chicken', 'assets/images/chicken.png');
        this.load.image('horse', 'assets/images/horse.png');
        this.load.image('pig', 'assets/images/pig.png');
        this.load.image('sheep', 'assets/images/sheep3.png');*/
        this.load.image('arrow', 'assets/images/arrow.png');
        
        this.load.spritesheet('chicken', 'assets/images/chicken_spritesheet.png', 131, 200, 3);
        this.load.spritesheet('horse', 'assets/images/horse_spritesheet.png', 212, 200, 3);
        this.load.spritesheet('pig', 'assets/images/pig_spritesheet.png', 297, 200, 3);
        this.load.spritesheet('sheep', 'assets/images/sheep_spritesheet.png', 244, 200, 3);
        
        this.load.audio('chickenSound', ['assets/audio/chicken.ogg', 'assets/audio/chicken.mp3']);
        this.load.audio('horseSound', ['assets/audio/horse.ogg', 'assets/audio/horse.mp3']);
        this.load.audio('pigSound', ['assets/audio/pig.ogg', 'assets/audio/pig.mp3']);
        this.load.audio('sheepSound', ['assets/audio/sheep.ogg', 'assets/audio/sheep.mp3']);

    },
    
    //executed after everything is loaded
    create: function() {
        this.background = this.game.add.sprite(0, 0, 'background');
        
        var animalData = [
            {key: 'chicken', text: 'CHICKEN', audio: 'chickenSound'},
            {key: 'horse', text: 'HORSE', audio: 'horseSound'},
            {key: 'pig', text: 'PIG', audio: 'pigSound'},
            {key: 'sheep', text: 'SHEEP', audio: 'sheepSound'},
        ];
        
        this.animals = this.game.add.group();
        
        var self = this;
        var animal;
        
        animalData.forEach(function(element) {
            animal = self.animals.create(-1000, self.game.world.centerY, element.key, 0);
            animal.anchor.setTo(0.5);
            animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false);
            animal.customParams = {text: element.text, sound: self.game.add.audio(element.audio)};
            animal.inputEnabled = true;
            animal.input.pixelPerfectClick = true;
            animal.events.onInputDown.add(self.animateAnimal, self);
        });
        
        this.currentAnimal = this.animals.next();
        this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);
        
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        this.scale.setScreenSize(true);
        
        /*this.pig = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'pig');
        this.pig.anchor.setTo(0.5);
        this.pig.scale.setTo(0.5);

        this.pig.inputEnabled = true;
        this.pig.input.pixelPerfectClick = true;
        this.pig.events.onInputDown.add(this.animateAnimal, this);*/
        
        this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
        this.rightArrow.anchor.setTo(0.5);
        this.rightArrow.customParams = {direction: 1};

        this.rightArrow.inputEnabled = true;
        this.rightArrow.input.pixelPerfectClick = true;
        this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

        this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
        this.leftArrow.anchor.setTo(0.5);
        this.leftArrow.customParams = {direction: -1};
        this.leftArrow.scale.x = -1;
        
        this.leftArrow.inputEnabled = true;
        this.leftArrow.input.pixelPerfectClick = true;
        this.leftArrow.events.onInputDown.add(this.switchAnimal, this);
        
        this.showText(this.currentAnimal);
        
    },
    
    showText: function(animal) {
        if (!this.animalText) {
        
            var style = {
                font: 'bold 30pt Arial',
                fill: '#D0171B',
                align: 'center'
            };

            this.animalText = this.game.add.text(this.game.width/2, this.game.height * 0.85, '', style);
            this.animalText.anchor.setTo(0.5);
        }
        
        this.animalText.setText(animal.customParams.text);
        this.animalText.visible = true;
    },
    
    switchAnimal: function(sprite, event) {
        //1. get the direction of arrow        
        //2. get next animal        
        //3. get final destination of current animal        
        //4. move current animal to final destination        
        //5. set the next animal as the new current animal
        
        if (this.isMoving)
        {
            return false;
        }
        
        this.isMoving = true;
        
        this.animalText.visible = false;
        
        var newAnimal, endX;
        
        if (sprite.customParams.direction > 0)
        {
            newAnimal = this.animals.next();
            newAnimal.x = -newAnimal.width/2
            endX = 640 + this.currentAnimal.width / 2;
        }
        else
        {
            newAnimal = this.animals.previous();
            newAnimal.x = 640 + newAnimal.width/2;
            endX = -this.currentAnimal.width / 2;
        }
        
        //this.currentAnimal.x = endX;
        //newAnimal.x = this.game.world.centerX;
        var newAnimalMovement = game.add.tween(newAnimal);
        newAnimalMovement.to({x: this.game.world.centerX}, 1000);
        newAnimalMovement.onComplete.add(function() {
            this.isMoving = false;
            this.showText(newAnimal);
        }, this);
        newAnimalMovement.start();
        
        var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({x: endX}, 1000);
        currentAnimalMovement.start();
        
        this.currentAnimal = newAnimal;
    },
    
    animateAnimal: function(sprite, event) {
        sprite.play('animate');
        sprite.customParams.sound.play();
    },
    
    //this is executed multiple times per second
    update: function() {
    },
  

};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');