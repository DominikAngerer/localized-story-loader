(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  plugin: 'localized-story-loader',
  mixins: [window.Storyblok.plugin],
  data: function data() {
    return {
      loadedStories: [],
      type: 'single'
    };
  },
  methods: {
    initWith: function initWith() {
      return {
        value: '',
        values: [],
        type: ''
      };
    }
  },
  events: {
    'plugin:created': function pluginCreated() {
      var _this = this;

      var _locale = 'de';
      if (this.$store && this.$store.model && this.$store.model.story) {
        var _locale = this.$store.model.story.full_slug.slice(0, 2);
      }
      if (['de', 'en'].indexOf(_locale) < 0) {
        _locale = 'de';
      }
      if (!this.schema.options) {
        console.error('localized-story-loader: Define the following options: 0 : token, 1 : starts_with, 2: type (single|multi)');
        return false;
      }
      this.$set('type', this.schema.options && this.schema.options.length >= 2 ? this.schema.options[2].value : 'single');
      jQuery.ajax({
        url: 'https://api.storyblok.com/v1/cdn/stories/?token=' + this.schema.options[0].value + '&starts_with=' + _locale + '/' + this.schema.options[1].value + '/&is_startpage=false&time=' + Date.now() + '&sort_by=name:asc',
        success: function success(response) {
          _this.$set('loadedStories', response.stories);
        }
      });
    },
    'plugin:destroyed': function pluginDestroyed() {}
  },
  watch: {
    'model': {
      handler: function handler(value) {
        this.$emit('changed-model', value);
      },
      deep: true
    }
  }
};
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "<div class=uk-form-row v-if=\"type == 'single'\"><select class=uk-width-1-1 v-model=model.value><option><option v-for=\"loadedStory in loadedStories\" v-bind:value=loadedStory.uuid>{{ loadedStory.name }}</select></div><div class=uk-form-row v-else=\"\"><label class=\"uk-margin-right uk-margin-bottom uk-display-block\" v-for=\"loadedStory in loadedStories\"><input v-model=model.values type=checkbox class=uk-margin-small-right value=\"{{ loadedStory.uuid }}\"> {{ loadedStory.name }}</label></div><input type=hidden v-model=model.type value=\"{{ type }}\">"

},{}],2:[function(require,module,exports){
'use strict';

var _Plugin = require('../Plugin.vue');

var _Plugin2 = _interopRequireDefault(_Plugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.storyblok.field_types[_Plugin2.default.plugin] = _Plugin2.default;

},{"../Plugin.vue":1}]},{},[2]);
