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
          'name': 'Float Map',
          'image': 'static/projects/floatmap.png',
          'description': 'Map that visualizes forecasted changes in extreme weather in the Midwest US. Recieved the Judges’ Choice and Popular Choice awards in the 2014 MIT Climate Colab competition',
          'tags': ['Django', 'BackboneJS', 'Coffeescript', 'D3']
      },
      {
          'name': '511CC Guaranteed Ride Home',
          'image': 'static/projects/grh.png',
          'description': 'Overhauled the West Contra Costa County Guaranteed Ride Home Program, replacing a set of Google Forms with a Django/Backbone SPA, featuring authentication and automatic email notifications upon reimbursement submission.',
          'tags': ['Django', 'BackboneJS', 'RequireJS']
      },
      {
          'name': 'Climate Truth',
          'image': 'static/projects/ct.png',
          'description': 'Integrated HTML/CSS/JS for ClimateTruth.org into a Django project, utilizing a mix of Postgres and Memcached to render content acquired from an external REST API.',
          'tags': ['Django', 'Actionkit', 'Postgres', 'Memcached']
      },
      {
          'name': 'Susannah Conway',
          'image': 'static/projects/sc.png',
          'description': 'Worked closely with client and a designer to recreate a series of mockups and interactive elements for a lifestyle blogger',
          'tags': ['Wordpress', 'Roots.io', 'SCSS', 'jQuery']
      },
      {
          'name': 'Connectome',
          'image': 'static/projects/connectome.png',
          'description': 'The Connectome is an interactive visualization tool that allows users to explore the autism research network.',
          'tags': ['jQuery', 'D3']
      },
      {
          'name': 'Climate Relief Fund',
          'image': 'static/projects/crf.png',
          'description': 'Build a reusable ATM-style donation page type to work in conjunction with the Actionkit CRM.',
          'tags': ['Django', 'jQuery', 'Actionkit']
      }
  ];

  this.fetch = function(projects) {
    var projects = [];
    for (i=0; i<this.data.length; i++) {
      var args = this.data[i];
      var project = new Project(args['name'], args['image'], args['description'], args['tags']);
      projects.push(project.html);
    }
    var projectHTML = projects.join("");
    return projectHTML;
  };
  
};


module.exports = Projects;