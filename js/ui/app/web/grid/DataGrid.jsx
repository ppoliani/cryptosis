import React, {Component} from 'react'
import ReactTable from 'react-table'
import {noop, True, False} from '../../../../common/core/fn'
import 'react-table/react-table.css'

class DataGrid extends Component {
  state = {
    loading: true
  };

  isLoading() {
    return this.props.loading.matchWith({
      Empty: True,
      loading: True,
      Success: False,
      Failure: True
    });
  }

  render() { 
    const {data, columns, page, pageSize, pages, handlePageChange, handlePageSizeChange, handleSortedChange, handleFilteredChange} = this.props;

    return (
      <ReactTable 
        data={data}
        columns={columns}
        manual
        loading={this.isLoading()}
        defaultPageSize={10}
        className='-striped -highlight'
        page={page}
        pageSize={pageSize}
        pages={pages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortedChange={handleSortedChange}
        onFilteredChange={handleFilteredChange} />
    )
  }
}

export default DataGrid;
