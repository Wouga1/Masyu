var tiles = [];
var selected;

class Tile {
	constructor(image) {
		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;
		this.image = image;
	}
}

function Select(tile) {
	if (selected != null) {
		selected.image.style.border = '1px solid white';
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
			var newTile = new Tile(image);
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