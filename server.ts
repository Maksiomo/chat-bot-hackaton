import * as ws from "ws";
import {v4 as uuid} from "uuid";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import {EJSON} from "bson";
import { utimes } from "node:fs";

const defaultMsg: string = "click recieved";

const test = express();

let userDataArray = [];

const serverUtil ={
    createUser: (userID: string, isRegistred:boolean, skills: string[]) => {
        let user = {
            id: userID,
            isReg: isRegistred,
            allSkills: skills
        }
        userDataArray.push(user);
    },

    checkForUser: (userID: string, isReg:boolean, skills: string[]) => {
        let isRegistered: boolean = false;
        for (let user of userDataArray ){
            if (user.id === userID) {
                return true;
            }
        }
        if (isRegistered) {
            serverUtil.createUser(userID, isReg, skills);
        }
        return false;
    }
}

let idPool: string[];
let urlPool: string[];
let type:string;
let message: string;

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
        tags: ["4", "5"]}
    ],
    projects: [
        {name: "Профстажировки 2.0",
        tags: ["1", "2"]}, 
        {name: "Благотворительный проект 'Мечтай со мной'",
        tags: ["2", "3"]},
        {name: "Фестиваль 'Российская студенческая весна'",
        tags: ["2", "4"]}
    ]
}



test.use(cors());

const server = http.createServer(test);

server.listen(3000, () => console.log("Server started!"));

test.get('/getSomeUserData', function(req, res) {

    var response = {
        type: 'chatToken',
        data: uuid()};
    res.send(response);
});

const wsServer = new ws.Server({
    server: server
});

wsServer.on('connection', function(socket) {

    var login: string = '';
    var registered: boolean = false;

    socket.on('open', function() {
        console.log("connection established");
    });

    socket.on('message', function(income: any) {

        let data = JSON.parse(income);

        //console.log(income);

        if (data.type === "welcome") {
            type = "welcome";
            message = "Приветствую, я Helpy - ваш гид по нашей платформе! Чем я могу помочь на этот раз?";
            util.createResponse(type, message);
        } else if (data.type === "message") {
            //мои попытки имеют комменты, так что есчо стираем
            switch (data.buttonId) {
                case 'siteNavigation' : {
                    idPool= ["learningPage", "projectPage", "progressPage", "successPage", "return"];
                    type = "У нас на сайте есть следующие разделы:";
                    message = defaultMsg;
                    util.createResponse(type, message, idPool);
                    break;
                }

                case 'faq' : {
                    idPool = ["1", "2", "3", "4", "5", "6", "7"];
                    type = "changeButtons";
                    message = "Часто задаваемые вопросы:";
                    util.createResponse(type, message, idPool);
                    break;

                }
            
                case 'mainPage' : {
                    idPool = ["mainPage"];
                    type = "changeButtons";
                    message = "";
                    util.createResponse(type, message, idPool);
                    break;
                } //главная
                case 'successPage' : { //истории успеха
                    //подменю нет
                    type = "finishButton"; //отличается от других кнопок
                    message = "Мы поможем вам стать лучше, для этого у нас есть следующие разделы:";
                    util.createResponse(type, message);
                    break;
                }

                case 'projectsPage' : { //проекты
                    idPool = ["1", "2", "3"];
                    type = "Мы не любим сидеть на месте и постоянно проводим ивенты";
                    message = defaultMsg;
                    util.createResponse(type, message, idPool);
                    break;
                }
                case 'learningPage' : { //обучение
                    idPool = ["webinarPage", "coursesPage"];
                    type = "changeButtons";
                    message = "Каждый день на нашей платформе появляются новые курсы и вебинары, на которых можно не только узнать что то новое, но и испытать свои навыки. Что именно вы хотели бы попробовать на этот раз?";
                    util.createResponse(type, message, idPool);
                    break;
                }

                case 'webinarPage' : {
                    type = "showUrls";
                    message = "Вот несколько вебинаров, которые пройдут очень скоро:"
                    urlPool =["https://rsv.ru/portal/edu/webinars/1/104?mView=detail", "https://rsv.ru/portal/edu/webinars/1/111?mView=detail", "https://rsv.ru/portal/edu/webinars/1/122?mView=detail"];
                    util.createResponse(type, message, idPool, urlPool);
                }

                case 'coursesPage' : {
                    type = "showUrls";
                    message = "Вот несколько курсов, которые начнутся очень скоро:"
                    urlPool = ["https://rsv.ru/portal/edu/courses/1/543?mView=detail", "https://rsv.ru/portal/edu/courses/1/541?mView=detail", "https://rsv.ru/portal/edu/courses/1/540?mView=detail"];
                    util.createResponse(type, message, idPool, urlPool);
                }
                
                case 'lkPage' : { //личный кабинет
                    idPool = ["1", "2", "3"];
                    type = "changeButtons";
                    message = defaultMsg;
                    util.createResponse(type, message, idPool);
                    break;

                }

                case 'progressPage': { //трек развития
                    idPool = ["1", "2", "3", "4"];
                    type = "Мы поможем вам стать лучше, для этого у нас есть следующие разделы:";
                    message = defaultMsg;
                    util.createResponse(type, message, idPool);
                    break;
                }

                case 'noAnswer' : {
                    message = "К сожалению, моих сил не достаточно, чтобы вам помочь. :( Вы можете обратиться за помощью к специалисту службы поддержки, написав свой вопрос в поле снизу.";
                    type = "noAnswer"; 
                    util.createResponse(type, message);                    
                }

                default: {
                    idPool = ["mainPage"];
                    type = "changeButtons";
                    message = "Invalid button! Return to main page.";
                    util.createResponse(type, message, idPool);
                    break;
                }
            }
        }
    });

    socket.on('close', function (){
        
    });

    
    const util ={
        createResponse: (type: string, smessage: string, idsPool?:string[], urlsPool?:string[]) => {
            //может и стоит разбить конечный выбор и выбор с продолжением
            //но пока по ? кидаются в одну функцию
            if(urlsPool){

                let response = {
                    msgType: type,
                    message: smessage, 
                    urlPool: urlsPool
                }
                socket.send(JSON.stringify(response));
            } else if(idsPool){

                let response = {
                    msgType: type,
                    message: smessage,
                    idPool: idsPool
                }
                socket.send(JSON.stringify(response));

            } else {
                let response = {
                    msgType: type,
                    message: smessage
                }

                socket.send(JSON.stringify(response));
            }
        
            //socket.send(response); раньше был общий
            //но сейчас его подчеркивает
        }
    };


    

})
