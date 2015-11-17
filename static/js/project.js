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

  this.enter = function(event) {
      if (event) {
          event.currentTarget.$html.addClass('enter');
      } else {
          $("#" + this.slug).addClass('enter');      
      }
      return this;
  }

  this.exit = function(event) {
      if (event) {
          event.currentTarget.$html.addClass('exit');
      } else {
          $("#" + this.slug).addClass('exit');    
      }
      $("#" + this.slug).find('.project-info').addClass('hidden');
      $('.project.current').removeClass('current').removeClass('exit');
      return this;
  }

    this.expand = function(event) {
        if (app.currentProject) {

            if (app.currentProject === event.data) {
                app.currentProject.exit();
                return false;
            }

            app.currentProject.exit();
        }

        app.currentProject = event.data;
        event.data.enter();
        $("#" + event.data.slug + " > .project-name").addClass('hidden');
        $("#" + event.data.slug).addClass('current');
        $(this).find('.project-info').removeClass('hidden');
    }

  this.initialize();
}

Project.prototype.events = function() {
    var self = this;
    this.$container.on('mouseenter', '.project#' + this.slug + ':not(.current)', function() { $(this).find('.project-name').removeClass('hidden'); });
    this.$container.on('mouseleave', '.project#' + this.slug  + ':not(.current)', function() { $(this).find('.project-name').addClass('hidden'); });
    this.$container.on('click', ".project#" + this.slug, this, this.expand);
}

module.exports = Project;