<?php require('./views/partials/header.php'); ?>

<!DOCTYPE html>
<html lang="<?= $pageLang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="">
    <link rel="icon" type="image/png" href="">
    <link rel="stylesheet" href="assets/css/style.css">
    <title><?= $pageTitle ?></title>
</head>
<body>
	<?= $headerContent ?>
	<?= $mainContent ?>
	<?= $javascriptContent ?? '' ?>
</body>
</html>