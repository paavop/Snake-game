var xsize=500;
var ysize=500;
var block_size=25;


var canvas=document.getElementById("canvas");
canvas.width=xsize;
canvas.height=ysize;
var ctx=canvas.getContext('2d');
var basespeed=4;

var snake=[];
snake.push(new snake_block(block_size/2,block_size/2,block_size/2,block_size/2));


var xspeed=0;
var yspeed=0;

var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null ;

function snake_block(sx,sy,slx,sly){
  this.x=sx;
  this.y=sy;
  this.lastx=slx;
  this.lasty=sly;
  this.move=function(){
      if(round_down(this.x)!=round_down(this.x+xspeed)){
        this.lastx=this.x;
        this.lasty=this.y;
      }
      if(round_down(this.y)!=round_down(this.y+yspeed)){
        this.lasty=this.y;
        this.lastx=this.x;
      }
      this.x+=xspeed;
      this.y+=yspeed;

  }
}
var mainloop=function(){
  draw()
  update()
};

var draw=function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillRect(round_down(snake[0].x),round_down(snake[0].y),block_size,block_size);
  ctx.fillRect(round_down(snake[0].lastx),round_down(snake[0].lasty),block_size,block_size);


};
var update=function(){
  document.onkeydown = checkKey;

  if(snake[0].x>=0+basespeed && snake[0].x<xsize-basespeed && snake[0].y>=0+basespeed && snake[0].y<ysize-basespeed){
    snake[0].move();
  }


};
function checkKey(e) {

    e = e || window.event;
    xspeed=0
    yspeed=0
    if (e.keyCode == '38') {
		// up
		yspeed = -basespeed;
    snake[0].x=round_down(snake[0].x)+block_size/2;
    }
    else if (e.keyCode == '40') {
		// down
		yspeed = basespeed;
    snake[0].x=round_down(snake[0].x)+block_size/2;

    }
    else if (e.keyCode == '37') {
       // left arrow
		xspeed = -basespeed;
    snake[0].y=round_down(snake[0].y)+block_size/2;

    }
    else if (e.keyCode == '39') {
       // right arrow
		xspeed = basespeed;
    snake[0].y=round_down(snake[0].y)+block_size/2;

    }
	//else if (e.keyCode == '32') {
       // space bar


};

function round_down(value_x){
  return Math.round((value_x/block_size)-0.5)*block_size
}


var recursiveAnim=function(){
	mainloop();
	animFrame(recursiveAnim);
};

animFrame(recursiveAnim);
