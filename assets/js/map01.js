class Map
{
	constructor()
	{
		this.canvas = document.getElementById('board-canvas');
		this.ctx = this.canvas.getContext('2d');

		this.cellSize = 16;
		this.rowsLength = 21,
		this.colsLength = 21,
		this.cellsInfos = [],

		this.introEn = "use the \"moveFront (2)\" command to reach the star ... the value in parenthese is the number of steps";
		this.introJp = "\"moveFront (2)\" コマンドを使用して星に到達します";

		this.shortcutsName = ["move front"];
		this.shortcutsCommand = ["moveFront"];

		this.water = new Water(Math.floor(this.rowsLength / 2), Math.floor(this.colsLength / 2));
		/*this.water['cellHeight'] = this.water['spriteSizeSrcY'] / this.cellSize;
		this.water['cellWidth'] = this.water['spriteSizeSrcX'] / this.cellSize;*/

		this.bushes = [new Bushes(12, 12, 12), new Bushes(20, 12, 12)];

		this.objectList =
		{
			player: new Player(Math.floor((this.rowsLength / 5) * 4), Math.floor(this.colsLength / 2)),
			turtle: new Turtle()
		}
		this.objectList['turtle']['posRow'] = Math.floor(this.water['posRow']);
		this.objectList['turtle']['posCol'] = Math.floor(this.colsLength / 5);

		this.starsList = 
		{
			star1: new Star(Math.floor(this.rowsLength / 5), Math.floor(this.colsLength / 6)),
			star2: new Star(Math.floor(this.rowsLength / 5), Math.floor((this.colsLength / 6) * 3)),
			star3: new Star(Math.floor(this.rowsLength / 5), Math.floor((this.colsLength / 6) * 5))
		}
	}
}