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
let source: string;

let allPossibleStuff = {
    competions: [
        {name: "Цифровой прорыв 2020",
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
    ],
    testsMap: [
        {name: "Мотивы труда",
        tags: ["3", "5"]},
        {name: "Тип мышления",
        tags: ["2", "3"]},
        {name: "Тест на профориентацию",
        tags: ["2", "5"]}
    ],
    professionsCatalog: [
        {name: "Digital и IT",
        tags: ["1", "3"]},
        {name: "Образование",
        tags: ["2", "5"]},
        {name: "Дизайн",
        tags: ["2", "4"]},
    ],
    boostSkills: [
        {name: "Управление взаимодействием",
        tags: ["1", "3"]},
        {name: "Управление задачами",
        tags: ["2", "5"]},
        {name: "Общие знания",
        tags: ["2", "4"]},
    ],
    beProfessional: [
        {name: "Склонности, предрасположения",
        tags: ["1", "3"]},
        {name: "Базовые навыки",
        tags: ["2", "5"]},
        {name: "Умения",
        tags: ["2", "4"]},
    ],
}



test.use(cors());

const server = http.createServer(test);

server.listen(3000, () => console.log("Server started!"));

// test.get('/getSomeUserData', function(req, res) {

//     var response = {
//         type: 'chatToken',
//         data: uuid()};
//     res.send(response);
// });

const wsServer = new ws.Server({
    server: server
});

wsServer.on('connection', function(socket) {

    // var login: string = '';
    // var registered: boolean = false;

    socket.on('open', function() {
        console.log("connection established");
    });

    socket.on('message', function(income: any) {

        let data = JSON.parse(income);

        //console.log(income);

        if (data.source === "bot") {
            if (data.type === "welcome") {
                type = "welcome";
                message = "Приветствую, я Helpy - ваш гид по нашей платформе! Для того чтобы получить доступ ко всем возможностям сайта, прошу вас пройти регистрацию. А если хотите получить от меня пару дельных советов, то укажите также свои компетенции и сферу деятельности.";
                source  = "bot";
                util.createResponse(type, message, source);
            } else if (data.type === "message") {
                //мои попытки имеют комменты, так что есчо стираем
                switch (data.buttonId) {

                    case 'iAmRegistered' :{
                        message = "Отлично, теперь давайте как я поищу для вас что нибудь интересное...";
                        type = "changeButtons";
                        source = "bot";
                        util.createResponse(type, message, source);
                        break;
                    }
    
                    case 'noAnswer' : {
                        message = "К сожалению, моих сил не достаточно, чтобы вам помочь. :( Вы можете обратиться за помощью к специалисту службы поддержки, написав свой вопрос в поле снизу.";
                        type = "noAnswer"; 
                        source = "bot";
                        util.createResponse(type, message, source);           
                        break;         
                    }
    
                    default: {
                        idPool = ["mainPage"];
                        type = "changeButtons";
                        message = "Invalid button! Return to main page.";
                        source = "bot";
                        util.createResponse(type, message, source, idPool);
                        break;
                    }
                }
            }
        } else if (data.source === "faq"){
            if (data.type === "welcome") {
                type = "welcome";
                message = "Приветствую, я Helpy - ваш гид по нашей платформе! Для того чтобы получить доступ ко всем возможностям сайта, прошу вас пройти регистрацию. А если хотите получить от меня пару дельных советов, то укажите также свои компетенции и сферу деятельности.";
                source  = "bot";
                util.createResponse(type, message, source);
            } else if (data.type === "message") {
                //мои попытки имеют комменты, так что есчо стираем
                switch (data.buttonId) {

                    case 'progressTrack' :{
                        idPool = ["testsMap", "professionsCatalog", "boostSkills", "beProfessional"];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool);
                        break;
                    }

                    case 'projects' :{
                        idPool = ["competions", "events", "projects"];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool);
                        break;
                    }

                    case 'learning' :{
                        idPool = ["online_courses", "ofline_events", "webinar"];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool);
                        break;
                    }

                    case 'successStories' :{
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source);
                        break;
                    }

                    case 'helpOthers' :{
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source);
                        break;
                    }

                    case 'competions' : {
                        idPool = [allPossibleStuff.competions[0].name, allPossibleStuff.competions[1].name, allPossibleStuff.competions[2].name, allPossibleStuff.competions[3].name, allPossibleStuff.competions[4].name];
                        urlPool = ["", "", "", "", ""]; //первый это цифровой прорыв
                        message = "";
                        type = "finishButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);
                    }
    
                    case 'noAnswer' : {
                        message = "К сожалению, моих сил не достаточно, чтобы вам помочь. :( Вы можете обратиться за помощью к специалисту службы поддержки, написав свой вопрос в поле снизу.";
                        type = "noAnswer"; 
                        source = "faq";
                        util.createResponse(type, message, source);           
                        break;         
                    }
    
                    default: {
                        idPool = ["mainPage"];
                        type = "changeButtons";
                        message = "Invalid button! Return to main page.";
                        source = "faq";
                        util.createResponse(type, message, source, idPool);
                        break;
                    }
                }
            }
        }

        
    });

    socket.on('close', function (){
        
    });

    
    const util ={
        createResponse: (type: string, smessage: string, ssource: string, idsPool?:string[], urlsPool?:string[]) => {
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
