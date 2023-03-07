import { defineStore } from "pinia";

export const usersStore = defineStore({
  id : "users",
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
