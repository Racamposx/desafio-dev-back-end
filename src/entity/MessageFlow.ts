import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class MessageFlow {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    template_name: String

    @Column()
    position: number
}
