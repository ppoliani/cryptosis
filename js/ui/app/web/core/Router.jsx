import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import Login from '../auth/Login';
import OverView from '../dashboard/OverView';
import {getItem} from '../../storage';

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
  <Route {...rest} render={props => <AuthGuard {...props} component={Component} /> }/>

export default () =>
  <Router>
    <div>
      <PrivateRoute exact path="/" component={OverView}/>
      <Route path="/login" component={Login}/>
    </div>
  </Router>;
