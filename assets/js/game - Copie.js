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

	class Player
	{
		static get getMethods()
		{
  			return ['moveFront', 'moveBack', 'rotateRight', 'rotateLeft', 'rotate'];
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
			/*
			//break code lines by words
			for (let i = codeLines.length - 1; i >= 0; i--)
			{
				codeLines[i] = codeLines[i].split(' ');
			}
			*/
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

	class GameBoard
	{
		constructor()
		{
			this.status = 'ready';
			this.currentMap = 'map01';
			this.animationTempo;

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

  		get getMapInfos()
  		{
  			return Maps[this.currentMap];
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

  			this.playerPosCol = direction == 'playerMoveFront' ? this.playerPosCol + triangleWidth : this.playerPosCol - triangleWidth;
  			this.playerPosRow = direction == 'playerMoveFront' ? this.playerPosRow + triangleHeight : this.playerPosRow - triangleHeight;

  			this.drawPlayer();
  		}

  		playerRotate(direction)
  		{
  			if (typeof direction == "string")
  			{
  				this.playerAngle = direction == "Right" ? this.playerAngle + 90 : this.playerAngle - 90;
  			}
  			else
  			{
  				this.playerAngle = this.playerAngle + direction;
  			}

			if (this.playerAngle == (360 + direction))
			{
				this.playerAngle = direction;
			}
			else if(this.playerAngle == (-1 * direction))
			{
				this.playerAngle = 360 - direction;
			}

  			this.drawPlayer();
  		}

  		translateAnimKeys(key)
  		{
  			if (key == "playerMoveFront" || key == "playerMoveBack")
  			{
  				this.playerMove(key);
  			}
  			else if (key.indexOf("playerRotate") !== -1)
  			{
  				key = key.replace("playerRotate", "");
  				key = key.match(/\d+/g) != null ? parseInt(key, 10) : key;

  				this.playerRotate(key);
  			}
  		}

  		loadAnimation(engineObj, sequence, time)
  		{
  			let that = this;
  			engineObj.animationTempo = setInterval(function()
			{
				if (sequence.length > 0)
				{
					that.translateAnimKeys(sequence[0]);
					sequence.splice(0, 1);
				}
				else
				{
  					clearInterval(engineObj.animationTempo);
  					engineObj.codeLines.shift();
  					if (engineObj.codeLines.length > 0)
  					{
  						engineObj.checkCode();
  					}
				}
			}, time);
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

			  			this.playerCanvas.style.marginLeft = this.canvasPadding + "px";
			  			this.playerCanvas.style.marginTop = this.canvasPadding + "px";

  						this.playerSpriteRatio = this.playerSpriteSize / this.cellSize;

			  			this.updateCanvasSize();

			  			window.addEventListener('resize', () => { this.updateCanvasSize(); }, false);

			  			// TEMP ===>
			  			/*this.loadAnimation(['playerMoveFront',
			  				'playerMoveFront',
			  				'playerMoveFront',
			  				'playerMoveFront',
			  				'playerMoveFront',
			  				'playerMoveFront',
			  				'playerMoveFront',
			  				'playerMoveFront',
			  				'playerMoveFront',
			  				'playerMoveFront',
			  				'playerMoveFront',
			  				'playerRotateRight',
			  				'playerMoveFront',
			  				'playerMoveFront',
			  				'playerRotateRight',
			  				'playerMoveBack',
			  				'playerMoveBack',
			  				'playerRotate25',
			  				'playerMoveFront',
			  				'playerMoveFront'], 250);*/
			  			// <=== TEMP
	  				}
	  			}

	  			this[this.imgNameList[i]].src = this.imgSrcList[i];
  			}
  		}
	}

	class Engine
	{
		constructor()
		{
			this.gameBoard;
			this.codeLinesEngine;
			this.codeLines = [];
			this.animationTempo;
			this.init();
		}

/*
		checkCode()
		{
			let lines = this.codeLines.getLines;
			for (let i = 0, length = lines.length; i < length; i++)
			{
				if (this.codeLines.check(lines[i]))
				{
					let animation;
					let code = this.codeLines.translate(lines[i]);
					code[0] = code[0].charAt(0).toLowerCase() + code[0].slice(1);
					code[1] = code[1].charAt(0).toUpperCase() + code[1].slice(1);
					if (code[1] != "Rotate")
					{
						animation = [];
						for (let i = 0, length = code[2]; i < length; i++)
						{
							animation.push(code[0] + code[1]);
						}
					}
					else
					{
						animation = (code[0] + code[1] + code[2]);
					}
					this.gameBoard.loadAnimation(animation, 250);
				}
				else
				{
					alert("error on line: " + i);
				}
			}
		}
*/

		checkCode()
		{
			this.codeLines = this.codeLines.length == 0 ? this.codeLinesEngine.getLines : this.codeLines;

			if (this.codeLinesEngine.check(this.codeLines[0]))
			{
				let animation = [];
				let code = this.codeLinesEngine.translate(this.codeLines[0]);
				console.log(code)
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
				this.gameBoard.loadAnimation(this, animation, 250);
			}
			else
			{
				alert("error on line: " + this.codeLines[0]);
			}
		}

		init()
		{
			// init canvas
			this.gameBoard = new GameBoard();
			// init map objects
			let mapObjects = {};
			let objectNames = this.gameBoard.getMapInfos;
			for (let i = objectNames.length - 1; i >= 0; i--)
			{
				mapObjects[objectNames[i]] = eval(objectNames[i]).getMethods;
			}

			// init code system
			this.codeLinesEngine = new CodeLines(mapObjects);
			let runBtn = document.getElementById('run-button');
			runBtn.addEventListener('click', () => { this.checkCode(); }, false);
		}
	}

	let engine = new Engine();
});