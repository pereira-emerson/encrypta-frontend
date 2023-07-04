import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "Emerson",
    lastName: "Pereira",
  }),
  actions: {
    updateName(name) {
      this.name = name;
    },
  },
});
