var tiles = [];
var selected;
var rows;
var cols;

const Type = {
	none: 0,
	open: 1,
	closed: 2
};

function DetermineImage(up, down, left, right, type) {
	var image = 'images/';
	if (type == Type.open) {
		image += 'open';
	} else if (type == Type.closed) {
		image += 'closed';
	}
	if (up) {
		image += 'up';
		if (down) {
			image += 'down';
		} else if (right) {
			image += 'right';
		} else if (left) {
			image += 'left';
		}
	} else if (down) {
		image += 'down';
		if (right) {
			image += 'right';
		} else if (left) {
			image += 'left';
		} 
	} else if (left) {
		image += 'left';
		if (right) {
			image += 'right';
		}
	} else if (right) {
		image += 'right';
	} else {
		image += 'empty';
	}
	image += '.png';
	return image;
}

class Grid {
	constructor(tiles) {
		this.rows = tiles.length;
		this.cols = tiles[0].length;
		this.tiles = tiles;
	}
}
const p1 = new Grid([[2,1,0,1,0,0],[1,0,0,0,0,0],[2,1,0,0,0,1],[2,1,0,2,1,2],[1,0,0,1,0,0],[2,1,1,2,0,0]])
const p2 = new Grid([[0,0,0,1,0,1,2],[1,0,0,1,0,0,1],[0,1,0,1,1,0,0],[0,0,0,0,1,2,0],[0,1,0,0,0,1,0],[0,1,0,0,1,2,0],[0,1,0,0,0,0,2]]);

class Tile {
	constructor(image, x, y, type) {
		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;
		this.image = image;
		this.posX = x;
		this.posY = y;
		this.type = type
	}
	ChangeRight() {
		this.right = !(this.right);
		this.image.src = DetermineImage(this.up, this.down, this.left, this.right, this.type);
	}
	ChangeLeft() {
		this.left = !(this.left);
		this.image.src = DetermineImage(this.up, this.down, this.left, this.right, this.type);
	}
	ChangeUp() {
		this.up = !(this.up);
		this.image.src = DetermineImage(this.up, this.down, this.left, this.right, this.type);
	}
	ChangeDown() {
		this.down = !(this.down);
		this.image.src = DetermineImage(this.up, this.down, this.left, this.right, this.type);
	}
}

function Select(tile) {
	if (document.getElementById('edit').checked) {
		tile.type = (tile.type + 1) % 3
		tile.image.src = DetermineImage(tile.up, tile.down, tile.left, tile.right, tile.type);
	} else {
		if (selected == tile) {
			selected.image.style.border = '1px solid white';
			selected = null;
		} else {
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
	}
}

function CreateGrid(width, height) {
	var emptyGridArray = []
	for (var i = 0; i < height; i++) {
		var emptyCol = [];
		for (var j = 0; j < width; j++) {
			emptyCol.push(Type.none);
		}
		emptyGridArray.push(emptyCol);
	}
	LoadGrid(new Grid(emptyGridArray));
}
	
function LoadGrid(grid) {
	tiles = [];
	cols = grid.cols;
	rows = grid.rows;
	var div = document.getElementById('grid');
	if (div.children.length != 0) {
		div.children[0].remove();
	}
	var table = document.createElement('table');
	for (var i = 0; i < rows; i++) {
		var tileRow = [];
		var row = document.createElement('tr');
		for (var j = 0; j < cols; j++) {
			var cell = document.createElement('td');
			var image = document.createElement('img');
			image.width = '50';
			image.onclick = function(){Select(this.tile);};
			var newTile = new Tile(image, j, i, grid.tiles[i][j]);
			image.src = DetermineImage(newTile.up, newTile.down, newTile.left, newTile.right, newTile.type);
			image.tile = newTile
			tileRow.push(newTile);
			cell.appendChild(image);
			row.appendChild(cell);
		}
		tiles.push(tileRow);
		table.appendChild(row);
	}
	div.appendChild(table);
}