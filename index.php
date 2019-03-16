<?php 

	$dir_app = "brain_res/";
	$dir_lib = $dir_app . "lib/";
	
	$print_less = false;
	$print_data = false;
	
	if( $print_less ){
		
		require( $dir_lib . "less/lessc.inc.php" );
		$less = new lessc;
		$less->compileFile( $dir_app . "input.less", $dir_lib . "less/style.css" );
		
	}

?>

<!DOCTYPE html>

<html>
<head>
	<meta charset="UTF-8">
	<meta content="width=device-width, maximum-scale=1.0, minimum-scale=1.0" name="viewport">
	<title>BrainSet</title>
	<link rel="stylesheet" href="<?php echo $dir_lib . "less/style.css"; ?>" type="text/css" media="screen">
	
	<?php 
	
		//echo ' <script type="text/javascript" src="http://debug.edgeinspect.adobe.com/target/target-script-min.js#28DD0350-ED73-45D3-A363-99AB9A4448D9"></script>
		//echo '<script type="text/javascript" src="http://livejs.com/live.js"></script>'; 
	
	?>
	
</head>
<body>

	<div id="three"></div>
	<div id="infos">
		<div id="focus"></div>
		<div id="menu"></div>
		<div id="mentions">scientific supervisor: MD., Ph.D. D.Hasboun; source: Atlas of Human Brain, J.K. Mai.</div>
	</div>
	

	<?php
	//	echo '<div id="safeframe"></div>'; 
	//	echo '<div id="stats"></div>'; 
	?>
	
	<?php
		
		if( $print_data ){
			require( $dir_app . 'data.php' );
		}
		
		$js_dirs = array(
			glob( $dir_lib . "js/*"),
			glob( $dir_app . "*.js")
		);
		
		foreach( $js_dirs as $dir ){
			foreach( $dir as $file ){
				echo '<script type="text/javascript" src="' . $file . '"></script>';
			}
		}

	
	?>
	
</body>
</html>
