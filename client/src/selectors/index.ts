import { createSelector } from 'reselect'
import { AppState } from '../redux/reducers'
import { User, UserID, UsersObject, StoreObject, Article } from '../types'
import { loginStateEnum } from '../redux/reducers/auth'
import { mapToObject } from '../lib/util'

const getUsers = (state: AppState): UsersObject => state.app.users
const getLoggedInUserId = (state: AppState): UserID => state.auth.userId
const getLoginState = (state: AppState): loginStateEnum => state.auth.state

export const getLoggedInUser = createSelector(
    [getUsers, getLoginState, getLoggedInUserId],
    (users, loginState, userId): User | null => {
        if (loginState == loginStateEnum.LOGGED_IN) {
            return users[userId]
        } else {
            return null
        }
    }
)

const getArticles = (state: AppState): StoreObject<Article> => state.app.articles

export const getUsersArticles = createSelector(
    [getArticles, getLoggedInUser],
    (articles, user): StoreObject<Article> => {
        if (user === null) return []

        return mapToObject(
            Object.values(articles).filter((a) => a.creator === user.id),
            'id'
        )
    }
)
