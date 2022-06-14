import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { IsEmail } from "class-validator"
@Entity()
export class Subscription {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    subscription_date: Date

    @Column({ unique: true }) 
    @IsEmail()
    name: string

    @Column()
    last_message: number

    @Column()
    active: boolean
    
}
