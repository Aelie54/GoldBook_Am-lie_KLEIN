import { useRouter } from "vue-router";
import { useListComments } from "../../stores/comments";
import { TokenStore } from "../../stores/token";
import { useListLikes } from "../../stores/likes";
import { ModifyComment } from "../../stores/comment";
import { usersStore } from "../../stores/users";
import {localhost } from './localhost';
const Mycomment2 = ModifyComment() ;
const MyTokenStore = TokenStore();
var useListComments2 = useListComments();
var useListLikes2 = useListLikes();
var UsersStore2 = usersStore();

export async function actualisation_user() {
    let response = await fetch(`${localhost}/actualisation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": MyTokenStore.token,
      },
      body: JSON.stringify()
    })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Failed", error)
});

if(response.message == " Not found user with this email ") 
{
MyTokenStore.avatar = ""
MyTokenStore.email = "";
MyTokenStore.nom = "";
MyTokenStore.prenom = "";
MyTokenStore.role = "";
MyTokenStore.pseudo = "";
MyTokenStore.info_email = "";
}

if(response.error){
    alert(response.message);
    return
}
MyTokenStore.avatar = response.avatar
MyTokenStore.email = response.email;
MyTokenStore.nom = response.nom;
MyTokenStore.prenom = response.prenom;
MyTokenStore.role = response.role;
MyTokenStore.pseudo = response.pseudo;
MyTokenStore.info_email = response.info_email;
}

//liste de tous les commentaire savec indicateurs de si j'ai liké ou pas
export async function showcomments() {
    var objet = {
        id_liker : "",
    }
    if (MyTokenStore.myid == ""){
        MyTokenStore.myid = "0" 
    }
    objet.id_liker = MyTokenStore.myid;
    // console.log("ID = " + objet.id_liker)
    let response =
      await fetch(`${localhost}/show_comments_withID`, {
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
    useListComments2.list = response
}

//pour avoir la liste de tous les like
export async function showlikes() {
    useListLikes2.$reset;
    let response =
      await fetch(`${localhost}/show_likes`, {
          method: "GET",
      })
          .then((response) => response.json())
          .catch((e) => {
              console.warn("Failed", e)
          });
    useListLikes2.list = response
    showcomments();
}

// export async function Ifilike(truc) {
//   // console.log("IF I LIKE :)" + truc)
//   const ifilike = {
//     id_liker: MyTokenStore.myid,
//     id_comment: parseInt(truc),
//   };
  
//   let response = await fetch(`${localhost}/ifilike`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//           },
//           body: JSON.stringify(ifilike)
//         })
//         .then((response) => response.json())
//           .catch((error) => {
//             console.log("Failed", error)
//           });
          
//           if(response.error){
//             alert(response.message);
//             return
//           }
//         var id = useListIfilike2.list.length;
//         // console.log(id);
//         // response.id = id ;
//         useListIfilike2.list.push(response);
// }

export async function redirection() {
  const router = useRouter();
  router.push("/");
}

export async function deconnexion() {
  if(confirm('Êtes vous sur de vouloir vous déconnecter ?')){
    MyTokenStore.email = "";
    MyTokenStore.pseudo = "";
    MyTokenStore.nom = "";
    MyTokenStore.prenom = "";
    MyTokenStore.myid = "",
    MyTokenStore.role = "";
    MyTokenStore.token = "";
    MyTokenStore.avatar = "";
    MyTokenStore.info_email = "";
    // router.push("/");
    redirection();
  };
}    

export async function addcomment(truc) {

  if ( !(truc.thetitle) || !(truc.thecomment) ){
    alert ("veuillez remplir tous les champs svp")
    return
  } ;

  if ( truc.thetitle.length < 10 || truc.thecomment.length < 10){
    alert ("un ou plusieurs champs trop court(s)")
    return
  } ;

  if ( truc.thetitle.length >180 || truc.thecomment.length > 1000){
    alert ("un ou plusieurs champs trop long(s)")
    return
  } ;

    let response = await fetch(`${localhost}/write`, {
      method: "POST",
      headers: {
        "Authorization": MyTokenStore.token,
        "Content-Type": "application/json",
        },
      body: JSON.stringify(truc)
    })
      .then((response) => response.json())
      .catch((error) => {
      console.log("Failed", error)
      });
    
    if(response.error){
      alert(response.message);
      return
    }
    // showcomments();
}

export async function Ilike(truc) {
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
      showlikes();
}

export async function Idislike(truc) {
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
      showlikes();
}

//recuperer les info d'un commentaire avec son id
export async function thecomment(truc) {

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
}

  //liste de tous les utilisateurs 
export async function showusers() {
  UsersStore2.$reset();

  let response =
    await fetch(`${localhost}/users`, {
      method: "GET",
      headers: {
        "Authorization": MyTokenStore.token,
        "Content-Type": "application/json"
      },
      //body: JSON.stringify()
    })
        .then((response) => response.json())
        .catch((e) => {
            console.warn("Failed", e)
        });
  // console.log(response)
  UsersStore2.list = response
}

export async function deletecomment(truc) {
  
      const objet = {
        id_comment: parseInt(truc),
      };

    if(confirm('Êtes vous sur de vouloir supprimer ce commentaire ?')){
    let response = await fetch(`${localhost}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": MyTokenStore.token,
        },
        body: JSON.stringify(objet)
      })
      
      .then((response) => response.json())
      .catch((error) => {
        console.log("Failed", error)
      });
      
      if(response.error){
          alert(response.message);
          return
      }
      showcomments();
    }
}