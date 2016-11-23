import React, { PropTypes, Component } from 'react'
import { ListView } from 'react-native'

/**
 * This component keeps a persistent ListView.DataSource.
 * The data source is updated without causing a re-render.
 */
class MutableListView extends Component {
  constructor(props) {
    super(props)
    const { data, rowsAndSections, rowHasChanged, sectionHeaderHasChanged } = props
    const dataSource = new ListView.DataSource({
      sectionHeaderHasChanged,
      rowHasChanged,
    })
    this.state = {}
    this.state.dataSource = rowsAndSections ?
      dataSource.cloneWithRowsAndSections(data) :
      dataSource.cloneWithRows(data)
  }

  componentWillReceiveProps({ data, rowsAndSections }) {
    if (this.props.data !== data) {
      this.state.dataSource = rowsAndSections ?
        this.state.dataSource.cloneWithRowsAndSections(data) :
        this.state.dataSource.cloneWithRows(data)
    }
  }

  render() {
    const props = {
      ...this.props,
      data: undefined,
    }
    const { listComponent } = this.props
    const ListComponent = listComponent || ListView
    return (
      <ListComponent
        ref={e => (this.list = e)}
        dataSource={this.state.dataSource}
        {...props}
      />
    )
  }
}

MutableListView.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  listComponent: PropTypes.func,
  rowsAndSections: PropTypes.bool,
  sectionHeaderHasChanged: PropTypes.func,
  rowHasChanged: PropTypes.func,
}

MutableListView.defaultProps = {
  listComponent: ListView,
  sectionHeaderHasChanged: (a, b) => a !== b,
  rowHasChanged: (a, b) => a !== b,
}

export default MutableListView

