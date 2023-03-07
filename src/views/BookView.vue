<template>
  <div v-if="MyTokenStore.role == ''">
      <h2 class="mesflexx" style="margin:20px; margin-top:60px">Bienvenue</h2>
  </div>
  <div class="mesflexx, navigation-welcome" v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'"> 
    <div class="navigation_welcome_sousflex">
      <div><h2> Bienvenue <span style="font-size:35px" class="fondbeau" >{{MyTokenStore.pseudo}}</span></h2><br></div>
      <div class="mesflexx">
        <div style="display:flex; align-items:center">
          <div v-if="MyTokenStore.avatar != `null`">
            <img :src="`/src/components/upload/`+`${MyTokenStore.avatar}`" style="width:150px" />
          </div>
          <div v-if="MyTokenStore.avatar == `null`">
            <img src="/src/components/upload/smile-default-avatar.png" style="width:150px" />
          </div>
          <div class="ma_liste">
            <ul>
              <div v-on:click="deconnexion()">
                <li>Déconnexion</li>
              </div>
              <div>
                <!-- <RouterLink to="/myprofil"> -->
                <li v-on:click="profilutilisateur(MyTokenStore.myid)" >Mon profil</li>
                <!-- </RouterLink> -->
              </div>
              <div v-if="MyTokenStore.role == `ADMIN`">
                <RouterLink to="/all_users">
                  <li>Admin</li>
                </RouterLink>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="MyTokenStore.role == `ADMIN`|| MyTokenStore.role==`USER`"><RouterLink to=/write><button class="title_second" >Ecrire un message sur le livre d'Or</button></RouterLink></div>
    </div>
  </div> 

  <div v-if="MyTokenStore.role !== 'ADMIN' && MyTokenStore.role !== 'USER'" class="accueil" style="margin-bottom:60px">
      <p>Pour ajouter un commentaire, il faut s'inscrire et se connecter : </p>
      <div style="display:flex"><button><RouterLink to="/inscription">
        <span style="color:black"> M'inscrire </span></RouterLink></button>
        <button><RouterLink to="/connection"><span style="color:black"> Me connecter </span></RouterLink></button>
      </div>
  </div>

  <h1 class="fondbeau" style=" font-size:90px;">Livre d'Or</h1>
      <div v-for="article in useListComments2.list" :key="article.idComment" >
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
              <div class="mesflexx" style="display:flex;align-items:center;"> 
                  <div class="author_case">
                    <img v-if="article.authorAvatar != `null`" :src="`/src/components/upload/`+`${article.authorAvatar}`" class="the_avatar" />
                    <img v-if="article.authorAvatar == `null`" :src="`/src/components/upload/smile-default-avatar.png`" class="the_avatar" />
                  </div>
                  <div>
                      <p> écrit par <span class="author_text "  v-on:click="profilutilisateur(article.authorId)"> {{article.authorPseudo}}</span></p>
                      <p class="article_info_author">{{ article.info_author }}</p>
                  </div>
              </div>
            </div>
            <div class="article_title"> <h3>{{ article.title }}</h3></div>
            <div class="the_comment"> <p>{{ article.comment }}</p></div>
              <div v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'" style="margin:20px">
                <div class="icons_like_dislike" v-if="MyTokenStore.role == 'ADMIN' || MyTokenStore.role == 'USER'">
                    <div v-if="(article.ifilike == 'yes')" class="actions_like">
                      <div><img src="@/components/icons/heart.png" style="height:30px;"/></div>
                      <div><p class="dont_like" v-on:click="Idislike(article.idComment)"> Je n'aime plus</p></div>
                    </div>
                    <div v-if="(article.ifilike == 'no')">
                      <div v-on:click="Ilike(article.idComment)" class="the_like">
                        <div style="font-size:15px" > <img src="@/components/icons/113978-2-3.png" style="height:30px; margin:0px;"/></div>
                        <div> <p class="you_like"> Clic si tu aimes !</p> </div>
                      </div>
                    </div>
                </div>
              </div>
              <div>
                <p class="liste_like"  v-if="(article.LikeCount > 0)"> {{article.LikeCount}} Likes par : </p>
                <!-- <p><span class="liste_like" v-if="(article.LikeCount > 0)"> Likes par : </span></p> -->
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
import { onMounted } from "@vue/runtime-core";
import { useListComments} from "../stores/comments";
import { useListUserComments} from "../stores/usercomments "
import { useListLikes } from "../stores/likes";
import { showcomments, showlikes, addcomment, Ilike, Idislike, deconnexion, deletecomment, actualisation_user, redirection,  } from "../../src/components/plugin/function";
import { TokenStore } from "../stores/token";
import {localhost } from '../components/plugin/localhost';
import { useRouter } from "vue-router";
var router = useRouter();
import { ModifyComment } from "../stores/comment";
var Mycomment2 = ModifyComment() ;
var MyTokenStore = TokenStore();
var useListComments2 = useListComments();
var useListLikes2 = useListLikes();
var useListUserComments2 =useListUserComments();
import { UserStore } from "../stores/user";
const Myuser = UserStore();

const envoie = {
  thetitle: "",
  thecomment: "",
  idConnect: MyTokenStore.myid
};

onMounted(()=>{
  actualisation_user();
    showcomments() ;
    showlikes()
});

//pour aller vers page d emodif d'un commentaire (le mien ou admin)
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

//pour aller à la page profil d'un utilisateur en cliquant sur son nom ou avatar
async function profilutilisateur(ID) {

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

  showcommentsforUserProfile(ID);

  router.push(`/profile_user/`+ ID)
}
//en complement de la précédante fonction, voir ses commentaire aussi 
async function showcommentsforUserProfile(ID) {
    var objet = {
        id_liker : "",
        id_user : ID,
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


  <style scoped>

  .navigation_welcome{
    text-align:center;margin-bottom:60px
  }

  .navigation_welcome_sousflex{
    display:flex;flex-direction:column;align-content:stretch;align-items:stretch;text-align:center; justify-content:space-between
  }

  .article_title{
    margin:15px;font-size:14px;text-align:justify;font-weight:bold;color:gold; margin-bottom:20px; margin-top:40px;
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
    font-size:15px;font-weight:bold;color:gold; text-decoration:underline; cursor:pointer;
  }

  .the_comment{
    margin:15px;font-size:13px;text-align:justify; margin-bottom:20px;
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