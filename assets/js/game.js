document.addEventListener("DOMContentLoaded", function(event)
{
	class Maps
	{
		static get map01()
		{
			let objectList = ["Player", "Turtle"]

			return objectList;
		}
	}

	class Turtle
	{
		static get getMethods()
		{
			return ['moveFront', 'moveBack'];
		}
	}

	class CodeLines
	{
		constructor(mapObjs)
		{
			this.reg = this.init(mapObjs);
		}

		get getLines()
		{
			let textarea = document.getElementById('code-container');
			//break code by lines
			let codeLines = textarea.value.split('\n');
			//clean space and line break
			codeLines = codeLines.filter(w => !w.match(/^\s*$/));

			return codeLines;
		}

		translate(code)
		{
			let times = code.substring(code.lastIndexOf("(") + 1, code.lastIndexOf(")"));
			let newCode = code.split(".");
			if (newCode.length == 1)
			{
				newCode.unshift("Player");
			}
			newCode[1] = newCode[1].replace(/\(.*\)/, '');
			newCode.push(times);

			return newCode;
		}

		check(code)
		{
			if (code.match(this.reg))
			{
				return true;
			}
			return false;
		}

		init(mapObjects)
		{
			// build regex
			let reg = "";
			let index = 0;
			let length = Object.keys(mapObjects).length - 1;

			for (let curObj in mapObjects)
			{
				// regex objects
				if (curObj == "Player")
				{
					reg += "(" + curObj + "\\.)?";
				}
				else
				{
					reg += curObj + "\\.";
				}
				// regex methods
				for (let i = 0, length = mapObjects[curObj].length; i < length; i++)
				{
					reg = i == 0 ? reg + "(" : reg;

					reg += mapObjects[curObj][i];

					reg = i == length -1 ? reg + ")(\\([0-9]*\\))" : reg + "|";
				}
				
				reg = index == length ? reg : reg + "|";

				index += 1;
			}
			return reg;
		}
	}

	class Player
	{
		constructor(playerImg, posRow, posCol)
		{
			this.canvas = document.getElementById('player-canvas');
			this.ctx = this.canvas.getContext('2d');

			this.img = playerImg;
			this.spriteRatio;
			this.spriteSizeSrc = 64;
			this.spriteSize = 32;
			this.angle = 0;
			this.imgRow = 0;
			this.imgCol = 0;
			this.posRow = posRow;
			this.posCol = posCol;
  		}

  		static get getMethods()
		{
  			return ['moveFront', 'moveBack', 'rotateRight', 'rotateLeft', 'rotate'];
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

  		draw(cellSize)
  		{
  			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  			let imgSrcPosX = this.imgCol * this.spriteSizeSrc;
  			let imgSrcPosY = this.imgRow * this.spriteSizeSrc;

  			let imgRot = this.rotateImg(this.img, imgSrcPosX, imgSrcPosY, this.spriteSizeSrc, this.spriteSize, this.angle);

  			let posX = (this.posCol * cellSize) + (cellSize / 2) - (imgRot.width / 2);
  			let posY = (this.posRow * cellSize) + (cellSize / 2) - (imgRot.height / 2);

  			this.ctx.drawImage(imgRot, 0, 0, imgRot.width, imgRot.height, posX, posY, imgRot.width, imgRot.height);
  		}

  		move(direction, cellSize)
  		{
  			let hypo = 1;
  			let triangleWidth = hypo * Math.sin(this.angle * Math.PI / 180);
  			let triangleHeight = -1 * (hypo * Math.cos(this.angle * Math.PI / 180));

  			triangleWidth = this.angle == 0 || this.angle == 180 ? 0 : triangleWidth;
  			triangleHeight = this.angle == 90 || this.angle == 270 ? 0 : triangleHeight;

  			this.posCol = direction == 'playerMoveFront' ? this.posCol + triangleWidth : this.posCol - triangleWidth;
  			this.posRow = direction == 'playerMoveFront' ? this.posRow + triangleHeight : this.posRow - triangleHeight;

  			this.draw(cellSize);
  		}

  		rotate(direction, cellSize)
  		{
  			if (typeof direction == "string")
  			{
  				this.angle = direction == "Right" ? this.angle + 90 : this.angle - 90;
  			}
  			else
  			{
  				this.angle = this.angle + direction;
  			}

			if (this.angle == (360 + direction))
			{
				this.angle = direction;
			}
			else if(this.angle == (-1 * direction))
			{
				this.angle = 360 - direction;
			}

  			this.draw(cellSize);
  		}
  	}

	class Engine
	{
		constructor()
		{
			this.status = "busy";

			this.codeLinesEngine;
			this.codeLines = [];
			this.animationTempo = null;

			this.currentMap = 'map01';

			this.imgNameList = ['playerImg'];
			this.imgSrcList = ['./assets/img/player.png'];
			this.imgLoadedLength = this.imgSrcList.length;

			this.playerImg;

			this.canvasPadding = 10;

			this.canvas = document.getElementById('board-canvas');
			this.ctx = this.canvas.getContext('2d');

			this.cellSize = 16;
			this.rowsLength = 21;
			this.colsLength = 21;

			this.player;

			this.init();
		}

		draw()
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

  			this.player.canvas.width = canvasContainerSize;
  			this.player.canvas.height = canvasContainerSize;

  			this.player.spriteSize = this.player.spriteRatio * this.cellSize;

  			this.draw();
  			this.player.draw(this.cellSize);
  		}

  		get getMapInfos()
  		{
  			return Maps[this.currentMap];
  		}

		translateAnimKeys(key)
  		{
  			if (key == "playerMoveFront" || key == "playerMoveBack")
  			{
  				this.player.move(key, this.cellSize);
  			}
  			else if (key.indexOf("playerRotate") !== -1)
  			{
  				key = key.replace("playerRotate", "");
  				key = key.match(/\d+/g) != null ? parseInt(key, 10) : key;

  				this.player.rotate(key, this.cellSize);
  			}
  		}

  		loadAnimation(sequence, time)
  		{
  			let that = this;
  			this.animationTempo = setInterval(function()
			{
				if (sequence.length > 0)
				{
					that.translateAnimKeys(sequence[0]);
					sequence.splice(0, 1);
				}
				else
				{
  					clearInterval(that.animationTempo);
  					that.codeLines.shift();
  					that.animationTempo = null;
  					if (that.codeLines.length > 0)
  					{
  						that.checkCode();
  					}
				}
			}, time);
  		}

		checkCode()
		{
			this.codeLines = this.codeLines.length == 0 ? this.codeLinesEngine.getLines : this.codeLines;

			if (this.codeLines.length > 0 && this.animationTempo == null)
			{
				if (this.codeLinesEngine.check(this.codeLines[0]))
				{
					let animation = [];
					let code = this.codeLinesEngine.translate(this.codeLines[0]);
					code[0] = code[0].charAt(0).toLowerCase() + code[0].slice(1);
					code[1] = code[1].charAt(0).toUpperCase() + code[1].slice(1);
					if (code[1] != "Rotate")
					{
						code[2] = code[2] == "" ? 1 : code[2];
						for (let i = 0, length = code[2]; i < length; i++)
						{
							animation.push(code[0] + code[1]);
						}
					}
					else
					{
						animation.push(code[0] + code[1] + code[2]);
					}
					this.loadAnimation(animation, 250);
				}
				else
				{
					alert("error on line: " + this.codeLines[0]);
					this.codeLines = [];
				}
			}
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
	  					// init in game objects
						let mapObjects = {};
						let objectNames = this.getMapInfos;
						for (let i = objectNames.length - 1; i >= 0; i--)
						{
							mapObjects[objectNames[i]] = eval(objectNames[i]).getMethods;
						}

						// init code system
						this.codeLinesEngine = new CodeLines(mapObjects);

						// init canvas
			  			this.canvas.style.marginLeft = this.canvasPadding + "px";
			  			this.canvas.style.marginTop = this.canvasPadding + "px";

			  			// init player
			  			this.player = new Player(this.playerImg, Math.floor((this.colsLength * 2) / 3), Math.floor(this.colsLength / 2));

			  			this.player.canvas.style.marginLeft = this.canvasPadding + "px";
			  			this.player.canvas.style.marginTop = this.canvasPadding + "px";

  						this.player.spriteRatio = this.player.spriteSize / this.cellSize;

			  			// events
						let runBtn = document.getElementById('run-button');
						runBtn.addEventListener('click', () => { this.checkCode(); }, false);

			  			window.addEventListener('resize', () => { this.updateCanvasSize(); }, false);

			  			//display game board
			  			this.updateCanvasSize();
			  			this.status = "ready";
	  				}
	  			}

	  			this[this.imgNameList[i]].src = this.imgSrcList[i];
  			}

		}
	}

	let engine = new Engine();
});