function createField(level){
	let field = document.querySelector('.puzzleFieldContainer');
	let scatteredTiles = document.querySelector('.scatteredPiecesContainer');

	for (let i=0; i<6;i++){
		for (let j=0; j<9; j++){
			let tile = document.createElement('div');
			tile.classList = 'tile closed';
			tile.style.backgroundImage = 'url("'+level+'")';
			tile.setAttribute('tileNumber',(j+9*i));
			tile.style.backgroundPosition =  (-(j*50) + 'px ') + (-(i*50)+'px');
			field.appendChild(tile);
			let scTile = tile.cloneNode(true);
			scTile.style.position = 'absolute';
			scTile.classList.toggle('closed');
			scTile.style.backgroundImage = 'url("'+level+'")';
			scTile.style.left = (10 + Math.floor(Math.random()*530)) + 'px';
			scTile.style.top = (10 + Math.floor(Math.random()*430)) + 'px';
			scatteredTiles.appendChild(scTile);
			scTile.addEventListener('mousedown',mouseDownTrack)
			scTile.addEventListener('mouseup',placeTile);
		}
	}
}

let lastSelected = null;

function clearFields() {
	let field = document.querySelector('.puzzleFieldContainer');
	let scatteredTiles = document.querySelector('.scatteredPiecesContainer');
	field.innerHTML = '';
	scatteredTiles.innerHTML='';
}

function selectLevel(e){
	e.target.classList.toggle("selectedLevel");
	if (lastSelected) lastSelected.classList.toggle("selectedLevel");
	lastSelected = e.target;

	clearFields();

	let level = levels[e.target.getAttribute('levelNumber')];
	let levelMenu = document.querySelector('.levelMenu');
	let field = document.querySelector('.puzzleFieldContainer');
	let scatteredTiles = document.querySelector('.scatteredPiecesContainer');
	let levelOptions = Array.from(document.querySelectorAll(".levelChoice"));

	levelMenu.style.backgroundColor = level.colors[0];
	scatteredTiles.style.outlineColor = level.colors[1];
	for (let i = 0; i< levelOptions.length; i++){
		levelOptions[i].style.outlineColor = level.colors[1];
	}

	createField(level.img);
}


let levels = [{'img':'level1.jpg',"colors":['darkblue','purple']},{'img':'level2.jpg',"colors":['orange','darkred']},{'img':'level3.jpg',"colors":['blue','red']}]

addLevels(levels);

function addLevels(levels){
	let levelMenu = document.querySelector('.levelMenu');
	for (let i = 0; i < levels.length ; i++) {
		let level = document.createElement('img');
		level.src = levels[i].img;
		level.classList = 'levelChoice';
		level.setAttribute('levelNumber',i);
		level.addEventListener('click',selectLevel)
		levelMenu.appendChild(level);
	}
}

function mouseDownTrack(e){
	if (e.button == 0) {
		event.preventDefault();
	    tile = e.target;
	    tile.classList.toggle('dragged');
	    tile.style.zIndex = 0;
	    window.addEventListener("mousemove", moved);
    }
}

function placeTile(e){
	let container = document.querySelector(".scatteredPiecesContainer").getBoundingClientRect();
	let tile = e.target;
	let tileSlot = document.querySelector('[tilenumber="'+tile.getAttribute("tilenumber")+'"]');
	let slotCoords = tileSlot.getBoundingClientRect();

	if (Math.abs((slotCoords.left - parseInt(tile.style.left.substring(0,tile.style.left.length - 2)) - container.left)) < 15) {
		if (Math.abs((slotCoords.top - parseInt(tile.style.top.substring(0,tile.style.top.length - 2)) - container.top)) < 15) {
			tile.remove();
			tileSlot.classList.toggle('closed');
		}
	}

}

let tile;
let zIndex=10;
let lastSelectedTIle;

function moved(event) {
	if (event.buttons == 0) {
    	window.removeEventListener("mousemove", moved);
    	tile.classList.toggle('dragged');
    	zIndex++;
    } else {
    	let container = document.querySelector(".scatteredPiecesContainer").getBoundingClientRect();
    	let newX = (event.clientX - container.left - 25);
    	let newY = (event.clientY - container.top - 25);
    	if (event.clientX>0) {
    		tile.style.left = newX + "px";
    	}
    	if (event.clientY>container.top && event.clientY<container.bottom) {
    		tile.style.top = newY + "px";
    	}
    	tile.style.zIndex = zIndex;
    }
}