import { defineStore } from "pinia";

export const ModifyComment = defineStore({
  id : "comment",

  state: () => ({
    idComment: "",
    title: "",
    comment: "",
    authorId: "",
  }),

  persist: true,  

});