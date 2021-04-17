import * as axios from "axios";
import * as ws from "ws";
import {v4 as uuid} from "uuid";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";

let users: any = [];
const defaultMsg: string = "click recieved";

const test = express();

let idPool: string[];
let type:string;

let qwe = {
    competions: [
        {name: "Лидеры России",
        tags: ["3", "4"]}, 
        {name: "Твой ход",
        tags: ["1", "2", "3"]}, 
        {name: "Время карьеры",
        tags: ["5", "8"]},
        {name:"Мой первый бизнес",
        tags:["8", "10"]},
        {name: "Большая перемена",
        tags: ["1", "7", "10"]},
        {name: "Лидеры России. Политика",
        tags: ["5", "6", "8"]}
    ],
    events: [
        {name: "Мастерская управлния 'Сенеж'",
        tags: ["1", "3"]},
        {name: "Культурный код",
        tags: ["4", "5"]}],
    projects: [
        {name: "Профстажировки 2.0",
        tags: ["1", "2"]}, 
        {name: "Благотворительный проект 'Мечтай со мной'",
        tags: ["2", "3"]},
        {name: "Фестиваль 'Российская студенческая весна'",
        tags: ["2", "4"]}]
}



test.use(cors());

const server = http.createServer(test);

server.listen(3000, () => console.log("Server started!"));

test.get('/chatToken', function(req, res) {
    var response = {
        type: 'chatToken',
        data: uuid()};
    res.send(response);
});

const wsServer = new ws.Server({
    server: server
});

wsServer.on('connection', function(socket) {

    socket.on('open', function() {
        console.log("connection established");
    });

    socket.on('message', function(message: string) {
        var data = JSON.parse(message);

        //мои попытки имеют комменты, так что есчо стираем
        switch (data.buttonId) {
            case 'siteNavigation' : {
                idPool= ["1", "2", "3", "4", "5", "6"];
                type = "changeButtons";
                message = defaultMsg;
                util.createResponse(type, data.token, message, idPool);
                break;
            }

            case 'faq' : {
                idPool = ["1", "2", "3", "4", "5", "6", "7"];
                type = "faqButtons";
                message = defaultMsg;
                util.createResponse(type, data.token, message, idPool);
                break;

            }
           
            case 'mainPage' : //главная
            case 'successPage' : { //истории успеха
                //подменю нет
                type = "finishButton"; //отличается от других кнопок
                message = "end of chain";
                util.createResponse(type, data.token, message);
                break;
            }

            case 'projectsPage' : //проекты
            case 'learningPage' : //обучение
            case 'lkPage' : { //личный кабинет
                idPool = ["1", "2", "3"];
                type = "ChangeButtons";
                message = defaultMsg;
                util.createResponse(type, data.token, message, idPool);
                break;

            }

            case 'progressPage': { //трек развития
                idPool = ["1", "2", "3", "4"];
                type = "subChangeButtons";
                message = defaultMsg;
                util.createResponse(type, data.token, message, idPool);
                break;
            }

            case 'noAnswer' : {
                
            }
        }
    });

    socket.on('close', function (){
        
    });

    
    const util ={
        //createResponse: (idPool:string[], type: string, connectionToken: string) => {
        createResponse: (type: string, connectionToken: string, smessage: string, idsPool?:string[]) => {
            //может и стоит разбить конечный выбор и выбор с продолжением
            //но пока по ? кидаются в одну функцию
            if(idPool){

                let response = {
                    msgType: type,
                    token: connectionToken,
                    message: smessage,
                    idPool: idsPool
                }
                socket.send(response);

            } else {
                let response = {
                    msgType: type,
                    token: connectionToken

                }

                socket.send(response);
            }
        
            //socket.send(response); раньше был общий
            //но сейчас его подчеркивает
            }
    };


    

})
