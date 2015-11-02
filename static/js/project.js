// TODO: Why is the down->up transition still kind of buggy
// TODO: Why are down->up and right->left not able to use 100% as initial transformed position 
var Project = function(name, url, image, description, tags) {
  this.name = name;
  this.url  = url;
  this.image = image;
  this.description = description;
  this.tags = tags;

  this.template = _.template(
    $( "script#projectTemplate" ).html()
  ); 

  this.initialize = function() {
    
    this.html = this.template({
      name: this.name,
      url: this.url,
      image: this.image,
      description: this.description,
      tags: this.tags
    });

  };

  // TODO: This I guess would be where we have WebGL talking to DOM, via an observer?
  this.destroy = function(event) {
    var $el = $('.project.current.exit');
    if ($el.length <= 0) { return false; };
    $el.remove();
    return $el;
  };

  this.enter = function(event) {
    this.$el.addClass('enter');
  }

  this.exit = function(event) {
    var $el = $('.project.active');
    $el.addClass('exit');
  }

  this.initialize();
}

// Prevent dupe events by unbinding?
// How do I only initialize the event handler if it hasn't been initialized but in an elegant way?
Project.prototype.events = function() {
  this.$el.find('button').unbind('click');
  this.$el.unbind('transitionend');
  this.$el.unbind('DOMNodeInserted');

  this.$el.bind('DOMNodeInserted', this.enter);
  this.$el.find('button').on('click', this.exit);
  this.$el.on('transitionend', this.destroy);
}

module.exports = Project;