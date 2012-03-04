define(function () {

  var canvas = {};

  canvas.view = Backbone.View.extend({

    'initialize': function (opts) {
      _.extend(this, opts);
      this.app.kapi = new Kapi(this.$el[0], {
          'fps': 60
          ,'height': 400
          ,'width': 500
        });
      var circle = this.createActor();
      this.app.kapi.addActor(circle);
      //TODO: This is sloppy.  The actor will eventually not be a circle, and
      //there may be more than one.
      this.app.config.circle = circle;
      this.app.kapi.canvas_style('background', '#eee');
      this.setKeyframePoints(circle);
      this.initRekapiControls();
    }

    ,'initRekapiControls': function () {
      this.app.kapi.controls = new RekapiScrubber(this.app.kapi);
      this.app.util.updatePath();
    }

    ,'createActor': function () {
      function draw (canvas_context, state) {
        if (this.app.config.isPathShowing
            && this.app.config.prerenderedPath) {
          canvas_context.drawImage(this.app.config.prerenderedPath, 0, 0);
        }

        canvas_context.beginPath();
          canvas_context.arc(
            state.x || 0,
            state.y || 0,
            state.radius || 50,
            0,
            Math.PI*2,
            true);
          canvas_context.fillStyle = state.color || '#444';
          canvas_context.fill();
          canvas_context.closePath();
          return this;
      };

      return new Kapi.Actor({
        'draw': _.bind(draw, this)
        });
    }

    ,'setKeyframePoints': function (actor) {
      actor.keyframe(0,
            _.extend(this.app.config.crosshairs.from.getCenter(), {
          'color': '#777'
          ,'radius': 15
        }))
        .keyframe(this.app.config.initialDuration,
            _.extend(this.app.config.crosshairs.to.getCenter(), {
          'color': '#333'
        }));
    }

  });

  return canvas;

});
