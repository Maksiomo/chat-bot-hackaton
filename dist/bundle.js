(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var ws = require('ws');
//Подключение контейнера для сообщений
var chatDiv = document.getElementById('chat');
//Подключение контейнера для кнопок
var buttonsDiv = document.getElementById('buttonContainer');
//Переменная, хранящая токен пользователя
var token = "token";
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
    }
    ;
}
;
/*
* Метод добавляющий новое сообщение в контейнер chatDiv
* Принимает сообщение и его автора user/bot
*/
function addMessage(message, author) {
    var newDiv = document.createElement('div');
    var date = new Date();
    if (author === "user") {
        newDiv.setAttribute("class", "container userMessage");
        newDiv.innerHTML = "<span id=\"Time\">" + makeGoodTime(date.getHours()) + ":" + makeGoodTime(date.getMinutes()) + "</span><br>" + message;
    }
    else if (author === "bot") {
        newDiv.setAttribute("class", "container botMessage");
        newDiv.innerHTML = "<span id=\"Time\">" + makeGoodTime(date.getHours()) + ":" + makeGoodTime(date.getMinutes()) + "</span><br>" + message;
    }
    ;
    if (chatDiv) {
        chatDiv.appendChild(newDiv);
    }
    ;
}
;
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
    }
    ;
    return newDiv;
}
;
/*
* Метод, удаляющий старые кнопки
*/
function removeOldButtons() {
    if (buttonsDiv) {
        while (buttonsDiv.firstChild) {
            buttonsDiv.removeChild(buttonsDiv.firstChild);
        }
        ;
    }
    ;
}
;
/*
* Метод, определяющий содержание кнопки по id
* Принимает id
* Возвращает содержание нужной кнопки
*/
function getContentById(id) {
    switch (id) {
        case 'siteNavigation':
            {
                return 'Навигация по сайту';
            }
            ;
        case "faq":
            {
                return 'Частые вопросы';
            }
            ;
        default:
            {
                return 'Invalid button';
            }
            ;
    }
    ;
}
;
/*
* Метод, обновляющий контейнер с кнопками
* Принимает id кнопок, которые необходимо создать
*/
function updateButtons(idPool) {
    removeOldButtons();
    for (var _i = 0, idPool_1 = idPool; _i < idPool_1.length; _i++) {
        var id = idPool_1[_i];
        var btn_1 = new Button(id, getContentById(id));
        btn_1.event();
    }
    ;
}
;
/*
* Класс, который позволяет создавать кнопки с id и привязывать к ним HTML-элемент
* Метод возволяет просулшивать кнопку и создает запрос на сервер
*/
var Button = /** @class */ (function () {
    function Button(id, content) {
        this.id = id;
        this.content = content;
    }
    ;
    Button.prototype.getId = function () {
        return this.id;
    };
    ;
    Button.prototype.setId = function (id) {
        this.id = id;
    };
    ;
    Button.prototype.getContent = function () {
        return this.content;
    };
    ;
    Button.prototype.setContent = function (content) {
        this.content = content;
    };
    ;
    Button.prototype.event = function () {
        var _this = this;
        var btn = createHTMLButton(this.id, this.content);
        btn === null || btn === void 0 ? void 0 : btn.addEventListener('click', function () {
            addMessage(_this.content, 'user');
            if (chatDiv) {
                chatDiv.scroll({
                    top: 999999,
                    behavior: 'smooth'
                });
            }

            let msg = {
                chatToken: "",
                buttonId: ""
            }

            msg.chatToken = token;
            msg.buttonId = _this.id;

            connection.send(JSON.stringify(msg));
        });
    };
    ;
    return Button;
}());
;

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
    util.getToken();
    console.log("connected");
};
/*
* Слушатель сообщений от сервера
* В случае совпадения токена выводит сообщение и обновляет кнопки
* (Работоспособность неизвестна)
*/
connection.onmessage = function (message) {
    console.log('1');
    if (message.token === token) {
        var idPool = [];
        for (var i = 0; i < message.idPool.length; i++) {
            idPool[i] = message.idPool[i];
        }
        ;
        addMessage(message.message, 'bot');
        if (chatDiv) {
            chatDiv.scroll({
                top: 999999,
                behavior: 'smooth'
            });
        }
        updateButtons(idPool);
    }
    ;
};
var btn = new Button('siteNavigation', getContentById('siteNavigation'));
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
