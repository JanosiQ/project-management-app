<template>
    <div class="container my-5">
      <div class="card border-danger">
        <div class="card-body text-center">
          <h1 class="card-title">404</h1>
          <h5 class="card-subtitle mb-2 text-muted">Strona nie znaleziona</h5>
          <p class="card-text">Niestety, wygląda na to że szukana przez Ciebie strona nie istnieje.</p>
          <router-link class="btn btn-primary" :to="{ name:'Home' }">Przejdź do strony głównej</router-link>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: 'NotFound',
  };
  </script>
  <style>
  .card {
    width: 100%;
    margin: 0 auto;
  }
  </style>