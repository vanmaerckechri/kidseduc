<?php 
ob_start();
?>

<div id="main">
	<div class="centerXY">
		<a class="flag" href="index.php?action=game&lang=en">
			<img src="./assets/img/flag-en.png" alt="english flag">
		</a>
		<a class="flag" href="index.php?action=game&lang=jp">
			<img src="./assets/img/flag-jp.png" alt="japan flag">
		</a>
	</div>
</div>

<?php
$mainContent = ob_get_clean();
require('layout.php');
?>