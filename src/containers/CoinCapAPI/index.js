import React from 'react';
import PropTypes from 'prop-types';
// import io from 'socket.io-client';
import 'whatwg-fetch'; // makes 'fetch' work in all browsers https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
import CoincapTable from '../../components/CoincapTable';

const apiURL = 'http://socket.coincap.io';
// const socket = io(apiURL);

export default class CoinCapAPI extends React.PureComponent {

  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
  }

  constructor() {
    super();
    this.state = { data: [], loaded: false };

    fetch(`${apiURL}/front`)
    .then(response => response.json())
    .then(data => this.setState({
      data: data.sort((a, b) => a.position24 - b.position24).slice(0, 300),
      loaded: true,
    }));

    // socket.on('trades', (tradesData) => {
    //  console.log(data);
    //   // occur very often and very fast
    //   // tradesData contains info on a trade. You should update the table with this info.
    // });
    // socket.on('global', (data) => {
    //   console.log(data);
      // occur more slowly
      // data contains the global message data. Not entirely sure what it's used for.
    // });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const search = nextProps.location.search.split('?search=')[1];
      this.setState(prevState => (
        {
          data: prevState.data.filter(coin =>
            new RegExp(`^${search}`, 'i').test(coin.long),
          ),
        }
      ));
    }
  }

  render() {
    return (
      <div>
        { this.state.loaded &&
          <CoincapTable data={this.state.data} />
        }
      </div>
    );
  }
}
