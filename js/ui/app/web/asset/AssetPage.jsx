import React, {PureComponent} from 'react'
import {List} from 'immutable'
import {connect} from 'react-redux'
import {Row, Col} from 'react-flexbox-grid'
import Button from 'material-ui/FlatButton'
import PageWithPanel from '../panel/PageWithPanel'
import AsyncPanel from '../panel/AsyncPanel'
import {partial, pipe} from '../../../../common/core/fn'
import {filterObject} from '../../services/utils'
import createAssetForm from './AssetForm'
import DialogBoxMixin from '../mixins/DialogBoxMixin'
import Table from '../table/Table'
import Container from '../common/Container'
import {
  getAssets,
  createNewAsset,
  updateAsset,
  deleteAsset
} from '../../data/asset/assetActions'

const columns = [
  {key: 'name', label: 'Name'},
  {key: 'notes', label: 'Notes'},
  {key: 'action', label: 'Action'}
];

@DialogBoxMixin
class AssetPage extends PureComponent {
  state = {
    isPanelOpen: false,
    limit: 10,
    skip: 0
  }

  componentDidMount() {
    const {skip, limit} = this.state;
    this.props.getAssets({skip, limit});
  }

  togglePanel = (_, selectedAsset={}) => {
    this.setState({isPanelOpen: !this.state.isPanelOpen, selectedAsset});
  }

  onAssetSave = asset => {
    const {createNewAsset, updateAsset} = this.props;

    if(asset.id) {
      // exclude the action prop shich was added above
     pipe(
      updateAsset,
       filterObject(asset, ['action'])
      );
    }
    else {
      createNewAsset(asset);
    }

    this.togglePanel();
  }

  getPanelContent() {
    const AssetForm = createAssetForm(this.state.selectedAsset);

    return (
      <AsyncPanel asyncResult={this.props.saveAssetResult}>
        <Col xs={12}>
          <h1>New Asset</h1>
          <AssetForm onSubmit={this.onAssetSave}/>
        </Col>
      </AsyncPanel>
    )
  }

  onAssetDelete = asset => {
    this.props.deleteAsset(asset);
  }

  onAssetDeleteClick = (asset, e) => {
    e.stopPropagation();
    this.openDialog(partial(this.onAssetDelete, asset))
  }

  handleCellClick = (e, _, asset) => {
    this.togglePanel(e, asset);
  }

  getAssetData() {
    return this.props.assets.reduce(
      (acc, v, id) => acc.push(
        v.set('id', id)
          .set('action', <Button label="Delete" primary={true} onClick={partial(this.onAssetDeleteClick, v)} />)
          .toJS()
      ),
      List()
    )
    .toArray()
  }

  renderAssetTable() {
    return (
      <Container title='Crypto Assets' subtitle='Full list of crypto assets'>
        <AsyncPanel asyncResult={this.props.fetchAssetsResult}>
          <Table
            columns={columns}
            data={this.getAssetData()}
            handleCellClick={this.handleCellClick}
          />
        </AsyncPanel>
      </Container>
    )
  }

  render() {
    const {isPanelOpen} = this.state;

    return (
      <PageWithPanel
        PanelContent={isPanelOpen && this.getPanelContent()}
        togglePanel={this.togglePanel}
        isPanelOpen={isPanelOpen}>
          <Row>
            <Col xs>
              <Button type="submit" className="right" onClick={this.togglePanel}>New</Button>
            </Col>
          </Row>
          <Row>
            <Col xs>
              {this.renderAssetTable()}
            </Col>
          </Row>
          {this.renderDialogBox('Are you sure you want to delete this crypto asset?')}
      </PageWithPanel>
    );
  }
}

const mapStateToProps = ({asset}) => ({
  assets: asset.get('assets'),
  saveAssetResult: asset.get('saveAssetResult'),
  fetchAssetsResult: asset.get('fetchAssetsResult'),
});

const mapDispatchToProps = dispatch => ({
  getAssets: (dispatch) ['∘'] (getAssets), 
  createNewAsset: (dispatch) ['∘'] (createNewAsset),
  updateAsset: (dispatch) ['∘'] (updateAsset),
  deleteAsset: (dispatch) ['∘'] (deleteAsset)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetPage)
