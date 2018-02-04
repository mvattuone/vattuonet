// TODO: Why is the down->up transition still kind of buggy
// TODO: Why are down->up and right->left not able to use 100% as initial transformed position 
var Project = function(name, url, image, description, tags) {
  this.name = name;
  this.url  = url;
  this.image = image;
  this.description = description;
  this.tags = tags;
  this.container = document.querySelector('.container');
  this.template = _.template(
    document.querySelector("script#projectTemplate" ).innerHTML
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
  };

  this.slugify = function(name) {
    return name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
  }

  this.initialize();
}

module.exports = Project;
