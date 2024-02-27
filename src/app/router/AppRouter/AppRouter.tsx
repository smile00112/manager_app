import React, { Suspense } from 'react';
import { publicRoutes, privateRoutes } from '../routes';
import { Switch, Route, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { getIsLoggedIn } from '../../store/users';
import Page404 from '../../components/pages/404Page';

const AppRouter: React.FC = () => {
  const isLoggedIn = useSelector(getIsLoggedIn());
  return (
    <>
      <Suspense fallback={<>ERROR</>}>
        <Switch>
          {isLoggedIn &&
            privateRoutes.map(route =>
              route.path ? (
                <Route path={route.path} component={route.component} exact={route.exact} key={route.path} />
              ) : null
            )
          }
          {publicRoutes.map(route =>
              route.path ? (
                <Route path={route.path} component={route.component} exact={route.exact} key={route.path} />
              ) : null
          )}
            {/*<Route path={'/login/signIn'} component={publicRoutes[0].component} exact={publicRoutes[0].exact} key={'login/signIn'} />*/}
          <Redirect to={isLoggedIn ? process.env.PUBLIC_URL : 'login/signIn'} />
          <Route path='*' component={Page404} />
        </Switch>
      </Suspense>
    </>
  );
};

export default AppRouter;
