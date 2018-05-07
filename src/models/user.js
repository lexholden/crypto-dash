import ax, { get, post } from 'axios'
import config from '../config'

const USER_PREFERENCE_FETCH = 'USER_PREFERENCE_FETCH'
const USER_PREFERENCE_FETCH_SUCCESS = 'USER_PREFERENCE_FETCH_SUCCESS'
const USER_PREFERENCE_FETCH_FAIL = 'USER_PREFERENCE_FETCH_FAIL'

const USER_SYMBOL_ADD = 'USER_SYMBOL_ADD'
const USER_SYMBOL_ADD_SUCCESS = 'USER_SYMBOL_ADD_SUCCESS'
const USER_SYMBOL_ADD_FAIL = 'USER_SYMBOL_ADD_FAIL'

const USER_SYMBOL_REMOVE = 'USER_SYMBOL_REMOVE'
export const USER_SYMBOL_REMOVE_SUCCESS = 'USER_SYMBOL_REMOVE_SUCCESS'
const USER_SYMBOL_REMOVE_FAIL = 'USER_SYMBOL_REMOVE_FAIL'

const USER_SYMBOLS_WIPE = 'USER_SYMBOLS_WIPE'
export const USER_SYMBOLS_WIPE_SUCCESS = 'USER_SYMBOLS_WIPE_SUCCESS'
const USER_SYMBOLS_WIPE_FAIL = 'USER_SYMBOLS_WIPE_FAIL'

const initialState = {
  details: {},
  symbols: [],
  preferredCurrency: 'USD',
}

export const defaultSymbols = ['BTC', 'ETH']

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case USER_PREFERENCE_FETCH_SUCCESS:
    case USER_PREFERENCE_FETCH_FAIL:
      return { ...state, ...action.user, symbols: defaultSymbols.concat(action.user.symbols) }
    case USER_SYMBOL_ADD_SUCCESS:
      return { ...state, symbols: state.symbols.concat(action.symbol) }
    case USER_SYMBOL_REMOVE_SUCCESS:
      return { ...state, symbols: state.symbols.filter(s => s !== action.symbol) }
    case USER_SYMBOLS_WIPE_SUCCESS: return { ...state, symbols: defaultSymbols  }
    // case USER_PREFERENCE_FETCH_FAIL:
    case USER_SYMBOL_ADD_FAIL:
    case USER_SYMBOLS_WIPE_FAIL:
    case USER_SYMBOL_REMOVE_FAIL:
      return { ...state, err: state.err }
    default:
      return { ...state }
  }
}

export function fetchUserPreferences() {
  return async dispatch => {
    dispatch({ type: USER_PREFERENCE_FETCH, loading: true })
    try {
      const { data } = await get(`${config.apiBase}/preferences`)
      dispatch({ type: USER_PREFERENCE_FETCH_SUCCESS, loading: false, user: data })
    } catch (err) {
      dispatch({ type: USER_PREFERENCE_FETCH_FAIL, loading: false, user: { symbols: [] } , err })
    }
  }
}

export function addSymbolToUserPreferences(symbol) {
  return async dispatch => {
    dispatch({ type: USER_SYMBOL_ADD, loading: true })
    try {
      await post(`${config.apiBase}/preferences/symbols`, { symbol })
      dispatch({ type: USER_SYMBOL_ADD_SUCCESS, loading: false, symbol })
    } catch (err) {
      dispatch({ type: USER_SYMBOL_ADD_FAIL, loading: false, symbol, err })
    }
  }
}

export function removeSymbolFromUserPreferences(symbol) {
  return async dispatch => {
    dispatch({ type: USER_SYMBOL_REMOVE, loading: true })
    try {
      await ax.delete(`${config.apiBase}/preferences/symbols/${symbol}`)
      dispatch({ type: USER_SYMBOL_REMOVE_SUCCESS, loading: false, symbol })
    } catch (err) {
      dispatch({ type: USER_SYMBOL_REMOVE_FAIL, loading: false, symbol, err })
    }
  }
}

export function wipeAllSymbolsFromUserPreferences() {
  return async dispatch => {
    dispatch({ type: USER_SYMBOLS_WIPE, loading: true })
    try {
      await ax.delete(`${config.apiBase}/preferences/symbols`)
      dispatch({ type: USER_SYMBOLS_WIPE_SUCCESS, loading: false, symbols: defaultSymbols })
    } catch (err) {
      dispatch({ type: USER_SYMBOLS_WIPE_FAIL, loading: false, err })
    }
  }
}