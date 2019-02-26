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
		//break code by lines
		let codeBlock = textarea.innerText;
		this.codeLines = codeBlock.split('\n');
		//clean space and line break
		this.codeLines = this.codeLines.filter(w => !w.match(/^\s*$/));

		this.currentLine = 0;
		this.resetColorLines();

		if (this.codeLines.length > 0)
		{		
			textarea.style = 'pointer-events: none';
		}
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

		console.log(code.match(this.regObjects))

		return false;
	}

	init(mapObjects)
	{
		// build regex
		let reg = "";
		let regObjects = "";
		let index = 0;
		let length = Object.keys(mapObjects).length - 1;

		for (let curObj in mapObjects)
		{
			let objName = curObj.charAt(0).toUpperCase() + curObj.slice(1);
			// regex objects
			if (objName == "Player")
			{
				reg += "^(" + objName + "\\.)?";
				
				this.regObjects = "(" + objName +"\\.";
			}
			else
			{
				reg += objName + "\\.";

				this.regObjects += objName + "\\.";
			}
			// regex methods
			for (let i = 0, length = mapObjects[curObj].length; i < length; i++)
			{
				reg = i == 0 ? reg + "(" : reg;

				reg += mapObjects[curObj][i];

				reg = i == length -1 ? reg + ")(\\([0-9]*\\))" : reg + "|";
			}
			
			reg = index == length ? reg + "$" : reg + "|";

			this.regObjects = index == length ? this.regObjects + ")" : this.regObjects + "|";

			index += 1;
		}
		return reg;
	}
}

class Engine
{
	constructor()
	{
		this.map;
		this.codeLinesEngine;

		this.animationTempo = null;

		this.sequence = [];

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

	drawObj(obj, clearR = true)
	{
		let cellSize = this.map['cellSize'];

		if (clearR == true)
		{
			obj.ctx.clearRect(0, 0, obj.canvas.width, obj.canvas.height);
		}

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
		this.map['ctx'].clearRect(0, 0, this.map['canvas'].width, this.map['canvas'].height);
		
		let rowsLength = this.map['rowsLength'];
		let colsLength = this.map['colsLength'];
		let cellSize = this.map['cellSize'];
		
		for (let r = 0, rLength = rowsLength; r < rLength; r++)
		{
			let posY = (cellSize * r);
			for (let c = 0, cLength = colsLength; c < cLength; c++)
			{
				let posX = (cellSize * c);
				this.map['ctx'].rect(posX, posY, cellSize, cellSize);
				//this.map['ctx'].fillStyle = "blue"
				this.map['ctx'].stroke();
			}
		}
	}

	refreshStarCanvas()
	{
		let starsCanvas = document.getElementById('star-canvas');
		let starsCtx = starsCanvas.getContext('2d');

		let starsList = this.map['starsList'];

		starsCanvas.width = this.map['canvas'].width;
		starsCanvas.height = this.map['canvas'].height;

		starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

		if (starsList && Object.keys(starsList).length > 0)
		{
			for (let starName in starsList)
			{
				let star = starsList[starName];
				this.drawObj(star, false);
			}
		}
	}

	updateCanvasSize()
	{
		// rest canvas container size
		this.map['canvas'].width = 0;
		this.map['canvas'].height = 0;
		
		let canvasSize;
		let canvasContainerWidth = this.map['canvas'].parentNode.offsetWidth - (this.map['canvasPadding'] * 2);
		let canvasContainerHeight = this.map['canvas'].parentNode.offsetHeight - (this.map['canvasPadding'] * 2);

		// adapt to portrait or landscape
		if (canvasContainerHeight > canvasContainerWidth)
		{
			canvasSize = canvasContainerWidth;
			this.map['cellSize'] = Math.floor(canvasContainerWidth / this.map['colsLength']);	
		}
		else
		{
			canvasSize = canvasContainerHeight;
			this.map['cellSize'] = Math.floor(canvasContainerHeight / this.map['rowsLength']);
		}

		this.map['canvas'].width = canvasSize;
		this.map['canvas'].height = canvasSize;

		this.drawMap();

		// draw water
		if (this.map['water'])
		{
			let water = this.map['water'];
			this.drawObj(water, false);
		}

		let objectList = this.map['objectList'];
		for (let obj in objectList)
		{
			objectList[obj].canvas.width = canvasSize;
			objectList[obj].canvas.height = canvasSize;

			this.drawObj(objectList[obj]);
		}

		this.refreshStarCanvas();
	}

	checkCollisionBetween(obj1, obj2, obj1PadHeight = false)
	{
		let obj1PadH = obj1PadHeight != false ? obj1PadHeight : 0;

		let obj1PosLeft = obj1['posCol'] - (obj1['cellWidth'] / 2);
		let obj1PosRight = obj1['posCol'] + (obj1['cellWidth'] / 2);
		let obj1PosTop = obj1['posRow'] - (obj1['cellHeight'] / 2);
		let obj1PosBot = obj1['posRow'] + (obj1['cellHeight'] / 2);

		let obj2PosLeft = obj2['posCol'] - (obj2['cellWidth'] / 2);
		let obj2PosRight = obj2['posCol'] + (obj2['cellWidth'] / 2);
		let obj2PosTop = obj2['posRow'] - (obj2['cellHeight'] / 2);
		let obj2PosBot = obj2['posRow'] + (obj2['cellHeight'] / 2);

		if (obj2PosLeft <= obj1PosRight && obj2PosRight > obj1PosLeft && obj2PosTop <= obj1PosBot + parseInt(obj1PadH, 10) && obj2PosBot + parseInt(obj1PadH, 10) > obj1PosTop)
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

	launchAnimation(key)
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

					
					player.posCol = posCol + x;
					player.posRow = posRow + y;
					/*
					player.posCol = posCol;
					player.posRow = posRow;
					*/
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

				if (this.checkCollisionBetween(this.map['water'], player, "-1") == true)
				{
					if(!this.map['objectList']['turtle'] || this.checkCollisionBetween(this.map['objectList']['turtle'], player) == false)
					{
						console.log("plouf");
						this.loadGameLost("You drowned!");
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

	loadAnimation(time)
	{
		let that = this;
		this.animationTempo = setInterval(function()
		{
			if (that.sequence.length > 0)
			{
				that.launchAnimation(that.sequence[0]);
				that.sequence.splice(0, 1);
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
				let code = this.codeLinesEngine.translate(codeLines[0]);
				code[0] = code[0].charAt(0).toLowerCase() + code[0].slice(1);
				code[1] = code[1].charAt(0).toUpperCase() + code[1].slice(1);
				if (code[1] != "Rotate")
				{
					code[2] = code[2] == "" ? 1 : code[2];
					for (let i = 0, length = code[2]; i < length; i++)
					{
						this.sequence.push(code[0] + code[1]);
					}
				}
				else
				{
					this.sequence.push(code[0] + code[1] + code[2]);
				}
				this.codeLinesEngine.colorCurrentLine("correctCode");
				this.loadAnimation(250);
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

/*
	initCellsInfosMap()
	{
		if (this.map['water'])
		{
			let cellSize = this.map['cellSize'];

			let water = this.map['water'];
			let posRow = water['posRow'];
			let rowsLength = water['cellHeight'];
			let posY = posRow - Math.floor(rowsLength / 2);

			let posCol = water['posCol'];
			let colsLength = water['cellWidth'];
			let posX = posCol - Math.floor(colsLength / 2);

			for (let r = 1, rLength = rowsLength; r < rLength - 1; r++)
			{
				for (let c = 0, cLength = colsLength; c < cLength; c++)
				{
					this.map['cellsInfos'][posY + r] = !this.map['cellsInfos'][posY + r] ? [] : this.map['cellsInfos'][posY + r];
				}
			}		
		}
	}
*/

	initPaddingCanvas()
	{
		let canvasList = document.querySelectorAll('canvas');
		for (let i = canvasList.length - 1; i >= 0; i--)
		{
			let canvas = canvasList[i];
			canvas.style.marginLeft = this.map['canvasPadding'] + "px";
			canvas.style.marginTop = this.map['canvasPadding'] + "px";
		}
	}

	reset()
	{
		let events = false;

		let messageContainer = document.getElementById('message-container');
		let restartButton = document.getElementById('restart-button');

		messageContainer.classList.add('hidden');
		restartButton.classList.add('hidden');

		this.codeLinesEngine.resetColorLines();

		this.init(events);
	}

	loadGameLost(lostMessage)
	{
		this.codeLinesEngine.codeLines = [];
		this.sequence = [];

		let messageContainer = document.getElementById('message-container');
		let messageContent = document.getElementById('message-content');
		let restartButton = document.getElementById('restart-button');

		messageContent.innerText = lostMessage;

		restartButton.classList.remove('hidden');
		messageContainer.classList.remove('hidden');
	}

	closeGameIntro()
	{
		let messageContainer = document.getElementById('message-container');
		let introButton = document.getElementById('intro-button');

		messageContainer.classList.add('hidden');
		introButton.classList.add('hidden');
	}

	loadGameIntro()
	{
		let messageContainer = document.getElementById('message-container');
		let messageContent = document.getElementById('message-content');
		let introButton = document.getElementById('intro-button');

		messageContent.innerText = this.map['intro'];
		introButton.classList.remove('hidden');
	}

	preloadImg(backOnInit)
	{
		let objectList = this.map['objectList'];
		let imgsList = [objectList];
		let imgsLength = Object.keys(objectList).length;

		if (this.map['starsList'])
		{
			let starsList = this.map['starsList'];
			imgsList.push(starsList);
			imgsLength += Object.keys(starsList).length;
		}

		if (this.map['water'])
		{
			let waterImg = this.map['water'];
			imgsList.push({waterImg: waterImg});
			imgsLength += 1;
		}

		imgsLength -= 1;

		let index = 0;

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

	init(events = true)
	{
		// init map
		this.map = new Map();
		// preload images
		this.preloadImg(() =>
		{
			this.initPaddingCanvas();

  			// init all objects from this map
			let objsMethods = {};
			let objectList = this.map['objectList'];

			for (let objName in objectList)
			{
				objsMethods[objName] = objectList[objName].getMethods;

	  			// init player
	  			this[objName] = this.map.objectList[objName];
			}

			// init code system with methods from objects
			this.codeLinesEngine = new CodeLinesEngine(objsMethods);

  			// events
  			if (events == true)
  			{
				let runBtn = document.getElementById('run-button');
				runBtn.addEventListener('click', () => { this.checkCode(); }, false);

	  			window.addEventListener('resize', () => { this.updateCanvasSize(); }, false);

				let introButton = document.getElementById('intro-button');
	  			introButton.addEventListener('click', () => { this.closeGameIntro(); }, false);

				let restartButton = document.getElementById('restart-button');
	  			restartButton.addEventListener('click', () => { this.reset(); }, false);

	  			this.loadGameIntro();
  			}

  			//display game board
  			this.updateCanvasSize();
		});
	}
}

let engine = new Engine();