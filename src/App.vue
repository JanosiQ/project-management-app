<template>
  <nav class="navbar navbar-expand-md">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img style="max-width: 30px;" src="./assets/logo.png" alt="Logo strony">
      </a>

      <!-- Przycisk hamburgera -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li v-if="!isLoggedIn" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown1" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              Account
            </a>
            <ul   class="dropdown-menu" aria-labelledby="navbarDropdown1">
              <li><router-link class="dropdown-item" to="/login">Login</router-link></li>
              <li><router-link class="dropdown-item" to="/signup">Sign up!</router-link></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <li v-if="isLoggedIn"><router-link class="dropdown-item" to="/">My boards</router-link></li>
          </li>
        </ul>


        <ul class="navbar-nav ms-auto">
          <!-- Przycisk logowania lub informacje o zalogowanym użytkowniku -->
          <li v-if="isLoggedIn" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              <img src="https://via.placeholder.com/40x40" alt="Avatar" class="rounded-circle me-2 mwh40">
              {{ login }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li><router-link class="dropdown-item" to="/profile">Profile</router-link></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" @click="logout()">Log out</a></li>
            </ul>
          </li>
          <li v-else class="nav-item">
            <button class="btn btn-primary">
              <router-link class="nav-link" to="/login">Login</router-link>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view />
</template>
<script>
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
      isLoggedIn: false, // Zmienna przechowująca informację o zalogowaniu użytkownika
      login: '', // Zmienna przechowująca login użytkownika
    };
  },
  mounted() {
    this.updateLoginStatus(); // Aktualizacja statusu logowania i loginu użytkownika po załadowaniu komponentu
  },
  watch: {
    $route(to, from) {
      this.updateLoginStatus(); // Aktualizacja statusu logowania i loginu użytkownika po zmianie ścieżki
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token'); // Usunięcie tokena z pamięci
      this.toast.success('Signed out successfully');

      this.updateLoginStatus(); // Aktualizacja statusu logowania i loginu użytkownika po wylogowaniu
      this.$router.push('/login'); // Przekierowanie użytkownika do strony logowania
    },
    updateLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        // Użytkownik jest zalogowany
        this.isLoggedIn = true;
        this.login = localStorage.getItem('login');
      } else {
        // Użytkownik nie jest zalogowany
        this.isLoggedIn = false;
        this.login = '';
      }
    },
  },
};
</script>
<style>
.form-group:nth-last-child(2) {
  margin-bottom: 1rem;
}
</style>