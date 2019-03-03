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

		this.idleAnimTempo = null;
		this.animImgLength = 5;
		this.imgSrc = './assets/img/turtle.png';
		this.spriteSizeSrcX = 128;
		this.spriteSizeSrcY = 128;
		this.imgSrcRow = 0;
		this.imgSrcCol = 0;

		this.cellHeight = 3;
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
		this.spriteSizeSrcX = 1080;
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

class Bushes
{
	constructor(posRow, posCol, cellWidth)
	{
		this.canvas = document.getElementById('board-canvas');
		this.ctx = this.canvas.getContext('2d');

		this.img;

		this.imgSrc = './assets/img/bushes.png';
		this.spriteSizeSrcX = 16;
		this.spriteSizeSrcY = 32;
		this.imgSrcRow = 0;
		this.imgSrcCol = 0;

		this.cellHeight = 2;
		this.cellWidth = cellWidth;
		this.angle = 0;
		this.posRow = posRow;
		this.posCol = posCol;
	}
}