if( typeof ctr === "undefined" ){
	
	var ctr = {
		
		init: function(){
		
			view.init()		
			ctr.reg.collectData()
	
		},
		
		reg: {
			
			collectData: function(){
				
				data.anim = []
				var searchPapez = data.objets[ 0 ].children
				var papezIndex = null
				for( var i = 0, c = searchPapez.length ; i < c ; i ++ ) {
					
					if( searchPapez[ i ].name == "papez circuit" ){
						
						papezIndex = i 
						break
						
					}
					
				}
				
				var searchAnim = data.objets[ 0 ].children[ papezIndex ].children
				var animIndex = null
				
				for( var i = 0, c = searchAnim.length ; i < c ; i ++ ){
				
					if( searchAnim[ i ].name == "anim" ){
						
						animIndex = i 
						break
						
					}
					
				}
				
				var diggAnim = data.objets[ 0 ].children[ papezIndex ].children[ animIndex ].children
				
				for( var i = 0, c = diggAnim.length ; i < c ; i ++ ){
					
					data.anim.push( diggAnim[ i ].children.length )
					
				}
				
				view.animArrays = data.anim
				
			},
			
			saveAndTake: function( objsInfos, objDel, arrayName, action ){
				
				if( typeof action === "undefined" )
					action = "let"
	
				for( var i = 0, c = objsInfos.length; i < c ; i ++ ){
					
					var remember = {
						name: objsInfos[ i ].name,
						geom: objsInfos[ i ].geometry,
						mat: objsInfos[ i ].material.color,
						data: objsInfos[ i ].userData,
					}
					
					
					
					if( typeof data[ arrayName ] === "undefined" )
						data[ arrayName ] = []
					
					data[ arrayName ].push( remember )
					
					if( action == "take" )
						view.scene.remove( objDel[ i ] )
					
				}
				
				
			},
			
			extract: function( arrayBrut, arrayClean ){
				
				for( var i = 0, c = arrayBrut.length ; i < c ; i ++ ){

					if( arrayBrut[ i ].lastChild.nodeName == "SPAN"){
						
						arrayClean.push( arrayBrut[ i ].lastChild.textContent )
					
						
					} else if( arrayBrut[ i ].lastChild.nodeName == "UL" ){
						
						arrayClean.concat( ctr.reg.extract( arrayBrut[ i ].lastChild.childNodes, arrayClean ))
						
					}
				
				}
				
				return arrayClean
				
			},
			
			seekAndPut: function( listObj, arraySrc ){
				
				if( typeof data[ arraySrc ] == "undefined" )
					data[ arraySrc ] = []

				data.waiting = []
				
				for( var i = 0, c = listObj.length ; i < c ; i ++ ){
					
					for( var j = 0, d = data[ arraySrc ].length ; i < c ; i ++ ){
						
						if( data[ arraySrc ][ j ].name == listObj[ i ] ){
							
							var called = {
								name: data[ arraySrc ][ j ].name,
								geom: data[ arraySrc ][ j ].geom,
								mat: data[ arraySrc ][ j ].mat,
								data: data[ arraySrc ][ j ].data,
							}
					
							data.waiting.push( called )
							
						}
						
					}
					
				}
				
				ctr.reg.putAndFlush( "waiting" )

			},
			
			putAndFlush: function( arrayName ){
					
				if( typeof data[ arrayName ] === "undefined" )
				data[ arrayName ] = []
				
				for( var i = 0, c = data[ arrayName ].length ; i < c ; i ++ ){
					
					var r = data[ arrayName ][ i ].mat.r * 255
					var v = data[ arrayName ][ i ].mat.g * 255
					var b = data[ arrayName ][ i ].mat.b * 255
					var color = [ r, v, b ]
					
					if( data[ arrayName ][ i ].data.side == "papez" ){
						
						view.scene.add( view.loading.shapng( color, "autoillu", data[ arrayName ][ i ].geom, data[ arrayName ][ i ].name, data[ arrayName ][ i ].data.side ) )
						
						
					}else{
						
						view.scene.add( view.loading.groupng( color, data[ arrayName ][ i ].geom, data[ arrayName ][ i ].name, data[ arrayName ][ i ].data.side ) )
					}
				}
				
				data[ arrayName ] = []	

			},
			
			filter: function( arrayName ){
					
					if( typeof data[ arrayName ] === "undefined" )
						return false
					
					var c = data[ arrayName ].length
					
					var filterInfos = []
					var filterObjs = []
					
					view.scene.traverse( function(e){
					
						if( e instanceof THREE.Group && e.type == "Group" ){
							
							for( var i = 0 ; i < c ; i ++ ){
								
								if( e.name == data[ arrayName ][ i ] ){
									
										filterObjs.push( e )

										var infos = {
											
											name: e.name,
											geometry: e.children[ 0 ].geometry,
											material: e.children[ 0 ].material,
											userData: e.userData,
											
										}
										
										filterInfos.push( infos )
										break
									
								}
								
							}
							
						}
							
					})
					
					ctr.reg.saveAndTake( filterInfos, filterObjs, "papezRemoved", "take" )
				
			},
			
			traverseScene: function( key, val, type ){
				
				var rememberInfos = []
				var removeObjs = []
				
				if( type == "Group" ){
					
					view.scene.traverse( function(e){
						if( e instanceof THREE.Group && e.userData[ key ] == val && e.type == type ){
							
							removeObjs.push( e )
							
							var infos = {
								
								name: e.name,
								geometry: e.children[ 0 ].geometry,
								material: e.children[ 0 ].material,
								userData: e.userData,
								
							}
							
							rememberInfos.push( infos )
							
						}
					})	
					
				} else if( type = "Mesh" ){
					
					view.scene.traverse( function(e){
						if( e instanceof THREE.Mesh && e.userData[ key ] == val && e.type == type ){
							
							removeObjs.push( e )
							rememberInfos.push( e )
							
						}
					})	
	
				}

				ctr.reg.saveAndTake( rememberInfos, removeObjs, val + "Removed", "take" )
				
			}
			
		},
		
		list: {
			
			deploy: function(){

				view.loading.listLength = data.infos;
		
				view.loading.title = data.objets[ 0 ].name
				
				view.loading.start()
				
				var newUl = document.createElement( "ul" );
				document.getElementById( "menu" ).appendChild( newUl )
				ctr.list.process( data.objets[ 0 ].children, 0, newUl )
				
			},
			
			process: function( foo, i, parent, callbackProcess ){
				
				if( callbackProcess === undefined ){

					callbackProcess = function(){
						
						view.loading.over()
						
					}
					
				}
				
				var symmetry = true
				
				if( foo[ i ].color == "nosym" )
					symmetry = false
				
				if( foo[ i ].children == null ){
					
					if( foo[ i ].color != "nosym" )
						var newLi = view.menu.createAndAdd( "li", parent, foo[ i ].name, foo[ i ].color )
					
					if( i < foo.length - 1 ){
						
						var oldCallbackProcess = callbackProcess
						
						var newCallback = function(){
							
							ctr.list.process( foo, i + 1, parent, oldCallbackProcess )
						}
						
						callbackProcess = newCallback
					}
					
					view.loading.put( foo[ i ].name, foo[ i ].url, foo[ i ].color, symmetry, callbackProcess )
					
				} else {
					
					var newParent = parent
					
					if( foo[ i ].color != "nosym" ){
						
						var newLi = view.menu.createAndAdd( "li", parent, foo[ i ].name, foo[ i ].color )
						var newUl = view.menu.createAndAdd( "ul", newLi, foo[ i ].name, foo[ i ].color )
						newParent = newUl
						
					}
					
					if( i < foo.length - 1 ){
						
						var oldCallbackProcess = callbackProcess
						
						var newCallback = function(){
							ctr.list.process( foo, (i + 1), parent, oldCallbackProcess )
						}
						callbackProcess = newCallback
					
					}
					
					ctr.list.process( foo[ i ].children, 0, newParent, callbackProcess )
					
				}

			}
			
		}

	}
	
}

window.addEventListener( 'load', ctr.init )