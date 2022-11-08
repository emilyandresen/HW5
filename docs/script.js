/*
Author: Emily Andresen
Class: CPSC 332
Assignment: Homework 5 - JavaScript
Last Modified: 11/07/2022
*/

var color1 = "#0095DD";
var lightColor = "lightgreen";
var darkColor = "midnightblue";


window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var lives = 3;

    var bricks = [];

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        }
        else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        }
        else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount) {
                            //TODO: draw message on the canvas
                            checkWinState();
                            //TODO: pause game instead of reloading
                            togglePauseGame();
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = lightColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = lightColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = lightColor;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        ctx.fillText("Score: " + score, 45, 10);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        ctx.fillText("Lives: " + lives, canvas.width - 45, 10);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawHighScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (lives <= 0) {
                    //TODO: draw message on the canvas
                    checkWinState();
                    //TODO: pause game instead of reloading
                    togglePauseGame();
                    lives = 0;
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        //TODO: adjust speed
        x += (dx * speedMultiplier);
        y += (dy * speedMultiplier);

        //TODO: pause game check
        if (!paused) {
            requestAnimationFrame(draw);
        }
    }

    /*
        Additions to starter code
    */

    //Additional variables used to help make dimensions/locations easier to reuse            
    //controls game speed 
    var speedMultiplier = 1;           
    //pause game variable
    var paused = false;      
    //high score tracking variables
    var highScore = 0;
    //other variables?            

    //event listeners added
    //game speed changes handler 
    var speed = document.getElementById("speed");
    speed.addEventListener("change", adjustGameSpeed);            
    //pause game event handler    
    var pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", togglePauseGame);       
    //start a new game event handler
    var startButton = document.getElementById("reset");
    startButton.addEventListener("click", startNewGame);            
    //continue playing
    var continueButton = document.getElementById("continue");
    continueButton.addEventListener("click", continuePlaying);
    //reload click event listener
    var reloadButton = document.getElementById("reload");
    reloadButton.addEventListener("click", () => {
        document.location.reload();
    });            

    //Drawing a high score
    function drawHighScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        ctx.fillText("High Score: " + highScore, canvas.width/2, 10);
    }

    //draw the menu screen, including labels and button
    function drawMenu() {
        //draw the rectangle menu backdrop
        ctx.fillStyle = lightColor;
        setShadow();
        ctx.fillRect(25, 25, canvas.width - 50, canvas.height - 50);

        //draw the menu header
        resetShadow();
        ctx.font = "bold 24pt Verdana";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = darkColor;
        ctx.fillText("Breakout Game!", canvas.width/2, 70);

        //start game button area
        setShadow();
        ctx.fillRect(canvas.width/2 - 70, 140, 140, 40)

        resetShadow();
        ctx.font = "12pt Verdana";
        ctx.fillStyle = "white"
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        ctx.fillText("Click to Begin!", canvas.width/2, 152);

        //event listener for clicking start
        //need to add it here because the menu should be able to come back after 
        //we remove the it later
        canvas.addEventListener("click", startGameClick);               
    }

    //function used to set shadow properties
    function setShadow() {
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = "black";
    };

    //function used to reset shadow properties to 'normal'
    function resetShadow() {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    };

    //function to clear the menu when we want to start the game
    function clearMenu() {
        canvas.removeEventListener("click", canvas)
        //remove event listener for menu, 
        //we don't want to trigger the start game click event during a game                
    }

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    function startGameClick(event) {
        clearMenu();
        if (paused) {
            togglePauseGame();
        }
        else {
            requestAnimationFrame(draw);
        }
    };

    //function to handle game speed adjustments when we move our slider
    function adjustGameSpeed() {
        speedMultiplier = speed.value;
        //update the slider display                
        //update the game speed multiplier                
    };

    //function to toggle the play/paused game state
    function togglePauseGame() {
        //toggle state                
        //if we are not paused, we want to continue animating (hint: zyBook 8.9)
        if (paused) {
            paused = false;
            requestAnimationFrame(draw);
        }
        else {
            paused = true;            
        }
    };

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState() {
        bricksRemaining = 0;
        for (i = 0; i < bricks.length; i++) {
            let row = bricks[i]
            for (j = 0; j < row.length; j++) {
                bricksRemaining += row[j].status;
            }
        }
        if (bricksRemaining > 0) {
            ctx.font = "bold 24pt Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("GAME OVER", canvas.width/2, 140);
        }
        else {
            ctx.font = "bold 24pt Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("YOU WIN, CONGRATS!", canvas.width/2, 140);
        }
    };

    //function to clear the board state and start a new game (no high score accumulation)
    function startNewGame() {
        highScore = 0;
        resetBoard(true);
        if (!paused) {
            requestAnimationFrame(draw);
        }
        else {
            togglePauseGame();
        }
    };

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    function continuePlaying() {
        highScore = highScore + score;
        resetBoard(false);
        togglePauseGame();
    };

    //function to reset starting game info
    function resetBoard(resetLives) {
        if (resetLives) {
            lives = 3;
        }
        for (i = 0; i < bricks.length; i++) {
            let row = bricks[i]
            for (j = 0; j < row.length; j++) {
                row[j].status = 1;
            }
        }
        score = 0;
        x = canvas.width / 2;
        y = canvas.height - 30;
        paddleX = (canvas.width - paddleWidth) / 2;

        //reset paddle position
        //reset bricks               
        //reset score and lives               
    };

    //draw the menu.
    //we don't want to immediately draw... only when we click start game            
    drawMenu();

};//end window.onload function
