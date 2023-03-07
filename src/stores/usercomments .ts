import { defineStore } from "pinia";

export const useListUserComments = defineStore({
  id : "usercomments",
  state: () => ({
      list: [
      ],
  }),
   persist: true,
  getters: {
      getList: (state) => state.list,
    },
    actions: {
      increment() {
      },
    },
})
