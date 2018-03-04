
var xsize=500;
var ysize=400;

var msg={
	  messageType: "SETTING",
	  options: {
        "width": xsize, 
		"height": ysize+100
	}
};
window.parent.postMessage(msg,"*");
window.addEventListener("message", receiveMessage, false);
  
var canvas=document.getElementById("canvas");
canvas.width=xsize;
canvas.height=ysize+100;
var ctx=canvas.getContext('2d');

var block_size=25;
var score=0;
var basespeed=3;

var notturned=true;
var snake=[];
snake.push(new snake_block(block_size/2,block_size/2));
var treat={x: 200,  y: 200};


var xspeed=0;
var yspeed=0;

var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null ;
//Snakes are made of blocks that know their current and previous position
function snake_block(sx,sy){
  this.x=sx;
  this.y=sy;
  this.lastx=sx;
  this.lasty=sy;
  this.move=function(){
      if(round_down(this.x)!=round_down(this.x+xspeed) || round_down(this.y)!=round_down(this.y+yspeed)){
        this.lastx=this.x;
        this.lasty=this.y;
        this.x+=xspeed;
        this.y+=yspeed;
        makemoves();
      }else{

        this.x+=xspeed;
        this.y+=yspeed;
      }

  }
}

//Can receive error from parent window, kills player if error
function receiveMessage(evt){
  var data=evt.data;
  if(data.messageType=="ERROR"){
    console.log("Shut down game due to: "+data.info);
    playing=false;
  }
}
//Main loop consists of drawing updating, if player is dead reset screen is shown
var mainloop=function(){
  //check_msg();
  if(playing){
    draw();
    update();
  }else{
    draw_reset();
  }
};
//Checks snake position and draws it
var draw=function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for(i=0;i<snake.length;i++){
    ctx.fillRect(round_down(snake[i].x)+1,round_down(snake[i].y)+1,block_size-2,block_size-2);
  }
  ctx.beginPath();
  ctx.arc(round_down(treat.x)+block_size/2, round_down(treat.y)+block_size/2, block_size/3, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
  draw_score();
  drawBorder();

};
//Draws frame around game
var drawBorder=function(){
	ctx.strokeStyle = '#000'; 
    ctx.beginPath();
    ctx.moveTo(0, 0); 
    ctx.lineTo(0, ysize);
	ctx.lineTo(xsize, ysize);
	ctx.lineTo(xsize, 0);
	ctx.lineTo(0, 0);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();  
	
};
//Draws player score
var draw_score=function(){
  ctx.fillRect(0,ysize,xsize,100);
  ctx.textAlign = "center";
  ctx.font = "48px serif";
  ctx.fillStyle="white";
  ctx.fillText("Score: "+score,xsize/2,ysize+100/2);
  ctx.fillStyle="Black";
}
//Draws reset-screen 
var draw_reset=function(){
  ctx.textAlign = "center";
  ctx.font = "58px serif";
  ctx.fillText("You dead", xsize/2, ysize/2);
  ctx.font = "32px serif";
  ctx.fillText("Press enter to reset", xsize/2, ysize/2+50);
  document.onkeydown = checkKey;

}
//Checks if player is giving new directions or if player is hitting a wall or itself
var update=function(){

  document.onkeydown = checkKey;
  if(snake[0].x>=0+basespeed && snake[0].x<xsize-basespeed && snake[0].y>=0+basespeed && snake[0].y<ysize-basespeed){
    snake[0].move();
  }else{
    dead();
  }
  check_collision();
  if(round_down(treat.x)==round_down(snake[0].x) && round_down(treat.y)==round_down(snake[0].y)){
    eat_treat();
  }
};
//Checks if snake eats itself
var check_collision=function(){
  for(i=1;i<snake.length;i++){
    if(round_down(snake[0].x)==round_down(snake[i].x) && round_down(snake[0].y)==round_down(snake[i].y)){
      dead();
    }
  }
};
//Stops game, posts player score to parent window
var dead=function(){
  notturned=true;
  playing=false;
  var msg={
	  messageType: "SCORE",
	  score: score
  };
  window.parent.postMessage(msg,"*");
  
};
//Moves every snake block to the next spot
var makemoves=function(){
  notturned=true;
  if(snake.length>1){
    for(i=1;i<snake.length;i++){
      snake[i].lastx=snake[i].x;
      snake[i].x=snake[i-1].lastx;
      snake[i].lasty=snake[i].y;
      snake[i].y=snake[i-1].lasty;
    }
  }


}
//score up, snake length up
var eat_treat=function(){
  score+=10;
  basespeed+=0.1;
  treat.x=Math.floor(Math.random()*xsize);
  treat.y=Math.floor(Math.random()*ysize);

  snake.push(new snake_block(snake[snake.length-1].lastx,snake[snake.length-1].lasty));
}
//checks user input
function checkKey(e) {

    e = e || window.event;
    if(!playing){
      if (e.keyCode == '13') {
        reset();
        playing=true;
        notturned=true;
      }
    }
    if(notturned){
      if (e.keyCode == '38' || e.keyCode == '87') {
  		// up
        xspeed=0;
        if(yspeed<=0){
          yspeed = -basespeed;
          snake[0].x=round_down(snake[0].x)+block_size/2;
          notturned=false;
        }
  		}
      else if (e.keyCode == '40' || e.keyCode == '83') {
  		// down
        xspeed=0;
        if(yspeed>=0){
      		yspeed = basespeed;
          snake[0].x=round_down(snake[0].x)+block_size/2;
          notturned=false;
        }
      }
      else if (e.keyCode == '37' || e.keyCode == '65') {
         // left arrow
         yspeed=0;
         if(xspeed<=0){
      		xspeed = -basespeed;
          snake[0].y=round_down(snake[0].y)+block_size/2;
          notturned=false;
        }

      }
      else if (e.keyCode == '39' || e.keyCode == '68') {
         // right arrow
         yspeed=0;
         if(xspeed>=0){
      		xspeed = basespeed;
          snake[0].y=round_down(snake[0].y)+block_size/2;
          notturned=false;
        }
      }
    }
	//else if (e.keyCode == '32') {
       // space bar


};

//simple function to see what square a pos rounds to
function round_down(value_x){
  return Math.round((value_x/block_size)-0.5)*block_size
}
function reset(){
  snake=[];
  snake.push(new snake_block(xsize/2,ysize/2));
  basespeed=3;
  xspeed=0;
  yspeed=0;
  score=0;
}

//used to play gameloop
var recursiveAnim=function(){
	mainloop();

	animFrame(recursiveAnim);

};
var start_game=function(){
  reset();
  animFrame(recursiveAnim);
};
var playing=true;

start_game();
