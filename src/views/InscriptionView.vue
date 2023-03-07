<template>

<p><br></p>

<h1> S'incrire </h1>

 <form @submit.prevent="register">
        <br>
        <input v-model.trim='user.nom'    minlength="4" maxlength="25"  placeholder="Nom de 4 à 25 caractères" type="text" class="largeur" required >
        <br>
        <input v-model.trim='user.prenom'  minlength="3"  maxlength="25"  placeholder="Prenom de 3 à 25 caractères" type="text" class="largeur" required>
        <br>
        <input v-model.trim='user.pseudo'   minlength="5" maxlength="20"  placeholder="Pseudo de 5 À 20 caractères" type="text" class="largeur" required>
        <br>
        <input v-model.trim='user.email'   minlength="10" maxlength="50"  placeholder="Email de 10 à 50 caractères" type="text" class="largeur" required>
        <br><br>
        <textarea v-model.trim='user.info_email' style="width:50%"  maxlength="75"  
        placeholder="info : entreprise ? ancien colègue ? mentor ? ami ? tuteur ? famille ? si volonté d'anonymat ne rien écrire. Maximum 75 caractères max." 
        cols="30" rows="5" type="text" ></textarea>
        <br><br>
        <input v-model.trim='user.password'  minlength="5" maxlength="20"  placeholder="mot de passe" type="password" name="" class="largeur" required><br>
        <input v-model.trim='confirm.password' minlength="5" maxlength="20"  placeholder="confirmer mot de passe" type="password" name="" class="largeur" required>
        <br><br>
        <button type="submit" class="largeur">Je m'inscris</button>
        <br>

      </form>

</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import {localhost } from '../components/plugin/localhost'
const route = useRoute();
const router = useRouter();

const user = {
  prenom:"",
  nom:"",
  pseudo: "",
  email: "",
  info_email: "",
  password: "",
};

const confirm =
{
  password:""
};

async function register() {
  
    if((/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i).test(user.email) == false){
      alert ("format email non valide")
      return
    } ;
    
    if ( !(user.prenom) || !(user.nom) || !(user.pseudo) || !(user.email) || !(user.password) ){
      alert ("veuillez remplir tous les champs svp")
      return
    } ;

    if ( user.prenom.length > 25 || user.nom.length > 25 || user.pseudo.length > 25 || user.email.length > 50 || user.password.length > 25 || user.info_email.length > 75){
      alert ("un ou plusieurs champs trop long(s)")
      return
    } ;

    if ( user.prenom.length < 3 || user.nom.length < 4 || user.pseudo.length < 5 || user.email.length < 10 || user.password.length < 5){
      alert ("un ou plusieurs champs trop court(s)")
      return
    } ;

    if ( !(typeof user.pseudo === "string") || !(typeof user.password === "string") || !(typeof user.nom === "string") || !(typeof user.prenom === "string") || !(typeof user.email === "string")  || !(typeof user.info_email === "string") ){
      alert ("champs trop longs")
      return
    } ;

    if ( !(confirm.password == user.password) ){
    alert ("les mots de passe ne correspondent pas : erreur front ")
    return 
    } ;
  
    let response = await fetch(`${localhost}/inscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
  
      body: JSON.stringify(user)
    })
      .then((r) => r.json())
      .catch((e) => {
      console.log("Failed", e)
      });
  
    if(response.error){
      alert(response.message);
      return
    }

    router.push("/");
  }
</script>