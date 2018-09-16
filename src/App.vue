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
body {
  margin: 0;
}
</style>
