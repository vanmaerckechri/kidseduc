class Turtle
{
	constructor(posRow, posCol)
	{
		this.canvas = document.getElementById('turtle-canvas');
		this.ctx = this.canvas.getContext('2d');

		this.imgSrc = './assets/img/turtle.png';
		this.img;
		this.spriteRatio;
		this.spriteSizeSrc = 64;
		this.spriteSize = 32;
		this.angle = 0;
		this.imgRow = 0;
		this.imgCol = 0;
		this.posRow = posRow;
		this.posCol = posCol;
	}

	get getMethods()
	{
		return ['moveFront', 'moveBack'];
	}
}

class Player
{
	constructor(posRow, posCol)
	{
		this.canvas = document.getElementById('player-canvas');
		this.ctx = this.canvas.getContext('2d');

		this.imgSrc = './assets/img/player.png';
		this.img;
		this.spriteRatio;
		this.spriteSizeSrc = 64;
		this.spriteSize = 32;
		this.angle = 0;
		this.imgRow = 0;
		this.imgCol = 0;
		this.posRow = posRow;
		this.posCol = posCol;
	}

	get getMethods()
	{
		return ['moveFront', 'moveBack', 'rotateRight', 'rotateLeft', 'rotate'];
	}
}

class Map
{
	constructor()
	{
		this.cellSize = 16;
		this.rowsLength = 21,
		this.colsLength = 21,

		this.objectList =
		{
			player: new Player(Math.floor((this.rowsLength * 2) / 3), Math.floor(this.colsLength / 2)),
			turtle: new Turtle(Math.floor(this.rowsLength / 3), Math.floor(this.colsLength / 3))
		}
	}
}