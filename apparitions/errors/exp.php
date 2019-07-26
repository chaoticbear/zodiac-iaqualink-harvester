<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Uncaught Exception Error</title>
    </head>
    <body>
        <h1>Uncaught Exception Error</h1>
        <p>Exception(<?=$e->getCode();?>):<?=$e->getMessage();?></p>
        <p>Please go <a href="javascript:history.back(1)">back</a> and try again.</p>
    </body>
</html>
