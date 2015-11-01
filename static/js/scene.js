revealScene = function(event) { 
  app.spinner.stop();
  $('body').addClass('loaded');
};

buildSphere = function(radius,widthSegments,heightSegments,name) {
  var geometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);    
  var material = new THREE.MeshPhongMaterial();
  var sphere = new THREE.Mesh( geometry, material );
  sphere.name = name;
  return sphere;
};

initScene = function() { 
  app.scene = new THREE.Scene();
  
  app.scene.addLighting = function() { 
    a = []

    var ambientLight = new THREE.AmbientLight( 0x000000 );
    app.scene.add( ambientLight );

    var lights = [];
    for (i=0; i<3;i++) { lights[i] = new THREE.PointLight( 0xffffff, 1, 0 ); }
    
    lights[0].position.set( 0, 200, 0 );
    lights[1].position.set( 100, 200, 100 );
    lights[2].position.set( -100, -200, -100 );

    app.scene.add(lights[0]);
    app.scene.add(lights[1]);
    app.scene.add(lights[2]);
  }

  app.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 100000);
  app.raycaster = new THREE.Raycaster(); // used with intersections
  app.mouse = new THREE.Vector3(); // used with intersections
  app.clock = new THREE.Clock(); // used with controls
  app.renderer = new THREE.WebGLRenderer({ alpha:true });
  app.renderer.domElement.id = "scene";
  app.renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( app.renderer.domElement );

  app.scene.addLighting();

  Webcam = require('./webcam');
  WebcamTexture = require('./webcam-texture');
  CubeRoom = require('./cube-room');
  Webcam.create(successCallback);

  var texture = WebcamTexture.initialize(),
      room = CubeRoom.create(texture);

  app.scene.add(room);

  

  app.spheres = [];
  app.labels = []; 

  var labels = app.pages;
  for (i=0; i<labels.length; i++) {
    mesh = buildSphere(16,256,256,labels[i]);
    labelText = mesh.name;
    app.spheres.push(mesh);
    label = buildLabel(labelText);
    app.labels.push(label);
  }

  app.spheres[0].position.set(-90, 0, 0);
  app.spheres[1].position.set(0, 0, -90);
  app.spheres[2].position.set(90, 0, 0);
  app.spheres[3].position.set(0, 0, 90);

  app.labels[0].position.set(-80, 25, 20); // Blog
  app.labels[0].rotation.y = Math.PI/2; 
  app.labels[1].position.set(-40, 25, -90); //contact
  app.labels[1].rotation.y = 0; 
  app.labels[2].position.set(90, 25, -40); //projects
  app.labels[2].rotation.y = -Math.PI/2;
  app.labels[3].position.set(25, 25, 90); //about
  app.labels[3].rotation.y = Math.PI;

  coolColors = [
    0x645452,
    0x6082B6,
    0xffc40c,
    0xE52B50,
    0xfadfae,
  ]

  // TODO: is there a way to generalize this?
  app.spheres.map(function(sphere) {
    sphere.material.color.setHex(coolColors[Math.floor(Math.random()*coolColors.length)]);
    sphere.original_positionX = sphere.position.x;
    sphere.original_positionY = sphere.position.y;
    app.scene.add(sphere);
  });

  app.labels.map(function(label) {
    label.original_positionX = label.position.x;
    label.original_positionY = label.position.y;
    app.scene.add(label);
  });

};

// Create navigation label that goes above each sphere.
buildLabel = function(labelText) {  

  var textMat = new THREE.MeshPhongMaterial({
    color: 0xdddddd
  })

  var textGeo = new THREE.TextGeometry(labelText.toUpperCase(), {
    font: 'helvetiker',
    weight: 'normal',
    style: 'normal',
    size: '14',
    height: '2',
  });

  return new THREE.Mesh(textGeo, textMat);
}

successCallback = function(stream) {
  Webcam.output.onplay = function() {
    WebcamTexture.draw("greyScale",Webcam.output);
  };

  Webcam.output.onloadeddata = function() {
    revealScene();
    Webcam.output.play();
  };

  Webcam.output.load();
};

revealScene();


module.exports = {
  create: initScene
}