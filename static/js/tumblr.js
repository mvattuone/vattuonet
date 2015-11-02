/**
 * Populates blog with posts that are not tagged (i.e. page content) returned from the Tumblr API
 * @return the blog panel populated with posts
 */

// tumblr = require('Tumblr')
//    Code pertaining to getting Tumblr stuff
//    Tumblr.getPosts() no argument returns all posts
//    Tumblr.getPosts('') empty string returns all posts with no tags
//    Tumblr.getPosts('foo') would return all posts tagged with foo


 getPosts = function() {
  
  /* Tumblr API failwhale */
  var blogPanel = $('#blog.panel'),
      script = document.createElement('script');

  script.src = 'http://vattuonet.tumblr.com/api/read/json';
  document.head.appendChild(script);
    
  script.addEventListener('load', function(e) {
    var posts = window.tumblr_api_read.posts,
        postTemplate = _.template(
          $( "script#postTemplate" ).html()
        );
    
    return postTemplate({
      'title': post['regular-title'],
      'body': post['regular-body']
    });

};


module.exports = {
    getPosts: getPosts,
};