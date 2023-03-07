<template>
  <div style="display:flex ; margin-bottom : 60px ; margin-top : 60px ; justify-content:center; "
    v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'">
    <div style="flex-direction:column;  margin-bottom:50px ; padding : 15px ; box-shadow: 0px 0px 5px white;text-align:center;border: 1px solid grey ;  border-radius:5px ; " class="largeurbook">
      <div><h2>   Modifier votre commentaire : </h2></div>

      <form  @submit.prevent="Modifycomment(commentId, comment)" style=" display:flex ; flex-direction:column ;  ">
          <br><br>
          <input  v-model.trim="comment.thetitle" style="font-family : inherit; margin-bottom:20px; margin-top:20px" type="text" maxlength="75" />
          <br>
          <textarea v-model.trim="comment.thecomment" style="font-family : inherit; margin-bottom:20px;" cols="30" rows="5" type="text" maxlength="505"></textarea><br>
          <div><button type="submit" style="width:30%">Publier</button></div>
      </form>
    </div>

  </div>

</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { TokenStore } from "../stores/token";
 import { ModifyComment } from "../stores/comment";
var MyTokenStore = TokenStore();
import { useRoute } from "vue-router";
import { actualisation_user} from "../../src/components/plugin/function";
var route = useRoute();
import { useRouter } from "vue-router";
import {localhost } from '../components/plugin/localhost'
var router = useRouter();
var Mycomment2 = ModifyComment() ;
var commentId = route.params.id;
var comment = ref({
  thetitle: Mycomment2.title,
  thecomment: Mycomment2.comment
});

  onMounted(()=>{
    var commentId = route.params.id;
    actualisation_user();
  });

async function Modifycomment(param1, param2) {

    if ( !(comment._value.thetitle) || !(comment._value.thecomment) ){
      alert ("veuillez remplir tous les champs svp")
      return
    } ;

    if ( comment._value.thetitle.length < 10 || comment._value.thecomment.length < 10){
      alert ("un ou plusieurs champs trop court(s)")
      return
    } ;

    if ( comment._value.thetitle.length >75 || comment._value.thecomment.length > 505){
      alert ("un ou plusieurs champs trop long(s)")
      return
    } ;

  let response = await fetch(`${localhost}/modifyComment/`+param1, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": MyTokenStore.token,
        },
        body: JSON.stringify(param2)
    })
        .then((response) => response.json())
        .catch((e) => {
            console.warn("Failed", e)
        });

        console.log(response) ;

  router.push("/");
}

</script>