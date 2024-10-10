class TacticalGame {
    constructor(canvasId, currentSession) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = currentSession.gridSize;
        this.cellSize = this.canvas.width / this.gridSize;
        this.session = currentSession;        
        //Game Data

        this.canvas.addEventListener('click', this.handleClick.bind(this));
        document.getElementById('endTurnBtn').addEventListener('click', this.endTurn.bind(this));
        this.updateGameInfo();
        this.render();
    }

    //----------------------------------------------
    // Interaction
    //----------------------------------------------
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.cellSize);
        const y = Math.floor((event.clientY - rect.top) / this.cellSize);

        if (this.session.selectedUnit) {
            this.moveUnit(x, y, this.session.selectedUnit);
        } else {
            this.selectUnit(x, y);
        }
    }

    selectUnit(x, y) {
        const findUnit = this.session.units.find(unit => unit.x === x && unit.y === y && unit.playerId === this.session.currentPlayer.id);
        if (findUnit) {
            this.session.selectedUnit = findUnit;
            this.updateGameInfo();
            this.render();
        }
    }

    
    //----------------------------------------------
    // Conditions
    //----------------------------------------------
    isValidMove(x, y, unit) {
        let allUnits = this.session.units;
        return (
            x >= 0 && x < this.gridSize &&
            y >= 0 && y < this.gridSize &&
            Math.abs(x - unit.x) + Math.abs(y - unit.y) <= unit.moveRange &&
            !allUnits.some(u => u.x === x && u.y === y)
        );
    }


    moveUnit(x, y, unit) {
        if (this.isValidMove(x, y, unit)) {
            unit.x = x;
            unit.y = y;
            this.session.selectedUnit = null;
            this.endTurn();
        }
    }


    endTurn() {
        this.session.selectedUnit = null;
        this.session.currentPlayerIndex = (this.session.currentPlayerIndex + 1) % this.session.players.length;
        this.session.currentPlayer = this.session.players[this.session.currentPlayerIndex];
        this.updateGameInfo();
        this.render();
    }

    

    updateGameInfo() {
        const infoElement = document.getElementById('game-info');
        infoElement.innerHTML = `Current Player: ${this.session.currentPlayer.name}`;
        if (this.session.selectedUnit) {
            infoElement.innerHTML += ' (Unit selected)';
        }
    }

    render() {                
        this.renderClear();
        this.renderGrid();
        this.renderMovementRange(this.session.selectedUnit);
        this.session.units.forEach(this.renderUnit.bind(this));
    }

    renderError(message) {
        console.log(message);
    }

    renderClear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderGrid() {
        // Draw grid
        this.ctx.strokeStyle = '#666';  // Darker grid lines
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.gridSize; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.gridSize; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
    }

    renderMovementRange(unit) {
        if (unit) {
            this.ctx.fillStyle = 'rgba(144, 238, 144, 0.5)';           
            for (let x = 0; x < this.gridSize; x++) {
                for (let y = 0; y < this.gridSize; y++) {
                    if (this.isValidMove(x, y, unit)) {
                        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                    }
                }
            }
        }
    }

    renderUnit(unit) {
        //if (imageAvailable) {
            //render image
        //}
        //else {
            // Draw units as colored tiles
            this.ctx.fillStyle = unit.color;
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.fillRect(unit.x * this.cellSize, unit.y * this.cellSize, this.cellSize, this.cellSize);
            this.ctx.strokeRect(unit.x * this.cellSize, unit.y * this.cellSize, this.cellSize, this.cellSize);
        //}                
    }
}