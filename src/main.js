import DomPortal from 'vue-dom-portal';
import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import VueFlashMessage from 'vue-flash-message';
import VueHighCharts from 'vue-highcharts';
import _ from 'lodash';
import accounting from 'accounting';
import axios from 'axios';
import moment from 'moment';

// Services, etc.
import { contacts, network, settings, wallets } from './services';

// Initial Vue Libraries.
import './libraries';
import './error-handler';
import * as mixins from './mixins';
import App from './App';
import router from './router';
import { store } from './store';

// Global Vue Components.
import CopyText from './components/CopyText';
import DatePicker from './components/DatePicker';
import Holding from './components/Holding';
import Icon from './components/Icon';
import Input from './components/Input';
import PortfolioHeader from './components/PortfolioHeader';
import Select from './components/Select';
import SimpleTransactions from './components/SimpleTransactions';
// import TimestampFromNow from './components/TimestampFromNow';
import TokenIcon from './components/TokenIcon';
import TransactionDetail from './components/TransactionDetail';

// Global Libraries.
window._ = _;
window.accounting = accounting;
window.axios = axios;
window.moment = moment;

// Setup Vue.
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

// Vue Plugins.
Vue.use(DomPortal);
Vue.use(VueFlashMessage);
Vue.use(VueHighCharts);
Vue.use(Vue2TouchEvents);
require('vue-flash-message/dist/vue-flash-message.min.css');

// Register global mixins.
_.each(mixins, (mixin) => {
  Vue.mixin(mixin);
});

// Register global components.
Vue.component('aph-copy-text', CopyText);
Vue.component('aph-date-picker', DatePicker);
Vue.component('aph-holding', Holding);
Vue.component('aph-icon', Icon);
Vue.component('aph-input', Input);
Vue.component('aph-portfolio-header', PortfolioHeader);
Vue.component('aph-select', Select);
Vue.component('aph-simple-transactions', SimpleTransactions);
// Vue.component('aph-timestamp-from-now', TimestampFromNow);
Vue.component('aph-token-icon', TokenIcon);
Vue.component('aph-transaction-detail', TransactionDetail);

// Sync local storage to store.
contacts.sync();
network.init();
settings.sync();
wallets.sync();

/* eslint-disable no-new */
new Vue({
  components: { App },
  el: '#app',
  name: 'App',
  router,
  store,
  template: '<App/>',
});
