class Transform {
    constructor (x,y,z,rotation=0, scale=1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.rotation = rotation;
        this.scale = scale;        
    }
    
}

class RenderObject {
    constructor(renderType, renderData, x, y, z) {
        this.type = renderType;
        this.renderData = renderData;
        this.currentTransform = new Transform(x,y,z);
        this.targetTransform = new Transform(x,y,z); 
        this.opacity = 1;
        this.animationType = '';
        this.animationProgress = 0;
        this.animationDuration = 0;
    }

    Render() {

    }

}