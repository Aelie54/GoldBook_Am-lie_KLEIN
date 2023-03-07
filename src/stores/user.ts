import { defineStore } from "pinia";

export const UserStore = defineStore({
  id : "user",

  state: () => ({
    id: "",
    pseudo: "",
    email: "",
    info_email: "",
    nom:"",
    prenom:"",
    avatar:""
  }),

  persist: true,  

});