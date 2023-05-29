<template>
  <div class="wrapper">
    <!-- Display all members asigned to the board -->
    <div class="members-list">
      <ul class="list-unstyled d-flex justify-content-end align-items-center">
        <li v-for="(member, index) in boardMembers" :key="index" class="member me-2">
          <img :src="member.avatar || 'https://via.placeholder.com/30x30'" alt="Avatar" :title="member.login"
            class="rounded-circle me-2 mwh30">
        </li>
        <li>
          <!-- Add new member to the board -->
          <div class="add-member border rounded">
            <div class="add-member-button" @click="showAddMemberForm">
              <span v-if="!showingAddMemberForm" class="fas fa-plus"></span>
            </div>
          </div>
          <div class="modal" :class="{ 'd-block': showingAddMemberForm }">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Add new board member</h4>
                  <button type="button" class="btn-close" @click="showAddMemberForm"></button>
                </div>
                <div class="modal-body">
                  <div class="d-flex form-group mb-2">
                    <input type="text" class="form-control me-2" placeholder="Login" v-model="newMember.login"
                      @keydown.enter="addMember">
                    <button type="button" class="btn btn-primary" @click="addMember">Add</button>
                  </div>
                  <div class="mt-3">
                    <h5>Members assigned to board</h5>
                    <div v-for="member in boardMembers" :key="member.id" class="mb-2 d-flex align-items-center">
                      <img :src="member.avatar || 'https://via.placeholder.com/40x40'" alt="Avatar"
                        class="me-2 rounded-circle mwh40">
                      <div>
                        {{ member.login }} <span v-if="member.login === this.isCurrentUser"> (you)</span><br>
                        <i>{{ member.email }}</i>
                      </div>
                      <div class="dropdown ms-auto">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="roleDropdown"
                          data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          {{ member.isAdmin ? 'Admin' : 'Member' }}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="roleDropdown">
                          <button class="dropdown-item" @click="changeRole(member.id, true)" v-if="!member.isAdmin">Make
                            Admin</button>
                          <button class="dropdown-item" @click="changeRole(member.id, false)" v-if="member.isAdmin">Make
                            Member</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- Board name -->
    <div class="header mb-4 d-flex justify-content-between align-items-center">
      <h1>{{ boardName }}</h1>
    </div>
    <div class="lists">
      <!-- Display all lists -->
      <div v-for="(list, index) in lists" :key="index" class="list mb-4 border rounded">
        <div class="list-header d-flex justify-content-between align-items-center">
          <h4>{{ list.name }}</h4>
          <div class="dropdown">
            <button class="btn btn-secondary btn-icon" type="button" id="boardOptionsDropdown" data-bs-toggle="dropdown"
              aria-expanded="false">
              <span class="fas fa-ellipsis-h"></span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="boardOptionsDropdown">
              <li><a class="dropdown-item" @click="editList(list)">Edit name</a></li>
              <li><a class="dropdown-item" @click="deleteListModal(list)">Delete</a></li>
            </ul>
          </div>
        </div>
        <!-- Display all cards inside list -->
        <div class="cards">
          <div v-for="(card, cardIndex) in list.cards" :key="cardIndex" class="card" @click="showCardDetails(card)"
            @mouseenter="card.hovered = true" @mouseleave="card.hovered = false">
            <div class="card-title p-1">
              {{ card.name }}
            </div>
            <div class="dropdown">
              <button v-if="card.hovered" class="btn btn-secondary btn-icon" type="button" id="boardOptionsDropdown"
                data-bs-toggle="dropdown" aria-expanded="false">
                <span class="fas fa-edit" @click.stop="editCard()"></span>
              </button>
              <ul v-if="card.hovered" class="dropdown-menu" aria-labelledby="boardOptionsDropdown"
                @click.stop="editCard()">
                <li><a class="dropdown-item" @click="editCard(card)">Edit name</a></li>
                <li><a class="dropdown-item" @click="deleteCardModal(card)">Delete</a></li>
              </ul>
            </div>
            <!-- Display all members assigned to the card -->
            <!-- <div class="card-members">
              <span v-for="(member, memberIndex) in card.members" :key="memberIndex" class="member me-2">
                <img :src="member.avatar || 'https://via.placeholder.com/30x30'" :alt="member.login" :title="member.login"
                  class="rounded-circle me-2 mwh30">
              </span>
            </div> -->
          </div>
          <!-- Delete Card Modal -->
          <div class="modal" :class="{ 'd-block': showDeleteCardModal }">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Delete card</h5>
                  <button type="button" class="btn-close"
                    @click="showDeleteCardModal = false; selectedCard = null;"></button>
                </div>
                <div class="modal-body">
                  Are you sure you want to delete this card?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary"
                    @click="showDeleteCardModal = false; selectedCard = null;">Cancel</button>
                  <button type="button" class="btn btn-danger"
                    @click="deleteCard(card); showDeleteCardModal = false;">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Add new card -->
        <div class="add-card mb-3" @click="selectListForNewCard(index)">
          <i class="fas fa-plus me-2"></i> Add new card
        </div>
        <!-- Add Card Modal -->
        <div class="modal" :class="{ 'd-block': showAddCardModal }">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add new card</h5>
                <button type="button" class="btn-close" @click="toggleCardModal"></button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label for="newCardTitle">Card title</label>
                  <input type="text" class="form-control" id="newCardTitle" v-model="newCardTitle"
                    @keydown.enter="addNewCard">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="toggleCardModal">Close</button>
                <button type="button" class="btn btn-primary" @click="addNewCard">Add card</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Add new list -->
      <div class="list add-list mb-4" @click="toggleListModal">
        <i class="fas fa-plus me-2"></i> Add new list
      </div>
    </div>
    <!-- Add List Modal -->
    <div class="modal" :class="{ 'd-block': showAddListModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add new list</h5>
            <button type="button" class="btn-close" @click="toggleListModal"></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="newListTitle">List title</label>
              <input type="text" class="form-control" id="newListTitle" v-model="newListTitle"
                @keydown.enter="addNewList">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="toggleListModal">Close</button>
            <button type="button" class="btn btn-primary" @click="addNewList">Add list</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete List Modal -->
    <div class="modal" :class="{ 'd-block': showDeleteListModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete list</h5>
            <button type="button" class="btn-close"
              @click="showDeleteListModal = false; selectedListIndex = null;"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this list?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary"
              @click="showDeleteListModal = false; selectedListIndex = null;">Cancel</button>
            <button type="button" class="btn btn-danger"
              @click="deleteList(); showDeleteListModal = false;">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Display card details -->
    <div :class="{ 'modal-card': selectedCard }">
      <div class="card-details p-4 rounded mb-4" v-if="selectedCard">
        <div class="card-header d-flex justify-content-between align-items-center mb-3">
          <div v-if="!editingCardTitle" class="card-title h5 mb-0" @click="startEditingCardTitle">{{ selectedCard.name }}
          </div>
          <input v-else type="text" class="card-title h5 mb-0 form-control" v-model="editedCardTitle"
            @blur="saveCardTitle" @keyup.enter="saveCardTitle" @focus="editingCardTitle = true">
          <i class="fas fa-times" @click="hideCardDetails"></i>
        </div>
        <div class="card-details-body">
          <!-- Card Assigned Members -->
          <div class="card-details-section mb-4">
            <h3><i class="fas fa-users"></i> Members </h3>
            <div class="card-members ms-2">
              <span v-for="(member, memberIndex) in selectedCard.members" :key="memberIndex" class="member me-2">
                <img :src="member.avatar || 'https://via.placeholder.com/35x35'" :alt="member.login" :title="member.login"
                  class="rounded-circle me-2 mwh35">
              </span>
              <i class="fas fa-plus-circle member me-2" @click="showAddMembersCard = true"></i>
            </div>
          </div>

          <!-- Board Members -->
          <div class="modal" :class="{ 'modal-members-list': showAddMembersCard }" @hidden="resetModal">
            <div class="modal-body rounded">
              <div class="modal-header">
                <h6 class="modal-title">Board members</h6>
                <button type="button" class="btn-close btn-close-sm" @click="showAddMembersCard = false"
                  aria-label="Close"></button>
              </div>
              <ul class="board-members list-unstyled">
                <li v-for="(member, memberIndex) in boardMembers" :key="memberIndex"
                  @click="toggleMemberSelection(selectedCard.id, member.id)">
                  <img :src="member.avatar || 'https://via.placeholder.com/30x30'" alt="Avatar" :title="member.login"
                    class="rounded-circle me-2 mwh30">
                  <div class="member-name">
                    <div>
                      <span>{{ member.login }}</span>
                    </div>
                  </div>
                  <div>
                    <span v-if="isMemberAssigned(member.id)">
                      <i class="fas fa-check-circle check-icon"
                        @click.stop="removeMemberFromCard(selectedCard.id, member.id)"></i>
                    </span>
                    <span v-else>
                      <i class="fas fa-check-circle uncheck-icon"
                        @click.stop="assignMemberToCard(selectedCard.id, member.id)"></i>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- Due date -->
          <div class="card-details-section mb-4">
            <h3><i class="fas fa-calendar-alt"></i> Due Date</h3>
            <div class="ms-2" v-if="selectedCard.deadline">
              <div v-if="!editingDueDate" class="due-date">
                <span>{{ formatDueDate(selectedCard.deadline) }}</span>
                <button @click="editingDueDate = true" class="btn btn-link">Edit</button>
              </div>
              <div v-else>
                <input type="date" v-model="newDueDate" class="form-control mb-2">
                <button @click="saveDueDate" class="btn btn-primary">Save</button>
                <button @click="editingDueDate = false" class="btn btn-link">Cancel</button>
              </div>
            </div>
            <div v-else-if="!selectedCard.deadline && editingDueDate">
              <input type="date" v-model="newDueDate" class="form-control mb-2">
              <button @click="saveDueDate" class="btn btn-primary">Save</button>
              <button @click="editingDueDate = false" class="btn btn-link">Cancel</button>
            </div>
            <div v-else>
              <button @click="editingDueDate = true" class="btn btn-primary">Add due date</button>
            </div>
          </div>
          <!-- Description -->
          <div class="card-details-section">
            <h3><i class="fas fa-file-alt"></i> Description</h3>
            <div v-if="!isEditingDescription && selectedCard.description" @click="editDescription" class="description">
              <textarea class="form-control description">{{ selectedCard.description }}</textarea>
            </div>
            <div v-else>
              <textarea v-if="isEditingDescription" v-model="newDescription" class="form-control"
                placeholder="Add a description" @click="editDescription"></textarea>
              <div v-else-if="!selectedCard.description" class="edit-desc px-1 mb-4" @click="editDescription">
                Add a description...
              </div>
              <div v-else>
                {{ selectedCard.description }}
              </div>
              <div v-if="isEditingDescription">
                <button @click="saveDescription" class="btn btn-primary mt-2 me-2">Save</button>
                <button @click="cancelEditDescription" class="btn btn-secondary mt-2">Cancel</button>
              </div>
            </div>
          </div>
          <!-- Comments -->
          <div class="card-details-section mb-4">
            <h3><i class="fas fa-comments"></i> Comments</h3>
            <div class="comments">
              <div v-for="(comment, index) in selectedCard.comments" :key="index" class="comment mb-3">
                <div class="comment-header d-flex">
                  <span>{{ comment.author }} - {{ formatDateTime(comment.createdAt) }}</span>
                  <div class="dropdown" v-if="comment.author === this.isCurrentUser">
                    <button class="btn btn-secondary btn-icon" type="button" id="commentOptionsDropdown"
                      data-bs-toggle="dropdown" aria-expanded="false">
                      <span class="fas fa-ellipsis-v me-2"></span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="commentOptionsDropdown">
                      <li><a class="dropdown-item" @click="editComment(comment)">Edit</a></li>
                      <li><a class="dropdown-item" @click="deleteComment(comment)">Delete</a></li>
                    </ul>
                  </div>
                </div>
                <div class="comment-body" v-if="!comment.editing">{{ comment.text }}</div>
                <div class="comment-body" v-else>
                  <textarea v-model="comment.editText" class="form-control mb-2"></textarea>
                  <button class="btn btn-primary" @click="saveComment(comment)">Save</button>
                  <button class="btn btn-link" @click="cancelEdit(comment)">Cancel</button>
                </div>
              </div>
            </div>
            <div class="add-comment mb-3">
              <textarea v-model="newComment" placeholder="Add a comment" class="form-control"></textarea>
              <button @click="addComment" class="btn btn-primary mt-2">Add comment</button>
            </div>
          </div>
          <!-- Checklists -->
          <div class="card-details-section mb-4">
            <div class="card-details-section mb-4" v-for="(checklist, index) in selectedCard.checklists" :key="index">
              <div class="checklist-details d-flex justify-content-between mb-2">
                <h3 style="margin-bottom: 0;">
                  <i class="fas fa-list"></i>{{ checklist.name }}
                </h3>
                <button @click="showConfirmationDialog = true; selectedChecklistIndex = index"
                  class="btn btn-secondary">Delete</button>
                <!-- Confirmation Dialog -->
                <div class="modal" :class="{ 'd-block': showConfirmationDialog }">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Confirm Deletion</h5>
                        <button type="button" class="btn-close" @click="showConfirmationDialog = false"></button>
                      </div>
                      <div class="modal-body">
                        Are you sure you want to delete this checklist?
                      </div>
                      <div class="modal-footer">
                        <button @click="deleteChecklist(selectedChecklistIndex)" class="btn btn-danger">Delete</button>
                        <button @click="resetConfirmationDialog" class="btn btn-secondary">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="checklist-progress-bar mb-2">
                <div class="progress">
                  <div class="progress-bar" :style="{ width: getChecklistProgress(checklist) + '%' }"></div>
                </div>
                <div class="progress-text">{{ Math.floor(getChecklistProgress(checklist)) }}%</div>
              </div>
              <ul class="checklist list-group list-unstyled">
  <li v-for="(item, itemIndex) in checklist.items" :key="itemIndex"
    class="checklist-item list-group-item d-flex" @mouseover="item.showIcons = true"
    @mouseleave="item.showIcons = false">
    <label style="padding: 6px;" :for="'item-' + index + '-' + itemIndex">
      <input type="checkbox" :id="'item-' + index + '-' + itemIndex" v-model="item.isComplete"
        @change="toggleChecklistItem(checklist.id, item.id, item.isComplete)">
    </label>
    <div class="d-flex w-100 justify-content-between">
      <span style="padding: 6px;" :class="{ completed: item.isComplete }">{{ item.description }}</span>
      <span class="icons" v-show="item.showIcons">
        <i class="fas fa-user-plus" @click="fetchCardChecklistItemsMembers(item.id)"></i>
        <!-- Okno modalne z listą użytkowników przypisanych do elementu checklisty -->
        <div class="modal" v-if="item.showUserModal" :class="{ 'modal-members-list items': item.showUserModal }"
          @mouseleave="item.showUserModal = false">
          <div class="modal-body rounded">
            <div class="modal-header">
              <h6 class="modal-title">Assigned Users</h6>
              <button type="button" class="btn-close btn-close-sm" @click="item.showUserModal = false"
                aria-label="Close"></button>
            </div>
            <ul class="assigned-users list-unstyled item">
              <li v-for="user in boardMembers" :key="user.id">
                <div class="user-info">
                  <img :src="user.avatar || 'https://via.placeholder.com/30x30'" alt="Avatar"
                    :title="user.login" class="rounded-circle me-2 mwh30">
                  <span>{{ user.login }}</span>
                </div>
                <div>
                  <i v-if="isUserAssigned(item, user)" class="fas fa-check-circle check-icon"
                    @click="removeUserFromItem(item, user)"></i>
                  <i v-else class="fas fa-check-circle uncheck-icon"
                    @click="assignUserToItem(item, user)"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- -->
        <i class="fas fa-ellipsis-h" @click="showOptionsDropdown(index)"></i>
      </span>
    </div>
  </li>
</ul>
            </div>
            <div v-if="!addingChecklist">
              <button @click="addingChecklist = true" class="btn btn-primary mt-2">Add a checklist</button>
            </div>
            <div v-else>
              <input v-model="newChecklistTitle" placeholder="Add a new checklist title" class="form-control mb-2"
                @keydown.enter="addChecklist">
              <button @click="addChecklist" class="btn btn-primary">Create checklist</button>
              <button @click="addingChecklist = false" class="btn btn-link">Cancel</button>
            </div>

            <!-- Attachments -->
            <div class="card-details-section mb-4">
              <h3><i class="fas fa-paperclip"></i> Attachments</h3>
              <div class="attachments">
                <div v-for="(attachment, index) in selectedCard.attachments" :key="index" class="attachment mb-3">
                  <div class="attachment-body">
                    <a :href="attachment.path" target="_blank">{{ attachment.name }}</a>
                    <div class="attachment-actions">
                      <i class="fas fa-pencil-alt edit-icon" @click="editAttachment(attachment)"></i>
                      <i class="fas fa-times remove-icon" @click="removeAttachment(attachment.id)"></i>
                    </div>
                  </div>
                </div>
                <div class="add-attachment mb-3">
                  <div class="attachment-info">
                    <input v-model="attachmentName" type="text" placeholder="Attachment name" class="form-control mb-2">
                    <input v-model="attachmentPath" type="text" placeholder="Attachment path" class="form-control mb-2">
                  </div>
                  <button v-if="!isEditing" @click="uploadAttachment" class="btn btn-primary">Add Attachment</button>
                  <button v-if="isEditing" @click="uploadAttachment" class="btn btn-primary">Edit Attachment</button>
                </div>
              </div>
            </div>
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
      editingCardTitle: false,
      editedCardTitle: '',
      boardName: '',
      dueDate: null,
      // new
      newListTitle: '',
      newCardTitle: '',
      newDueDate: null,
      newDescription: '',
      newComment: '',
      newChecklistTitle: '',
      newItemText: [],
      // is
      isEditingDescription: false,
      isEditing: false,
      isCurrentUser: null,
      editedAttachmentId: null,
      // selected
      selectedList: null,
      selectedCard: false,
      selectedChecklist: null,
      selectedChecklistItem: null,
      selectedChecklistIndex: null,
      // show
      showAddListModal: false,
      showConfirmationDialog: false,
      showAddCardModal: false,
      showCardDetailsModal: false,
      showDeleteListModal: false,
      showDeleteCardModal: false,
      showingAddMemberForm: false,
      showOptionsDropdownIndex: null,
      showAddMembersCard: false,
      showAddMembersCardCheckListItem: false,
      showAssignedUsersDialog: false, // zmienna do kontrolowania wyświetlania modala
      showIcons: null,
      editingDueDate: false,
      attachmentName: '',
      attachmentPath: '',
      // adding
      addingChecklist: false,
      addingItem: [],
      boardMembers: [],
      newMember: {
        login: '',
        avatar: ''
      },
      boards: [],
      lists: [],
      cards: [],
      cardLists: [],
      cardComments: [],
      cardChecklists: [],
      cardAttachments: [],
      assignedUsers: [], // tablica przechowująca przypisanych użytkowników
      modalList: null // Lista, która jest wybrana do usunięcia

    }
  },
  mounted() {
    const boardId = this.$route.params.boardId; // Odczytanie ID tablicy z parametrów routingu
    this.fetchLists(boardId); // Wywołanie funkcji fetchLists() z przekazanym ID tablicy
    this.fetchBoardMembers(boardId);
    this.fetchBoardName(boardId);
  },
  methods: {
    getToken() {
      return localStorage.getItem('token'); // Pobranie tokenu autoryzacyjnego z local storage
    },
    async fetchBoardMembers(boardId) {
      try {
        const token = this.getToken();
        const response = await axios.get(`https://cabanoss.azurewebsites.net/members/boards?boardId=${boardId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.boardMembers = response.data;
        console.log('Użytkownicy przypisani do danej tablicy', response);
        this.isCurrentUser = localStorage.getItem('login');
      } catch (error) {
        console.error('Failed to fetch board members:', error);
      }
    },
    async fetchBoardName(boardId) {
      try {
        const token = this.getToken();
        const response = await axios.get(`https://cabanoss.azurewebsites.net/boards/${boardId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.login = localStorage.getItem('login');
        const board = response.data;
        this.boardName = board.name;
        console.log('Nazwa danej tablicy: ', response);
      } catch (error) {
        console.error('Failed to fetch board name:', error);
        // Obsłuż błąd w przypadku niepowodzenia pobrania nazwy tablicy
      }
    },
    async fetchLists(boardId) {
      try {
        const token = this.getToken();
        const response = await axios.get(`https://cabanoss.azurewebsites.net/lists/boards?boardId=${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.lists = response.data;
        console.log('Listy w danej tablicy', response);

        this.lists.forEach(list => {
          const listId = list.id; // Przypisz listId dla każdej listy
          if (listId) {
            this.fetchCards(listId); // Wywołaj metody fetchCards z przekazanym listId
          } else {
            console.error('Failed to fetch lists: Invalid listId');
          }
        });
      } catch (error) {
        console.error('Failed to fetch lists:', error);
      }
    },
    async fetchCards(listId) {
      try {
        const token = this.getToken();
        const response = await axios.get(`https://cabanoss.azurewebsites.net/cards/lists?listId=${listId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const list = this.lists.find(list => list.id === listId); // Znalezienie odpowiedniej listy
        if (list) {
          list.cards = response.data; // Przypisanie kart do właściwości cards w liście
        } else {
          console.error('Failed to fetch cards: Invalid listId');
        }
      } catch (error) {
        console.error('Failed to fetch cards:', error);
      }
    },
    async fetchCardMembers(cardId) {
      try {
        const token = this.getToken();
        const response = await axios.get(`https://cabanoss.azurewebsites.net/members/cards?cardId=${cardId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Znajdź kartę na podstawie cardId
        const card = this.lists.flatMap(list => list.cards).find(card => card.id === cardId);

        if (card) {
          card.members = response.data;
          console.log('Członkowie karty pobrani z serwera:', card.members);
        } else {
          console.error('Failed to fetch card members: Invalid cardId');
        }
      } catch (error) {
        console.error('Failed to fetch card members:', error);
      }
    },
    async fetchCardComments(cardId) {
      try {
        const token = this.getToken();
        const response = await axios.get(`https://cabanoss.azurewebsites.net/comments/cards?cardId=${cardId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Znajdź kartę na podstawie cardId
        const card = this.lists.flatMap(list => list.cards).find(card => card.id === cardId);

        if (card) {
          card.comments = response.data;
          console.log('Komentarze pobrane z serwera: ', card.comments)
        } else {
          console.error('Failed to fetch card comments: Invalid cardId');
        }
      } catch (error) {
        console.error('Failed to fetch card comments:', error);
      }
    },
    async fetchCardChecklists(cardId) {
      try {
        const token = this.getToken();
        const response = await axios.get(`https://cabanoss.azurewebsites.net/tasks/cards?cardId=${cardId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Znajdź kartę na podstawie cardId
        const card = this.lists.flatMap(list => list.cards).find(card => card.id === cardId);

        if (card) {
          card.checklists = response.data;
          console.log('Checklisty pobrane z serwera:', card.checklists);
        } else {
          console.error('Failed to fetch card details: Invalid cardId');
        }
      } catch (error) {
        console.error('Failed to fetch card details:', error);
      }
    },
    async fetchCardChecklistItems(checklistId) {
      try {
        const token = this.getToken();
        const response = await axios.get(`https://cabanoss.azurewebsites.net/elements/tasks?taskId=${checklistId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Znajdź checklistę na podstawie checklistId
        const checklist = this.selectedCard.checklists.find(checklist => checklist.id === checklistId);

        if (checklist) {
          // Aktualizuj elementy checklist
          checklist.items = response.data.map(item => ({
            id: item.id,
            description: item.description,
            isComplete: item.isComplete
          }));

          console.log('Elementy checklist pobrane z serwera:', checklist.items);
        } else {
          console.error('Failed to fetch card checklist items: Invalid checklistId');
        }
      } catch (error) {
        console.error('Failed to fetch card checklist items:', error);
      }
    },
    async fetchCardChecklistItemsMembers(elementId) {
      try {
        const token = this.getToken();
        const response = await axios.get(`https://cabanoss.azurewebsites.net/members/elements?elementId=${elementId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const checklistItem = this.selectedCard.checklists
          .flatMap(checklist => checklist.items)
          .find(item => item.id === elementId);

        if (checklistItem) {
          checklistItem.assignedUsers = response.data;
          checklistItem.showUserModal = true;
          console.log('Przypisani użytkownicy elementu checklisty pobrani z serwera:', checklistItem.assignedUsers);
        } else {
          console.error('Failed to fetch checklist item members: Invalid elementId');
        }
      } catch (error) {
        console.error('Failed to fetch checklist item members:', error);
      }
    },
    async fetchCardAttachments(cardId) {
      try {
        const token = this.getToken();
        const response = await axios.get(`https://cabanoss.azurewebsites.net/attachments/cards?cardId=${cardId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Znajdź kartę na podstawie cardId
        const card = this.lists.flatMap(list => list.cards).find(card => card.id === cardId);

        if (card) {
          card.attachments = response.data;
          console.log('Załączniki pobrane z serwera: ', card.attachments);
        } else {
          console.error('Failed to fetch card attachments: Invalid cardId');
        }
      } catch (error) {
        console.error('Failed to fetch card attachments:', error);
      }
    },
    startEditingCardTitle() {
      this.editedCardTitle = this.selectedCard.name;
      this.editingCardTitle = true;
    },
    saveCardTitle() {
      const cardId = this.selectedCard.id;
      const newTitle = this.editedCardTitle;
      const token = this.getToken();

      // Wysłanie zaktualizowanego tytułu karty do API
      axios
        .put(`https://cabanoss.azurewebsites.net/cards?cardId=${cardId}`, { name: newTitle }, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          // Zaktualizowanie nazwy karty w danych komponentu
          this.selectedCard.name = newTitle;
          this.editingCardTitle = false;
          console.log(response);
        })
        .catch(error => {
          console.error('Failed to update card title:', error);
        });
    },
    showAddMemberForm() {
      this.showingAddMemberForm = !this.showingAddMemberForm;
      this.newMember.login = '';
    },
    addMember() {
      const boardId = this.$route.params.boardId;
      const login = this.newMember.login;
      const token = this.getToken();

      // Pobieranie danych użytkowników
      axios
        .get(`https://cabanoss.azurewebsites.net/users/all?searchingPhrase=${login}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          const data = response.data;
          console.log('Pobrani użytkownicy:', response);
          if (data && Array.isArray(data)) {
            const users = data;
            const user = users.find(u => u.login === login);

            if (user) {
              const userId = user.id;

              // Tworzenie nowego członka tablicy za pomocą API
              axios
                .post(`https://cabanoss.azurewebsites.net/members/boards/${boardId}?userId=${userId}`, null, { headers: { Authorization: `Bearer ${token}` } })
                .then(response => {
                  const newMember = response.data;
                  this.toast.success('Member added successfully');
                  // Dodawanie nowego członka do listy boardMembers
                  this.boardMembers.push(newMember);

                  // Resetowanie pól formularza
                  this.newMember.login = '';

                  // Zamykanie formularza dodawania członka
                  this.showingAddMemberForm = false;
                  this.fetchBoardMembers(this.$route.params.boardId);
                })
                .catch(error => {
                  this.toast.error('Failed to add member');
                  console.error('Failed to add member:', error);
                });
            } else {
              this.toast.error('User not found');
            }
          } else {
            this.toast.error('Invalid user data format');
          }
        })
        .catch(error => {
          console.error('Failed to fetch users:', error);
        });
    },
    async changeRole(userId, isAdmin) {
      try {
        const token = this.getToken();
        const boardId = this.$route.params.boardId;
        const url = `https://cabanoss.azurewebsites.net/members/boards/${boardId}?userId=${userId}`;
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Ustawienie nagłówka Content-Type na application/json
        };
        const data = isAdmin ? 0 : 1; // Zamień true na 0, a false na 1

        const response = await axios.patch(url, JSON.stringify(data), { headers });
        this.toast.success('Role has been changed');
        console.log('po patchu', response);
        // Pomyślnie zaktualizowano rolę użytkownika
        // Wykonaj odpowiednie operacje po zaktualizowaniu roli
        this.fetchBoardMembers(this.$route.params.boardId);
      } catch (error) {
        this.toast.error(error.message);
        console.error('Failed to change user role:', error);
        // Obsłuż błąd w przypadku niepowodzenia zaktualizowania roli użytkownika
      }
    },
    // Metoda przełączająca widoczność modalnego okna dodawania listy
    toggleListModal() {
      this.showAddListModal = !this.showAddListModal
    },
    // Metoda przełączająca widoczność modalnego okna dodawania karty
    toggleCardModal() {
      this.showAddCardModal = !this.showAddCardModal
    },
    // Metoda przełączająca widoczność modalnego okna z pytaniem o usunięcie listy
    deleteCardModal(card) {
      this.modalCard = card; // Przypisanie wybranej listy do właściwości "modalList"
      this.showDeleteCardModal = !this.showDeleteCardModal; // ustawiamy zmienną showDeleteCardModal na przeciwną wartość
      console.log('modalCard', card);
    },
    // Metoda przełączająca widoczność modalnego okna z pytaniem o usunięcie listy
    deleteListModal(list) {
      this.modalList = list; // Przypisanie wybranej listy do właściwości "modalList"
      this.showDeleteListModal = !this.showDeleteListModal; // ustawiamy zmienną showDeleteListModal na przeciwną wartość
      console.log('modalList', list);
    },
    // Metoda dodająca nową listę
    addNewList() {
      const newList = {
        boardId: this.$route.params.boardId,
        name: this.newListTitle
      };
      const token = this.getToken();
      axios
        .post(`https://cabanoss.azurewebsites.net/lists?boardId=${this.$route.params.boardId}`, newList, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          newList.id = response.data.id; // Przypisanie ID utworzonej listy z odpowiedzi API
          this.newListTitle = ""; // Wyczyszczenie pola tytułu nowej listy
          this.showAddListModal = false; // Ukrycie modalu dodawania listy
          this.fetchLists(this.$route.params.boardId);
          console.log('List added successfully', response);
        })
        .catch(error => {
          if (error.response && error.response.status === 400 && error.response.data.errors) {
            const errorPopup = Object.values(error.response.data.errors)
              .map(messages => messages.join('. '))
              .join('. ');
            console.error(error);
            this.errorPopup = errorPopup;
            this.toast.error(errorPopup);
          } else if (error.code === "ERR_NETWORK") {
            console.error(error);
            this.toast.error(error.message);
          } else {
            console.error(error);
            this.toast.error('Error creating account');
          }
        });
    },
    // Metoda edytująca nazwę listy
    editList(list) {
      this.selectedCard = null;
      // Pobieramy aktualną nazwę listy
      const currentTitle = list.name;

      // Wyświetlamy okno dialogowe z polem do edycji nazwy
      const newTitle = prompt("Enter new title:", currentTitle);

      // Jeśli użytkownik kliknął "OK" i wpisał nową nazwę, aktualizujemy nazwę listy
      if (newTitle !== null && newTitle.trim() !== "" && newTitle !== currentTitle) {
        const listId = list.id; // Pobieramy ID listy
        list.name = newTitle.trim(); // Aktualizujemy nazwę listy 
        const token = this.getToken(); // Pobieramy token uwierzytelniający

        // Tworzymy obiekt z nowymi danymi listy
        const updatedList = {
          id: listId,
          name: newTitle.trim()
        };

        // Wywołujemy zapytanie PUT do odpowiedniego endpointu API
        axios
          .put(`https://cabanoss.azurewebsites.net/lists?listId=${listId}`, updatedList, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(() => {
            console.log('List name updated successfully');
          })
          .catch(error => {
            if (error.response && error.response.status === 400 && error.response.data.errors) {
              const errorPopup = Object.values(error.response.data.errors)
                .map(messages => messages.join('. '))
                .join('. ');
              console.error(error);
              this.errorPopup = errorPopup;
              this.toast.error(errorPopup);
            } else if (error.code === "ERR_NETWORK") {
              console.error(error);
              this.toast.error(error.message);
            } else {
              console.error(error);
              this.toast.error('Error creating account');
            }
          });
      }
    },
    deleteList() {
      const token = this.getToken(); // Pobieramy token uwierzytelniający
      const listId = this.modalList.id// Pobieramy ID listy do usunięcia

      // Wywołujemy zapytanie DELETE do odpowiedniego endpointu API
      axios
        .delete(`https://cabanoss.azurewebsites.net/lists?listId=${listId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          // Usuwamy listę z tablicy lokalnej po jej indeksie
          this.lists = this.lists.filter(list => list.id !== listId); // Usunięcie listy z listy list
        })
        .catch(error => {
          console.error('Failed to delete list:', error);
        });
    },
    // Metoda dodająca nową kartę
    async addNewCard() {
      const title = this.newCardTitle;
      const listId = this.lists[this.selectedListIndex].id;
      const token = this.getToken();
      const newCard = {
        name: title,
        listId: listId,
        description: '',
      };
      axios
        .post(`https://cabanoss.azurewebsites.net/cards/lists?listId=${listId}`, newCard, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          this.lists[this.selectedListIndex].cards.push(newCard);
          this.newCardTitle = '';
          this.showAddCardModal = false;
          this.fetchCards(this.lists[this.selectedListIndex].id);
          console.log('Successfully added card:', response);
        })
        .catch(error => {
          const errorPopup = Object.values(error.response.data.errors)
            .map(messages => messages.join('. '))
            .join('. ');
          console.error(error);
          this.errorPopup = errorPopup;
          this.toast.error(errorPopup);
          console.error('Failed to add card:', error);
        });
    },
    editCard(card) {
      this.selectedCard = null;
      if (card) {
        const currentName = card.name;
        const newName = prompt("Enter new card name:", currentName);
        console.log('Po otworzeniu prompta', card)

        if (newName !== null && newName.trim() !== "" && newName !== currentName) {
          const cardId = card.id;
          card.name = newName.trim();
          const token = this.getToken();

          const updatedCard = {
            id: cardId,
            name: newName.trim()
          };

          axios
            .put(`https://cabanoss.azurewebsites.net/cards?cardId=${cardId}`, updatedCard, {
              headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
              console.log('Card name updated successfully', response);
            })
            .catch(error => {
              console.error('Failed to update card:', error);
            });
        }
      }
    },
    deleteCard() {
      const token = this.getToken(); // Pobieramy token uwierzytelniający
      const cardId = this.modalCard.id; // Pobieramy ID karty do usunięcia
      this.selectedCard = null;
      // Wywołujemy zapytanie DELETE do odpowiedniego endpointu API
      axios
        .delete(`https://cabanoss.azurewebsites.net/cards?cardId=${cardId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          this.fetchLists(this.$route.params.boardId);
        })
        .catch(error => {
          console.error('Failed to delete card:', error);
        });
    },
    // Metoda wyboru listy do dodania nowej karty
    selectListForNewCard(listIndex) {
      this.selectedListIndex = listIndex;
      this.showAddCardModal = true;
    },

    addMemberToCard(memberId) {
      this.selectedCard.members.push(memberId);
    },
    isMemberAssigned(memberId) {
      return this.selectedCard.members && this.selectedCard.members.some(member => member.id === memberId);
    },

    async toggleMemberSelection(cardId, memberId) {
      try {
        const token = this.getToken();

        if (this.isMemberAssigned(memberId)) {
          await this.removeMemberFromCard(cardId, memberId, token);
        } else {
          await this.assignMemberToCard(cardId, memberId, token);
        }

        // Pobierz aktualizacje członków karty
        await this.fetchCardMembers(cardId);
      } catch (error) {
        console.error('Failed to toggle member selection:', error);
      }
    },

    async removeMemberFromCard(cardId, userId) {
      const token = this.getToken();
      try {
        await axios.delete(`https://cabanoss.azurewebsites.net/members/cards/${cardId}?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await this.fetchCardMembers(cardId); // Aktualizuj listę członków karty
      } catch (error) {
        console.error('Failed to remove member from card:', error);
      }
    },

    async assignMemberToCard(cardId, userId) {
      const token = this.getToken();
      try {
        await axios.post(`https://cabanoss.azurewebsites.net/members/cards/${cardId}?userId=${userId}`, null, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await this.fetchCardMembers(cardId);// Aktualizuj listę członków karty

      } catch (error) {
        console.error('Failed to assign member to card:', error);
      }
    },
    // Metoda do zapisywania terminu zakończenia
    async saveDueDate() {
      if (!this.newDueDate) {
        this.toast.info('Please select a due date');
        return;
      }
      try {
        const token = this.getToken();
        const formattedDate = new Date(this.newDueDate).toISOString().split('T')[0];
        const response = await axios.patch(
          `https://cabanoss.azurewebsites.net/cards?cardId=${this.selectedCard.id}`, JSON.stringify(formattedDate),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        // Po zapisaniu nowej daty, zaktualizuj wartość w obiekcie selectedCard
        this.selectedCard.deadline = formattedDate;

        // Zakończ edycję
        this.editingDueDate = false;
        console.log('dodano due date', response);

      } catch (error) {
        console.error('Failed to save due date:', error);
      }
    },
    //Metoda edytująca opis karty
    editDescription() {
      this.isEditingDescription = true;
      if (this.isEditingDescription && this.selectedCard.description) {
        this.newDescription = this.selectedCard.description;
      } else {
        this.newDescription = this.newDescription || '';
      }
    },
    // Metoda zamykająca edytowanie opisu karty
    cancelEditDescription() {
      this.isEditingDescription = false;
      this.newDescription = '';
    },
    // Metoda zapisująca opis karty
    saveDescription() {
      const newDescription = this.newDescription.trim(); // Pobieramy wprowadzoną deskrypcję karty

      if (newDescription !== '') {
        const cardId = this.selectedCard.id; // Pobieramy ID karty
        const token = this.getToken(); // Pobieramy token uwierzytelniający

        // Tworzymy obiekt z nową deskrypcją karty
        const updatedCard = {
          id: cardId,
          description: newDescription
        };

        // Wywołujemy zapytanie PUT do odpowiedniego endpointu API
        axios
          .put(`https://cabanoss.azurewebsites.net/cards?cardId=${cardId}`, updatedCard, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(() => {
            console.log('Card description updated successfully');
            this.selectedCard.description = newDescription; // Aktualizujemy deskrypcję karty w komponencie
            this.newDescription = ''; // Resetujemy pole wprowadzania opisu
            this.isEditingDescription = false; // Wyłączamy tryb edycji opisu
          })
          .catch(error => {
            console.error('Failed to update card description:', error);
          });
      }
    },
    // Metoda wyświetlająca szczegóły karty
    showCardDetails(card) {
      this.selectedCard = card;
      const cardId = this.selectedCard.id;

      this.fetchCardMembers(cardId).then(() => {
        console.log('showCardDetails: Użytkownicy wybranej karty', card.members);
      });

      this.fetchCardComments(cardId).then(() => {
        console.log('showCardDetails: Komentarze wybranej karty', card.comments);
      });

      this.fetchCardChecklists(cardId).then(() => {
        console.log('showCardDetails: Checklisty wybranej karty', card.checklists);

        // Utwórz tablicę z żądaniami fetchCardChecklistItems
        const checklistItemRequests = card.checklists.map(checklist => this.fetchCardChecklistItems(checklist.id));

        // Wykonaj wszystkie żądania asynchroniczne i oczekuj na ich zakończenie
        Promise.all(checklistItemRequests)
          .then(() => {
            // Wykorzystaj zaktualizowane dane checklist
            console.log('showCardDetails: Wszystkie elementy checklist:', card.checklists.flatMap(checklist => checklist.items));
          })
          .catch(error => {
            console.error('Failed to fetch card checklist items:', error);
          });
      });

      this.fetchCardAttachments(cardId).then(() => {
        console.log('showCardDetails: Załączniki wybranej karty', card.attachments);
      });
    },
    // Metoda ukrywająca modal ze szczegółami karty
    hideCardDetails() {
      this.selectedCard = null,
        this.editingDueDate = false,
        this.addingChecklist = false,
        this.newTaskTitle = '',
        this.newTaskDescription = '',
        this.newDescription = '',
        this.newChecklistTitle = '',
        this.newComment = '',
        this.showAddMembersCard = false,
        this.showAddMembersCardCheckListItem = false,
        this.isEditingDescription = false,
        this.editingCardTitle = false,
        this.newItemText = [],
        this.attachment = []
    },
    async addComment() {
      try {
        const token = this.getToken();
        const cardId = this.selectedCard.id;
        const response = await axios.post(
          `https://cabanoss.azurewebsites.net/comments/cards?cardId=${cardId}`,
          { text: this.newComment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newComment = response.data;

        // Sprawdź, czy tablica selectedCard.comments istnieje
        if (!this.selectedCard.comments) {
          this.selectedCard.comments = [];
        }

        this.selectedCard.comments.push(newComment);
        this.newComment = '';

        // Odśwież listę komentarzy dla danej karty
        await this.fetchCardComments(cardId);
      } catch (error) {
        const errorPopup = Object.values(error.response.data.errors)
          .map(messages => messages.join('. '))
          .join('. ');
        console.error(error);
        this.errorPopup = errorPopup;
        this.toast.error(errorPopup);
      }
    },
    async saveComment(comment) {
      try {
        const token = this.getToken();
        const commentId = comment.id;
        const response = await axios.put(
          `https://cabanoss.azurewebsites.net/comments?commentId=${commentId}`,
          { text: comment.editText },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Aktualizuj tekst komentarza
        comment.text = comment.editText;
        comment.editing = false;

        // Wyświetl powiadomienie o sukcesie
        this.toast.success('Comment updated successfully');
      } catch (error) {
        const errorPopup = Object.values(error.response.data.errors)
          .map((messages) => messages.join('. '))
          .join('. ');
        console.error(error);
        this.errorPopup = errorPopup;
        this.toast.error(errorPopup);
      }
    },
    async deleteComment(comment) {
      try {
        const token = this.getToken();
        const commentId = comment.id;
        const response = await axios.delete(`https://cabanoss.azurewebsites.net/comments?commentId=${commentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Usuń komentarz z tablicy selectedCard.comments
        const commentIndex = this.selectedCard.comments.findIndex((c) => c.id === commentId);
        if (commentIndex !== -1) {
          this.selectedCard.comments.splice(commentIndex, 1);
        }

        // Wyświetl powiadomienie o sukcesie
        this.toast.success('Comment deleted successfully');
      } catch (error) {
        const errorPopup = Object.values(error.response.data.errors)
          .map((messages) => messages.join('. '))
          .join('. ');
        console.error(error);
        this.errorPopup = errorPopup;
        this.toast.error(errorPopup);
      }
    },
    editComment(comment) {
      comment.editing = true;
      comment.editText = comment.text;
    },
    cancelEdit(comment) {
      comment.editing = false;
    },
    formatDateTime(dateTime) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(dateTime).toLocaleString(undefined, options);
    },
    formatDueDate(dateTime) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateTime).toLocaleString(undefined, options);
    },
    // Metoda dodająca checklistę do karty
    async addChecklist() {
      if (this.newChecklistTitle) {
        try {
          const token = this.getToken();
          const url = `https://cabanoss.azurewebsites.net/tasks/cards?cardId=${this.selectedCard.id}`;
          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          };
          const data = {
            name: this.newChecklistTitle,
          };

          const response = await axios.post(url, data, { headers });

          this.newChecklistTitle = '';
          this.addingChecklist = false;
          this.fetchCardChecklists(this.selectedCard.id).then(() => {
            console.log('Ponownie pobrane checklisty wybranej karty', this.selectedCard.checklists);

            // Utwórz tablicę z żądaniami fetchCardChecklistItems
            const checklistItemRequests = this.selectedCard.checklists.map(checklist => this.fetchCardChecklistItems(checklist.id));

            // Wykonaj wszystkie żądania asynchroniczne i oczekuj na ich zakończenie
            Promise.all(checklistItemRequests)
              .then(() => {
                // Wykorzystaj zaktualizowane dane checklist
                console.log('Ponownie pobrane elementy checklist:', this.selectedCard.checklists.flatMap(checklist => checklist.items));
              })
              .catch(error => {
                console.error('Błąd podczas pobierania elementów checklist:', error);
              });
          });

        } catch (error) {
          const errorPopup = Object.values(error.response.data.errors)
            .map(messages => messages.join('. '))
            .join('. ');
          console.error(error);
          this.errorPopup = errorPopup;
          this.toast.error(errorPopup);
          console.error('Failed to add checklist:', error);
        }
      }
    },
    async deleteChecklist(index) {
      try {
        const checklist = this.selectedCard.checklists[index];
        const taskId = checklist.id; // Załóż, że identyfikator checklisty jest przechowywany w polu "id"
        const token = this.getToken();
        // Wykonaj żądanie DELETE do API
        await axios.delete(`https://cabanoss.azurewebsites.net/tasks?taskId=${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Po udanym usunięciu checklisty, usuń ją również z tablicy w komponencie
        this.selectedCard.checklists.splice(index, 1);
        this.toast.success('Checklist deleted successfuly');
        // Zresetuj stan dialogu potwierdzającego
        this.resetConfirmationDialog();
      } catch (error) {
        console.error('Błąd podczas usuwania checklisty:', error);
      }
    },

    resetConfirmationDialog() {
      this.showConfirmationDialog = false;
      this.selectedChecklistIndex = null;
    },
    // Metoda dodająca element do checklisty
    async addChecklistItem(checklistIndex) {
      const checklist = this.selectedCard.checklists[checklistIndex];
      const checklistId = checklist.id;
      const newItemText = this.newItemText[checklistIndex];
      console.log('po kliknieciu addChecklistItem zmienna checklist', checklist);
      console.log('po kliknieciu addChecklistItem zmienna newItemText', newItemText);
      try {
        const token = this.getToken();
        const response = await axios.post(`https://cabanoss.azurewebsites.net/elements/tasks?taskId=${checklistId}`, {
          description: newItemText,
          isComplete: false
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.newItemText[checklistIndex] = '';
        this.fetchCardChecklistItems(this.selectedCard.checklists[checklistIndex].id);
        console.log('Nowy element checklists dodany:', this.newItemText);
      } catch (error) {
        const errorPopup = Object.values(error.response.data.errors)
          .map(messages => messages.join('. '))
          .join('. ');
        console.error(error);
        this.errorPopup = errorPopup;
        this.toast.error(errorPopup);
        console.error('Failed to add checklist item:', error);
      }
    },
    getChecklistProgress(checklist) {
      if (checklist.items && checklist.items.length > 0) {
        const totalItems = checklist.items.length;
        const completedItems = checklist.items.filter(item => item.isComplete).length;
        return (completedItems / totalItems) * 100;
      } else {
        return 0; // Jeśli brak elementów, zwracamy 0% postępu
      }
    },
    toggleChecklistItem(checklistId, itemId, isComplete) {
      const checklist = this.selectedCard.checklists.find(checklist => checklist.id === checklistId);
      if (checklist) {
        const item = checklist.items.find(item => item.id === itemId);
        if (item) {
          item.isComplete = isComplete;
          this.updateChecklistItemStatus(checklistId, itemId, isComplete, item.description);
        }
      }
    },
    async updateChecklistItemStatus(checklistId, itemId, isComplete, description) {
      try {
        const token = this.getToken();
        const response = await axios.put(`https://cabanoss.azurewebsites.net/elements?elementId=${itemId}`, {
          isComplete,
          description
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Checklist item status updated:', response);
      } catch (error) {
        console.error('Failed to update checklist item status:', error);
      }
    },
    showAssignedUsersModal(item) {
      const boardId = this.$route.params.boardId;
      const response = this.fetchBoardMembers(boardId);
      this.boardMembers = response.data;

      //this.showAssignedUsersDialog = true;
      //this.fetchCardChecklistItemsMembers(item.id);
    },
    showOptionsDropdown(index) {
      if (this.showOptionsDropdownIndex === index) {
        this.showOptionsDropdownIndex = null;
      } else {
        this.showOptionsDropdownIndex = index;
      }
    },

    isUserAssigned(item, user) {
      return item.assignedUsers.some(assignedUser => assignedUser.id === user.id);
    },
    assignUserToItem(item, user) {
      const elementId = item.id;
      const userId = user.id;
      const token = this.getToken();

      axios.post(`https://cabanoss.azurewebsites.net/members/elements/${elementId}?userId=${userId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          console.log('User assigned to item:', response.data);
          // Aktualizuj listę przypisanych użytkowników
          item.assignedUsers.push(user);
        })
        .catch(error => {
          console.error('Failed to assign user to item:', error);
        });
    },

    removeUserFromItem(item, user) {
      const elementId = item.id;
      const userId = user.id;
      const token = this.getToken();

      axios.delete(`https://cabanoss.azurewebsites.net/members/elements/${elementId}?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          console.log('User removed from item:', response.data);
          // Usuń użytkownika z listy przypisanych użytkowników
          item.assignedUsers = item.assignedUsers.filter(assignedUser => assignedUser.id !== user.id);
        })
        .catch(error => {
          console.error('Failed to remove user from item:', error);
        });
    },

    async uploadAttachment() {
      if (!this.isLinkValid(this.attachmentPath)) {
        // Walidacja nie powiodła się - nieprawidłowy link
        console.error('Invalid attachment link');
        return;
      }

      const cardId = this.selectedCard.id;

      try {
        const token = this.getToken();

        if (this.isEditing && this.editedAttachmentId) {
          // Edytowanie załącznika
          const updatedAttachment = {
            name: this.attachmentName,
            path: this.attachmentPath,
          };

          await axios.put(
            `https://cabanoss.azurewebsites.net/attachments?attachmentId=${this.editedAttachmentId}`,
            updatedAttachment,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Zaktualizuj załącznik w liście
          const attachmentIndex = this.selectedCard.attachments.findIndex(
            (attachment) => attachment.id === this.editedAttachmentId
          );
          this.selectedCard.attachments.splice(attachmentIndex, 1, {
            id: this.editedAttachmentId,
            ...updatedAttachment,
          });

          // Zresetuj stan edycji
          this.isEditing = false;
          this.editedAttachmentId = null;
        } else {
          // Dodawanie nowego załącznika
          const newAttachment = {
            name: this.attachmentName,
            path: this.attachmentPath,
          };

          const response = await axios.post(
            `https://cabanoss.azurewebsites.net/attachments/cards?cardId=${cardId}`,
            newAttachment,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Dodaj nowy załącznik do listy
          this.fetchCardAttachments(this.selectedCard.id);
        }

        // Zresetuj pola formularza
        this.attachmentName = '';
        this.attachmentPath = '';
      } catch (error) {
        console.error('Failed to upload attachment:', error);
      }
    },
    editAttachment(attachment) {
      this.isEditing = true;
      this.editedAttachmentId = attachment.id;

      // Ustaw nazwę i ścieżkę załącznika w polach formularza
      this.attachmentName = attachment.name;
      this.attachmentPath = attachment.path;
    },
    async removeAttachment(attachmentId) {

      try {
        const token = this.getToken();
        await axios.delete(
          `https://cabanoss.azurewebsites.net/attachments?attachmentId=${attachmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Usuń załącznik z listy
        this.selectedCard.attachments = this.selectedCard.attachments.filter(
          (attachment) => attachment.id !== attachmentId
        );
      } catch (error) {
        console.error('Failed to remove attachment:', error);
      }
    },
    isLinkValid(link) {
      // Prosta walidacja linku - sprawdzamy, czy rozpoczyna się od http lub https
      return /^https?:\/\//i.test(link);
    }
  }
}
</script>
