import React from 'react'
import {View} from 'native-base'
import {Col, Row, Grid} from 'react-native-easy-grid';
import PortfolioSummary from './dashboard/PortfolioSummary'


export default () =>
  <View>
    <Grid>
      <Row>
        <Col>
          <PortfolioSummary />
        </Col>
      </Row>
    </Grid>
  </View>
