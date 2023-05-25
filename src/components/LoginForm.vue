<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card mt-5">
          <div class="card-header">
            <h3 class="text-center">Log in</h3>
          </div>
          <div class="card-body">
            <form>
              <div class="form-group">
                <label for="login">Login:</label>
                <input type="login" class="form-control" id="login" v-model="login">
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" class="form-control" id="password" v-model="password">
              </div>
              <div class="mt-3">
                <button type="submit" class="btn btn-primary" v-on:click.prevent="loginApp()">Log in</button>
              </div>
              <div class="text-center mt-2">
                <span>Don't have an account? <router-link to="/signup">Register here</router-link></span>
              </div>
            </form>
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
  name: 'LoginForm',
  setup() {
    // Get toast interface
    const toast = useToast();

    // Make it available inside methods
    return { toast }
  },
  data() {
    return {
      successMessage: '',
      login: '',
      password: '',
    }
  },
  methods: {
    loginApp() {
      const apiUrl = 'https://cabanoss.azurewebsites.net/accounts/login';
      const data = {
        login: this.login,
        password: this.password
      };
      axios.post(apiUrl, data)
        .then(response => {
          console.log(response);
          const token = response.data.token;
          const login = response.data.user.login;
          const email = response.data.user.email;
          localStorage.setItem('token', token);
          localStorage.setItem('login', login);
          localStorage.setItem('email', email);
          this.toast.success('Successfully logged in');
          this.$router.push({ path: '/' });
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
    }
  }
}
</script>