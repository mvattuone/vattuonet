// Imports 

// TODO: Figure out why I can't use regular three npm package (has something to do with missing TextGeometry?)
// TODO: Can we remove the second 
$ = require('jquery');
_ = require('underscore');
THREE = require('threejs-build');
VattuonetControls = require('./controls')(THREE);
helvetiker = require('three.regular.helvetiker');
Spinner = require('spin');


/* TODO: Make npm module for this??? */
/* StackBlur - a fast almost Gaussian Blur For Canvas

Version:    0.5
Author:     Mario Klingemann
Contact:    mario@quasimondo.com
Website:    http://www.quasimondo.com/StackBlurForCanvas
Twitter:    @quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr: 
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

function stackBlurCanvasRGB( id, top_x, top_y, width, height, radius ) {

  var mul_table = [
    512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
    454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
    482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
    437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
    497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
    320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
    446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
    329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
    505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
    399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
    324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
    268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
    451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
    385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
    332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
    289,287,285,282,280,278,275,273,271,269,267,265,263,261,259 
  ],
  shg_table = [
    9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
    17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
    19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
    23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 
  ];

  function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
  }

  if ( isNaN(radius) || radius < 1 ) return;
  radius |= 0;
  
  if (app.canvas) {
    var canvas = app.canvas;
  } else {
    var canvas  = document.getElementById( id );  
  }
  
  var context = canvas.getContext("2d");
  var imageData;
  
  try {
    imageData = context.getImageData( top_x, top_y, width, height );
  } catch(e) {
    alert("Cannot access image");
    throw new Error("unable to access image data: " + e);
  }

  var pixels = imageData.data;

  var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
  r_out_sum, g_out_sum, b_out_sum,
  r_in_sum, g_in_sum, b_in_sum,
  pr, pg, pb, rbs;

  var div = radius + radius + 1,
      w4 = width << 2,
      widthMinus1  = width - 1,
      heightMinus1 = height - 1,
      radiusPlus1  = radius + 1,
      sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
  
  var stackStart = new BlurStack(),
      stack = stackStart;

  for ( i = 1; i < div; i++ ) {
    stack = stack.next = new BlurStack();
    if ( i == radiusPlus1 ) var stackEnd = stack;
  }

  stack.next = stackStart;
  
  var stackIn = null,
      stackOut = null;
  
  yw = yi = 0;
  
  var mul_sum = mul_table[radius],
      shg_sum = shg_table[radius];
  
  for ( y = 0; y < height; y++ ) {
    r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

    r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
    g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
    b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );

    r_sum += sumFactor * pr;
    g_sum += sumFactor * pg;
    b_sum += sumFactor * pb;

    stack = stackStart;

    for( i = 0; i < radiusPlus1; i++ ) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next;
    }

    for( i = 1; i < radiusPlus1; i++ ) {
      p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
      r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
      g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
      b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;

      r_in_sum += pr;
      g_in_sum += pg;
      b_in_sum += pb;

      stack = stack.next;
    }


    stackIn = stackStart;
    stackOut = stackEnd;
    for ( x = 0; x < width; x++ ) {
      pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
      pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
      pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;

      r_sum -= r_out_sum;
      g_sum -= g_out_sum;
      b_sum -= b_out_sum;

      r_out_sum -= stackIn.r;
      g_out_sum -= stackIn.g;
      b_out_sum -= stackIn.b;

      p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

      r_in_sum += ( stackIn.r = pixels[p]);
      g_in_sum += ( stackIn.g = pixels[p+1]);
      b_in_sum += ( stackIn.b = pixels[p+2]);

      r_sum += r_in_sum;
      g_sum += g_in_sum;
      b_sum += b_in_sum;

      stackIn = stackIn.next;

      r_out_sum += ( pr = stackOut.r );
      g_out_sum += ( pg = stackOut.g );
      b_out_sum += ( pb = stackOut.b );

      r_in_sum -= pr;
      g_in_sum -= pg;
      b_in_sum -= pb;

      stackOut = stackOut.next;

      yi += 4;
    }
    yw += width;
  }

  
  for ( x = 0; x < width; x++ ) {
    g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

    yi = x << 2;
    r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
    g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
    b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);

    r_sum += sumFactor * pr;
    g_sum += sumFactor * pg;
    b_sum += sumFactor * pb;

    stack = stackStart;

    for( i = 0; i < radiusPlus1; i++ ) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next;
    }

    yp = width;

    for( i = 1; i <= radius; i++ ) {
      yi = ( yp + x ) << 2;

      r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
      g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
      b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;

      r_in_sum += pr;
      g_in_sum += pg;
      b_in_sum += pb;

      stack = stack.next;
      
      if( i < heightMinus1 ) {
        yp += width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;
    for ( y = 0; y < height; y++ ) {
      p = yi << 2;
      pixels[p]   = (r_sum * mul_sum) >> shg_sum;
      pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
      pixels[p+2] = (b_sum * mul_sum) >> shg_sum;

      r_sum -= r_out_sum;
      g_sum -= g_out_sum;
      b_sum -= b_out_sum;

      r_out_sum -= stackIn.r;
      g_out_sum -= stackIn.g;
      b_out_sum -= stackIn.b;

      p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

      r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
      g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
      b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));

      stackIn = stackIn.next;

      r_out_sum += ( pr = stackOut.r );
      g_out_sum += ( pg = stackOut.g );
      b_out_sum += ( pb = stackOut.b );

      r_in_sum -= pr;
      g_in_sum -= pg;
      b_in_sum -= pb;

      stackOut = stackOut.next;

      yi += width;
    }
  }
  
  context.putImageData( imageData, top_x, top_y ); }

// TODO: Is there something I can use in the Three library for this or should I make it a module?
THREE.Object3D.prototype.GdeepCloneMaterials = function() {
  var object = this.clone( new THREE.Object3D(), false );

  for ( var i = 0; i < this.children.length; i++ ) {

    var child = this.children[ i ];
    if ( child.GdeepCloneMaterials ) {
      object.add( child.GdeepCloneMaterials() );
    } else {
      object.add( child.clone() );
    }

  }
  return object;};

// TODO: Do I need this?
THREE.Mesh.prototype.GdeepCloneMaterials = function( object, recursive ) {
  if ( object === undefined ) {
    object = new THREE.Mesh( this.geometry, this.material.clone() );
  }

  THREE.Object3D.prototype.GdeepCloneMaterials.call( this, object, recursive );

  return object;
};

/* END PLUGINS */


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

//Q: CameraRoom.drawWalls()?
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
    stackBlurCanvasRGB("canvas", 0, 0, app.canvas.width, app.canvas.height, Math.floor(Math.random() * 180));  
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
  console.log(meshId);
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

// TODO: This should be on app.scene prototype
THREE.Scene.prototype.addLighting = function() { 
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

initScene = function() { 
  app.scene = new THREE.Scene();
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
//    gaussianblur = require('gaussianblur?')
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

