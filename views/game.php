<?php 
ob_start();
?>

<div id="main">
	<div class="game-container maxWidth-container">
		<div class="game-board">
			<canvas id="board-canvas" class="game-canvas"></canvas>
			<canvas id="player-canvas" class="game-canvas"></canvas>
		</div>
		<div class="code-board">
			<textarea id="code-container" class="code-container"></textarea>	
			<div class="buttons-container">
				<div class="buttons-settings">
					<button id="run-button" class="run-button">
						<?= $pageLang == "en" ?
							"Run" : 
							"走る"
						?>
					</button>
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
<script src="./assets/js/game.js"></script>
<?php
$javascriptContent = ob_get_clean();

require('layout.php');
?>