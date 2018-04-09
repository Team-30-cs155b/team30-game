/*
Game 0
This is a ThreeJS program which implements a simple game
The user moves a cube around the board trying to knock balls into a cone

*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, edgeCam;  // we have two cameras in the main scene
	var suzanne; // The monkey avatar
	var cone;
	var npc;

	var startScene, startCamera, startText;
	var endScene, endCamera, endText;
  var loseScene,loseCamera, loseText;




	var controls =
	     {fwd:false, bwd:false, left:false, right:false, speed:10, fly:false, reset:false, camera:camera};

	var gameState =
	     {score:0, health:3, scene:'main', camera:'none' };


	// Here is the main game control
  init(); //
	initControls();
	animate();  // start the animation loop!





	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createStartScene();
			createEndScene();
			createLoseScene();
			initRenderer();
			createMainScene();
	}


	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,50,0);
			camera.lookAt(0,0,0);

			gameState.scene = 'start';


			// create the ground and the skybox
			var ground = createGround('grass.png');
			scene.add(ground);
			var skybox = createSkyBox('sky.jpg',1);
			scene.add(skybox);

			// create the avatar
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			initSuzanne();
			avatarCam.translateY(-4);
			avatarCam.translateZ(4);
			gameState.camera = avatarCam;

      			edgeCam = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
      			edgeCam.position.set(20,20,10);


			addBalls();

			cone = createConeMesh(4,6);
			cone.position.set(10,3,7);
			scene.add(cone);
			cone.addEventListener('collision',function(other_object){
				if (other_object==suzanne){
					gameState.health ++;
					soundEffect('good.wav');
					console.log("hits the cone, health increases by 1");
				}
			})

			npc = createBoxMesh2(0x0000ff,1,2,4);
			npc.position.set(30,5,-30);
      npc.addEventListener('collision',function(other_object){
				if(other_object == suzanne){
					gameState.health --;
					soundEffect('bad.wav');
					npc.__dirtyPosition = true;
					npc.position.set(Math.floor((Math.random() * 30) + 1),5,Math.floor((Math.random() * 30 ) + 1));
					console.log(npc.position);
				}
				if(gameState.health == 0){
					gameState.scene = 'gameover';
				}
      })
			scene.add(npc);

      var wall = createWall(0xffaa00,50,3,1);
      wall.position.set(10,0,20);
      scene.add(wall);
			wall.addEventListener('collision',function(other_object){
				if (other_object==suzanne){
					soundEffect('bad.wav');
					gameState.health --;
				}
				if(gameState.health == 0){
					gameState.scene = 'gameover';
				}
			})
			//console.dir(npc);
			//playGameMusic();

	}

function createStartScene(){
	startScene = initScene();
	startText = createPlane('start.png', 1);
	startScene.add(startText);
	var lightS = createPointLight();
	lightS.position.set(0,0,100);
	startScene.add(lightS);
	startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
	startCamera.position.set(0,0,20);
	startCamera.lookAt(0,0,0);
}

function createEndScene(){
	endScene = initScene();
	endText = createSkyBox('youwon.png',10);
	endScene.add(endText);
	var light1 = createPointLight();
	light1.position.set(0,200,20);
	endScene.add(light1);
	endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
	endCamera.position.set(0,50,1);
	endCamera.lookAt(0,0,0);

}

function createLoseScene(){
	loseScene = initScene();
	loseText = createSkyBox('gameover.png',10);
	loseScene.add(loseText);
	var lightL = createPointLight();
	lightL.position.set(0,200,20);
	loseScene.add(lightL);
	loseCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
	loseCamera.position.set(0,50,1);
	loseCamera.lookAt(0,0,0);
}

	function randN(n){
		return Math.random()*n;
	}




	function addBalls() {
		var goal = 20;
		var numYBalls = 15;
		var numBBalls = 5;
		var spBall = createSPBall();
		spBall.position.set(randN(30)+15,35,randN(30)+15);
		scene.add(spBall);
		spBall.addEventListener( 'collision',
			function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				if (other_object == suzanne){
					console.log("You " + i + " hits the SPECIAL BALL");
					soundEffect('good.wav');
					gameState.score += 20;  // add one to the score
					gameState.scene = 'youwon';
					scene.remove(this);
				}
			}
		);

		for(i = 0; i < numYBalls; i++) {
			var ball = createBall(1, 0xfff777);
			ball.position.set(randN(50)+15,30,randN(50)+15);
			scene.add(ball);
			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object == suzanne){
						console.log("ball " + i + " hit the cone");
						soundEffect('blip.wav')
					}
					if(other_object == cone){
						gameState.health +=1;
						soundEffect('good.wav');
						scene.remove(this);
						if (gameState.score == goal) {
							gameState.scene = 'youwon';
						}
					}
				}
			);
		}

		for(i = 0; i < numBBalls; i++) {
			var ball = createBall(0.7, 0x77bbff);
			ball.position.set(randN(80)+15,30,randN(80)+15);
			scene.add(ball);
			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==suzanne){
						console.log("ball "+i+" hit the cone");
						scene.remove(this);
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numBalls) {
							soundEffect('applause_y.wav');
							gameState.scene='youwon';

						}
					}
				}
			);
		}
	}



	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/'+file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '../js/physijs_worker.js';
    Physijs.scripts.ammo = '../js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}



	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		mesh.castShadow = true;
		return mesh;
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		mesh.castShadow = true;
		return mesh;
	}

  function createWall(color,w,h,d){
    var geometry = new THREE.BoxGeometry( w, h, d);
    var material = new THREE.MeshLambertMaterial( { color: color} );
    mesh = new Physijs.BoxMesh( geometry, material, 0 );
    mesh.castShadow = true;
    return mesh;
  }

	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
		mesh.receiveShadow = true;
		mesh.rotateX(Math.PI/2);
		return mesh;
	}

function createPlane(image,k){
	// creating a textured plane
	var geometry = new THREE.PlaneGeometry( 60, 40);
	var texture = new THREE.TextureLoader().load( '../images/'+image );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( k, k );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
	//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
	//var mesh = new THREE.Mesh( geometry, material );
	var mesh = new THREE.Mesh( geometry, material);
	mesh.receiveShadow = false;
	return mesh;
	// we need to rotate the mesh 90 degrees to make it horizontal not vertical
}

	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry( 80, 80, 80 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var mesh = new THREE.Mesh( geometry, material, 0 );
		mesh.receiveShadow = false;
		return mesh


	}

	function initSuzanne() {
		var loader = new THREE.JSONLoader();
		loader.load("../models/suzanne.json",
					function ( geometry, materials ) {
						console.log("loading suzanne");
						var material = new THREE.MeshLambertMaterial( { color: 0xffffcc } );
						var pmaterial = new Physijs.createMaterial(material, 0.9, 0.5);
						suzanne = new Physijs.BoxMesh( geometry, pmaterial );
						console.log("created suzanne mesh");
						console.log(JSON.stringify(suzanne.scale));
						scene.add(suzanne);
						var s = 1;
						suzanne.scale.y = s;
						suzanne.scale.x = s;
						suzanne.scale.z = s;
						suzanne.position.z = -5;
						suzanne.position.y = 3;
						suzanne.position.x = -5;
						suzanne.castShadow = true;
						scene.add(suzanne);
						avatarCam.position.set(0,2,-5);
						avatarCam.lookAt(0,2,10);
						suzanne.add(avatarCam);
					},
					function(xhr) {
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
					function(err){console.log("error in loading: " + err);}
				)
				avatarCam.position.set(0,4,-1);
				avatarCam.lookAt(0,4,10);
		}


	function createConeMesh(r,h){
		var geometry = new THREE.ConeGeometry( r, h, 32);
		var texture = new THREE.TextureLoader().load( '../images/tile.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0 );
		mesh.castShadow = true;
		return mesh;
	}


	function createBall(m, c){
		var geometry = new THREE.SphereGeometry(m, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: c} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}

	function createSPBall(){
		var params = { opacity: 0.15 };
		var geometry = new THREE.SphereGeometry(0.2, 16, 16);
		var material = new THREE.MeshLambertMaterial( {opacity: params.opacity, transparent: true} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}


	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
    console.dir(event);
		console.log("Keydown: '"+event.key+"'");


		if (gameState.scene == 'start' && event.key =='p') {
			gameState.scene = 'main';
			gameState.score = 0;
			gameState.health = 3;
			addBalls();
			return;
		}

		//console.dir(event);
		// first we handle the "play again" key in the "youwon" scene
		if (gameState.scene == 'youwon' && event.key=='r') {
			gameState.scene = 'start';
			gameState.score = 0;
			gameState.health = 3;
			addBalls();
			return;
		}

		if (gameState.scene == 'gameover' && event.key=='r') {
			gameState.scene = 'start';
			gameState.score = 0;
			gameState.health = 3;
			addBalls();
			return;
		}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "r": controls.up = true; break;
			case "p": controls.up = true; break;
			case "f": controls.down = true; break;
			case "m": controls.speed = 30; break;
      case " ": controls.fly = true;
          console.log("space!!");
          break;
      case "h": controls.reset = true; break;



			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;
      case "3": gameState.camera = edgeCam; break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;
			case "q": avatarCam.rotateY(Math.PI/180); break;
			case "e": avatarCam.rotateY(-Math.PI/180); break;
			case "z": avatarCam.rotateX(Math.PI/180); break;
			case "c": avatarCam.rotateX(-Math.PI/180); break;
			case "b": avatarCam.rotation.y = 0; breake;

		}

	}

	function keyup(event){
		console.dir(event);
		console.log("Keyup: '"+event.key+"'");
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "p": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
		}
	}

	function updateNPC(){
		npc.lookAt(suzanne.position);
		if (npc.position.distanceTo(suzanne.position)< 30){
				npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(5));
		}
	}

function updateAvatar(){
	"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

	var forward = suzanne.getWorldDirection();
	var curr = suzanne.getLinearVelocity();

	if (controls.fwd){
		curr = new THREE.Vector3(forward.x * controls.speed, curr.y, forward.z * controls.speed);
		suzanne.setLinearVelocity(curr);
		console.log("1")
	} else if (controls.bwd){
		curr = new THREE.Vector3(forward.x * -controls.speed, curr.y, forward.z * -controls.speed);
		suzanne.setLinearVelocity(curr);
	} else {
		curr.x = curr.z = 0;
		suzanne.setLinearVelocity(curr); //stop the xz motion
	}

	if (controls.fly){
		curr.y = controls.speed/2;
		suzanne.setLinearVelocity(curr);
	}

	if (controls.left){
		suzanne.setAngularVelocity(new THREE.Vector3(0, controls.speed * 0.3, 0));
	}else if (controls.right){
		suzanne.setAngularVelocity(new THREE.Vector3(0, -controls.speed * 0.3, 0));
	}else{
		suzanne.setAngularVelocity(new THREE.Vector3(0, 0, 0));
	}

	if (controls.reset){
		suzanne.__dirtyPosition = true;
		suzanne.position.set(40,10,40);
	}
}

  /*function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = suzanne.getWorldDirection();

		if (controls.fwd){
			suzanne.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			suzanne.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = suzanne.getLinearVelocity();
			velocity.x = velocity.z = 0;
			suzanne.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      suzanne.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			suzanne.setAngularVelocity(new THREE.Vector3(0, controls.speed * 0.3, 0));
		} else if (controls.right){
			suzanne.setAngularVelocity(new THREE.Vector3(0, -controls.speed * 0.3, 0));
		}

    if (controls.reset){
      suzanne.__dirtyPosition = true;
      suzanne.position.set(40,10,40);
    }

	}
*/

	function tilt() {
		var min = Math.PI/2;
		var max = Math.PI;
		if (suzanne.rotation.x > min && suzanne.rotation.x < max ||
				suzanne.rotation.x < -min && suzanne.rotation.x > -max ||
				suzanne.rotation.z > min && suzanne.rotation.z < max ||
				suzanne.rotation.z < -min && suzanne.rotation.z > -max ) {
			 suzanne.rotation.x = -max;
			 suzanne.rotation.z = -max;
			 suzanne.__dirtyRotation = true;
		}
	}


	function animate() {

		requestAnimationFrame( animate );

		switch(gameState.scene) {
			case "start":
				renderer.render( startScene, startCamera );
			break;

			case "youwon":
				endText.rotateY(0.005);
				renderer.render( endScene, endCamera);
				break;

			case "gameover":
			  loseText.rotateY(0.005);
				renderer.render(loseScene, loseCamera);
				break;

			case "main":
				updateAvatar();
				updateNPC();
				tilt();
        edgeCam.lookAt(suzanne.position);
	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);

		}


	  var info = document.getElementById("info");
		info.innerHTML='<div style="font-size:24pt">Score: '
    + gameState.score
    + " Health="+gameState.health
    + '</div>';

	}
