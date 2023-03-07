import { defineStore } from "pinia";

export const useListIfilike = defineStore({
  id : "ifilike",
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
