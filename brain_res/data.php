<?php

	function add_foo( $foo, $color_code, $ident ){

		static $colors = [
			"black" 	=> [ 0, [ 30,  30, 30 ] ],
			"grey" 		=> [ 0, [ 225, 225, 225 ] ],
			"orange" 	=> [ 0, "nosym" ],
			"red" 		=> [ 0, [ 225, 200, 200 ] ],
			"blue" 		=> [ 0, [ 210, 210, 220 ] ],
			"green" 	=> [ 0, [ 220, 235, 225 ] ],
		];
		
		static $total_files = 0 ;
		
		$data = null;
$coma = ",
". $ident . "" ;

		$foo_length = count( $foo );
		
		for( $i = 0 ; $i < $foo_length ; $i ++ ){
			
			$target = substr( $foo[ $i ], strrpos( $foo[ $i ], "/" ) + 1 );
			$name = $target ;
			
			if( strrpos( $target, "_" ) >= 1 ){
				$name = substr( $target, 0, strrpos( $target, "_") );
				$color_code = substr( $target, strrpos( $target, "_") + 1);
				
				if( strrpos( $target, "." ) >= 1 ){
					$color_code = substr( $target, strpos( $target, "_") + 1, strlen( $target ) - strpos( $target, ".") - 1 );
				}
				
			}
			
			$color = $colors[ $color_code ][ 1 ];
			
			if( $color_code != "orange" ){
				
				$c = count( $color );
				for( $j = 0 ; $j < $c ; $j  ++ ){
					$nc = $colors[ $color_code ][ 1 ][ $j ] - ( $colors[$color_code][ 0 ] * 10 );
					if( $nc < 0 )
						$nc = $colors[ $color_code ][ 1 ][ $j ] + ( $colors[$color_code][ 0 ] * 10 );
						
					$color[ $j ] = $nc ;
				}
				
				$colors[ $color_code ][ 0 ] ++ ;
			
			}
			
			$color = json_encode( $color );
			
			$children = "null";
			
			if( is_dir( $foo[ $i ]) ){
				
				$foo[ $i ] .= '/';
				$sub_foo = glob( $foo[ $i ] . "*" ) ;
			
				if( count( $sub_foo ) <= 0 ){
					$children = "'empty'";
				}else{
					$n_ident = $ident . "    ";
					$children_content = add_foo( $sub_foo, $color_code, $n_ident )[ 0 ];
					$children = "[\n" . $n_ident . $children_content . "\n" . $ident . "]"; 
				}
				
			} else {
				
				$name = substr( $target, 0, strrpos( $target, ".") );
				if( strrpos( $name, "_" ) >= 1 ){
					$name = substr( $name, 0, strrpos( $name, '_'));
				}
				$total_files ++ ;
			
			}
			
			if( $i == $foo_length - 1 ){
				$coma = '';
			}
			
$data .= "{
" . $ident . "name: '" . $name . "',
" . $ident . "color: " . $color . ",
" . $ident . "url: '" . $foo[ $i ] . "',
" . $ident . "object: null,
" . $ident . "children: " . $children . "
" . $ident . "}" . $coma ;
				
		}
		
		return [ $data, $total_files ] ;

	}
	
	$data = add_foo( glob( $dir_app . "data/*" ), "black", "    " );
	$txt = "var data = { infos: " . $data[ 1 ] . ",  forPapez: [ 'hippocampus', 'mt', 'AM' ], objets: [
" . $data[ 0 ] . "
	]}";

	$file = $dir_app . "data.js";
	file_put_contents( $file, utf8_encode( $txt ) );
