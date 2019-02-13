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

	class Engine
	{
		static init()
		{
			CodeLines.init()
		}
	}

	Engine.init();
});