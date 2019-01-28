import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import DiscPlayerPage from './containers/DiscPlayerPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.DISCPLAYER} component={DiscPlayerPage} />
    </Switch>
  </App>
);
