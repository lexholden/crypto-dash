import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchCryptoPriceList, fetchCryptoNews, dismissError } from './models/cryptos'
import {
	fetchUserPreferences,
	addSymbolToUserPreferences,
	removeSymbolFromUserPreferences,
	wipeAllSymbolsFromUserPreferences
} from './models/user'

import { CryptoSearchInput, CryptoCard } from './components'

import 'bulma/css/bulma.css'
import './App.css'

class App extends React.Component {
	tick = null

	async componentDidMount() {
		this.props.fetchUserPreferences()
			.then(d => {
				this.updateCryptoList()
			})
		this.props.fetchCryptoNews()
		// Refresh latest prices every 60 seconds
		this.tick = setInterval(this.updateCryptoList, 60000)
	}

	componentWillUnmount() {
		clearInterval(this.tick) // Remove the refresh watcher
	}

	/**
	 * Conjoined operation to optionally add a new symbol
	 * and optimistically update the price list without waiting
	 * for it to be added
	 */
	updateCryptoList = async (newSymbol = null) => {
		let symbols = this.props.user.symbols
		if (newSymbol) {
			symbols = symbols.concat(newSymbol)
			this.props.addSymbolToUserPreferences(newSymbol)
		}
		this.props.fetchCryptoPriceList(symbols)
	}

	render() {
		const { cryptos, err } = this.props

		// if (loading) { return <Loader /> }

		return (
			<div>
				<section className="hero is-info">
					<div className="hero-body is-size-2 has-text-centered">MyCryptoDash</div>
				</section>

				<nav className="navbar">
					<div className="navbar-end">
						<div className="navbar-item">
							<div className="field is-grouped">
								<button className="button is-danger" onClick={this.props.wipeAllSymbolsFromUserPreferences}>Delete All Currencies</button>
							</div>
						</div>
					</div>
				</nav>
				<section className="section">
					<div className="container">

						{
							err && <div class="notification is-danger">
								<button class="delete" onClick={this.props.dismissError}></button>
								{ err.message || 'Something went wrong' }
							</div>
						}

						{/* <h3 className="is-size-5 has-text-weight-bold">You will be building a Cryptocurrency tracker!</h3> */}
						<CryptoSearchInput
							onSubmit={this.updateCryptoList}
						/>

						<ul className="grid is-center is-multiline">
							{
								Object.keys(cryptos).map(symbol => {
									const { CoinInfo, ConversionInfo } = this.props.cryptoDetails[symbol]

									return (
										<li key={symbol}>
											<CryptoCard
												symbol={symbol}
												details={ cryptos[symbol] }
												onDelete={this.props.removeSymbolFromUserPreferences}>
													<ul className="coin-properties">
														<li><p className="is-small">Full Name: <span className="has-text-weight-bold">{ CoinInfo.FullName }</span></p></li>
														<li><p className="is-small">Algorithm: <span className="has-text-weight-bold">{ CoinInfo.Algorithm }</span></p></li>
														<li><p className="is-small">Block Number: <span className="has-text-weight-bold">{ CoinInfo.BlockNumber }</span></p></li>
														<li><p className="is-small">Supply: <span className="has-text-weight-bold">{ ConversionInfo.Supply }</span></p></li>
													</ul>
											</CryptoCard>
										</li>
									)
								})
							}
						</ul>
					</div>
				</section>
				<section className="section">
					<h2 className="is-size-4 has-text-weight-bold">Crypto in the News</h2>
					<br />
					<ul className="grid is-center is-multiline">
						{
							this.props.news.map(item => (
								<li key={item.id}>
									<article className="card">
										<a href={item.url}>
											<img alt={item.title} src={item.imageurl} />
											<div className="article-body">
												<h3 className="is-medium has-text-weight-bold">{item.title}</h3>
												<p className="is-small">{ item.body }</p>
											</div>
										</a>
									</article>
								</li>
							))
						}
					</ul>
				</section>
			</div>
		)
	}
}

export default connect(
	state => ({ ...state.cryptos, user: state.user }),
	dispatch => bindActionCreators({
		addSymbolToUserPreferences,
		dismissError,
		fetchCryptoNews,
		fetchCryptoPriceList,
		fetchUserPreferences,
		removeSymbolFromUserPreferences,
		wipeAllSymbolsFromUserPreferences,
	}, dispatch),
)(App)
