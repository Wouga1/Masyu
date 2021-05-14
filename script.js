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
	get connections() {
		var count = 0;
		if (this.up) {
			count +=  1;
		}
		if (this.down) {
			count += 1;
		}
		if (this.left) {
			count += 1;
		}
		if (this.right) {
			count += 1
		}
		return count;
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

function btnCheckSolved() {
	if (CheckSolved(tiles)) {
		alert("Solved");
	} else {
		alert("Not Solved");
	}
}

function CheckSolved(grid) {
	if (CheckConnections(grid)) {
		if (CheckSingleLoop(grid)) {
			for (i=0;i<grid.length;i++) {
				for (j=0;j<grid[0].length;j++) {
					if (grid[i][j].type == Type.open) {
						if (!(CheckCompleteOpen(grid, i, j))) {
							return false;
						} 
					} else if (grid[i][j].type == Type.closed) {
						if (!(CheckCompleteClosed(grid, i, j))) {
							return false;
						}
					}
				}
			}
			return true;
		}
	}
	return false;
}

function CheckConnections(grid) {
	for (i=0; i<grid.length; i++) {
		for (j=0; j<grid[0].length; j++) {
			if (grid[i][j].connections != 0 && grid[i][j].connections != 2) {
				return false;
			}
		}
	}
	return true;
}

function CheckSingleLoop(grid) {
	//find a starting position
	var startX = -1;
	var startY = -1;
	var i = 0;
	while (i < grid.length && startX == -1) {
		j = 0;
		while (j < grid[0].length && startX == -1) {
			if (grid[i][j].connections > 1) {
				startX = j;
				startY = i;
			}
			j += 1;
		}
		i += 1;
	}
	//choose a direction to start moving
	var nextX = startX;
	var nextY = startY;
	if (grid[startY][startX].up) {
		nextY -= 1;
	} else if (grid[startY][startX].down) {
		nextY += 1;
	} else {
		nextX -= 1;
	}
	var prevX = startX;
	var prevY = startY;
	//follow loop and mark points
	markGrid = [];
	for (i=0;i<grid.length;i++) {
		var tempRow = [];
		for (j=0;j<grid[0].length;j++) {
			tempRow.push(false)
		}
		markGrid.push(tempRow);
	}
	markGrid[startY][startX] = true;
	while (!(nextX == startX && nextY == startY)) {
		markGrid[nextY][nextX] = true;
		tempX = nextX;
		tempY = nextY;
		if (grid[nextY][nextX].up && !(prevY == nextY - 1 && prevX == nextX)) {
			nextY -= 1;
		} else if (grid[nextY][nextX].down && !(prevY == nextY + 1 && prevX == nextX)) {
			nextY += 1;
		} else if (grid[nextY][nextX].left && !(prevX == nextX - 1 && prevY == nextY)) {
			nextX -= 1;
		} else {
			nextX += 1;
		}
		prevX = tempX;
		prevY = tempY;
	}
	//check if there is a tile with a line that is not in a position that is true in markGrid
	for (i=0;i<grid.length;i++) {
		for (j=0;j<grid[0].length;j++) {
			if (grid[i][j].connections > 0 && markGrid[i][j] == false) {
				return false;
			}
		}
	}
	return true;
}

function CheckCompleteOpen(grid, y, x) {
	if (!((grid[y][x].up && grid[y][x].down) || (grid[y][x].left && grid[y][x].right))) {
		return false;
	}
	if (grid[y][x].up) {
		if (grid[y-1][x].up && grid[y+1][x].down) {
			return false;
		}
	} else {
		if (grid[y][x-1].left && grid[y][x+1].right) {
			return false;
		}
	}
	return true;
}

function CheckCompleteClosed(grid, y, x) {
	if ((grid[y][x].up && grid[y][x].down) || (grid[y][x].left && grid[y][x].right)) {
		return false;
	}
	if (grid[y][x].up) {
		if (grid[y-1][x].up == false) {
			return false;
		}
	} 
	if (grid[y][x].down) {
		if (grid[y+1][x].down == false) {
			return false;
		}
	}
	if (grid[y][x].left) {
		if (grid[y][x-1].left == false) {
			return false;
		}
	} 
	if (grid[y][x].right) {
		if (grid[y][x+1].right == false) {
			return false;
		}
	}
	return true;
}