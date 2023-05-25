<template>
    <div class="container mt-4">
      <h2 class="mb-4">Edit Profile</h2>
      <form>
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" class="form-control" id="username" placeholder="Enter username">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input type="email" class="form-control" id="email" placeholder="Enter email">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" placeholder="Enter password">
        </div>
        <div class="mb-3">
          <label for="confirm-password" class="form-label">Confirm Password</label>
          <input type="password" class="form-control" id="confirm-password" placeholder="Confirm password">
        </div>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </form>
    </div>
</template>
<script>
export default {
  name: 'ProfileEdit',
  methods: {
    redirectToProfile() {
      this.$router.push('/profile');
    }
  },
  mounted() {
    // Przekierowanie po kliknięciu w "Profile"
    const profileLink = document.querySelector('.dropdown-item[href="#"]');
    profileLink.addEventListener('click', this.redirectToProfile);
  }
}
</script>
<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.form-label {
  font-weight: bold;
}

.btn-primary {
  margin-top: 16px;
}
</style>