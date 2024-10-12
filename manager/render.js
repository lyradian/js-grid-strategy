class RenderManager {

    constructor(containerID, width = 800, height = 600) {
        this.container = document.getElementById(containerID);
        this.container.style.position = 'relative';
        this.container.style.width = `${width}px`;
        this.container.style.height = `${height}px`;
        this.width = width;
        this.height = height;
        this.grid = {
            tileWidth: 0,
            tileHeight: 0,
            width: 0,
            height: 0,
            rows: 0,
            columns: 0
        };
        this.layers = {};
        this.createCanvas('grid', 1);
        this.createCanvas('highlight', 2);
        this.createText('prompt', 'Initialising', 9);
        this.createButton('end', 'End Turn', 10);
        this.createCanvas('click', 4);
        
    }


    createCanvas(id, zIndex, width=this.width, height=this.height) {
        const element = document.createElement('canvas');
        element.type = "canvas";
        element.id = id;
        element.width = this.width;
        element.height = this.height;
        element.style.position = 'absolute';
        element.style.left = '0px';
        element.style.top = '0px';
        element.style.background = 'transparent';
        element.style.width =  `${this.width}px`;
        element.style.height =  `${this.height}px`;
        element.style.zIndex = zIndex;
        element.ctx = element.getContext('2d');
        element.ctx.alpha = 1;
        this.container.appendChild(element);
        this.layers[id] = element;
        return element;
    }

    
    createText(id, text, zIndex, x=0, y=0) {
        const element = document.createElement('div');
        element.type = "text";
        element.id = id;
        element.innerText = text;
        element.style.zIndex = zIndex;
        element.style.position = 'absolute';
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        this.container.appendChild(element);
        this.layers[id] = element;
        return element;
    }

    createButton(id, label, zIndex, x=0,y=0, onClick=null) {
        const element = document.createElement('button');
        element.type = "button";
        element.id = id;
        element.innerText = label;
        element.style.zIndex = zIndex;
        element.style.position = 'absolute';
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        if (onClick!=null)
            element.addEventListener('click', onClick);
        this.container.appendChild(element);
        this.layers[id] = element;
        return element;
    }

    setGrid(gridColumns, gridRows, gridWidth=this.width, gridHeight=this.height) {
        this.grid.width = gridWidth;
        this.grid.height = gridHeight;
        this.grid.rows = gridRows;
        this.grid.columns = gridColumns;
        this.grid.tileWidth = gridWidth / gridColumns;
        this.grid.tileHeight = gridHeight / gridRows;
        this.renderGrid(gridColumns, gridRows);
    }


    clear(id) {
        const layer = this.layers[id];
        switch (layer.type) 
        {
            case 'canvas':
                layer.ctx.fillStyle = "rgba(255,255,255,0);"
                layer.ctx.clearRect(0, 0, this.width, this.height);
                break;
            case 'button':
            case 'text':
            default:
                ;
        }
    }

    clearAll() 
    {
        for (const layerId of Object.keys(this.layers)) {
            this.clear(layerId);
        }
    }

    renderPrompt(message) {
        this.layers['prompt'].innerHTML = message;        
    }

    renderGrid(xTiles, yTiles) {
        const ctx = this.layers['grid'].ctx;
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= xTiles; x++) {
            ctx.beginPath();
            ctx.moveTo(x * this.grid.tileWidth, 0);
            ctx.lineTo(x * this.grid.tileWidth, this.grid.height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= yTiles; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * this.grid.tileHeight);
            ctx.lineTo(this.grid.width, y * this.grid.tileHeight);
            ctx.stroke();
        }
    }

    renderTile(x, y, fill = 'rgba(144, 238, 144, 0.5)') {
        const ctx = this.layers['highlight'].ctx;
        ctx.fillStyle = fill;
        ctx.fillRect(x * this.grid.tileWidth, y * this.grid.tileHeight, this.grid.tileWidth, this.grid.tileHeight);
    }


    renderUnit(unitId, x, y, color) {
        this.clear(unitId);
        const ctx = this.layers[unitId].ctx;
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillRect(x * this.grid.tileWidth, y * this.grid.tileHeight, this.grid.tileWidth, this.grid.tileHeight);
        ctx.strokeRect(x * this.grid.tileWidth, y * this.grid.tileHeight, this.grid.tileWidth, this.grid.tileHeight);
    }

    removeUnit(unitId) {
        if (this.layers[unitId]) {
            this.container.removeChild(this.unitLayers[unitId].canvas);
            delete this.unitLayers[unitId];
        }
    }

    animateUnit(unitId, frames, frameDuration) {
        const layer = this.layers[unitId];
        if (!layer) return;

        let frameIndex = 0;
        const animate = () => {
            if (frameIndex >= frames.length) return;

            const frame = frames[frameIndex];
            layer.ctx.clearRect(0, 0, this.width, this.height);
            layer.ctx.drawImage(frame, 0, 0);

            frameIndex++;
            setTimeout(animate, frameDuration);
        };

        animate();
    }
}