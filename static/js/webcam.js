// TODO: Add better error handling

var Webcam = function() {
  var self = this;
  self.output = $('#video')[0];

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

  this.success = function(stream) { 
    if (self.output.mozSrcObject !== undefined) {
      self.output.mozSrcObject = stream;
    } else {
      self.output.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    };

    self.callback();
  }

  this.error = function(error) {
    console.error('An error occurred: [CODE ' + error.code + ']');
  }
  
  return this;
};

module.exports = new Webcam;


