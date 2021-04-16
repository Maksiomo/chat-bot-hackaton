"use strict";
var chatDiv = document.getElementById('chat');
var buttonsDiv = document.getElementById('buttonContainer');
function makeGoodTime(int) {
    if (int < 10) {
        return '0' + int;
    }
    else {
        return '' + int;
    }
}
function addMessage(message, isUser) {
    var newDiv = document.createElement('div');
    var date = new Date;
    if (isUser) {
        newDiv.setAttribute("class", "container userMessage");
        newDiv.innerHTML = "<span id=\"Time\">\u0412\u044B " + makeGoodTime(date.getHours()) + ":" + makeGoodTime(date.getMinutes()) + "</span><br><p>" + message + "</p>";
    }
    else {
        newDiv.setAttribute("class", "container botMessage");
        newDiv.innerHTML = "<span id=\"Time\">\u0411\u043E\u0442 " + makeGoodTime(date.getHours()) + ":" + makeGoodTime(date.getMinutes()) + "</span><br><p>" + message + "</p>";
    }
    if (chatDiv) {
        chatDiv.appendChild(newDiv);
    }
}
function createHTMLButton(id, content) {
    var newDiv = document.createElement('button');
    newDiv.setAttribute("id", id);
    newDiv.setAttribute("class", 'container button');
    newDiv.innerHTML = content;
    if (buttonsDiv) {
        buttonsDiv.appendChild(newDiv);
    }
    return newDiv;
}
function removeOldButtons() {
    if (buttonsDiv) {
        while (buttonsDiv.firstChild) {
            buttonsDiv.removeChild(buttonsDiv.firstChild);
        }
    }
}
function getContentById(id) {
    switch (id) {
        case "FAQ": {
            return 'FAQ';
        }
        case "SayHello": {
            return 'Привет';
        }
        case "lk": {
            return 'Личный кабинет';
        }
        default: {
            return 'Invalid button';
        }
    }
}
function updateButtons(ids) {
    removeOldButtons();
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var id = ids_1[_i];
        var btn_1 = new Button(id, getContentById(id));
        btn_1.event();
    }
}
var Button = /** @class */ (function () {
    function Button(id, content) {
        this.id = id;
        this.content = content;
    }
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
    Button.prototype.event = function () {
        var _this = this;
        var btn = createHTMLButton(this.id, this.content);
        btn === null || btn === void 0 ? void 0 : btn.addEventListener('click', function () {
            addMessage(_this.content, true);
            addMessage('Responce', false);
            if (chatDiv) {
                chatDiv.scroll({
                    top: 999999,
                    behavior: 'smooth'
                });
            }
            var sa = ['FAQ', 'lk'];
            updateButtons(sa);
        });
    };
    return Button;
}());
;
var btn = new Button('start', 'старт');
btn.event();
//# sourceMappingURL=app.js.map