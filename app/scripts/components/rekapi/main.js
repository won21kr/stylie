define([

  'underscore'
  ,'lateralus'

  ,'./models/actor'

  ,'./collections/keyframe-property'

  ,'rekapi'

], function (

  _
  ,Lateralus

  ,ActorModel

  ,KeyframePropertyCollection

  ,Rekapi

) {
  'use strict';

  var Base = Lateralus.Component;

  var RekapiComponent = Base.extend({
    name: 'rekapi'

    ,lateralusEvents: {
      bezierCurveUpdated: function () {
        this.onRekapiTimelineModified();
      }
    }

    ,initialize: function () {
      this.rekapi = new Rekapi(document.body);
      this.setupActor();
    }

    ,onRekapiTimelineModified: function () {
      this.emit('timelineModified', this);
    }

    ,setupActor: function () {
      var newActor = this.rekapi.addActor();
      this.actorModel = this.initModel(ActorModel, {}, {
        rekapiComponent: this
        ,actor: newActor
      });

      this.listenTo(
        this.actorModel
        ,'change'
        ,this.onRekapiTimelineModified.bind(this)
      );
    }

    /**
     * @param {Object} opts Gets passed to Rekapi.DOMRenderer#toString.
     * @return {string}
     */
    ,getCssString: function (opts) {
      var rekapi = this.rekapi;
      var needToAccountForOffset =
        this.lateralus.model.get('cssOrientation') === 'first-keyframe';

      var offset = this.actorModel.getFirstKeyframeOffset();

      if (needToAccountForOffset) {
        this.actorModel.prepareForCssStringCreation(offset);
      }

      var cssString = rekapi.renderer.toString(opts);

      if (needToAccountForOffset) {
        this.actorModel.cleanupAfterCssStringCreation(offset);
      }

      return cssString;
    }
  });

  return RekapiComponent;
});
