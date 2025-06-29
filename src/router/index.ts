import { createRouter, createWebHashHistory } from 'vue-router'

import Experience from '../components/Experience.vue'
import Projects from '../components/Projects.vue'
import Blog from '../components/Blog.vue'
import Skills from '../components/Skills.vue'
import Contact from '../components/Contact.vue'
import About from '../components/About.vue'
import Certifications from '../components/Certifications.vue'

const routes = [
  { path: '/', redirect: '/about' },
  { path: '/about', component: About },
  { path: '/experience', component: Experience },
  { path: '/projects', component: Projects },
  { path: '/blogs', component: Blog },
  { path: '/skills', component: Skills },
  { path: '/certifications', component: Certifications },
  { path: '/contact', component: Contact }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router