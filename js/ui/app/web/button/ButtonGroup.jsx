import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import RaisedButton from 'material-ui/RaisedButton'
import {partial} from '../../../../common/core/fn.js'
import './button.scss'

const getButtonType = (type, selected) => type === selected
  ? {secondary: true}
  : {primary: true};

const ButtonGroup = ({buttons, selected, onBtnClick}) => (
  <Row className='row-spacing'>
    {
      buttons.map((b, i) => (
          <Col key={b.type} className='button-group__btn'>
            <RaisedButton
              label={b.label}
              onClick={partial(onBtnClick, b.type)}
              {...getButtonType(b.type, selected)} />
          </Col>
        )
      )
    }
  </Row>
);

export default ButtonGroup
