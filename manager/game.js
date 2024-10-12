class GameManager {
    constructor(renderManager, currentSession) {
        this.session = currentSession;        
        this.renderer = renderManager;
        this.renderer.setGrid(this.session.grid, 540, 540);
        
        for ( let i=0;i < this.session.units.length;i++) 
        {
            this.renderer.createCanvas(`unit-${i}`, 3);
        }

        this.renderer.layers['end'].addEventListener('click', this.endTurn.bind(this));
        this.renderer.layers['click'].addEventListener('click', this.onGridClick.bind(this));
        this.update();
    }

    //----------------------------------------------
    // Actions
    //----------------------------------------------
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
            x >= 0 && x < this.session.grid.columns &&
            y >= 0 && y < this.session.grid.rows &&
            Math.abs(x - unit.x) + Math.abs(y - unit.y) <= unit.moveRange &&
            !allUnits.some(u => u.x === x && u.y === y)
        );
    }

    highlightMoveRange(unit) {
        if (unit) {         
            for (let x = 0; x < this.session.grid.columns; x++) {
                for (let y = 0; y < this.session.grid.rows; y++) {
                    if (this.isValidMove(x, y, unit)) {
                        this.renderer.renderTile('highlight', x, y);
                    }
                }
            }
        }
    }

    //----------------------------------------------
    // Responses
    //----------------------------------------------
    onGridClick(event) {
        const rect = this.renderer.layers['grid'].getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.renderer.grid.tileWidth);
        const y = Math.floor((event.clientY - rect.top) / this.renderer.grid.tileHeight);

        if (this.session.selectedUnit) {
            this.moveUnit(x, y, this.session.selectedUnit);
        } else {
            this.selectUnit(x, y);
        }
    }

    //----------------------------------------------
    // Interaction
    //----------------------------------------------
    update() {                
        this.renderer.clear('highlight');
        this.renderer.renderPrompt(`Current Player: ${this.session.currentPlayer.name} ${(this.session.selectedUnit ? '(Unit selected)' : '')}`);
        if (this.session.selectedUnit) this.highlightMoveRange(this.session.selectedUnit);
        for ( let i=0;i < this.session.units.length;i++) 
        {
            let unit = this.session.units[i];
            this.renderer.renderUnit('unit-'+unit.id, unit.x,unit.y,unit.color);    
        }
    }
}