class CodeLinesEngine
{
	constructor(mapObjs)
	{
		this.reg = this.init(mapObjs);
		this.codeBlockTemp;
		this.codeLines = [];
		this.currentSequenceLine = 0;
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

	colorcurrentSequenceLine(className)
	{
		let lines = document.querySelectorAll('#code-container p');

		if (this.currentSequenceLine > 0)
		{
			lines[this.currentSequenceLine - 1].classList.remove("correctCode");
		}

		lines[this.currentSequenceLine].classList.add(className);
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
		let runButton = document.getElementById('run-button');
		//break code by lines
		let codeBlock = textarea.innerText;
		this.codeLines = codeBlock.split('\n');
		//clean space and line break
		this.codeLines = this.codeLines.filter(w => !w.match(/^\s*$/));

		this.currentSequenceLine = 0;
		this.resetColorLines();

		if (this.codeLines.length > 0)
		{		
			textarea.style = 'pointer-events: none';
			runButton.style = 'pointer-events: none';
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
		//console.log(code.match(this.regObjects))

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

				reg = i == length -1 ? reg + ")(\\([0-9]*\\))$" : reg + "|";
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
		this.isMeasure = false;

		this.htmlLang = document.documentElement.lang;

		this.map;
		this.codeLinesEngine;

		this.sequenceTempo = null;
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
		let newAngle = 0;

		if (typeof direction == "string")
		{
			newAngle = direction == "Right" ? obj.angle + 90 : obj.angle - 90;
		}
		else
		{
			newAngle = obj.angle + direction;
		}

		if (obj.angle == (360 + direction))
		{
			newAngle = direction;
		}
		else if(obj.angle == (-1 * direction))
		{
			newAngle = 360 - direction;
		}

		return newAngle;
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

		let uiCanvas = document.getElementById('ui-canvas');
		uiCanvas.width = canvasSize;
		uiCanvas.height = canvasSize
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

	smoothMoveObj(time, objName, obj, newPosCol, newPosRow, continueAnimation)
	{
		let xLength = obj.posCol - newPosCol;
		let yLength = obj.posRow - newPosRow;
		let xSmoothStep = xLength / 10;
		let YSmoothStep = yLength / 10;

		this.sequenceTempo = setInterval(()=>
		{
			obj.posCol -= xSmoothStep;
			obj.posRow -= YSmoothStep;
			this.drawObj(obj);

			if (objName == "turtle")
			{
				let player = this.map['objectList']['player'];

				if (this.checkCollisionBetween(obj, player) == true)
				{
					player.posCol -= xSmoothStep;
					player.posRow -= YSmoothStep;
					/*
					player.posCol = posCol;
					player.posRow = posRow;
					*/
					this.drawObj(player);
				}
			}

			if (obj.posCol.toFixed(1) == newPosCol.toFixed(1) && obj.posRow.toFixed(1) == newPosRow.toFixed(1))
			{
				clearInterval(this.sequenceTempo);
				continueAnimation();
			}
		}, time);
	}

	smoothRotateObj(time, obj, newAngle, continueAnimation)
	{
		let direction = obj.angle < newAngle ? 1 : -1;

		this.sequenceTempo = setInterval(()=>
		{
			obj.angle += direction
			this.drawObj(obj);

			if (obj.angle == newAngle)
			{
				clearInterval(this.sequenceTempo);
				continueAnimation();
			}
		}, time);
	}

	launchAnimation(key, callNextSequenceLine)
	{
		if (key.indexOf("Move") != -1)
		{
			let index = key.indexOf("Move");
			let objName = key.slice(0, index);
			let obj = this.map['objectList'][objName];
			let action = key.slice(index, key.length);
			let newPos = this.moveObj(obj, action);
			let newPosCol = newPos['posCol'];
			let newPosRow = newPos['posRow'];

			if (this.checkEdgeCollision(newPosCol, newPosRow) == true)
			{
				callNextSequenceLine();
				return;
			}

			this.smoothMoveObj(10, objName, obj, newPosCol, newPosRow, ()=>
			{
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
							let message = this.htmlLang == "en" ? "You drowned!" : "溺れた";
							this.loadGameLost(message);
						}
					}
				}
				callNextSequenceLine();
			});
		}
		else if (key.indexOf("Rotate") != -1)
		{
			let index = key.indexOf("Rotate");
			let objName = key.slice(0, index);
			let obj = this.map['objectList'][objName];

			key = key.replace(objName + "Rotate", "");
			key = key.match(/\d+/g) != null ? parseInt(key, 10) : key;

			let newAngle = this.rotateObj(this.player, key);
			this.smoothRotateObj(5, obj, newAngle, ()=>
			{
				callNextSequenceLine()
			})
		}
	}

	loadAnimation()
	{
		this.launchAnimation(this.sequence[0], () =>
		{
			this.sequence.splice(0, 1);
			// call next sequence line
			if (this.sequence.length > 0)
			{
				//this.launchAnimation(this.sequence[0]);
				this.loadAnimation();
			}
			// no more sequence line
			else
			{
				this.codeLinesEngine.codeLines.shift();
				this.codeLinesEngine.currentSequenceLine += 1;
				// call next code line
				if (this.codeLinesEngine.codeLines.length > 0)
				{
					this.checkCode();
				}
				// no more code line
				else
				{
					let textarea = document.getElementById('code-container');
					let runButton = document.getElementById('run-button');
					textarea.style = '';
					runButton.style = '';
				}
			}
		})
	}

	checkCode()
	{
		let codeLines = this.codeLinesEngine.codeLines;

		codeLines = codeLines.length == 0 ? this.codeLinesEngine.getLines : codeLines;

		if (codeLines.length > 0)
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
				this.codeLinesEngine.colorcurrentSequenceLine("correctCode");
				this.loadAnimation();
			}
			else
			{
				this.codeLinesEngine.colorcurrentSequenceLine("wrongCode");
				this.codeLinesEngine.codeLines = [];

				this.loadGameLost("error");
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

// SOME MOUSE TOOLS

	getMouseCanvasPos(canvas, event)
	{
		let canvasInfos = canvas.getBoundingClientRect();
		let canvasTop = canvasInfos.top;
		let canvasLeft = canvasInfos.left;

		return [event.clientX - canvasLeft, event.clientY - canvasTop];
	}

	putObjDomOnMouse(obj, event)
	{
		obj.style.left = event.clientX + "px";
		obj.style.top = event.clientY + "px";
	}

// MEASURING DEVICE

	closeMeasure(canvas)
	{
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let measureMobileIcon = document.getElementById('measureMobile-icon');
		if (measureMobileIcon)
		{
			measureMobileIcon.remove();
		}

		this.isMeasure = false;
		canvas.onmousemove = null;
		canvas.onclick = null;
	}

	drawMeasure(canvas, originX, originY, originCol, originRow)
	{
		let that = this;
		canvas.onclick = null;
		document.getElementById('measureMobile-icon').remove();
		canvas.onmousemove = function(event)
		{
			let ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			let canvasMousePos = that.getMouseCanvasPos(canvas, event)

			// get hypoT
			let posX = canvasMousePos[0];
			let posY = canvasMousePos[1];

			let col = Math.floor(posX / that.map['cellSize']);
			let row = Math.floor(posY / that.map['cellSize']);

			let lengthCol = col - originCol;
			let lengthRow = row - originRow;

			let hypoT = Math.floor(Math.sqrt((lengthCol * lengthCol) + (lengthRow * lengthRow)));

			// get angle
			let angle = Math.atan2(lengthRow - 0, lengthCol - 0) * 180/Math.PI;


			angle = angle < 0 ? angle + 360 : angle;
			angle += 90;
			angle = angle >= 360 ? Math.floor(angle - 360): Math.floor(angle);

			ctx.beginPath();
			ctx.moveTo(originX, originY);
			ctx.lineTo(posX, posY);
			ctx.strokeStyle = "blue";
			ctx.stroke();
			ctx.closePath();

			ctx.arc(originX, originY, 10, 0, 2 * Math.PI);
			ctx.fillStyle = "rgba(75, 75, 175, 0.2)";
			ctx.fill();

			ctx.font = "18px Arial";
			ctx.fillStyle = "orange";
			ctx.fillText(angle + "°",  originX + 8, originY - 8); 
			ctx.fillText(hypoT, posX, posY); 
		}
		canvas.onclick = function()
		{
			that.closeMeasure(canvas);
		}
	}

	beginMeasure(canvas, e)
	{
		if (this.isMeasure == false)
		{
			let that = this;
			let measureMobileIcon = document.createElement('img');
			measureMobileIcon.setAttribute('id', 'measureMobile-icon')
			measureMobileIcon.setAttribute('src', './assets/img/latte.png')
			measureMobileIcon.classList.add('measureMobile-icon');
			document.body.appendChild(measureMobileIcon);

			this.putObjDomOnMouse(measureMobileIcon, e);

			this.isMeasure = true;

			canvas.onmousemove = function(event)
			{
				that.putObjDomOnMouse(measureMobileIcon, event);
			};

			canvas.onclick = function(event)
			{
				let canvasMousePos = that.getMouseCanvasPos(canvas, event)

				let originCol = Math.floor(canvasMousePos[0] / that.map['cellSize']);
				let originRow = Math.floor(canvasMousePos[1] / that.map['cellSize']);
				let originX = originCol * that.map['cellSize'];
				let originY = originRow * that.map['cellSize'];
				that.drawMeasure(canvas, originX, originY, originCol, originRow);
			};
		}
		else
		{
			this.closeMeasure(canvas);
		}
	}

// INSERT TEXT NAME OBJECT ON CLICK

	insertTextAtCursor(text)
	{
	    let sel, range, html;
	    let codeContainer = document.getElementById('code-container');
	    if (window.getSelection)
	    {
	        sel = window.getSelection();
	        // check if cursor is in code-container
            let isCodeContainerParent = sel;
            while (isCodeContainerParent && isCodeContainerParent != codeContainer)
            {
            	isCodeContainerParent = isCodeContainerParent.focusNode || isCodeContainerParent.parentNode;
            }
            // insert text
	        if (isCodeContainerParent && sel.getRangeAt && sel.rangeCount)
	        {
	            range = sel.getRangeAt(0);
	            range.deleteContents();
	            range.insertNode(document.createTextNode(text));
	        }
	    }
	}

	overObject(canvas, event)
	{
		let that = this;

		let mouseXY = this.getMouseCanvasPos(canvas, event);

		let mouseObj =
		{
			posCol: Math.floor(mouseXY[0] / this.map['cellSize']),
			posRow: Math.floor(mouseXY[1] / this.map['cellSize']),
			cellWidth: 1,
			cellHeight: 1
		}

		canvas.style.cursor = "";

		if (this.isMeasure == false)
		{
			canvas.onclick = null;
		}

		if (this.checkCollisionBetween(mouseObj, this.map['objectList']['player']))
		{
			canvas.style.cursor = "pointer";

			if (this.isMeasure == false)
			{
				canvas.onclick = function()
				{
					that.insertTextAtCursor("Player");
					canvas.onclick = null;
				}
			}
		}
		else if (this.checkCollisionBetween(mouseObj, this.map['objectList']['turtle']))
		{
			canvas.style.cursor = "pointer";

			if (this.isMeasure == false)
			{
				canvas.onclick = function()
				{
					that.insertTextAtCursor("Turtle");
					canvas.onclick = null;
				}
			}
		}
	}

// INTRO AND OUTRO MODAL BOX

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

		messageContent.innerText = this.htmlLang == "en" ? this.map['introEn'] : this.map['introJp'];
		introButton.classList.remove('hidden');
	}

// INIT AND RESET

	reset()
	{
		let events = false;

		let messageContainer = document.getElementById('message-container');
		let restartButton = document.getElementById('restart-button');

		messageContainer.classList.add('hidden');
		restartButton.classList.add('hidden');

		this.codeLinesEngine.resetColorLines();

		let textarea = document.getElementById('code-container');
		let runButton = document.getElementById('run-button');
		textarea.style = '';
		runButton.style = '';

		this.init(events);
	}

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
  				let that = this;

				let runBtn = document.getElementById('run-button');
				runBtn.addEventListener('click', () => { this.checkCode(); }, false);

	  			window.addEventListener('resize', () => { this.updateCanvasSize(); }, false);

				let introButton = document.getElementById('intro-button');
	  			introButton.addEventListener('click', () => { this.closeGameIntro(); }, false);

				let restartButton = document.getElementById('restart-button');
	  			restartButton.addEventListener('click', () => { this.reset(); }, false);

				let uiCanvas = document.getElementById('ui-canvas');
	  			uiCanvas.addEventListener('mousemove', this.overObject.bind(this, uiCanvas), false);

	  			let measureIcon = document.getElementById('measure-icon');
	  			measureIcon.addEventListener('click', this.beginMeasure.bind(this, uiCanvas), false);

	  			this.loadGameIntro();
  			}

  			//display game board
  			this.updateCanvasSize();
		});
	}
}

let engine = new Engine();