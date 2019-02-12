document.addEventListener("DOMContentLoaded", function(event)
{
	class Engine
	{
		static init()
		{
			// update flags links to change lang on current page
			let currentPageWithoutLang = Tools.removePartOfString(window.location.href, "&lang=", 8);
			let flagLinks = document.querySelectorAll('.flags-container a');
			flagLinks[0].href = currentPageWithoutLang + "&lang=en";
			flagLinks[1].href = currentPageWithoutLang + "&lang=jp";
		}
	}

	Engine.init();
});