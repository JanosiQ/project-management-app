import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // stan globalny aplikacji
    boards: [], // tablice
    activeBoardIndex: null, // aktywna tablica
  },
  getters: {
    // selektory do pobierania danych ze stanu globalnego
    activeBoard: (state) => state.boards[state.activeBoardIndex],
    activeBoardTasks: (state, getters) => getters.activeBoard ? getters.activeBoard.tasks : [],
  },
  mutations: {
    // mutacje służą do zmiany stanu globalnego aplikacji
    setBoards(state, boards) {
      state.boards = boards;
    },
    setActiveBoardIndex(state, index) {
      state.activeBoardIndex = index;
    },
    createBoard(state, board) {
      state.boards.push(board);
    },
    deleteBoard(state, index) {
      state.boards.splice(index, 1);
      state.activeBoardIndex = null;
    },
    createTask(state, { boardIndex, task }) {
      state.boards[boardIndex].tasks.push(task);
    },
    updateTask(state, { boardIndex, taskIndex, task }) {
      state.boards[boardIndex].tasks.splice(taskIndex, 1, task);
    },
    deleteTask(state, { boardIndex, taskIndex }) {
      state.boards[boardIndex].tasks.splice(taskIndex, 1);
    },
  },
  actions: {
    // akcje służą do wywoływania mutacji w odpowiednim momencie, np. pobierania danych z API
    async fetchBoards({ commit }) {
      // ...
      commit("setBoards", boards);
    },
    // ...
  },
});
