<?php

$action = isset($_GET['action']) ? $_GET['action'] : false;

if ($action !== false)
{
    if ($action == 'game')
    {
        require('./Controllers/GameController.php');
        GameController::displayBoards();
    }
    else
    {
        require('./Controllers/HomeController.php');
        HomeController::displayFlags();       
    }
}
else
{
    require('./Controllers/HomeController.php');
    HomeController::displayFlags();
}