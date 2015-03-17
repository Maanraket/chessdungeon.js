var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

var board = {
	gridsize: 8,
	intialize: function(){
		rectwidth = ctx.canvas.width/this.gridsize;
		rectheight = ctx.canvas.height/this.gridsize;
		rectcolor = false;
		for(var i=0;i<this.gridsize;i++){
			if(this.gridsize % 2 === 0) rectcolor=!rectcolor;
			for(var j=0;j<this.gridsize;j++){
				if(rectcolor)
					ctx.fillStyle='black';
				else
					ctx.fillStyle='white';
				ctx.fillRect(i*rectwidth,j*rectheight,rectwidth,rectheight);
				rectcolor=!rectcolor;
			}
		}
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
				move = [x, y];
				curmoves.push(move);
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
		rectwidth = ctx.canvas.width/board.gridsize;
		rectheight = ctx.canvas.height/board.gridsize;
		ctx.fillStyle='blue';
		for(var i = 0; i < this.moves.length; i++){
			sx=this.moves[i][0];
			sy=this.moves[i][1];
			//draw that shit!
			ctx.beginPath();
			ctx.arc(sx*rectwidth+rectwidth/2,sy*rectheight+rectheight/2,rectheight/4,0,2*Math.PI);
			ctx.fill();

		}
	}
}

setPiece = function(piece,posx,posy){
	board.intialize();
	character.piece = piece;
	character.pos = {x:posx, y:posy};
	character.findMoves();
	character.draw();
}

setPiece('knight',3,3);



