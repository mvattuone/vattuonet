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
          'url': 'http://floatmap.us',
          'image': 'static/projects/vattuonet-floatmap.png',
          'description': 'Map that visualizes forecasted changes in extreme weather in the Midwest US. Recieved the Judges’ Choice and Popular Choice awards in the 2014 MIT Climate Colab competition',
          'tags': ['Django', 'BackboneJS', 'Coffeescript', 'D3', 'Grunt']
      },
      {
          'name': 'Fogcutter',
          'url': 'http://fogcutter-sf.com',
          'image': 'static/projects/vattuonet-fogcutter.png',
          'description': 'Fogcutter is an excellent catering service whose goal is to provide "unique, eclectic, and inspired food to the San Francisco Bay Area." Believe me, they do not disappoint.',
          'tags': ['Wordpress']
      },
      {
          'name': '511CC Guaranteed Ride Home',
          'url': 'http://grh.511contracosta.org',
          'image': 'static/projects/vattuonet-grh.png',
          'description': 'Worked with the fine folks of <a href=“http://blinktag.com/”>BlinkTag</a> to assist <a href=“http://511cc.org”>511 Contra Costa</a> and the <a href=“http://wcctac.org/”>West Contra Costa Transportation Advisory Committee</a> in improving the technology behind their Guaranteed Ride Home program. Working closely with a program manager, I replaced a set of Google Forms and Spreadsheets with a SPA to more easily manage and sort member registrations and reimbursement submissions.',
          'tags': ['Django', 'BackboneJS', 'RequireJS', 'Grunt']
      },
      {
          'name': 'Climate Truth',
          'url': 'http://climatetruth.org',
          'image': 'static/projects/vattuonet-climatetruth.png',
          'description': 'Integrated HTML/CSS/JS for ClimateTruth.org into a Django project, utilizing a mix of Postgres and Memcached to render and persist content acquired from the Actionkit CRM.',
          'tags': ['Django', 'Actionkit', 'Postgres', 'Memcached', 'Grunt']
      },
      {
          'name': 'Susannah Conway',
          'url': 'http://susannahconway.com',
          'image': 'static/projects/vattuonet-sc.png',
          'description': 'Worked closely with a <a href="http://chelseydyer.com/">designer</a> to develop a set of mockups and interactive elements into a custom Wordpress theme for a successful online blog. This project was noteworthy in that it was my first attempt at utilizing the <a href="https://roots.io/sage/">Sage Starter Theme</a> for Wordpress -- I would highly recommend giving it a spin.',
          'tags': ['Wordpress', 'SCSS', 'jQuery', 'Gulp']
      },
      {
          'name': 'Connectome',
          'url': 'http://connectome.stanford.edu',
          'image': 'static/projects/vattuonet-connectome.png',
          'description': 'I helped develop an interactive visualization tool that displays collaborations within the autism research network',
          'tags': ['jQuery', 'D3', 'Parse']
      },
      {
          'name': 'Climate Relief',
          'url': 'https://act.climaterelief.org/donate/donate_CAdrought/',
          'image': 'static/projects/vattuonet-crf.png',
          'description': 'I built a reusable ATM-style donation page meant to integrate with the Actionkit CRM.',
          'tags': ['Django', 'LESS', 'jQuery', 'Actionkit']
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