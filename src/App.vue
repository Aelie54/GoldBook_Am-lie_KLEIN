<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import { TokenStore } from "./stores/token";
const MyTokenStore = TokenStore();
</script>

<template>
<RouterLink to="/">
  <header>
    <!-- <img 
      alt="Vue logo"
      class="logo"
      src="@/components/icons/testbook.png"
    /> -->
    <div class="wrapper">
      <HelloWorld msg="Livre d'Or d'Amélie Klein" />
    </div>
  </header>
</RouterLink>
<RouterView />
</template>

<style scoped>

template {
  margin-left:50px
}

figcaption {
    background-color: #222;
    color: #fff;
    font: italic smaller sans-serif;
    padding: 3px;
    text-align: center;
}

header {
  border-radius: 5px;
  /* display : flex;
  justify-content: center;
  justify-items: center;
  text-align: center; */
  /*encadré header*/
  line-height: 1.5;
  max-height: 50vh; 
  margin-bottom: 30px;
  display:flex ;
  justify-content: space-evenly; 
  align-items:center; 

  background: url(https://images.unsplash.com/photo-1533134486753-c833f0ed4866?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80);
  /*background: url(https://images.unsplash.com/photo-1516041774595-cc1b7969480c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3870&q=80);*/
  
  background-size: cover;
}

.logo {
  display: block;
     width:150px
  /* margin: 0 auto 2rem; */
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 1rem;
}

nav a.router-link-exact-active { 
  /* color: var(--color-text); */
  color: #e3e68c;
  text-decoration: underline;
} 

nav a.router-link-exact-active:hover {
  background-color: transparent;
  text-decoration: underline;
}

nav a {
  display: inline-block;
  padding: 0 2rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    width: 100%;
    /* padding-right: calc(var(--section-gap) / 2); */
  }

  .logo {
    width:250px
    /* margin: 0 2rem 0 0; */

  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: justify;
    margin-left: 1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
