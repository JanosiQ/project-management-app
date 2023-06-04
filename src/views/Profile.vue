<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card mt-5">
          <div class="card-header">
            <h3 class="text-center">Edit Profile</h3>
          </div>
          <div class="card-body">
            <form>
              <div class="form-group mb-3">
                <label for="username" class="form-label">Username</label>
                <div class="input-group">
                  <input v-model="login" type="text" class="form-control" id="username" placeholder="Enter username"
                    :disabled="!isEditing || editingField !== 'login'">
                  <button type="button" class="btn btn-link" @click="toggleEditing('login')">
                    <i class="fa"
                      :class="{ 'fa-pencil': !isEditing || editingField !== 'login', 'fa-close': isEditing && editingField === 'login' }"></i>
                  </button>
                </div>
                <button v-if="isEditing && editingField === 'login'" type="button" class="btn btn-primary  mt-3"
                  @click="saveLogin">Save Changes</button>
              </div>
              <div class="form-group mb-3">
                <label for="email" class="form-label">Email address</label>
                <div class="input-group">
                  <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter email"
                    :disabled="!isEditing || editingField !== 'email'">
                  <button type="button" class="btn btn-link" @click="toggleEditing('email')">
                    <i class="fa"
                      :class="{ 'fa-pencil': !isEditing || editingField !== 'email', 'fa-close': isEditing && editingField === 'email' }"></i>
                  </button>
                </div>
                <button v-if="isEditing && editingField === 'email'" type="button" class="btn btn-primary mt-3"
                  @click="saveEmail">Save Changes</button>
              </div>
              <div class="form-group mb-3">
                <div v-if="!changePassword">
                  <button type="button" class="btn btn-link" @click="toggleChangePassword">Change password</button>
                </div>
                <label v-if="changePassword" for="password" class="form-label">Password</label>
                <div v-if="changePassword">
                  <input v-model="password" type="password" class="form-control" id="password"
                    placeholder="Enter password">
                </div>
                <div class="form-group mb-3" v-if="changePassword">
                  <label for="confirm-password" class="form-label">Confirm Password</label>
                  <input v-model="confirmPassword" type="password" class="form-control" id="confirm-password"
                    placeholder="Confirm password">
                </div>
                <button v-if="changePassword" type="button" class="btn btn-primary me-3" @click="savePassword">Save
                  Changes</button>
                <button v-if="changePassword" type="button" class="btn btn-secondary"
                  @click="toggleChangePassword">Close</button>
              </div>
            </form>
            <div class="form-group">
              <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">
                Delete Account
              </button>
            </div>
            <!-- Modal -->
            <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteModalLabel"
              aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="confirmDeleteModalLabel">Confirm Account Deletion</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    Are you sure you want to delete your account?
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="deleteAccount">Delete</button>
                  </div>
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
      login: '',
      email: '',
      password: '',
      confirmPassword: '',
      isEditing: false,
      editingField: '',
      changePassword: false,
    };
  },
  mounted() {
    // Pobranie danych użytkownika przy załadowaniu komponentu
    this.getUserData();
  },
  methods: {
    async getUserData() {
      try {
        const token = localStorage.getItem('token');
        const url = 'https://cabanoss.azurewebsites.net/users';
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(url, { headers });

        // Pobrano dane użytkownika
        // Ustaw wartości pól formularza na pobrane dane
        this.login = response.data.login;
        this.email = response.data.email;
        console.log('User data:', response);
      } catch (error) {
        console.error('Failed to get user data:', error);
        // Obsłuż błąd w przypadku niepowodzenia pobrania danych użytkownika
      }
    },
    async saveLogin() {
      try {
        const token = localStorage.getItem('token');
        const url = 'https://cabanoss.azurewebsites.net/users';
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const data = JSON.stringify({
          login: this.login,
        });

        const response = await axios.put(url, data, { headers });
        this.getUserData();
        this.isEditing = false;
        this.toast.success('Username changed successfully'); // Pomyślnie zaktualizowano nazwę użytkownika
        // Wykonaj odpowiednie operacje po zaktualizowaniu nazwy użytkownika
        localStorage.setItem('login', this.login);
        console.log(response);
      } catch (error) {
        const errorPopup = Object.values(error.response.data.errors)
          .map(messages => messages.join('. '))
          .join('. ');
        console.error(error);
        this.errorPopup = errorPopup;
        this.toast.error(errorPopup);
        console.error('Failed to save username:', error);
        // Obsłuż błąd w przypadku niepowodzenia zapisu zmiany nazwy użytkownika
      }
    },

    async saveEmail() {
      try {
        const token = localStorage.getItem('token');
        const url = 'https://cabanoss.azurewebsites.net/users';
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const data = JSON.stringify({
          email: this.email,
        });

        const response = await axios.put(url, data, { headers });
        this.isEditing = false;
        this.toast.success('Email changed successfully');
        // Pomyślnie zaktualizowano adres e-mail
        // Wykonaj odpowiednie operacje po zaktualizowaniu adresu e-mail

      } catch (error) {
        console.error('Failed to save email:', error);
        // Obsłuż błąd w przypadku niepowodzenia zapisu zmiany adresu e-mail
      }
    },
    async savePassword() {
      try {
        const token = localStorage.getItem('token');
        const url = 'https://cabanoss.azurewebsites.net/users';
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const data = JSON.stringify({
          password: this.password,
          confirmPassword: this.confirmPassword,
        });

        const response = await axios.put(url, data, { headers });
        this.isEditing = false;
        this.toast.success('Password changed successfully'); // Pomyślnie zaktualizowano hasło
        this.changePassword = false;

      } catch (error) {
        console.error('Failed to save password:', error);
        // Obsłuż błąd w przypadku niepowodzenia zapisu zmiany hasła
      }
    },
    toggleEditing(field) {
      if (this.isEditing && this.editingField === field) {
        // Zakończ edycję pola
        this.isEditing = false;
        this.editingField = '';
      } else {
        // Rozpocznij edycję pola
        this.isEditing = true;
        this.editingField = field;
        this.changePassword = false;
      }
    },
    toggleChangePassword() {
      this.changePassword = !this.changePassword;
      this.isEditing = false;
    },
    async deleteAccount() {
      try {
        const token = localStorage.getItem('token');
        const url = 'https://cabanoss.azurewebsites.net/users';
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        await axios.delete(url, { headers });
        this.toast.success('Account deleted successfully');
        const modalElement = document.getElementById('confirmDeleteModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
        bootstrapModal.hide();
        // Usuń token i login z localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('login');

        // Przekieruj na stronę logowania
        this.$router.push({ path: '/login' });
      } catch (error) {
        console.error('Failed to delete account:', error);
        // Obsłuż błąd w przypadku niepowodzenia usunięcia konta
      }
    }
  },
};
</script>
