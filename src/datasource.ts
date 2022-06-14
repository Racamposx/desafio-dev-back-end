import "reflect-metadata"
import { DataSource } from "typeorm"
import { MessageFlow } from "./entity/MessageFlow";
import { Subscription } from "./entity/Subscription";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123",
    database: "precato_challenge",
    synchronize: true,
    logging: false,
    entities: [MessageFlow,Subscription],
    migrations: [],
    subscribers: [],
})
