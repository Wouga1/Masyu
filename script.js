var tiles = [];
var selected;

function DetermineImage(up, down, left, right) {
	if (up) {
		if (down) {
			return 'images/updown.png';
		} else if (right) {
			return 'images/upright.png';
		} else if (left) {
			return 'images/upleft.png';
		} else {
			return 'images/up.png';
		}
	} else if (down) {
		if (right) {
			return 'images/downright.png';
		} else if (left) {
			return 'images/downleft.png';
		} else {
			return 'images/down.png';
		}
	} else if (left) {
		if (right) {
			return 'images/leftright.png';
		} else {
			return 'images/left.png';
		}
	} else if (right) {
		return 'images/right.png';
	} else {
		return 'images/empty.png';
	}
}

class Tile {
	constructor(image, x, y) {
		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;
		this.image = image;
		this.posX = x;
		this.posY = y;
	}
	ChangeRight() {
		this.right = !(this.right);
		this.image.src = DetermineImage(this.up, this.down, this.left, this.right);
	}
	ChangeLeft() {
		this.left = !(this.left);
		this.image.src = DetermineImage(this.up, this.down, this.left, this.right);
	}
	ChangeUp() {
		this.up = !(this.up);
		this.image.src = DetermineImage(this.up, this.down, this.left, this.right);
	}
	ChangeDown() {
		this.down = !(this.down);
		this.image.src = DetermineImage(this.up, this.down, this.left, this.right);
	}
}

function Select(tile) {
	if (selected != null) {
		selected.image.style.border = '1px solid white';
		if (tile.posX == selected.posX + 1 && tile.posY == selected.posY) {
			selected.ChangeRight();
			tile.ChangeLeft();
		} else if (tile.posX == selected.posX - 1 && tile.posY == selected.posY) {
			selected.ChangeLeft();
			tile.ChangeRight();
		} else if (tile.posY == selected.posY + 1 && tile.posX == selected.posX) {
			selected.ChangeDown();
			tile.ChangeUp();
		} else if (tile.posY == selected.posY - 1 && tile.posX == selected.posX) {
			selected.ChangeUp();
			tile.ChangeDown();
		}
	} 
	selected = tile;
	selected.image.style.border = '1px solid red';
}

function CreateGrid(width, height) {
	tiles = [];
	var table = document.createElement('table');
	for (var i = 0; i < height; i++) {
		var tileRow = [];
		var row = document.createElement('tr');
		for (var j = 0; j < width; j++) {
			var cell = document.createElement('td');
			var image = document.createElement('img');
			image.src = 'images/empty.png';
			image.width = '50';
			image.onclick = function(){Select(this.tile);};
			var newTile = new Tile(image, j, i);
			image.tile = newTile
			tileRow.push(newTile);
			cell.appendChild(image);
			row.appendChild(cell);
		}
		tiles.push(tileRow);
		table.appendChild(row);
	}
	document.getElementById('grid').appendChild(table);
}