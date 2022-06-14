# Observações 

## Antes de executar o projeto é necessário ter a database criada.

## Tecnologias utilizadas

- Node.js
- Typescript
- PostgresSQL

Para executar o projeto siga as instruções: <br>
    1. Instale as dependências com o comando "npm install"; <br>
    2. Crie uma database no seu postgres com o nome "precato_challenge"; <br>
    3. Execute o projeto;

* Rotas Subscriptions: <br>
    - POST /subscriptions
        Exemplo body: 
        ```javascript 
        {
            name: 'gabriel@gmail.com',
            last_message: 1,
            active: true
        }
        ```
    - GET /subscriptions/:id
    - GET /subscriptions
    - PUT /subscriptions/:id
        Exemplo body: 
        ```javascript 
        {
            active: false
        }
        ```
    - DELETE /subscriptions/:id

* Rotas MessageFlow:
    - POST /messageflow
        Exemplo body: 
        ```javascript 
        {
            position: 1,
            template_name: "Mensagem 1"
        }
        ```
    - GET /messageflow
    - DELETE /subscriptions/:id


## Para executar o projeto é necessário utilizar o comando:
'npm run start'
