import {
    AppActionType,
    TESTING_ACTION,
    AppThunk,
    SET_ARTICLES,
    SET_USERS,
    SET_COMMENTS,
    ADD_COMMENT,
    REMOVE_ARTICLES,
} from './types'
import { ThunkAction } from 'redux-thunk'
import { AppState } from '../reducers'
import { Action } from 'redux'
import api from '../../services/api'
import { Article, ArticleID, User, ArticleComment, LoadingState, UserID } from '../../types'
import { useStore } from 'react-redux'
import { setLoadingState } from './ui'

export function testingAction(msg: string): AppActionType {
    return {
        type: TESTING_ACTION,
        payload: msg,
    }
}

export function setArticles(articles: Article[]): AppActionType {
    return {
        type: SET_ARTICLES,
        articles,
    }
}

export function removeArticles(articles: ArticleID[]): AppActionType {
    return {
        type: REMOVE_ARTICLES,
        articles,
    }
}

export function setUsers(users: User[]) {
    return {
        type: SET_USERS,
        users,
    }
}

export function loadArticles(options?: { includeCreator?: boolean; fromUser?: UserID }): AppThunk {
    return async (dispatch) => {
        const response = await api.getArticles(options)
        dispatch(setArticles(response.articles))
        if (response.creators) dispatch(setUsers(response.creators))
    }
}

// TOOD: DRY

export function loadArticle(
    id: ArticleID,
    includeContent: boolean = true,
    includeCreator: boolean = true
): AppThunk {
    return async (dispatch) => {
        const { article, creator } = await api.getArticle(id, includeCreator, includeContent)
        dispatch(setArticles([article]))
        dispatch(setUsers([creator]))
        dispatch(loadComments(id))
    }
}

export function createArticle(title: string, perex: string, content: string): AppThunk {
    return async (dispatch) => {
        dispatch(setLoadingState(LoadingState.LOADING, 'articleCreate'))
        const article = await api.createArticle(title, perex, content)
        if (!article) dispatch(setLoadingState(LoadingState.FAILURE, 'articleCreate'))
        dispatch(setArticles([article]))
        dispatch(setLoadingState(LoadingState.SUCCESS, 'articleCreate'))
    }
}

export function editArticle(
    articleId: ArticleID,
    title: string,
    perex: string,
    content: string
): AppThunk {
    return async (dispatch) => {
        dispatch(setLoadingState(LoadingState.LOADING, 'articleEdit'))
        const article = await api.editArticle(articleId, title, perex, content)
        if (!article) dispatch(setLoadingState(LoadingState.FAILURE, 'articleEdit'))
        dispatch(setArticles([article]))
        dispatch(setLoadingState(LoadingState.SUCCESS, 'articleEdit'))
    }
}

export function deleteArticle(articleId: ArticleID): AppThunk {
    return async (dispatch) => {
        dispatch(setLoadingState(LoadingState.LOADING, 'articleDelete'))
        const article = await api.deleteArticle(articleId)
        if (!article) dispatch(setLoadingState(LoadingState.FAILURE, 'articleDelete'))
        dispatch(removeArticles([articleId]))
        dispatch(setLoadingState(LoadingState.SUCCESS, 'articleDelete'))
    }
}

export function setComments(articleId: ArticleID, comments: ArticleComment[]): AppActionType {
    return {
        type: SET_COMMENTS,
        articleId: articleId,
        comments: comments,
    }
}

export function loadComments(articleId: ArticleID): AppThunk {
    return async (dispatch) => {
        const response = await api.getComments(articleId)
        dispatch(setComments(articleId, response.comments))
        if (response.users) dispatch(setUsers(response.users))
    }
}

export function addComment(comment: ArticleComment, articleId: ArticleID): AppActionType {
    return {
        type: ADD_COMMENT,
        comment,
        articleId,
    }
}
export function createComment(content: string, articleId: ArticleID): AppThunk {
    return async (dispatch) => {
        dispatch(setLoadingState(LoadingState.LOADING, 'newCommentLoading'))
        const comment = await api.addComment(content, articleId)
        console.log(comment)
        console.log('creating comment')
        if (comment !== null) {
            dispatch(addComment(comment, articleId))
            dispatch(setLoadingState(LoadingState.SUCCESS, 'newCommentLoading'))
        } else {
            dispatch(setLoadingState(LoadingState.FAILURE, 'newCommentLoading'))
        }
    }
}
