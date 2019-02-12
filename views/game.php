<?php 
ob_start();
?>

<div id="main">
	<div class="game-container maxWidth-container">
		<div class="game-board">
			<canvas id="game-canvas" class="game-canvas"></canvas>
		</div>
		<div class="code-board">
			<div class="code-container">
				<?= $pageLang == "en" ?
					"<p>Code...</p>" : 
					"<p>コード...</p>"
				?>
			</div>
			<div class="buttons-container">
				<div class="buttons-settings">
					<?= $pageLang == "en" ?
						"<p>Run and settings buttons...</p>" : 
						"<p>実行ボタンと設定ボタン...</p>"
					?>
				</div>
				<div class="buttons-codeShortcuts">
					<?= $pageLang == "en" ?
						"<p>Code shortcuts buttons...</p>" : 
						"<p>コードショートカットボタン...</p>"
					?>
				</div>
			</div>
		</div>
	</div>
</div>

<?php
$mainContent = ob_get_clean();

ob_start();
?>
<script src="./assets/js/tools.js"></script>
<script src="./assets/js/game.js"></script>
<?php
$javascriptContent = ob_get_clean();

require('layout.php');
?>