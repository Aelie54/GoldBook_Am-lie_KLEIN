<template>

 <form @submit.prevent="connect">
        <br>
        <br><br>
        <input v-model.trim='user.email'   maxlength="50"  placeholder="Email" type="text" class="largeur" />
        <br>
        <input v-model.trim='user.password' maxlength="20"  placeholder="mot de passe" type="password" name="" class="largeur" />
        <br><br>
        <button type="submit" class="largeur">Je me connecte</button>
        <br>
      </form>

</template>

<script setup lang="ts">
import jwt_decode from "jwt-decode";
import { useRoute, useRouter } from "vue-router";
import { TokenStore } from "../stores/token";
import {localhost } from '../components/plugin/localhost'
const MyTokenStore = TokenStore();
const route = useRoute();
const router = useRouter();


const user = {
  email: "",
  password: "",
};

async function connect() {
    //console.log(user);
  
    if ( !(user.email) || !(user.password) ){
      alert ("veuillez remplir tous les champs svp")
      return
    } ;

    if ( user.email.length > 50 || user.password.length > 20){
      alert ("un ou plusieurs champs trop long(s)")
      return
    } ;

    if ( !(typeof user.email === "string")  || !(typeof user.password === "string") ){
      alert ("champs trop longs")
      return
    } ;
  
    let response = await fetch(`${localhost}/login`, {
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

  var decoded = jwt_decode(response.token);
  //console.log(decoded);
  MyTokenStore.pseudo = decoded.pseudo;
  MyTokenStore.prenom = decoded.prenom;
  MyTokenStore.nom = decoded.nom;
  MyTokenStore.myid = decoded.id;
  MyTokenStore.role = decoded.role;
  MyTokenStore.email = decoded.email;
  MyTokenStore.info_email = decoded.info_email;
  MyTokenStore.token = response.token;
  MyTokenStore.avatar = decoded.avatar;
  router.push("/");

  }

</script>