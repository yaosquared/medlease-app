import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import Auth from '@/views/Auth.vue'
import Contracts from '@/views/Contracts.vue'
import Dashboard from '@/views/Dashboard.vue'
import Equipments from '@/views/Equipments.vue'
import Organizations from '@/views/Organizations.vue'
import Payments from '@/views/Payments.vue'
import Profile from '@/views/Profile.vue'
import Users from '@/views/Users.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    layout?: string
    title?: string
    roles?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Auth, meta: { guestOnly: true, layout: 'auth' } },
    { path: '/register', component: Auth, meta: { guestOnly: true, layout: 'auth' } },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { title: 'Dashboard', requiresAuth: true, layout: 'app' },
    },
    {
      path: '/organizations',
      component: Organizations,
      meta: {
        title: 'Organizations',
        requiresAuth: true,
        layout: 'app',
        roles: ['SuperAdmin', 'OrgAdmin'],
      },
    },
    {
      path: '/users',
      component: Users,
      meta: {
        title: 'Users',
        requiresAuth: true,
        layout: 'app',
        roles: ['SuperAdmin', 'OrgAdmin'],
      },
    },
    {
      path: '/profile',
      component: Profile,
      meta: { title: 'Profile', requiresAuth: true, layout: 'app' },
    },
    {
      path: '/equipments',
      component: Equipments,
      meta: {
        title: 'Equipments',
        requiresAuth: true,
        layout: 'app',
        roles: ['OrgAdmin', 'Staff'],
      },
    },
    {
      path: '/contracts',
      component: Contracts,
      meta: {
        title: 'Contracts',
        requiresAuth: true,
        layout: 'app',
        roles: ['OrgAdmin', 'Staff'],
      },
    },
    {
      path: '/payments',
      component: Payments,
      meta: {
        title: 'Payments',
        requiresAuth: true,
        layout: 'app',
        roles: ['OrgAdmin', 'Staff'],
      },
    },
  ],
})

router.beforeEach((to) => {
  const { isAuthenticated, user } = useAuthStore()

  if (to.meta.requiresAuth && !isAuthenticated) return '/login'
  if (to.meta.guestOnly && isAuthenticated) return '/dashboard'

  const requiredRoles = to.meta.roles
  if (requiredRoles && user?.role && !requiredRoles.includes(user.role)) {
    return '/dashboard'
  }
})

export default router
