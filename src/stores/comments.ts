import { defineStore } from "pinia";

export const useListComments = defineStore({
  id : "comments",
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
