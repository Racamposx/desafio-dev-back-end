import * as express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "./datasource";
import { Subscription } from "./entity/Subscription";
import { validate } from "class-validator";
import { MessageFlow } from "./entity/MessageFlow";
import {Cron} from 'node-cron';
var cron = require('node-cron');

// establish database connection
AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })




// create and setup express app
const app = express()
app.use(express.json())

// register routes
app.get("/subscriptions", async function (req: Request, res: Response) {
    const subscriptions = await AppDataSource.getRepository(Subscription).find()
    res.json(subscriptions)
})

app.get("/subscriptions/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource.getRepository(Subscription).findOneBy({
        id: Number(req.params.id),
    })
    return res.send(results)
})

app.post("/subscriptions", async function (req: Request, res: Response) {
    const {name,last_message,active} = req.body;
    const exists = await AppDataSource.getRepository(Subscription).findOneBy({
        name: req.params.name
    })
    console.log(exists)
    if (exists) {
        return res.send({errors: [{
			"target": {},
			"property": "name",
			"children": [],
			"constraints": {
				"isEmail": "name must be unique"
			}
		}]}) 
    }
    const sub = new Subscription();
    sub.active = active;
    sub.last_message = last_message;
    sub.name = name;
    const errors = await validate(sub);
    if (errors.length > 0) {
        return res.send({errors}) 
    }
   
    const subscription = await AppDataSource.getRepository(Subscription).create(req.body)
    const results = await AppDataSource.getRepository(Subscription).save(subscription)
    return res.send(results)
})

app.put("/subscriptions/:id", async function (req: Request, res: Response) {
    const subscription = await AppDataSource.getRepository(Subscription).findOneBy({
        id: Number(req.params.id),
    })
    AppDataSource.getRepository(Subscription).merge(subscription, req.body)
    const results = await AppDataSource.getRepository(Subscription).save(subscription)
    return res.send(results)
})

app.delete("/subscriptions/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource.getRepository(Subscription).delete(req.params.id)
    return res.send(results)
})

app.post("/messageflow", async function (req: Request, res: Response) {
    const messageflow = await AppDataSource.getRepository(MessageFlow).create(req.body)
    const results = await AppDataSource.getRepository(MessageFlow).save(messageflow)
    return res.send(results)
})

app.get("/messageflow", async function (req: Request, res: Response) {
    const messageflow = await AppDataSource.getRepository(MessageFlow).find()
    res.json(messageflow)
})

app.delete("/messageflow/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource.getRepository(MessageFlow).delete(req.params.id)
    return res.send(results)
})



//Setting time to trigger validation
cron.schedule('0 0 * * *', async () => {
    const subscriptions = await AppDataSource.getRepository(Subscription).find({
        where: {active: true}}
    )
    subscriptions.map( async element =>{
        let index = element.last_message+1;
        
        const mensagem = await AppDataSource.getRepository(MessageFlow).findOneBy({
            position:index,
        })
        const subscription = await AppDataSource.getRepository(Subscription).findOneBy({
            id: element.id
        })
        if(mensagem){
            console.log(mensagem);
            let novo = element;
            novo.last_message = index;
            AppDataSource.getRepository(Subscription).merge(subscription, novo)
            const results = await AppDataSource.getRepository(Subscription).save(subscription)
    
        }
        else{
            let novo = element;
            novo.active = false;
            AppDataSource.getRepository(Subscription).merge(subscription, novo)
            const results = await AppDataSource.getRepository(Subscription).save(subscription)
        }
        // atualizar

        console.log('Operação realizada')
    })

});
   


// start express server
app.listen(3000);

const init = async ()=>{
    const subs = [
        {
            name:"rafael@gmail.com",
            active: true,
            last_message: 0
        },
        {
            name:"gabriel@gmail.com",
            active: true,
            last_message: 0
        },
        {
            name:"samuel@gmail.com",
            active: true,
            last_message: 0
        }
    ]

    subs.map(async element =>{
        const sub = await AppDataSource.getRepository(Subscription).create(element)
        const results = await AppDataSource.getRepository(Subscription).save(element)
    })

    const messages = [
        {
            template_name: 'email teste 1',
            position: 1
        },

        {
            template_name: 'email teste 2',
            position: 2
        },

        {
            template_name: 'email teste 3',
            position: 3
        }
    ]

    messages.map(async element =>{
        const sub = await AppDataSource.getRepository(MessageFlow).create(element)
        const results = await AppDataSource.getRepository(MessageFlow).save(element)
    })
   
}
