class RenderManager {

    constructor(containerID, width = 1200, height = 800) {
        this.container = document.getElementById(containerID);
        this.container.style.position = 'relative';
        this.container.style.width = `${width}px`;
        this.container.style.height = `${height}px`;
        this.container.width = width;
        this.container.height = height;
        this.container.padding = width*0.05;
        
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
        this.setPosition('prompt', -this.container.width/4,  this.container.height/2, this.container.padding);

        this.createButton('end', 'End Turn', 10);
        this.setPosition('end', this.container.width/4, this.container.height/2, this.container.padding);

        this.createCanvas('click', 11);
    }


    createCanvas(id, zIndex, width=this.container.width, height=this.container.height) {
        const element = document.createElement('canvas');
        element.type = "canvas";
        element.id = id;
        element.width = this.container.width;
        element.height = this.container.height;
        element.style.position = 'absolute';
        element.style.left = '0px';
        element.style.top = '0px';
        element.style.background = 'transparent';
        element.style.width =  `${this.container.width}px`;
        element.style.height =  `${this.container.height}px`;
        element.style.zIndex = zIndex;
        element.ctx = element.getContext('2d');
        element.ctx.alpha = 1;
        this.container.appendChild(element);
        this.layers[id] = element;
        this.setPosition(id, 0,0);
        this.animateCSS(id, 'zoom-in');
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
        
        element.width = element.clientWidth*4;
        element.height = element.clientHeight*2;
        this.layers[id] = element;
        this.setPosition(id, 0,0);
        
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
        element.width = element.clientWidth*4;
        element.height = element.clientHeight*2;
        this.layers[id] = element;
        this.setPosition(id, 0,0);
        
        return element;
    }

    setGrid(grid, gridWidth=this.container.width, gridHeight=this.container.height) {
        this.grid.rows = grid.rows
        this.grid.columns = grid.columns;
        this.grid.width = gridWidth;
        this.grid.height = gridHeight;
        this.grid.tileWidth = gridWidth / grid.columns;
        this.grid.tileHeight = gridHeight / grid.rows;
        
        const gridLayer = this.setPosition('grid', 0, -this.container.height * 0.125, this.container.padding, gridWidth, gridHeight);
        this.grid.topLeftX = gridLayer.topLeftX;
        this.grid.topLeftY = gridLayer.topLeftY;
        this.grid.centerX = gridLayer.centerX;
        this.grid.centerY = gridLayer.centerY;

        this.renderGrid('grid', this.grid.columns, this.grid.rows, this.grid.tileWidth, this.grid.tileHeight, gridWidth, gridHeight);
    }

    setPosition(id, x, y, containerPadding = -1, elementWidth = this.layers[id].width, elementHeight = this.layers[id].height) {
        let centerX = this.container.width / 2;
        let centerY = this.container.height / 2;
        let elementX = centerX + x - elementWidth / 2;
        let elementY = centerY + y - elementHeight / 2;
    
        // Constrain within the bounds of the RenderManager
        if (containerPadding>=0) 
        {
            elementX = Math.max(containerPadding, Math.min(elementX, this.container.width - elementWidth - containerPadding));
            elementY = Math.max(containerPadding, Math.min(elementY, this.container.height - elementHeight - containerPadding));
        }
        
        this.layers[id].style.left = `${elementX}px`;
        this.layers[id].style.top = `${elementY}px`;
        this.layers[id].style.width = `${elementWidth}px`;
        this.layers[id].style.height = `${elementHeight}px`;
        
        this.layers[id].width = `${elementWidth}`;
        this.layers[id].height = `${elementHeight}`;
        this.layers[id].centerX = elementX + elementWidth / 2 - centerX;
        this.layers[id].centerY = elementY + elementHeight / 2 - centerY;
        this.layers[id].topLeftX = elementX;
        this.layers[id].topLeftY = elementY;
        return this.layers[id];
    }

    clear(id) {
        const layer = this.layers[id];
        switch (layer.type) 
        {
            case 'canvas':
                layer.ctx.fillStyle = "rgba(255,255,255,0);"
                layer.ctx.clearRect(0, 0, this.container.width, this.container.height);
                break;
            case 'text':
                layer.innerHTML = '';
            case 'button':
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

    //---------------------------------------------------------------------------------
    // Assumes grid is aligned, so it starts from 0,0 instead of grid's top left corner.
    //---------------------------------------------------------------------------------
    renderGrid(layerId, gridColumns, gridRows, tileWidth, tileHeight, gridWidth, gridHeight) {
        const ctx = this.layers[layerId].ctx;
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        for (let x = 0; x <= gridColumns; x++) {
            ctx.beginPath();
            ctx.moveTo(x * tileWidth, 0);
            ctx.lineTo(x * tileWidth, gridHeight);
            ctx.stroke();
        }
        
        for (let y = 0; y <= gridRows; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * tileHeight);
            ctx.lineTo(gridWidth, y * tileHeight);
            ctx.stroke();
        }       
    }

    renderTile(layerId, x, y, fill = 'rgba(144, 238, 144, 0.5)') {
        const ctx = this.layers[layerId].ctx;
        ctx.fillStyle = fill;
        ctx.fillRect(this.grid.topLeftX + x * this.grid.tileWidth, this.grid.topLeftY + y * this.grid.tileHeight, this.grid.tileWidth, this.grid.tileHeight);
    }

    outlineTile(layerId, x,y, strokeColour='#000', strokeWidth=2){
        const ctx = this.layers[layerId].ctx;
        ctx.strokeStyle = strokeColour;
        ctx.lineWidth = strokeWidth;
        ctx.strokeRect(this.grid.topLeftX + x * this.grid.tileWidth, this.grid.topLeftY + y * this.grid.tileHeight, this.grid.tileWidth, this.grid.tileHeight);
    }

    renderUnit(unitId, x, y, color) {
        this.clear(unitId);    
        this.renderTile(unitId, x,y, color);
        this.outlineTile(unitId, x,y);
    }

    removeUnit(unitId) {
        if (this.layers[unitId]) {
            this.container.removeChild(this.unitLayers[unitId].canvas);
            delete this.unitLayers[unitId];
        }
    }

    animateCSS(layerId, animationClass, animationDuration=1000) {
        const element = this.layers[layerId];
        if (this.layers[layerId].animation && this.layers[layerId].animation != '') {
            element.classList.remove(this.layers[layerId].animation);
        }

        element.classList.add(animationClass);
        element.animation = animationClass;

        /*setTimeout(() => {
             element.classList.remove(this.layers[layerId].animation);
             if (element.animation == animationClass) {
                element.animation = '';
             }
        }, animationDuration);*/
    }
    
    animateFrame(unitId, frames, frameDuration) {
        const layer = this.layers[unitId];
        if (!layer) return;

        let frameIndex = 0;
        const animate = () => {
            if (frameIndex >= frames.length) return;

            const frame = frames[frameIndex];
            layer.ctx.clearRect(0, 0, this.container.width, this.container.height);
            layer.ctx.drawImage(frame, 0, 0);

            frameIndex++;
            setTimeout(animate, frameDuration);
        };

        animate();
    }
}