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

		this.onTurtle = false;
	}

	get getMethods()
	{
		return ['moveFront', 'moveBack', 'rotateRight', 'rotateLeft', 'rotate'];
	}
}

class Star
{
	constructor(posRow, posCol)
	{
		this.canvas = document.getElementById('star-canvas');
		this.ctx = this.canvas.getContext('2d');

		this.img;

		this.imgSrc = './assets/img/star.png';
		this.spriteSizeSrcX = 64;
		this.spriteSizeSrcY = 64;
		this.imgSrcRow = 0;
		this.imgSrcCol = 0;

		this.cellHeight = 1;
		this.cellWidth = 1;
		this.angle = 0;
		this.posRow = posRow;
		this.posCol = posCol;
	}
}

class Turtle
{
	constructor()
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
		this.posRow = 0;
		this.posCol = 0;
	}

	get getMethods()
	{
		return ['moveFront', 'moveBack'];
	}
}

class Water
{
	constructor(posRow, posCol)
	{
		this.canvas = document.getElementById('board-canvas');
		this.ctx = this.canvas.getContext('2d');

		this.img;

		this.imgSrc = './assets/img/water.png';
		this.spriteSizeSrcX = 336;
		this.spriteSizeSrcY = 80;
		this.imgSrcRow = 0;
		this.imgSrcCol = 0;

		this.cellHeight = 5;
		this.cellWidth = 22;
		this.angle = 0;
		this.posRow = posRow;
		this.posCol = posCol;
	}
}

class Map
{
	constructor()
	{
		this.canvasPadding = 10;

		this.canvas = document.getElementById('board-canvas');
		this.ctx = this.canvas.getContext('2d');

		this.cellSize = 16;
		this.rowsLength = 21,
		this.colsLength = 21,
		this.cellsInfos = [],

		this.water = new Water(Math.floor(this.rowsLength / 2), Math.floor(this.colsLength / 2));
		/*this.water['cellHeight'] = this.water['spriteSizeSrcY'] / this.cellSize;
		this.water['cellWidth'] = this.water['spriteSizeSrcX'] / this.cellSize;*/

		this.objectList =
		{
			player: new Player(Math.floor((this.rowsLength / 5) * 4), Math.floor(this.colsLength / 2)),
			turtle: new Turtle()
		}
		this.objectList['turtle']['posRow'] = Math.floor(this.water['posRow']);
		this.objectList['turtle']['posCol'] = Math.floor(this.colsLength / 5);

		this.starsList = 
		{
			star1: new Star(Math.floor(this.rowsLength / 5), Math.floor(this.colsLength / 6)),
			star2: new Star(Math.floor(this.rowsLength / 5), Math.floor((this.colsLength / 6) * 3)),
			star3: new Star(Math.floor(this.rowsLength / 5), Math.floor((this.colsLength / 6) * 5))
		}
	}
}