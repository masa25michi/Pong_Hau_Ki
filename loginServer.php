<?php
	if(isset($_POST['inputName']) && !empty($_POST['inputName'])){
		$inputName = $_POST['inputName'];
	}
	if(isset($_POST['inputColor']) && !empty($_POST['inputColor'])){
		$color = $_POST['inputColor'];
	}
	if(isset($_POST['inputRefresh']) && !empty($_POST['inputRefresh'])){
		$inputRefresh = $_POST['inputRefresh'];
	}
	
	$fileName = "login_log.txt";
	// $isNameSame = true;
	$isColorSame = true;
	$isSamePlayer = true;

	$inputData = $inputName." ".$color;

	if(strcmp($inputRefresh, "true")==0){
		file_put_contents($fileName, "");
		echo "Refreshed";
	}else{
		if (filesize($fileName)==0){
			$myfile = fopen($fileName,  "w") or die("Unable to open file!");
			fwrite($myfile, $inputData."\r\n");
			fclose($myfile);
		}else{
			$myfile = fopen($fileName, "r") or die("Unable to open file!");
			while(($line = fgets($myfile)) !== false){
				$line = str_replace(array("\r", "\n"), '',$line);
				// echo $line;
			    if(strcmp($line, $inputData)!=0){ //if not same
			    	$isSamePlayer = false;
			    	if(strpos($line, $color)!==false){
				    	$isColorSame = true;
					}else{
						if((strpos($line, $inputName)===false)){
							// echo "OKOK";
					    	$isColorSame = false;
					    	// $isNameSame = false;
					    	break;
						}
					}
			    }else{
			    	//They are same
					$isSamePlayer = true;
			    }
			}
			fclose($myfile);
		}
		
		if(($isSamePlayer==false) and ($isColorSame==false)){
			file_put_contents($fileName, $inputData."\r\n", FILE_APPEND);
			
			echo "true";
		}else{
			if(($isColorSame == true) and ($isSamePlayer==false)){
				echo "colorError";
			}else{
				echo "false";
			}
		}
	}

	

?>