// TODO: maybe make onLoad and onPlay methods for webcam?

revealScene = function(event) { 
  app.spinner.stop();
  $('body').addClass('loaded');
};

buildSphere = function(radius,widthSegments,heightSegments) {
  var geometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);    
  var material = new THREE.MeshPhongMaterial();
  var sphere = new THREE.Mesh( geometry, material );
  return sphere;
};

initScene = function() { 
  app.scene = new THREE.Scene();
  // TODO: This should be on app.scene prototype
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

  Webcam = require('./webcam');
  WebcamTexture = require('./webcam-texture');
  CubeRoom = require('./cube-room');
  Webcam.create(successCallback);

  texture = WebcamTexture.initialize();
  var room = CubeRoom.create(texture);

  app.spheres = [];
  app.labels = [];

  app.scene.addLighting();

  app.scene.add(room);

  for (i=0; i<4; i++) {
    mesh = buildSphere(16,256,256);
    app.spheres.push(mesh);
    var label = assignLabel(mesh.id),
        text = labelSphere(label);
    app.labels.push(text);
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


/* Give a more human readable name to each sphere, using the Mesh ID provided upon building the mesh. */
assignLabel = function(meshId) {
  var label;
  if (meshId === 8) {
    label = "blog";
  } else if (meshId === 10) {
    label = "contact";
  } else if (meshId === 12) {
    label = "projects";
  } else if (meshId === 14) {
    label = "about";
  } else {
    label = null;
  }

  return label;
}

// Create navigation label that goes above each sphere.
labelSphere = function(label) {  
  var textMat = new THREE.MeshPhongMaterial({
    color: 0xdddddd
  })

  var textGeo = new THREE.TextGeometry(label.toUpperCase(), {
    font: 'helvetiker',
    weight: 'normal',
    style: 'normal',
    size: '14',
    height: '2',
  });

  var textMesh = new THREE.Mesh(textGeo, textMat);
  return textMesh;
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

module.exports = {
  create: initScene
}