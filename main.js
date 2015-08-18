        var render = function() {

          requestAnimationFrame( render );

          if (app.texture) {
            app.texture.needsUpdate = true;
          }

          if (app.matched ) { 
            var timer = - new Date().getTime() * 0.02;
            app.camera.position.x = 10 * Math.cos( timer );
            app.camera.position.z = 10 * Math.sin( timer );
          }

          var delta = app.clock.getDelta();
          app.camControls.update(delta);

          app.renderer.render( app.scene, app.camera );
        }

        function greyScaleDraw(v,c,w,h,first) {
          if(v.paused || v.ended) return false;
            // First, draw it into the backing app.canvas
            c.drawImage(v,0,0,w,h);
            // Grab the pixel data from the backing app.canvas
            var idata = c.getImageData(0,0,w,h);
            var data = idata.data;
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
            idata.data = data;
            // Draw the pixels onto the visible app.canvas
            c.putImageData(idata,0,0);       

            stackBlurCanvasRGB("canvas", 0, 0, cw, ch, Math.floor(Math.random() * 180));

            // Start over!
            if (first) {
                // DO something first
              }

              setTimeout(function(){ 
                return Math.random() < 0.5 ? greyScaleDraw(video,app.context,cw,ch) : embossDraw(video,app.context,cw,ch);
              },  0);
            }

            function embossDraw(v,c,cw,ch) {
              if(v.paused || v.ended) return false;
            // First, draw it into the backing app.canvas
            c.drawImage(v,0,0,cw,ch);
            // Grab the pixel data from the backing app.canvas
            var idata = c.getImageData(0,0,cw,ch);
            var data = idata.data;
            var w = idata.width;
            var limit = data.length;

            // Loop through the subpixels, convoluting each using an edge-detection matrix.
            for(var i = 0; i < limit; i++) {
              if( i%4 == 3 ) continue;
              data[i] = 127 + 2*data[i] - data[i + 4] - data[i + w*3];
            }


            // Draw the pixels onto the visible app.canvas
            c.putImageData(idata,0,0);

            // Start over!
            setTimeout(function() {
              return Math.random() < 0.5 ? greyScaleDraw(video,app.context,cw,ch) : embossDraw(video,app.context,cw,ch);
            }, 0)
          }

          function successCallback(stream) {
            if (video.mozSrcObject !== undefined) {
              video.mozSrcObject = stream;
            } else {
              video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
              video.addEventListener('play', function(){
                cw = video.clientWidth;
                ch = video.clientHeight;
                app.canvas.width = cw;
                app.canvas.height = ch;
                greyScaleDraw(video,app.context,cw,ch,true);
              },false);
            };
            video.play();
          };

          function errorCallback(error) {
            console.error('An error occurred: [CODE ' + error.code + ']');
            // Display a friendly "sorry" message to the user
          };


          app.spheres = [];

          function onDocumentTouchStart( event ) {
            console.log('bar');
            event.preventDefault();

            event.clientX = event.touches[0].clientX;
            event.clientY = event.touches[0].clientY;
            onDocumentMouseDown( event );

          }   

          function onDocumentMouseDown( event ) {
            event.preventDefault();
            if (app.sound) {
              app.sound.source.stop();
            }

            app.mouse.x = ( event.clientX / app.renderer.domElement.width ) * 2 - 1;
            app.mouse.y = - ( event.clientY / app.renderer.domElement.height ) * 2 + 1;

            app.raycaster.setFromCamera( app.mouse, app.camera );

            var intersects = app.raycaster.intersectObjects(app.spheres);


            if ( intersects.length > 0 ) {
              
            
                var ctx = app.audioCtx = new AudioContext();

                var song;
                if (intersects[ 0 ].object.id === 9) {
                  song = 1;
                }
                else if (intersects[ 0 ].object.id === 11) {
                  song = 2;
                }
                else if (intersects[ 0 ].object.id === 13) {
                  song = 3;
                }
                else if (intersects[ 0 ].object.id === 15) {
                  song = 4;
                }
                else {
                 alert("This shouldn't happen ugh I hate this pattern.")
               }

               app.sound = {};
               app.sound.source = ctx.createBufferSource();
               app.sound.volume = ctx.createGain();
               app.sound.source.loop = true;

                // Load a app.sound file using an ArrayBuffer XMLHttpRequest.
                var request = new XMLHttpRequest();
                request.open("GET", 'supertight-' + song + '.mp3', true);
                request.responseType = "arraybuffer";
                request.onload = function(e) {
                  console.log(request.response);
                  // Create a buffer from the response ArrayBuffer.
                  ctx.decodeAudioData(request.response, function onSuccess(buffer) {
                    app.sound.buffer = buffer;
                    // Make the app.sound source use the buffer and start playing it.
                    app.sound.source.buffer = app.sound.buffer;
                    app.sound.source.connect(ctx.destination);
                    app.sound.source.start(ctx.currentTime);
                  }, function onFailure() {
                    alert("Decoding the audio buffer failed");
                  });
                };
                request.send();
              }
            }

          function buildSphere(radius,widthSegments,heightSegments) {
            var geometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);    
            app.texture.minFilter = THREE.LinearFilter;
            var material = new THREE.MeshPhongMaterial();
            var sphere = new THREE.Mesh( geometry, material );
            return sphere;
          }

         

          var init = function() {             
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
            console.log(navigator.getUserMedia)
            if (navigator.getUserMedia) {
              navigator.getUserMedia({video: true}, successCallback, errorCallback);
            } else {
              console.log('Native device media streaming (getUserMedia) not supported in this browser.');
            }

            // Detect if the audio context is supported.
            window.AudioContext = (
              window.AudioContext ||
              window.webkitAudioContext ||
              null
              );

            if (!AudioContext) {
              console.log("AudioContext not supported.  Fallback.")
              //TODO: Add a fallback
            } 

            app.scene = new THREE.Scene();
            app.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 100000);

            // for clicking on three objects
            app.raycaster = new THREE.Raycaster();
            app.mouse = new THREE.Vector3();

            app.clock = new THREE.Clock();

            app.renderer = new THREE.WebGLRenderer({ alpha:true });
            app.renderer.domElement.id = "visibleCanvas";
            app.renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( app.renderer.domElement );

            var video = document.querySelector('video');

            app.canvas = document.createElement('canvas');
            app.canvas.id = "canvas";
            app.context = app.canvas.getContext('2d');


            var cw = 1024
            var ch = 1024

            app.canvas.width = cw;
            app.canvas.height = ch;

            var ambientLight = new THREE.AmbientLight( 0x000000 );
            app.scene.add( ambientLight );

            var lights = [];
            lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
            lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
            lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );
            
            lights[0].position.set( 0, 200, 0 );
            lights[1].position.set( 100, 200, 100 );
            lights[2].position.set( -100, -200, -100 );

            app.scene.add(lights[0]);
            app.scene.add(lights[1]);
            app.scene.add(lights[2]);

            var stride = app.canvas.width * 4;
            var pixels = new Array(4 * app.canvas.width * app.canvas.height);
            var interval = 1000 / 60;
            var frames = 0;
            var amplitude = 12;
            var frequency = 0.5;

            app.texture = new THREE.Texture(app.canvas);
            var cube = new THREE.Mesh( new THREE.CubeGeometry(100000,100000,100000,1,1,1, null, true), new THREE.MeshBasicMaterial({map: app.texture,  side: THREE.BackSide }) );
            cube.material.color.setHex(0xfadfae);
            cube.frustumCulled = false;
            app.scene.add(cube);
            mesh = buildSphere(16,256,256);

            for (i=0; i<4; i++) {
              // we use a "deep" clone so each object has its own material
              var instance = mesh.GdeepCloneMaterials();
              app.spheres.push(instance);
            }

            app.spheres[0].position.set(-90, 0, 0);
            app.spheres[1].position.set(0, 0, -90);
            app.spheres[2].position.set(90, 0, 0);
            app.spheres[3].position.set(0, 0, 90);

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

            app.camControls = new THREE.FirstPersonControls(app.camera);
            app.camControls.lookSpeed = 0.4;
            app.camControls.movementSpeed = 20;
            app.camControls.noFly = true;
            app.camControls.lookVertical = true;
            app.camControls.constrainVertical = true;
            app.camControls.verticalMin = 1.0;
            app.camControls.verticalMax = 2.0;
            app.camControls.lon = -150;
            app.camControls.lat = 120;
          
          }

          $(document).ready(function() {


            init();
            render();



            document.addEventListener( 'mousedown', onDocumentMouseDown, false );
            document.addEventListener( 'touchstart', onDocumentTouchStart, false );

          });