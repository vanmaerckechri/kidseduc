class Turtle
{
	constructor(posRow, posCol)
	{
		this.canvas = document.getElementById('turtle-canvas');
		this.ctx = this.canvas.getContext('2d');

		this.img;

		this.imgSrc = './assets/img/turtle.png';
		this.spriteSizeSrcX = 64;
		this.spriteSizeSrcY = 64;
		this.imgSrcRow = 0;
		this.imgSrcCol = 0;

		this.cellHeight = 4;
		this.cellWidth = 3;
		this.angle = 90;
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

		this.img;

		this.imgSrc = './assets/img/player.png';
		this.spriteSizeSrcX = 64;
		this.spriteSizeSrcY = 64;
		this.imgSrcRow = 0;
		this.imgSrcCol = 0;

		this.cellHeight = 2;
		this.cellWidth = 2;
		this.angle = 0;
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
			player: new Player(Math.floor((this.rowsLength / 3) * 2), Math.floor(this.colsLength / 2)),
			turtle: new Turtle(Math.floor(this.rowsLength / 3), Math.floor(this.colsLength / 3))
		}
	}
}