import { defineStore } from "pinia";

export const useListMyComments = defineStore({
  id : "mycomments",
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
