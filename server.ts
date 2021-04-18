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
    },

    createStuffPool: (skillsPool: string[], allPossibleStuff: any) => {
        let finalPool =[];
        let flag: boolean = false;
        for (let competition of allPossibleStuff.competitions) {
            for (let skill of skillsPool) {
                for (let tag of competition.tags) {
                    if (skill === tag) {
                        finalPool.push(competition);
                        flag = true;
                        break;
                    }
                }
                if (flag) break;
            }
            flag = false;
        }
        for (let event of allPossibleStuff.events) {
            for (let skill of skillsPool) {
                for (let tag of event.tags) {
                    if (skill === tag) {
                        finalPool.push(event);
                        flag = true;
                        break;
                    }
                }
                if (flag) break;
            }
        flag = false;
        }for (let project of allPossibleStuff.projects) {
            for (let skill of skillsPool) {
                for (let tag of project.tags) {
                    if (skill === tag) {
                        finalPool.push(project);
                        flag = true;
                        break;
                    }
                }
                if (flag) break;
            }
            flag = false;
        }for (let profession of allPossibleStuff.professionsCatalog) {
            for (let skill of skillsPool) {
                for (let tag of profession.tags) {
                    if (skill === tag) {
                        finalPool.push(profession);
                        flag = true;
                        break;
                    }
                }
                if (flag) break;
            }
            flag = false;
        }for (let competition of allPossibleStuff.competitions) {
            for (let skill of skillsPool) {
                for (let tag of competition.tags) {
                    if (skill === tag) {
                        finalPool.push(competition);
                        flag = true;
                        break;
                    }
                }
                if (flag) break;
            }
            flag = false;
        }for (let boostSkill of allPossibleStuff.boostSkills) {
            for (let skill of skillsPool) {
                for (let tag of boostSkill.tags) {
                    if (skill === tag) {
                        finalPool.push(boostSkill);
                        flag = true;
                        break;
                    }
                }
                if (flag) break;
            }
            flag = false;
        }for (let proffesional of allPossibleStuff.beProfessional) {
            for (let skill of skillsPool) {
                for (let tag of proffesional.tags) {
                    if (skill === tag) {
                        finalPool.push(proffesional);
                        flag = true;
                        break;
                    }
                }
                if (flag) break;
            }
            flag = false;
        }
        return finalPool;
    }
}

let idPool: string[];
let urlPool: any;
let type:string;
let message: string;
let source: string;

let allPossibleStuff = {
    competitions: [
        {name: "Цифровой прорыв 2020",tags: ["3", "4"],url: "https://leadersofdigital.ru/"}, 
        {name: "Твой ход",tags: ["1", "2", "3"],url: "https://tvoyhod.online/"}, 
        {name: "Время карьеры",tags: ["5", "8"],url: "https://xn--80adjbxl0aeb4ii6a.xn--p1ai/"},
        {name: "Мой первый бизнес",tags:["8", "10"],url: "https://myfirstbusiness.ru/"},
        {name: "Большая перемена",tags: ["1", "7", "10"],url: "https://bolshayaperemena.online/"},
        {name: "Лидеры России. Политика",tags: ["5", "6", "8"],url: "https://xn--d1abablabbpgg2am0ahn0gzd.xn--p1ai/"}
    ],
    events: [
        {name: "Мастерская управлния 'Сенеж'",tags: ["1", "3"],url: "https://rsv.ru/competitions/events/1/27/"},
        {name: "Культурный код",tags: ["4", "5"],url: "https://rsv.ru/competitions/events/1/22/"},
        {name: "Мастерская управления 'Сенеж'",tags: ["1", "3"],url: "https://rsv.ru/competitions/events/1/27/"},
        {name: "Культурный код",tags: ["4", "5"],url: "https://rsv.ru/competitions/events/1/22/"}
    ],
    projects: [
        {name: "Профстажировки 2.0",tags: ["1", "2"],url: "https://xn--80aeliblxdekein0a.xn--p1ai/"}, 
        {name: "Благотворительный проект 'Мечтай со мной'",tags: ["2", "3"],url: "https://xn--80ajnaldhgc0ai3d.xn--p1ai/"},
        {name: "Фестиваль 'Российская студенческая весна'",tags: ["2", "4"],url: "https://studvesna.ruy.ru/"}
    ],
    testsMap: [
        {name: "Мотивы труда",tags: ["3", "5"],url: "https://rsv.ru/portal/track"},
        {name: "Тип мышления",tags: ["2", "3"],url: "https://rsv.ru/portal/track"},
        {name: "Тест на профориентацию",tags: ["2", "5"],url: "https://rsv.ru/portal/track"}
    ],
    professionsCatalog: [
        {name: "Digital и IT",tags: ["1", "3"],url: "https://rsv.ru/portal/professions/list/23"},
        {name: "Образование",tags: ["2", "5"],url: "https://rsv.ru/portal/professions/list/28"},
        {name: "Дизайн",tags: ["2", "4"],url: "https://rsv.ru/portal/professions/list/37"},
    ],
    boostSkills: [
        {name: "Управление взаимодействием",tags: ["1", "3"],url: "https://rsv.ru/portal/other-skills"},
        {name: "Управление задачами",tags: ["2", "5"],url: "https://rsv.ru/portal/other-skills"},
        {name: "Общие знания",tags: ["2", "4"],url: "https://rsv.ru/portal/other-skills"},
    ],
    beProfessional: [
        {name: "Склонности, предрасположения",tags: ["1", "3"],url: "https://rsv.ru/portal/hard-skills"},
        {name: "Базовые навыки",tags: ["2", "5"],url: "https://rsv.ru/portal/hard-skills"},
        {name: "Умения",tags: ["2", "4"],url: "https://rsv.ru/portal/hard-skills"},
    ],
}

let testUser = {
    ageGroup: "student",
    skills: ["1", "4", "7"],
    geschlecht: "man", 
    job: "none"
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

        //console.log(data);

        if (data.source === "bot") {
            if (data.type === "welcome") {
                type = "welcome";
                message = "Приветствую, я Helpy - ваш гид по нашей платформе! Для того чтобы получить доступ ко всем возможностям сайта, прошу вас пройти регистрацию. А если хотите получить от меня пару дельных советов, то укажите также свои компетенции и сферу деятельности.";
                source  = "bot";
                util.createResponse(type, message, source);
            } else if (data.type === "message") {
               
                switch (data.buttonId) {

                    case 'iAmRegistered' :{
                        idPool = ["goForIt"];
                        message = "Отлично, теперь давайте как я поищу для вас что нибудь интересное...";
                        type = "changeButtons";
                        source = "bot";
                        util.createResponse(type, message, source, idPool);
                        break;
                    }

                    case 'goForIt' :{
                        let skillPool = serverUtil.createStuffPool(testUser.skills, allPossibleStuff);
                        let i = Math.floor(Math.random()*(16));
                        idPool=["goEvenFurther"];
                        urlPool = {
                            url: skillPool[i].url,
                            name: skillPool[i].name
                        };
                        message = "Вот что я смог найти, хотите найду вам еще что нибудь подходящее?";
                        type = "showUrls";
                        util.createResponse(type, message, source, idPool, urlPool);
                        break;
                    }

                    case 'goEvenFurther' :{
                        let skillPool = serverUtil.createStuffPool(testUser.skills, allPossibleStuff);
                        let i = Math.floor(Math.random()*(16));
                        idPool=["goEvenFurther"];
                        urlPool = {
                            url: skillPool[i].url,
                            name: skillPool[i].name
                        };
                        message = "Вот что я смог найти, хотите найду вам еще что нибудь подходящее?";
                        type = "showUrls";
                        util.createResponse(type, message, source, idPool, urlPool);
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
                source  = "faq";
                util.createResponse(type, message, source);
            } else if (data.type === "message") {
         
                switch (data.buttonId) {

                    case 'progressTrack' :{
                        idPool = ["testsMap", "professionsCatalog", "boostSkills", "beProfessional"];
                        urlPool = [];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);
                        break;
                    }

                    case 'projects' :{ //внешние проекты
                        idPool = ["competitions", "events", "projectsInProjects"]; //проекты в проектах
                        urlPool = ["https://rsv.ru/portal/competitions/contests/1/1", "https://rsv.ru/portal/competitions/events/1/27", "https://rsv.ru/portal/competitions/internship/1/7"];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);
                        break;
                    }

                    case 'learning' :{
                        idPool = ["online_courses", "ofline_events", "webinar"];
                        urlPool = ["https://rsv.ru/portal/edu/courses/1/543", "https://rsv.ru/portal/edu/events", "https://rsv.ru/portal/edu/webinars/1/141"];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);
                        break;
                    }

                    case 'successStories' :{
                        urlPool = ["https://rsv.ru/portal/main/examples"];
                        message = "";
                        type = "finishButtons";
                        source = "faq";
                        util.createResponse(type, message, source);
                        break;
                    }

                    case 'helpOthers' :{
                        urlPool = ["https://rsv.ru/portal/main/gains"];
                        message = "";
                        type = "finishButtons";
                        source = "faq";
                        util.createResponse(type, message, source);
                        break;
                    }

                    case 'competitions' : {
                        idPool = [allPossibleStuff.competitions[0].name, allPossibleStuff.competitions[1].name, allPossibleStuff.competitions[2].name, allPossibleStuff.competitions[3].name, allPossibleStuff.competitions[4].name];
                        urlPool = [allPossibleStuff.competitions[0].url, allPossibleStuff.competitions[1].url, allPossibleStuff.competitions[2].url, allPossibleStuff.competitions[3].url, allPossibleStuff.competitions[4].url];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);
                    }

                    case 'events' : {
                        idPool = [allPossibleStuff.events[0].name, allPossibleStuff.events[1].name, allPossibleStuff.events[2].name, allPossibleStuff.events[3].name];
                        urlPool = [allPossibleStuff.events[0].url, allPossibleStuff.events[1].url, allPossibleStuff.events[2].url, allPossibleStuff.events[3].url];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);
                    }

                    case 'projectsInProjects' : { //внутренние проекты
                        idPool = [allPossibleStuff.projects[0].name, allPossibleStuff.projects[1].name, allPossibleStuff.projects[2].name];
                        urlPool = [allPossibleStuff.projects[0].url, allPossibleStuff.projects[1].url, allPossibleStuff.projects[2].url];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);
                    }

                    case 'testsMap' : {
                        idPool = [allPossibleStuff.testsMap[0].name, allPossibleStuff.testsMap[1].name, allPossibleStuff.testsMap[2].name];
                        urlPool = [allPossibleStuff.testsMap[0].url, allPossibleStuff.testsMap[1].url, allPossibleStuff.testsMap[2].url];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);                    
                    }

                    case 'professionsCatalog' : {
                        idPool = [allPossibleStuff.professionsCatalog[0].name, allPossibleStuff.professionsCatalog[1].name, allPossibleStuff.professionsCatalog[2].name];
                        urlPool = [allPossibleStuff.professionsCatalog[0].url, allPossibleStuff.professionsCatalog[1].url, allPossibleStuff.professionsCatalog[2].url];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);                    
                    }

                    case 'boostSkills' : {
                        idPool = [allPossibleStuff.boostSkills[0].name, allPossibleStuff.boostSkills[1].name, allPossibleStuff.boostSkills[2].name];
                        urlPool = [allPossibleStuff.boostSkills[0].url, allPossibleStuff.boostSkills[1].url, allPossibleStuff.boostSkills[2].url];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);                    
                    }

                    case 'beProfessional' : {
                        idPool = [allPossibleStuff.beProfessional[0].name, allPossibleStuff.beProfessional[1].name, allPossibleStuff.beProfessional[2].name];
                        urlPool = [allPossibleStuff.beProfessional[0].url, allPossibleStuff.beProfessional[1].url, allPossibleStuff.beProfessional[2].url];
                        message = "";
                        type = "changeButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);                    
                    }

                    /* case 'digitalBreakFAQ' : {
                        idPool = ["Общие вопросы о конкурсе", "Этап 'регистрация'", "О команде и командообразовании", "Задания на тематические хакатоны"];
                        //urlPool = [];
                        message = "";
                        type = "finishButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool, urlPool);
                    }

                    case 'basicQuestions' : {
                        idPool = ["Что такое хакатон, и как он будет проводиться?", "Этап 'регистрация'", "О команде и командообразовании", "Задания на тематические хакатоны"];
                        message = "";
                        type = "finishButtons";
                        source = "faq";
                        util.createResponse(type, message, source, idPool);
                    } */
    
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
                    urlPool: urlsPool,
                    idPool: idPool,
                    source: ssource
                }

                console.log(response);
                socket.send(JSON.stringify(response));
                
            } else if(idsPool){

                let response = {
                    msgType: type,
                    message: smessage,
                    idPool: idsPool,
                    source: ssource
                }
                console.log(response);
                socket.send(JSON.stringify(response));

            } else {
                let response = {
                    msgType: type,
                    message: smessage,
                    source: ssource
                }
                console.log(response);
                socket.send(JSON.stringify(response));
            }
        
            //socket.send(response); раньше был общий
            //но сейчас его подчеркивает
        }
    };


    

})
