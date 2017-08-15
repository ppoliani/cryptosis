import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Row, Col} from 'react-flexbox-grid'
import NewsFeed from '../../news/NewsFeed'

class ExtraInfoTabView extends Component {
  render() {
    return (
      <Col xs={12}>
        <Tabs>
          <Tab label='News'>
            <NewsFeed />
          </Tab>
          <Tab label='Price Analysis'>

          </Tab>
        </Tabs>
      </Col>
    )
  }
}


export default ExtraInfoTabView
