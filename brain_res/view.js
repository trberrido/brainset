if ( window.innerWidth === 0 ) { window.innerWidth = parent.innerWidth; window.innerHeight = parent.innerHeight; }

if( typeof view === "undefined" ){
	
	var view = {
		
		stats: null, scene: null, camera: null,	aspect: null, renderer: null, animate: null, controls: null, raycaster: null, rayCDistance: null, defaultDist: 3,
		time: { start: null, end: null }, contact: null, clock: 0, animArrays: null, 
		symmetryVisible: false, papezVisible: false, materials: [], plane: null, cL: null, composer: null, depthTarget: null, depthMaterial: null, isIframe : null,
		
		init : function(){
			
			console.log( ":)" )
			
			view.rayCDistance = view.defaultDist
			view.scene = new THREE.Scene()
			view.aspect = window.innerWidth / window.innerHeight
			view.camera = new THREE.PerspectiveCamera( 50, view.aspect, view.rayCDistance, 1000 )
			view.camera.position.x = 5
			view.camera.position.y = 1
			view.camera.position.z = 2
			
			
			
			var coord = [
				{ x : -7, y: 7, z: 0 },
				{ x : 8, y: 0, z: 0 },
				{ x : -1, y: -7, z: 0 }
			]
			
			for( var i = 0, c = coord.length ; i < c ; i ++ ){
				
				var pointColor = "#ffffff";
				var pointLight = new THREE.PointLight(pointColor);
				pointLight.distance = 8;
				pointLight.position.set( coord[ i ].x, coord[ i ].y, coord[ i ].z )
				view.scene.add(pointLight);
				
			}
			
			view.renderer = new THREE.WebGLRenderer({ antialias: true })
			
			view.renderer.setPixelRatio( window.devicePixelRatio )
			view.renderer.setSize( window.innerWidth, window.innerHeight )
			
			view.isIframe = true
			if( self == top )
				view.isIframe = false
			
			if( view.isIframe )
				view.renderer.setClearColor( new THREE.Color( 0xffffff, 0.1 ) )
			else 
				view.renderer.setClearColor( new THREE.Color( 0xffffff, 0.1 ) )
			
			view.renderer.setFaceCulling(true)
			view.renderer.shadowMapEnabled = true
		
			document.getElementById("three").appendChild( view.renderer.domElement )
			
			if( view.isIframe )
				var geometry = new THREE.BoxGeometry( 1.3, 1.3, 1.3 )
			else
				var geometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 )
			
			var material = new THREE.MeshNormalMaterial()
			
			material.transparent = true
			material.opacity = 0.8
			material.side = THREE.DoubleSide
			view.loading.cube = new THREE.Mesh( geometry, material )
			view.scene.add( view.loading.cube )
			
			view.controls = new THREE.OrbitControls( view.camera )
			view.controls.damping = 2
			
			view.animate = function(){
	
				requestAnimationFrame( view.animate )

				view.loading.cube.rotation.y += 0.1
				view.loading.cube.rotation.z += 0.1
				view.render()

			}
			
			view.raycaster = new THREE.Raycaster()
			view.contact = new THREE.Vector2()
			window.addEventListener( 'resize', view.events.resize, false )
	
			view.animate()
			
			ctr.list.deploy()
			
		},
		
		loading: {
			
			cube: null,
			listObj : null,
			listLength : 0,
			current: 0,
			percentDom: document.getElementById( "focus" ),
			lastThing: null,
			title: null,
			state: null,
			
			start: function(){
				
				var mentions = document.getElementById( "infos" )
				
				if( view.isIframe )
					mentions.className = "top_txt"
				else 
					mentions.className = "bottom_txt"
	
	
				view.loading.state = "running"
				view.loading.updatePercent()
			
				var menu = document.getElementById( "menu" )
				var nvTitle = document.createElement( "h1" )
				nvTitle.id = "menu_title"
				nvTitleTxt = document.createTextNode( view.loading.title )
				nvTitle.appendChild( nvTitleTxt )
				menu.appendChild( nvTitle )
				
				
				view.animate = function(){
				
					view.loading.cube.rotation.y += 0.1
					view.loading.cube.rotation.z += 0.1
					requestAnimationFrame( view.animate )
					TWEEN.update()
					view.render()
					
				}
				
			},
			
			over: function(){
				
				view.loading.updatePercent( 100 )
				
				view.menu.extras()
				
				var tweenCube = new TWEEN.Tween( view.loading.cube.scale )
				tweenCube.to({ x: 0, y: 0, z: 0 }, 1000 ).easing( TWEEN.Easing.Back.In )
				tweenCube.start()
				
				tweenCube.onComplete( function(){
					
					view.scene.remove( view.loading.cube )
					
					view.animate = function(){
						

						requestAnimationFrame( view.animate )
						TWEEN.update()
						view.render()
						
					}
					
					for( var i = 0, c = view.materials.length; i < c ; i ++ ){

						var tweenMat = new TWEEN.Tween( view.materials[ i ] )
						tweenMat.to({ opacity: 1 }, 1000 ).easing( TWEEN.Easing.Linear.None )
						tweenMat.start()
						if( i == c - 1 )
							view.loading.lastThing = tweenMat ;
					}
					
					view.loading.lastThing.onComplete( function(){
						
						view.animate = function(){return false}
						
						view.focusDom = document.getElementById( 'focus' )
						document.addEventListener( 'mousemove', view.events.move )
						
						view.controls.addEventListener( 'change', view.render )
						document.addEventListener( 'mousedown', view.events.timing, false )
						document.addEventListener( 'mouseup', view.events.timing, false )
						document.addEventListener( 'touchstart', view.events.timing, false )
						document.addEventListener( 'touchend', view.events.timing, false )
						
						var menuDom = document.getElementById( "menu" )
						var h1 = document.getElementById( "menu_title" )
						var lisDom = menuDom.getElementsByTagName( "li" )
						
						h1.addEventListener( "click", view.events.menu.reset, false )
						view.loading.updatePercent( "reset" )
						view.loading.state = "over"

						view.animate()
						view.render()
	
					})
				
				})
				
			},
			
			createMat: function( color, side, data ){
				var out = false 
				if( side == "outside" ){
					
					if( data == "left" ){
						var mat = new THREE.MeshBasicMaterial()
					}else{
						var mat = new THREE.MeshLambertMaterial()
						out = true
					}
					mat.side = THREE.BackSide
					
				}

				if( side == "inside" ) {
					
					if( data == "left" ){
						var mat = new THREE.MeshLambertMaterial()
						out = true
					}else{
						var mat = new THREE.MeshBasicMaterial()
					}
					mat.side = THREE.FrontSide
					
				}
				
				if( side == "autoillu" ) {
					var mat = new THREE.MeshBasicMaterial()
					mat.side = THREE.DoubleSide
				}

				mat.transparent = true
				
				if( view.loading.state != "over" )
					mat.opacity = 0.0
				
				mat.color.setRGB( color[ 0 ] / 255, color[ 1 ] / 255, color[ 2 ] / 255 )
				
				var plus = 0.02
				var moins = 0.16
				
				mat.emissive = new THREE.Color(( plus + color[ 0 ] / 255 ) -moins, plus + ( color[ 1 ] / 255 ) -moins , plus + ( color[ 2 ] / 255 ) -moins )
				
				view.materials.push( mat )
				
				return mat
				
			},
			
			shapng: function( color, skin, geometry, name, data ){
				
				var mat = view.loading.createMat( color, skin, data )
				var obj = new THREE.Mesh( geometry, mat )
				
				obj.name = name
				obj.userData = { side: data }
				
				return obj
				
			},
			
			groupng: function( color, geometry, name, data ){
				
				var grp = new THREE.Group()
				
				grp.name = name
				grp.userData = { side: data }
				
				obj1 = view.loading.shapng( color, "inside", geometry, name, data )
				obj2 = view.loading.shapng( color, "outside", geometry, name, data )
				
				grp.add( obj1 )
				grp.add( obj2 )
				
				if( data == "right" )
					grp.scale.x = -1
				
				return grp
				
			},
						
			put: function( name, url, color, symmetry, callback ){
				
				var loader = new THREE.JSONLoader()
				
				loader.load( url, function( g ){
					
					if( symmetry ){
						
						view.scene.add( view.loading.groupng( color, g, name, "left" ) )
						view.scene.add( view.loading.groupng( color, g, name, "right" ) )
						
					} else {
						
						var obj = view.loading.shapng( [ 0, 0, 0 ], "autoillu", g, name, "papez" )
						ctr.reg.saveAndTake( [ obj ], [ obj ], "papezRemoved" )						
					}

					view.loading.current ++
					view.loading.updatePercent()
					callback()
				
				})			
				
			},
			
			updatePercent: function( d ){
				
				view.loading.percentDom.innerHTML = ""
				
				if( d != "reset" ){
					
					if( typeof d === "undefined" )
						var txt = Math.round( ( view.loading.current * 100 ) / ( view.loading.listLength ) )
					else	
						var txt = d
					nD = txt + '<span class="light">%</span>'
					view.loading.percentDom.innerHTML = nD	
					
				}
				
			}
			
		},
		
		menu: {
			
			createAndAdd: function( dom, parent, txt, color, position ){
				
				if( position === undefined )
					position = "append"
				
				var txtColor = "rgb("+color[0]+","+color[1]+","+color[2]+")"
				var newDom = document.createElement( dom )
				newDom.setAttribute( "color", color )
				newDom.id = txt
				if( dom == "li"){
					newSpan = document.createElement( "span" )
					newDom.appendChild( newSpan )
					newSpan.appendChild( document.createTextNode( txt ) )
				}
				
				if( txt == "symmetry" || txt == "papez circuit"){
					if( position == "append" )
						parent.appendChild( newDom )
					else
						parent.insertBefore( newDom, parent.firstChild )
				}
				return newDom
				
			},
			
			extras: function(){

				var parent = document.getElementById( "menu").lastChild
				var symDom = view.menu.createAndAdd( "li", parent, "symmetry", [30,30,30], "insertBefore" )
				view.symmetryVisible = true
				symDom.addEventListener( "click", view.events.menu.symmetry, false )
		
				var papezDom = view.menu.createAndAdd( "li", parent, "papez circuit", [30,30,30], "insertBefore" )		
				view.papezVisible = false
				papezDom.addEventListener( "click", view.events.menu.papez, false )
				
			}
			
		},
		
		resetLi: function(){
			
			var lis = document.getElementById( "menu" ).getElementsByTagName( "li" )
			for( var i = 0, c = lis.length ; i < c ; i ++ ){
				
				lis[ i ].style.color = ""
				
			}
			
		},
		
		initStats: function(){
			view.stats = new Stats()
			view.stats.setMode( 0 )
			view.stats.domElement.style.position = 'absolute'
			view.stats.domElement.style.right = "0px"
			view.stats.domElement.style.bottom = "0px"
			document.getElementById( "stats" ).appendChild( view.stats.domElement )
			return view.stats
		},
		
		render: function(){
	
			view.renderer.render( view.scene, view.camera )
			
		},
		
		animPapez: {
			
			ids: [
				{
					file: 2,
					folder: 0
				},
				{
					file: 1,
					folder: 0
				},
				{
					file: 0,
					folder: 0
				}
			],
			
			update: function(){
					
				for( var i = 0, c = view.animPapez.ids.length ; i < c ; i ++ ){
					
					view.animPapez.ids[ i ].file ++ 
					
					if( view.animPapez.ids[ i ].file >= view.animArrays[ view.animPapez.ids[ i ].folder ] ){
						
						view.animPapez.ids[ i ].file = 0 
						view.animPapez.ids[ i ].folder ++
						
					}
					
					if( view.animPapez.ids[ i ].folder >= view.animArrays.length ){
						
						view.animPapez.ids[ i ].folder = 0
						
					}	
					
				}

			},
			
			strngf: function( d ){
				
				if( d < 10 ){
						
					d = "0" + d
					
				}
				
				return d
				
			},
			
			start: function(){
				
				view.animPapez.play = function(){
					
					if( view.papezVisible ){
						view.clock ++ 
			
						if( view.clock >= 2 ){
				
							view.clock = 0
							view.animPapez.update()
							
						}
						
						var foo0 = view.scene.getObjectByName( view.animPapez.ids[ 0 ].folder +""+ view.animPapez.strngf( view.animPapez.ids[ 0 ].file ) )
						var foo1 = view.scene.getObjectByName( view.animPapez.ids[ 1 ].folder +""+ view.animPapez.strngf( view.animPapez.ids[ 1 ].file ) )
						var foo2 = view.scene.getObjectByName( view.animPapez.ids[ 2 ].folder +""+ view.animPapez.strngf( view.animPapez.ids[ 2 ].file ) )
					
						foo0.material.opacity = 1
						foo0.material.transparent = true
						
						if( ( view.animPapez.ids[ 2 ].file + 1 ) == view.animArrays[ view.animPapez.ids[ 2 ].folder ] ||  view.animPapez.ids[ 2 ].file == 0 )					
							foo2.material.opacity = 1
						else
							foo2.material.opacity = 0
						
						foo2.renderOrder = 1
						
						foo0.material.color.setRGB( 0, 1, 1 )
						foo1.material.color.setRGB( 0, 0, 1 )
						foo2.material.color.setRGB( 0, 0, 0 )
					
						requestAnimationFrame( view.animPapez.play )
						view.render()
						
						
					} else {
						
						return false
						
					}

				}					
	
			},
			
			play: function(){},
			
			end: function(){
				
				view.animPapez.play = function(){}
				
			}
			
		},
		events : {
			
			resize: function(){
				
				view.aspect = window.innerWidth / window.innerHeight
				view.camera.aspect = view.aspect
				view.camera.updateProjectionMatrix()
				view.renderer.setSize( window.innerWidth, window.innerHeight )
				view.render()
				
			},
			
			move: function( e ){
				
				x = e.clientX
				y = e.clientY
				
				view.events.contact( x, y, "justDisplay")
				
			},
			
			menu: {
				
				papez: function(){
					
					if( view.symmetryVisible )	
						view.events.menu.symmetry()
			
					ctr.reg.putAndFlush( "leftRemoved" )
					
					ctr.reg.filter( "forPapez" )
					ctr.reg.traverseScene( "side", "left", "Group" )
					
					ctr.reg.putAndFlush( "papezRemoved" )
							

					if( view.papezVisible == false ){
						
							view.papezVisible = true	
							view.animPapez.start()
							view.animPapez.play()
						
					}
					
					view.rayCDistance = 0
					view.camera.near = 0.1
					view.camera.updateProjectionMatrix()
					
					view.render()
					
				},
				
				symmetry: function(){
					
					view.rayCDistance = view.defaultDist
					view.camera.near = view.defaultDist
					view.camera.updateProjectionMatrix()
					
					if( view.papezVisible ){
						
						view.animPapez.end()						
						ctr.reg.traverseScene( "side", "papez", "Mesh" )	
						view.papezVisible = false

					}
					
					if( view.symmetryVisible ){
						
						view.symmetryVisible = false 
						ctr.reg.traverseScene( "side", "right", "Group" )
					
					} else {
						
						view.symmetryVisible = true
						ctr.reg.putAndFlush( "rightRemoved" )
						
					}
					
					view.render()
					
				},
				
				reset: function( e ){
					
					view.rayCDistance = view.defaultDist
					view.camera.near = view.defaultDist
					view.camera.updateProjectionMatrix()
					
					if( view.papezVisible ){
						
						view.animPapez.end()
						ctr.reg.traverseScene( "side", "papez", "Mesh" )
						view.papezVisible = false
						 
					}			
				
					ctr.reg.putAndFlush( "leftRemoved" )
					ctr.reg.putAndFlush( "rightRemoved" )
					view.symmetryVisible = true
					
					view.render()
					
				}
				
				
			},
			
			timing: function( e ){
				
				if( e.type == "mousedown" || e.type == "touchstart" ){
					
					view.time.start = new Date().getTime()
					
				} else {
					
					view.time.end = new Date().getTime()
					
					if( view.time.end - view.time.start <= 150 ){
						
						if( e.type == "mouseup" ){
							view.events.mousePos( e )
						} else {
							view.events.fingerPos( e )
						}
						
					}
					
				}
				
			},
			
			mousePos: function( e ){
				
				e.preventDefault()
			
				x = e.clientX
				y = e.clientY
				view.events.contact( x, y )
				
			},
			
			fingerPos: function( e ){
				
				e.preventDefault()
				
				x = e.touches[ 0 ].pageX
				y = e.touches[ 0 ].pageY
				view.events.contact( x, y )
				
			},
			
			deep: function( arr, i, d ){
				
				if( typeof arr[ i ] === "undefined" ){
					
					return false
					
				}else{
					
					if( arr[ i ].distance > d ){
						
						return i 
						
					} else {
						
						i++
						view.events.deep( arr, i, d )
						
					}
					
				}
				
				
			},
			
			contact: function( x, y, action ){
			
				if( typeof action === "undefined" )
					action = "take"					
				
				view.contact.x = ( x / window.innerWidth ) * 2 - 1
				view.contact.y = - ( y / window.innerHeight ) * 2 + 1
				view.raycaster.near = view.rayCDistance
				view.raycaster.setFromCamera( view.contact, view.camera )
				var intersects = view.raycaster.intersectObjects( view.scene.children, true )
				
				if ( intersects.length > 0 ){
					
					if( intersects[ 0 ].object.userData.side != "papez" ){
	
						if( action == "take" ){
						
							var sideArray = "left"
							if( intersects[ 0 ].object.userData.side != "left" )
								sideArray = "right" 	
							
							view.focusDom.textContent = ''
												
							var obj = {
								
								name: intersects[ 0 ].object.name,
								geometry: intersects[ 0 ].object.geometry,
								material: intersects[ 0 ].object.material,
								userData: intersects[ 0 ].object.userData,
								
							}
							
							ctr.reg.saveAndTake( [ obj ], [ intersects[ 0 ].object.parent ], sideArray + "Removed" , "take")
					
							view.render()
						
						} else{
						
							view.focusDom.textContent = intersects[ 0 ].object.name

						}

					}
					
				} else {
					
					if( action == "take" ){

						view.render()
					}		
					view.focusDom.textContent = ''	
					
	
					
				}
				
			}
			
		}
		
	}	
	
}