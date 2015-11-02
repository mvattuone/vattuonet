// TODO: Why is the down->up transition still kind of buggy
// TODO: Why are down->up and right->left not able to use 100% as initial transformed position 
var Panel = function(name, content) {
    this.name = name;
    this.content = typeof content !== 'undefined' ? content.html : "";
    this.container = '.container#panels';
    this.$container = $(this.container);
    
    this.template = _.template(
        $( "script#panelTemplate" ).html()
    ); 
                    
    this.initialize = function(name,content) {
        this.$container.append(this.template({
            title: this.name,
            content: this.content
        }));

        this.el = '.panel#' + this.name;
        this.$el = $('.panel#' + this.name);
        var $el = this.$el;

        this.events();
        this.render();
    };

    this.render = function(event) {
        this.$el.addClass('current');
        window.location.hash = this.name;
        this.enter();
        this.$el.removeClass('enter');
        cancelAnimationFrame(app.af);
        return true;
    }

    // TODO: This I guess would be where we have WebGL talking to DOM, via an observer?
    this.destroy = function(event) {
        var $el = $('.panel.current.exit');
        if ($el.length <= 0) { return false; };
        window.location.hash = "";
        app.render();
        $el.remove();
        return $el;
    };

    this.enter = function(event) {
        this.$el.addClass('enter');
    }

    this.exit = function(event) {
        var $el = $('.panel.current');
        $el.addClass('exit');
    }

    // create our Panel
    this.initialize();
}



// Prevent dupe events by unbinding?
// How do I only initialize the event handler if it hasn't been initialized but in an elegant way?
Panel.prototype.events = function() {
    this.$el.find('button').unbind('click');
    this.$el.unbind('transitionend');
    this.$el.unbind('DOMNodeInserted');
    
    this.$el.bind('DOMNodeInserted', this.enter);
    this.$el.find('.close').on('click', this.exit);
    this.$el.on('transitionend', this.destroy);
}


module.exports = Panel;