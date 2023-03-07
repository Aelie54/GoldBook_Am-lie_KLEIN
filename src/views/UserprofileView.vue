<template>
    <h1 style="color:white;text-align:center;"> Mon Profil : <br></h1>

    <div style="display:flex;align-content:center;justify-content:center;align-items:center;margin-bottom:60px">
      <div style="display:flex;flex-direction:column;padding:30px;border: 1px dashed white;border-radius:5px; align-items:center;align-content:center">
        <div>
          <h2><span style="color:gold">{{Myuser.pseudo}}</span></h2><br>
        </div>
        <div v-if="Myuser.avatar != `null`">
          <img :src="`/src/components/upload/`+`${Myuser.avatar}`" style="width:180px;;border: 1px solid yellow ; border-radius :5px"/>
        </div>
        <div v-if="Myuser.avatar == `null`">
          <img src="/src/components/upload/smile-default-avatar.png" style="width:180px" />
        </div>
        <div>
          <p style="margin-top:50px">Nom : <span style="color:gold">{{Myuser.nom}}</span></p>
        </div><br>
        <div>
          <p>Prénom : <span style="color:gold">{{Myuser.prenom}}</span></p>
        </div>
        <div style="display:flex;justify-content:center;align-items:center;align-content:center">
          <div> 
            <img src="@/components/icons/envv.png" style="width:35px;margin-right: 15px" /> 
          </div> 
          <div style="align-items:center;align-content:center">
            <p style="color:gold">{{Myuser.email}}</p>
          </div>
        </div>
        <div><p><br>Informations utilisateur :</p></div>
        <div style="display:flex;color:gold;width: 100%;justify-content:center">
          <div style="width: 70%">{{Myuser.info_email}}<br><br><br></div>
        </div>
        <div v-if="Myuser.id == MyTokenStore.myid">
          <button><RouterLink to="/modifymyprofil">
          <p style="color:black"> Modifier mon profil</p></RouterLink></button>
        </div>
      </div>
    </div>

    <h1 style="color:white;text-align:center;margin-bottom:40px"> Mes inscriptions au Livre d'Or : <br></h1>

     <h1 class="fondbeau" style=" font-size:90px;">Livre d'Or</h1>
      <div v-for="article in useListUserComments2.list" :key="article.idComment" >
        <div class="mesflexx"> 
          <div class="inscriptions">
            <div>
               <div v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.myid === article.authorId" class="edit_comment">
                <div style="text-align:right" v-on:click="deletecomment(article.idComment)">
                  <button> x </button>
                </div>
                <div style="text-align:right">
                    <button v-on:click="thecomment(article.idComment)"> Editer </button>
                </div>
              </div>
            </div>
            <div class="article_title"> <h3>{{ article.title }}</h3></div>
            <div class="the_comment"> <p>{{ article.comment }}</p></div>
              <div v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'" style="margin:20px">

                <div class="icons_like_dislike"  v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'">
                    <div v-if="(article.ifilike == 'yes')" class="actions_like">

                      <div><img src="@/components/icons/heart.png" style="height:30px;"/></div>
                      <div><p class="dont_like" v-on:click="Idislike2(article.idComment)"> Je n'aime plus</p></div>

                    </div>
                    <div v-if="(article.ifilike == 'no')">

                      <div v-on:click="Ilike2(article.idComment)" class="the_like">
                        <div style="font-size:15px" > <img src="@/components/icons/113978-2-3.png" style="height:30px; margin:0px;"/></div>
                        <div> <p class="you_like"> Clic si tu aimes !</p></div>
                      </div>

                    </div>
                </div>

              </div>
              <div v-if="(article.LikeCount > 0)">
                <p><span class="liste_like">Liké par : </span></p>
              </div>

              <div style="display:flex;" v-if="(article.LikeCount > 0)">
                <div v-for="truc in useListLikes2.list" :key="truc.idLikes">
                  <div v-if="article.idComment == truc.commentId" >
                          <div v-on:click="profilutilisateur(truc.LikerId)" style="display:flex; flex-direction:column;align-items:center; cursor:pointer">
                            <img v-if="truc.Likeravatar != `null`" :src="`/src/components/upload/`+`${truc.Likeravatar}`" style="width:50px;margin-left:7px " />
                            <img v-if="truc.Likeravatar == `null`" src="/src/components/upload/smile-default-avatar.png" style="width:50px;margin-left:7px " />
                            <p class="liker_pseudo" style="hover:underline">{{truc.LikerPseudo }},</p>
                          </div>
                  </div>
                </div>
              </div>

          </div>
        </div>
      </div>



</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { TokenStore } from "../stores/token";
import { useListMyComments } from "../stores/mycomments";
import { deletecomment, actualisation_user, showlikes } from "../../src/components/plugin/function";
import { onMounted } from "@vue/runtime-core";
import {localhost } from '../components/plugin/localhost';
import { ModifyComment } from "../stores/comment";
import { UserStore } from "../stores/user";
import { useListLikes } from "../stores/likes";
import { useListUserComments} from "../stores/usercomments ";
import { useRoute } from "vue-router";
var route = useRoute();
var userId = route.params.id;
var useListUserComments2 =useListUserComments();
var useListLikes2 = useListLikes();
const Myuser = UserStore();
var Mycomment2 = ModifyComment() ;
const MyTokenStore = TokenStore();
const router = useRouter();
var My_comments = useListMyComments();

onMounted(()=>{
  actualisation_user();
  showlikes();
});

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

async function Ilike2(truc) {
    const thelike = {
      id_liker: MyTokenStore.myid,
      id_comment: parseInt(truc),
    };
    let response = await fetch(`${localhost}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(thelike)
      })
        .then((response) => response.json())
        .catch((error) => {
        console.log("Failed", error)
        });
      
      if(response.error){
        alert(response.message);
        return
      }
      showcommentsforUserProfile()
      showlikes();
}

async function Idislike2(truc) {
    const thedislike = {
      id_liker: MyTokenStore.myid,
      id_comment: parseInt(truc),
    };

    let response = await fetch(`${localhost}/dislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(thedislike)
      })
        .then((response) => response.json())
        .catch((error) => {
        console.log("Failed", error)
        });
      
      if(response.error){
        alert(response.message);
        return
      }
      showcommentsforUserProfile()
      showlikes();
}

//en complement de la précédante fonction, voir ses commentaire aussi 
async function showcommentsforUserProfile() {
    var objet = {
        id_liker : "",
        id_user : userId,
    }
    if (MyTokenStore.myid == ""){
        MyTokenStore.myid = "0" 
    }

    objet.id_liker = MyTokenStore.myid;
    let response =
      await fetch(`${localhost}/show_comments_withID_IdUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(objet)
      })
          .then((response) => response.json())
          .catch((e) => {
              console.warn("Failed", e)
          });
    useListUserComments2.list = response
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




 .navigation_welcome{
    text-align:center;margin-bottom:60px
  }

  .navigation_welcome_sousflex{
    display:flex;flex-direction:column;align-content:stretch;align-items:stretch;text-align:center; justify-content:space-between
  }

  .article_title{
    margin:15px;font-size:14px;text-align:justify;font-weight:bold;color:gold; margin-bottom:20px; margin-top:40px;
  }

  .the_comment{
    margin:15px;font-size:13px;text-align:justify; margin-bottom:20px;
  }

  .the_like{
    cursor:pointer;display:flex;align-items:center;justify-content:flex-start
  }

  .title_second{
    font-size:15px;margin-top:30px
  }

  .the_avatar{
    width:90px;border: 1px solid yellow;border-radius :5px
  }

  .mesflexx{
    display:flex;
    text-align:center;
    justify-content:center; 
    align-items: center;
    align-content : center ; 
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
    font-family: "Gill Sans", sans-serif;
    font-size:40px;
    color:gold
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

  li{
    list-style-type : none   ;
    margin:5px;
    cursor:pointer;
    text-align: left;
    text-decoration:underline;
    font-size:15px;
    color: white;
    font-family: "Gill Sans", sans-serif;
  }

  .fondbeau{
  font-family: cursive; 
  background-image: url('https://images.unsplash.com/photo-1545873509-33e944ca7655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2346&q=80');
  background-size: cover;
  background-position: center;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  }

  .ma_liste{
    display:flex;flex-direction:column;width:100%;
  }

  .inscriptions{
    flex-direction:column;border: 1px dashed white;margin-bottom:50px;width:100%;padding:15px;border-radius:5px;width:70%;align-items:center
  }

  .author_case{
    font-size:17px;width:35%;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;
  }

  .author_text{
    font-size:15px;font-weight:bold;color:gold
  }

  .article_info_author{
    font-size:12px;font-weight:italic
  }

  .icons_like_dislike{
    display:flex;margin-right:15px;justify-content:right
  }
  .you_like{
    margin-left:10px;color:red;font-style:italic;text-decoration:underline;margin-right:5px
  }

  .dont_like{
    margin-left:10px; font-size:15px;font-style:italic;text-decoration:underline;cursor :pointer
  }

  .liste_like{
    display:flex;margin-left:10px;margin-right:15px; text-align:left;font-size:12px
  }
  
  .actions_like{
    display:flex;align-items:center;justify-content:flex-start
  }

  .edit_comment{
    display:flex;justify-content:flex-end
  }

  .liker_pseudo{
    margin-left:10px; font-size:12px
  }


</style>