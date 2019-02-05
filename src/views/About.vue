<template>
  <div style="height: 100%;">
    <v-layout
      v-if="loading"
      class="loader"
      column
      justify-center
      align-center
      fill-height
    >
      <v-progress-circular
        v-if="!error"
        :size="70"
        :width="7"
        color="teal"
        indeterminate
      />

      <div
        v-else
        class="text-xs-center"
      >
        <h5 class="headline">
          Failed to Load
        </h5>
        <span class="">
          Please check your network connection
        </span>
      </div>
    </v-layout>

    <webview
      v-if="!error"
      ref="webview"
      :src="$route.query.url"
      style="height: 100%"
    />


    <v-btn
      v-if="!loading && !error"
      fixed
      bottom
      dark
      right
      ripple
      round
      color="success"
      @click="deleteItem"
    >
      Read
    </v-btn>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loading: true,
      error: false
    };
  },
  mounted() {
    this.$refs.webview.addEventListener('did-finish-load', () => {
      this.loading = false;
    });
    this.$refs.webview.addEventListener('did-fail-load', () => {
      this.loading = true;
      this.error = true;
    });
  },
  methods: {
    deleteItem() {
      console.log(window.opener);
      window.opener.focus();
      window.opener.eval(`deleteItem(${this.$route.query.index})`);
      window.close();
    }
  }
};
</script>

<style>
.loader {
  background-color: #eee;
  position: absolute;
  width: 100%
}
</style>
