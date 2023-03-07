<template>
    <h1 style="color:white;text-align:center;"> Mon Profil !!!!! : <br></h1>

    <div style="display:flex;align-content:center;justify-content:center;align-items:center;margin-bottom:60px">
      <div style="display:flex;flex-direction:column;padding:30px;border: 1px dashed white;border-radius:5px; align-items:center;align-content:center">
        <div>
          <h2><span style="color:gold">{{MyTokenStore.pseudo}}</span></h2><br>
        </div>
        <div v-if="MyTokenStore.avatar != `null`">
          <img :src="`/src/components/upload/`+`${MyTokenStore.avatar}`" style="width:180px;;border: 1px solid yellow ; border-radius :5px"/>
        </div>
        <div v-if="MyTokenStore.avatar == `null`">
          <img src="/src/components/upload/smile-default-avatar.png" style="width:180px" />
        </div>
        <div>
          <p style="margin-top:50px">Nom : <span style="color:gold">{{MyTokenStore.nom}}</span></p>
        </div><br>
        <div>
          <p>Prénom : <span style="color:gold">{{MyTokenStore.prenom}}</span></p>
        </div>
        <div style="display:flex;justify-content:center;align-items:center;align-content:center">
          <div> 
            <img src="@/components/icons/envv.png" style="width:35px;margin-right: 15px" /> 
          </div> 
          <div style="align-items:center;align-content:center">
            <p style="color:gold">{{MyTokenStore.email}}</p>
          </div>
        </div>
        <div><p><br>Informations utilisateur :</p></div>
        <div style="display:flex;color:gold;width: 100%;justify-content:center">
          <div style="width: 70%">{{MyTokenStore.info_email}}<br><br><br></div>
        </div>
        <div>
          <button><RouterLink to="/modifymyprofil">
          <p style="color:black"> Modifier mon profil</p></RouterLink></button>
        </div>
      </div>
    </div>

    <h1 style="color:white;text-align:center;margin-bottom:40px"> Mes inscriptions au Livre d'Or : <br></h1>


      <div v-for="article in My_comments.list" :key="article.idComment">
        <div class="mesflexx" style="display:flex"> <!--/*!!!*/-->
          <div style="flex-direction:column;border: 1px dashed white;margin-bottom:50px;width:100%;padding:15px;border-radius:5px;width:70%;align-items:center">
            <div>
              <div v-if=" MyTokenStore.myid === article.authorId" style="display:flex;justify-content:flex-end">
                <div style="text-align:right" v-on:click="deletecomment(article.idComment)"><button> x </button>
                </div>
                <div style="text-align:right">
                  <!-- <router-link :to="{ name: 'comment_edit', params: {id : article.idComment }}"> -->
                    <button v-on:click="thecomment(article.idComment)"> Editer </button>
                  <!-- </router-link> -->
                </div>
              </div>
              <div class="mesflexx" style="display:flex ;"> <!--/*!!!*/-->
                  <div style="margin:15px;font-size:15px;font-weight:bold;width:65%">
                    <h3 style="color:gold">{{ article.title }}</h3>
                  </div>
              </div>
            </div>
            <div style="margin:15px; margin-bottom:30px;font-size:15px;text-align:justify"> <p>{{ article.comment }}</p></div>
            </div>
        </div>
      </div>


</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { TokenStore } from "../stores/token";
import { useListMyComments } from "../stores/mycomments";
import { deletecomment, actualisation_user } from "../../src/components/plugin/function";
import { onMounted } from "@vue/runtime-core";
import {localhost } from '../components/plugin/localhost';
import { ModifyComment } from "../stores/comment";
var Mycomment2 = ModifyComment() ;

const MyTokenStore = TokenStore();
const router = useRouter();
var My_comments = useListMyComments();

onMounted(()=>{
  My_comments.$reset();
  actualisation_user();
  my_comments()
});


async function my_comments() {

    My_comments.$reset();

    let response = await fetch(`${localhost}/show_my_comments`, {
      method: "POST",
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

    My_comments.list = response;

}

async function thecomment(truc) {
let response =
  await fetch(`${localhost}/show_comment/`+truc, {
      method: "GET",
  })
      .then((response) => response.json())
      .catch((e) => {
          console.warn("Failed", e)
      });
      Mycomment2.title = response.title;
      Mycomment2.comment = response.comment;
      Mycomment2.idComment = response.idComment;
      Mycomment2.authorId = response.authorId;
      router.push(`/comment/edit/commentform/`+ Mycomment2.idComment)
}


</script>


<style>

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

</style>