// TODO: Add better error handling

var Webcam = function() {
  var self = this;
  
  this.output = document.querySelector('#video');

  this.stop = function() {
    self.stream.getVideoTracks()[0].stop()
  };

  this.create = function(success, error) { 
    this.callback = success;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true}, this.success, this.error);
    } else {
      throw 'getUserMedia Error: Native device media streaming (getUserMedia) not supported in this browser.';
    }
  };

  // Question: Since this is a callback we can't rely on Webcam function scope??
  this.success = function(stream) { 
    if (self.output.mozSrcObject !== undefined) {
      self.output.mozSrcObject = stream;
    } else {
      self.output.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    };

    self.stream = stream;

    self.callback();
  }

  // Question: Since this is a callback we can't rely on Webcam function scope??
  this.error = function(error) {
    console.error('An error occurred: [CODE ' + error.code + ']');
  }
  
  return this;
};

module.exports = new Webcam;


