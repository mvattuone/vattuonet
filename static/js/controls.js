/**
 * @author dmarcos / http://github.com/dmarcos
 * @author mvattuone  / http://github.com/mvattuone
 *
 * These controls allow to change the orientation of the camera using the mouse
 * Edited to include Raycasting and sound toggle by mvattuone
 */

module.exports = function(THREE) {


  function VattuonetControls(object) {
    
      this.initialize = function(object) { 
        var scope = this;
        scope.PI_2 = Math.PI / 2;
        scope.mouseQuat = {
          x: new THREE.Quaternion(),
          y: new THREE.Quaternion()
        };
        scope.object = object;
        scope.xVector = new THREE.Vector3( 1, 0, 0 );
        scope.yVector = new THREE.Vector3( 0, 1, 0 );
        scope.enabled = true;
        scope.orientation = {
            x: 0,
            y: 0,
        };

        $('#scene').mousemove(scope.onMouseMove);
        // We use debounce to ensure songs are only triggered once (i.e. when there is an intersection)
        $('#scene').mousemove(_.debounce(function(event) { scope.checkPosition(event) }, 200));

        return scope;
      };

      this.onMouseMove = function ( event ) {
          if ( app.camControls.enabled === false ) return;
          var movementX = event.originalEvent.movementX || 0,
              movementY = event.originalEvent.movementY || 0;

          app.camControls.orientation.y -= movementX * 0.0075;
          app.camControls.orientation.x -= movementY * 0.0075;
          app.camControls.orientation.x = Math.max(-app.camControls.PI_2, Math.min(app.camControls.PI_2, app.camControls.orientation.x));
      };

      this.getIntersection = function(event) {
        app.mouse.x = ( event.clientX / app.renderer.domElement.width ) * 2 - 1;
        app.mouse.y = - ( event.clientY / app.renderer.domElement.height ) * 2 + 1;

        app.raycaster.setFromCamera( app.mouse, app.camera );
        intersects = app.raycaster.intersectObjects(app.spheres);
        if (intersects.length <= 0) {
          return false;
        }
        return intersects;
      };

      this.checkPosition = function(event) {
        app.intersects = app.camControls.getIntersection(event.originalEvent);

        if (!app.intersects) { 
          if (app.sound) { app.sound.source.stop(); }
          app.currentSong = null;
          return false; 
        }

        if (!app.audioCtx) {
            app.audioCtx = new AudioContext();
            var song;
        } 

        var sphere = app.intersects[0].object.name;

        if (sphere === "blog") { song = 1; }
        else if (sphere === "projects") { song = 2; }
        else if (sphere === "contact") { song = 3; }
        else if (sphere === "about") { song = 4; }
        else return false; 

        if (app.currentSong === song) {
          return false;
        }

        app.sound = {};
        app.sound.source = app.audioCtx.createBufferSource();
        app.sound.volume = app.audioCtx.createGain();
        app.sound.source.loop = true;

        // Load a app.sound file using an ArrayBuffer XMLHttpRequest.
        var request = new XMLHttpRequest();
        request.open("GET", '/static/audio/vattuonet-' + song + '.mp3', true);
        request.responseType = "arraybuffer";
        request.onload = function(e) {
          // Create a buffer from the response ArrayBuffer.
          app.audioCtx.decodeAudioData(request.response, function onSuccess(buffer) {

            // Make the app.sound source use the buffer and start playing it.
            if (!app.sound.source.buffer) {
              app.sound.source.buffer = buffer;
            } else {
              app.sound.source = app.audioCtx.createBufferSource(); 
              app.sound.source.buffer = buffer;
            }
            app.sound.source.connect(app.audioCtx.destination);
            app.sound.source.start(app.audioCtx.currentTime);
            app.currentSong = song;
          }, function onFailure() {
            alert("Decoding the audio buffer failed");
          });
        };
        request.send();
      };

      this.update = function() {
          if ( app.camControls.enabled === false ) return;

          app.camControls.mouseQuat.x.setFromAxisAngle( app.camControls.xVector, app.camControls.orientation.x );
          app.camControls.mouseQuat.y.setFromAxisAngle( app.camControls.yVector, app.camControls.orientation.y );
          app.camControls.object.quaternion.copy( app.camControls.mouseQuat.y ).multiply( app.camControls.mouseQuat.x );
          return;
      }
    
    }

    VattuonetControls.prototype = Object.create(THREE.EventDispatcher.prototype);
    VattuonetControls.prototype.constructor = VattuonetControls;
    return VattuonetControls;
}
