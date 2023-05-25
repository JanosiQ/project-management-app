import { createRouter, createWebHistory} from 'vue-router'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Profile from '../views/Profile.vue'
import Workspace from '../views/Workspace.vue'
import NotFound from '../views/NotFound.vue'
import Board from '../views/Board.vue'

const routes = [
  {
    path: "/board/:boardId",
    name: "Board",
    component: Board,
    meta: { requiresAuth: true }, // Dodanie metadanych requiresAuth dla chronionej trasy,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false } // Ustawienie wymagania autoryzacji na false
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }, // Dodanie metadanych requiresAuth dla chronionej trasy
  },
  {
    path: '/',
    name: 'Workspace',
    component: Workspace,
    meta: { requiresAuth: true }, // Dodanie metadanych requiresAuth dla chronionej trasy
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  //catchall 404
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Sprawdzenie, czy token istnieje w localStorage

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Jeśli trasa wymaga uwierzytelnienia
    if (isAuthenticated) {
      // Użytkownik jest zalogowany, kontynuuj nawigację
      next();
    } else {
      // Użytkownik nie jest zalogowany, przekieruj na stronę logowania
      next('/login');
    }
  } else {
    // Trasa nie wymaga uwierzytelnienia, kontynuuj nawigację
    next();
  }
});

export default router;