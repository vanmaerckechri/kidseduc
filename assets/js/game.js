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
		constructor(canvas, rowsLength, colsLength)
		{
			this.spriteSize = 0;

			this.canvasPadding = 10;
			this.canvas = canvas;
			this.ctx = canvas.getContext("2d");
			this.rowsLength = rowsLength;
			this.colsLength = colsLength;

			this.imgNameList = ['playerImg'];
			this.imgSrcList = ['./assets/img/player.png'];
			this.imgLoadedLength = this.imgSrcList.length;
			this.playerImg;

			this.playerImgRow = 0;
			this.playerImgCol = 0;
			this.playerPosRow = Math.floor(this.rowsLength / 2);
			this.playerPosCol = Math.floor(this.colsLength / 2);

			this.init();
  		}

  		drawPlayer()
  		{
  			let imgSrcPosX = this.playerImgCol * this.spriteSize;
  			let imgSrcPosY = this.playerImgRow * this.spriteSize;
  			let posX = this.playerPosCol * this.spriteSize;
  			let posY = this.playerPosRow * this.spriteSize;
  			this.ctx.drawImage(this.playerImg, imgSrcPosX, imgSrcPosY, 64, 64, posX, posY, this.spriteSize, this.spriteSize);
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
  				this.spriteSize = Math.floor(canvasContainerSize / this.colsLength);	
  			}
  			else
  			{
	  			canvasContainerSize = canvasContainerHeight;
	  			this.spriteSize = Math.floor(canvasContainerSize / this.rowsLength);
  			}

  			this.canvas.width = canvasContainerSize;
  			this.canvas.height = canvasContainerSize;

  			this.drawBoard();
  			this.drawPlayer();
  		}

  		playerMove(direction)
  		{
  			console.log(direction);
  		}

  		// TEMP ===>
  		detectKey(that, event)
  		{
  			if (event.code == 'ArrowUp')
  			{
  				this.playerMove('moveTop');
  			}
  			else if (event.code == 'ArrowRight')
  			{
				this.playerMove('moveRight');
  			}
  			else if (event.code == 'ArrowDown')
  			{
				this.playerMove('moveBottom'); 				
  			}
  			else if (event.code == 'ArrowLeft')
  			{
				this.playerMove('moveLeft'); 				
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
			let canvas = document.getElementById('game-canvas');
			let gameBoard = new GameBoard(canvas, 9, 9);
			// init code system
			CodeLines.init();
		}
	}

	Engine.init();
});