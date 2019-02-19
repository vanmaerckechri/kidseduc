<?php ob_start(); ?>

<header>
	<div class="header-content maxWidth-container">
		<h1>Kidseduc</h1>
		<?php
		if ($currentPage != 'home')
		{
		?>
			<div class="flags-container">
				<a href="<?= $EnglishLink ?>"><img src="./assets/img/flag-en_low.png" alt="english flag"></a>
				<a href="<?= $JapanLink ?>"><img src="./assets/img/flag-jp_low.png" alt="japan flag"></a>
			</div>
		<?php
		}
		?>
	</div>
</header>

<?php $headerContent = ob_get_clean(); ?>