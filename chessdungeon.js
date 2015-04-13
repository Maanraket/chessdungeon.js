var _width = 300,
	_height = 300;

var stage = new PIXI.Stage(0xBADA55);
var renderer = new PIXI.autoDetectRenderer(_width,_height);
var canvas = document.body.appendChild(renderer.view);
	requestAnimFrame(animate);

var board = {
	gridsize: 8,
	margin: 20,
	rectsize: null,
	boardloc: { x: null, y: null},
	initialize: function(){
		var graphics = new PIXI.Graphics();
		var rectcolor = false;
		var boardloc, rectsize;
		if(_width>_height){
			boardloc = {
				x: (_width/2)-((_height-this.margin*2)/2),
				y: this.margin
			};
			rectsize = (_height-this.margin*2)/this.gridsize;
		} else {
			boardloc = {
				x: this.margin,
				y: (_height/2)-((_width-this.margin*2)/2)
			};
			rectsize = (_width-this.margin*2)/this.gridsize;
		};
		for(var i=0;i<this.gridsize;i++){
			if(this.gridsize % 2 === 0) rectcolor=!rectcolor;
			for(var j=0;j<this.gridsize;j++){
				var squareColor;
				if(rectcolor){
					squareColor = 0x000000;
				} else {
					squareColor = 0xFFFFFF;
				}
				graphics.beginFill(squareColor);
				graphics.drawRect(boardloc.x+(i*rectsize),boardloc.y+(j*rectsize),rectsize,rectsize);
				graphics.endFill();
				rectcolor=!rectcolor;
			}
		}
		this.rectsize = rectsize;
		this.boardloc.x = boardloc.x;
		this.boardloc.y = boardloc.y;
		stage.addChild(graphics);
		renderer.render(stage);
	}
}

var character = {
	piece: ['rook','bishop','knight','pawn','king','queen'],
	pos: {x: 0, y: 0},
	moves: [],
	findMoves: function(){
		var explore;
		var curx = this.pos.x, cury = this.pos.y;
		var curmoves = [];
		findMove = function(dx,dy){
			var x = curx, y = cury;
			while(x+dx>=0&&x+dx<board.gridsize&&y+dy>=0&&y+dy<board.gridsize){
				x += dx;
				y += dy;
				curmoves.push([x, y]);
				if(explore.single){break}
			}
		}
		if(this.piece==='rook'){
			explore=[[0,1],[1,0],[0,-1],[-1,0]];
		} else if (this.piece==='bishop'){
			explore=[[1,1],[1,-1],[-1,1],[-1,-1]];
		} else if (this.piece==='knight'){
			explore=[[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];
			explore.single = true;
		} else if (this.piece==='king'||this.piece==='queen'){
			explore=[[1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,-1],[-1,1]];
			if (this.piece==='king')
				explore.single = true;
		}
		for(var i = 0; i < explore.length; i++){
			var dx,dy;
			dx=explore[i][0];
			dy=explore[i][1];
			findMove(dx,dy);
		}
		this.moves = curmoves;
	},
	draw: function(){
		var moveGraphics = new PIXI.Graphics();
		var rectsize = board.rectsize;
		moveGraphics.beginFill(0x1919ff);
		for(var i = 0; i < this.moves.length; i++){
			sx=this.moves[i][0];
			sy=this.moves[i][1];
			//draw that shit!
			moveGraphics.drawCircle(board.boardloc.x+sx*rectsize+rectsize/2,board.boardloc.y+sy*rectsize+rectsize/2,rectsize/4);
		}
		moveGraphics.endFill;
		stage.addChild(moveGraphics);

		//mouse stuff
		var mousePos = {
			current: {x: null, y: null},
			old: {x: null, y: null} 
		}

		var getMouse = function(){
			return {
				x: stage.getMousePosition().x,
				y: stage.getMousePosition().y
			};
		}

		//load textures
		bodyImg = PIXI.Texture.fromImage("img/gary_body.png");
		headImg = PIXI.Texture.fromImage("img/gary_head.png");
		body =  new PIXI.Sprite(bodyImg);
		head =  new PIXI.Sprite(headImg);

		body.scale.x = rectsize*0.01;
		body.scale.y = rectsize*0.01;
		body.position.x = (this.pos.x)*rectsize+board.boardloc.x;
		body.position.y = (this.pos.y)*rectsize+board.boardloc.y;

		head.scale.x = rectsize*0.01;
		head.scale.y = rectsize*0.01;
		head.position.x = (this.pos.x)*rectsize+board.boardloc.x+rectsize*0.45;
		head.position.y = (this.pos.y)*rectsize+board.boardloc.y+rectsize*0.08;

		stage.addChild(body);
		stage.addChild(head);

		var x = head.position.x;
		var y = head.position.y;

		// enable the head to be interactive.. this will allow it to respond to mouse and touch events		
		head.interactive = true;
		// this button mode will mean the hand cursor appears when you rollover the head with your mouse
		head.buttonMode = true;
		
		// center the heads anchor point
		head.anchor.x = 0.5;
		head.anchor.y = 0.5;
		
		// use the mousedown and touchstart
		head.mousedown = head.touchstart = function(data){
			// store a reference to the data
			// The reason for this is because of multitouch
			// we want to track the movement of this particular touch
			this.data = data;
			this.scale.x = rectsize*0.012;
			this.scale.y = rectsize*0.012;
			this.dragging = true;
            this.sx = this.data.getLocalPosition(head).x * head.scale.x;
            this.sy = this.data.getLocalPosition(head).y * head.scale.y;
 			mousePos.current = getMouse();
            mousePos.old = mousePos.current;
        };

		// set the events for when the mouse is released or a touch is released
		head.mouseup = head.mouseupoutside = head.touchend = head.touchendoutside = function(data)
		{
			this.scale.x = rectsize*0.01;
			this.scale.y = rectsize*0.01;
			this.rotation = 0;
			this.dragging = false;
			// set the interaction data to null
			this.data = null;
		};

		// set the callbacks for when the mouse or a touch moves
		head.mousemove = head.touchmove = function(data){
			if(this.dragging){
				// need to get parent coords..
				var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x - this.sx;
                this.position.y = newPosition.y - this.sy;
                mousePos.current = getMouse();
            	console.log("mousevector.x = " + (mousePos.current.x - mousePos.old.x));
            	//do stuff with the mouse
            	if(mousePos.current.x - mousePos.old.x < 0)
            		head.rotation = -Math.PI/4;
            	else if (mousePos.current.x - mousePos.old.x === 0)
            		head.rotation = 0;
            	else
            		head.rotation = Math.PI/4;
                mousePos.old = mousePos.current;
            }
		}
		
		// move the sprite to its designated position
		head.position.x = x;
		head.position.y = y;
		
		// add it to the stage
		requestAnimFrame(animate);
	}
}

setPiece = function(piece,posx,posy){
	character.piece = piece;
	character.pos = {x:posx, y:posy};
	character.findMoves();
	character.draw();
}

var resizeHandler = function(event){
	var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = w.innerWidth || e.clientWidth || g.clientWidth,
	y = w.innerHeight|| e.clientHeight|| g.clientHeight;

	_width = x;
	_height = y;
	renderer.resize(x,y);
	board.initialize();
	setPiece('knight',3,3);
};

function animate() {
    requestAnimFrame(animate);
    // render the stage   
    renderer.render(stage);
}

window.onresize = resizeHandler;
window.onload = resizeHandler;