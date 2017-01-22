var xsize=500;
var ysize=500;
var block_size=25;


var canvas=document.getElementById("canvas");
canvas.width=xsize;
canvas.height=ysize;
var ctx=canvas.getContext('2d');
var basespeed=4;

var x=[basespeed];
var y=[basespeed];
var xspeed=0;
var yspeed=0;

var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null ;


var mainloop=function(){
  draw()
  update()
};

var draw=function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log(x[0]);

  ctx.fillRect(Math.round((x[0]/block_size)-0.5)*block_size,Math.round((y[0]/block_size)-0.5)*block_size,block_size,block_size);
  
};
var update=function(){
  document.onkeydown = checkKey;

  if(x[0]>=0+basespeed && x[0]<xsize-basespeed){
    x[0]+=xspeed
  }
  if(y[0]>=0+basespeed && y[0]<ysize-basespeed){
    y[0]+=yspeed
  }

};
function checkKey(e) {

    e = e || window.event;
    xspeed=0
    yspeed=0
    if (e.keyCode == '38') {
		// up
		yspeed = -basespeed;
    x[0]=Math.round((x[0]/block_size)-0.5)*block_size+block_size/2;
    }
    else if (e.keyCode == '40') {
		// down
		yspeed = basespeed;
    x[0]=Math.round((x[0]/block_size)-0.5)*block_size+block_size/2;

    }
    else if (e.keyCode == '37') {
       // left arrow
		xspeed = -basespeed;
    y[0]=Math.round((y[0]/block_size)-0.5)*block_size+block_size/2;

    }
    else if (e.keyCode == '39') {
       // right arrow
		xspeed = basespeed;
    y[0]=Math.round((y[0]/block_size)-0.5)*block_size+block_size/2;

    }
	//else if (e.keyCode == '32') {
       // space bar


};



var recursiveAnim=function(){
	mainloop();
	animFrame(recursiveAnim);
};

animFrame(recursiveAnim);
