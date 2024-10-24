const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let gameRunning = true;
let animationFrameId;

const KEY_CODES = {
  37: { player: 'player2', change: -10 },
  39: { player: 'player2', change: 10 },
  65: { player: 'player1', change: -10 },
  68: { player: 'player1', change: 10 },
};
let keys = {};

// CLASS PART
class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.vx = 2;
    this.vy = 1;
    this.radius = radius;
    this.color = color;
    this.speed = 4; // ball speed 
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  setColor(color)
  {
    if (! color)
      // thanks stackoverflow
      this.color = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)
    else
      this.color = color;
  }
  reset() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.vx = 2;
    this.vy = 1;
    this.speed = 4;
  }
}

class Paddle {
  constructor(x, y, color, nm) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 10;
    this.color = color;
    this.radius = 10;
    this.score = 0;
    this.name = nm;
  }
  draw() {
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  reset()
  {
    this.x = this.initialX;
    this.y = this.initialY;
    this.color = "white";
    this.speed = 1.00000001;
  }
}

class Tournament {
  constructor(player1, player2, player3, player4) {
    this.players = [player1, player2, player3, player4];
    this.score = 0;
    this.round = 0;
  }
}


// CREATE INSTANCE
ball = new Ball(canvas.width / 2, canvas.height / 2, 10, "white");

// horyzontal
player1 = new Paddle(canvas.width / 2 - 70 / 2, 30, "white", "bapasqui");
player2 = new Paddle(canvas.width / 2 - 70 / 2, canvas.height - 10 - 30, "white", "dboire");

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// FUNCTIONS
function debug_print()
{
  if (!gameRunning) return;
  let i = 20;
  ctx.font = "10px Arial";
  ctx.fillText("Ball X : " + ball.x, i, 40);
  ctx.fillText("Ball Y: " + ball.y, i, 60);
  ctx.fillText("Ball vX : " + ball.vx, i, 80);
  ctx.fillText("Ball vy : " + ball.vy, i, 100);
  ctx.fillText("width : " + canvas.width, i, 120);
  ctx.fillText("height : " + canvas.height, i, 140);
  ctx.fillText("speed : " + ball.speed, i, 160);
  animationFrameId = window.requestAnimationFrame(debug_print);  
}

function draw_table() {
  if (!gameRunning) return;
  // RESPONSIVE PART
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 2;
  
  if (canvas.width < 900)
  {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.font = "20px Montserrat";
    ctx.fillText(player1.score, 30, canvas.height / 2 - 20);
    ctx.fillText(player2.score, 30, canvas.height / 2 + 40);

    ctx.fillStyle = "rgb(82, 84, 100)";
    ctx.fillText(player1.name, 30, 40);
    ctx.fillText(player2.name, 30, canvas.height - 30);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }
  else
  {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.font = "30px Montserrat";
    ctx.fillText(player1.score, canvas.width / 2 - 40, 50);
    ctx.fillText(player2.score, canvas.width / 2 + 25, 50);


    ctx.fillStyle = "rgb(82, 84, 100)";
    ctx.fillText(player1.name, 30, 50);
    ctx.fillText(player2.name, canvas.width - 130, 50);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
  }
  animationFrameId = window.requestAnimationFrame(draw_table);
}

function circleRectCollision(circleX, circleY, circleRadius, rectX, rectY, rectWidth, rectHeight) {
  var distX = Math.abs(circleX - rectX - rectWidth / 2);
  var distY = Math.abs(circleY - rectY - rectHeight / 2);

  if (distX > (rectWidth / 2 + circleRadius)) { return false; }
  if (distY > (rectHeight / 2 + circleRadius)) { return false; }

  if (distX <= (rectWidth / 2)) { return true; }
  if (distY <= (rectHeight / 2)) { return true; }

  var dx = distX - rectWidth / 2;
  var dy = distY - rectHeight / 2;
  return (dx * dx + dy * dy <= (circleRadius * circleRadius));
}


function draw_ball() {
  if (!gameRunning) return;
  clearCanvas();
  if (player1.score == 5 || player2.score == 5)
    {
      if (document.getElementById("game").style.display != "none")
      {
        if (player1.score == 5)
          alert(player1.name + " wins!");
        else
          alert(player2.name + " wins!");
        player1.score = 0;
        player2.score = 0;
        stopGame();
        document.getElementById("game").style.display = "none";
        document.getElementById("menu").style.display = "flex";
        document.getElementById("menu").style.setProperty("display", "flex", "important");
        document.getElementById("bob").style.display = "block";
      }
      // sleep with promise not working
      //await new Promise(r => setTimeout(r, 1000));
      // add replay button
    }
  ball.draw();

  ball.x += ball.vx * ball.speed;
  ball.y += ball.vy * ball.speed;

  if (
    ball.y + ball.vy > canvas.height - ball.radius ||
    ball.y + ball.vy < ball.radius
  ) {
    if (canvas.width < 900)
    {
      if (ball.y >= player2.y + 50)
      {
        player1.score++;
        reset(1);
      }
      else if (ball.y <= player1.y - 50)
      {
        player2.score++;
        reset(2);
      }
    }
    else
      ball.vy = -ball.vy;
    ball.setColor("white");
  }
  if (
    ball.x + ball.vx > canvas.width - ball.radius ||
    ball.x + ball.vx < ball.radius
  ) {
    if (canvas.width > 900){
      if (ball.y <= player2.y - 70)
      {
        player1.score++;
        reset(1);
      }
      else if (ball.y >= player1.y - 90)
      {
        player2.score++;
        reset(2);
      }
    }
    else
      ball.vx = -ball.vx;
    ball.setColor("white");
  }
  // COLLISION detection very simple (need to implement a better collision checker)
  // add angle and position on the paddle
  if (canvas.width < 900)
  {
    if (circleRectCollision(ball.x, ball.y, ball.radius, player1.x , player1.y, 70, 10))
      ball.vy = -ball.vy;
    if (circleRectCollision(ball.x, ball.y, ball.radius, player2.x , player2.y, 70, 10))
      ball.vy = -ball.vy;
    } else if (canvas.width > 900)
    {
      if (circleRectCollision(ball.x, ball.y, ball.radius, player1.x, player1.y, 10, 70))
        ball.vx = -ball.vx;
      if (circleRectCollision(ball.x, ball.y, ball.radius, player2.x, player2.y, 10, 70))
        ball.vx = -ball.vx;
    }
    animationFrameId = window.requestAnimationFrame(draw_ball);
}

// Dont do that just for fun and later learning
function animatePaddle(paddle) {
  if (canvas.width < 900)
  {
    const originalHeight = paddle.height;
    paddle.height = paddle.height * 1.5;
    setTimeout(() => {
      paddle.height = originalHeight;
    }, 100);
  }
  else {
    const originalWidth = paddle.width;
    paddle.width = paddle.width * 1.5;
    setTimeout(() => {
      paddle.width = originalWidth;
    }, 100);
  }
}

function draw_paddle()
{
  if (!gameRunning) return;
  player1.draw();
  player2.draw();
  animationFrameId = window.requestAnimationFrame(draw_paddle);
}

function getConeDirection(player_win) {
  const angleRange = Math.PI / 3; // 60 degrees cone
  const baseAngle = player_win == 1 ? -Math.PI / 2 : Math.PI / 2; // -PI/2 for up, PI/2 for down
  const randomAngle = baseAngle + (Math.random() * angleRange - angleRange / 2);
  const speed = 2;
  return {
    vx: speed * Math.cos(randomAngle),
    vy: speed * Math.sin(randomAngle)
  };
}

function reset(player_win) {
  ball = new Ball(canvas.width / 2, canvas.height / 2, 10, "white");
  const direction = getConeDirection(player_win);

  if (canvas.width < 900) {
    if (player_win == 2) {
      ball.vx = -direction.vx;
      ball.vy = direction.vy;
    } else if (player_win == 1) {
      ball.vx = direction.vx;
      ball.vy = -direction.vy;
    }
  } else if (canvas.width > 900) {
    if (player_win == 1) {
      ball.vx = -direction.vx;
      ball.vy = direction.vy;
    } else if (player_win == 2) {
      ball.vx = direction.vx;
      ball.vy = direction.vy;
    }
  }
}

// MOVEMENTS
function checkKeyDown(e) {
  const action = KEY_CODES[e.keyCode];
  if (action) {
    keys[e.keyCode] = action;
  }
  if (e.keyCode == 107)
    ball.speed += 0.1;
  if (e.keyCode == 109)
    ball.speed -= 0.1;
}
function checkKeyUp(e) {
  const action = KEY_CODES[e.keyCode];
  if (action) {
    delete keys[e.keyCode];
  }
}
function move_players() {
  if (!gameRunning) return;
  const speedFactor = 0.5;

  for (let key in keys) {
    let player = window[keys[key].player];
    if (player.name != "AI")
    {

      let change = keys[key].change * speedFactor;

      if (canvas.width < 900) {
        let newX = player.x + change;
        if (newX >= 0 && newX <= canvas.width - player1.width)
          player.x = newX;
      } else {
        let newY = player.y + change;
        if (newY >= 0 && newY <= canvas.height - player1.height)
          player.y = newY;
      }
    }
  }
  animationFrameId = window.requestAnimationFrame(move_players);
}


function updatePlayerLayout() {
  if (canvas.width > 900) {
    player1.x = 30;
    player1.y = canvas.height / 2 - 70 / 2;
    player1.height = 70;
    player1.width = 10;
    player2.x = canvas.width - 10 - 30;
    player2.y = canvas.height / 2 - 70 / 2;
    player2.height = 70;
    player2.width = 10;
  } else {
    player1.x = canvas.width / 2 - 70 / 2;
    player1.y = 30;
    player1.height = 10;
    player1.width = 70;
    player2.x = canvas.width / 2 - 70 / 2;
    player2.y = canvas.height - 10 - 30;
    player2.height = 10;
    player2.width = 70;
  }
}

// need to modify the function since copilot did it and i dont like it
// add a zone since not working on smaller screen because of typed value
// instead of calculated one
function AI_mov_p2() {
  const speed = 7;
  if (canvas.width < 900)
  {
    if (ball.y > canvas.height / 2 + 200)
    {
       if (ball.x < player2.x) {
           player2.x -= speed;
       }
       else if (ball.x > player2.x) {
           player2.x += speed;
       }
       if (player2.x < 0) {
           player2.x = 0;
       } else if (player2.x + player2.width > canvas.width) {
           player2.x = canvas.width - player2.width;
       }
    }
  }
  else if (canvas.width >= 900)
  {
    if (ball.y < canvas.height / 2 + 200)
    {
      if (ball.y < player2.y) {
          player2.y -= speed;
      }
      else if (ball.y > player2.y) {
          player2.y += speed;
      }
  
      if (player2.y < 0) {
          player2.y = 0;
      } else if (player2.y + player2.height > canvas.height) {
          player2.y = canvas.height - player2.height;
      }
    }
  }
  animationFrameId = window.requestAnimationFrame(AI_mov_p2);
}


function AI_mov_p1() {
  const speed = 7;
  if (canvas.width < 900)
  {
    if (ball.y < canvas.height / 2 - 200)
    {
      if (ball.x < player1.x) {
          player1.x -= speed;
      }
      else if (ball.x > player1.x) {
          player1.x += speed;
      }
      if (player1.x < 0) {
          player1.x = 0;
      } else if (player1.x + player1.width > canvas.width) {
          player1.x = canvas.width - player1.width;
      }
    }
  }
  else if (canvas.width >= 900)
  {
    if (ball.x < canvas.width / 2 - 200)
    {
      if (ball.y < player1.y) {
          player1.y -= speed;
      }
      else if (ball.y > player1.y) {
          player1.y += speed;
      }
  
      if (player1.y < 0) {
          player1.y = 0;
      } else if (player1.y + player1.height > canvas.height) {
          player1.y = canvas.height - player1.height;
      }
    }
  }
  animationFrameId = window.requestAnimationFrame(AI_mov_p1);
}



function resizeCanvas() {
    const canvas = document.getElementById('game');
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 200;
    updatePlayerLayout();
    resetBallPosition();
}

function resetBallPosition() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 2;
  ball.vy = 1;
}

function choose_gamemode(value)
{
    // need to check size of the name
  if (value == "pvp")
  {
    player1.name = window.prompt("What's player 1 name?");
    player2.name = window.prompt("What's player 2 name?");
  }
  if (value == "vsa")
  {
    player2.name = "AI";
    player1.name = window.prompt("What's your name?");
    AI_mov_p2();
  }
  if (value == "ai")
  {
    player1.name = "AI - 1";
    player2.name = "AI - 2";
    AI_mov_p2();
    AI_mov_p1();
  }
  if (value == "tournament")
  {
    if (!document.getElementById('player1').value)
      player1.name = "Player 1";
    else
      player1.name = document.getElementById('player1').value;
    if (!document.getElementById('player2').value)
      player2.name = "Player 2";
    else
      player2.name = document.getElementById('player2').value;
    if (!document.getElementById('player3').value)
      player3.name = "Player 3";  
    else
      player3.name = document.getElementById('player3').value;  
    if (!document.getElementById('player4').value)
      player4.name = "Player 4";  
    else
      player4.name = document.getElementById('player4').value;
    
    let tournament = new Tournament(player1, player2, player3, player4);
    tournament.score = 0;
  }
}

function stopGame() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  gameRunning = false;
}


function game(value) {
  let count = 3;
  clearCanvas();
  gameRunning = false;
  choose_gamemode(value);

  const text = player1.name + " vs " + player2.name;
  if (canvas.width < 900)
    ctx.font = "20px Arial";
  else
    ctx.font = "40px Arial";
  const textWidth = ctx.measureText(text).width;
  ctx.fillStyle = "white";
  ctx.fillText(text, (canvas.width - textWidth) / 2, 50);

  let interval = setInterval(() => {
    ctx.clearRect(canvas.width / 2 - 50, canvas.height / 2 - 100, 100, 150);
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(count, canvas.width / 2 - 20, canvas.height / 2);
    count--;
    if (count < 0) {
      clearInterval(interval);
      gameRunning = true;
      draw_ball();
      draw_table();
      draw_paddle();
      draw_table();
      draw_paddle();
      move_players();
    }
  }, 600);
}

// EVENTS 
window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('keydown', checkKeyDown, false);
window.addEventListener('keyup', checkKeyUp, false);
resizeCanvas();