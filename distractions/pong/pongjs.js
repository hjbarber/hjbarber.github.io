var canvas; // dimensions
var canvasContext; // underlying graphical information
var name = prompt("What is your name?", "The Loser");
var computerName = prompt("What is your opponent's name?", "The better one");
var ballX = 50; //sets ball's X to 50
var ballSpeedX = 15; // sets ball's base speed to 15
var difficulty = prompt("On a scale from one to ten, how good should " + computerName + " be?", "5");
var ballY = 50;
var ballSpeedY = 4;
var paddle1Y = 250; // starting position for left paddle
var paddle2Y = 250; // starting position for right paddle
var player1Score = 0;
var player2Score = 0;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
var WINNING_SCORE = prompt("What score are you playing to?", "5");
var showingWinScreen = true;
var showingStartScreen = true;

function handleMouseClick(evt){
    if (showingWinScreen){
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    // let's give this canvas some stuff to show
    
    canvasContext = canvas.getContext("2d");
    // create a rectangle to serve as the background of the game
    
    document.getElementById('playerName').innerHTML = name;
    document.getElementById('computerName').innerHTML = computerName;
    var framesPerSecond = 30;
    setInterval(callBoth, 1000/framesPerSecond);
    
    function callBoth(){
        drawEverything();
        moveEverything();
        
    canvas.addEventListener('mousedown', handleMouseClick);
        
    canvas.addEventListener('mousemove',
                           function(evt){ // begins the mouse move event function
                            var mousePos = calculateMousePos(evt); // takes the event 
                            paddle1Y = mousePos.y -(PADDLE_HEIGHT/2);
    });
    }
}

function calculateMousePos(evt){
    //area on browser that is the black game canvas
    var rect = canvas.getBoundingClientRect();
    // the html page on which the canvas is situated
    var root = document.documentElement;
    //get x and y coords of the mouse within the playable space of the canvas by subtracting out the other stuff on the page that isn't the canvas
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    // assigns the x and y of the mouse to "x" and "y"
    return {
        x:mouseX,
        y:mouseY
    };
}

function ballReset(){
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        showingWinScreen = true;
    } else {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = -ballSpeedX;
    }
}
    
function drawNet(){
    for(var i=0;i<canvas.height;i+=40){
    colorRect(canvas.width/2-1,i,2,20,'white'); 
    }
}
    
function drawEverything(){

    colorRect(0,0,canvas.width,canvas.height,'black'); 
 
    if (showingWinScreen){
        canvasContext.fillStyle = 'white';
        if (player1Score >= WINNING_SCORE){
            canvasContext.fillText(name + ' Wins!', 350, 100)
        } else if (player2Score >= WINNING_SCORE){
            canvasContext.fillText(computerName + ' Wins!', 350, 100)
        };
 
        canvasContext.fillText('click to continue',350,500); // (text, x, y)
        return;
    }
    drawNet();  
    //make a player left paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    
    //make a computer right paddle
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

    //make a "ball"
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score,100,100); // (text, x, y)
    canvasContext.fillText(player2Score,canvas.width-100,100);
}

function colorCircle(leftX, topY, radius, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(leftX, topY, radius, 0, Math.PI*2, true); // (x, y [of center], radius, begin pt. for radian, number of radians, counter-clockwise fill)
    canvasContext.fill();
}
    
function colorRect(leftX,topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY, width,height)
}

function computerMovement(){
    var paddle2YCenter = paddle2Y + PADDLE_HEIGHT/2;
    if (paddle2YCenter < ballY-35){
        paddle2Y += difficulty * 2;
    } else if (paddle2YCenter > ballY+35){
        paddle2Y -= difficulty * 2;
    }
}    

function moveEverything(){
    if (showingWinScreen){
        return;
    }
    computerMovement();
    
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    if (ballX > canvas.width - PADDLE_THICKNESS){
        if (ballY > paddle2Y &&
            ballY < paddle2Y + PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY *0.35;
        } else {
        player1Score++; // must be before ballReset()
        ballReset();
        }
    }
    if (ballX < PADDLE_THICKNESS){
        if (ballY > paddle1Y &&
            ballY < paddle1Y + PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY *0.35;
        } else {
        player2Score++; // must be before ballReset()
        ballReset();
        }
    }

    if (ballY > canvas.height){
        ballSpeedY = -ballSpeedY;
    }
    if (ballY < 0){
        ballSpeedY = -ballSpeedY;
    }
}
