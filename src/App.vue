<template>
  <nav class="navbar navbar-expand-md">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <img style="max-width: 30px;" src="./assets/logo.png" alt="Logo strony">
      </router-link>

      <!-- Przycisk hamburgera -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li v-if="isLoggedIn" class="nav-item"> <router-link class="nav-link active" aria-current="page" to="/">My
              boards</router-link></li>
          <li v-if="!isLoggedIn" class="nav-item"><router-link class="nav-link active" to="/login">Login</router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item"><router-link class="nav-link active" to="/signup">Sign up!</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <div @click="toggleTheme" :class="currentTheme === 'light' ? 'light-theme' : 'dark-theme'">
            <i :class="currentTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon'" style="font-size: 36px;"></i>
          </div>
          <!-- Przycisk logowania lub informacje o zalogowanym użytkowniku -->
          <li v-if="isLoggedIn" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              <img src="https://via.placeholder.com/40x40" alt="Avatar" class="rounded-circle me-2 mwh40">
              {{ login }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li><router-link class="dropdown-item" to="/profile">Profile</router-link></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" @click="logout()">Log out</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view />
</template>
<script>
import { useToast } from "vue-toastification";
import Cookies from 'js-cookie';
export default {
  setup() {
    // Get toast interface
    const toast = useToast();

    // Make it available inside methods
    return { toast }
  },
  data() {
    return {
      isDarkTheme: false,
      currentTheme: '', // Początkowo pusta wartość
      isLoggedIn: false, // Zmienna przechowująca informację o zalogowaniu użytkownika
      login: '', // Zmienna przechowująca login użytkownika
    };
  },
  mounted() {
    this.updateLoginStatus(); // Aktualizacja statusu logowania i loginu użytkownika po załadowaniu komponentu
    // Sprawdź, czy w localStorage istnieje zapisany motyw
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.currentTheme = storedTheme;
      this.updateBodyTheme();
    }
  },
  watch: {
    $route(to, from) {
      this.updateLoginStatus(); // Aktualizacja statusu logowania i loginu użytkownika po zmianie ścieżki
    },
  },
  created() {
    // Odczytaj zapisany motyw z cookies
    const savedTheme = Cookies.get('theme');

    // Ustaw odpowiednią wartość dla isDarkMode na podstawie zapisanego motywu
    this.isDarkMode = savedTheme === 'dark';
  },
  methods: {
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';

      // Zapisz wybrany motyw w localStorage
      localStorage.setItem('theme', this.currentTheme);

      this.updateBodyTheme();
    },
    updateBodyTheme() {
      // Aktualizuj motyw w body
      const bodyElement = document.querySelector('body');
      bodyElement.setAttribute('data-bs-theme', this.currentTheme);
    },
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