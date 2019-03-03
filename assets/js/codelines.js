class CodeLinesEngine
{
	constructor(mapObjs)
	{
		this.reg = this.init(mapObjs);
		this.regObjName;
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

	manageError(lang)
	{
		let error = "";
		let code = this.codeLines[0];
		// test if object name is correct
		let codeResult = code.match(this.regObjName);
		// object name is correct
		if (codeResult)
		{
			// check if dot exist after the name
			let regDot = "^(" + codeResult[0] + "\\.)";
			if (!code.match(regDot))
			{
				error = lang == "en" ? "Missing a point between the name of the object and the desired action" : "オブジェクトの名前と目的のアクションの間にポイントがない";
			}
			else
			{
				error = lang == "en" ? "The action attributed to the object is non-existent or incorrect. Correct code example: " + codeResult[0] + "." + "moveFront(1)" : "未確認の情報がありません。コード例の修正" + codeResult[0] + "." + "moveFront(1)";
			}
		}
		// object name is unknow
		else
		{
			// check if first letter of object name need to uppercase
			let codeUpper = code;
			codeUpper = codeUpper.charAt(0).toUpperCase() + codeUpper.slice(1);
			let codeUpperResult = codeUpper.match(this.regObjName);
			if (codeUpperResult)
			{
				error = lang == "en" ? "A capital letter is missing in the object namen: \"" + codeUpperResult[0] + "\"" : "オブジェクト名に大文字がありません: \"" + codeUpperResult[0] + "\"";
			}
			else
			{
				error = lang == "en" ? "The name of the object does not exist" : "オブジェクトの名前が存在しません";
			}
		}
		return error;
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
				
				this.regObjName = "^" + objName;
			}
			else
			{
				reg += "^" + objName + "\\.";

				this.regObjName += "^" + objName;
			}
			// regex methods
			for (let i = 0, length = mapObjects[curObj].length; i < length; i++)
			{
				reg = i == 0 ? reg + "(" : reg;

				reg += mapObjects[curObj][i];

				reg = i == length -1 ? reg + ")(\\(-?[0-9]*\\))$" : reg + "|";
			}
			
			reg = index == length ? reg + "$" : reg + "|";

			this.regObjName = index == length ? this.regObjName : this.regObjName + "|";

			index += 1;
		}

		return reg;
	}
}
