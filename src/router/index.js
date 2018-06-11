import Vue from 'vue';
import Router from 'vue-router';

// import { wallets } from '../services';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/intro',
      component: require('../components/Intro').default,
    },
    {
      path: '/landing',
      component: require('../components/Landing').default,
    },
    {
      path: '/create-wallet',
      component: require('../components/CreateWallet').default,
    },
    {
      path: '/login/import',
      component: require('../components/login/Import').default,
    },
    {
      path: '/login/import/private-key',
      component: require('../components/login/ImportPrivateKey').default,
    },
    {
      path: '/authenticated',
      component: require('../components/AuthenticatedWrapper').default,
      // beforeEnter: (to, from, next) => { // eslint-disable-line
      //   if (wallets.getCurrentWallet()) {
      //     return next();
      //   }

      //   return next('/landing');
      // },
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
      ],
    },
    {
      path: '*',
      redirect: '/intro',
    },
  ],
});
