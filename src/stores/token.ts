import { defineStore } from "pinia";

export const TokenStore = defineStore({
  id: "token",
  state: () => ({
    email:"",
    pseudo : "",
    myid: "",
    nom:"",
    prenom:"",
    role: "",
    token:"",
    avatar:"",
    info_email:""
  }),

  persist: true,  

});


