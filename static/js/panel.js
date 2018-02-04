// TODO: Why is the down->up transition still kind of buggy
// TODO: Why are down->up and right->left not able to use 100% as initial transformed position 
var Panel = function(name, content) {
    this.name = name;
    this.content = typeof content === 'object' ? content.html : content;
    this.container = document.querySelector('.container');
    
    this.template = _.template(
        document.querySelector("script#panelTemplate" ).innerHTML
    ); 
                    
    this.initialize = function(name,content) {
        this.container.setAttribute('id', this.name + 'Container');
        this.content = this.template({
            title: this.name,
            content: this.content
        });
        this.container.innerHTML = this.content;

        var el = this.el = document.querySelector('.panel#' + this.name);

        this.events();
        this.render();

        return this;
    };

    this.render = function(event) {
        self = this;
        this.enter();

        setTimeout(function() {
            self.el.classList.add('current');
        }, 50);

        
        window.location.hash = this.name;
        cancelAnimationFrame(app.af);
        return this;
    }

    // TODO: This I guess would be where we have WebGL talking to DOM, via an observer?
    this.destroy = function(event) {
        var el = document.querySelector('.panel.current.exit');
        if (!el || el.length <= 0) { return false; };
        el.remove();
        return this;
    };

    // TODO: I don't really like how we use the app namespace to target
    // the element. Is that something that is a consequence of using 
    // an event handler on an object method???
    this.enter = function(event) {
        if (event) {
            app.currentPanel.el.classList.add('enter');
        } else {
            this.el.classList.add('enter');    
        }
        return this;
    }

    this.exit = function(event) {
        if (event) {
            app.currentPanel.el.classList.add('exit');
        } else {
            this.el.classList.add('exit');    
        }
        return this;
    }

    // create our Panel
    this.initialize(name, content);
    return this;
}



// Prevent dupe events by unbinding?
// How do I only initialize the event handler if it hasn't been initialized but in an elegant way?
Panel.prototype.events = function() {
    var self = this;

    this.el.removeEventListener('transitionend', self.enter);
    this.el.removeEventListener('DOMNodeInserted', self.destroy);
    
    this.el.addEventListener('DOMNodeInserted', self.enter);    
    this.el.addEventListener('transitionend', self.destroy);
}


module.exports = Panel;
