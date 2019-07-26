<?php
return [
    'url' => (getenv('URL') ?: 'localhost'),
    'dbs' => [
        'db' => [
            'dsn' => (getenv('DB_DSN') ?: 'mysql:host=localhost;dbname=database'),
            'user' => (getenv('DB_USER') ?: 'username'),
            'pass' => (getenv('DB_PASS') ?: 'password'),
        ],
    ],
];
