import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import {getItem} from '../../storage';
import Login from '../auth/Login';
import OverView from '../dashboard/Overview';
import Layout from '../core/Layout';
import InvestmentPage from '../investment/InvestmentPage';
import InvestmentOverviewPage from '../investment/InvestmentOverviewPage';
import BrokerPage from '../investment/BrokerPage';
import InvestmentTypePage from '../investment/InvestmentTypePage';

class AuthGuard extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {isAuthenticated: null};
  }

  componentDidMount() {
    const accessToken = getItem(process.env.ACCESS_TOKEN_KEY);
    this.setState({isAuthenticated: Boolean(accessToken)});
  }

  render() {
    const Component = this.props.component;

    if(this.state.isAuthenticated === null) {
      // TODO: this is the place were we can add a spinner
      // or something more sophisticated
      return null;
    }

    return this.state.isAuthenticated
      ? <Component />
      : <Redirect to={{
          pathname: '/login',
          state: {
            from: this.props.location
          }
        }}/>
  }
}

const PrivateRoute = ({component: Component, ...rest}) =>
  <Route {...rest} render={props => <AuthGuard {...props} component={Layout(Component, props)} /> }/>

export default () =>
  <Router>
    <div style={{height: '100%'}}>
      <PrivateRoute exact path="/" component={OverView}/>
      <PrivateRoute exact path="/investments/:id" component={InvestmentOverviewPage}/>
      <PrivateRoute exact path="/investments" component={InvestmentPage}/>
      <PrivateRoute exact path="/brokers" component={BrokerPage}/>
      <PrivateRoute exact path="/investment-types" component={InvestmentTypePage}/>
      <Route path="/login" component={Login}/>
    </div>
  </Router>;
