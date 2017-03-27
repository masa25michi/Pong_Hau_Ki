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
var playerName = "";
var waitingWords = "Please Wait Opponent Player";

var phpNotifyPlayerReady = null;
var blankElementId = 3;
var isMyTurn = false;

var isBoardChanged = true;

var againstName = "";
var isOver = false;

var myLatitude = 22.31;
var myLongitude = 114.18;


function initialize(){
    $('#mapButton').click(function() {
        var jsonDataFromServer = null;
        $('#Menu').hide();
        $('#map_canvas').show();
        $('#back').show();
        window.onbeforeunload = function () {
            // blank function do nothing
        }

        var inputData = {
            "playerName": playerName,
            "numWin" :0,
            "lat": myLatitude,
            "lng": myLongitude,
        };
        var jsonData=JSON.stringify(inputData);

        $.ajax({
            type: "POST",
            url: "mapLoginServer.php",
            dataType : "json",
            scriptCharset: 'utf-8',
            data: {json: jsonData},
            success: function(data){
                jsonDataFromServer = data;

                //Mapping
                var mapOptions = {
                    zoom: 5,
                    center: new google.maps.LatLng(myLatitude,  myLongitude)
                };
                var map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);

                var southWest = new google.maps.LatLng(22.30, 114.17 );
                var northEast = new google.maps.LatLng(22.315, 114.185 );

                var bounds = new google.maps.LatLngBounds(southWest, northEast);
                map.fitBounds(bounds);
                //check if is there any players' information
                var playerExist = false;
                var players =[];
                var numWins =[];
                for (var key in jsonDataFromServer) {
                    if(jsonDataFromServer[key]["playerName"]){
                        playerExist = true;
                        players.push(jsonDataFromServer[key]["playerName"]);
                        numWins.push(jsonDataFromServer[key]['numWin']);
                    }
                }
                if(playerExist==false){
                    alert("There is no player registered");
                }else{
                var infowindow = new google.maps.InfoWindow();
                var i = 0;
                for (var key in jsonDataFromServer) {
                    if (jsonDataFromServer.hasOwnProperty(key)) {
                        var nameTemp = jsonDataFromServer[key]["playerName"];
                        var numTemp = jsonDataFromServer[key]["numWin"];
                        var latTemp = jsonDataFromServer[key]["lat"];
                        var lngTemp = jsonDataFromServer[key]["lng"];
                    }
                    if(nameTemp){
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(latTemp, lngTemp),
                            map: map,
                            title: nameTemp
                        });

                        
                        // process multiple info windows
                        (function(marker, i) {
                            // add click event
                            var contents = "<p>Player Name: "+nameTemp+"<br />Number of Win: "+numTemp+"</p>";
                            google.maps.event.addListener(marker, 'click', function() {
                                infowindow = new google.maps.InfoWindow({
                                content: contents
                            });
                            infowindow.open(map, marker);
                            });
                        })(marker, i);
                    }
                    
                }}

            }
        }).fail(function(XMLHttpRequest, textStatus, errorThrown){
            alert(errorThrown);
            clearInterval(phpNotifyPlayerReady);
        });

                
    });
}

function restartOnclickFunction(){
    var tempGameOverClass = document.getElementsByClassName('GameOver');
    tempGameOverClass[0].style.display = 'none'; //hide the game over class
    createInitialBoard();
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
function onloadFunction(){
    
    //hide the game over class
    var tempGameOverClass = document.getElementsByClassName('GameOver');
    tempGameOverClass[0].style.display = 'none'; 
    document.getElementById('board').style.display = 'none';
    document.getElementById('stop').style.display = 'none';
    document.getElementById('refresh').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    $('#waitingAgainst').hide();
    $('#map_canvas').hide();
    $('#playingWaitingAgainst').hide();
    $('#back').hide();
    window.onbeforeunload = function(e) {
        var inputData = {
            "isOver": isOver,
            "refresh": true,
            "turn" : null,
            "playerName": null,
            "colorSide" : null,
            "initialPosition": null,
            "lastPosition": null,
            "position1" : null,
            "position2" : null,
            "position3" : null,
            "position4" : null,
            "position5" : null
        };
        var jsonData=JSON.stringify(inputData);
        //Ajax with PHP
        $.ajax({
            type: "POST",
            url: "playgameServer.php",
            dataType : "text",
            // Content-type : "application/json", 
            data: {json: jsonData},
            success: function(data){}
        }).fail(function(XMLHttpRequest, textStatus, errorThrown){
            alert(errorThrown);
            clearInterval(phpNotifyPlayerReady);
        });

        $.post( "loginServer.php", { inputName: playerName,
            inputColor: playerColor, inputRefresh: "true" } ).done(function( data ) {
                console.log(data );
        });
        e.returnValue = "Are you sure you close the game?";
        return "Are you sure you close the game?";
    };
    
}
function areYouReadyFunction(){
    colors=[];
    playerName = $('#playerName').val();
    $('#waitingAgainst').show();
    
    updatePlayerInfor(0);
    phpNotifyPlayerReady = setInterval(ajaxPlayerReadyFunction, 1000);
}
function ajaxPlayerReadyFunction(){
    $('#waitingAgainst').html(waitingWords);
    waitingWords += ".";
    if(waitingWords.length == 31){
        waitingWords = "Please Wait Opponent Player";
    }

    //Ajax with PHP
    $.ajax({
        type: "POST",
        url: "loginServer.php",
        dataType : "text",
        scriptCharset: 'utf-8',
        data: {
            inputName: playerName,
            inputColor: playerColor, 
            inputRefresh:"false"   
        },
        success: function(data){
            // console.log(data);
            if(data == "true"){
                clearInterval(phpNotifyPlayerReady);
                setTimeout(createInitialBoard, 1000);
            }else{
                if(data === "colorError"){
                    clearInterval(phpNotifyPlayerReady);
                    alert("Sorry "+codeToName(playerColor)+" is already selected.");
                    window.onbeforeunload = function () {}
                    location.reload();
                }
            }
        }
    }).fail(function(XMLHttpRequest, textStatus, errorThrown){
        alert(errorThrown);
        clearInterval(phpNotifyPlayerReady);
    });
}
function updatePlayerInfor(isWin){
    //get map and player infor from server
    myLatitude = $('#latitude').val();
    myLongitude = $('#longitude').val();

    var inputData = {
        "playerName": playerName,
        "numWin" :isWin,
        "lat": myLatitude,
        "lng": myLongitude,
    };
    var jsonData=JSON.stringify(inputData);

    $.ajax({
        type: "POST",
        url: "mapLoginServer.php",
        dataType : "json",
        scriptCharset: 'utf-8',
        data: {json: jsonData},
        success: function(data){
            // console.log("numWin: "+data[playerName]['numWin']);
        }
    }).fail(function(XMLHttpRequest, textStatus, errorThrown){
        alert(errorThrown);
        clearInterval(phpNotifyPlayerReady);
    });
}
function createInitialBoard(){
    $.post( "loginServer.php", { inputName: playerName,
        inputColor: playerColor, inputRefresh: "true" } ).done(function( data ) {
            console.log(data);
    });
    $('#playingWaitingAgainst').show();
    $('#Menu').hide();
    $('#board').show();
    $('#stop').show();
    $('#stop').attr("disabled", false);
    $('#refresh').show();
    $('#restart').show();

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

    changeDraggable(0);
    phpNotifyPlayerReady = setInterval(ajaxPlayFunction, 1000);
}
function ajaxPlayFunction(){
    if(isMyTurn==false){
        $('#playingWaitingAgainst').html(waitingWords);
        waitingWords += ".";
        if(waitingWords.length == 31){
            waitingWords = "Please Wait Opponent Player";
        }
    }else{
        $('#playingWaitingAgainst').html("Your Turn!");
    }

    if(isChanged){ //tell server what I have changed
        isChanged = false;
        isBoardChanged = false;
        var inputData = {
            "isOver": isOver,
            "refresh": false,
            "turn" : true,
            "playerName": playerName,
            "colorSide" : playerColor,
            "initialPosition": blankElement.id,
            "lastPosition": src.id,
            "position1" : circles[0].getContext('2d').fillStyle,
            "position2" : circles[1].getContext('2d').fillStyle,
            "position3" : circles[2].getContext('2d').fillStyle,
            "position4" : circles[3].getContext('2d').fillStyle,
            "position5" : circles[4].getContext('2d').fillStyle
        };
        var jsonData=JSON.stringify(inputData);

        //Ajax with PHP
        $.ajax({
            type: "POST",
            url: "playgameServer.php",
            dataType : "json",
            // Content-type : "application/json", 
            data: {json: jsonData},
            success: function(data){
                againstName = data[playerName]['enemyName'];
                console.log("Changed: "+data[playerName]['turn']);
                if(data[playerName]['turn'] == false){
                    changeDraggable(0);
                    isMyTurn = false;
                }
                
            }
        }).fail(function(XMLHttpRequest, textStatus, errorThrown){
            alert(errorThrown);
            clearInterval(phpNotifyPlayerReady);
        });

    }else{ //ask server I am waiting

        
        var inputData = {
            "isOver": isOver,
            "refresh": false,
            "turn" : false,
            "playerName": playerName,
            "colorSide" : playerColor,
            "initialPosition": null,
            "lastPosition": null,
            "position1" : circles[0].getContext('2d').fillStyle,
            "position2" : circles[1].getContext('2d').fillStyle,
            "position3" : circles[2].getContext('2d').fillStyle,
            "position4" : circles[3].getContext('2d').fillStyle,
            "position5" : circles[4].getContext('2d').fillStyle
        };
        var jsonData=JSON.stringify(inputData);

        //Ajax with PHP
        $.ajax({
            type: "POST",
            url: "playgameServer.php",
            dataType : "json",
            // Content-type : "application/json", 
            data: {json: jsonData},
            success: function(data){
                console.log("Unchanged: "+data[playerName]['turn']);
                againstName = data[playerName]['enemyName'];
                if(data[playerName]['turn']==true){
                    changeDraggable(1);
                    isMyTurn = true;
                    if(isBoardChanged==false){
                        console.log("Changed");
                        setTimeout(updateBoard(data), 1000);
                        isBoardChanged = true;
                        checkGameOver(playerColor);
                    }
                }else{
                    changeDraggable(0);
                    isMyTurn = false;
                    isBoardChanged = false;
                }
                
            }
        }).fail(function(XMLHttpRequest, textStatus, errorThrown){
            alert(errorThrown);
            clearInterval(phpNotifyPlayerReady);
        });
    }
        
}
function updateBoard(dataFromServer){
    var index = 1;
    
    [].forEach.call(circles, function(circle) {
        changeCanvasColor(circle, dataFromServer['board']['position'+index]);
        // console.log(circle.getContext('2d').fillStyle);
        if(circle.id == dataFromServer[againstName]['initialPosition']){
            blankElement = circle;
        }
        index++;
    });
    console.log("SERVER: "+dataFromServer['Side']['isOver']);
    if(dataFromServer['Side']['isOver']){
        setTimeout(checkGameOver(playerColor), 1000);
        // checkGameOver(playerColor);
    }
}
function handleDragStart(event) {
    event.dataTransfer.effectAllowed = 'move';
    
    var context = this.getContext('2d');
    context.beginPath();
    var color = context.fillStyle;
    context.closePath();
    event.dataTransfer.setData("text", color);

    src = this;
    // isChanged = false;

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
    if(context.fillStyle == "#ffffff"|| context.fillStyle!=playerColor){
        return true;
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
        src = this;
        checkGameOver(AgainstColor);

        isChanged = true;
    }

    return false;
}
function handleDragEnd(event) {
    if(isChanged==false){
        return true;
    }else if(playerColor == colors[count%2]){
        return true;
    }
    
    /*

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
    */
    /*
    if(isOnePlayer==true){
        return aiMove(srcCircle, turn);
    }else{
        return false;
    }*/
    
}
function checkGameOver(colorName){
    console.log("checking: "+colorName+" "+isNextValid(colorName));
    if (isNextValid(colorName)==false){
        var winnerColor = colorName;
        var winnerName = "";
        isOver = true;

        var tempGameOverClass = document.getElementsByClassName('GameOver');
        var tempGameOver = tempGameOverClass[0];
        if(colorName =="#0000ff") winnerColor = "#ff0000";
        else{winnerColor = "#0000ff";}

        if(colorName == playerColor) {
            waitingWords ="Oh You loose!";
            winnerName = againstName;
        }
        else{
            winnerName = playerName;
            waitingWords="Congratulation You Win!";
            //update Player Infor
            updatePlayerInfor(1);
        }
        
        document.getElementById('whowin').style.color = winnerColor;
        document.getElementById('whowin').innerHTML = "Game Over! " +winnerName+" WIN!";

        tempGameOver.style.display = 'block';
        changeDraggable(0);
        document.getElementById("stop").disabled = true;
        document.getElementById('refresh').style.display = 'block';
        setTimeout(function(){
            clearInterval(phpNotifyPlayerReady);
            $('#playingWaitingAgainst').html(waitingWords);
        }, 1500);
        
        
        
    }
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
		case 1: return "blue";
		case 2: return "red";
		case 3: return "white";
		case 4: return "blue";
		case 5: return "red";
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
function isNextValid(colorName){ //if there is a possible next move for this ||| //0000ff = blue 
    var flags = [];
    blankElementId = parseInt(blankElement.id[6]);

    //push all the turn color into flags[] arrays
    [].forEach.call(circles, function(circle) { 
        var context = circle.getContext('2d');
        if (context.fillStyle == colorName){
            flags.push(circle);
        }
    });

    for (var i = 0; i<flags.length; i++){
        var flag = flags[i];
        var nextMoves = nextPossibleMoves(parseInt(flag.id[6]));

        for(var j = 0; j<nextMoves.length; j++){
            if(nextMoves[j] == blankElementId){
                console.log(blankElementId);
                return true;
            }
        }
    }
    return false;
}
function nextPossibleMoves(id){
    var oneCircle = new Array(2, 3, 4); 
    var twoCircle = new Array(1,3,5);  
    var threeCircle = new Array(1,2,4,5); 
    var fourCircle = new Array(1,3); 
    var fiveCircle = new Array(3,2); 

    switch(id){
        case 1: return oneCircle;
        case 2: return twoCircle;
        case 3: return threeCircle;
        case 4: return fourCircle;
        case 5: return fiveCircle;
        default: return; 
    }
}
google.maps.event.addDomListener(window, 'load', initialize);