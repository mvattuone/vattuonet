// TODO: Why is the down->up transition still kind of buggy
// TODO: Why are down->up and right->left not able to use 100% as initial transformed position 
var Project = function(name, url, image, description, tags) {
  this.name = name;
  this.url  = url;
  this.image = image;
  this.description = description;
  this.tags = tags;
  this.container = '.container'
  this.$container = $(this.container);

  this.template = _.template(
    $( "script#projectTemplate" ).html()
  ); 

  this.initialize = function() {

    this.slug = this.slugify(this.name);

    this.html = this.template({
      name: this.name,
      slug: this.slug,
      url: this.url,
      image: this.image,
      description: this.description,
      tags: this.tags
    });

    this.$html = $(this.html);

    this.events();

  };

  this.slugify = function(name) {
    return name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
  }

  this.href = function(event) {
    return window.open($(this).data('url'));
  }

  this.initialize();
}

Project.prototype.events = function() {
    var self = this;
    this.$container.on('click', ".project#" + this.slug, this, this.href);
}

module.exports = Project;