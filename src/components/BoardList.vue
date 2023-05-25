<template>
    <div class="board-list">
      <h2>Boards</h2>
      <ul>
        <li v-for="(board, index) in boards" :key="index">
          <span @click="goToBoard(board)">{{ board.name }}</span>
          <button @click="toggleModal(index)">Delete</button>
        </li>
      </ul>
      <delete-board-modal
        :show="showDeleteModal"
        :boardIndex="deleteIndex"
        @close="toggleModal"
        @delete="deleteBoard"
      />
    </div>
  </template>
  
  <script>
  import DeleteBoardModal from "@/components/DeleteBoardModal.vue";
  
  export default {
    computed: {
      boards() {
        return this.$store.state.boards;
      },
    },
    components: {
      DeleteBoardModal,
    },
    data() {
      return {
        showDeleteModal: false,
        deleteIndex: null,
      };
    },
    methods: {
      goToBoard(board) {
        this.$router.push({ name: "Board", params: { id: board.id } });
      },
      toggleModal(boardIndex = null) {
        this.showDeleteModal = !this.showDeleteModal;
        this.deleteIndex = boardIndex;
      },
      deleteBoard() {
        if (this.deleteIndex !== null) {
          this.$store.commit("deleteBoard", this.deleteIndex);
          this.showDeleteModal = false;
          this.deleteIndex = null;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h2 {
    margin-top: 0;
  }
  
  ul {
    list-style-type:
  
  none;
  padding: 0;
  }
  
  li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #f8f9fa;
  margin-bottom: 10px;
  }
  
  li span {
  cursor: pointer;
  }
  
  li button {
  background-color: #dc3545;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  }
  
  li button:hover {
  background-color: #c82333;
  }
  </style>