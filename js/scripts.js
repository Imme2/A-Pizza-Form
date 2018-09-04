$(document).ready(function(){

	// A little hack to get flex properties to stick.
	// start with a hidden body, then hide everything then show the body.
	$('.view').hide();
	$("#first-screen").show();
	$("body").show();

	shown = "#first-screen";

	// Events for buttons, not the most elegant way, but this is just an example.
	$("#start-order").on('click',function(){

		// Indicate we are no longer at home
		$("#home-button").removeClass("active")


		$("#first-screen").hide();
		$("#order-screen").show();
		shown = "#order-screen";
	})

	$("#home-button").on('click',function(){
		// Switch the active class around
		$(this).addClass("active");
		$("#about-us").removeClass("active");

		// Show and hide the views
		$(shown).hide();
		$("#first-screen").show();
		shown = "#first-screen";
	});
	$("#about-us").on('click',function(){

		// switch the active around		
		$(this).addClass("active");
		$("#home-button").removeClass("active")

		// show and hide the views
		$(shown).hide();
		$("#about-us-screen").show();
		shown = "#about-us-screen";

	});

	$("#classic-crust").on("click",function(){
		$(this).addClass("btn-success");
		$("#thin-crust").removeClass("btn-success");
	});

	$("#thin-crust").on("click",function(){
		$(this).addClass("btn-success");
		$("#classic-crust").removeClass("btn-success");
	});


	$("#send-order").on("click",function(){
		// Hide message about taking a while
		$("#take-a-while").hide();

		$(shown).hide();
		$("#wait-screen").show();
		shown = "#wait-screen"
		

		// Show this will take a while after a bit
		setTimeout(function () {
  			 $("#take-a-while").show();
		}, 1000);

	});


	$("#play-game").on("click",function(){
		console.log("hey?");
		$(shown).hide();
		$("#game-screen").show();
		shown = "#game-screen";

		startSlider("img/pizza_puzzle2.png",4);

	})
})


// A bit of a game (from a previous project)

var tablero = document.getElementById("game-canvas");
var imagen = "";
var nivel = 3;

// A ton of global variables

var canvas,boardSize, tileCount, tileSize;
var clickLoc, emptyLoc, solved, boardParts, img;
var movimientos = 0;
var objetoCanvas = document.getElementById("game-canvas");

// Funcion que empieza el juego.
// @imageURL: Nos da el url de la imagen que vamos a usar
// @sizeOfBoard: nos da el tama;o del tablero (6 para 6x6, 3 para 3x3, etc)
function startSlider(imageURL, sizeOfBoard){
	canvas = document.getElementById("game-canvas").getContext("2d");
	boardSize = document.getElementById('game-canvas').width;

	//imageURL = resizeImage(imageURL,400,400);

	//Cambiamos el link a la imagen original en la esquina.
	//document.getElementById("imagen-original").src = imageURL;

	if (sizeOfBoard > 11){
		// Esto es muy grande, dejemoslo en 10x10
		sizeOfBoard = 10
	}
	tileCount = sizeOfBoard;
	tileSize = boardSize / tileCount;

	clickLoc = new Object;
	clickLoc.x = 0;
	clickLoc.y = 0;

	emptyLoc = new Object;
	emptyLoc.x = 0;
	emptyLoc.y = 0;

	solved = false;
	boardParts = new Object;


	setBoard();


	img = new Image;
	img.src = imageURL;
	img.addEventListener('load', drawTiles, false);

}


// Uses randomnness to initialize tiles (Fisher-gates algorithm)
function initTiles() {
	var i = tileCount * tileCount - 1;
	while (i > 0) {
		var j = Math.floor(Math.random() * i);
		var xi = i % tileCount;
		var yi = Math.floor(i / tileCount);
		var xj = j % tileCount;
		var yj = Math.floor(j / tileCount);
		swapTiles(xi, yi, xj, yj);
		--i;
	}
}


// First configuration of the game
function setBoard() {
	boardParts = new Array(tileCount);
	for (var i = 0; i < tileCount; ++i) {
		boardParts[i] = new Array(tileCount);
		for (var j = 0; j < tileCount; ++j) {
			boardParts[i][j] = new Object;
			boardParts[i][j].x = i;
			boardParts[i][j].y = j;
		}
	}
	// Last spot is the empty spot
	emptyLoc.x = tileCount-1;
	emptyLoc.y = tileCount-1;
	solved = false;
	initTiles();
	if (!isSolvable(tileCount, tileCount, emptyLoc.y + 1)){
		if (emptyLoc.y == 0 && emptyLoc.x <= 1) {
			swapTiles(tileCount - 2, tileCount - 1, tileCount - 1, tileCount - 1);
		} else {
			swapTiles(0, 0, 1, 0);
		}
	}
}



// Functions used to get the mouse movement
document.getElementById('game-canvas').onmousemove = function(e) {
	rect = objetoCanvas.getBoundingClientRect();
	clickLoc.x = Math.floor((e.clientX - rect.left) / tileSize);
	clickLoc.y = Math.floor((e.clientY - rect.top) / tileSize);
	a = e.clientX - rect.left
	b = e.clientY - rect.top
};

document.getElementById('game-canvas').onclick = function() {
	if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
		slideTile(emptyLoc, clickLoc);
		drawTiles();
	}
	if (solved) {
		setTimeout(function() {alert("You solved it!");}, 500);
		$("#congratulations").show();
	}
};


function distance(x1, y1, x2, y2) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}


function slideTile(toLoc, fromLoc) {
	if (!solved) {
		boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
		boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
		// ONLY WORKS IF EMPTY TILE is LAST TILE, fix if that ever changes
		boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
		boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
		emptyLoc.x = fromLoc.x;
		emptyLoc.y = fromLoc.y;
		movimientos++;
		checkSolved();
	}
}

function swapTiles(i, j, k, l) {
	var temp = new Object();
	temp = boardParts[i][j];
	boardParts[i][j] = boardParts[k][l];
	boardParts[k][l] = temp;
	if (emptyLoc.x == i && emptyLoc.y == j){
		emptyLoc.x = k;
		emptyLoc.y = l;
	}
	else if (emptyLoc.x == k && emptyLoc.y == l){
		emptyLoc.x = i;
		emptyLoc.y = j;
	}
}

function checkSolved() {
	var flag = true;
	for (var i = 0; i < tileCount; ++i) {
		for (var j = 0; j < tileCount; ++j) {
			if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
				flag = false;
			}
		}
	}
	solved = flag;
}

// Funcion que dibuja el tablero en realidad.
function drawTiles() {
	// These variables give us a conversion in order to properly resize images.
	var widthSize = img.width / tileCount;
	var heightSize = img.height / tileCount; 
	canvas.clearRect ( 0 , 0 , boardSize , boardSize );
	for (var i = 0; i < tileCount; ++i) {
		for (var j = 0; j < tileCount; ++j) {
			var x = boardParts[i][j].x;
			var y = boardParts[i][j].y;
			if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {
				canvas.drawImage(img,
					 x * widthSize, y * heightSize,	// Where to start (in image).
					 widthSize, heightSize,			// area (w*h) from the source image.
					 i * tileSize, j * tileSize, 	// where to place it
					 tileSize, tileSize);			// with this size.
			}
		}
	}
	document.getElementById("moves").innerHTML = movimientos;
}


// Hacemos el bind de los hints a el boton

document.getElementById("hint").onmousedown = function(){
	canvas.drawImage(img,0,0,400,400);
	setTimeout(function(){
		drawTiles();
	},500);
};


// Cuenta inversiones de un puzzle entre dos posiciones.
function countInversions(i, j) {
	var inversions = 0;
	var tileNum = j * tileCount + i;
	var lastTile = tileCount * tileCount;
	var tileValue = boardParts[i][j].y * tileCount + boardParts[i][j].x;
	for (var q = tileNum + 1; q < lastTile; ++q) {
		var k = q % tileCount;
		var l = Math.floor(q / tileCount);

		var compValue = boardParts[k][l].y * tileCount + boardParts[k][l].x;
		if (tileValue > compValue && tileValue != (lastTile - 1)) {
			++inversions;
		}
	}
	return inversions;
}

// Sums inversions, aka the tiles that are not in the right order.
function sumInversions() {
	var inversions = 0;
	for (var j = 0; j < tileCount; ++j) {
		for (var i = 0; i < tileCount; ++i) {
			inversions += countInversions(i, j);
		}
	}
	return inversions;
}

// Returns if a puzzle is solvable
function isSolvable(width, height, emptyRow) {
	if (width % 2 == 1) {
		return (sumInversions() % 2 == 0)
	} else {
		return ((sumInversions() + height - emptyRow) % 2 == 0)
	}
}