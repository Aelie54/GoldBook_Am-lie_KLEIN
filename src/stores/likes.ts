import { defineStore } from "pinia";

export const useListLikes = defineStore({
  id : "likes",
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
