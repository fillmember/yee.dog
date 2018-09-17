<template>
  <div id="app">
    <DogLand />
    <Debug />
  </div>
</template>

<script>
import DogLand from "./components/DogLand.vue";
import Debug from "./components/Debug.vue";

export default {
  name: "app",
  components: {
    DogLand,
    Debug
  }
};
</script>

<style>
body {
  margin: 0;
}
</style>
