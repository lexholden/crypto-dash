import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchTopCryptoSymbols } from '../models/cryptos';

class CryptoSearchInput extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      value: '',
      focus: false,
    }
  }

  handleChange = (value) => {
    this.setState({ value })
  }

  handleSubmit = (event, value = this.value) => {
    if (event) { event.preventDefault() }
    this.props.onSubmit(value)
    this.setState({ value: '' })
  }

  handleFocus = (event) => {
    this.setState({ focus: true })
  }

  handleBlur = (event) => {
    setTimeout(() => this.setState({ focus: false }), 200) 
  }

  filterTopCryptoList (str) {
    const { cryptos, topSymbols } = this.props
    return topSymbols.filter(sym => {
      return sym.includes(this.state.value.toUpperCase()) && cryptos[sym] === undefined
    })
  }

  render () {
    const currentFilterList = this.filterTopCryptoList(this.state.value)
    return (
      <form className="add-new-cryptos" onSubmit={this.handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Add a new Crypto"
          value={this.state.value}
          onChange={(ev) => this.handleChange(ev.target.value)}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        { this.state.focus &&
        <ul className="autocomplete box">
          {
            currentFilterList.map(symbol => (
              <li
                key={symbol}
                onClick={(ev) => this.handleSubmit(ev, symbol)}
              >{ symbol }</li>
            ))
          }
        </ul>
        }

      </form>
    )
  }
}

CryptoSearchInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}


export default connect(
  state => ({ ...state.cryptos }),
  dispatch => bindActionCreators({ fetchTopCryptoSymbols }, dispatch),
)(CryptoSearchInput)

