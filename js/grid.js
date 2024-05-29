class Grid {
	constructor(canvas, rows, columns) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.columns = columns;
		this.rows = rows;
		this.gridInfo = [...Array(rows)].map(() => Array(columns).fill(0));
		this.cellWidth = canvas.width / (columns + 2);
		this.cellHeight = this.cellWidth / 2;
		this.startingX = canvas.width / 2 - 0.5;
		this.startingY = canvas.height / 2 - canvas.width / 4 - 0.5;
	}

	Draw(ctx) {
		this.ctx = ctx;
		let canvas = this.canvas;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let col = 0; col < this.columns; col++) {
			for (let row = 0; row < this.rows; row++) {
				this.DrawCell(col, row);
			}
		}
	}

	DrawCell(col, row) {
		let cellWidth = this.cellWidth;
		let cellHeight = this.cellHeight;
		let x = this.startingX + col + cellWidth * col / 2 - row * cellWidth / 2;
		let y = this.startingY + row + cellHeight * row / 2 + col * cellHeight / 2;
		ctx.beginPath();
		ctx.moveTo(x, y); //top
		ctx.lineTo(x + cellWidth / 2, y + cellHeight / 2); //downright to right
		ctx.lineTo(x, y + cellHeight); //downleft to bottom
		ctx.lineTo(x - cellWidth / 2, y + cellHeight / 2); //upleft to left
		ctx.closePath(); //close back to top

		switch ((col+row)%3) { //this.gridInfo[row][col]) {
			case 1: ctx.fillStyle = 'pink'; break;
			case 2: ctx.fillStyle = 'green'; break;
			default: ctx.fillStyle = 'purple';
		}
		
		ctx.fill();
		ctx.strokeStyle = 'white';
		ctx.stroke();
	}

	IsPointInCell(cursorX, cursorY, col, row) {
		const cellWidth = this.cellWidth;
		const cellHeight = this.cellHeight;
		const cellX = this.startingX + col + cellWidth * col / 2 - row * cellWidth / 2;
		const cellY = this.startingY + row + cellHeight * row / 2 + col * cellHeight / 2;
		const vertices = [
			[cellX, cellY],
			[cellX + cellWidth / 2, cellY + cellHeight / 2],
			[cellX, cellY + cellHeight],
			[cellX - cellWidth / 2, cellY + cellHeight / 2]
		];
		let inside = false;
		for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
			const xi = vertices[i][0], yi = vertices[i][1];
			const xj = vertices[j][0], yj = vertices[j][1];
			const intersect = ((yi > cursorY) !== (yj > cursorY)) && (cursorX < (xj - xi) * (cursorY - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}
		return inside;
	}

	HighlightCell(mouseX, mouseY) {
		let positionFound = false;
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {
				if (this.IsPointInCell(mouseX, mouseY, col, row)) {
					positionFound = true;
					this.gridInfo[row][col] = 2;
					this.DrawCell(col, row);
				}

			}
		}
	}
}