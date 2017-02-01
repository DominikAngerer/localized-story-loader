<template>
  <div class="uk-form-row" v-if="data.type == 'single'">
    <select class="uk-width-1-1" v-model="model.value">
        <option></option>
        <option v-for="loadedStory in data.loadedStories" v-bind:value="loadedStory.uuid">{{ loadedStory.name }}</option>
      </select>
  </div>

  <div class="uk-form-row" v-else>
    <label class="uk-margin-right uk-margin-bottom uk-display-inline-block" v-for="loadedStory in data.loadedStories">
      <input v-model="model" type="checkbox" class="uk-margin-small-right" value="{{ loadedStory.uuid }}">
      {{ loadedStory.name }}
    </label>
  </div>
</template>

<script>
  export default {
    plugin: 'localized-story-loaderV2',
    mixins: [window.Storyblok.plugin],
    data: {
      loadedStories: [],
      type: 'single'
    },
    methods: {
      initWith: function () {
        return {
          value: ''
        }
      }
    },
    events: {
      'plugin:created': function () {
        var _locale = 'de';
        if (this.$parent.$parent.$parent.$get('model') && this.$parent.$parent.$parent.$get('model').story) {
          var _locale = this.$parent.$parent.$parent.$get('model').story.full_slug.slice(0, 2);
        }
        if (['de', 'en'].indexOf(_locale) < 0) {
          _locale = 'de';
        }
        if (!this.schema.options) {
          console.error('localized-story-loader: Define the following options: 0 : token, 1 : starts_with, 2: type (multi|single)');
          return false;
        }
        this.$set('data.type', this.schema.options[2].value);
        jQuery.ajax({
          url: 'https://api.storyblok.com/v1/cdn/stories/?token=INwFVCQIlV2S2bhX6ff28gtt&starts_with=news',
          //url: 'https://api.storyblok.com/v1/cdn/stories/?token=' + this.schema.options[0].value + '&starts_with=' + _locale + '/' + this.schema.options[1].value + '/&is_startpage=false&time=' + Date.now(),
          success: (response) => {
            this.$set('data.loadedStories', response.stories);
          }
        });
      },
      'plugin:destroyed': function () {
      }
    },
    watch: {
      'model': {
        handler: function (value) {
          this.$emit('changed-model', value);
        },
        deep: true
      }
    }
  }

</script>