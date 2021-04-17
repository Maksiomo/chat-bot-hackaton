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
let idFaq = [];
let type:string;
let subIdPool: string[];


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
                //util.createResponse(idPool, type, data.token);
                util.createResponse(type, data.token, idPool);
                break;
            }

            case 'faq' : {
                idFaq = ["1", "2", "3", "4", "5", "6", "7"];
                type = "faqButtons";
                util.createResponse(type, data.token, idFaq);
                break;

            }
           
            case 'mainPage' : //главная
            case 'successPage' : { //истории успеха
                //подменю нет
                type = "finishButton"; //отличается от других кнопок
                util.createResponse(type, data.token);
                break;
            }

            case 'projectsPage' : //проекты
            case 'learningPage' : //обучение
            case 'lkPage' : { //личный кабинет
                subIdPool = ["1", "2", "3"];
                type = "subChangeButtons";
                util.createResponse(type, data.token, subIdPool);
                break;

            }

            case 'progressPage': { //трек развития
                subIdPool = ["1", "2", "3", "4"];
                type = "subChangeButtons";
                util.createResponse(type, data.token, subIdPool);
                break;
            }

            case 'noAnswer' : {
                
            }
        }

        let response = {
            type: "basicResponce",
            text: defaultMsg,
            token: data.connectionToken
        }
    
        socket.send(response);

    });

    socket.on('close', function (){
        
    });

    
    const util ={
        //createResponse: (idPool:string[], type: string, connectionToken: string) => {
        createResponse: (type: string, connectionToken: string, idPool?:string[]) => {
            //может и стоит разбить конечный выбор и выбор с продолжением
            //но пока по ? кидаются в одну функцию
            if(idPool){
                let response = {
                    msgType: type,
                    data: [],
                    token: connectionToken

                }

                for (const id of idPool) {
                    response.data.push(id);
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
