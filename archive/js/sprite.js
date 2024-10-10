class Sprite {
	constructor(ctx, imgSrc, width = 400, height = 400, tileWidth = 100, tileHeight = 100) {
		this.ctx = ctx;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.animationFrame = 0;
		this.imgWidth = width;
		this.imgHeight = height;
		this.imgSource = imgSrc;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.LoadImage(imgSrc, width, height, tileWidth, tileHeight);
	}

	Render(animationFrame = 0) {
		if (!this.imgSource) {
			console.error("No image source set for SpriteLayer");
			return;
		}

		if (this.tileWidth == 0 || this.imgWidth == 0) {
			console.error("Can't render 0 width images or tiles.");
		}

		this.animationFrame = animationFrame;
		const col = this.animationFrame % (this.imgWidth / this.tileWidth);
		const row = Math.floor(this.animationFrame / (this.imgWidth / this.tileWidth));
		const sx = col * this.tileWidth;
		const sy = row * this.tileHeight;

		this.ctx.drawImage(
			this.imgSource,
			sx, sy, this.tileWidth, this.tileHeight,
			this.x, this.y, this.tileWidth, this.tileHeight
		);
	}

	LoadImage(imgSrc, width = 400, height = 400, tileWidth = 100, tileHeight = 100) {
		const img = new Image(imgSrc);
		img.src = imgSrc;
		this.imgWidth = width;
		this.imgHeight = height;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		img.onload = () => {
			this.imgSource = img;
		};
	}

	SetPosition(x, y, z = this.z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	SetOpacity(opacity) {
		this.ctx.globalAlpha = opacity;
	}
}