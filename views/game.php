<?php 
ob_start();
?>

<div id="main">
	<div class="game-container maxWidth-container">
		<div class="game-board">
			<canvas id="board-canvas" class="board-canvas game-canvas"></canvas>
			<canvas id="turtle-canvas" class="game-canvas"></canvas>
			<canvas id="player-canvas" class="game-canvas"></canvas>
			<canvas id="star-canvas" class="game-canvas"></canvas>
			<canvas id="ui-canvas" class="game-canvas"></canvas>
			<img id="measure-icon" class="measure-icon" src="./assets/img/latte.png" alt="measure-icon">
		</div>
		<div class="code-board">
			<div class="code-example">
				<p>moveFront(x) - moveBack(x) - rotate(y) - rotateRight(x) - rotateLeft(x)</p>
				<p>x = loop times; y = angle</p>
				<p>example:</p>
				<p>Turtle.moveFront(5)</p>
				<p>Player.moveFront(6)</p>
				<p>Turtle.moveFront(7)</p>
				<p>moveFront(5)</p>
				<p>rotateLeft()</p>
				<p>Player.moveFront(13)</p>
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
	<div id="message-container" class="message-container">
		<div class="message-box">
			<p id="message-content" class="message-content">LOADING</p>
			<button id="intro-button" class="message-button hidden">
				<?= $pageLang == "en" ?
					"PLAY" : 
					"遊びます"
				?>
			</button>
			<button id="restart-button" class="message-button hidden">
				<?= $pageLang == "en" ?
					"RESTART" : 
					"再起動"
				?>
			</button>
			<button id="nextLevel-button" class="message-button hidden">
				<?= $pageLang == "en" ?
					"NEXT" : 
					"次"
				?>
			</button>
		</div>
	</div>
</div>

<?php
$mainContent = ob_get_clean();

ob_start();
?>
<script src="./assets/js/entities.js"></script>
<script src="./assets/js/maps.js"></script>
<script src="./assets/js/codelines.js"></script>
<script src="./assets/js/game.js"></script>
<?php
$javascriptContent = ob_get_clean();

require('layout.php');
?>