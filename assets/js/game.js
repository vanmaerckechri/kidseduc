class CodeLinesEngine
{
	constructor(mapObjs)
	{
		this.reg = this.init(mapObjs);
		this.codeBlockTemp;
		this.codeLines = [];
		this.currentLine = 0;
	}

	resetColorLines()
	{
		let lines = document.querySelectorAll('#code-container p');

		for (let i = lines.length - 1; i >= 0; i--)
		{
			lines[i].classList.remove("correctCode");
			lines[i].classList.remove("wrongCode");
		}
	}

	colorCurrentLine(className)
	{
		let lines = document.querySelectorAll('#code-container p');

		if (this.currentLine > 0)
		{
			lines[this.currentLine - 1].classList.remove("correctCode");
		}

		lines[this.currentLine].classList.add(className);
	}

	formatCodeBlock()
	{
		let textarea = document.getElementById('code-container');
		let codeBlock = textarea.innerText;
		textarea.innerText = codeBlock;

		// remove all br from block code
		let brList = document.querySelectorAll('#code-container br');

		for (let i = brList.length - 1; i >= 0; i--)
		{
			brList[i].remove();
		}
		// move textNodes in p tag
		let lines = document.querySelector('#code-container').childNodes;

		for (let i = lines.length - 1; i >= 0; i--)
		{
			let newLine = document.createElement("p");
			newLine.textContent = lines[i].textContent;
			let parent = lines[i].parentNode;
			let oldLine = lines[i];

			parent.insertBefore(newLine, oldLine);

			oldLine.remove();
		}
	}

	get getLines()
	{
		this.formatCodeBlock();

		let textarea = document.getElementById('code-container');
		textarea.style = 'pointer-events: none';
		//break code by lines
		let codeBlock = textarea.innerText;
		this.codeLines = codeBlock.split('\n');
		//clean space and line break
		this.codeLines = this.codeLines.filter(w => !w.match(/^\s*$/));

		this.currentLine = 0;
		this.resetColorLines();

		return this.codeLines;
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
			let objName = curObj.charAt(0).toUpperCase() + curObj.slice(1);
			// regex objects
			if (objName == "Player")
			{
				reg += "^(" + objName + "\\.)?";
			}
			else
			{
				reg += objName + "\\.";
			}
			// regex methods
			for (let i = 0, length = mapObjects[curObj].length; i < length; i++)
			{
				reg = i == 0 ? reg + "(" : reg;

				reg += mapObjects[curObj][i];

				reg = i == length -1 ? reg + ")(\\([0-9]*\\))" : reg + "|";
			}
			
			reg = index == length ? reg + "$" : reg + "|";

			index += 1;
		}
		return reg;
	}
}

class Engine
{
	constructor()
	{
		this.canvas = document.getElementById('board-canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvasPadding = 10;

		this.map;
		this.codeLinesEngine;

		this.codeLines = [];

		this.animationTempo = null;

		this.init();
	}

	rotateImg(obj)
	{
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');

		let dSizeX = this.map['cellSize'] * obj['cellWidth'];
		let dSizeY = this.map['cellSize'] * obj['cellHeight'];

		canvas.width = Math.sqrt((dSizeX * dSizeX) + (dSizeY * dSizeY));
		canvas.height = canvas.width;

		let canvasHalfWidth = canvas.width / 2;
		let canvasHalfHeight = canvas.height / 2;

		ctx.translate(canvasHalfWidth, canvasHalfHeight);
		ctx.rotate(obj['angle'] * Math.PI / 180);
		ctx.translate(- canvasHalfWidth, - canvasHalfHeight);

		let sX = obj['imgSrcCol'] * obj['spriteSizeSrcX'];
		let sY = obj['imgSrcRow'] * obj['spriteSizeSrcY'];

		let dMiddleX = (canvasHalfWidth) - (dSizeX / 2);
		let dMiddleY = (canvasHalfWidth) - (dSizeY / 2);

		ctx.drawImage(obj['img'], sX, sY, obj['spriteSizeSrcX'], obj['spriteSizeSrcY'], dMiddleX, dMiddleY, dSizeX, dSizeY);

		return canvas;
	}

	drawObj(obj)
	{
		let cellSize = this.map['cellSize'];

		obj.ctx.clearRect(0, 0, obj.canvas.width, obj.canvas.height);

		let imgRot = this.rotateImg(obj);

		let posX = (obj.posCol * cellSize) + (cellSize / 2) - (imgRot.width / 2);
		let posY = (obj.posRow * cellSize) + (cellSize / 2) - (imgRot.height / 2);

		obj.ctx.drawImage(imgRot, 0, 0, imgRot.width, imgRot.height, posX, posY, imgRot.width, imgRot.height);
	}

	moveObj(obj, direction)
	{
		let hypo = 1;
		let triangleWidth = hypo * Math.sin(obj.angle * Math.PI / 180);
		let triangleHeight = -1 * (hypo * Math.cos(obj.angle * Math.PI / 180));

		triangleWidth = obj.angle == 0 || obj.angle == 180 ? 0 : triangleWidth;
		triangleHeight = obj.angle == 90 || obj.angle == 270 ? 0 : triangleHeight;

		let posCol = direction == 'MoveFront' ? obj.posCol + triangleWidth : obj.posCol - triangleWidth;
		let posRow = direction == 'MoveFront' ? obj.posRow + triangleHeight : obj.posRow - triangleHeight;

		return {posCol: posCol, posRow: posRow};
	}

	rotateObj(obj, direction)
	{
		let cellSize = this.map['cellSize'];

		if (typeof direction == "string")
		{
			obj.angle = direction == "Right" ? obj.angle + 90 : obj.angle - 90;
		}
		else
		{
			obj.angle = obj.angle + direction;
		}

		if (obj.angle == (360 + direction))
		{
			obj.angle = direction;
		}
		else if(obj.angle == (-1 * direction))
		{
			obj.angle = 360 - direction;
		}

		this.drawObj(obj);
	}

	drawMap()
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		let rowsLength = this.map['rowsLength'];
		let colsLength = this.map['colsLength'];
		let cellSize = this.map['cellSize'];
		for (let r = 0, rLength = rowsLength; r < rLength; r++)
		{
			let posY = (cellSize * r);
			for (let c = 0, cLength = colsLength; c < cLength; c++)
			{
				let posX = (cellSize * c);
				this.ctx.rect(posX, posY, cellSize, cellSize);
				//this.ctx.fillStyle = "blue"
				this.ctx.stroke();
			}
		}
	}

	refreshStarCanvas()
	{
		let canvas = this.map['starsCanvas'];
		let ctx = this.map['starsCtx'];
		let starsList = this.map['starsList'];

		canvas.width = this.canvas.parentNode.offsetWidth - (this.canvasPadding * 2);
		canvas.height = this.canvas.parentNode.offsetHeight - (this.canvasPadding * 2);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (Object.keys(starsList).length > 0)
		{
			for (let starName in starsList)
			{
				let cellSize = this.map['cellSize'];
				let star = starsList[starName];
				let img = star['img'];
				let sX = star['imgSrcRow'];
				let sY = star['imgSrcCol'];
				let sWidth = star['spriteSizeSrcX'];
				let sHeight = star['spriteSizeSrcY'];
				let dX = star['posCol'] * cellSize;
				let dY = star['posRow'] * cellSize;
				let dWidth = star['cellWidth'] * cellSize;
				let dHeight = star['cellHeight'] * cellSize;

				ctx.drawImage(img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
			}
		}
	}

	updateCanvasSize()
	{
		// rest canvas container size
		this.canvas.width = 0;
		this.canvas.height = 0;
		
		let canvasContainerWidth = this.canvas.parentNode.offsetWidth - (this.canvasPadding * 2);
		let canvasContainerHeight = this.canvas.parentNode.offsetHeight - (this.canvasPadding * 2);

		// adapt to portrait or landscape
		if (canvasContainerHeight > canvasContainerWidth)
		{
			this.map['cellSize'] = Math.floor(canvasContainerWidth / this.map['colsLength']);	
		}
		else
		{
			this.map['cellSize'] = Math.floor(canvasContainerHeight / this.map['rowsLength']);
		}

		this.canvas.width = canvasContainerWidth;
		this.canvas.height = canvasContainerHeight;

		this.drawMap();

		let objectList = this.map['objectList'];
		for (let obj in objectList)
		{
			objectList[obj].canvas.width = canvasContainerWidth;
			objectList[obj].canvas.height = canvasContainerHeight;

			this.drawObj(objectList[obj]);
		}

		this.refreshStarCanvas();
	}

	checkCollisionBetween(obj1, obj2)
	{
		if ((obj1['posCol'] >= obj2['posCol'] && obj1['posCol'] <= obj2['posCol'] + obj2['cellWidth'] && obj1['posRow'] >= obj2['posRow'] && obj1['posRow'] <= obj2['posRow'] + obj2['cellHeight'])
			||
			(obj2['posCol'] >= obj1['posCol'] && obj2['posCol'] <= obj1['posCol'] + obj1['cellWidth'] && obj2['posRow'] >= obj1['posRow'] && obj2['posRow'] <= obj1['posRow'] + obj1['cellHeight']))
		{
			return true;
		}
		return false;
	}

	checkEdgeCollision(col, row)
	{
		if (col > 0 && col < this.map['colsLength'] - 1 && row > 0 && row < this.map['rowsLength'] - 1)
		{
			return false;
		}
		return true;
	}

	translateAnimKeys(key)
	{
		let index = key.indexOf("MoveFront") != -1 ? key.indexOf("MoveFront") : key.indexOf("MoveBack")
		if (index != -1)
		{
			let objName = key.slice(0, index);
			let obj = this.map['objectList'][objName];
			let action = key.slice(index, key.length);
			let newPos = this.moveObj(obj, action);
			let posCol = newPos['posCol'];
			let posRow = newPos['posRow'];

			if (this.checkEdgeCollision(posCol, posRow) == true)
			{
				return;
			}

			if (objName == "turtle")
			{
				let player = this.map['objectList']['player'];
				if (this.checkCollisionBetween(obj, player) == true)
				{
					let x = player.posCol - obj.posCol;
					let y = player.posRow - obj.posRow;

					/*
					player.posCol = posCol + x;
					player.posRow = posRow + y;
					*/
					player.posCol = posCol;
					player.posRow = posRow;
					this.drawObj(player);
				}
			}

			obj.posCol = posCol;
			obj.posRow = posRow;
			this.drawObj(obj);

			if (objName == "player")
			{
				let player = this.map['objectList']['player'];
				let starsList = this.map['starsList'];

				for (let starName in starsList)
				{
					if (this.checkCollisionBetween(starsList[starName], player) == true)
					{
						console.log("touché")
						delete starsList[starName];
						this.refreshStarCanvas();
						if (Object.keys(starsList).length == 0)
						{
							console.log("gagné")
						}
					}
				}
			}
		}
		else if (key.indexOf("playerRotate") !== -1)
		{
			key = key.replace("playerRotate", "");
			key = key.match(/\d+/g) != null ? parseInt(key, 10) : key;

			this.rotateObj(this.player, key);
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
				that.codeLinesEngine.codeLines.shift();
				that.animationTempo = null;
				that.codeLinesEngine.currentLine += 1;
				if (that.codeLinesEngine.codeLines.length > 0)
				{
					that.checkCode();
				}
				else
				{
					let textarea = document.getElementById('code-container');
					textarea.style = '';
				}
			}
		}, time);
	}

	checkCode()
	{
		let codeLines = this.codeLinesEngine.codeLines;

		codeLines = codeLines.length == 0 ? this.codeLinesEngine.getLines : codeLines;

		if (codeLines.length > 0 && this.animationTempo == null)
		{
			if (this.codeLinesEngine.check(codeLines[0]))
			{
				let animation = [];
				let code = this.codeLinesEngine.translate(codeLines[0]);
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
				this.codeLinesEngine.colorCurrentLine("correctCode");
				this.loadAnimation(animation, 250);
			}
			else
			{
				this.codeLinesEngine.colorCurrentLine("wrongCode");
				this.codeLinesEngine.codeLines = [];

				let textarea = document.getElementById('code-container');
				textarea.style = '';
				alert("error");
			}
		}
	}

	preloadImg(backOnInit)
	{
		let objectList = this.map['objectList'];
		let starsList = this.map['starsList'];
		let imgsList = [objectList, starsList];

		let index = 0;
		let imgsLength = Object.keys(objectList).length + Object.keys(starsList).length - 1;

		for (let i = imgsList.length - 1; i >= 0; i--)
		{
			for (let objName in imgsList[i])
			{
				imgsList[i][objName].img = new Image();
				imgsList[i][objName].img.onload = () =>
				{
					if(index == imgsLength)
					{
						backOnInit();
					}
					index += 1;
				}
				imgsList[i][objName].img.src = imgsList[i][objName].imgSrc;
			}
		}
	}

	init()
	{
		// init map
		this.map = new Map();
		// preload images
		this.preloadImg(() =>
		{
			this.canvas.style.marginLeft = this.canvasPadding + "px";
  			this.canvas.style.marginTop = this.canvasPadding + "px";

  			this.map['starsCanvas'].style.marginLeft = this.canvasPadding + "px";
  			this.map['starsCanvas'].style.marginTop = this.canvasPadding + "px";

  			// init all objects from this map
			let objsMethods = {};
			let objectList = this.map['objectList'];

			for (let objName in objectList)
			{
				objsMethods[objName] = objectList[objName].getMethods;

	  			// init player
	  			this[objName] = this.map.objectList[objName];

	  			this[objName].canvas.style.marginLeft = this.canvasPadding + "px";
	  			this[objName].canvas.style.marginTop = this.canvasPadding + "px";
			}

			// init code system with methods from objects
			this.codeLinesEngine = new CodeLinesEngine(objsMethods);

  			// events
			let runBtn = document.getElementById('run-button');
			runBtn.addEventListener('click', () => { this.checkCode(); }, false);

  			window.addEventListener('resize', () => { this.updateCanvasSize(); }, false);

  			//display game board
  			this.updateCanvasSize();
		});
	}
}

let engine = new Engine();