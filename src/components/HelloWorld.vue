<script setup lang="ts">
defineProps<{
  msg: string;
}>();
</script>

<template>
  <div class="greetings" >
    <h1 class="green">{{ msg }}</h1>
    <!-- <h2 class="green">
      d'Amélie Klein
    </h2> -->
  </div>
</template>

<style scoped>

.green{
  background-image: url('https://images.unsplash.com/photo-1545873509-33e944ca7655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2346&q=80');
  /* https://images.unsplash.com/photo-1545873509-33e944ca7655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2346&q=80'); */
  background-size: cover;
  background-position: center;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

   /* background: url(   https://images.unsplash.com/photo-1516041774595-cc1b7969480c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3870&q=80) repeat-y top fixed;*/
}

h1 {
  font-family: Love Light, regular 400;
  font-size: 2rem;
  /* font-weight: 500;
  top: -5px;
  margin:0 */

  font-family: cursive;
  color:gold;
  font-size:2rem
}

h2 {
  font-family: Love Light, regular 400;
  font-size: 2rem;
   /* font-family: Snell Roundhand, cursive ;
 font-weight: 500;
  font-size: 4rem;
  top: -5px;
  margin:0 */
}

.greetings h1,
.greetings h2 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h2 {
    text-align: left;
      font-size: 5rem;
  }
}
</style>
