import { actionKeys } from './actionTypes'
import { crudTypes, createCrudTypes, createAction } from '../store/helpers'
import createCrudService from '../services/createCrudService'
import { displaySnackbar } from '../actions/uiActions'
import { loginActions } from '../actions'
import { displayErrorMessage, isUnauthorized } from './helpers'

const userAccountCrud = createCrudService('/api/intra/account', true)

const USER_ACCOUNT = createCrudTypes(actionKeys.userAccount)

const userAccountActions = {
  pending: (crudType) => createAction(USER_ACCOUNT[crudType].PENDING),
  success: (response, crudType) => createAction(USER_ACCOUNT[crudType].SUCCESS, { response }),
  error: (error, crudType) => createAction(USER_ACCOUNT[crudType].ERROR, { error }),
  fetchUserAccount(userAccountId) {
    return dispatch => {
      dispatch(this.pending(crudTypes.FETCH))
      userAccountCrud.fetchById(userAccountId)
        .then(response => {
          dispatch(this.success(response, crudTypes.FETCH))
        }).catch(err => {
          const message = 'Käyttäjien noutaminen epäonnistui'
          dispatch(this.error({ common: message }, crudTypes.FETCH))
          dispatch(displayErrorMessage(isUnauthorized(err), message))
          isUnauthorized(err) && dispatch(loginActions.logout('/login'))
        })
    }
  },
  fetchUserAccounts() {
    return dispatch => {
      dispatch(this.pending(crudTypes.FETCH))
      const api = userAccountCrud
      api.fetchAll()
        .then(response => {
          dispatch(this.success(response, crudTypes.FETCH))
        }).catch(err => {
          const message = 'Käyttäjien noutaminen epäonnistui'
          dispatch(this.error({ common: message }, crudTypes.FETCH))
          dispatch(displayErrorMessage(isUnauthorized(err), message))
          isUnauthorized(err) && dispatch(loginActions.logout('/login'))
        })
    }
  },
  updateUserAccount(userAccount) {
    return dispatch => {
      dispatch(this.pending(crudTypes.UPDATE))
      userAccountCrud.update(userAccount)
        .then(response => {
          dispatch(this.success(response, crudTypes.UPDATE))
          dispatch(displaySnackbar('Tallennus onnistui'))
        }).catch(err => {
          const message = 'Käyttäjän päivitys epäonnistui'
          dispatch(this.error({ common: message }, crudTypes.UPDATE))
          dispatch(displayErrorMessage(isUnauthorized(err), message))
          isUnauthorized(err) && dispatch(loginActions.logout('/login'))
        })
    }
  },
  removeUserAccount(userAccount) {
    return dispatch => {
      dispatch(this.pending(crudTypes.DELETE))
      userAccountCrud.performDelete(userAccount)
        .then(response => {
          dispatch(this.success(userAccount, crudTypes.DELETE))
          dispatch(displaySnackbar('Poistaminen onnistui'))
        }).catch(err => {
          const message = 'Poistaminen epäonnistui'
          dispatch(this.error({ common: message }, crudTypes.DELETE))
          dispatch(displayErrorMessage(isUnauthorized(err), message))
          isUnauthorized(err) && dispatch(loginActions.logout('/login'))
        })
    }
  }
}

export default userAccountActions
export { USER_ACCOUNT }
