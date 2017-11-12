import React, {PureComponent} from 'react'
import {autobind} from 'core-decorators'
import {Row, Col} from 'react-flexbox-grid'
import {renderCapitalGain, renderPrice} from '../../common/TransactionHelpers' 
import {getAssetMetrics} from '../../../../../common/metrics'
import TitledBox from '../../box/TitledBox'

class TransactionSummary extends PureComponent {
  render() {
    const {asset, currency, total} = this.props;
    const {holdings, assetValue, exposure, capitalGain, percChange} = getAssetMetrics(total, asset);

    return (
      <div>
        <Row around='xs'>
          <Col xs={5} className='row-spacing'> 
            <TitledBox color='secondary' header='Holdings'>{holdings}</TitledBox>
          </Col>
          <Col xs={5} className='row-spacing'>
            <TitledBox color='secondary' header='Exposure'>{renderPrice(exposure, currency)}</TitledBox>
          </Col>
        </Row>
        <Row around='xs'>
          {/* <Col xs={5} className='row-spacing'>
            <TitledBox color='secondary' header='Safe Sell Price'>{renderPrice(exposure / holdings, currency)}</TitledBox>
          </Col> */}
        </Row>
        <Row around='xs'>
        <Col xs={5} className='row-spacing'>
            <TitledBox color='secondary' header='Current Value'>{renderPrice(assetValue, currency)}</TitledBox>
          </Col>
          <Col xs={5} className='row-spacing'>
            <TitledBox color='secondary' header='Capital Gain'>{renderCapitalGain([capitalGain,percChange], currency)}</TitledBox>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TransactionSummary

