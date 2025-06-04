import {Router} from '@vaadin/router';
import {store} from './store/store.js';

let router;

export function initializeRouter() {
  router = new Router(document.querySelector('employee-app'));

  router.setRoutes([
    {
      path: '/',
      redirect: '/employees',
    },
    {
      path: '/employees',
      component: 'employee-list',
      action: () => {
        updateRouteInStore('/employees', {});
      },
    },
    {
      path: '/employees/new',
      component: 'employee-form',
      action: () => {
        updateRouteInStore('/employees/new', {});
      },
    },
    {
      path: '/employees/:id/edit',
      component: 'employee-form',
      action: (context) => {
        updateRouteInStore(context.pathname, {id: context.params.id});
      },
    },
    {
      path: '(.*)',
      component: 'not-found-view',
    },
  ]);

  return router;
}

function updateRouteInStore(pathname, params) {
  store.dispatch({
    type: 'SET_ROUTE',
    payload: {
      pathname: pathname,
      params: params,
    },
  });
}

export function navigate(path) {
  Router.go(path);
}
