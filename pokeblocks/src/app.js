
var HelloWorldLayer = cc.Layer.extend({
	sprite:null,
	blocks:[],
	b_sp:[],
	lifeg:[],
	stage:null,
	mytype:1,
	change:null,
	speed:5,
	item:0,
	itemt:null,
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();

		this.basic_score=0;
		this.stage=0;
		this.tempsp=2;
		
		this.background = new cc.Sprite("res/xy10.png")
		this.background.setOpacity(95);
		this.background.x = this.width/2;
		this.background.y = this.height/2;
		this.background.scaleX = 0.7;
		this.background.scaleY = 0.7;
		this.addChild(this.background);
		
		this.box = new cc.Sprite("res/bar.png");
		this.box.scaleX = 1;
		this.box.scaleY = 1;
		this.box.x = this.width/2;
		this.box.y = 50;
		
		this.addChild(this.box);
		
		if(this.stage==0)
		{this.stage0();}
		else if(this.stage==1)
		{this.teststage();}
		else if(this.stage==2)
		{this.stage3();}
	
		this.ball = new cc.Sprite("res/images.png")
		this.ball.x = this.width/2;
		this.ball.y = this.height/2;
		this.ball.scaleX = 0.5;
		this.ball.scaleY = 0.5;
		var initialDirection = Math.random(2*Math.PI);
		this.ball.speedX = this.speed*Math.cos(initialDirection);
		this.ball.speedY = this.speed*Math.sin(initialDirection);
		this.addChild(this.ball);
		
		this.change = new cc.MenuItemImage("res/type"+this.mytype+".png","res/type"+this.mytype+".png",this.changetype, this);
		this.change.attr({
			x: this.width-40,
			y: 80,
			anchorX: 0.5,
			anchorY: 0.5
		});
		this.menu1 = new cc.Menu(this.change);
		this.menu1.x = 0;
		this.menu1.y = 0;
		this.addChild(this.menu1, 1);
		
		
		var eventListener = cc.EventListener.create({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches:true,
			onTouchBegan:function(){
				return true;
			},
			onTouchMoved:function(touch,event){
				event.getCurrentTarget().box.x=touch.getLocationX();
				return true;
			}
		});
		cc.eventManager.addListener(eventListener, this);

		var score = new cc.LabelTTF(this.basic_score,'Times New Roman', 32, cc.size(40,32), cc.TEXT_ALIGNMENT_LEFT); 
		score.x=this.width-40;
		score.y=30;
		this.addChild(score);
		
		this.update = function(dt)//레이어 업데이트 써줌 매프레임마다 실행
		{
			
			var boxTop = this.box.y+this.box.getBoundingBox().height/2;
			var ballBottom = this.ball.y-this.ball.getBoundingBox().height/2;
			if(ballBottom>boxTop&&ballBottom+this.ball.speedY<boxTop){
				var xOnBox = this.ball.x+(boxTop+this.ball.getBoundingBox().height/2-this.ball.y)*this.ball.speedX/(this.ball.speedY);
				var boxLeft = this.box.x-this.box.getBoundingBox().width/2;
				var boxRight = this.box.x+this.box.getBoundingBox().width/2;
				if(xOnBox>boxLeft&&xOnBox<boxRight){
					this.ball.speedY *=-1;      			
					this.ball.y=2*(boxTop+this.ball.getBoundingBox().height/2)-this.ball.y;

					var alpha = Math.atan2(this.ball.speedY,this.ball.speedX);
					alpha+=0.01*(this.box.x-xOnBox);
					this.ball.speedX = this.speed*Math.cos(alpha);
					this.ball.speedY = this.speed*Math.sin(alpha);
				}
			}
			
			if(this.stage==2)
			{
				
				cc.log(this.blocks[7*3+1].x);
				this.blocks[7*3+1].x=this.blocks[7*3+1].x+this.tempsp;
				this.blocks[7*3+6].x=this.blocks[7*3+6].x+this.tempsp;
				if(this.blocks[7*3+1].x-this.blocks[7*3+1].getBoundingBox().width/2<0){
					this.tempsp=2;
				}
				else if(this.blocks[7*3+1].x+this.blocks[7*3+1].getBoundingBox().width/2>800){
					cc.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					this.tempsp=-2;
				}


			}
			
			if(this.item!=0)
			{
				this.itemt.y-=3;
				if(this.itemt.x>this.box.x-this.getBoundingBox().width/2&&
						this.itemt.x<this.box.x+this.getBoundingBox().width/2)
				if(this.itemt.y-this.itemt.getBoundingBox().height/2<this.box.y+this.box.getBoundingBox().height/2){
					if(this.item==1){
						this.speed=this.speed*1.3;
					}
					else{
						this.speed=this.speed*0.7;
						}
					this.removeChild(this.itemt);
					this.item=0;
				}
			}
		
			for(var i=0;i<this.blocks.length/7;i++){
				if(this.blocks[7*i]){
					//블록 충돌부분-위아래
					if(this.ball.x>this.blocks[7*i+1].x-this.blocks[7*i+1].getBoundingBox().width/2
							&&this.ball.x<this.blocks[7*i+1].x+this.blocks[7*i+1].getBoundingBox().width/2){
						if(this.ball.y+this.ball.getBoundingBox().height/2>this.blocks[7*i+1].y-this.blocks[7*i+1].getBoundingBox().height/2
								&&this.ball.y-this.ball.getBoundingBox().height/2<this.blocks[7*i+1].y-this.blocks[7*i+1].getBoundingBox().height/2){//아래 충돌
							if(this.ball.speedY>0){
								this.ball.y=2*(this.blocks[7*i+1].y-this.blocks[7*i+1].getBoundingBox().height/2- this.ball.getBoundingBox().height/2)-this.ball.y;
								this.ball.speedY*=-1;
								
								var damage = 1;
								if(this.mytype==this.blocks[7*i+5]+1){damage=2;}
									
								if(this.blocks[7*i+4]-damage<=0){
									if(this.blocks[7*i+1+2]==1){
										this.blocks[7*i+1-1]=false;
										this.blocks[7*i+1].setVisible(false);
										this.blocks[7*i+6].setVisible(false);
									}
									else{
										this.blocks[7*i+1+2]-=1;
										this.blocks[7*i+1].initWithFile("res/dec46.png");
										this.blocks[7*i+4]=4;
										this.blocks[7*i+6].initWithFile("res/life"+this.blocks[7*i+4]+".png");
									}
									this.basic_score+=this.blocks[7*i+3]*5;
									score.setString(this.basic_score);
									

									var rann=Math.floor((Math.random() * 3) + 1);
									cc.log(rann);
									if(rann==1){
										this.removeChild(this.itemt);
										this.itemt = new cc.Sprite("res/spup.png")
										this.itemt.x = this.blocks[7*i+1].x;
										this.itemt.y = this.blocks[7*i+1].y;
										this.itemt.scaleX = 0.5;
										this.itemt.scaleY = 0.5;
										this.addChild(this.itemt);
										this.item=1;
									}
									if(rann==2){
										this.removeChild(this.itemt);
										this.itemt = new cc.Sprite("res/spdw.png")
										this.itemt.x = this.blocks[7*i+1].x;
										this.itemt.y = this.blocks[7*i+1].y;
										this.itemt.scaleX = 0.5;
										this.itemt.scaleY = 0.5;
										this.addChild(this.itemt);
										this.item=2;
									}
									
								}
								else
								{
									
									this.blocks[7*i+4]-=damage;
									this.blocks[7*i+6].initWithFile("res/life"+this.blocks[7*i+4]+".png");
									
									
								}
								

							}
						}
						if(this.ball.y-this.ball.getBoundingBox().height/2<this.blocks[7*i+1].y+this.blocks[7*i+1].getBoundingBox().height/2
								&&this.ball.y+this.ball.getBoundingBox().height/2>this.blocks[7*i+1].y+this.blocks[7*i+1].getBoundingBox().height/2){//위충돌
							if(this.ball.speedY<0){
								this.ball.y=2*(this.blocks[7*i+1].y+this.blocks[7*i+1].getBoundingBox().height/2+this.ball.getBoundingBox().height/2)-this.ball.y;
								this.ball.speedY*=-1; 
								var damage = 1;
								if(this.mytype==this.blocks[7*i+5]+1){damage=2;}
								if(this.blocks[7*i+4]-damage<=0){
									if(this.blocks[7*i+1+2]==1){
										this.blocks[7*i+1-1]=false;
										this.blocks[7*i+1].setVisible(false);
										this.blocks[7*i+6].setVisible(false);
									}
									else{
										this.blocks[7*i+1+2]-=1;
										this.blocks[7*i+1].initWithFile("res/dec46.png");
										this.blocks[7*i+4]=4;
										this.blocks[7*i+6].initWithFile("res/life"+this.blocks[7*i+4]+".png");
									}
									this.basic_score+=this.blocks[7*i+3]*5;
									score.setString(this.basic_score);

									var rann=Math.floor((Math.random() * 3) + 1);
									cc.log(rann);
									if(rann==0){
										this.itemt = new cc.Sprite("res/spup.png")
										this.itemt.x = this.blocks[7*i+1].x;
										this.itemt.y = this.blocks[7*i+1].y;
										this.itemt.scaleX = 0.5;
										this.itemt.scaleY = 0.5;
										this.addChild(this.itemt);
										this.item=1;
									}
									if(rann==1){
										this.itemt = new cc.Sprite("res/spdw.png")
										this.itemt.x = this.blocks[7*i+1].x;
										this.itemt.y = this.blocks[7*i+1].y;
										this.itemt.scaleX = 0.5;
										this.itemt.scaleY = 0.5;
										this.addChild(this.itemt);
										this.item=2;
									}
								}
								else
								{
									this.blocks[7*i+4]-=damage;
									this.blocks[7*i+6].initWithFile("res/life"+this.blocks[7*i+4]+".png");
								}

							}
						}
						
					}
					//블록 충돌부분-오른쪽왼쪽
					if(this.ball.y>this.blocks[7*i+1].y-this.blocks[7*i+1].getBoundingBox().height/2
							&&this.ball.y<this.blocks[7*i+1].y+this.blocks[7*i+1].getBoundingBox().height/2){
						if(this.ball.x+this.ball.getBoundingBox().width/2>this.blocks[7*i+1].x-this.blocks[7*i+1].getBoundingBox().width/2
								&&this.ball.x-this.ball.getBoundingBox().width/2<this.blocks[7*i+1].x-this.blocks[7*i+1].getBoundingBox().width/2){//왼쪽 충돌
							if(this.ball.speedX>0){
								this.ball.X=2*(this.blocks[7*i+1].x-this.blocks[7*i+1].getBoundingBox().width/2- this.ball.getBoundingBox().width/2)-this.ball.x;
								this.ball.speedX*=-1; 
								var damage = 1;
								if(this.mytype==this.blocks[7*i+5]+1){damage=2;}
								if(this.blocks[7*i+4]-damage<=0){
									if(this.blocks[7*i+1+2]==1){
										this.blocks[7*i+1-1]=false;
										this.blocks[7*i+1].setVisible(false);
										this.blocks[7*i+6].setVisible(false);
									}
									else{
										this.blocks[7*i+1+2]-=1;
										this.blocks[7*i+1].initWithFile("res/dec46.png");
										this.blocks[7*i+4]=4;
										this.blocks[7*i+6].initWithFile("res/life"+this.blocks[7*i+4]+".png");
									}
									this.basic_score+=this.blocks[7*i+3]*5;
									score.setString(this.basic_score);
									

									var rann=Math.floor((Math.random() * 3) + 1);
									cc.log(rann);
									if(rann==0){
										this.itemt = new cc.Sprite("res/spup.png")
										this.itemt.x = this.blocks[7*i+1].x;
										this.itemt.y = this.blocks[7*i+1].y;
										this.itemt.scaleX = 0.5;
										this.itemt.scaleY = 0.5;
										this.addChild(this.itemt);
										this.item=1;
									}
									if(rann==1){
										this.itemt = new cc.Sprite("res/spdw.png")
										this.itemt.x = this.blocks[7*i+1].x;
										this.itemt.y = this.blocks[7*i+1].y;
										this.itemt.scaleX = 0.5;
										this.itemt.scaleY = 0.5;
										this.addChild(this.itemt);
										this.item=2;
									}
								}
								else
								{
									this.blocks[7*i+4]-=damage;
									this.blocks[7*i+6].initWithFile("res/life"+this.blocks[7*i+4]+".png");
								}

							}
						}
						if(this.ball.x-this.ball.getBoundingBox().width/2<this.blocks[7*i+1].x+this.blocks[7*i+1].getBoundingBox().width/2
								&&this.ball.x+this.ball.getBoundingBox().width/2>this.blocks[7*i+1].x+this.blocks[7*i+1].getBoundingBox().width/2){//오른쪽 충돌
							if(this.ball.speedX<0){
								this.ball.x=2*(this.blocks[7*i+1].x+this.blocks[7*i+1].getBoundingBox().width/2+this.ball.getBoundingBox().width/2)-this.ball.x;
								this.ball.speedX*=-1; 
								var damage = 1;
								if(this.mytype==this.blocks[7*i+5]+1){damage=2;}
								if(this.blocks[7*i+4]-damage<=0){
									if(this.blocks[7*i+1+2]==1){
										this.blocks[7*i+1-1]=false;
										this.blocks[7*i+1].setVisible(false);
										this.blocks[7*i+6].setVisible(false);
									}
									else{
										this.blocks[7*i+1+2]-=1;
										this.blocks[7*i+1].initWithFile("res/dec46.png");
										this.blocks[7*i+4]=4;
										this.blocks[7*i+6].initWithFile("res/life"+this.blocks[7*i+4]+".png");
									}
									this.basic_score+=this.blocks[7*i+3]*5;
									score.setString(this.basic_score);
									
									var rann=Math.floor((Math.random() * 3) + 1);
									cc.log(rann);
									if(rann==0){
										this.itemt = new cc.Sprite("res/spup.png")
										this.itemt.x = this.blocks[7*i+1].x;
										this.itemt.y = this.blocks[7*i+1].y;
										this.itemt.scaleX = 0.5;
										this.itemt.scaleY = 0.5;
										this.addChild(this.itemt);
										this.item=1;
									}
									else if(rann==1){
										this.itemt = new cc.Sprite("res/spdw.png")
										this.itemt.x = this.blocks[7*i+1].x;
										this.itemt.y = this.blocks[7*i+1].y;
										this.itemt.scaleX = 0.5;
										this.itemt.scaleY = 0.5;
										this.addChild(this.itemt);
										this.item=2;
									}
								}
								else
								{
									this.blocks[7*i+4]-=damage;
									this.blocks[7*i+6].initWithFile("res/life"+this.blocks[7*i+4]+".png");
								}

								
							}
						}
					}   	
				}
				else{}
			} 
			var clear=true;
			for(var i=0;i<this.blocks.length/7;i++){
				if(this.blocks[i*7]==true){
					clear=false
				}
			}
			if(clear){
				this.stage++;
				if(this.stage==0)
				{this.stage0();}
				else if(this.stage==1)
				{this.teststage();}
				else if(this.stage==2)
					{this.stage3();}
				
			}
			this.ball.x += this.ball.speedX;
			this.ball.y += this.ball.speedY; 
			if(this.ball.x<this.ball.getBoundingBox().width/2){
				this.ball.speedX = -this.ball.speedX;
				this.ball.x=this.ball.getBoundingBox().width-this.ball.x;
			}
			if(this.ball.x>this.width-this.ball.getBoundingBox().width/2){
				this.ball.speedX = -this.ball.speedX;
				this.ball.x=2*(this.width-this.ball.getBoundingBox().width/2)-this.ball.x;
			}
			if(this.ball.y<this.ball.getBoundingBox().height/2){
				this.ball.speedY = -this.ball.speedY; 
				this.ball.y=2*(this.ball.getBoundingBox().height/2)-this.ball.y;

				this.stage=0;
				this.stage0();
				this.speed=5;
				this.basic_score=0;
				score.setString(this.basic_score);
				
				this.ball.x=this.width/2;
				this.ball.y=this.height/2;
			}
			if(this.ball.y>this.height-this.ball.getBoundingBox().height/2){
				this.ball.speedY = -this.ball.speedY;
				this.ball.y=2*(this.height- this.ball.getBoundingBox().height/2)-this.ball.y;
			}
		}
		this.scheduleUpdate();
		return true;
	},
	teststage:function(){
		this.removeChild(this.background);
		this.background = new cc.Sprite("res/xy10.png")
		this.background.setOpacity(95);
		this.background.x = this.width/2;
		this.background.y = this.height/2;
		this.background.scaleX = 0.7;
		this.background.scaleY = 0.7;
		this.addChild(this.background);
		
		var blockn=this.blocks.length;
		for(var i=0;i<blockn;i++){
			if(i%7==1){this.removeChild(this.blocks[i]);};
			if(i%7==6){this.removeChild(this.blocks[i]);};
		}
		for(var i=0;i<blockn;i++){
			this.blocks.pop();
		}

		for(var i=0;i<10;i++){
			var dexnum;			var level;			var life;			var potype;

			if(i%3==0){
				var n=1;
				this.b_sp[i]= new cc.Sprite("res/dec"+n+".png");
				dexnum=1;				level=1;
				life=4;				potype=0;
				this.lifeg[i]=new cc.Sprite("res/life4.png");
			}
			else if(i%3==1){
				this.b_sp[i]= new cc.Sprite("res/dec25.png");
				dexnum=25;				level=1;
				life=4;				potype=6;				
				this.lifeg[i]=new cc.Sprite("res/life4.png");
			}
			else {
				this.b_sp[i]= new cc.Sprite("res/dec47.png");
				dexnum=47;				level=2;
				life=4;				potype=5;
				this.lifeg[i]=new cc.Sprite("res/life4.png");
			}
			this.b_sp[i].x=((i*150)+120)%this.width;
			this.lifeg[i].x=((i*150)+120)%this.width;
			if(i<5){this.b_sp[i].y=this.height-30; this.lifeg[i].y=this.height-30+this.b_sp[i].height;}
			else{this.b_sp[i].y=this.height-80; this.lifeg[i].y=this.height-80+this.b_sp[i].height;}
			this.b_sp[i].scaleX = 1.5;
			this.b_sp[i].scaleY = 1.5;
			this.lifeg[i].scaleX=1.5;
			this.lifeg[i].scaleY=1;
			this.addChild(this.b_sp[i]);this.addChild(this.lifeg[i]);
			this.blocks.push(true,this.b_sp[i],dexnum,level,life,potype,this.lifeg[i]);
		}
	},
	stage0:function(){
		this.removeChild(this.background);
		this.background = new cc.Sprite("res/xy10.png")
		this.background.setOpacity(95);
		this.background.x = this.width/2;
		this.background.y = this.height/2;
		this.background.scaleX = 0.7;
		this.background.scaleY = 0.7;
		this.addChild(this.background);
		
		var blockn=this.blocks.length;
		cc.log(this.blocks.length);
		for(var i=0;i<blockn;i++){
			if(i%7==1){this.removeChild(this.blocks[i]);};
			if(i%7==6){this.removeChild(this.blocks[i]);};
		}
		for(var i=0;i<blockn;i++){
			this.blocks.pop();
		}

		for(var i=0;i<7;i++){
			var dexnum;			var level;			var life;			var potype;

			if(i%3==0){
				dexnum=1;	
				this.b_sp[i]= new cc.Sprite("res/dec"+dexnum+".png");
				level=1;				life=4;				potype=0;
				this.lifeg[i]=new cc.Sprite("res/life4.png");
			}
			else if(i%3==1){
				dexnum=4;	
				this.b_sp[i]= new cc.Sprite("res/dec"+dexnum+".png");
				level=1;				life=4;				potype=1;				
				this.lifeg[i]=new cc.Sprite("res/life4.png");
			}
			else {
				dexnum=7;
				this.b_sp[i]= new cc.Sprite("res/dec"+dexnum+".png");
				level=1;				life=4;				potype=2;
				this.lifeg[i]=new cc.Sprite("res/life4.png");
			}
			this.b_sp[i].x=((i*220)+220)%this.width;
			this.lifeg[i].x=((i*220)+220)%this.width;
			if(i<3){this.b_sp[i].y=this.height-30; this.lifeg[i].y=this.height-30+this.b_sp[i].height;}
			else{this.b_sp[i].y=this.height-80; this.lifeg[i].y=this.height-80+this.b_sp[i].height;}
			this.b_sp[i].scaleX = 1.5;
			this.b_sp[i].scaleY = 1.5;
			this.lifeg[i].scaleX=1.5;
			this.lifeg[i].scaleY=1;
			this.addChild(this.b_sp[i]);this.addChild(this.lifeg[i]);
			this.blocks.push(true,this.b_sp[i],dexnum,level,life,potype,this.lifeg[i]);
		}
	},
	changetype:function(){
		this.mytype=(this.mytype+1)%3;
		this.removeChild(this.menu1);
		
		this.change = new cc.MenuItemImage("res/type"+this.mytype+".png","res/type"+this.mytype+".png",this.changetype, this);
		this.change.attr({
			x: this.width-40,
			y: 80,
			anchorX: 0.5,
			anchorY: 0.5
		});
		this.menu1 = new cc.Menu(this.change);
		this.menu1.x = 0;
		this.menu1.y = 0;
		this.addChild(this.menu1, 1);

	},
	stage3:function(){
		this.removeChild(this.background);
		this.background = new cc.Sprite("res/gray.jpg")
		this.background.setOpacity(95);
		this.background.x = this.width/2;
		this.background.y = this.height/2;
		this.background.scaleX = this.width/this.background.width;
		this.background.scaleY = this.height/this.background.height;
		this.addChild(this.background);
		
		var blockn=this.blocks.length;
		cc.log(this.blocks.length);
		for(var i=0;i<blockn;i++){
			if(i%7==1){this.removeChild(this.blocks[i]);};
			if(i%7==6){this.removeChild(this.blocks[i]);};
		}
		for(var i=0;i<blockn;i++){
			this.blocks.pop();
		}

		for(var i=0;i<4;i++){
			var dexnum;			var level;			var life;			var potype;

			if(i<3){
				dexnum=74;	
				this.b_sp[i]= new cc.Sprite("res/dec"+dexnum+".png");
				level=1;				life=4;				potype=6;
				this.lifeg[i]=new cc.Sprite("res/life4.png");
			}
			else{
				dexnum=95;	
				this.b_sp[i]= new cc.Sprite("res/dec"+dexnum+".png");
				level=1;				life=4;				potype=1;				
				this.lifeg[i]=new cc.Sprite("res/life4.png");
			}
			
			this.b_sp[i].x=((i*270)+120)%this.width;
			this.lifeg[i].x=((i*270)+120)%this.width;
			if(i<3){
				this.b_sp[i].y=this.height-110; 
				this.lifeg[i].y=this.height-110+this.b_sp[i].height;
				this.b_sp[i].scaleX = 1.5;
				this.b_sp[i].scaleY = 1.5;
				this.lifeg[i].scaleX=1.5;
			}
			else{
				this.b_sp[i].y=this.height-30;
				this.lifeg[i].y=this.height-30+this.b_sp[i].height;
				this.b_sp[i].scaleX = 2.5;
				this.b_sp[i].scaleY = 2.5;
				this.lifeg[i].scaleX=2.5;
			}

			this.lifeg[i].scaleY=1;
			this.addChild(this.b_sp[i]);this.addChild(this.lifeg[i]);
			this.blocks.push(true,this.b_sp[i],dexnum,level,life,potype,this.lifeg[i]);
		
		}
	}

});

var HelloWorldScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	}
});

