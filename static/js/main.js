// Imports 
// TODO: Figure out why I can't use regular three npm package (has something to do with missing TextGeometry?)
// TODO: Can we remove the second 
// NPM modules
$ = require('jquery');
_ = require('underscore');
THREE = require('threejs-build');
helvetiker = require('three.regular.helvetiker');
StackBlur = require('stackblur-canvas');

// User made modules
VattuonetControls = require('./controls')(THREE);
Tumblr = require('./tumblr')

closePanel = function(event) {
  event.preventDefault();
  window.location.hash = "";
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
  Spinner = require('spin.js');
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
  }
  app.target = $('.spinner')[0];
  app.spinner = new Spinner(opts).spin(app.target);
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
      blogTriggered = Tumblr.getPosts();  
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
  } else {
    route = "";
  }

  window.location.hash = route;

  $('.panel#' + route).addClass('current');

  cancelAnimationFrame(app.af);
};  



setUIEventHandlers = function() {
  $('.panel-wrapper > a').on('click', closePanel);
  $('.panel').on('transitionend', sanitizePanel);
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
  

  var delta = app.clock.getDelta();
  app.camControls.update(delta);

  app.renderer.render( app.scene, app.camera );
};

// TODO: Thinking about module refactoring
// cameraroom = require('CameraRoom')
//    Include Webcam logic?
//    Build WebcamCube?
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


init = function() {    
  initAudio();

  var Scene = require('./scene');
  Scene.create();

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

    $('.panel' + window.location.hash).addClass('current');

  



  window.blogTriggered = undefined; // Temporary fix
});

