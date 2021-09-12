<template>
  <div id="app">
    <keep-alive>
      <!--          <router-view v-if="$route.meta.keepAlive"></router-view>-->
      <router-view/>
    </keep-alive>
    <!--        <router-view v-if="!$route.meta.keepAlive"></router-view>-->
  </div>
</template>
fds

<script>
  import global from "./api/global";
  export default {
    name: 'App',
    data() {
      return {
      }
    },
    methods: {},
    created() {

      let token= this.$cookies.get("token");

      if(token){
        global.token=token;
        this.$router.replace("/answer");
      }else{
        this.$router.replace("/login");
      }
    }
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
