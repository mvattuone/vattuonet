
Post = function(title,body) {
  this.title = title;
  this.body = body;

  this.template = _.template($("script#postTemplate").html());

  this.initialize = function() {
    this.html = this.template({
      title: this.title,
      body: this.body
    });
    return this.html;
  }

  this.initialize();
}


module.exports = Post;