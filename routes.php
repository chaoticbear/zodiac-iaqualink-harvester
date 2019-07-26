<?php
return function(\FastRoute\RouteCollector $r) {
    /*
    $r->addRoute('GET', '/', 'UsersSpirit@index');
    $r->addRoute('POST', '/', 'UsersSpirit@postIndex');
    $r->addRoute('GET', '/thank-you', 'UsersSpirit@thankYou');
    $r->addRoute('GET', '/sign-in', 'UsersSpirit@signIn');
     */
    $r->addRoute('CAST', '/harvest-zodiac-iaqualink', 'ZodiacSpirit@harvestIAquaLink');
};
