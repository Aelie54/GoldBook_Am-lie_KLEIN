<template>

<div v-if="MyTokenStore.role == 'ADMIN'" class="flex_0">
  <h1>
    <br> Liste des utilisateurs :
  </h1>
  <div class="flex_1">
        <a style=" cursor : pointer" v-on:click="search('A')">A</a>
        <a style=" cursor : pointer" v-on:click="search('B')">B</a>
        <a style=" cursor : pointer" v-on:click="search('C')">C</a>
        <a style=" cursor : pointer" v-on:click="search('D')">D</a>
        <a style=" cursor : pointer" v-on:click="search('E')">E</a>
        <a style=" cursor : pointer" v-on:click="search('F')">F</a>
        <a style=" cursor : pointer" v-on:click="search('G')">G</a>
        <a style=" cursor : pointer" v-on:click="search('H')">H</a>
        <a style=" cursor : pointer" v-on:click="search('I')">I</a>
        <a style=" cursor : pointer" v-on:click="search('J')">J</a>
        <a style=" cursor : pointer" v-on:click="search('K')">K</a>
        <a style=" cursor : pointer" v-on:click="search('L')">L</a>
        <a style=" cursor : pointer" v-on:click="search('M')">M</a>
        <a style=" cursor : pointer" v-on:click="search('N')">N</a>
        <a style=" cursor : pointer" v-on:click="search('O')">O</a>
        <a style=" cursor : pointer" v-on:click="search('P')">P</a>
        <a style=" cursor : pointer" v-on:click="search('Q')">Q</a>
        <a style=" cursor : pointer" v-on:click="search('R')">R</a>
        <a style=" cursor : pointer" v-on:click="search('S')">S</a>
        <a style=" cursor : pointer" v-on:click="search('T')">T</a>
        <a style=" cursor : pointer" v-on:click="search('U')">U</a>
        <a style=" cursor : pointer" v-on:click="search('V')">V</a>
        <a style=" cursor : pointer" v-on:click="search('W')">W</a>
        <a style=" cursor : pointer" v-on:click="search('X')">X</a>
        <a style=" cursor : pointer" v-on:click="search('Y')">Y</a>
        <a style=" cursor : pointer" v-on:click="search('Z')">Z</a><br><br>
        <button v-on:click="showusers()">Afficher tous les utilisateurs</button>
        <p><br><br></p>
    </div> 
      <div class="flex_2">
        <form @submit.prevent="search_user" style="margin-bottom:40px ; ">
                <input type="text"  style="font-size : 15px ; margin-right : 10px;"
                v-model.trim='input.message' 
                maxlength="20" 
                required />
            <button type="submit" placeholder="rechercher"> Rechercher</button> 
        </form>
      </div>
    <div class="flex_3">
      <div v-for="user in UsersStore2.list" :key="user.idUser" class="flex_4">
        <div style="cursor:pointer;border: gold 2px solid;border-radius:3px" v-on:click="show_one_user(user.idUser)">               
          <div class="case "> 
            <div>
              <p><span style="color:gold">{{user.pseudo}}</span></p>
            </div>
            <div v-if="user.avatar != `null`">
              <img :src="`/src/components/upload/`+`${user.avatar}`" class="avatar_user_admin"/>
            </div>
            <div v-if="user.avatar == `null`">
              <img src="/src/components/upload/smile-default-avatar.png" class="avatar_user_admin" />
            </div>
            <div>
              <p><span style="color:white">{{user.nom}}</span></p>
            </div>
            <div><p>
              <span style="color:white">{{user.prenom}}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
<div v-else>{{router.push("/")}}</div>
</template>


<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { usersStore } from "../stores/users";
import { showusers, actualisation_user } from "../../src/components/plugin/function";
import { TokenStore } from "../stores/token";
import {localhost } from '../components/plugin/localhost';
import { UserStore } from "../stores/user";
const Myuser = UserStore();
var router = useRouter();
const MyTokenStore = TokenStore();
const UsersStore2 = usersStore();

onMounted(()=>{
  actualisation_user();
    showusers() ;
});

let message = "" ; 
let input = {
  message: ""
};

async function search(letter) {

  let response = await fetch(`${localhost}/users_search/${letter}`, {
    method: "POST",
    headers: {
        "Authorization": MyTokenStore.token,
        "Content-Type": "application/json",
    },
  })
    .then((r) => r.json())
    .catch((e) => {
    console.log("Failed", e)
    });
    UsersStore2.list= ""
    UsersStore2.list = response
}


async function search_user() {
  message = ((input.message).replace(/ /g,''));

  if(typeof (message) != "string" && message !="" && message.length > 20){
    return ("champs recherché non autorisé")
  }

  let response = await fetch(`${localhost}/search_pseudo/${message}`, {
      method: "GET",
      headers: {
        "Authorization": MyTokenStore.token,
        "Content-Type": "application/json",
      },
    })

      .then((r) => r.json())
      .catch((e) => {
      console.log("Failed", e)
      });
    UsersStore2.list= ""
    UsersStore2.list = response
}


async function show_one_user(ID) {

  let response = await fetch(`${localhost}/show_one_User/`+ID, {
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
  Myuser.role = response.role;

  router.push(`/user/`+ ID)
}

</script>


<style>

  template {
    width: 100%; /*50*/
  }

  p {
    font-size:14px;
    color: white;
    font-family: "Gill Sans", sans-serif;
  }

  h2,h3 {
    font-family: "Gill Sans", sans-serif;
  }

  h1 {
    text-align:center;
    text-align:center;
    font-family: "Gill Sans", sans-serif;
    font-size:40px;
    color:white
  }

  .case{
    border: 1px dashed white ; border-radius:5px ; 
    flex-wrap:wrap; margin:5px;
  }

  .avatar_user_admin{
    max-height:130px; max-width:140px ;border: 1px solid yellow ; border-radius :5px ; margin:10px
  }

  .flex0{
    display:flex ; flex-direction:column; margin-bottom:50px ; width:100% ; flex-wrap: wrap; justify-content:center; align-items: center; margin-top : 60px
  }

  .flex_1{
    display:flex;justify-content:center; align-items: center; gap : 25px ; margin:20px ; flex-wrap: wrap;
  }

  .flex_2{
    display:flex; justify-content:center
  }

  .flex_3{
    display:flex ; flex-wrap:wrap ; justify-content:center ; 
  }

  .flex_4{
   display:flex; text-align:center; justify-content: center ; align-items : center ; margin:0
  }

    a:hover {
      cursor: pointer;
      text-decoration: underline;
      color:red;
    }

    a.active{
        color:gold;
    }

    a{
      font-family: "Gill Sans", sans-serif;
      font-size: 16px;
    }


</style>