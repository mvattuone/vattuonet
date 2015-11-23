/**
 * Populates blog with posts that are not tagged (i.e. page content) returned from the Tumblr API
 * @return the blog panel populated with posts
 */

//    Projects = require('projects')
//    Code pertaining to getting Tumblr stuff
//    Tumblr.getPosts() no argument returns all posts
//    Tumblr.getPosts('') empty string returns all posts with no tags
//    Tumblr.getPosts('foo') would return all posts tagged with foo


Project = require('./project');

Projects = function() {

  this.data = [
      {
          'name': 'Climate Relief',
          'url': 'https://act.climaterelief.org/donate/donate_CAdrought/',
          'image': 'static/projects/vattuonet-climate-relief.jpg',
          'description': 'The Climate Relief Fund raises funds to support communities around the world devastated by climate disasters. I built a reusable ATM-style donation page meant to integrate with the Actionkit CRM.',
          'tags': ['Django', 'LESS', 'jQuery', 'Actionkit CRM']
      },
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
          'name': 'Connectome',
          'url': 'http://connectome.stanford.edu',
          'image': 'static/projects/vattuonet-connectome.jpg',
          'description': 'Connectome is an interactive visualization tool that displays collaborations within the autism research network. I helped develop a UI to make collaborations and authors easily searchable and filterable.',
          'tags': ['jQuery', 'D3', 'Parse']
      },
      {
          'name': 'Susannah Conway',
          'url': 'http://susannahconway.com',
          'image': 'static/projects/vattuonet-susannah-conway.jpg',
          'description': 'Susannah Conway is a successful UK-based blogger, photographer, and educator. I helped build out a redesign of her website.',
          'tags': ['Wordpress', 'SCSS', 'jQuery', 'Gulp']
      },
      {
          'name': 'Fogcutter',
          'url': 'http://fogcutter-sf.com',
          'image': 'static/projects/vattuonet-fogcutter.jpg',
          'description': 'Fogcutter is an excellent catering service whose goal is to provide "unique, eclectic, and inspired food to the San Francisco Bay Area." Believe me, they do not disappoint.',
          'tags': ['Wordpress']
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