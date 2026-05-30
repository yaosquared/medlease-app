import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import Auth from '@/views/Auth.vue'
import Contracts from '@/views/Contracts.vue'
import Dashboard from '@/views/Dashboard.vue'
import Equipments from '@/views/Equipments.vue'
import Organizations from '@/views/Organizations.vue'
import OrganizationDetail from '@/components/organizations/OrganizationDetail.vue'
import Payments from '@/views/Payments.vue'
import Profile from '@/views/Profile.vue'
import Users from '@/views/Users.vue'
import UserDetail from '@/components/users/UserDetail.vue'
import EquipmentDetails from '@/components/equipments/EquipmentDetails.vue'
import ContractDetails from '@/components/contracts/ContractDetails.vue'
import ContractHistory from '@/components/contracts/ContractHistory.vue'

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
      meta: {
        title: 'Organizations',
        requiresAuth: true,
        layout: 'app',
        roles: ['SuperAdmin', 'OrgAdmin'],
      },
      children: [
        {
          path: '',
          component: Organizations,
          meta: { roles: ['SuperAdmin'] },
        },
        {
          path: 'me',
          component: OrganizationDetail,
          meta: {
            title: 'Organization Details',
            requiresAuth: true,
            layout: 'app',
            roles: ['OrgAdmin'],
          },
        },
        {
          path: ':orgId',
          component: OrganizationDetail,
          meta: {
            title: 'Organization Details',
            requiresAuth: true,
            layout: 'app',
            roles: ['SuperAdmin'],
          },
        },
      ],
    },
    {
      path: '/users',
      meta: {
        title: 'Users',
        requiresAuth: true,
        layout: 'app',
        roles: ['SuperAdmin', 'OrgAdmin'],
      },
      children: [
        {
          path: '',
          component: Users,
        },
        {
          path: ':orgId',
          component: UserDetail,
          meta: {
            title: 'User Details',
            requiresAuth: true,
            layout: 'app',
            roles: ['SuperAdmin', 'OrgAdmin'],
          },
        },
      ],
    },
    {
      path: '/profile',
      component: Profile,
      meta: { title: 'Profile', requiresAuth: true, layout: 'app' },
    },
    {
      path: '/equipments',
      meta: {
        title: 'Equipments',
        requiresAuth: true,
        layout: 'app',
        roles: ['OrgAdmin', 'Staff'],
      },
      children: [
        {
          path: '',
          component: Equipments,
          meta: { roles: ['OrgAdmin', 'Staff'] },
        },

        {
          path: ':equipmentId',
          component: EquipmentDetails,
          meta: {
            title: 'Equipment Details',
            requiresAuth: true,
            layout: 'app',
            roles: ['OrgAdmin', 'Staff'],
          },
        },
      ],
    },
    {
      path: '/contracts',
      meta: {
        title: 'Contracts',
        requiresAuth: true,
        layout: 'app',
        roles: ['OrgAdmin', 'Staff'],
      },
      children: [
        {
          path: '',
          component: Contracts,
          meta: { roles: ['OrgAdmin', 'Staff'] },
        },
        {
          path: ':contractId',
          meta: {
            title: 'Contract Details',
            requiresAuth: true,
            layout: 'app',
            roles: ['OrgAdmin', 'Staff'],
          },
          children: [
            {
              path: '',
              component: ContractDetails,
              meta: { roles: ['OrgAdmin', 'Staff'] },
            },
            {
              path: 'history',
              component: ContractHistory,
              meta: {
                title: 'Contract History',
                requiresAuth: true,
                layout: 'app',
                roles: ['OrgAdmin', 'Staff'],
              },
            },
          ],
        },
      ],
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
