import { get } from 'axios'
import { USER_SYMBOL_REMOVE_SUCCESS, USER_SYMBOLS_WIPE_SUCCESS, defaultSymbols } from './user';

const CRYPTO_FETCH = 'CRYPTO_FETCH'
const CRYPTO_FETCH_SUCCESS = 'CRYPTO_FETCH_SUCCESS'
const CRYPTO_FETCH_FAIL = 'CRYPTO_FETCH_FAIL'

// const CRYPTO_FETCH_TOP = 'CRYPTO_FETCH_TOP'
// const CRYPTO_FETCH_TOP_SUCCESS = 'CRYPTO_FETCH_TOP_SUCCESS'
// const CRYPTO_FETCH_TOP_FAIL = 'CRYPTO_FETCH_TOP_FAIL'

const CRYPTO_FETCH_NEWS = 'CRYPTO_FETCH_NEWS'
const CRYPTO_FETCH_NEWS_SUCCESS = 'CRYPTO_FETCH_NEWS_SUCCESS'
const CRYPTO_FETCH_NEWS_FAIL = 'CRYPTO_FETCH_NEWS_FAIL'

const CRYPTO_ERROR_DISMISS = 'CRYPTO_ERROR_DISMISS'

const initialState = {
  loading: true,
  cryptos: {},
  cryptoDetails: {},
  topSymbols: ['DOGE', 'XRP', 'BCH', 'LTC', 'ADA', 'XLM', 'MIOTA', 'NEO', 'TRX', 'XMR', 'USDT', 'VEN', 'ETC'],
  news: [],
  err: null,
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case CRYPTO_FETCH: return { ...state }
    case CRYPTO_FETCH_SUCCESS: return { ...state, cryptos: action.cryptos, cryptoDetails: action.cryptoDetails, loading: false }
    case CRYPTO_FETCH_NEWS_SUCCESS:
      return { ...state, news: action.news }

    case USER_SYMBOL_REMOVE_SUCCESS:
      const cryptos = { ...state.cryptos }
      delete cryptos[action.symbol]
      return { ...state, cryptos }

    case USER_SYMBOLS_WIPE_SUCCESS:
      const defaultCryptos = {}
      action.symbols.forEach(symbol => { defaultCryptos[symbol] = state.cryptos[symbol] })
      return { ...state, cryptos: defaultCryptos }

    case CRYPTO_FETCH_FAIL:
    case CRYPTO_FETCH_NEWS_FAIL:
      return { ...state, err: action.err }

    case CRYPTO_ERROR_DISMISS:
      return { ...state, err: null }

    default:
      return { ...state }
  }
}

export function fetchCryptoPriceList(symbols = []) {
  return async dispatch => {
    dispatch({ type: CRYPTO_FETCH, loading: true })
    try {
      const coinSymbols = defaultSymbols.concat(symbols)
      const { data: cryptos } = await get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinSymbols.join(',')}&tsyms=USD`)
      const { data: { Data } } = await get(`https://min-api.cryptocompare.com/data/coin/generalinfo?fsyms=${coinSymbols.join(',')}&tsym=USD`)
      const cryptoDetails = Data.reduce((a, coin, i) => {
        a[coin.CoinInfo.Name] = coin
        return a
      }, {})
      dispatch({ type: CRYPTO_FETCH_SUCCESS, loading: false, cryptos, cryptoDetails })
    } catch (err) {
      dispatch({ type: CRYPTO_FETCH_FAIL, loading: false, cryptos: {}, err })
    }
  }
}

export function fetchCryptoNews() {
  return async dispatch => {
    dispatch({ type: CRYPTO_FETCH_NEWS })
    try {
      const { data } = await get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
       // TODO Seems the API offers no way to limit the number of articles
      dispatch({ type: CRYPTO_FETCH_NEWS_SUCCESS, news: data.Data.slice(0, 10) })
    } catch (err) {
      dispatch({ type: CRYPTO_FETCH_NEWS_FAIL, news: [], err })
    }
  }
}

export function dismissError() {
  return dispatch => ({ type: CRYPTO_ERROR_DISMISS })
}

export function fetchTopCryptoSymbols() {
  // TODO Get useful popular cryptos for autocomplete, currently a static list
}
