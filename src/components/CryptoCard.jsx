import React from 'react'
import PropTypes from 'prop-types'

class CryptoCard extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      expanded: false,
    }
  }

  handleShowMore = () => {
    this.setState({ expanded: true })
  }

  // handleMouseOver = () => {
  //   this.setState({ expanded: true })
  // }

  // handleMouseOut = () => {
  //   this.setState({ expanded: false })
  // }

  render () {
    const { symbol, details } = this.props

    return (
      <article
        className={`card crypto-card${ this.state.expanded ? ' expanded' : '' }`}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        <button className="delete" onClick={() => this.props.onDelete(this.props.symbol)}></button>
        <h3 className="is-size-4 has-text-weight-bold">{ symbol }</h3>
        ${ details.USD }
        <br />
        {
          this.state.expanded
            ? <div>{ this.props.children }</div>
            : <span><br /><br /><button onClick={this.handleShowMore}>More Info</button></span>
        }
      </article>
    )
  }
}

CryptoCard.propTypes = {
  symbol: PropTypes.string.isRequired,
  details: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default CryptoCard
