window.onload = function () {
    
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blosSize = 30;
    var ctx;
    var delay = 100;
    var xCoord = 0;
    var yCoord = 0;
    var snakee;
    var applee; 
    var widthInBlocks = canvasWidth/blosSize;
    var heightInBlocks = canvasHeight/blosSize;
    var score;
    var timeOut;
    
    init();
    
    function init (){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#DDD"
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4]], "right" );
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
        
    }
    
    function refreshCanvas(){
        
        snakee.advance();
        
        if(snakee.checkCollision()){
            gameOver();
        }else{
            if(snakee.isEatingApple(applee)){
                snakee.eatApple = true;
                score ++;
                do{
                    applee.setNewPosition();
                }while(applee.isOnSnake(snakee));
            }
            ctx.clearRect(0,0, canvasWidth,canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeOut = setTimeout(refreshCanvas,delay);
        }
    }
    
    function drawBlock(ctx,position){
        var x = position[0] * blosSize;
        var y = position[1] * blosSize;
        
        ctx.fillRect(x,y,blosSize,blosSize);
    }
    
    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.textBaseline = "middle";
        ctx.strokeText("GAME OVER", centreX, centreY- 180 );
        ctx.fillText("GAME OVER", centreX, centreY- 180 );
        ctx.font = "bold 30px sans-serif"
        ctx.strokeText("Appuyer sur Espace pour rejouer", centreX, centreY- 120 );
        ctx.fillText("Appuyer sur Espace pour rejouer", centreX, centreY-120);
        
        ctx.restore();
    }
    
    function restart(){
        snakee = new Snake([[6,4],[5,4],[4,4]], "right" );
        applee = new Apple([10,10]);  
        score = 0;
        clearTimeout(timeOut);       
        refreshCanvas();  
    }
    
    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.fillText(score.toString(), centreX, centreY);
        
        ctx.restore();
    }
    
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.eatApple = false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle="#FF0000";
            for(var i =0; i<body.length;i++){
                drawBlock(ctx, this.body[i]);   
            }
            ctx.restore();
        };
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            
            switch(this.direction){
                    
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                case "down":
                    nextPosition[1]++;
                    break;
                default:
                    throw("Invalid Direction");
            }
            
            
            this.body.unshift(nextPosition);
            if(!this.eatApple){
                this.body.pop();
            }else{
                this.eatApple = false;
            }
        };
        
        this.setDirection = function(newDirection){
            var allowedDirection;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "up":
                case "down":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDirection.indexOf(newDirection)> -1){
                this.direction = newDirection;
            }
        };
        
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            
            if(isNotBetweenHorizontalWalls ||isNotBetweenVerticalWalls){
                wallCollision = true;
            }
            
            for(var i=0; i < rest.length; i++){
                
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }
            
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true;
            }else return false;
        };
    }
    
    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33CC33";
            ctx.beginPath();
            var radius = blosSize/2;
            var x = this.position[0]*blosSize+radius;
            var y = this.position[1]*blosSize+radius;
            ctx.arc(x,y,radius, 0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){
            var newX = Math.round(Math.random()* (widthInBlocks-1));
            var newY = Math.round(Math.random()* (heightInBlocks-1));
            this.position = [newX,newY];
            
        };
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            
            for(var i=0; i< snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] &&this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake=true;
                }
            }
            return isOnSnake;
        };
    }
    
    
    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
                break;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}