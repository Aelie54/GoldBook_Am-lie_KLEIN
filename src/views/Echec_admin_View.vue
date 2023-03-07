
<template>

    <h2 style="color:rgb(214, 122, 127); text-decoration : bold ; border : rgb(214, 122, 127) 3px solid; text-align:center; justify-content: center;"> 
      Erreur : image trop lourde car suprieure à 10mb, <br> ou de mauvais format (acceptés : jpeg, jpg, bmp, png, gif). <br> Ou bien, tentative de piratage d'un profil utilisateur.
    </h2>

<div v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'" style="display:flex ; text-align:center; justify-content: center; flex-direction:column; width:90% ; padding : 20px ; ">
    <p><br></p>
    <h1 style="color:white"> Profil utilisateur : <br></h1>

    <div style="display:flex;  align-content : center ; justify-content: center ; align-items : center ; margin-bottom:30px">
      <div style="display:flex;flex-direction:column ; padding:30px; border: 1px dashed white ; border-radius:5px ;">
        <div><h2><span style="color:gold">{{Myuser.pseudo}}</span></h2><br></div>
        <div v-if="Myuser.avatar != `null`"><img :src="`/src/components/upload/`+`${Myuser.avatar}`" style="width:150px;width:150px ;border: 1px solid yellow ; border-radius :5px"/></div>
        <div v-if="Myuser.avatar == `null`"> <img src="/src/components/upload/smile-default-avatar.png" style="width:100px" /></div>
        <div><p>Nom : <span style="color:gold">{{Myuser.nom}}</span></p></div><br>
        <div><p>Prénom : <span style="color:gold">{{Myuser.prenom}}</span></p></div>

        <div style="display:flex; justify-content:center; align-items:center ; align-content:center;">

          <div> 
            <img src="@/components/icons/envv.png" style="width: 35px ; margin-right: 15px" /> 
          </div> 

          <div style="align-items:center ; align-content:center">
            <p style="color:gold">{{Myuser.email}}</p>
          </div>

        </div>
          
        <div><p><br>Informations utilisateur :</p></div>
        <div style="display:flex; color:gold ; width: 100%;justify-content:center">
          <div style="width: 70%">{{Myuser.info_email}}<br><br></div>
        </div>
        <div><p>Role : <span style="color:gold">{{Myuser.role}}</span></p></div>
      </div>
    </div>

    <h1 style="color:gold"><br>Modifier les informations du profil <br></h1>
    <form @submit.prevent="modify(user)" style="display:flex; flex-direction:column;justify-content:center; gap:1">

      <div><label><br> pseudo (de 5 à 20 caractères) : </label><br>
      <input v-model.trim='user.new_pseudo' minlength="5" maxlength="20" type="text" :placeholder="[[ Myuser.pseudo ]]" /> <br><br></div>

      <div><label> nom (de 4 à 25 caractères) : </label><br>
      <input v-model.trim='user.new_nom' minlength="4" maxlength="25" type="text" :placeholder="[[ Myuser.nom ]]" /> <br><br></div>

      <div><label> prénom (de 3 à 25 caractères) : </label><br>
      <input v-model.trim='user.new_prenom' minlength="3" maxlength="25" type="text" :placeholder="[[ Myuser.prenom ]]" /> <br><br></div>

      <div><label> email (de 10 à 50 caractères) : </label><br>
      <input v-model.trim='user.new_email' minlength="10" maxlength="50" type="text" :placeholder="[[ Myuser.email ]]" /><br><br></div>

      <div><label> informations (vide à jusqu'à 75): <br> </label>
      <textarea v-model.trim='user.new_info_email' style="width:50%"  maxlength="75"  cols="30" rows="5" type="text" :placeholder="[[ Myuser.info_email ]]" ></textarea><br><br></div>

      <div><button type="submit">Modifier profil</button><br><br></div>
    </form>

    <h1 style="color:gold"><br> Modifier l'avatar<br></h1>
    <form :action="`${localhost}/upload_an_avatar/${MyTokenStore.token}/${MyTokenStore.myid}/${userId}`" method="POST" enctype="multipart/form-data"><br>
      <input type="file" name="image"/>
      <button type="submit">Valider l'avatar</button><br><br>
    </form>


    <h1 style="color:red"><br> Changer le mot de passe <br></h1>
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


    <h1 style="color:red"><br> Modifier le rôle <br></h1>
    <form @submit.prevent="modify_role()"><br>
      <label> mot de passe : </label><br>
      <input v-model.trim='new_role.password' maxlength="20" placeholder="mot de passe" type="password" /> <br>
      <br>
      <div v-if="MyTokenStore.role == 'ADMIN'">
          <label for="prenom"> Rôle : </label><br>
          <select name="roles" id="roles" class="largeur" v-model.trim='new_role.role'> 
          <option value="">- Selectionner rôle -</option>
          <option value="USER">Utilisateur</option>
          <option value="ADMIN">Administrateur</option>
          </select>
      </div>
      <br>
      <button type="submit">Valider</button><br><br>
    </form>


    <h1 style="color:red"><br> Supprimer l'utilisateur <br></h1>
    <form @submit.prevent="delete_user()"><br>
      <label> mon mot de passe : </label><br>
      <input v-model.trim='deleteUser.my_password' maxlength="20" type="password" /> <br>

      <br>
      <button type="submit">Valider</button><br><br>
    </form>


</div>

<div v-else>{{router.push("/")}}</div>

</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { TokenStore } from "../stores/token";
import { UserStore } from "../stores/user";
import { useRoute } from "vue-router";
import {localhost } from '../components/plugin/localhost'
var route = useRoute();
var userId = route.params.id;

onMounted(()=>{
    show_one_user()
});

const MyTokenStore = TokenStore();
const Myuser = UserStore();
const router = useRouter();

var user = ref({
  id_user : userId,
  new_pseudo: Myuser.pseudo,
  new_nom:Myuser.nom ,
  new_prenom:Myuser.prenom,
  new_email:Myuser.email,
  new_info_email:Myuser.info_email,
  avatar:  Myuser.avatar,
  role: Myuser.role
});

var new_role ={
  id_user: userId,
  password: "",
  role : ""
}

var new_password ={
  id_user: userId,
  my_password: "",
  new_password : ""
}

var deleteUser = {
  id_user: userId,
  my_password: "",
}

var confirm_password = "";

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
  
    let response = await fetch(`${localhost}/modify_one_User`, {
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

async function modify_role() {
  
    if (!( (new_role.role=="ADMIN")||(new_role.role=="USER") )) {
    alert ("Role : deux choix possibles uniquement.")
    return
    }

    if ( !(new_role.password) || !(typeof new_role.password === "string") || (new_role.password.length > 20)){
      alert ("password invalide : mauvais format, trop long ou non renseigné.")
      return
    } ;

    let response = await fetch(`${localhost}/modify_one_User_role`, {
      method: "PUT",
      headers: {
      "Authorization": MyTokenStore.token,
      "Content-Type": "application/json",
      },
  
      body: JSON.stringify(new_role)
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


    let response = await fetch(`${localhost}/modify_one_User_password`, {
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

async function delete_user() {
  
    if ( !(deleteUser.my_password) || !(typeof deleteUser.my_password === "string") || (deleteUser.my_password.length > 20)){
      alert ("password invalide : mauvais format, trop long ou non renseigné.")
      return
    } ;

    let response = await fetch(`${localhost}/delete_user`, {
      method: "PUT",
      headers: {
      "Authorization": MyTokenStore.token,
      "Content-Type": "application/json",
      },
  
      body: JSON.stringify(deleteUser)
    })
      .then((response) => response.json())
      .catch((error) => {
      console.log("Failed", error)
      });
  
    if(response.error){
      alert(response.message);
      return
    }

  Myuser.id = "";
  Myuser.nom = "";
  Myuser.prenom = "";
  Myuser.email = "";
  Myuser.info_email = "";
  Myuser.role = "";
  Myuser.pseudo = "";
  Myuser.avatar = "";

  router.push("/");
}

async function show_one_user() {

  let response = await fetch(`${localhost}/show_one_User/`+userId, {
    method: "GET",
    headers: {
    "Authorization": MyTokenStore.token,
    "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
    console.log("Failed", error)
    });

  if(response.error){
    alert(response.message);
    return
  }

  Myuser.id = response.idUser;
  Myuser.nom = response.nom;
  Myuser.prenom = response.prenom;
  Myuser.email = response.email;
  Myuser.info_email = response.info_email;
  Myuser.role = response.role;
  Myuser.pseudo = response.pseudo;
  Myuser.avatar = response.avatar;

}

</script>
  