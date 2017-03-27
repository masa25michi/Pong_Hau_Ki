<?php
$request = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
if($request !== 'xmlhttprequest') exit;
header('Content-Type: application/json');
$jsonUrl = 'board.json';

// Get Data from client
$obj = $_POST['json'];
$jsonInputData=json_decode($obj, true);

// print($obj);
$needRefresh = $jsonInputData["refresh"];
if($needRefresh){
	file_put_contents($jsonUrl, "");
}else{

$inputName = $jsonInputData["playerName"];

$tempPlayerArr = array(
	"turn" => true,
	"playerName" => $inputName,
	"colorSide" => $jsonInputData["colorSide"],	
	"initialPosition" => $jsonInputData["initialPosition"],
	"lastPosition" => $jsonInputData["lastPosition"],
	"enemyName" =>null
);
$tempBoardPosArr = array(
	"position1" => $jsonInputData["position1"],
    "position2" => $jsonInputData["position2"],
    "position3" => $jsonInputData["position3"],
    "position4" => $jsonInputData["position4"],
    "position5" => $jsonInputData["position5"]
);
$tempPlayerSide = array(
	"whooseTurn" => $inputName,
	"whooseNotTurn" => null,
	"isOver" =>$jsonInputData["isOver"]
);

$data[$inputName] = $tempPlayerArr;
$data["board"] = $tempBoardPosArr;
$data["Side"] = $tempPlayerSide;

$jsonData = json_encode($data,JSON_PRETTY_PRINT);

//Get Json file 
$jsonStr = file_get_contents($jsonUrl, true);
$data_in_array = json_decode($jsonStr, true);

// echo '<pre>' . print_r($data_in_array, true) . '</pre>'; //print contents of json file

//Inputing data
//json file not exist, or content is empty

// echo strlen($jsonStr);

if(strlen($jsonStr)<100){
	file_put_contents($jsonUrl, $jsonData);
	echo $jsonData;
}else {
	if(array_key_exists($inputName, $data_in_array))
	{
		//update existed information
		$data_in_array[$inputName]['turn'] = $jsonInputData['turn'];
		$data_in_array[$inputName]['playerName'] = $inputName;
		$data_in_array[$inputName]['colorSide'] = $jsonInputData['colorSide'];
		$data_in_array[$inputName]['initialPosition'] =$jsonInputData['initialPosition'];
		$data_in_array[$inputName]['lastPosition'] = $jsonInputData['lastPosition'];

	}
	else{
		$data_in_array[$inputName] =$tempPlayerArr;
	}

	//Processing Data
	//find enemy player name
	$enemyName =null;
	foreach($data_in_array as $key => $jsons) { //foreach element in $arr
	    if((array_key_exists("playerName", $jsons))){
	    	if($jsons["playerName"]!=$inputName){
	    		$enemyName = $jsons["playerName"];
	    	} 
	    }
	}
	$data_in_array[$inputName]['enemyName'] = $enemyName;
	//whoose turn?
	if( ($data_in_array[$inputName]['turn']==true) and !(is_null($data_in_array['Side']['whooseTurn']))) { 
		if(($data_in_array[$inputName]['playerName'] == $data_in_array['Side']['whooseTurn'])
		and !(is_null($data_in_array[$inputName]['lastPosition']))){
			$data_in_array['Side']['whooseTurn'] = $enemyName;
			$data_in_array['Side']['whooseNotTurn'] = $inputName;
			$data_in_array[$inputName]['turn'] = false;

			$data_in_array['board']['position1'] = $jsonInputData["position1"];
			$data_in_array['board']['position2'] = $jsonInputData["position2"];
			$data_in_array['board']['position3'] = $jsonInputData["position3"];
			$data_in_array['board']['position4'] = $jsonInputData["position4"];
			$data_in_array['board']['position5'] = $jsonInputData["position5"];

			$data_in_array['Side']['isOver'] = $jsonInputData["isOver"];
		}
	}
	//elseif($data_in_array[$inputName]['turn']==true)){
	// 	$data_in_array['Side']['whooseTurn'] = $enemyName;
	// 	$data_in_array[$inputName]['turn'] = false;
	// }
	elseif(is_null($data_in_array['Side']['whooseTurn']) and ($data_in_array[$inputName]['turn']==false)){
		if(is_null($data_in_array['Side']['whooseNotTurn'])){
			$data_in_array[$inputName]['turn']= true;
			$data_in_array['Side']['whooseTurn'] = $inputName;
		}
	}
	// elseif(!(is_null($data_in_array['Side']['whooseTurn'])) and is_null($data_in_array['Side']['whooseNotTurn'])){
	// 	$data_in_array[$inputName]['turn']= false;
	// 	$data_in_array['Side']['whooseNotTurn'] = $inputName;
	// }
	elseif(($data_in_array['Side']['whooseTurn'] == $inputName)and
			($data_in_array[$inputName]['turn'] == false)){
		$data_in_array[$inputName]['turn'] = true;
	}
	elseif(($data_in_array['Side']['whooseTurn'] == $inputName) and
		($data_in_array[$inputName]['turn']==true) and
		(is_null($data_in_array[$inputName]['lastPosition']))){
		$data_in_array[$inputName]['turn']==true;
	}
	elseif(is_null($data_in_array['Side']['whooseTurn']) and 
		$data_in_array['Side']['whooseNotTurn'] != $inputName){
		$data_in_array['Side']['whooseTurn'] = $inputName;
	}
	else{
		if($data_in_array['Side']['whooseNotTurn'] == $inputName){
			$data_in_array[$inputName]['turn']= false;
		}
	}

	$finalJsonData = json_encode($data_in_array,JSON_PRETTY_PRINT);
	file_put_contents($jsonUrl, $finalJsonData);

	echo $finalJsonData;
	
}
}
?>