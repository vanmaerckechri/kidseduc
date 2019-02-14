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

			this.canvas = canvas;
			this.ctx = canvas.getContext("2d");
			this.rowsLength = rowsLength;
			this.colsLength = colsLength;

			this.init();
  		}

  		drawBoard()
  		{
  			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  			for (let r = 0, rLength = this.rowsLength; r < rLength; r++)
  			{
  				let posY = this.spriteSize * r;
  				for (let c = 0, cLength = this.colsLength; c < cLength; c++)
  				{
  					let posX = this.spriteSize * c;
					this.ctx.rect(posX, posY, this.spriteSize, this.spriteSize);
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
  			let canvasContainerWidth = this.canvas.parentNode.offsetWidth - '20';
  			let canvasContainerHeight = this.canvas.parentNode.offsetHeight - '20';;

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
  		}

  		init()
  		{
  			this.updateCanvasSize();
  			this.drawBoard();

  			window.addEventListener('resize', () => { this.updateCanvasSize(); }, false);
  		}
	}

	class Engine
	{
		static init()
		{
			//
			let canvas = document.getElementById('game-canvas');
			let gameBoard = new GameBoard(canvas, 8, 8);
			//
			CodeLines.init();
		}
	}

	Engine.init();
});