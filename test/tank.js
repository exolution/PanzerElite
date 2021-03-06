/**
 * Javascript Powered!
 * @author: godsong
 * Date: 13-5-9
 * Time: 下午5:09
 */
window.onload = function () {
    var mainContainer=document.getElementById('mainContainer');
    function Tank(x, y) {
        if (!this.tankEl) {
            var body = document.createElement('div'),
                top = document.createElement('div'),
                turret = document.createElement('div'),
                barrel = document.createElement('div'),
                fireFlame = document.createElement('div'),
                aimField=document.createElement('div');
            body.id = "tank-body";
            body.className = "sprite";
            top.id = "tank-top";
            top.className = "sprite";
            barrel.id = "tank-barrel";
            turret.id = "tank-turret";
            fireFlame.id = 'fireFlame';
            aimField.id='aimField';
            top.appendChild(turret);
            top.appendChild(barrel);
            top.appendChild(fireFlame);
            top.appendChild(aimField);
            this.tankEl = {
                body: body,
                top: top,
                barrel: barrel,
                turret: turret
            };
            document.getElementById('mainContainer').appendChild(body);
            document.getElementById('mainContainer').appendChild(top);
            this.x = x || 0;
            this.y = y || 0;
            this.angle = 180;
            this.turretAngle = 180;
            this.x_add = 200;
            this.y_add = 100;
            this.acl = 0;
            this.angle_add = 0;
            this.turretAngle_add = 0;
            this.velocity = 0;
            this.maxForwardVelocity = 400;
            this.maxForwardAcl = 0.5;
            this.maxBackVelocity = -100;
            this.maxBackAcl = -0.1;
            this.turnVelocity = 0;
            this.turnVelocity = 0;
            this.turretTurnVelocity = 0;
            this.draw();
        }
    }

    window.t = +new Date();

    Tank.prototype.draw = function (flag) {
        var drawBody = flag, drawTop = flag;
        if (Math.abs(this.x_add) > 1) {
            this.x += this.x_add | 0;
            this.x_add -= this.x_add | 0;
            drawBody = true;
        }
        if (Math.abs(this.y_add) > 1) {
            this.y += this.y_add | 0;
            this.y_add -= this.y_add | 0;
            drawBody = true;
        }
        if (Math.abs(this.angle_add) > 0.5) {
            this.angle += this.angle_add;
            this.angle_add = 0;
            drawTop = true;
        }
        if (Math.abs(this.turretAngle_add) > 0.5) {
            this.turretAngle += this.turretAngle_add;
            this.turretAngle_add = 0;
            drawTop = true;
        }
        if (drawTop || drawBody) {
            //console.log(+new Date() - window.t);
            //window.t = +new Date();
            this.tankEl.body.style.cssText = 'left:' + this.x + 'px;top:' + this.y + 'px;-webkit-transform:rotate(' + this.angle + 'deg);';
        }
        if (drawTop || drawBody) {
            this.tankEl.top.style.cssText = 'left:' + (this.x - 112) + 'px;top: ' + (this.y + 22) + 'px;-webkit-transform:rotate(' + this.turretAngle + 'deg)';
        }
    };


    function TankMotionAnimation(tank){
        this.tank=tank;
        this.state = 0;
    }
    TankMotionAnimation.prototype={
        init:function(){
            this.v = 0;
        },
        next: function (tick, interval) {
            var d, x, y, acl = this.tank.acl;
            //console.log(tick,interval,this.v,acl,this.tank.velocity);
            if (this.v * (acl >= 0 ? 1 : -1) < this.tank.velocity) {
                this.v = this.v + acl * interval;
            }
            else {
                this.tank.acl = 0;
                this.v = this.tank.velocity;
            }
            if (this.v == 0 && this.tank.turnVelocity == 0 && this.tank.turretTurnVelocity == 0) {
                this.state = 0;
            }
            this.tank.angle_add += this.tank.turnVelocity * interval / 1000 * (this.v >= 0 ? 1 : -1);
            this.tank.turretAngle_add += this.tank.turretTurnVelocity * interval / 1000;
            d = this.v * interval / 1000;
            x = -Math.cos(Math.PI * this.tank.angle / 180) * d;
            y = -Math.sin(Math.PI * this.tank.angle / 180) * d;
            this.tank.x_add += x;
            this.tank.y_add += y;
            this.tank.draw();
        }
    };
    //炮弹
    function Shell(velocity,dst){
        this.velocity=velocity;
        this.dst=dst;
    }
    Shell.prototype={
        constructor:Shell,
        hit:function(target){

        }
    }
    function BallisticAnimation(){
        this.shells=[];
        this.state=0;
    }
    BallisticAnimation.prototype={
        addShell:function(x,y,angle,shell){

            if(this.state===0)timeLine.addAnimation(this);
            var div=document.createElement('div');
            div.className='shell';
            mainContainer.appendChild(div);
            div.style.cssText='left:'+x+'px;top:'+y+'px;-webkit-transform:rotate('+(angle-90)+'deg);';
            this.shells.push({x:x,y:y,dst:shell.dst,angle:angle,shell:shell,el:div,x_add:0,y_add:0});
        },
        next:function(tick,interval){
            var s, i, x, y,left,top,flag;
            for(i=0;i<this.shells.length;i++){
                o=this.shells[i];
                d= o.shell.velocity*interval/1000;
                left=parseInt(o.el.style.left);
                top=parseInt(o.el.style.top);
                flag=false;
                //console.log(o.dst,d);
                //console.log(parseInt(o.el.style.left),Math.cos(Math.PI/180*o.angle));
                o.x_add+=d*-Math.cos(Math.PI/180*o.angle);
                o.y_add+=d*-Math.sin(Math.PI/180*o.angle);
                if (Math.abs(o.x_add) > 1) {
                    left+=o.x_add|0;
                    o.x_add -= o.x_add | 0;
                    flag=true;
                }
                if (Math.abs(o.y_add) > 1) {
                    top+=o.y_add|0;
                    o.y_add -= o.y_add | 0;
                    flag=true;
                }
                if(flag){
                    o.el.style.cssText='left:'+left+'px;top:'+top+'px;-webkit-transform:rotate('+ (o.angle-90)+'deg);';

                }
                o.dst-=d;
                if(o.dst<=0){
                    this.shells.splice(i,1);
                    i--;
                    if(this.shells.length==0){
                        this.state=0;
                    }
                }
            }
        },
        init:function(){

        }

    };
    var ballisticAnimation=new BallisticAnimation();
    var S88mm=new Shell(3000,2500);
    //动画时间轴
    var timeLine = function (window, undefined) {
        var animationSet = [], mainTimer, timerState = 0;

        function removeAnimation(animation) {
            var idx = animationSet.indexOf(animation);
            if (idx != -1) {
                animationSet.splice(idx, 1);
                return true;
            }
            else return false;
        }

        function startTimer() {
            var tick = 0,
                prevTick = 0,
                beginTick = +new Date();
            timerState = 1;
            mainTimer = setInterval(function () {
                var frame;
                tick = +new Date() - beginTick;
                for (var i = 0; i < animationSet.length; i++) {
                    frame = animationSet[i];
                    if (typeof frame.next == 'function' && frame.state === 1) {
                        frame.next(tick, tick - prevTick);
                    }
                    else {
                        animationSet.splice(i, 1);
                        i--;
                    }
                }
                if (animationSet.length == 0) {
                    clearInterval(mainTimer);
                    timerState = 0;
                }
                prevTick = tick;
            }, 0);
        }

        return {
            addAnimation: function (frame) {
                frame.state = 1;
                if (animationSet.indexOf(frame) == -1) {
                    frame.init();
                    animationSet.push(frame);
                }
                if (timerState === 0) {
                    startTimer();
                }

            },
            removeAnimation: removeAnimation
        }
    }(window);

    var myTank = new Tank();
    var myTankMotionAnimation=new TankMotionAnimation(myTank)
    function GifAnimation(target, duration) {
        this.target = target;
        this.duration = duration;
        this.frames = [];
        this.idx = 0;
    }

    GifAnimation.prototype = {
        init: function () {
            this.t = 0;
            this.idx = 0;
        },
        addKeyFrame: function (css) {
            this.frames.push(css);

        },
        next: function (tick, interval) {
            this.t += interval;
            var delay = this.duration / this.frames.length;
            if (this.t >= delay) {
                this.target.style.cssText = this.frames[this.idx];
                this.idx++;
                this.t = 0;
            }
            if (this.idx >= this.frames.length) {
                this.state = 0;
            }
        }
    };


    var fireFlameFrame = new GifAnimation(document.getElementById('fireFlame'), 800);
    fireFlameFrame.addKeyFrame("background-position:-151px 0px ;");
    fireFlameFrame.addKeyFrame("background-position:-302px 0px;");
    fireFlameFrame.addKeyFrame("background-position:0px -127px ;");
    fireFlameFrame.addKeyFrame("background-position:-151px -127px;");
    fireFlameFrame.addKeyFrame("background-position:-302px -127px ;");
    fireFlameFrame.addKeyFrame("background-position: 0px -254px;");
    fireFlameFrame.addKeyFrame("background-position: -151px -254px;");
    fireFlameFrame.addKeyFrame("background-position: -302px -254px;");
    fireFlameFrame.addKeyFrame("background-position: 0px -381px;");
    fireFlameFrame.addKeyFrame("background-position: -151px -381px;");
    fireFlameFrame.addKeyFrame("background-position: -302px -381px;");
    fireFlameFrame.addKeyFrame("background-position: -302px -381px;");



    function logs() {
        var lcd = document.getElementById('lcd');
        for (var i = 0; i < arguments.length; i++) {
            lcd.innerHTML = arguments[i] + '   ';
        }
    }

    var keyState = {};
    document.onkeydown = function (evt) {
        var event = evt || window.event;
        if (!keyState[event.keyCode]) {
            switch (event.keyCode) {
                case 32:
                    var barrel = document.getElementById('tank-barrel'),
                        aimField=document.getElementById('aimField');
                    aimField.style.display='none';
                    if (barrel.className == '') {
                        barrel.className = 'barrel-fire';
                        timeLine.addAnimation(fireFlameFrame);
                        ballisticAnimation.addShell(100,100,190,S88mm);
                        setTimeout(function () {
                            barrel.className = '';
                            aimField.style.display='block';
                        }, 1000);
                    }
                    break;
                case 87:
                    myTank.velocity = myTank.maxForwardVelocity;
                    myTank.acl = myTank.maxForwardAcl;
                    timeLine.addAnimation(myTankMotionAnimation);
                    keyState[event.keyCode] = 1;
                    evt.preventDefault();
                    break;
                case 83:
                    myTank.velocity = myTank.maxBackVelocity;
                    myTank.acl = myTank.maxBackAcl;
                    timeLine.addAnimation(myTankMotionAnimation);
                    keyState[event.keyCode] = 1;
                    break;
                case 65:
                    //myTank.velocity = myTank.maxForwardVelocity;
                    myTank.turnVelocity = -10;
                    keyState[event.keyCode] = 1;
                    timeLine.addAnimation(myTankMotionAnimation);
                    break;
                case 68:
                    // myTank.velocity = myTank.maxForwardVelocity;
                    myTank.turnVelocity = 40;
                    timeLine.addAnimation(myTankMotionAnimation);
                    keyState[event.keyCode] = 1;
                    break;
                case 74:
                    myTank.turretTurnVelocity = -20;
                    //myTank.velocity = myTank.maxForwardVelocity;
                    timeLine.addAnimation(myTankMotionAnimation);
                    keyState[event.keyCode] = 1;
                    break;
                case 75:
                    myTank.turretTurnVelocity = 50;
                    // myTank.velocity = myTank.maxForwardVelocity;
                    timeLine.addAnimation(myTankMotionAnimation);
                    keyState[event.keyCode] = 1;
                    break;

            }
        }
    };
    //new Tank(200,300);
    document.onkeyup = function (evt) {
        var event = evt || window.event;
        if (keyState[event.keyCode] == 1) {
            switch (event.keyCode) {

                case 87:
                    if (!keyState[83]) {
                        myTank.velocity = 0;
                        myTank.acl = myTank.maxBackAcl;
                    }
                    keyState[event.keyCode] = 0;
                    break;
                case 83:
                    if (!keyState[87]) {
                        myTank.velocity = 0;
                        myTank.acl = myTank.maxForwardAcl;
                    }
                    keyState[event.keyCode] = 0;
                    break;
                case 65:
                    if (!keyState[68]) {
                        myTank.turnVelocity = 0;
                    }
                    keyState[event.keyCode] = 0;
                    break;
                case 68:
                    if (!keyState[65]) {
                        myTank.turnVelocity = 0;
                    }
                    keyState[event.keyCode] = 0;
                    break;
                case 74:
                    if (!keyState[76]) {
                        myTank.turretTurnVelocity = 0;
                    }
                    keyState[event.keyCode] = 0;
                    break;
                case 75:
                    if (!keyState[74]) {
                        myTank.turretTurnVelocity = -0;
                    }
                    keyState[event.keyCode] = 0;
                    break;
            }
        }
    }
    var mouseDelta=0;
    var systemScale=1;
    window.onmousewheel=document.onmousewheel=function(evt){
        if(evt.wheelDelta>0){
            if(systemScale<1){
                systemScale+=0.02;
            }
            else {
                systemScale=1;
            }
            document.getElementById('mainContainer').style.cssText='-webkit-transform:scale('+systemScale+');';
        }
        else if(evt.wheelDelta<0){
            console.log(systemScale);
            if(systemScale>0.4){
                systemScale-=0.02;
            }
            else {
                systemScale=0.4;
            }
            document.getElementById('mainContainer').style.cssText='-webkit-transform:scale('+systemScale+');';
        }
    }
};