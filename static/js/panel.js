// TODO: Why is the down->up transition still kind of buggy
// TODO: Why are down->up and right->left not able to use 100% as initial transformed position 
var Panel = function(name, content) {
    this.name = name;
    this.content = typeof content !== 'undefined' ? content.html : "";
    this.container = '.container';
    this.$container = $(this.container);
    
    this.template = _.template(
        $( "script#panelTemplate" ).html()
    ); 
                    
    this.initialize = function(name,content) {
        this.$container.attr('id', this.name + 'Container');
        this.$container.append(this.template({
            title: this.name,
            content: this.content
        }));

        this.$el = $('.panel#' + this.name);
        var $el = this.$el;

        this.events();
        this.render();
    };

    this.render = function(event) {
        self = this;
        this.enter();

        setTimeout(function() {
            self.$el.addClass('current');
        }, 50);

        
        window.location.hash = this.name;
        cancelAnimationFrame(app.af);
        return this;
    }

    // TODO: This I guess would be where we have WebGL talking to DOM, via an observer?
    this.destroy = function(event) {
        var $el = $('.panel.current.exit');
        if ($el.length <= 0) { return false; };
        $el.remove();
        return this;
    };

    this.enter = function(event) {
        if (event) {
            app.currentPanel.$el.addClass('enter');
        } else {
            this.$el.addClass('enter');    
        }
        return this;
    }

    this.exit = function(event) {
        if (event) {
            app.currentPanel.$el.addClass('exit');
        } else {
            this.$el.addClass('exit');    
        }
        return this;
    }

    // create our Panel
    this.initialize();
}



// Prevent dupe events by unbinding?
// How do I only initialize the event handler if it hasn't been initialized but in an elegant way?
Panel.prototype.events = function() {
    var self = this;

    this.$el.unbind('transitionend');
    this.$el.unbind('DOMNodeInserted');
    
    this.$el.bind('DOMNodeInserted', self.enter);    
    this.$el.on('transitionend', self.destroy);
}


module.exports = Panel;