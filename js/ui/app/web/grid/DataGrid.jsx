import React, {PureComponent} from 'react'
import ReactTable from 'react-table'
import {noop, True, False, debouncedCallback} from '../../../../common/core/fn'
import 'react-table/react-table.css'
import './dataGrid.scss'

class DataGrid extends PureComponent {
  state = {
    loading: true
  };

  isLoading() {
    return this.props.loading.matchWith({
      Empty: True,
      Loading: True,
      Success: False,
      Failure: True
    });
  }

  getTdProps = (state, rowInfo, column, instance) => {
    return {
      onClick: e => this.props.handleRowClick(rowInfo)
    };
  }

  render() { 
    const {data, columns, page, pageSize, pages, handlePageChange, handlePageSizeChange, handleSortedChange, handleFilteredChange} = this.props;

    return (
      <ReactTable 
        data={data}
        defaultFilterMethod={(filter, row) => row}
        columns={columns}
        defaultPageSize={10}
        className='data-grid -striped -highlight'
        page={page}
        pageSize={pageSize}
        pages={pages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortedChange={handleSortedChange}
        onFilteredChange={debouncedCallback(handleFilteredChange, 500)} 
        getTdProps={this.getTdProps}/>
    )
  }
}

export default DataGrid;
