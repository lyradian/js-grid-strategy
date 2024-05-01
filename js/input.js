class Input {
	constructor(canvas) {
		this.canvas = canvas;
		this.x = null;
		this.y = null;
		this.isActive = true;
		this.currentAction = '';
		this.moveSubscribers = [];
		this.selectSubscribers = [];
		this.canvas.addEventListener('mousemove', this.OnMouseMove.bind(this));
	}

	SubscribeMove(owner, callback) {
		this.moveSubscribers.push(callback.bind(owner));
	}

	OnMouseMove(event) {
		const rect = this.canvas.getBoundingClientRect();
		this.x = event.clientX - rect.left;
		this.y = event.clientY - rect.top;
		this.currentAction = 'move';
		if (this.isActive) {
			for (let i = 0; i < this.moveSubscribers.length; i++) {
				this.moveSubscribers[i](this.x, this.y);
			}
		}
	}
}