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
		constructor()
		{

			this.canvasPadding = 10;

			this.canvas = document.getElementById('board-canvas');
			this.ctx = this.canvas.getContext('2d');

			this.playerCanvas = document.getElementById('player-canvas');
			this.playerCtx = this.playerCanvas.getContext('2d');

			this.cellSize = 16;
			this.rowsLength = 21;
			this.colsLength = 21;

			this.imgNameList = ['playerImg'];
			this.imgSrcList = ['./assets/img/player.png'];
			this.imgLoadedLength = this.imgSrcList.length;

			this.playerImg;
			this.playerSpriteRatio;
			this.playerSpriteSizeSrc = 64;
			this.playerSpriteSize = 32;
			this.playerAngle = 0;
			this.playerImgRow = 0;
			this.playerImgCol = 0;
			this.playerPosRow = Math.floor((this.colsLength * 2) / 3);
			this.playerPosCol = Math.floor(this.rowsLength / 2);

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
  			this.playerCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  			let imgSrcPosX = this.playerImgCol * this.playerSpriteSizeSrc;
  			let imgSrcPosY = this.playerImgRow * this.playerSpriteSizeSrc;

  			let imgRot = this.rotateImg(this.playerImg, imgSrcPosX, imgSrcPosY, this.playerSpriteSizeSrc, this.playerSpriteSize, this.playerAngle);

  			let posX = (this.playerPosCol * this.cellSize) + (this.cellSize / 2) - (imgRot.width / 2);
  			let posY = (this.playerPosRow * this.cellSize) + (this.cellSize / 2) - (imgRot.height / 2);

  			this.playerCtx.drawImage(imgRot, 0, 0, imgRot.width, imgRot.height, posX, posY, imgRot.width, imgRot.height);
  		}

  		drawBoard()
  		{
  			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  			for (let r = 0, rLength = this.rowsLength; r < rLength; r++)
  			{
  				let posY = (this.cellSize * r);
  				for (let c = 0, cLength = this.colsLength; c < cLength; c++)
  				{
  					let posX = (this.cellSize * c);
					this.ctx.rect(posX, posY, this.cellSize, this.cellSize);
					//this.ctx.fillStyle = "blue"
					this.ctx.stroke();
  				}
  			}
  		}

  		updateCanvasSize()
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
  				this.cellSize = Math.floor(canvasContainerSize / this.colsLength);	
  			}
  			else
  			{
	  			canvasContainerSize = canvasContainerHeight;
	  			this.cellSize = Math.floor(canvasContainerSize / this.rowsLength);
  			}

  			this.canvas.width = canvasContainerSize;
  			this.canvas.height = canvasContainerSize;

  			this.playerCanvas.width = canvasContainerSize;
  			this.playerCanvas.height = canvasContainerSize;

  			this.playerSpriteSize = this.playerSpriteRatio * this.cellSize;

  			this.drawBoard();
  			this.drawPlayer();
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

			  			this.playerCanvas.style.marginLeft = this.canvasPadding + "px";
			  			this.playerCanvas.style.marginTop = this.canvasPadding + "px";

  						this.playerSpriteRatio = this.playerSpriteSize / this.cellSize;

			  			this.updateCanvasSize();

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
			let gameBoard = new GameBoard();
			// init code system
			CodeLines.init();
		}
	}

	Engine.init();
});