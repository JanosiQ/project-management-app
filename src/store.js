import { createStore } from 'vuex'

const store = createStore({
  state: {
    boards: []
  },
  mutations: {
    addBoard(state, board) {
      state.boards.push(board)
    },
    deleteBoard(state, boardIndex) {
      state.boards.splice(boardIndex, 1)
    }
  },
  actions: {
    addBoard(context, board) {
      context.commit('addBoard', board)
    },
    deleteBoard(context, boardIndex) {
      context.commit('deleteBoard', boardIndex)
    }
  },
  getters: {
    boards(state) {
      return state.boards
    }
  }
})

export default store