import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.config';
import HomeView from '../views/Index.vue'
import LoginView from '../views/Login.vue'
import RegisterView from '../views/Signup.vue'
import ProfileView from '../views/Profile.vue'
import IndustriesView from '../views/Industries.vue'
import CategoriesView from '../views/Categories.vue'
import FaqsView from '../views/Faqs.vue'
import JobsView from '../views/jobs/index.vue'
import JobView from '../views/jobs/_id.vue'
import JobApplication from '../views/jobs/application.vue'
import TalentsView from '../views/talents/index.vue'
import TalentView from '../views/talents/_id.vue'
import RecruitersView from '../views/recruiters/index.vue'
import RecruiterView from '../views/recruiters/_id.vue'
import TestView from '../views/test.vue'
import NotFoundView from '../views/404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/industries', name: 'industries', component: IndustriesView, meta: { requiresAuth: true } },
    { path: '/categories', name: 'categories', component: CategoriesView, meta: { requiresAuth: true } },
    { path: '/faqs', name: 'faqs', component: FaqsView, meta: { requiresAuth: true } },
    { path: '/jobs', name: 'jobs', component: JobsView, meta: { requiresAuth: true } },
    { path: '/jobs/:id', name: 'jobs_single', component: JobView, meta: { requiresAuth: true }, },
    { path: '/jobs/:id/application/:application', name: 'jobs_application', component: JobApplication, meta: { requiresAuth: true }, },
    { path: '/talents', name: 'talents', component: TalentsView, meta: { requiresAuth: true } },
    { path: '/talents/:id', name: 'talents_view', component: TalentView, meta: { requiresAuth: true } },
    { path: '/recruiters', name: 'recruiters', component: RecruitersView, meta: { requiresAuth: true } },
    { path: '/recruiters/:id', name: 'recruiters_single', component: RecruiterView, meta: { requiresAuth: true }, },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: RegisterView },
    { path: '/test', name: 'test', component: TestView },
    { path: '/404', name: 'Not Found', component: NotFoundView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
    { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFoundView },
  ],
  // scrollBehavior (to, from, savedPosition) {
  //   return { x: 0, y: 0 }
  // }
})

router.beforeEach((to, from, next) => {
  let loader = document.querySelector('#loader')
  // console.log(to)

  if (to.meta.requiresAuth) {
    onAuthStateChanged(auth, (user) => {
      if(user && user.uid !== '') {
        loader.classList.add('hidden')
        next()
      }
      else {
        next('/login');
      }
    })
  } else {
    loader.classList.add('hidden')
    next();
  }
});

export default router
