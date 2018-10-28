Project = require('./project');

Projects = function() {

  this.data = [
      {
          'name': 'Blinktag',
          'url': 'http://blinktag.com',
          'image': 'static/projects/vattuonet-blinktag.jpg',
          'description': 'BlinkTag makes technology easy for city and transportation planning professionals. I worked with them on various web development projects, including an overhaul of a Guaranteed Ride Home program for Contra Costa County.',
          'tags': ['Django', 'Wordpress', 'CSS', 'Backbone', 'RequireJS', 'Grunt']
      },
      {
          'name': 'Float Map',
          'url': 'http://floatmap.us',
          'image': 'static/projects/vattuonet-float.jpg',
          'description': 'Float Map visualizes forecasted changes in extreme weather to show the risks associated with climate change. Recieved the Judges’ Choice and Popular Choice awards in the 2014 MIT Climate Colab competition.',
          'tags': ['Django', 'BackboneJS', 'Coffeescript', 'D3', 'Grunt']
      },
      {
          'name': 'Susannah Conway',
          'url': 'http://susannahconway.com',
          'image': 'static/projects/vattuonet-susannah-conway.jpg',
          'description': 'Susannah Conway is a successful UK-based blogger, photographer, and educator. I helped build out a redesign of her website.',
          'tags': ['Wordpress', 'SCSS', 'jQuery', 'Gulp']
      }
  ];

  this.fetch = function() {
    var html = this.dispatch();
    return html;
  }

  this.dispatch = function(projects) {
    var projects = [];
    for (i=0; i<this.data.length; i++) {
      var args = this.data[i];
      var project = new Project(args['name'], args['url'], args['image'], args['description'], args['tags']);
      projects.push(project.html);
    }
    var html = projects.join("");

    return html;
  };

  this.html = this.fetch()
  return this;
  
};

module.exports = Projects;
