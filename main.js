// Imports 

// TODO: Figure out why I can't use regular three npm package (has something to do with missing TextGeometry?)
// TODO: Can we remove the second 
$ = require('jquery');
_ = require('underscore');
THREE = require('threejs-build');
VattuonetControls = require('./controls')(THREE);
helvetiker = require('three.regular.helvetiker');
Spinner = require('spin');
StackBlur = require('stackblur-canvas');

/**
 * Populates blog with posts that are not tagged (i.e. page content) returned from the Tumblr API
 * @return the blog panel populated with posts
 */

 getPosts = function() {
  
  /* Tumblr API failwhale */
  var blogPanel = $('#blog.panel'),
      script = document.createElement('script');

  script.src = 'http://vattuonet.tumblr.com/api/read/json';
  document.head.appendChild(script);
    
  script.addEventListener('load', function(e) {
    var posts = window.tumblr_api_read.posts,
    postTemplate = _.template(
        $( "script#postTemplate" ).html()
    );
    posts.forEach(function(post) {
      if (!post['tags']) {
        $('.posts').append(postTemplate({
          'title': post['regular-title'],
          'body': post['regular-body']
        }));
      }
    });
  });

  return true;
};

closePanel = function(event) {
  event.preventDefault();
  $('.current.panel').addClass('exit');
};

/* TODO: Come up with a better name for what I'm trying to do here... */
sanitizePanel = function(event) {
  var panel = $('.panel.current.exit');
  if (panel.length <= 0) { return false; };
  render();
  panel.removeClass('exit').removeClass('current');
}

createSpinner = function() {
  var opts = {
    lines: 9 ,
    length: 28,
    width: 16,
    radius: 42,
    scale: 0.75,
    corners: 1,
    color: '#000',
    opacity: 0.25,
    rotate: 30,
    direction: 1,
    speed: 1,
    trail: 60,
    fps: 20,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: false,
    hwaccel: true,
    position: 'absolute' 
  }
  app.target = $('.spinner')[0];
  app.spinner = new Spinner(opts).spin(app.target);
};

revealScene = function(event) { 
  app.spinner.stop();
  $('body').addClass('loaded');

}

// Paints the box
draw = function(type,v,c,w,h) {
  
  if(v.paused || v.ended) return false;

  c.drawImage(v,0,0,w,h);

  // Grab the pixel data from the backing app.canvas
  var idata = c.getImageData(0,0,w,h),
      data = idata.data;

  if (type === "emboss") {
    embossDraw(data, idata);
  } else if (type === "greyScale") {
    greyScaleDraw(data);
  } 

  idata.data = data;
  // Draw the pixels onto the visible app.canvas
  c.putImageData(idata,0,0);     

  var textChoice = Math.random();

  /* Randomly include Vattuonet in the canvas context that is rendered on the sides of the cube */
  var addTitle = function(c) {
    c.font = "24px Georgia";
    c.direction = 'ltr';
    c.fillStyle = "red";
    c.fillText('TƎᴎOUTTAV', 30, 80); // TODO: Figure out how to mirror the text programmatically... 
  }

  if (textChoice > 0.3 && textChoice < 0.9) {
    addTitle(c);
  } 

  if (app.intersects) {
    StackBlur.canvasRGBA("canvas", 0, 0, app.canvas.width, app.canvas.height, Math.floor(Math.random() * 180));  
  }

  setTimeout(function(){ 
    var choice = Math.random() ;
    if (choice < 0.4) {
      draw("greyScale",app.video,app.context,cw,ch);
    } else if (choice >= 0.4 && choice < 0.7) {
      draw("emboss", app.video,app.context,cw,ch);
    } else {
      draw("normal", app.video,app.context,cw,ch);
    }
  }, 0);
};

greyScaleDraw = function(data) {
  // Loop through the pixels, turning them grayscale
  for(var i = 0; i < data.length; i+=4) {
    var r = data[i];
    var g = data[i+1];
    var b = data[i+2];
    var brightness = (3*r+4*g+b)>>>3;
    data[i] = brightness;
    data[i+1] = brightness;
    data[i+2] = brightness;
  }

  return data;
};

embossDraw = function(data, idata) {
  var w = idata.width,
  limit = data.length;
  // Loop through the subpixels, convoluting each using an edge-detection matrix.
  for(var i = 0; i < limit; i++) {
    if( i%4 == 3 ) continue;
    data[i] = 127 + 2*data[i] - data[i + 4] - data[i + w*3];
  }

  return data;
};

onDocumentTouchStart = function(event) {
  event.preventDefault();
  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onDocumentMouseDown( event );
};

onDocumentMouseDown = function(event) {
  event.preventDefault();

  var intersects = app.camControls.getIntersection(event);
  if (!intersects) { return false; }

  var route;
  if (intersects[ 0 ].object.id === 8) {
    route = "blog";
    if (!blogTriggered) {
      blogTriggered = getPosts();  
    }
  }
  else if (intersects[ 0 ].object.id === 10) {
    route = "contact";
  }
  else if (intersects[ 0 ].object.id === 12) {
    route = "projects";
  }
  else if (intersects[ 0 ].object.id === 14) {
    route = "about";
  } 

  $('.panel#' + route).addClass('current');

  cancelAnimationFrame(app.af);
};  

buildSphere = function(radius,widthSegments,heightSegments) {
  var geometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);    
  app.texture.minFilter = THREE.LinearFilter;
  var material = new THREE.MeshPhongMaterial();
  var sphere = new THREE.Mesh( geometry, material );
  return sphere;
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

setUIEventHandlers = function() {
  $('.panel-wrapper > a').on('click', closePanel);
  $('.panel').on('transitionend', sanitizePanel);
};

initCamera = function() {

  cameraSuccess = function(stream) {
    if (app.video.mozSrcObject !== undefined) {
      app.video.mozSrcObject = stream;
    } else {
      app.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    };
      
    app.video.onplay = function() {
      cw = app.video.clientWidth;
      ch = app.video.clientHeight;
      app.canvas.width = cw;
      app.canvas.height = ch;
      draw("greyScale",app.video,app.context,cw,ch);
    };

    app.video.onloadeddata = function() {
      revealScene();
      app.video.play();
    };

    app.video.load();
    
  };

  // The error callback is also triggered when the camera is not active...
  cameraError = function(error) {
    console.error('An error occurred: [CODE ' + error.code + ']');
  };

  app.video = $('#video')[0];
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
  if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, cameraSuccess, cameraError);
  } else {
    throw 'getUserMedia Error: Native device media streaming (getUserMedia) not supported in this browser.';
  }
};

initAudio = function() { 
  // Web Audio API stuff
  window.AudioContext = ( window.AudioContext || window.webkitAudioContext || null );

  if (!AudioContext) { 
    // fallback
  } 
};

/* Main Render Loop */
render = function() {
  app.af = requestAnimationFrame( render );

  if (app.texture) {
    app.texture.needsUpdate = true;
  }

  var delta = app.clock.getDelta();
  app.camControls.update(delta);

  app.renderer.render( app.scene, app.camera );
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
  app.scene.addLighting();
};

// TODO: Thinking about module refactoring
// cameraroom = require('CameraRoom')
//    Include Webcam logic?
//    Build CameraCube?
//    By requiring this, it would return the code needed to add the camera room to the site
//    camera = require('camera')
//      All of the code to initialize the webcam
//    emboss = require('emboss')
//    blackandwhite = require('blackandwhite')
// dots = require('Dots')
//    Build dots?
//    Each dot has a label that gets added to it
//    Add event handlers
// sounds = require('Sounds')
//    Toggle audio controls
//    Load sounds
//    This would probably be included in the dots module
// scene = require('Scene') ??? 
//    The initialization of the webGL renderer, scene, controls, context? 
// tumblr = require('Tumblr')
//    Code pertaining to getting Tumblr stuff
//    Tumblr.getPosts() no argument returns all posts
//    Tumblr.getPosts('') empty string returns all posts with no tags
//    Tumblr.getPosts('foo') would return all posts tagged with foo

init = function() {    

  // Webcam stuff
  initCamera();
  initAudio();
  initScene();
  

  buildCameraTexture = function() { 
    app.canvas = document.createElement('canvas');
    app.canvas.id = "canvas";
    app.context = app.canvas.getContext('2d');

    var cw = app.canvas.width = 1024,
        ch = app.canvas.height = 1024;

    return new THREE.Texture(app.canvas);
  }

  app.texture = buildCameraTexture();  

  var cube = new THREE.Mesh( 
    new THREE.BoxGeometry(100000,100000,100000,1,1,1, null, true), 
    new THREE.MeshBasicMaterial({map: app.texture,  side: THREE.BackSide }) 
  );  

  cube.material.color.setHex(0xfadfae);
  cube.frustumCulled = false; 

  app.scene.add(cube);

  app.spheres = [];
  app.labels = [];
      
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

  app.camControls = new VattuonetControls(app.camera);
  app.camControls.initialize(app.camera);
  app.camControls.enableDamping = true;
  app.camControls.dampingFactor = 0.25;
  app.camControls.enableZoom = false;

  setUIEventHandlers();

  $('#scene').on('mousedown', onDocumentMouseDown);
  $('#scene').on('touchstart', onDocumentTouchStart);

  render();
}

THREE.typeface_js.loadFace(helvetiker);
createSpinner(); // So we don't see DOM weirdness

$(document).ready(function() {
  init();
  window.blogTriggered = undefined; // Temporary fix
});

