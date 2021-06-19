var tiles = [];
var selected;
var rows;
var cols;

class Grid {
	constructor(tiles) {
		this.rows = tiles.length;
		this.cols = tiles[0].length;
		this.tiles = tiles;
	}
}
const p1 = new Grid([[2, 1, 0, 1, 0, 0], [1, 0, 0, 0, 0, 0], [2, 1, 0, 0, 0, 1], [2, 1, 0, 2, 1, 2], [1, 0, 0, 1, 0, 0], [2, 1, 1, 2, 0, 0]]);
const p2 = new Grid([[0, 0, 0, 1, 0, 1, 2], [1, 0, 0, 1, 0, 0, 1], [0, 1, 0, 1, 1, 0, 0], [0, 0, 0, 0, 1, 2, 0], [0, 1, 0, 0, 0, 1, 0], [0, 1, 0, 0, 1, 2, 0], [0, 1, 0, 0, 0, 0, 2]]);
const p3 = new Grid([[0, 0, 1, 0, 0, 0], [0, 1, 0, 0, 1, 0], [0, 1, 0, 2, 0, 0], [0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1], [0, 0, 2, 0, 0, 0]]);
const p4 = new Grid([[0, 0, 0, 0, 1, 0], [1, 0, 1, 0, 0, 0], [0, 0, 2, 2, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1], [0, 0, 0, 1, 0, 0]]);
const p5 = new Grid([[0, 1, 0, 2, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 0, 0, 1], [0, 0, 2, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 2, 0, 0]]);
const p6 = new Grid([[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 1], [0, 1, 0, 2, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 0, 1, 0, 2, 0, 0], [0, 0, 1, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 0, 0, 0]]);
const p7 = new Grid([[0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 2], [0, 1, 0, 1, 0, 0], [0, 0, 2, 0, 0, 0], [0, 1, 0, 0, 0, 1], [0, 0, 0, 1, 0, 0]]);
const p8 = new Grid([[0, 0, 0, 0, 0],[0, 0, 0, 1, 0],[0, 0, 2, 0, 0],[1, 0, 1, 1, 0],[0, 0, 0, 0, 0]]);


// #region tiles
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
		this.blockup = (y == 0 ? true : false); 
		this.blockdown = (y == rows - 1 ? true : false);
		this.blockleft = (x == 0 ? true : false);
		this.blockright = (x == cols - 1 ? true : false);
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
	
	UpdateImage() {
		this.image.src = DetermineImage(this.up, this.down, this.left, this.right, this.type);
	}

	Copy() {
		var newTile = new Tile(this.image, this.posX, this.posY, this.type);
		newTile.up = this.up;
		newTile.down = this.down;
		newTile.left = this.left;
		newTile.right = this.right;
		newTile.blockup = this.blockup;
		newTile.blockdown = this.blockdown;
		newTile.blockleft = this.blockleft;
		newTile.blockright = this.blockright;
		return newTile;
	}
	Same(tile) {
		if (this.up == tile.up && this.down == tile.down && this.left == tile.left && this.right == tile.right) {
			if (this.blockup == tile.blockup && this.blockdown == tile.blockdown && this.blockleft == tile.blockleft && this.blockright == tile.blockright) {
				return true;
            }
		}
		return false;
    }

	ChangeUp(grid) {
		this.up = !(this.up);
		var other = grid[this.posY - 1][this.posX];
		other.down = !other.down;
		this.UpdateImage();
		other.UpdateImage();
		if (this.up) {
			this.BlockRemainingSides(grid);
			other.BlockRemainingSides(grid);
		}
	}
	ChangeDown(grid) {
		this.down = !(this.down);
		var other = grid[this.posY + 1][this.posX];
		other.up = !other.up;
		this.UpdateImage();
		other.UpdateImage();
		if (this.down) {
			this.BlockRemainingSides(grid);
			other.BlockRemainingSides(grid);
		}
	}
	ChangeLeft(grid) {
		this.left = !(this.left);
		var other = grid[this.posY][this.posX - 1];
		other.right = !other.right;
		this.UpdateImage();
		other.UpdateImage();
		if (this.left) {
			this.BlockRemainingSides(grid);
			other.BlockRemainingSides(grid);
		} 
	}
	ChangeRight(grid) {
		this.right = !(this.right);
		var other = grid[this.posY][this.posX + 1];
		other.left = !other.left;
		this.UpdateImage();
		other.UpdateImage();
		if (this.right) {
			this.BlockRemainingSides(grid);
			other.BlockRemainingSides(grid);
		}
	}
	MakeUp(grid) {
		if (this.blockup) {
			return false;
		}
		if (!this.up) {
			this.ChangeUp(grid);
		}
		return true;
	}
	MakeDown(grid) {
		if (this.blockdown) {
			return false;
		} 
		if (!this.down) {
			this.ChangeDown(grid);
		}
		return true;
	}
	MakeLeft(grid) {
		if (this.blockleft) {
			return false;
		}
		if (!this.left) {
			this.ChangeLeft(grid);
		}
		return true;
	}
	MakeRight(grid) {
		if (this.blockright) {
			return false;
		}
		if (!this.right) {
			this.ChangeRight(grid);
		}
		return true;
	}
	MakeBlockup(grid) {
		if (this.up) {
			return false;
		} 
		this.blockup = true;
		if (this.posY != 0) {
			grid[this.posY - 1][this.posX].blockdown = true;
		}
		return true;
	}
	MakeBlockdown(grid) {
		if (this.down) {
			return false;
		}
		this.blockdown = true;
		if (this.posY != rows - 1) {
			grid[this.posY + 1][this.posX].blockup = true;
		}
		return true;
	}
	MakeBlockleft(grid) {
		if (this.left) {
			return false;
		}
		this.blockleft = true;
		if (this.posX != 0) {
			grid[this.posY][this.posX - 1].blockright = true;
		}
		return true;
	}
	MakeBlockright(grid) {
		if (this.right) {
			return false;
		}
		this.blockright = true;
		if (this.posX != cols - 1) {
			grid[this.posY][this.posX + 1].blockleft = true;
		}
		return true;
	}
	BlockRemainingSides(grid) {
		if (this.connections == 2) {
			if (!(this.up)) {
				this.MakeBlockup(grid);
			}
			if (!(this.down)) {
				this.MakeBlockdown(grid);
			}
			if (!(this.right)) {
				this.MakeBlockright(grid);
			}
			if (!(this.left)) {
				this.MakeBlockleft(grid);
			}
		}
	}
	ResetBlocks(grid) {
		this.blockup = false;
		if (this.posY == 0) {
			this.blockup = true;
		} else if (!this.up && grid[this.posY - 1][this.posX].connections == 2) {
			this.blockup = true;
		}
		this.blockdown = false;
		if (this.posY == grid.length - 1) {
			this.blockdown = true;
		} else if (!this.down && grid[this.posY + 1][this.posX].connections == 2) {
			this.blockdown = true;
		}
		this.blockleft = false;
		if (this.posX == 0) {
			this.blockleft = true;
		} else if (!this.left && grid[this.posY][this.posX - 1].connections == 2) {
			this.blockleft = true;
		}
		this.blockright = false;
		if (this.posX == grid[0].length - 1) {
			this.blockright = true;
		} else if (!this.right && grid[this.posY][this.posX + 1].connections == 2) {
			this.blockright = true;
		}
		if (this.connections == 2) {
			this.BlockRemainingSides(grid);
		}
    }
}
// #endregion

// #region grid
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
					selected.ChangeRight(tiles);
				} else if (tile.posX == selected.posX - 1 && tile.posY == selected.posY) {
					selected.ChangeLeft(tiles);
				} else if (tile.posY == selected.posY + 1 && tile.posX == selected.posX) {
					selected.ChangeDown(tiles);
				} else if (tile.posY == selected.posY - 1 && tile.posX == selected.posX) {
					selected.ChangeUp(tiles);
				}
			}
			selected = tile;
			selected.image.style.border = '1px solid red';
		}
	}
}

function CreateGrid(width, height) {
	var emptyGridArray = []
	for (var i = 0; i < Math.max(Math.min(height, 20), 1); i++) {
		var emptyCol = [];
		for (var j = 0; j < Math.max(Math.min(width, 20), 1); j++) {
			emptyCol.push(Type.none);
		}
		emptyGridArray.push(emptyCol);
	}
	LoadGrid(new Grid(emptyGridArray));
}
	
function LoadGrid(grid) {
	selected = null;
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
// #endregion

// #region CheckSolved
function btnCheckSolved() {
	var output = document.getElementById('output');
	if (CheckSolved(tiles)) {
		output.value = 'Puzzle is solved';
	} else {
		output.value = 'Puzzle is not solved';
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
	//make sure there is at least 1 line on the grid
	if (startX == -1) {
		return false;
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
	if ((grid[y][x].up && grid[y][x].down) || (grid[y][x].left && grid[y][x].right) || grid[y][x].connections == 0) {
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
// #endregion

// #region SolvePuzzle
class Puzzle {
	constructor(grid) {
		this.grid = grid;
		this.possible = true;
		this.solved = false;
	}
	CopyGrid() {
		var newGrid = [];
		for (var i = 0; i < this.grid.length; i++) {
			var newRow = [];
			for (var j = 0; j < this.grid[0].length; j++) {
				newRow.push(this.grid[i][j].Copy());
			}
			newGrid.push(newRow);
		}
		return newGrid;
	}
	SameGrid(grid) {
		var same = true;
		for (var i = 0; i < this.grid.length; i++) {
			for (var j = 0; j < this.grid[0].length; j++) {
				if (!this.grid[i][j].Same(grid[i][j])) {
					same = false;
                } 
			}
		}
		return same;
    }
	UpdateImages() {
		for (var i=0; i<tiles.length; i++) {
			for (var j=0; j<tiles[0].length; j++) {
				this.grid[i][j].UpdateImage();
			}
		}
	}
	ResetAllBlocks() {
		for (var i = 0; i < this.grid.length; i++) {
			for (var j = 0; j < this.grid[0].length; j++) {
				this.grid[i][j].ResetBlocks(this.grid);
            }
        }
    }
}

function btnSolvePuzzle() {
	var puzzle = new Puzzle(tiles);
	puzzle.ResetAllBlocks();
	SolvePuzzle(puzzle, true);
	var output = document.getElementById('output');
	if (puzzle.solved) {
		output.value = "Puzzle has been solved"
	} else if (puzzle.possible) {
		output.value = "Puzzle has not been solved";
	} else {
		output.value = "Puzzle is impossible";
    }
}

function SolvePuzzle(puzzle, hasImages) {
	var solving = true;
	while (solving && puzzle.possible) {
		var preSolve = puzzle.CopyGrid();
		for (var i = 0; i < puzzle.grid.length; i++) {
			for (var j = 0; j < puzzle.grid[0].length; j++) {
				switch (puzzle.grid[i][j].type) {
					case Type.open:
						SolveOpen(puzzle, i, j);
						break;
					case Type.closed:
						SolveClosed(puzzle, i, j);
						break;
					case Type.none:
						switch (puzzle.grid[i][j].connections) {
							case 0:
								SolveNoConnections(puzzle, i, j);
								break;
							case 1:
								SolveOneConnection(puzzle, i, j);
								break;
							case 3:
							case 4:
								puzzle.possible = false;
								break;
                        }
						break;
				}
            }
		}
		if (puzzle.SameGrid(preSolve)) {
			solving = false;
        }
	}
	if (hasImages) {
		puzzle.UpdateImages();
	}
	puzzle.solved = (CheckSolved(puzzle.grid) ? true : false)
}

// #region SolveOpen
function SolveOpen(puzzle, y, x) {
	OpenOneWay(puzzle, y, x);
	OpenBendSides(puzzle, y, x);
	if (!(y == 0 || y == puzzle.grid.length - 1 || x == 0 || x == puzzle.grid[0].length - 1)) {
		OpenThree(puzzle, y, x);
		OpenStraight(puzzle, y, x);
		OpenTwoStraight(puzzle, y, x);
    }
}
function OpenOneWay(puzzle, y, x) {
	//Solve if line is entering one side
	if (puzzle.grid[y][x].up) {
		if (!(puzzle.grid[y][x].MakeDown(puzzle.grid))) {
			puzzle.possible = false;
			return;
		}
	} else if (puzzle.grid[y][x].down) {
		if (!(puzzle.grid[y][x].MakeUp(puzzle.grid))) {
			puzzle.possible = false;
			return;
		}
	} else if (puzzle.grid[y][x].right) {
		if (!(puzzle.grid[y][x].MakeLeft(puzzle.grid))) {
			puzzle.possible = false;
			return;
		}
	} else if (puzzle.grid[y][x].left) {
		if (!(puzzle.grid[y][x].MakeRight(puzzle.grid))) {
			puzzle.possible = false;
			return;
		}
	}

	//Solve if line can't enter one side
	if (puzzle.grid[y][x].blockup || puzzle.grid[y][x].blockdown) {
		if (!(puzzle.grid[y][x].MakeLeft(puzzle.grid) && puzzle.grid[y][x].MakeRight(puzzle.grid))) {
			puzzle.possible = false;
		}
	} else if (puzzle.grid[y][x].blockright || puzzle.grid[y][x].blockleft) {
		if (!(puzzle.grid[y][x].MakeUp(puzzle.grid) && puzzle.grid[y][x].MakeDown(puzzle.grid))) {
			puzzle.possible = false;
		}
	}
}

function OpenBendSides(puzzle, y, x) {
	if (puzzle.grid[y][x].up && puzzle.grid[y][x].down) {
		if (puzzle.grid[y - 1][x].up) {
			if (puzzle.grid[y + 1][x].MakeBlockdown(puzzle.grid) == false) {
				puzzle.possible = false;
            }
		} else if (puzzle.grid[y + 1][x].down) {
			if (puzzle.grid[y - 1][x].MakeBlockup(puzzle.grid) == false) {
				puzzle.possible = false;
			}
		}
	} else if (puzzle.grid[y][x].right && puzzle.grid[y][x].left) {
		if (puzzle.grid[y][x - 1].left) {
			if (puzzle.grid[y][x + 1].MakeBlockright(puzzle.grid) == false) {
				puzzle.possible = false;
			}
		} else if (puzzle.grid[y][x + 1].right) {
			if (puzzle.grid[y][x - 1].MakeBlockleft(puzzle.grid) == false) {
				puzzle.possible = false;
			}
		}
	}
}

function OpenThree(puzzle, y, x) {
	if (puzzle.grid[y - 1][x].type == Type.open && puzzle.grid[y + 1][x].type == Type.open) {
		if (!(puzzle.grid[y][x].MakeLeft(puzzle.grid) && puzzle.grid[y][x].MakeRight(puzzle.grid))) {
			puzzle.possible = false;
		}
	}
	if (puzzle.grid[y][x - 1].type == Type.open && puzzle.grid[y][x + 1].type == Type.open) {
		if (!(puzzle.grid[y][x].MakeUp(puzzle.grid) && puzzle.grid[y][x].MakeDown(puzzle.grid))) {
			puzzle.possible = false;
		}
	}
}

function OpenStraight(puzzle, y, x) {
	if (puzzle.grid[y - 1][x].up && puzzle.grid[y + 1][x].down) {
		if (!(puzzle.grid[y][x].MakeLeft(puzzle.grid) && puzzle.grid[y][x].MakeRight(puzzle.grid))) {
			puzzle.possible = false;
		}
	}
	if (puzzle.grid[y][x - 1].left && puzzle.grid[y][x + 1].right) {
		if (!(puzzle.grid[y][x].MakeUp(puzzle.grid) && puzzle.grid[y][x].MakeDown(puzzle.grid))) {
			puzzle.possible = false;
		}
	}
}

function OpenTwoStraight(puzzle, y, x) {
	if ((puzzle.grid[y - 1][x].type == Type.open && puzzle.grid[y + 1][x].down) || (puzzle.grid[y + 1][x].type == Type.open && puzzle.grid[y - 1][x].up)) {
		if (!(puzzle.grid[y][x].MakeLeft(puzzle.grid) && puzzle.grid[y][x].MakeRight(puzzle.grid))) {
			puzzle.possible = false;
		}
	}
	if ((puzzle.grid[y][x - 1].type == Type.open && puzzle.grid[y][x + 1].right) || (puzzle.grid[y][x + 1].type == Type.open && puzzle.grid[y][x - 1].left)) {
		if (!(puzzle.grid[y][x].MakeUp(puzzle.grid) && puzzle.grid[y][x].MakeDown(puzzle.grid))) {
			puzzle.possible = false;
		}
	}
}
// #endregion

// #region SolveClosed
function SolveClosed(puzzle, y, x) {
	ClosedOneWay(puzzle, y, x);
	if (!(y == 0 || y == puzzle.grid.length - 1 || x == 0 || x == puzzle.grid[0].length - 1)) {
		ClosedTwo(puzzle, y, x);
		ClosedTwoOpens(puzzle, y, x);
	}
}

function ClosedOneWay(puzzle, y, x) {
	var up = false;
	var down = false;
	var left = false;
	var right = false;
	if (puzzle.grid[y][x].blockup || puzzle.grid[y][x].down) {
		down = true;
	} else if (puzzle.grid[y - 1][x].blockup || puzzle.grid[y - 1][x].left || puzzle.grid[y - 1][x].right) {
		down = true;
	}
	if (puzzle.grid[y][x].blockdown || puzzle.grid[y][x].up) {
		up = true;
	} else if (puzzle.grid[y + 1][x].blockdown || puzzle.grid[y + 1][x].left || puzzle.grid[y + 1][x].right) {
		up = true;
	}
	if (puzzle.grid[y][x].blockleft || puzzle.grid[y][x].right) {
		right = true;
	} else if (puzzle.grid[y][x - 1].blockleft || puzzle.grid[y][x - 1].up || puzzle.grid[y][x - 1].down) {
		right = true;
	}
	if (puzzle.grid[y][x].blockright || puzzle.grid[y][x].left) {
		left = true;
	} else if (puzzle.grid[y][x + 1].blockright || puzzle.grid[y][x + 1].up || puzzle.grid[y][x + 1].down) {
		left = true;
	}

	if (down) {
		if (!(puzzle.grid[y][x].MakeDown(puzzle.grid) && puzzle.grid[y + 1][x].MakeDown(puzzle.grid) && puzzle.grid[y][x].MakeBlockup(puzzle.grid))) {
			puzzle.possible = false
        }
	}
	if (up) {
		if (!(puzzle.grid[y][x].MakeUp(puzzle.grid) && puzzle.grid[y - 1][x].MakeUp(puzzle.grid) && puzzle.grid[y][x].MakeBlockdown(puzzle.grid))) {
			puzzle.possible = false
		}
	}
	if (right) {
		if (!(puzzle.grid[y][x].MakeRight(puzzle.grid) && puzzle.grid[y][x + 1].MakeRight(puzzle.grid) && puzzle.grid[y][x].MakeBlockleft(puzzle.grid))) {
			puzzle.possible = false
		}
	}
	if (left) {
		if (!(puzzle.grid[y][x].MakeLeft(puzzle.grid) && puzzle.grid[y][x - 1].MakeLeft(puzzle.grid) && puzzle.grid[y][x].MakeBlockright(puzzle.grid))) {
			puzzle.possible = false
		}
	}
}

function ClosedTwo(puzzle, y, x) {
	if (puzzle.grid[y - 1][x].type == Type.closed) {
		if (!(puzzle.grid[y][x].MakeDown(puzzle.grid) && puzzle.grid[y + 1][x].MakeDown(puzzle.grid) && puzzle.grid[y][x].MakeBlockup(puzzle.grid))) {
			puzzle.possible = false
		}
	}
	if (puzzle.grid[y + 1][x].type == Type.closed) {
		if (!(puzzle.grid[y][x].MakeUp(puzzle.grid) && puzzle.grid[y - 1][x].MakeUp(puzzle.grid) && puzzle.grid[y][x].MakeBlockdown(puzzle.grid))) {
			puzzle.possible = false
		}
	}
	if (puzzle.grid[y][x - 1].type == Type.closed) {
		if (!(puzzle.grid[y][x].MakeRight(puzzle.grid) && puzzle.grid[y][x + 1].MakeRight(puzzle.grid) && puzzle.grid[y][x].MakeBlockleft(puzzle.grid))) {
			puzzle.possible = false
		}
	}
	if (puzzle.grid[y][x + 1].type == Type.closed) {
		if (!(puzzle.grid[y][x].MakeLeft(puzzle.grid) && puzzle.grid[y][x - 1].MakeLeft(puzzle.grid) && puzzle.grid[y][x].MakeBlockright(puzzle.grid))) {
			puzzle.possible = false
		}
	}
}

function ClosedTwoOpens(puzzle, y, x) {
	if (y >= 3) {
		if (puzzle.grid[y - 2][x].type == Type.open && puzzle.grid[y - 3][x].type == Type.open) {
			if (!(puzzle.grid[y][x].MakeDown(puzzle.grid) && puzzle.grid[y + 1][x].MakeDown(puzzle.grid) && puzzle.grid[y][x].MakeBlockup(puzzle.grid))) {
				puzzle.possible = false
			}
        }
	}
	if (y <= puzzle.grid.length - 4) {
		if (puzzle.grid[y + 2][x].type == Type.open && puzzle.grid[y + 3][x].type == Type.open) {
			if (!(puzzle.grid[y][x].MakeUp(puzzle.grid) && puzzle.grid[y - 1][x].MakeUp(puzzle.grid) && puzzle.grid[y][x].MakeBlockdown(puzzle.grid))) {
				puzzle.possible = false
			}
		}
	}
	if (x >= 3) {
		if (puzzle.grid[y][x - 2].type == Type.open && puzzle.grid[y][x - 3].type == Type.open) {
			if (!(puzzle.grid[y][x].MakeRight(puzzle.grid) && puzzle.grid[y][x + 1].MakeRight(puzzle.grid) && puzzle.grid[y][x].MakeBlockleft(puzzle.grid))) {
				puzzle.possible = false
			}
		}
	}
	if (x <= puzzle.grid[0].length - 4) {
		if (puzzle.grid[y][x + 2].type == Type.open && puzzle.grid[y][x + 3].type == Type.open) {
			if (!(puzzle.grid[y][x].MakeLeft(puzzle.grid) && puzzle.grid[y][x - 1].MakeLeft(puzzle.grid) && puzzle.grid[y][x].MakeBlockright(puzzle.grid))) {
				puzzle.possible = false
			}
		}
	}
}

// #endregion 

// #region SolveOneConnection
function SolveOneConnection(puzzle, y, x) {
	OCOneWay(puzzle, y, x);
	OCCompleteLoop(puzzle, y, x);
}

function OCOneWay(puzzle, y, x) {
	var counter = 0;
	var up = false;
	var down = false;
	var left = false;
	if (puzzle.grid[y][x].up || puzzle.grid[y][x].blockup) {
		up = true;
		counter += 1;
	}
	if (puzzle.grid[y][x].down || puzzle.grid[y][x].blockdown) {
		down = true;
		counter += 1;
	}
	if (puzzle.grid[y][x].left || puzzle.grid[y][x].blockleft) {
		left = true;
		counter += 1;
	}
	if (puzzle.grid[y][x].right || puzzle.grid[y][x].blockright) {
		counter += 1;
	}
	if (counter == 3) {
		if (up == false) {
			puzzle.grid[y][x].MakeUp(puzzle.grid);
		} else if (down == false) {
			puzzle.grid[y][x].MakeDown(puzzle.grid);
		} else if (left == false) {
			puzzle.grid[y][x].MakeLeft(puzzle.grid);
		} else {
			puzzle.grid[y][x].MakeRight(puzzle.grid);
		}
	} else if (counter == 4) {
		puzzle.possible = false;
    }
}

function OCCompleteLoop(puzzle, y, x) {
	if (puzzle.grid[y][x].blockup == false && puzzle.grid[y][x].up == false) {
		if (puzzle.grid[y - 1][x].connections <= 1) {
			var connected = ContinuesTo(puzzle, puzzle.grid[y - 1][x], Direction.down)
			if (connected != null) {
				if (puzzle.grid[y][x] === FindOtherSide(puzzle, connected)) {
					var testPuzzle = new Puzzle(puzzle.CopyGrid());
					testPuzzle.grid[y][x].MakeUp(testPuzzle.grid);
					SolvePuzzle(testPuzzle, false);
					if (CheckSolved(testPuzzle.grid)) {
						puzzle.grid[y][x].MakeUp(puzzle.grid);
					} else {
						puzzle.grid[y][x].MakeBlockup(puzzle.grid);
					}
				}
			}
		}
	}
	if (puzzle.grid[y][x].blockdown == false && puzzle.grid[y][x].down == false) {
		if (puzzle.grid[y + 1][x].connections <= 1) {
			var connected = ContinuesTo(puzzle, puzzle.grid[y + 1][x], Direction.up)
			if (connected != null) {
				if (puzzle.grid[y][x] === FindOtherSide(puzzle, connected)) {
					var testPuzzle = new Puzzle(puzzle.CopyGrid());
					testPuzzle.grid[y][x].MakeDown(testPuzzle.grid);
					SolvePuzzle(testPuzzle, false);
					if (CheckSolved(testPuzzle.grid)) {
						puzzle.grid[y][x].MakeDown(puzzle.grid);
					} else {
						puzzle.grid[y][x].MakeBlockdown(puzzle.grid);
					}
				}
			}
		}
	}
	if (puzzle.grid[y][x].blockleft == false && puzzle.grid[y][x].left == false) {
		if (puzzle.grid[y][x - 1].connections <= 1) {
			var connected = ContinuesTo(puzzle, puzzle.grid[y][x - 1], Direction.right)
			if (connected != null) {
				if (puzzle.grid[y][x] === FindOtherSide(puzzle, connected)) {
					var testPuzzle = new Puzzle(puzzle.CopyGrid());
					testPuzzle.grid[y][x].MakeLeft(testPuzzle.grid);
					SolvePuzzle(testPuzzle, false);
					if (CheckSolved(testPuzzle.grid)) {
						puzzle.grid[y][x].MakeLeft(puzzle.grid);
					} else {
						puzzle.grid[y][x].MakeBlockleft(puzzle.grid);
					}
				}
			}
		}
	}
	if (puzzle.grid[y][x].blockright == false && puzzle.grid[y][x].right == false) {
		if (puzzle.grid[y][x + 1].connections <= 1) {
			var connected = ContinuesTo(puzzle, puzzle.grid[y][x + 1], Direction.left)
			if (connected != null) {
				if (puzzle.grid[y][x] === FindOtherSide(puzzle, connected)) {
					var testPuzzle = new Puzzle(puzzle.CopyGrid());
					testPuzzle.grid[y][x].MakeRight(testPuzzle.grid);
					SolvePuzzle(testPuzzle, false);
					if (CheckSolved(testPuzzle.grid)) {
						puzzle.grid[y][x].MakeRight(puzzle.grid);
					} else {
						puzzle.grid[y][x].MakeBlockright(puzzle.grid);
					}
				}
			}
		}
	}
}

const Direction = {
	none: 0,
	up: 1,
	down: 2,
	left: 3,
	right: 4
};

function FindOtherSide(puzzle, tile) {
	var currentTile = tile;
	var cameFrom = Direction.none;
	do {
		if (currentTile.up && cameFrom != Direction.up) {
			currentTile = puzzle.grid[currentTile.posY - 1][currentTile.posX];
			cameFrom = Direction.down;
		} else if (currentTile.down && cameFrom != Direction.down) {
			currentTile = puzzle.grid[currentTile.posY + 1][currentTile.posX];
			cameFrom = Direction.up;
		} else if (currentTile.left && cameFrom != Direction.left) {
			currentTile = puzzle.grid[currentTile.posY][currentTile.posX - 1];
			cameFrom = Direction.right;
		} else {
			currentTile = puzzle.grid[currentTile.posY][currentTile.posX + 1];
			cameFrom = Direction.left;
		}
	} while (currentTile.connections != 1);
	return currentTile;
}

function ContinuesTo(puzzle, tile, direction) {
	var currentTile = tile;
	var cameFrom = direction;
	var straightCount = 0;
	var lastClosed = false;
	var lastStraightOpen = false;
	var searching = true;
	while (searching) {
		if (currentTile.connections == 1) {
			return currentTile;
		}
		if (currentTile.type == Type.Open || lastClosed) {
			if ((currentTile.type == type.Open && straightCount == 2) || currentTile.type == Type.closed) {
				searching = false;
			} else {
				if (currentTile.type == type.Open && straightCount == 1) {
					lastStraightOpen = true;
				}
				if (cameFrom = Direction.up) {
					if (currentTile.left || currentTile.right || currentTile.blockup) {
						searching = false;
					} else {
						currentTile = puzzle.grid[currentTile.posY - 1][currentTile.posX];
					}
				} else if (cameFrom = Direction.down) {
					if (currentTile.left || currentTile.right || currentTile.blockdown) {
						searching = false;
					} else {
						currentTile = puzzle.grid[currentTile.posY + 1][currentTile.posX];
					}
				} else if (cameFrom = Direction.left) {
					if (currentTile.up || currentTile.down || currentTile.blockleft) {
						searching = false;
					} else {
						currentTile = puzzle.grid[currentTile.posY][currentTile.posX - 1];
					}
				} else {
					if (currentTile.up || currentTile.down || currentTile.blockright) {
						searching = false;
					} else {
						currentTile = puzzle.grid[currentTile.posY][currentTile.posX + 1];
					}
				}
				straightCount += 1
				lastClosed = false;
			}
		} else {
			var blockCount = 0;
			var up = true;
			var down = true;
			var left = true;
			var right = true;
			if (currentTile.blockup || cameFrom == Direction.up) {
				up = false;
				blockCount += 1;
			}
			if (currentTile.blockdown || cameFrom == Direction.down) {
				down = false;
				blockCount += 1;
			}
			if (currentTile.blockleft || cameFrom == Direction.left) {
				left = false;
				blockCount += 1;
			}
			if (currentTile.blockright || cameFrom == Direction.right) {
				right = false;
				blockCount += 1;
			}
			if (currentTile.type == Type.closed) {
				lastClosed = true;
				switch (cameFrom) {
					case Direction.up:
						down = false;
						break;
					case Direction.Down:
						up = false;
						break;
					case Direction.Left:
						right = false;
						break;
					case Direction.Right:
						left = false;
						break;
                }
			}
			if (blockCount == 3) {
				if (up) {
					currentTile = puzzle.grid[currentTile.posY - 1][currentTile.posX];
					if (cameFrom == Direction.down) {
						straightCount += 1;
						if (lastStraightOpen) {
							searching = false;
						}
					} else {
						straightCount = 0;
					}
					cameFrom = Direction.down;
				} else if (down) {
					currentTile = puzzle.grid[currentTile.posY + 1][currentTile.posX];
					if (cameFrom == Direction.up) {
						straightCount += 1;
						if (lastStraightOpen) {
							searching = false;
						}
					} else {
						straightCount = 0;
					}
					cameFrom = Direction.down;
				} else if (left) {
					currentTile = puzzle.grid[currentTile.posY][currentTile.posX - 1];
					if (cameFrom == Direction.right) {
						straightCount += 1;
						if (lastStraightOpen) {
							searching = false;
						}
					} else {
						straightCount = 0;
					}
					cameFrom = Direction.right;
				} else {
					currentTile = puzzle.grid[currentTile.posY][currentTile.posX + 1];
					if (cameFrom == Direction.left) {
						straightCount += 1;
						if (lastStraightOpen) {
							searching = false;
						}
					} else {
						straightCount = 0;
					}
					cameFrom = Direction.left;
				}
			} else {
				searching = false;
			}
			lastStraightOpen = false;
        }
	}
	return null; 
}
// #endregion 

function SolveNoConnections(puzzle, y, x) {
	var count = 0;
	if (puzzle.grid[y][x].blockup) {
		count += 1;
	}
	if (puzzle.grid[y][x].blockdown) {
		count += 1;
	}
	if (puzzle.grid[y][x].blockleft) {
		count += 1;
	}
	if (puzzle.grid[y][x].blockright) {
		count += 1;
	}
	if (count == 3) {
		if (!(puzzle.grid[y][x].MakeBlockup(puzzle.grid) && puzzle.grid[y][x].MakeBlockdown(puzzle.grid) && puzzle.grid[y][x].MakeBlockleft(puzzle.grid) && puzzle.grid[y][x].MakeBlockright(puzzle.grid))) {
			puzzle.possible = false;
        }
    }
}
// #endregion