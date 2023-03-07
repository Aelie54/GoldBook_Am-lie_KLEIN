<template>
  <h1 style="color:white;text-align:center;"> Mon Profil : <br></h1>

  <div class="user_section">
    <div>
      <div class="user_sous_section">
        <div><h2><span style="color:gold">{{MyTokenStore.pseudo}}</span></h2><br></div>
        <div v-if="MyTokenStore.avatar != `null`"><img :src="`/src/components/upload/`+`${MyTokenStore.avatar}`" class="user_avatar_profil"/></div>
        <div v-if="MyTokenStore.avatar == `null`"> <img src="/src/components/upload/smile-default-avatar.png" class="user_avatar_profil" /></div>
        <div><p>Nom : <span style="color:gold">{{MyTokenStore.nom}}</span></p></div><br>
        <div><p>Prénom : <span style="color:gold">{{MyTokenStore.prenom}}</span></p></div>
        <div class="user_email_profile">
          <div> 
            <img src="@/components/icons/envv.png" class="user_email_sous_section" /> 
          </div> 
          <div class="email_user">
            <p style="color:gold">{{MyTokenStore.email}}</p>
          </div>
        </div>
        <div><p><br>Informations utilisateur :</p></div>
        <div class="info_user_profile">
          <div style="width: 70%">{{MyTokenStore.info_email}}<br><br></div>
        </div>
        <div><p>Role : <span style="color:gold">{{MyTokenStore.role}}</span></p></div>
      </div>
    </div>
  </div>

<div class="mesflex" >
  <div v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'" class="mesflex, mesflex2, sousflex">

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

        <div><label> informations : </label><br>
        <textarea v-model.trim='user.new_info_email' style="width:50%"  maxlength="75"  cols="30" rows="5" type="text" :placeholder="[[ MyTokenStore.info_email ]]" ></textarea><br><br></div>

        <button type="submit">Modifier profil</button><br><br><br>
      </form>

      <h1 style="color:gold"><br> Modifier mon avatar<br></h1>
      <form :action="`${localhost}/upload_my_avatar/${MyTokenStore.myid}/${MyTokenStore.token}`" method="POST" enctype="multipart/form-data"><br>
        <input type="file" name="image"/>
        <button type="submit">Valider mon avatar</button><br><br><br><br>
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
        <button type="submit">Valider</button>
      </form>

  </div>
  <div v-else>{{router.push("/")}}</div>
</div>

</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { TokenStore } from "../stores/token";
import {localhost } from '../components/plugin/localhost';
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

  MyTokenStore.pseudo = user._value.new_pseudo;
  MyTokenStore.nom = user._value.new_nom ;
  MyTokenStore.prenom = user._value.new_prenom ;
  MyTokenStore.email = user._value.new_email;
  MyTokenStore.info_email = user._value.new_info_email;

  router.push("/myprofil");
}

</script>


<style>

  p {
    color: white;
    font-family: "Gill Sans", sans-serif;
  }

  h2,h3 {
    font-family: "Gill Sans", sans-serif;
  }

.mesflex{
  display:flex ; 
  text-align:center; 
  justify-content: center;
  align-content : center ;
}

.mesflex2{
  display:flex; 
  flex-direction:column; 
  align-items:center
}

.myavatar{
  width:150px;
  width:150px;
  border: 1px solid yellow; 
  border-radius: 5px
}

.sousflex{
  margin-bottom:50px; 
  width:90%; 
  padding: 20px
}

.sousforme{
  margin-bottom:30px; 
  margin-top:60px
}

.sousforme2{
  padding:30px; 
  border: 1px dashed white; 
  border-radius:5px;
}

  p {
    color: white;
    font-family: "Gill Sans", sans-serif;
  }

  h1, h2,h3 {
    font-family: "Gill Sans", sans-serif;
  }

  .email_user{
    align-items:center;align-content:center
  }

  .user_section{
    display:flex;align-content:center;justify-content:center;align-items:center;margin-bottom:30px
    
  }

  .user_sous_section{
    display:flex;flex-direction:column;padding:30px;border: 1px dashed white;border-radius:5px;align-content:center;justify-content:center;align-items:center;
  }

  .user_avatar_profil{
    width:150px;order: 1px solid yellow ; border-radius :5px
  }

  .user_email_profile{
    display:flex;justify-content:center;align-items:center;align-content:center
  }

  .info_user_profile{
    display:flex;color:gold;width: 100%;justify-content:center
  }

  .form_modify_info{
    display:flex;flex-direction:column;justify-content:center;gap:1
  }

  .edit_user{
    display:flex ; text-align:center; justify-content: center; flex-direction:column; width:90% ; padding : 20px ; 
  }

  .user_email_sous_section{
    width:35px;margin-right: 15px
  }

</style>