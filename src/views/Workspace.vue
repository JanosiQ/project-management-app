<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h4>Add Board</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="addBoard">
              <div class="form-group">
                <label for="board-name">Board Name</label>
                <input type="text" class="form-control" id="board-name" v-model="newBoard.name" />
              </div>
              <button type="submit" class="btn btn-primary">Add</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h4>Boards</h4>
          </div>
          <div class="card-body">
            <ul class="list-group">
              <li v-for="(board, index) in boards" :key="index" class="list-group-item d-flex align-items-center">
                <span class="me-auto">{{ board.name }}</span>
                <div class="dropdown">
                  <button class="btn btn-secondary btn-icon" type="button" id="boardOptionsDropdown"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <span class="fas fa-ellipsis-v"></span>
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="boardOptionsDropdown">
                    <li><a class="dropdown-item" href="#" @click="editBoard(board)">Edit name</a></li>
                    <li><a class="dropdown-item" href="#" @click="deleteBoardModal(board)">Delete</a></li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-header">
            <h4>Open Existing Board</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="openBoard()">
              <div class="form-group">
                <label for="board-select">Select Board</label>
                <select class="form-control" id="board-select" v-model="selectedBoard">
                  <option v-for="(board, index) in boards" :key="index" :value="board.id">{{ board.name }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Open</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" id="delete-modal" tabindex="-1" role="dialog" aria-labelledby="delete-modal-label"
      aria-hidden="true" :class="{ 'd-block': showDeleteModal }" @click.self="showDeleteModal = false">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="delete-modal-label">Delete Board</h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this board?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="showDeleteModal = false">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteBoard(); showDeleteModal = false">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { useToast } from "vue-toastification";
export default {
  setup() {
    // Get toast interface
    const toast = useToast();

    // Make it available inside methods
    return { toast }
  },
  data() {
    return {
      boards: [], // Tablice użytkownika
      newBoard: { // Nowa tablica, którą użytkownik dodaje
        name: '', // Nazwa nowej tablicy
      },
      selectedBoard: null, // ID wybranej tablicy
      showDeleteModal: false, // Flaga określająca, czy modal usuwania jest widoczny
      modalBoard: null, // Tablica, która jest wybrana do usunięcia
    };
  },
  created() {
    this.fetchUserBoards(); // Wywołanie metody do pobrania tablic użytkownika przy tworzeniu komponentu
  },
  methods: {
    addBoard() {
      const data = {
        name: this.newBoard.name, // Przygotowanie danych do wysłania - nazwa nowej tablicy
      };
      const token = localStorage.getItem('token'); // Pobranie tokena autoryzacyjnego z local storage
      const headers = {
        Authorization: `Bearer ${token}`, // Ustawienie nagłówka z tokenem
      };
      axios
        .post('https://cabanoss.azurewebsites.net/boards', data, { headers }) // Wywołanie żądania POST, aby dodać nową tablicę
        .then(() => {
          this.newBoard.name = ''; // Zresetowanie wartości pola nazwy nowej tablicy
          this.fetchUserBoards(); // Wywołanie metody do ponownego pobrania tablic użytkownika
          this.toast.success('Board added successfully');
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.status === 404) {
            console.error(error);

            const errorPopup = error.response.data;
            this.errorPopup = errorPopup;
            this.toast.error(errorPopup);
          }
          else if (error.response && error.response.data.errors && error.response.status === 400) {
            const errorPopup = Object.values(error.response.data.errors)
              .map(messages => messages.join('. '))
              .join('. ');
            console.error(error);
            this.errorPopup = errorPopup;
            this.toast.error(errorPopup);
          } 
          else if(error.code === "ERR_NETWORK"){
            console.error(error);
            this.toast.error(error.message);
          }else {
            console.error(error);
            this.toast.error('User does not exist');
          }
        });
    },
    fetchUserBoards() {
      const token = localStorage.getItem('token'); // Pobranie tokena autoryzacyjnego z local storage
      const headers = {
        Authorization: `Bearer ${token}`, // Ustawienie nagłówka z tokenem
      };
      axios
        .get('https://cabanoss.azurewebsites.net/boards', { headers }) // Wywołanie żądania GET, aby pobrać tablice użytkownika
        .then(response => {
          this.boards = response.data; // Przypisanie pobranych tablic do właściwości "boards"
          console.log(response);
        })
        .catch(error => {
          console.error(error);
          this.toast.error('Error fetching user boards');
        });
    },
    openBoard() {
      const board = this.boards.find(b => b.id === this.selectedBoard); // Znalezienie tablicy o wybranym ID
      const boardId = board ? board.id : undefined; // Sprawdzenie, czy tablica została znaleziona
      this.$router.push(`/board/${boardId}`); // Przekierowanie do strony tablicy
    },
    deleteBoardModal(board) {
      this.modalBoard = board; // Przypisanie wybranej tablicy do właściwości "modalBoard"
      this.showDeleteModal = !this.showDeleteModal; // Przełączenie flagi "showDeleteModal" (pokazanie/ukrycie modala)
      console.log('modalBoard', board);
    },
    async editBoard(board) {
      const currentName = board.name; // Aktualna nazwa tablicy
      const newName = prompt("Wpisz nową nazwę:", currentName); // Zapytanie użytkownika o nową nazwę
      if (newName !== null && newName.trim() !== "" && newName !== currentName) {

        const token = localStorage.getItem('token'); // Pobranie tokena autoryzacyjnego z local storage
        const headers = {
          Authorization: `Bearer ${token}`, // Ustawienie nagłówka z tokenem
        };
        const data = {
          name: board.name, // Przygotowanie danych do wysłania - nowa nazwa tablicy
        };
        axios
          .put(`https://cabanoss.azurewebsites.net/boards?boardId=${board.id}`, data, { headers }) // Wywołanie żądania PUT, aby zaktualizować nazwę tablicy
          .then(() => {
            board.name = newName.trim(); // Aktualizacja nazwy tablicy
            this.toast.success('Board name updated successfully');
          })
          .catch(error => {
            console.error(error);
            this.toast.error(error.response.data);
          });
      }
    },
    deleteBoard() {
      const token = localStorage.getItem('token'); // Pobranie tokena autoryzacyjnego z local storage
      const boardId = this.modalBoard.id; // ID tablicy do usunięcia
      const headers = {
        Authorization: `Bearer ${token}`, // Ustawienie nagłówka z tokenem
      };
      axios
        .delete(`https://cabanoss.azurewebsites.net/boards?boardId=${boardId}`, { headers }) // Wywołanie żądania DELETE, aby usunąć tablicę
        .then(() => {
          this.boards = this.boards.filter(board => board.id !== boardId); // Usunięcie tablicy z listy tablic
          this.toast.success('Board deleted successfully');
        })
        .catch(error => {
          console.error(error);
          this.toast.error(error.response.data);
        });
    },
  },
};
</script>

<style>
.btn-icon {
  background-color: transparent !important;
  padding: 0 !important;
  border: none !important;
}
</style>
  