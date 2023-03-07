<template>

  <div v-if="MyTokenStore.role == ''">
      <h2 class="mesflexx" style="margin:20px; margin-top:60px">Bienvenue</h2><br> 
  </div>

    <div class="mesflexx" style="text-align:center" v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'"> 
      <div style="display:flex;flex-direction:column;align-content:stretch;align-items:stretch;text-align:center; justify-content:space-between">
        <div><RouterLink to="/myprofil"><h2>Bienvenue <span style="color:gold;text-decoration:underline">{{MyTokenStore.pseudo}}</span></h2></RouterLink><br></div>
        <div class="mesflexx">
          <div style="display:flex; align-items:center">
            <div v-if="MyTokenStore.avatar != `null`">
              <img :src="`/src/components/upload/`+`${MyTokenStore.avatar}`" style="width:150px" />
            </div>
            <div v-if="MyTokenStore.avatar == `null`">
              <img src="/src/components/upload/smile-default-avatar.png" style="width:150px" />
            </div>
          </div>
        </div>
      </div>
    </div> 

  <div v-if="MyTokenStore.role !== 'ADMIN' && MyTokenStore.role !== 'USER'" class="accueil">
        <p>Pour ajouter un commentaire, il faut s'inscrire et se connecter : </p>
          <div style="display:flex"><button><RouterLink to="/inscription"><span style="color:black"> M'inscrire </span></RouterLink></button>
          <button><RouterLink to="/connection"><span style="color:black"> Me connecter </span></RouterLink></button></div>
  </div>

  <div  class="mesflexx" style="display:flex;margin-bottom:60px;margin-top:60px" v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'"> <!--/*!!!*/-->
    <div style="flex-direction:column;margin-bottom:50px;padding:15px;box-shadow: 0px 0px 5px white;text-align:center;border: 1px solid grey;border-radius:5px;" class="largeurbook">
      <div><h2> Ecrire un commentaire : </h2></div>
      <form @submit.prevent="addcomment()" style="display:flex;flex-direction:column">
          <br><br>
          <input v-model.trim='envoie.thetitle' style="font-family:inherit;margin-bottom:20px;margin-top:20px" placeholder="titre" type="text" maxlength="75" />
          <br>
          <textarea v-model.trim='envoie.thecomment' style="font-family:inherit;margin-bottom:20px;" cols="30" rows="5" placeholder="écrire ici votre commentaire" type="text" maxlength="505"></textarea><br>
          <div><button type="submit" style="width:30%">Publier</button></div>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { useListComments} from "../stores/comments";
import { useListLikes } from "../stores/likes";
import { actualisation_user } from "../../src/components/plugin/function";
import { TokenStore } from "../stores/token";
import { useRouter } from "vue-router";
import {localhost } from '../components/plugin/localhost';

const router = useRouter();
var MyTokenStore = TokenStore();
var useListComments2 = useListComments();
var useListLikes2 = useListLikes();

const envoie = {
  thetitle: "",
  thecomment: "",
  idConnect: MyTokenStore.myid
};

onMounted(()=>{
  actualisation_user();
});



async function addcomment() {

  if ( !(envoie.thetitle) || !(envoie.thecomment) ){
    alert ("veuillez remplir tous les champs svp")
    return
  } ;

  if ( envoie.thetitle.length > 75 || envoie.thecomment.length > 505){
    alert ("un ou plusieurs champs trop long(s)")
    return
  } ;

  if ( envoie.thetitle.length < 5 || envoie.thecomment.length < 10){
    alert ("un ou plusieurs champs trop court(s)")
    return
  } ;

  if (!(typeof envoie.thetitle == "string" && typeof envoie.thecomment == "string")){
    alert (typeof envoie.thetitle + typeof envoie.thecomment)
    alert ("Texte uniquement")
    return
  } ;

    let response = await fetch(`${localhost}/write`, {
      method: "POST",
      headers: {
        "Authorization": MyTokenStore.token,
        "Content-Type": "application/json",
        },
      body: JSON.stringify(envoie)
    })
      .then((response) => response.json())
      .catch((error) => {
      console.log("Failed", error)
      });
    
    if(response.error){
      alert(response.message);
      return
    };

  router.push("/");
}

</script>


  <style scoped>

  .mesflexx{
    display:flex;
    text-align:center;
    justify-content:center; 
    align-items: center;
    align-content : center ; 
  } 

  p {
    color: white;
    font-family: "Gill Sans", sans-serif;
  }

  h2,h3 {
    font-family: "Gill Sans", sans-serif;
  }
  
  .accueil{
    display:flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  button{
    background-color: white;
    border: 1px solid #555555;
    border-radius:10%;
    margin:2px;
    font-size: 16px;
  }
  
  </style>