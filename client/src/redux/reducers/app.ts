import { Article, User, ArticleID } from '../../types'
import { AppActionType, TESTING_ACTION, SET_ARTICLES } from '../actions/types'

export interface State {
    articles: { [key: number]: Article }
    users: { [key: number]: User }
    loading: Boolean
    message: String
}

const initialState: State = {
    articles: {},
    users: {},
    loading: false,
    message: '',
}

export default function appReducer(state: State = initialState, action: AppActionType): State {
    switch (action.type) {
        case TESTING_ACTION:
            return {
                ...state,
                message: action.payload,
            }
        case SET_ARTICLES:
            return {
                ...state,
                articles: {
                    ...state.articles,
                    ...action.articles.reduce((map, article: Article) => {
                        map[article.id.valueOf()] = article
                        return map
                    }, {}),
                },
            }
        default:
            return state
    }
}