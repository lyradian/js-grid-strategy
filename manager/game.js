class GameManager {
    constructor(renderManager, currentSession) {
        this.session = currentSession;        
        this.renderer = renderManager;
        this.gridRows = currentSession.grid.rows;
        this.gridColumns = currentSession.grid.columns;
        this.renderer.setTileWidth(this.gridColumns);
        this.renderer.setPromptContainer('game-info');

        this.renderer.canvas.addEventListener('click', this.onGridClick.bind(this));
        document.getElementById('endTurnBtn').addEventListener('click', this.endTurn.bind(this));
        this.update();
    }

    //----------------------------------------------
    // Interaction
    //----------------------------------------------
    onGridClick(event) {
        const rect = this.renderer.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.renderer.tileWidth);
        const y = Math.floor((event.clientY - rect.top) / this.renderer.tileWidth);

        if (this.session.selectedUnit) {
            this.moveUnit(x, y, this.session.selectedUnit);
        } else {
            this.selectUnit(x, y);
        }
    }

    selectUnit(x, y) {
        const findUnit = this.session.units.find(unit => 
               unit.x === x 
            && unit.y === y 
            && unit.playerId === this.session.currentPlayer.id
        );
        if (findUnit) {
            this.session.selectedUnit = findUnit;
            this.update();
        }
    }

    moveUnit(x, y, unit) {
        if (this.isValidMove(x, y, unit)) {
            unit.x = x;
            unit.y = y;
            this.endTurn();
        }
    }


    endTurn() {
        this.session.selectedUnit = null;
        this.session.currentPlayerIndex = (this.session.currentPlayerIndex + 1) % this.session.players.length;
        this.session.currentPlayer = this.session.players[this.session.currentPlayerIndex];
        this.update();
    }  
    
    //----------------------------------------------
    // Conditions
    //----------------------------------------------
    isValidMove(x, y, unit) {
        let allUnits = this.session.units;
        return (
            x >= 0 && x < this.gridColumns &&
            y >= 0 && y < this.gridRows &&
            Math.abs(x - unit.x) + Math.abs(y - unit.y) <= unit.moveRange &&
            !allUnits.some(u => u.x === x && u.y === y)
        );
    }

    highlightMoveRange(unit) {
        if (unit) {         
            for (let x = 0; x < this.gridColumns; x++) {
                for (let y = 0; y < this.gridRows; y++) {
                    if (this.isValidMove(x, y, unit)) {
                        this.renderer.renderTile(x, y);
                    }
                }
            }
        }
    }

    //------------------------------------
    // Render
    //------------------------------------
    update() {                
        this.renderer.clear();
        this.renderer.renderGrid(this.gridColumns, this.gridRows);
        this.renderer.renderPrompt(`Current Player: ${this.session.currentPlayer.name} ${(this.session.selectedUnit ? '(Unit selected)' : '')}`);
        if (this.session.selectedUnit) this.highlightMoveRange(this.session.selectedUnit);
        this.session.units.forEach(this.renderer.renderUnit.bind(this.renderer));
    }
}