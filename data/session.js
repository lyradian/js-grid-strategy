class Session {
    constructor(sessionData = {
        players: [
            { id: 1, name: 'Blue', color: '#4169E1' },
            { id: 2, name: 'Red', color: '#DC143C' }
        ],
        units: [
            { id: '0', x: 0, y: 0, playerId: 1, moveRange: 3, color: '#4169E1'},
            { id: '1', x: 7, y: 5, playerId: 2, moveRange: 4, color: '#DC143C' }
        ],
        grid: {
            columns: 8,
            rows: 6,
        }
    }) 
    {
        
        this.grid = sessionData.grid;
        this.players = sessionData.players;
        this.units = sessionData.units;
        this.currentPlayerIndex = 0;

        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.selectedUnit = null;
    }
    
    save() {

    }
}