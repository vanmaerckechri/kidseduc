<?php

include './Controllers/Middleware/PageLang.php';

class GameController
{
	public static function displayBoards()
	{
		$currentPage = 'game';
		$pageLang = PageLang::get();
		$pageTitle = $pageLang == 'en' ? 'Kidseduc - Game' : 'Kidseduc - ゲーム';
		require('./views/game.php');
	}
}