import Vue from 'vue';
import Router from 'vue-router';

import { wallets } from '../services';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/intro',
      component: require('../components/Intro').default,
      name: 'intro',
    },
    {
      path: '/login',
      component: require('../components/Login').default,
      children: [
        {
          path: 'landing',
          component: require('../components/login/Landing').default,
        },
        {
          path: 'create-wallet',
          component: require('../components/login/CreateWallet').default,
        },
        {
          path: 'saved',
          component: require('../components/login/Saved').default,
        },
        {
          path: 'import',
          component: require('../components/login/Import').default,
        },
        {
          path: 'wallets',
          component: require('../components/login/Wallets').default,
        },
      ],
      redirect: '/login/landing',
    },
    {
      path: '/authenticated',
      component: require('../components/AuthenticatedWrapper').default,
      beforeEnter: (to, from, next) => { // eslint-disable-line
        if (wallets.getCurrentWallet()) {
          return next();
        }

        return next('/landing');
      },
      redirect: '/authenticated/dashboard',
      children: [
        {
          path: 'dashboard',
          component: require('../components/Dashboard').default,
          children: [
            {
              path: 'holdings',
              component: require('../components/dashboard/Holdings').default,
            },
            {
              path: 'token-stats/:symbol',
              component: require('../components/dashboard/TokenStats').default,
              props: true,
              name: 'dashboard.token-stats',
            },
            {
              path: 'recent-transactions',
              component: require('../components/dashboard/RecentTransactions').default,
            },
          ],
          redirect: '/authenticated/dashboard/holdings',
        },
        {
          path: 'commit',
          component: require('../components/Commit').default,
          children: [
          ],
        },
        {
          path: 'assets',
          component: require('../components/Assets').default,
          children: [
          ],
        },
        {
          path: 'history',
          component: require('../components/History').default,
          children: [
          ],
        },
        {
          path: 'settings',
          component: require('../components/Settings').default,
        },
        {
          path: 'settings/about',
          component: require('../components/settings/About').default,
          name: 'settings.about',
        },
        {
          path: 'settings/contacts',
          component: require('../components/settings/Contacts').default,
          name: 'settings.contacts',
        },
        {
          path: 'settings/languages',
          component: require('../components/settings/Languages').default,
          name: 'settings.languages',
        },
        {
          path: 'settings/currencies',
          component: require('../components/settings/Currencies').default,
          name: 'settings.currencies',
        },
        {
          path: 'settings/networks',
          component: require('../components/settings/Networks').default,
          name: 'settings.networks',
        },
        {
          path: 'settings/wallets',
          component: require('../components/settings/Wallets').default,
          name: 'settings.wallets',
        },
      ],
    },
    {
      path: '*',
      redirect: '/intro',
    },
  ],
});
