class Input 
{
	constructor (canvas) 
	{
		this.x = null;
		this.y = null;
		this.isActive = true;
		this.currentAction = '';
		this.moveSubscribers = [];
		this.selectSubscribers = [];
   		
	}

	SubscribeMove(callback) 
	{
		this.moveSubscribers.push(callback);
		return;
	}

	OnMouseMove(event) 
	{
    		const rect = canvas.getBoundingClientRect();
	    	const mouseX = event.clientX - rect.left;
    		const mouseY = event.clientY - rect.top;
    		this.x = mouseX;
		this.y = mouseY;
		this.currentAction = 'move';
		if (this.isActive) 
		{	
			for (let i=0;i<this.moveSubscribers.length;i++) 
				this.moveSubscribers[i](this.x, this.y);
		}
		return;

	}
}

