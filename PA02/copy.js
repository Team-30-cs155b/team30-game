// Creating a textured plane which receives shadows as the base
   var planeGeometry = new THREE.PlaneGeometry( 100, 100, 128 );
   var texture = new THREE.TextureLoader().load( 'images/ice2.gif' );
   var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xaaaaaa,  map: texture ,side:THREE.DoubleSide} );
   planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
   scene.add(planeMesh);
   planeMesh.position.x = 0;
   planeMesh.position.y = -50;
   planeMesh.position.z = 0;
   planeMesh.rotation.x = -Math.PI/2;
   planeMesh.receiveShadow = true;

   // Creating a textured plane which receives shadows as the back
   plane2Mesh = new THREE.Mesh( planeGeometry, planeMaterial );
   scene.add(plane2Mesh);
   plane2Mesh.position.x = 0;
   plane2Mesh.position.y = 0;
   plane2Mesh.position.z = -50;
   plane2Mesh.receiveShadow = true;

   // Creating a textured plane which receives shadows on the right
   plane3Mesh = new THREE.Mesh( planeGeometry, planeMaterial );
   scene.add(plane3Mesh);
   plane3Mesh.position.x = 50;
   plane3Mesh.position.y = 0;
   plane3Mesh.position.z = 0;
   plane3Mesh.rotation.y = Math.PI/2;
   plane3Mesh.receiveShadow = true;

   // Creating a textured plane which receives shadows on the right
   plane4Mesh = new THREE.Mesh( planeGeometry, planeMaterial );
   scene.add(plane4Mesh);
   plane4Mesh.position.x = -50;
   plane4Mesh.position.y = 0;
   plane4Mesh.position.z = 0;
   plane4Mesh.rotation.y = -Math.PI/2;
   plane4Mesh.receiveShadow = true;

   // Creating a textured plane which receives shadows as on the left
   plane5Mesh = new THREE.Mesh( planeGeometry, planeMaterial );
   scene.add(plane5Mesh);
   plane5Mesh.position.x = 0;
   plane5Mesh.position.y = 30;
   plane5Mesh.position.z = 0;
   plane5Mesh.rotation.x = -Math.PI/2;
   plane5Mesh.receiveShadow = true;

   // Creating a textured plane which receives shadows at the top
   plane6Mesh = new THREE.Mesh( planeGeometry, planeMaterial );
   scene.add(plane6Mesh);
   plane6Mesh.position.x = 0;
   plane6Mesh.position.y = 0;
   plane6Mesh.position.z = 50;
   plane6Mesh.receiveShadow = true;




   	var wall = createWall("pic1.jpeg", 0, 0, -150);
   	scene.add(wall);

   	wall = createWall("pic2.jpg", 150, 0, 0);
   	wall.rotation.y = Math.PI/2;
   	scene.add(wall);

   	wall = createWall("pic3.jpg",-150,0,0);
   	wall.rotation.y = -Math.PI/2;
   	scene.add(wall);

   	wall = createWall("pic4.jpg",0,0,150);
   	scene.add(wall);
