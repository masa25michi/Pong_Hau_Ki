var src = null;
var circles = null; //array of five circles
var lines = null;
var count = 0;
var colors =[];
var blankElement = null;
var playerColor = null;
var AgainstColor = null;
var flagSide = 1;//1 == player; 0 == ai
var isChanged = false;
var isOnePlayer = false;
var setTimeInterval = null;

function restartOnclickFunction(){
    var tempGameOverClass = document.getElementsByClassName('GameOver');
    tempGameOverClass[0].style.display = 'none'; //hide the game over class
    createBoard();
}
function stopOnclickFunction(){
    var tempGameOverClass = document.getElementsByClassName('GameOver');
    var tempWhowinId = document.getElementById('whowin');
    var tempCloseId = document.getElementById('refresh');

    tempGameOverClass[0].style.display = 'block';

    tempWhowinId.style.color = "black";
    tempWhowinId.innerHTML = "Game Over!";
    changeDraggable(0);

    tempCloseId.style.display = 'block';
    document.getElementById("stop").disabled = true;
}
function refreshOnclickFunction(){
    location.reload();
}
function blueOnclickFunction(){
    playerColor = "#0000ff"; //blue
    AgainstColor = "#ff0000"; //red
    document.getElementById('StartMenu').style.display = 'none';
    areYouReadyFunction();
}
function redOnclickFunction(){
    playerColor = "#ff0000"; //red
    AgainstColor = "#0000ff"; //blue
    document.getElementById('StartMenu').style.display = 'none';
    areYouReadyFunction();
}
function startButtonOnclickFunction(){
    var tempBoardId = document.getElementById('board');
    var tempAreYouReadyId = document.getElementById('areYouReady');
    var tempStopId = document.getElementById('stop');
    var tempRestartId = document.getElementById('restart');
    document.getElementById('Menu').style.display='none';

    tempBoardId.style.display = 'block';
    tempAreYouReadyId.style.display = 'none';
    tempStopId.style.display = 'block';
    tempRestartId.style.display = 'block';
}

function onePlayerOnclickFunction(){
    document.getElementById('chooseSide').style.display = 'block';
    document.getElementById("oneTwoPlayer").remove();
    // console.log(document.getElementById('chooseSide'));
    isOnePlayer = true;
}
function twoPlayerOnclickFunction(){
    isOnePlayer = false;
    document.getElementById("oneTwoPlayer").remove();
    document.getElementById('playersNameColor').style.display = 'block';
    var playerNameA = document.getElementById('nameA').value;
    var playerNameB = document.getElementById('nameB').value;
}
function twoPlayerChooseSideFunction(){
    setTimeInterval=setInterval(function(){
        var playerName = document.getElementById('nameA').value;
        document.getElementById('twoPlayerChooseSideWords').innerHTML = playerName+"! Please choose your color!";
    },500);
}
function onloadFunction(){
    //hide the game over class
    var tempGameOverClass = document.getElementsByClassName('GameOver');
    tempGameOverClass[0].style.display = 'none'; 
    // var tempBoardId = document.getElementById('board');
    // var tempAreYouReadyId = document.getElementById('areYouReady');
    // var tempStopId = document.getElementById('stop');
    // var tempCloseId = document.getElementById('refresh');
    // var tempRestartId = document.getElementById('restart');
    document.getElementById('playersNameColor').style.display = 'none';
    document.getElementById('chooseSide').style.display = 'none';
    document.getElementById('board').style.display = 'none';
    document.getElementById('areYouReady').style.display = 'none';
    document.getElementById('stop').style.display = 'none';
    document.getElementById('refresh').style.display = 'none';
    document.getElementById('restart').style.display = 'none';

    twoPlayerChooseSideFunction();
};
function areYouReadyFunction(){
    colors=[];
    window.clearInterval(setTimeInterval);
    if(isOnePlayer==true){
        document.getElementById('areYouReadyWords').innerHTML = "Ok! You are "+codeToName(playerColor)+". Are You Ready?";
    }else{
        document.getElementById('areYouReadyWords').innerHTML = "Ok! "+"<b>"+document.getElementById('nameA').value+"</b>"+
        " is<span style='color:"+codeToName(playerColor)+"';> "+codeToName(playerColor)+"</span>. And <b>"+
        document.getElementById('nameB').value+"</b> is <span style='color:"+codeToName(AgainstColor)+";'>"+codeToName(AgainstColor)+"</span>. <br><br>"+
        "<b>"+document.getElementById('nameA').value+"</b>"+"! You start first! Are You Ready?";
    }
    //set colors Player do first and AI do second
    colors.push(playerColor);
    colors.push(AgainstColor);
    createBoard();  
    document.getElementById('areYouReady').style.display = 'block';
}

function createBoard(){
    document.getElementById("stop").disabled = false;
	var index = 1;

    //draw circles
	circles = document.querySelectorAll('.myCircle');
    [].forEach.call(circles, function(circle) {
        circle.addEventListener('dragstart', handleDragStart,false);
        circle.addEventListener('dragenter', handleDragEnter,false);
        circle.addEventListener('dragover', handleDragOver,false);
        circle.addEventListener('drop', handleDrop,false);
        circle.addEventListener('dragend', handleDragEnd,false);

        var context = circle.getContext('2d');
        var centerX = circle.width / 2;
        var centerY = circle.height / 2;
        var radius = 22;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = getInitialColorSetting(index);
        context.fill();
        context.stroke();
        context.closePath();
        if(index==3){
            blankElement = circle;
        }
        index++;
    });

    //draw lines
    lines = document.querySelectorAll('.myLine');
    [].forEach.call(lines, function(line){
        var ctx = line.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(300, 150);
        ctx.moveTo(300, 0);
        ctx.lineTo(0,150);
        ctx.strokeStyle="white";
        ctx.stroke();
    });

    changeDraggable(1);

    setCircles(circles);
}
function handleDragStart(event) {
    event.dataTransfer.effectAllowed = 'move';
    
    var context = this.getContext('2d');
    context.beginPath();
    var color = context.fillStyle;
    context.closePath();
    event.dataTransfer.setData("text", color);

    src = this;
    isChanged = false;

    return true;
}
function handleDragEnter(event) {
    if (event.preventDefault) {
        event.preventDefault(); // Allows us to drop.
    }
    return true;
}
function handleDragOver(event) {
    //check whether the circile is white, if yes then block to do dragging
    var context = src.getContext('2d');
    if(isOnePlayer==true && (context.fillStyle == "#ffffff" || context.fillStyle!=playerColor)){
        return true;
    }else{
        if(context.fillStyle == "#ffffff" ||context.fillStyle!=colors[count%2]){
            return true;
        }
    }
    if (event.preventDefault) {
        event.preventDefault(); // Allows us to drop.
    }

    event.dataTransfer.dropEffect = 'move';

    return true;
}
function handleDrop(event) {
    var context = this.getContext('2d');
    if(context.fillStyle != "#ffffff"){
        return true;
    }
    if (event.stopPropagation) {
        event.stopPropagation();
    }

    if (src != this) {
        count++;

        blankElement = src;
        changeCanvasColor(src, context.fillStyle);
        changeCanvasColor(this, event.dataTransfer.getData('text'));
        isChanged = true;
    }

    return false;
}
function handleDragEnd(event) {
    if(isChanged==false){
        return true;
    }else if(isOnePlayer&&(playerColor == colors[count%2])){
        return true;
    }
    //whose turn next?
    var turn = colors[(count%2)];
    // console.log(blankElement);  
    var srcCircle = isNextValid(turn, blankElement); //the circle can move next
    
    if (srcCircle == null){
        // var tempWhowinId = document.getElementById('whowin');
        var tempGameOverClass = document.getElementsByClassName('GameOver');
        var tempGameOver = tempGameOverClass[0];

        turn = colors[(++count%2)];
        if(turn == "#0000ff"){
            var winner = "Blue";
        } else{
            var winner = "Red";
        }
        
        document.getElementById('whowin').style.color = winner;
        document.getElementById('whowin').innerHTML = "Game Over! " + winner+" WIN!";

        tempGameOver.style.display = 'block';
        changeDraggable(0);
        document.getElementById("stop").disabled = true;
        document.getElementById('refresh').style.display = 'block';
        return true;
    }
    if(isOnePlayer==true){
        return aiMove(srcCircle, turn);
    }else{
        return false;
    }
    
}
function aiMove(srcCircle, turn){
    var context = srcCircle.getContext('2d');
    if(context.fillStyle == playerColor){
        return true;
    }
    else{
        var tempGameOverClass = document.getElementsByClassName('GameOver');
        var tempGameOver = tempGameOverClass[0];

        changeCanvasColor(srcCircle, "white");
        changeCanvasColor(blankElement, turn);
        blankElement = srcCircle;
        count++;
        if(isNextValid(turn, blankElement)==null){
            turn = colors[(++count%2)];
            if(turn == "#0000ff"){
                var winner = "Blue";
            } else{
                var winner = "Red";
            }
            document.getElementById('#whowin').style.color = winner;
            document.getElementById('#whowin').innerHTML = "Game Over! " + winner+" WIN!";
            tempGameOver.style.display = 'block';
            changeDraggable(0);
            document.getElementById("stop").disabled = true;
            document.getElementById('refresh').style.display = 'block';
        }
    }
    return false;

}
function changeDraggable(boolNum){
    if(boolNum ==1){
        var bool = true;
    }else{
        var bool = false;
    }
    [].forEach.call(circles, function(circle) {
        circle.draggable = bool;
    });
}
function getInitialColorSetting(index){
	var value = parseInt(index);
	switch(value){
		case 1: 
		case 2: return "red";
		case 3: return "white";
		case 4: 
		case 5: return "blue";
	}
}
function changeCanvasColor(element, newColor){
    var context = element.getContext('2d');
    var centerX = element.width / 2;
    var centerY = element.height / 2;
    var radius = 22;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = newColor;
    context.fill();
    context.stroke();
    context.closePath();
}
function codeToName(colorname){
    if(colorname == "#0000ff"){
        return "blue";
    }else{
        return "red";
    }
}
function nameToCode(colorname){
    if(colorname = "blue"){
        return "#0000ff";
    }
    else{
        return "#ff0000";
    }
}
