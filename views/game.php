<?php 
ob_start();
?>

<div id="main">
	<div class="game-container maxWidth-container">
		<div class="game-board">
			<canvas id="board-canvas" class="game-canvas"></canvas>
			<canvas id="turtle-canvas" class="game-canvas"></canvas>
			<canvas id="player-canvas" class="game-canvas"></canvas>
		</div>
		<div class="code-board">
			<div class="code-example">
				<p>moveFront(x) - moveBack(x) - rotate(y) - rotateRight(x) - rotateLeft(x)</p>
				<p>x = loop times; y = angle</p>
				<p>example:</p>
				<p>Player.moveFront(5)</p>
				<p>Player.rotate(15)</p>
				<p>moveFront(5)</p>
				<p>rotateRight(3)</p>
				<p>Player.moveBack(3)</p>
			</div>
			<!--<textarea id="code-container" class="code-container"></textarea>-->
			<code id="code-container" class="code-container" contenteditable="true" spellcheck="false">
			</code>
			<div class="buttons-container">
				<div class="buttons-settings">
					<button id="run-button" class="run-button">
						<?= $pageLang == "en" ?
							"<p>Run<p>" : 
							"<p>走る<p>"
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
<script src="./assets/js/map.js"></script>
<script src="./assets/js/game.js"></script>
<?php
$javascriptContent = ob_get_clean();

require('layout.php');
?>