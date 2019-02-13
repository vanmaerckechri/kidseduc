<?php

class LanguageLinks
{
    public static function update($language)
    {
    	$currentUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    	$langs = array("&lang=en", "&lang=jp");
        
    	return str_replace($langs, "", $currentUrl) . "&lang=" . $language;
    }
}
