document.addEventListener("DOMContentLoaded", function(event)
{
	class CodeLines
	{
		static cut()
		{
			let textarea = document.getElementById('code-container');
			//break code by lines
			let codeLines = textarea.value.split('\n');
			//break code lines by words
			for (let i = codeLines.length - 1; i >= 0; i--)
			{
				codeLines[i] = codeLines[i].split(' ');
			}
			return codeLines;
		}

		static check()
		{
			let codeLines = this.cut();
			console.log(codeLines);
		}

		static init()
		{
			let that = this;
			//init run button
			let runBtn = document.getElementById('run-button');
			runBtn.addEventListener('click', this.check.bind(this, that), false);
		}
	}

	class GameBoard
	{
		constructor(canvas, rowsLength, colsLength, spriteSizeSource)
		{
			this.spriteSizeSrc = spriteSizeSource;
			this.spriteSize = 0;

			this.canvasPadding = 10;
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			this.rowsLength = rowsLength;
			this.colsLength = colsLength;

			this.imgNameList = ['playerImg'];
			this.imgSrcList = ['./assets/img/player.png'];
			this.imgLoadedLength = this.imgSrcList.length;
			this.playerImg;

			this.playerAngle = 0;
			this.playerImgRow = 0;
			this.playerImgCol = 0;
			this.playerPosRow;
			this.playerPosCol;

			this.init();
  		}

  		rotateImg(img, sX, sY, sSize, dSize, rotateDeg)
  		{
  			let canvas = document.createElement('canvas');
  			let ctx = canvas.getContext('2d');

			canvas.width = Math.sqrt((dSize * dSize) + (dSize * dSize));
			canvas.height = canvas.width;

			let canvasHalfWidth = canvas.width / 2;
			let canvasHalfHeight = canvas.height / 2;

			ctx.translate(canvasHalfWidth, canvasHalfHeight);
 			ctx.rotate(rotateDeg * Math.PI / 180);
 			ctx.translate(- canvasHalfWidth, - canvasHalfHeight);

			let dMiddle = (canvasHalfWidth) - (dSize / 2);
  			ctx.drawImage(img, sX, sY, sSize, sSize, dMiddle, dMiddle, dSize, dSize);

  			return canvas;
  		}

  		drawPlayer()
  		{
  			let imgSrcPosX = this.playerImgCol * this.spriteSizeSrc;
  			let imgSrcPosY = this.playerImgRow * this.spriteSizeSrc;

  			let imgRot = this.rotateImg(this.playerImg, imgSrcPosX, imgSrcPosY, this.spriteSizeSrc, this.spriteSize, this.playerAngle);

  			let posX = (this.playerPosCol * this.spriteSize) + (this.spriteSize / 2) - (imgRot.width / 2);
  			let posY = (this.playerPosRow * this.spriteSize) + (this.spriteSize / 2) - (imgRot.height / 2);

  			this.ctx.drawImage(imgRot, 0, 0, imgRot.width, imgRot.height, posX, posY, imgRot.width, imgRot.height);
  		}

  		drawBoard()
  		{
  			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  			for (let r = 0, rLength = this.rowsLength; r < rLength; r++)
  			{
  				let posY = (this.spriteSize * r);
  				for (let c = 0, cLength = this.colsLength; c < cLength; c++)
  				{
  					let posX = (this.spriteSize * c);
					this.ctx.rect(posX, posY, this.spriteSize, this.spriteSize);
					//this.ctx.fillStyle = "blue"
					this.ctx.stroke();
  				}
  			}
  		}

  		playerMove(direction)
  		{
  			let hypo = 1;
  			let triangleWidth = hypo * Math.sin(this.playerAngle * Math.PI / 180);
  			let triangleHeight = -1 * (hypo * Math.cos(this.playerAngle * Math.PI / 180));

  			triangleWidth = this.playerAngle == 0 || this.playerAngle == 180 ? 0 : triangleWidth;
  			triangleHeight = this.playerAngle == 90 || this.playerAngle == 270 ? 0 : triangleHeight;

  			this.playerPosCol = direction == 'moveFront' ? this.playerPosCol + triangleWidth : this.playerPosCol - triangleWidth;
  			this.playerPosRow = direction == 'moveFront' ? this.playerPosRow + triangleHeight : this.playerPosRow - triangleHeight;

  			this.drawBoard();
  			this.drawPlayer();
  		}

  		playerRotate(direction)
  		{
  			if (typeof direction == "string")
  			{
  				this.playerAngle = direction == "rotateRight" ? this.playerAngle + 10 : this.playerAngle - 10;
  				if (this.playerAngle == 360)
  				{
  					this.playerAngle = 0;
  				}
  				else if(this.playerAngle == -90)
  				{
  					this.playerAngle = 270;
  				}
  			}
  			this.drawBoard();
  			this.drawPlayer();
  		}

  		// TEMP ===>
  		detectKey(that, event)
  		{
  			if (event.code == 'ArrowUp')
  			{
  				this.playerMove('moveFront');
  			}
  			else if (event.code == 'ArrowDown')
  			{
				this.playerMove('moveBack'); 				
  			}
  			else if (event.code == 'ArrowRight')
  			{
				this.playerRotate('rotateRight');
  			}
  			else if (event.code == 'ArrowLeft')
  			{
				this.playerRotate('rotateLeft'); 				
  			}
  		}
  		// <=== TEMP

  		updateCanvasSize()
  		{
  			this.initCanvas();

  			this.drawBoard();
  			this.drawPlayer();
  		}

  		initCanvasSize()
  		{
  			// rest canvas container size
  			this.canvas.width = 0;
  			this.canvas.height = 0;
  			
  			let canvasContainerSize;
  			let canvasContainerWidth = this.canvas.parentNode.offsetWidth - (this.canvasPadding * 2);
  			let canvasContainerHeight = this.canvas.parentNode.offsetHeight - (this.canvasPadding * 2);

  			// adapt to portrait or landscape
  			if (canvasContainerHeight > canvasContainerWidth)
  			{
  			  	canvasContainerSize = canvasContainerWidth;
  				this.spriteSize = Math.floor(canvasContainerSize / this.colsLength);	
  			}
  			else
  			{
	  			canvasContainerSize = canvasContainerHeight;
	  			this.spriteSize = Math.floor(canvasContainerSize / this.rowsLength);
  			}

  			this.canvas.width = canvasContainerSize;
  			this.canvas.height = canvasContainerSize;
  		}

  		initPlayerPos()
  		{
  			this.playerPosRow = Math.floor(this.rowsLength / 2);
			this.playerPosCol = Math.floor(this.colsLength / 2);
  		}

  		init()
  		{
  			// preload images
  			for (let i = this.imgLoadedLength - 1; i >= 0; i--)
  			{
  				this[this.imgNameList[i]] = new Image();

	  			this[this.imgNameList[i]].onload = () =>
	  			{
	  				this.imgLoadedLength -= 1;
	  				// all images is loaded => init canvas and draw game board
	  				if (this.imgLoadedLength === 0)
	  				{
			  			this.canvas.style.marginLeft = this.canvasPadding + "px";
			  			this.canvas.style.marginTop = this.canvasPadding + "px";
			  			this.initCanvasSize();
			  			this.initPlayerPos();
			  			
						this.drawBoard();
						this.drawPlayer();

			  			window.addEventListener('resize', () => { this.updateCanvasSize(); }, false);

			  			// TEMP ===>
			  			let that = this;
  						window.addEventListener('keydown', this.detectKey.bind(this, that), false);
			  			// <=== TEMP
	  				}
	  			}

	  			this[this.imgNameList[i]].src = this.imgSrcList[i];
  			}
  		}
	}

	class Engine
	{
		static init()
		{
			// init canvas
			let canvas = document.getElementById('game-canvas');
			let gameBoard = new GameBoard(canvas, 9, 9, 64);
			// init code system
			CodeLines.init();
		}
	}

	Engine.init();
});