// HIGH LEVEL TODOS
// * Move Audio code into separate module
// * Fix scrolling on blog page so panel remains at same position
// * Figure out why I can't use regular three npm package (has something to do with missing TextGeometry?)
// * Move app object creation to a script file
// * Check out https://www.npmjs.com/package/jsmanipulate -- maybe replace "custom" emboss/greyScale and stackblur-canvas
// * See if we can make the Controls object not require invocation...

// Imports
// NPM modules
$ = require('jquery');
_ = require('underscore');
THREE = require('threejs-build');
helvetiker = require('three.regular.helvetiker');
StackBlur = require('stackblur-canvas');
Spinner = require('spin.js');
// TODO: We don't want this.
window.panel;
// User made modules
// TODO: This bugs me.
VattuonetControls = require('./controls')(THREE);
Projects = require('./projects');
Posts = require('./posts');
Panel = require('./panel');

createSpinner = function() {
  var opts = {lines: 9 ,length: 28,width: 16,radius: 42,scale: 0.75,corners: 1,color: '#000',opacity: 0.25,rotate: 30,direction: 1,speed: 1,trail: 60,fps: 20,zIndex: 2e9,className: 'spinner',top: '50%',left: '50%',shadow: false,hwaccel: true }
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

  // Is there a better way to do this?
  // For each sphere that is created, assign a route to the UserData property
  // When there is an intersection, rather than looking at ids and creating routes,
  // we could probably just create a function that looks at the UserData property
  // and addClass that way.
  var sphere = intersects[0].object.name;
  var panel;
  
  // TODO: Think through whether this is the right way to do async fetching
  // See Posts.js
  if (sphere === 'blog') {
    posts = new Posts();
    posts.fetch();
    panel = new Panel('blog');
    app.blogPanel = panel;
  }
  else if (sphere === 'contact') {
    panel = new Panel('contact', '<p>Email me at mike@vattuo.net -- I\'\d be down to grab a coffee or something.</p>');
  }
  else if (sphere === 'projects') {
    projects = new Projects();
    panel = new Panel('projects', projects);
  }
  else if (sphere === 'about') {
    var panel = new Panel('about', '<p>My name is Mike, and I do stuff on the Internet.</p><p>I have worked on many different layers of the stack, but my love is creating interesting and unique experiences.I enjoy working with bleeding-edge technologies, but I’m not afraid to utilize a polyfill for IE8 when the analytics call for it.</p><p>I like to have discussions about technology — problems solving is fun, but asking deep questions before attempting to solve the problem is funner.</p>');
  } else {
    return false;
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
render = app.render = function() {
  app.af = requestAnimationFrame( render );
  
  var delta = app.clock.getDelta();
  app.camControls.update(delta);

  app.renderer.render( app.scene, app.camera );
};

checkRoute = function() {
   var route = window.location.hash.substring(1);
   if ( route === 'blog') {
      posts = new Posts();
      posts.fetch();
      panel = new Panel('blog');
      app.blogPanel = panel;
  }
  else if (route === 'contact') {
    panel = new Panel('contact', '<p>Email me at mike@vattuo.net -- I\'\d be down to grab a coffee or something.</p>');
  }
  else if (route === 'projects') {
    projects = new Projects();
    panel = new Panel('projects', projects);
  }
  else if (route === 'about') {
    var panel = new Panel('about', '<p>My name is Mike, and I do stuff on the Internet.</p><p>I have worked on many different layers of the stack, but my love is creating interesting and unique experiences.I enjoy working with bleeding-edge technologies, but I’m not afraid to utilize a polyfill for IE8 when the analytics call for it.</p><p>I like to have discussions about technology — problems solving is fun, but asking deep questions before attempting to solve the problem is funner.</p>');
  } else {
    return false;
  }
}

init = function() {    
  
  app.routes = ['blog', 'projects', 'contact', 'about'];
  
  initAudio();

  var Scene = require('./scene');
  Scene.create();

  app.camControls = new VattuonetControls(app.camera);
  app.camControls.initialize(app.camera);
  app.camControls.enableDamping = true;
  app.camControls.dampingFactor = 0.25;
  app.camControls.enableZoom = false;

  $('#scene').on('mousedown', onDocumentMouseDown);
  $('#scene').on('touchstart', onDocumentTouchStart);

  render();
}

THREE.typeface_js.loadFace(helvetiker);
createSpinner(); // So we don't see DOM weirdness

$(document).ready(function() {
  init();

  if (window.location.hash.substring(1).length > 0) {
    checkRoute(window.location.hash.substring(1));
  }  
});

