class RenderManager {
    constructor(domCanvasID) {
        this.canvas = document.getElementById(domCanvasID);
        this.ctx = this.canvas.getContext('2d');
        this.tileWidth = 0;
        this.promptContainer = null;
    }

    setTileWidth(gridColumns) {
        this.tileWidth = this.canvas.width / gridColumns;
    }

    setPromptContainer(id) {
        this.promptContainer = document.getElementById(id);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderPrompt(message) {
        this.promptContainer.innerHTML = message;
    }

    renderGrid( xTiles, yTiles) {
        let tileWidth = this.tileWidth;
        // Draw grid
        let gridWidth = xTiles * tileWidth;
        let gridHeight = yTiles * tileWidth;
        this.ctx.strokeStyle = '#666';  // Darker grid lines
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= xTiles; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * tileWidth, 0);
            this.ctx.lineTo(x * tileWidth, gridHeight);
            this.ctx.stroke();
        }
        for (let y = 0; y <= yTiles; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * tileWidth);
            this.ctx.lineTo(gridWidth, y * tileWidth);
            this.ctx.stroke();
        }
    }

    renderTile(x,y, fill='rgba(144, 238, 144, 0.5)') {
        this.ctx.fillStyle = fill;           
        this.ctx.fillRect(x * this.tileWidth, y * this.tileWidth, this.tileWidth, this.tileWidth);
    }

    renderUnit(unit) {
        this.ctx.fillStyle = unit.color;
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(unit.x * this.tileWidth, unit.y * this.tileWidth, this.tileWidth, this.tileWidth);
        this.ctx.strokeRect(unit.x * this.tileWidth, unit.y * this.tileWidth, this.tileWidth, this.tileWidth);
    }

}