import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import {getItem} from '../../services/storage'
import Login from '../auth/Login'
import OverView from '../dashboard/Overview'
import Layout from '../core/Layout'
import TransactionPage from '../transaction/TransactionPage'
import BrokerPage from '../broker/BrokerPage'
import AssetPage from '../asset/AssetPage'
import {setUserProfile} from '../../data/profile/profileActions'
import config from '../../services/config'
 
class AuthGuard extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {isAuthenticated: null};
  }

  componentDidMount() {
    getItem(config.ACCESS_TOKEN_KEY)
      .bimap(
        error => {
          this.setState({isAuthenticated: false})
        },
        (item) => {
          setTimeout(() => this.setState({isAuthenticated: Boolean(item)}))
        }
      )
      .run();
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

class RouterComponent extends Component {
  // There is no need to update this component once it's been mounted
  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {
    getItem(config.USER_INFO)
      .bimap(
        error => {
          this.setState({isAuthenticated: false})
        },
        (userInfo) => {
          this.props.setUserProfile(JSON.parse(userInfo));
        }
      )
      .run();
  }

  render() {
    return (
      <Router>
        <div style={{height: '100%'}}>
          <PrivateRoute exact path="/" component={OverView}/>
          <PrivateRoute exact path="/transactions" component={TransactionPage}/> 
          <PrivateRoute exact path="/brokers" component={BrokerPage}/>
          <PrivateRoute exact path="/assets" component={AssetPage}/>
          <Route path="/login" component={Login}/>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = state => ({
  userProfile: state.userProfile
})

const mapDispatchToProps = dispatch => ({
  setUserProfile: (dispatch) ['∘'] (setUserProfile)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouterComponent)
