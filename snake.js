var xsize=500;
var ysize=400;


var canvas=document.getElementById("canvas");
canvas.width=xsize;
canvas.height=ysize+100;
var ctx=canvas.getContext('2d');

var block_size=25;
var score=0;
var basespeed=3;

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
var mainloop=function(){
  if(playing){
    draw();
    update();
  }else{
    draw_reset();
  }
};

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

};
var draw_score=function(){
  ctx.fillRect(0,ysize,xsize,100);
  ctx.textAlign = "center";
  ctx.font = "48px serif";
  ctx.fillStyle="white";
  ctx.fillText("Score: "+score,xsize/2,ysize+100/2);
  ctx.fillStyle="Black";
}
var draw_reset=function(){
  ctx.textAlign = "center";
  ctx.font = "58px serif";
  ctx.fillText("You dead", xsize/2, ysize/2);
  ctx.font = "32px serif";
  ctx.fillText("Press enter to reset", xsize/2, ysize/2+50);
  document.onkeydown = checkKey;

}
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
var check_collision=function(){
  for(i=1;i<snake.length;i++){
    if(round_down(snake[0].x)==round_down(snake[i].x) && round_down(snake[0].y)==round_down(snake[i].y)){
      dead();
    }
  }
};
var dead=function(){

  playing=false;
};
var makemoves=function(){
  if(snake.length>1){
    for(i=1;i<snake.length;i++){
      snake[i].lastx=snake[i].x;
      snake[i].x=snake[i-1].lastx;
      snake[i].lasty=snake[i].y;
      snake[i].y=snake[i-1].lasty;
    }
  }


}
var eat_treat=function(){
  score+=10;
  basespeed+=0.1;
  treat.x=Math.floor(Math.random()*xsize);
  treat.y=Math.floor(Math.random()*ysize);

  snake.push(new snake_block(snake[snake.length-1].lastx,snake[snake.length-1].lasty));
}
function checkKey(e) {

    e = e || window.event;
    if(!playing){
      if (e.keyCode == '13') {
        reset();
        playing=true;
      }
    }
    if (e.keyCode == '38' || e.keyCode == '87') {
		// up
      xspeed=0;
      if(yspeed<=0){
        yspeed = -basespeed;
        snake[0].x=round_down(snake[0].x)+block_size/2;
      }
		}
    else if (e.keyCode == '40' || e.keyCode == '83') {
		// down
      xspeed=0;
      if(yspeed>=0){
    		yspeed = basespeed;
        snake[0].x=round_down(snake[0].x)+block_size/2;
      }
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
       // left arrow
       yspeed=0;
       if(xspeed<=0){
    		xspeed = -basespeed;
        snake[0].y=round_down(snake[0].y)+block_size/2;
      }

    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
       // right arrow
       yspeed=0;
       if(xspeed>=0){
    		xspeed = basespeed;
        snake[0].y=round_down(snake[0].y)+block_size/2;
      }
    }
	//else if (e.keyCode == '32') {
       // space bar


};

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
