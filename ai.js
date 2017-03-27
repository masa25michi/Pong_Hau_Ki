var aicircles = null;
var blankElementId = 3;

function isNextValid(turn, blankElement){ //if there is a possible next move for this ||| //0000ff = blue 
	var flags = [];
	blankElementId = parseInt(blankElement.id[6]);

	//push all the turn color into flags[] array
	[].forEach.call(aicircles, function(circle) { 
		var context = circle.getContext('2d');
		if (context.fillStyle == turn){
			flags.push(circle);
		}
	});
	// console.log(flags);

	for (var i = 0; i<flags.length; i++){
		var flag = flags[i];
		var nextMoves = nextPossibleMoves(parseInt(flag.id[6]));
		// console.log(nextMoves+"::BLANK "+blankElementId);
		for(var j = 0; j<nextMoves.length; j++){
			if(nextMoves[j] == blankElementId){
				return flag;
			}
		}
	}

	return null;

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
function setCircles(circles){
	aicircles = circles;
}