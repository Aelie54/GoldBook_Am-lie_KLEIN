<template>

<div v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'" style="display:flex ; text-align:center; justify-content: center; flex-direction:column; margin-bottom:50px ; width:90% ; padding : 20px ;">

    <h2 style="color:rgb(214, 122, 127); text-decoration : bold ; border : rgb(214, 122, 127) 3px solid ; text-align:center; justify-content: center; "> 
        Erreur : image trop lourde car suprieure à 10mb, <br> ou de mauvais format (acceptés : jpeg, jpg, bmp, png, gif). <br> Ou bien, tentative de piratage d'un profil utilisateur.
    </h2>

   <div style="display:flex;  align-content : center ; justify-content: center ; align-items : center ; margin-bottom : 30px ; margin-top : 60px">
      <div style="display:flex;flex-direction:column ; padding:30px; border: 1px dashed white ; border-radius:5px ;">
        <div><h2><span style="color:white">{{MyTokenStore.pseudo}}</span></h2><br></div>
        <div v-if="MyTokenStore.avatar != `null`"><img :src="`/src/components/upload/`+`${MyTokenStore.avatar}`" style="width:150px;width:150px ;border: 1px solid yellow ; border-radius :5px"/></div>
        <div v-if="MyTokenStore.avatar == `null`"> <img src="/src/components/upload/smile-default-avatar.png" style="width:100px" /></div>
      </div>

    </div>

    <h1 style="color:gold"><br> Modifier mes informations <br></h1>
    <form @submit.prevent="modify(user)"><br>

      <label> pseudo : </label><br>
      <input v-model.trim='user.new_pseudo' minlength="5" maxlength="25" type="text" :placeholder="[[ MyTokenStore.pseudo ]]" /> <br>
      <br>
      <label> nom : </label><br>
      <input v-model.trim='user.new_nom' minlength="4" maxlength="25" type="text" :placeholder="[[ MyTokenStore.nom ]]" /> <br>
      <br>
      <label> prénom : </label><br>
      <input v-model.trim='user.new_prenom' minlength="3" maxlength="25" type="text" :placeholder="[[ MyTokenStore.prenom ]]" /> <br>
      <br>
      <label> email : </label><br>
      <input v-model.trim='user.new_email' minlength="10" maxlength="50" type="text" :placeholder="[[ MyTokenStore.email ]]" /> <br>
      <br>

      <div><label> informations (vide à jusqu'à 75): </label><br>
      <textarea v-model.trim='user.new_info_email' style="width:50%"  maxlength="75"  cols="30" rows="5" type="text" :placeholder="[[ MyTokenStore.info_email ]]" ></textarea><br><br></div>

      <button type="submit">Modifier profil</button><br><br>
    </form>

    <h1 style="color:gold"><br> Modifier mon avatar<br></h1>
    <form :action="`${localhost}/upload_my_avatar/${MyTokenStore.myid}/${MyTokenStore.token}`" method="POST" enctype="multipart/form-data"><br>
      <input type="file" name="image"/>
      <button type="submit">Valider mon avatar</button><br><br>
    </form>


    <h1 style="color:gold"><br> Changer le mot de passe : <br></h1>
    <form @submit.prevent="modify_password()"><br>
      <label> mon mot de passe : </label><br>
      <input v-model.trim='new_password.my_password' maxlength="20" type="password" /> <br>
      <br>
      <label> nouveau mot de passe : </label><br>
      <input v-model.trim='new_password.new_password' maxlength="20" type="password" /> <br>
      <br>
      <label> confirmer mot de passe : </label><br>
      <input v-model.trim='confirm_password' maxlength="20" type="password" /> <br>

      <br>
      <button type="submit">Valider</button><br><br>
    </form>

</div>

<div v-else>{{router.push("/")}}</div>

</template>

<script setup lang="ts">

import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { TokenStore } from "../stores/token";
import {localhost } from '../components/plugin/localhost'
const MyTokenStore = TokenStore();
const router = useRouter();

var user = ref({
  new_pseudo: MyTokenStore.pseudo,
  new_nom:MyTokenStore.nom ,
  new_prenom:MyTokenStore.prenom,
  new_email:MyTokenStore.email,
  new_info_email:MyTokenStore.info_email
});

var new_password ={
  my_password: "",
  new_password : ""
}
var confirm_password = "";


async function modify_password() {
  
    if ( !(new_password.my_password) || !(typeof new_password.my_password === "string") || (new_password.my_password.length > 20)){
      alert ("password invalide : mauvais format, trop long ou non renseigné.")
      return
    } ;

    if ( !(new_password.new_password) || !(typeof new_password.new_password === "string") || (new_password.new_password.length > 20)){
      alert ("password invalide : mauvais format, trop long ou non renseigné.")
      return
    } ;

    if (new_password.new_password !== confirm_password){
      alert ("Les deux mots de passe ne correspondent pas.")
      return
    } ;


    let response = await fetch(`${localhost}/modify_my_password`, {
      method: "PUT",
      headers: {
      "Authorization": MyTokenStore.token,
      "Content-Type": "application/json",
      },
  
      body: JSON.stringify(new_password)
    })
      .then((response) => response.json())
      .catch((error) => {
      console.log("Failed", error)
      });
  
    if(response.error){
      alert(response.message);
      return
    }

  router.push("/");
}

async function modify() {
    if ( !(user._value.new_pseudo) || !(typeof user._value.new_pseudo === "string") || (user._value.new_pseudo.length > 20)){
      alert ("pseudo invalide : mauvais format, trop long ou non renseigné.")
      return
    } ;

    if ( !(user._value.new_nom) || !(typeof user._value.new_nom === "string") || (user._value.new_nom.length > 25)){
      alert ("pseudo invalide : mauvais format, trop long ou non renseigné.")
      return
    } ;

    if ( !(user._value.new_prenom) || !(typeof user._value.new_prenom === "string") || (user._value.new_prenom.length > 25)){
      alert ("pseudo invalide : mauvais format, trop long ou non renseigné.")
      return
    } ;

    if ( !(user._value.new_email) || !(typeof user._value.new_email === "string") || (user._value.new_email.length > 50)){
      alert ("pseudo invalide : mauvais format, trop long ou non renseigné.")
      return
    } ;

    if ( !(user._value.new_info_email) || !(typeof user._value.new_info_email === "string") || (user._value.new_info_email.length > 75)){
      alert ("pseudo invalide : mauvais format, trop long ou non renseigné.")
      return
    } ;

    if ( user._value.new_prenom.length < 3 || user._value.new_nom.length < 4 || user._value.new_pseudo.length < 5 || user._value.new_email.length < 10 ){
      alert ("un ou plusieurs champs trop court(s)")
      return
    } ;


    if((/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i).test(user._value.new_email) == false){
      alert ("email invalide : mauvais format, format email demandé.")
      return
    } ;
  
    let response = await fetch(`${localhost}/modifyUser`, {
      method: "PUT",
      headers: {
      "Authorization": MyTokenStore.token,
      "Content-Type": "application/json",
      },
  
      body: JSON.stringify(user._value)
    })
      .then((response) => response.json())
      .catch((error) => {
      console.log("Failed", error)
      });
  
    if(response.error){
      alert(response.message);
      return
    }

  MyTokenStore.pseudo = user.new_pseudo;
  router.push("/");
  }

</script>