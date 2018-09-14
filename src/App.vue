<template>
  <div id="app">
    <DogLand />
  </div>
</template>

<script>
import DogLand from "./components/DogLand.vue";

export default {
  name: "app",
  components: {
    DogLand
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
</style>
