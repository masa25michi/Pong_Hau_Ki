<?php
$request = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
if($request !== 'xmlhttprequest') exit;
header('Content-Type: application/json');
$jsonUrl = 'players.json';

// Get Data from client and encode to json data
$obj = $_POST['json'];
$jsonInputData=json_decode($obj, true);

$inputName = $jsonInputData["playerName"];

$tempPlayerArr = array(
	"playerName" => $inputName,
	"numWin" => $jsonInputData["numWin"],
	"lat" => $jsonInputData["lat"],	
	"lng" => $jsonInputData["lng"]
);

$data[$inputName] = $tempPlayerArr;
$jsonData = json_encode($data,JSON_PRETTY_PRINT);

//Get Json file 
$jsonStr = file_get_contents($jsonUrl, true);
$data_in_array = json_decode($jsonStr, true);

if(strlen($jsonStr)<50){
	file_put_contents($jsonUrl, $jsonData);
	echo $jsonData;
}else {
	if(array_key_exists($inputName, $data_in_array))
	{
		//update existed information
		$data_in_array[$inputName]['numWin'] = $data_in_array[$inputName]['numWin']+ $jsonInputData['numWin'];
		$data_in_array[$inputName]['lat'] = $jsonInputData['lat'];
		$data_in_array[$inputName]['lng'] = $jsonInputData['lng'];
	}
	else{
		$data_in_array[$inputName] =$tempPlayerArr;
	}

	$finalJsonData = json_encode($data_in_array,JSON_PRETTY_PRINT);
	file_put_contents($jsonUrl, $finalJsonData);

	echo $finalJsonData;
}

?>