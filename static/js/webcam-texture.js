
// TODO: Maybe there are better modules for this?
greyScaleTransform = function(data) {
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

embossTransform = function(data, imageData) {
  var w = imageData.width,
  limit = data.length;
  // Loop through the subpixels, convoluting each using an edge-detection matrix.
  for(var i = 0; i < limit; i++) {
    if( i%4 == 3 ) continue;
    data[i] = 127 + 2*data[i] - data[i + 4] - data[i + w*3];
  }

  return data;
};

var WebcamTexture = {
  initialize: function() { 
    this.source = Webcam.output,
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas';
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.Texture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;

    return this.texture;
  },
  transform: function(transformType, data, imageData) {
    if (transformType === "greyscale") {
      greyScaleTransform(data, imageData);
    } else if (transformType === "emboss") {
      embossTransform(data, imageData);
    } else {
      data = data;
    }

    return data
  },
  addTitle: function(text, font, color, x, y) {
    this.ctx.font = font;
    this.ctx.direction = 'ltr';
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y); 
  },
  draw: function(type) {
    var self = this;

    // if(this.source.paused || this.source.ended) return false;

    this.ctx.drawImage(this.source,0,0,this.canvas.width,this.canvas.height);

    // Grab the pixel data from the backing app.canvas
    var imageData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height),
    data = imageData.data;
    
    imageData.data = this.transform(type,data,imageData);

    // Draw the pixels onto the visible app.canvas
    this.ctx.putImageData(imageData,0,0);     

    var textChoice = Math.random();

    /* Randomly include Vattuonet in the canvas context that is rendered on the sides of the cube */
    // TODO: Figure out how to mirror the text programmatically... 
    
    if (textChoice > 0.3 && textChoice < 0.9) {
      this.addTitle('TƎᴎOUTTAV', '24px Georgia', 'red', 30, 80);
    }

    if (app.intersects) {
      StackBlur.canvasRGBA(this.canvas, 0, 0, this.canvas.width, this.canvas.height, Math.floor(Math.random() * 180));  
    }

    this.texture.needsUpdate = true;

    setTimeout(function(){ 
      var choice = Math.random() ;
      if (choice < 0.4) {
        self.draw("greyScale", self.source);
      } else if (choice >= 0.4 && choice < 0.7) {
        self.draw("emboss", self.source);
      } else {
        self.draw("normal", self.source);
      }
    }, 0);
  }
}

module.exports = WebcamTexture;
