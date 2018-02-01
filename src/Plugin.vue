<template>
  <div class="uk-form-row" v-if="type == 'single'">
    <select class="uk-width-1-1" v-model="model.value">
        <option></option>
        <option v-for="loadedStory in loadedStories" v-bind:value="loadedStory.uuid">{{ loadedStory.name }}</option>
      </select>
  </div>
  <div class="uk-form-row" v-else>
    <label class="uk-margin-right uk-margin-bottom uk-display-block" v-for="loadedStory in loadedStories">
      <input v-model="model.values" type="checkbox" class="uk-margin-small-right" value="{{ loadedStory.uuid }}">
      {{ loadedStory.name }}
    </label>
    <button class="uk-button uk-button-danger uk-button-mini" v-on:click="reset">Reset</button>
  </div>
  <input type="hidden" v-model="model.type" value="{{ type }}">
</template>

<script>
  export default {
    plugin: 'localized-story-loader',
    mixins: [window.Storyblok.plugin],
    data: function () {
      return {
        loadedStories: [],
        type: 'single'
      }
    },
    methods: {
      initWith: function () {
        return {
          value: '',
          values: [],
          type: ''
        }
      },
      reset: function() {
        this.model.value = '';
        this.model.values = [];
      }
    },
    events: {
      'plugin:created': function () {
        var _locale = 'de';
        if (this.$store && this.$store.model && this.$store.model) {
          var _locale = this.$store.model.full_slug.slice(0, 2);
        }
        if (['de', 'en'].indexOf(_locale) < 0) {
          _locale = 'de';
        }
        if (!this.schema.options) {
          console.error('localized-story-loader: Define the following options: 0 : token, 1 : starts_with, 2: type (single|multi)');
          return false;
        }
        this.$set('type', (this.schema.options && this.schema.options.length >= 2) ? this.schema.options[2].value : 'single');
        jQuery.ajax({
          url: 'https://api.storyblok.com/v1/cdn/stories/?token=' + this.schema.options[0].value + '&starts_with=' + _locale + '/' + this.schema.options[1].value + '/&is_startpage=false&time=' + Date.now() +'&sort_by=name:asc',
          success: (response) => {
            this.$set('loadedStories', response.stories);
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
