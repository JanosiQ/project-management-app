<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card mt-5">
          <div class="card-header">
            <h3 class="text-center">Create an Account</h3>
          </div>
          <div class="card-body">
            <form>
              <div class="form-group">
                <label for="login">Full Name:</label>
                <input type="text" class="form-control" id="login" v-model="login" required>
              </div>
              <div class="form-group">
                <label for="email">Email Address:</label>
                <input type="email" class="form-control" id="email" v-model="email" required>
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <div class="input-group">
                  <input :type="passwordVisible ? 'text' : 'password'" class="form-control" id="password"
                    v-model="password" required>
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility" tabindex="-1">
                      <i :class="passwordVisible ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password:</label>
                <div class="input-group">
                  <input :type="passwordVisible ? 'text' : 'password'" class="form-control" id="confirmPassword"
                    v-model="confirmPassword" required>
                  <div class="input-group-append">
                    
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary btn-block" @click.prevent="createAccount()">Create
                Account</button>
            </form>
            <div class="text-center mt-3">
              <span>Already have an account? <router-link to="/login">Login</router-link></span>
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
      password: '',
    }
  },
  data() {
    return {
      login: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordVisible: false
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    createAccount() {
      const payload = {
        login: this.login,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Dodaj ten nagłówek
        }
      };

      // Wywołanie endpointu POST /accounts/register
      axios.post('https://cabanoss.azurewebsites.net/accounts/register', payload, config)
        .then(() => {
          console.log('Account created successfully');
          // Wyświetl komunikat sukcesu logowania
          this.toast.success('Account created successfully');
          // Przekierowanie użytkownika na stronę logowania
          this.$router.push('/login');
        })
        .catch(error => {
          if (error.response && error.response.status === 400 && error.response.data.errors) {
            const errorPopup = Object.values(error.response.data.errors)
              .map(messages => messages.join('. '))
              .join('. ');
            console.error(error);
            this.errorPopup = errorPopup;
            this.toast.error(errorPopup);
          }else if(error.code === "ERR_NETWORK"){
            console.error(error);
            this.toast.error(error.message);
          } else {
            console.error(error);
            this.toast.error('Error creating account');
          }
        });
    }
  }
}
</script>

<style>
/* card styling */
.card {
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
</style>