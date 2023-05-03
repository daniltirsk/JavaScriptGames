let gridX;
let gridY;

let gridArr = [];
let numOfMines;
let cellsToOpen;
let minesToFind;
let flagCounter;
let field;
let time;
let timer;
let activeCell;
let previousCell;
let numOfActiveCell=0;

window.addEventListener('keydown', startPlayingWithKeyboard);


function startPlayingWithKeyboard(e){
    if (e.code == 'Enter') {
        if (activeCell) activeCell.classList.toggle('activeCell');;
        numOfActiveCell = 0;
        previousCell = activeCell? activeCell: document.querySelector('[num="0"]');
        activeCell = document.querySelector('[num="'+numOfActiveCell+'"]');
        activeCell.classList.toggle('activeCell');
        window.removeEventListener('keydown', startPlayingWithKeyboard);
        window.addEventListener('keydown', keyboardControl);
    }
}

function keyboardControl(e){
    if ((e.code == 'Enter' && e.ctrlKey) || (e.code == 'Space' && e.ctrlKey)) {
        let cell = document.querySelector('.activeCell');
        cell.dispatchEvent(new Event('contextmenu',{bubbles: true}));
    } else
    if (e.code == 'Enter' || e.code == 'Space') {
        let cell = document.querySelector('.activeCell');
        cell.dispatchEvent(new Event('click',{bubbles: true}));
    } else
    if (e.code == 'KeyD' || e.code == 'ArrowRight') {
        previousCell = activeCell;
        previousCell.classList.toggle('activeCell');
        numOfActiveCell++;
        numOfActiveCell = numOfActiveCell%(gridX*gridY);
        activeCell = document.querySelector('[num="'+numOfActiveCell+'"]');
        activeCell.classList.toggle('activeCell');
    } else
    if (e.code == 'KeyS' || e.code == 'ArrowDown') {
        previousCell = activeCell;
        previousCell.classList.toggle('activeCell');
        numOfActiveCell+=gridX;
        numOfActiveCell = numOfActiveCell%(gridX*gridY);
        activeCell = document.querySelector('[num="'+numOfActiveCell+'"]');
        activeCell.classList.toggle('activeCell');
    } else
    if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
        previousCell = activeCell;
        previousCell.classList.toggle('activeCell');
        numOfActiveCell = numOfActiveCell>0 ? numOfActiveCell-1: gridX*gridY-1;
        activeCell = document.querySelector('[num="'+numOfActiveCell+'"]');
        activeCell.classList.toggle('activeCell');
    } else
    if (e.code == 'KeyW'  || e.code == 'ArrowUp') {
        previousCell = activeCell;
        previousCell.classList.toggle('activeCell');
        numOfActiveCell = numOfActiveCell-gridX>0 ? numOfActiveCell-gridX: gridX*(gridY-1)+numOfActiveCell;
        numOfActiveCell = numOfActiveCell%(gridX*gridY);
        activeCell = document.querySelector('[num="'+numOfActiveCell+'"]');
        activeCell.classList.toggle('activeCell');
    } else
    if (e.code == "Escape") {
        window.addEventListener('keydown', startPlayingWithKeyboard);
        window.removeEventListener('keydown', keyboardControl);
        activeCell.classList.toggle('activeCell');
        activeCell = null;
        previousCell = null;
    } else
    if (e.code == "KeyR") {
        let refresh = document.querySelector('.resetButtonContainer img');
        refresh.dispatchEvent(new Event('click',{bubbles:true}));
    }
}


function createGrid(rows, cols, className, array = []) {
    let i = 0;
    let ar = 0;
    let grid = document.createElement('table');

    grid.className = className;
    grid.id = className;

    gridArr = [];
    for (let i = 0; i < rows; i++) {
        nArr = [];
        for (let j = 0; j < cols; j++) {
            nArr.push(0);
        }
        gridArr.push(nArr);
    }

    console.log(gridArr);

    for (let r = 0; r < rows; ++r) {
        let tr = grid.appendChild(document.createElement('tr'));

        for (let c = 0; c < cols; ++c) {
            let cell = tr.appendChild(document.createElement('td'));
            cell.innerHTML = "";
            cell.setAttribute('num',i++);

            if (ar < array.length) {
                ar++;
            }
        }
    }
    document.querySelector('.appContainer .mainColumn').appendChild(grid);

    field = document.getElementsByClassName("field")[0]
    field.addEventListener("click", assingMines);
}

function flagCell(e){
    e.preventDefault();
    if (e.target.tagName == 'TD' && !e.target.classList.contains('openCell')) {
        e.target.classList.toggle('flagged');

        if (e.target.classList.contains('flagged')) {
            e.target.innerHTML = '<img src="flag.svg">';

            changeFlagCounter(1);

            let cell = e.target;
            let num = cell.getAttribute('num');
            let i = Math.floor(num/gridX);
            let j = num%gridX;

            if (gridArr[i][j]=='b')  minesToFind--;
            isWin();
        } else {
            e.target.innerHTML = '';

            changeFlagCounter(-1);

            let cell = e.target;
            let num = cell.getAttribute('num');
            let i = Math.floor(num/gridX);
            let j = num%gridX;

            if (gridArr[i][j]=='b')  minesToFind++;
        }
    }
}

function assingMines(e){
    if (e.target.tagName == 'TD') {

        let cell = e.target;
        let num = cell.getAttribute('num');
        let i = Math.floor(num/gridX);
        let j = num%gridX;
        let noBombsCells;

        gridArr[i][j]=0;


        noBombsCells = getNeighbours(i,j);
        noBombsCells.push(parseInt(num));

        let randCell;
        let rowNum;
        let colNum;

        for (let i = numOfMines -1; i >= 0; i--) {
            randCell = Math.floor(Math.random()*gridX*gridY);
            rowNum = Math.floor(randCell/gridX);
            colNum = randCell%gridX;
            if (noBombsCells.includes(randCell) || gridArr[rowNum][colNum] == 'b') {
                i++;
                continue;
            }

            gridArr[rowNum][colNum] = 'b';
        }

        console.log(gridArr);

        countNeighbours();
        revealTile(e);
        field.removeEventListener('click', assingMines);
        field.addEventListener("click", revealTile);
        timer = setInterval(function(){time.textContent = parseInt(time.textContent) + 1}, 1000);
        field.addEventListener("contextmenu", flagCell);
    }
}

function revealTile(e){
    let cell = e.target;
    if (cell.tagName == 'TD') {
        cell.innerHTML = '';
        if (cell.classList.contains('flagged')) {
            cell.classList.toggle('flagged');
            changeFlagCounter(-1);
        }
        let num = cell.getAttribute('num');
        let cellVal = gridArr[Math.floor(num/gridX)][num%gridX];
        cell.classList.add("openCell");
        cellsToOpen--;
        if (cellVal=='b'){
            cell.innerHTML = '<img src="bomb.svg">';
            cell.classList.add('bomb');
            gameOver();
        } else if(cellVal == 0){
            revealAll(Math.floor(num/gridX),num%gridX);
            isWin();
        }
        else {
            cell.innerHTML = gridArr[Math.floor(num/gridX)][num%gridX];
            isWin();
        }
    }
}

function revealAll(i,j){
    let neighbours = getNeighbours(i,j);
    for (var k = neighbours.length - 1; k >= 0; k--) {
        let n = document.querySelector('[num="'+neighbours[k]+'"]');
        if (n.classList.contains('openCell')) continue;
        if (n.classList.contains('flagged')) changeFlagCounter(-1);
        if (!isNaN(gridArr[Math.floor(neighbours[k]/gridX)][neighbours[k]%gridX])) {
            n.classList.add('openCell');
            cellsToOpen--;
            n.innerHTML = gridArr[Math.floor(neighbours[k]/gridX)][neighbours[k]%gridX]>0? gridArr[Math.floor(neighbours[k]/gridX)][neighbours[k]%gridX]: '';
            if(gridArr[Math.floor(neighbours[k]/gridX)][neighbours[k]%gridX]==0) revealAll(Math.floor(neighbours[k]/gridX),neighbours[k]%gridX);
        }
    }
}

function getNeighbours(i,j){
    let neighbours = [];
    if(gridArr[i][j] != "b"){
                if (i-1>-1) neighbours.push((i-1)*gridX+j);
                if (i+1<gridY) neighbours.push((i+1)*gridX+j);
                if (j-1>-1) neighbours.push(i*gridX+j-1);
                if (j+1<gridX) neighbours.push(i*gridX+j+1);
                if (i-1>-1 && j-1>-1) neighbours.push((i-1)*gridX+j-1);
                if (i-1>-1 && j+1<gridX) neighbours.push((i-1)*gridX+j+1);
                if (i+1<gridY && j-1>-1) neighbours.push((i+1)*gridX+j-1);
                if (i+1<gridY && j+1<gridX) neighbours.push((i+1)*gridX+j+1);
    }
    return neighbours;
}

function countNeighbours(){
    let neighbours;
    for (var i = gridY - 1; i >= 0; i--) {
       for (var j = gridX - 1; j >= 0; j--) {
           neighbours = getNeighbours(i,j);
           for (var k = neighbours.length - 1; k >= 0; k--) {
               if (gridArr[Math.floor(neighbours[k]/gridX)][neighbours[k]%gridX] == 'b') gridArr[i][j]++;
           }
       }
    }
}

function gameOver(){
    alert("You've lost");
    clearInterval(timer);
    showAllBombs();
}

function isWin(){
    if (!minesToFind && !cellsToOpen) {
        clearInterval(timer);
        alert("Congratulations, you've won\n Your time is: " + time.textContent);

    }
}


function createSettingsMenu(){
	let settingsContainer = document.querySelector('.settingsContainer');

	let XfieldCont = document.createElement('label');
	let Xfield = document.createElement('input');
	let Xname = document.createElement('span');
	Xname.innerHTML = "X:";
	XfieldCont.appendChild(Xname);
	Xfield.type = 'number';
	Xfield.classList = 'Xfield';
	XfieldCont.appendChild(Xfield);

	let YfieldCont = document.createElement('label');
	let Yfield = document.createElement('input');
	let Yname = document.createElement('span');
	Yname.innerHTML = "Y:";
	XfieldCont.appendChild(Yname);
	Yfield.type = 'number';
	Yfield.classList = 'Yfield';
	YfieldCont.appendChild(Yfield);

	let BombsFieldCont = document.createElement('label');
	let Bombfield = document.createElement('input');
	let Bombname = document.createElement('span');
	Bombname.innerHTML = "BOMBS:";
	BombsFieldCont.appendChild(Bombname);
	Bombfield.type = 'number';
	Bombfield.classList = 'Bombfield';
	BombsFieldCont.appendChild(Bombfield);

	let submitBtn = document.createElement('a');
	submitBtn.innerHTML = 'START';
	submitBtn.classList = 'submitBtn';
	submitBtn.addEventListener('click',applySettings);

	settingsContainer.appendChild(XfieldCont);
	settingsContainer.appendChild(YfieldCont);
	settingsContainer.appendChild(BombsFieldCont);
	settingsContainer.appendChild(submitBtn);


}

function applySettings(e){
	e.preventDefault();

	let X = parseInt(document.querySelector('.Xfield').value);
	let Y = parseInt(document.querySelector('.Yfield').value);
	let Mines = parseInt(document.querySelector('.Bombfield').value);

	if (isNaN(Mines)||isNaN(X)||isNaN(Y)) {
		alert("Please enter numbers");
		return;
	}

	if (X>25 || Y>25 || Y*X<10 || Y<4 || X<4) {
		alert("Unsupported size, try again");
		return;
	}

	if (Mines>X * Y - 9) {
		alert("Unsupported number of mines, max number of mines for this field is "+(X * Y - 9));
		return;
	}

	gridX = X;
	gridY = Y;

	eraseGame();
	createStatusBar(Mines);

    createGrid(gridY, gridX, "field")
}


function createStatusBar(mines){
	numOfMines = mines;
    cellsToOpen = gridX*gridY - numOfMines;
    minesToFind = numOfMines;

    let statusBarContainer = document.querySelector(".statusBarContainer");

    let flagCounterContainer = document.createElement('div');
    flagCounterContainer.classList = 'flagCounterContainer';
    let flagCounter = document.createElement("span");
    flagCounter.textContent = '0';
    flagCounterContainer.appendChild(flagCounter);
    let flagImg = document.createElement('img');
    flagImg.src = 'flag.svg';
    flagImg.style.alignSelf = '';
    flagCounterContainer.appendChild(flagImg);
    statusBarContainer.appendChild(flagCounterContainer);

    let bombCounterContainer = document.createElement('div');
    bombCounterContainer.classList = 'bombCounterContainer';
    let bombCounter = document.createElement("span");
    bombCounter.textContent = ""+minesToFind;
    bombCounterContainer.appendChild(bombCounter);
    let bombImg = document.createElement('img');
    bombImg.src = 'bomb.svg';
    bombImg.style.alignSelf = '';
    bombCounterContainer.appendChild(bombImg);
    statusBarContainer.appendChild(bombCounterContainer);

    let resetButtonContainer = document.createElement('div');
    resetButtonContainer.classList = 'resetButtonContainer';
    let resetButton = document.createElement('img');
    resetButton.src = 'refresh.svg';
    resetButton.addEventListener('click', function(){
        window.addEventListener('keydown', startPlayingWithKeyboard);
        window.removeEventListener('keydown', keyboardControl);
        if (activeCell) activeCell.classList.toggle('activeCell');
        activeCell = null;
        previousCell = null;
        flagCounter.textContent = '0';
        cellsToOpen = gridX*gridY - numOfMines;
        minesToFind = numOfMines;
        time.textContent = '0';
        clearInterval(timer);
        field.remove();
        createGrid(gridY, gridX, "field")
    })
    resetButtonContainer.appendChild(resetButton);
    statusBarContainer.appendChild(resetButtonContainer);

    let timeContainer = document.createElement('div');
    let timerIcon = document.createElement('img');
    timerIcon.src = 'timer.svg';
    timeContainer.appendChild(timerIcon);
    timeContainer.classList = 'timeContainer';
    time = document.createElement("span");
    time.textContent = '0';
    timeContainer.appendChild(time);
    statusBarContainer.appendChild(timeContainer);
}

function createGame(x,y,mines){
    gridX = x;
    gridY = y;
  
  	createStatusBar(mines);

  	createSettingsMenu();

    createGrid(gridY, gridX, "field")
}

function eraseGame(){
	let statusBarContainer = document.querySelector(".statusBarContainer");
	statusBarContainer.innerHTML = '';
	field.remove();
	clearInterval(timer);
}

function changeFlagCounter(num){
    flagCounter = document.querySelector('.flagCounterContainer span');
    flagCounter.textContent = parseInt(flagCounter.textContent) + num;
}

function showAllBombs(){
    for (let i = 0; i<gridY; i++){
        for (let j = 0; j<gridX; j++){
            if (gridArr[i][j] == 'b'){
                let cell = document.querySelector('[num="'+(i*gridX+j)+'"]');
                cell.classList ='';
                cell.innerHTML = '<img src="bomb.svg">';
                cell.classList.add('bomb');
            }
        }
    }
}


createGame(12,12,20);
