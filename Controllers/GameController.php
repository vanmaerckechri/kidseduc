<?php

include './Controllers/Middleware/PageLang.php';
include './Controllers/Middleware/LanguageLinks.php';

class GameController
{
	public static function displayBoards()
	{
		$currentPage = 'game';

		$pageLang = PageLang::get();
		$pageTitle = $pageLang == 'en' ? 'Kidseduc - Game' : 'Kidseduc - ゲーム';

		$JapanLink = LanguageLinks::update('jp');
		$EnglishLink = LanguageLinks::update('en');

		require('./views/game.php');
	}
}