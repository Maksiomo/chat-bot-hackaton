(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var ws = require('ws');
//Подключение контейнера для сообщений
var chatDiv = document.getElementById('botChat');
//Подключение контейнера для кнопок
var buttonsDiv = document.getElementById('botButtonContainer');
// контейнер для вывода FAQ 
var faqDiv = document.getElementById('faqChat');
// контейнер для кнопок FAQ
//var buttonsFaq = document.getElementById('faqButtonContainer');
//Переменная, хранящая токен пользователя
//var token = "token";
//Создание вебсокета
var connection = new WebSocket('ws://localhost:3000');
/*
* Метод, который делает время удобным для восприятия пользователем
* Добавляет перед числом ноль, если оно меньше десяти
* Принимает число
* Возвращает строку
*/
function makeGoodTime(int) {
    if (int < 10) {
        return "0" + int;
    }
    else {
        return "" + int;
    };
};
/*
* Метод добавляющий новое сообщение в контейнер chatDiv
* Принимает сообщение и его автора user/bot
*/
function addMessage(message, author) {
    var newDiv = document.createElement('div');
    var date = new Date();
    if (author === "user") {
        newDiv.setAttribute("class", "container userMessage");
        newDiv.innerHTML =  message + "<br><span id=\"Time\">" + makeGoodTime(date.getHours()) + ":" + makeGoodTime(date.getMinutes()) + "</span>";
    }
    else if (author === "bot") {
        newDiv.setAttribute("class", "container botMessage");
        newDiv.innerHTML = message + "<br><span id=\"Time\">" + makeGoodTime(date.getHours()) + ":" + makeGoodTime(date.getMinutes()) + "</span>";
    };
    if (chatDiv) {
        chatDiv.appendChild(newDiv);
    };
};

// метод, добавляющий рабочую ссылку в контейнер chatDiv
// принимает сообщение и автора
function addUrl (message) {
    console.log(message.url);
    let blank = "_blank";
    var newDiv = document.createElement('div');
    newDiv.setAttribute("class", "container botMessage");
    newDiv.innerHTML = "<a href =" + message.url +" target = "+ blank +">" + message.name + "</a>";
    console.log(newDiv);
    if (chatDiv) {
        chatDiv.appendChild(newDiv);
    };
}


/*
    Метод, добавляющий сообщения в контейнер faqDiv
    примает текст сообщения и автора
*/

    function addMessageToFAQ(message) {
        var newDiv = document.createElement('div');
            newDiv.setAttribute("class", "container botMessage");
            newDiv.innerHTML = message;
        if (faqDiv) {
            faqDiv.appendChild(newDiv);
        };
    };

/*
    Метод, добавляющий кнопку в контейнер faqDiv
    принимает id и содержания кнопки 
    возвращает созданный HTML элемент
*/

    function createHTMLButtonFAQ(id, content) {
        var newDiv = document.createElement('button');
        newDiv.setAttribute("id", id);
        newDiv.setAttribute("class", 'container button');
        newDiv.innerHTML = content;
        if (faqDiv) {
            faqDiv.appendChild(newDiv);
        };
        return newDiv;
    };

/*

*/

/*
* Метод, создаюший HTML-кнопку в контейнере buttonDiv
* Принимает id и содержание кнопки
* Возвращает созданный HTML-элемент
*/
function createHTMLButton(id, content) {
    var newDiv = document.createElement('button');
    newDiv.setAttribute("id", id);
    newDiv.setAttribute("class", 'container button');
    newDiv.innerHTML = content;
    if (buttonsDiv) {
        buttonsDiv.appendChild(newDiv);
    };
    return newDiv;
};



/*
Метод, удаляющий старые кнопки в контейнере 
принимает id контейнера
*/
function removeOldButtons(id) {
    if (id) {
        while (id.firstChild) {
            id.removeChild(id.firstChild);
        };
    };
};
/*
* Метод, определяющий содержание кнопки по id
* Принимает id
* Возвращает содержание нужной кнопки
*/
function getContentById(id) {
    switch (id) {
        // TODO: прописать новые айдишники для новых кнопок
        case 'iAmRegistered':{return 'Я завершил регистрацию'};
        case 'goForIt': {return 'Найди-ка мне что нибудь'};
        case 'goEvenFurther': {return 'Найди-ка мне ещё что нибудь'};
        case 'return':{return 'Вернуться'};

        case 'progressTrack': {return 'О Треке Развития'};
        case 'projects': {return 'О наших проектах'};
        case 'learning': {return 'О наших курсах и вебинарах'};
        case 'helpOthers': {return 'О помощи другим'};
        case 'lkNavigation': {return 'Об устройстве личного кабинета'};
        case 'support': {return 'Бот_нейм не смог ответить на ваш вопрос'};
        
        case 'testsMap': {return 'О профдиагностике'};
        case 'professionsCatalog': {return 'О каталоге профессий'};
        case 'boostSkills': {return 'О каталоге профессий'}
        beProfessional
        competitions
        events
        projectsInProjects
        online_courses
        ofline_events
        webinar
        whereToInputSpecial
        howToSetSkills
        mentorProgramm
        russianVolounteer
        dreamWithMe 
        default:{return 'Invalid button'};
    };
};
/*
* Метод, обновляющий контейнер с кнопками
* Принимает id кнопок, которые необходимо создать
*/
function updateButtons(idPool, containerID, source) {
    removeOldButtons(containerID);
    for (var _i = 0, idPool_1 = idPool; _i < idPool_1.length; _i++) {
        var id = idPool_1[_i];
        var btn_1 = new Button(id, getContentById(id), source);
        btn_1.event();
    };
};
/*
* Класс, который позволяет создавать кнопки с id и привязывать к ним HTML-элемент
* Метод возволяет просулшивать кнопку и создает запрос на сервер
*/
var Button = /** @class */ (function () {
    function Button(id, content, source) {
        this.id = id;
        this.content = content;
        this.source = source;
    };
    Button.prototype.getId = function () {
        return this.id;
    };
    Button.prototype.setId = function (id) {
        this.id = id;
    };
    Button.prototype.getContent = function () {
        return this.content;
    };
    Button.prototype.setContent = function (content) {
        this.content = content;
    };
    Button.prototype.getSource = function () {
        return this.source;
    }
    Button.prototype.setSource = function (source) {
        this.source = source;
    }
    Button.prototype.event = function () {
        var _this = this;
        var btn = createHTMLButton(this.id, this.content);
        btn === null || btn === void 0 ? void 0 : btn.addEventListener('click', function () {

            if (_this.source === "bot") {
                addMessage(_this.content, 'user');
                if (chatDiv) {
                    chatDiv.scroll({
                        top: 999999,
                        behavior: 'smooth'
                    });
                }
            }
            
            let msg = {
                type: "",
                buttonId: "",
                source: ""
            }

            msg.type = "message";
            msg.buttonId = _this.id;
            msg.source = _this.source;

            //console.log(msg);

            connection.send(JSON.stringify(msg));
        });
    };
    return Button;
}());

const util = {
    getToken: (async () => {
        let info = await axios.get("http://localhost:3000/chatToken");
        token = info.data;
        console.log(token);
    })
};

//get-запрос для получения токена (не работает)
connection.onopen = function(event) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
    //util.getToken();
    console.log("connected");
    let welcomeMsgBot = {
        type: "welcome",
        source: "bot"
    }
    connection.send(JSON.stringify(welcomeMsgBot));
    let welcomeMsgFAQ = {
        type: "welcome",
        source: "faq"
    }
    console.log(welcomeMsgFAQ);
    connection.send(JSON.stringify(welcomeMsgFAQ));
};
/*
* Слушатель сообщений от сервера
* В случае совпадения токена выводит сообщение и обновляет кнопки
* (Работоспособность неизвестна)
*/
connection.onmessage = function (income) {

    let message = JSON.parse(income.data);

    console.log(message);

    if (message.source === "bot") {
        if (message.msgType === "welcome"){
            addMessage(message.message, 'bot');
        } else if (message.msgType === "changeButtons") {
            var idPool = [];
            for (var i = 0; i < message.idPool.length; i++) {
                idPool[i] = message.idPool[i];
            };
            addMessage(message.message, 'bot');
            updateButtons(idPool, buttonsDiv, 'bot');
        } else if (message.msgType === "showUrls"){
            addMessage(message.message, "bot");
            addUrl(message.urlPool);
            var idPool = [];
            for (var i = 0; i < message.idPool.length; i++) {
                idPool[i] = message.idPool[i];
            };
            updateButtons(idPool, buttonsDiv, 'bot');
        } else if (message.msgType === "return"){
            // TODO: напиши меня!!!! UPDATE: в принципе можно и не писать 
        }  
        if (chatDiv) {
            chatDiv.scroll({
                top: 999999,
                behavior: 'smooth'
            });
        } 
    } else if (message.source === "faq") {
        if (message.msgType === "welcome") {

        } else if (message.msgType === "changeButtons") {

        } else if (message.msgType === "showUrls") {

        } else if (message.msgType === "return") {
            // TODO: напиши меня тоже!!!!   UPDATE: тут в принципе тоже 
        }
    }
    
    
    
};
var btn = new Button('iAmRegistered', getContentById('iAmRegistered'), "bot"); //TODO: не забудь прописать меня в айдишниках
btn.event();

},{"ws":2}],2:[function(require,module,exports){
'use strict';

module.exports = function () {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};

},{}]},{},[1]);

},{"ws":2}],2:[function(require,module,exports){
'use strict';

module.exports = function () {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};

},{}]},{},[1]);
