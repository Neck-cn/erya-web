<template>
  <div id="app">
    <keep-alive>
      <!--          <router-view v-if="$route.meta.keepAlive"></router-view>-->
      <router-view/>
    </keep-alive>
    <!--        <router-view v-if="!$route.meta.keepAlive"></router-view>-->
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
      }
    },
    methods: {}
  }
</script>

<style>
  #app {
    min-width: 1200px;
    background: url('./assets/background.jpg') no-repeat;
    background-size: 100%;
    height: 100vh;
  }

</style>
