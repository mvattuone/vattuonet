var Posts = function() {
    var Post = require('./Post');

    var self = this;

    this.fetch = function() {
        var self = this;

        if (!self.data) {
            var tumblrAPI = document.createElement('script');
            tumblrAPI.src = 'https://vattuonet.tumblr.com/api/read/json';
            document.head.appendChild(tumblrAPI);

            tumblrAPI.addEventListener('load', function(e) {
                self.data = window.tumblr_api_read.posts;
                self.dispatch(app.currentPanel);
            });
        }
    };

    this.dispatch = function(panel) {
        var posts = [],
            post,
            i;

        for (i=0; i<this.data.length; i++) {
            var args = this.data[i];
            if (!args.tags) {
                post = new Post(args['regular-title'], args['regular-body']);
                posts.push(post.html);
            }
        }

        var html = posts.join("");

        if (panel) {
            panel.el.children[0].innerHTML = html;
        }

        return html;
    };

    return this;

};

module.exports = Posts;
