<?php

class PageLang
{
    public static function get()
    {
        return isset($_GET['lang']) && $_GET['lang'] == "jp" ? "jp" : "en";
    }
}
