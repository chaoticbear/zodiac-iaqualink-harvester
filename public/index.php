<?php
ini_set('display_errors','On');
error_reporting(E_ALL);
require __DIR__ . '/../vendor/autoload.php';
(new Specter\Specter)->haunt();
