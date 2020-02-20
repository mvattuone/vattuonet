// HIGH LEVEL TODOS
// * Move Audio code into separate module
// * Figure out why I can't use regular three npm package (has something to do with missing TextGeometry?)
// * Move app object creation to a script file
// * Check out https://www.npmjs.com/package/jsmanipulate -- maybe replace "custom" emboss/greyScale and stackblur-canvas
// * See if we can make the Controls object not require invocation...

// App Namespace 
app = {};

// Imports
// NPM modules
_ = require('underscore');
THREE = require('three');
helvetiker = require('three.regular.helvetiker');
StackBlur = require('stackblur-canvas');
Spinner = require('spin.js');

// User made modules
// TODO: This bugs me.
VattuonetControls = require('./controls')(THREE);
Projects = require('./projects');
Panel = require('./panel');

createSpinner = function() {
  document.body.classList.add('loading');
  var opts = {lines: 9 ,length: 28,width: 16,radius: 42,scale: 0.75,corners: 1,color: '#000',opacity: 0.25,rotate: 30,direction: 1,speed: 1,trail: 60,fps: 20,zIndex: 2e9,className: 'spinner',top: '50%',left: '50%',shadow: false,hwaccel: true }
  app.target = document.querySelectorAll('#spinner')[0];
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
  
  checkRoute(sphere);

  if (app.scene && panel) {
    var header = document.querySelector('header');
    cancelAnimationFrame(app.af); // Stop the animation
    Webcam.stop();
    Webcam = undefined;
    app.scene = null;
    document.querySelector('#scene').removeChild();
    header.classList.remove('slideUp');
    header.children().show();
    // TODO: Let's use promises to resolve this stuff more logically.
    // Currently we are trying to avoid a race condition.
    setTimeout(function() {
      app.sound.source.stop();  
    }, 500)
  } else {
    return false;
  }
  
};  

initAudio = function() { 
  // Web Audio API stuff
  // Someday the fun zone should have some fallbacks
  window.AudioContext = ( window.AudioContext || window.webkitAudioContext || null );
};

/* Main Render Loop */
render = app.render = function() {
  app.af = requestAnimationFrame( render );
  
  var delta = app.clock.getDelta();
  app.camControls.update(delta);

  app.renderer.render( app.scene, app.camera );
};

checkRoute = function(route) {

  var panel;

  if (app.currentPanel) {
    app.currentPanel.exit();
    app.currentPanel = null;
  } 

  if (route === 'projects') {
    projects = new Projects();
    panel = new Panel('projects', projects);
  } else if (route === 'about') {
    panel = new Panel('about', "<h3>My name is Mike Vattuone. I am a musician and full stack web developer living in Brooklyn, New York, currently working at Idealist.</h3><h3>I am particularly interested in data visualization, cognitive science, and the evolution of the browser and personal computing over time, especially with regard to its cultural effects on things like media consumption, education, and civic engagement. You can get a better sense of my skill set by looking at my <a href='/resume-vattuone.pdf'>resume</a> and my <a href='#projects'>projects</a>.</h3><h3>When I'm not writing code, I'm probably playing music, learning something that may or may not be useful, or making soup from scratch.</h3>");
  } else if (route === 'contact') {
    window.location.href = "mailto:mike@vattuo.net?subject=Hello Friend";
    panel = false;
  } else {
    panel = false;
  }

  app.currentPanel = panel;
  return panel;
}

init = function() {    

  app.routes = ['projects', 'about'];
  

  document.querySelector('#pi').addEventListener('click', function() {
    
    app.currentPanel.exit();
    app.currentPanel.container.style.backgroundColor = 'transparent';
    
    var loadScene = function() {
      initAudio();
      var Scene = require('./scene');
      Scene.create();
      document.querySelector('.spinner-wrapper').removeEventListener('transitionend', loadScene);
    }

    setTimeout(function() {
      app.currentPanel.destroy();
      createSpinner(); 
      document.querySelector('.spinner-wrapper').addEventListener('transitionend', loadScene);
    }, 100);
    

    var header = document.querySelector('header');
    header.classList.add('slideUp');
    header.style.visibility = 'hidden';
  
  });
}

document.addEventListener('DOMContentLoaded', function() {
  init();
  var panel;

  window.addEventListener('hashchange', function(event) {
    checkRoute(window.location.hash.substring(1));
  })

  if (window.location.hash.substring(1).length > 0) {
    checkRoute(window.location.hash.substring(1));
  } else {
    checkRoute('projects');
  }  

});

