var balls = [];
var startTime=new Date();
var color=['#FF0000','#00FF00','#0000FF','#FFFF00','#00FFFF',
    '#FF00FF','#FFFFFF'];
var ballsNumber=25;
document.getElementById("Ball count").innerHTML=(ballsNumber).toString();
var FlagEvilCircleChange=true;
var stop=false;
var flagballs10=false;
var flagballs5=false;
var difficulty=7;//change this can control difficulty
var evilCircle= new EvilCircle(50,50);
var width;
var height;
document.onmousemove = mouseMove;
// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
// function to generate random number
function random(min,max) {
    return  Math.floor(Math.random()*(max-min)) + min;
}
//Get mouse position
function mousePosition(ev){
    if(ev.pageX || ev.pageY){//firefox、chrome
        return {x:ev.pageX,y:ev.pageY};
    }
    return {// IE
        x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y:ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}
function mouseMove(ev) {
    ev = ev || window.event;
    var mousePos = mousePosition(ev);
    evilCircle.x=mousePos.x;
    evilCircle.y=mousePos.y;
}
//function to Modeling a ball
function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.eaten=false;
}
function EvilCircle(x,y){
    this.x = x;
    this.y = y;
    this.velX =5;
    this.velY =5;
    this.color=color[random(0,color.length)];
    this.size=15;
    this.untouch=true;
}
EvilCircle.prototype.draw =function(){
    if(evilCircle.untouch)
    {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.font = "20px HelveticaNeue";
        ctx.fillStyle = this.color;
        ctx.fillText((3-parseInt(document.getElementById("time").innerText)).toString(),
            this.x-this.size/2, this.y+this.size/2);
    }
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
};
EvilCircle.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.x -= this.velX;
    }

    if ((this.x - this.size) <= 0) {
        this.x += this.velX;
    }

    if ((this.y + this.size) >= height) {
        this.y -= this.velY;
    }

    if ((this.y - this.size) <=0) {
        this.y += this.velY;
    }
};
EvilCircle.prototype.collisionDetect = function() {
    for (var j = 0; j < balls.length; j++) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        if(balls[j].eaten===true)
        {
            balls[j].velX= dx/10;
            balls[j].velY= dy/10;
        }
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + balls[j].size) {
            balls[j].eaten=true;
            if(evilCircle.color!==balls[j].color)
            {lose();}
            if(distance<3) {
                balls.splice(j, 1);
                bufferLoader.onload(bufferLoader.bufferList[8]);
                document.getElementById("Ball count").innerHTML = (balls.length).toString();
                if(balls.length<10&&flagballs10===false)
                {
                    flagballs10=true;
                    changeSpeed();
                }
                if(balls.length<5&&flagballs5===false)
                {
                    flagballs5=true;
                    changeSpeed();
                }
            }
            if(balls.length===0)
            {win();}
        }
    }
};
Ball.prototype.draw =function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};
Ball.prototype.update = function() {
    if ((this.x + this.size) >= width&&this.eaten===false&&this.velX>0) {
        this.velX = -(this.velX);
        if(balls.length<=15)
        {bufferLoader.onload(bufferLoader.bufferList[random(1,8)]);}
    }
    if ((this.x - this.size) <= 0&&this.eaten===false&&this.velX<0) {
        this.velX = -(this.velX);
        if(balls.length<=15)
        {bufferLoader.onload(bufferLoader.bufferList[random(1,8)]);}
    }
    if ((this.y + this.size) >= height&&this.eaten===false&&this.velY>0) {
        this.velY = -(this.velY);
        if(balls.length<=15)
        {bufferLoader.onload(bufferLoader.bufferList[random(1,8)]);}
    }
    if ((this.y - this.size) <= 0&&this.eaten===false&&this.velY<0) {
        this.velY = -(this.velY);
        if(balls.length<=15)
        {bufferLoader.onload(bufferLoader.bufferList[random(1,8)]);}
    }
    this.x += this.velX;
    this.y += this.velY;
};
//Adding collision detection
Ball.prototype.collisionDetect = function() {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])&&balls[j].eaten===false) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color =color[ random(0,color.length)];
            }
        }
    }
};
//Animating the ball
function loop() {
    if(SoundLoadComplete===true)
    {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);
        var time=new Date();
        document.getElementById("time").innerText=(Math.floor((time.getTime()-startTime.getTime())/1000)).toString();
        if(parseInt(document.getElementById("time").innerText)>3) {
            evilCircle.untouch=false;
            evilCircle.collisionDetect();
        }
        evilCircle.draw();
        evilCircle.update();

        //evilCircle.setControls();
        for (var i = 0; i < balls.length; i++) {
            if(balls[i].eaten===false)
            {
                balls[i].collisionDetect();
            }
                balls[i].update();
                balls[i].draw();
                if(balls[i].color===evilCircle.color)
                {
                    FlagEvilCircleChange=false;
                }
        }
        if(FlagEvilCircleChange&&balls.length!==0)//change evilCircle's color
        {
            evilCircle.color=balls[random(0,balls.length)].color;
        }
        FlagEvilCircleChange=true;
    }
    window.onkeydown= function(e) {
        if (e.keyCode === 82||e.keyCode === 114) {
            again();
        }
    }
    if(stop!==true)
    {stop=requestAnimationFrame(loop);}
}
function initial(){
    document.getElementById("body").style.cursor='none';
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    flagballs10=false;
    flagballs5=false;
    stop=false;
    startTime=new Date();
    balls=[];
    while (balls.length < ballsNumber) {
        var ball = new Ball(
            random(0,width),
            random(0,height),
            random(-7,7),
            random(-7,7),
            color[ random(0,color.length)],
            random(10,20)
        );
        balls.push(ball);
    }
    document.getElementById("Ball count").innerHTML = (balls.length).toString();
    evilCircle= new EvilCircle(50,50);
}
function win(){
    document.getElementById("body").style.cursor='auto';
    document.getElementById("win").style.display='inline';
    document.getElementById("UseTime").innerHTML=document.getElementById("time").innerText;
    cancelAnimationFrame(stop);
    stop=true;
}
function lose(){
    document.getElementById("body").style.cursor='auto';
    document.getElementById("lose").style.display='inline';
    cancelAnimationFrame(stop);
    stop=true;
}
//reset
function again(){
    document.getElementById("win").style.display='none';
    document.getElementById("lose").style.display='none';
    cancelAnimationFrame(stop);
    stop=true;
    initial();
    loop();
}
//change balls speed
function changeSpeed(){
    for (var i = 0; i < balls.length; i++) {
        if(balls[i].velX>=0)
        {balls[i].velX=balls[i].velX+difficulty;}
        else
        {balls[i].velX=balls[i].velX-difficulty;}
        if(balls[i].velY>=0)
        {balls[i].velY=balls[i].velY+difficulty;}
        else
        {balls[i].velY=balls[i].velY-difficulty;}
    }
}


