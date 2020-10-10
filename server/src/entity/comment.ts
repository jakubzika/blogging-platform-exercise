import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    PrimaryColumn,
    ManyToOne,
    BaseEntity,
} from 'typeorm'

import { Article } from './article'
import { User } from './user'

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    // TODO: figure out how to make this column also the PrimaryKey
    @ManyToOne(() => Article, (article) => article.comments)
    article: Article

    @ManyToOne(() => User, (user) => user.comments)
    creator: User

    @Column('text')
    content: string

    @Column('timestamp')
    timestamp: string
}
