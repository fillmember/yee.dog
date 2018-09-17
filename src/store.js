import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const general = {
  state: {
    debug: true
  },
  mutations: {
    TOGGLE_DEBUG(state, payload) {
      state.debug = payload;
    }
  },
  actions: {}
};

const dog = {
  state: {
    stage: null
  },
  mutations: {
    commitStage(state, payload) {
      state.stage = payload;
    },
    TOGGLE_DEBUG(state, payload) {
      state.stage.debug = payload;
    }
  },
  actions: {},
  getters: {}
};

export default new Vuex.Store({
  modules: {
    general,
    dog
  }
});
