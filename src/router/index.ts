import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "book",
      component: () => import("../views/BookView.vue"),
    },
    {
      path: "/connection",
      name: "connection",
      component: () => import("../views/ConnectionView.vue"),
    },

    {
      path: "/inscription",
      name: "inscription",
      component: () => import("../views/InscriptionView.vue"),
    },
    
    {
      path: "/profil/echec",
      name: "echec",
      component: () => import("../views/EchecView.vue"),
    },

    {
      path: "/profil/echec_admin",
      name: "echec_admin",
      component: () => import("../views/Echec_admin_View.vue"),
    },

    {
      path: "/comment/edit/commentform/:id",
      name: "comment_edit",
      component: () => import("../views/EditcommentView.vue"),
    },
    
    {
      path: "/all_users",
      name: "users",
      component: () => import("../views/UsersView.vue"),
    },
    
        {
          path: "/myprofil",
          name: "profil",
          component: () => import("../views/ProfilView.vue"),
        },

        {
          path: "/modifymyprofil",
          name: "modify_profilprofil",
          component: () => import("../views/ModifyprofilView.vue"),
        },

    {
      path: "/user/:id",
      name: "user_edit",
      component: () => import("../views/EdituserView.vue"),
    },

    {
      path: "/write",
      name: "write",
      component: () => import("../views/WriteView.vue"),
    },

    {
      path: "/profile_user/:id",
      name: "user_profile",
      component: () => import("../views/UserprofileView.vue"),
    },

  ],
});

export default router;
