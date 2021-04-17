//Подключение контейнера для сообщений
const chatDiv: HTMLElement | null = document.getElementById('chat');
//Подключение контейнера для кнопок
const buttonsDiv: HTMLElement | null = document.getElementById('buttonContainer');
//Переменная, хранящая токен пользователя
let token: any;
//Создание вебсокета
let connection: WebSocket = new WebSocket('ws://localhost:3000');

/*
* Метод, который делает время удобным для восприятия пользователем
* Добавляет перед числом ноль, если оно меньше десяти
* Принимает число
* Возвращает строку
*/
function makeGoodTime(int:number):string{
    if(int < 10){
        return `0${int}`;
    }
    else{
        return `${int}`;
    };
};
/*
* Метод добавляющий новое сообщение в контейнер chatDiv
* Принимает сообщение и его автора user/bot
*/
function addMessage(message: string, author: string):void{
    const newDiv: HTMLElement | null = document.createElement('div');
    const date: Date = new Date();
    if(author === "user"){
        newDiv.setAttribute("class", "container userMessage");
        newDiv.innerHTML = `<span id="Time">${makeGoodTime(date.getHours())}:${makeGoodTime(date.getMinutes())}</span><br>${message}`;
    }
    else if(author === "bot"){
        newDiv.setAttribute("class", "container botMessage");
        newDiv.innerHTML = `<span id="Time">${makeGoodTime(date.getHours())}:${makeGoodTime(date.getMinutes())}</span><br>${message}`;
    };
    if(chatDiv){
        chatDiv.appendChild(newDiv);
    };
};
/*
* Метод, создаюший HTML-кнопку в контейнере buttonDiv
* Принимает id и содержание кнопки
* Возвращает созданный HTML-элемент
*/
function createHTMLButton(id: string, content: string):HTMLElement | null {
    const newDiv: HTMLElement | null = document.createElement('button');
    newDiv.setAttribute("id", id);
    newDiv.setAttribute("class", 'container button');
    newDiv.innerHTML = content;
    if(buttonsDiv){
        buttonsDiv.appendChild(newDiv);
    };
    return newDiv;
};
/*
* Метод, удаляющий старые кнопки
*/
function removeOldButtons():void{
    if(buttonsDiv){
        while(buttonsDiv.firstChild){
            buttonsDiv.removeChild(buttonsDiv.firstChild);
        };
    };
};
/*
* Метод, определяющий содержание кнопки по id
* Принимает id
* Возвращает содержание нужной кнопки
*/
function getContentById(id: string):string{
    switch(id) { 
        case 'siteNavigation': { 
           return 'Навигация по сайту';
        };
        case "faq": { 
            return 'Частые вопросы';
        };
        default: { 
           return 'Invalid button';             
        };
     };
};
/*
* Метод, обновляющий контейнер с кнопками
* Принимает id кнопок, которые необходимо создать
*/
function updateButtons(idPool: string[]): void{
    removeOldButtons();
    for (let id of idPool) {
        const btn: Button = new Button(id, getContentById(id));
        btn.event();
    };
};
/*
* Класс, который позволяет создавать кнопки с id и привязывать к ним HTML-элемент
* Метод возволяет просулшивать кнопку и создает запрос на сервер
*/
class Button{
    private id: string;
    private content: string;
    constructor(id: string, content: string){
        this.id = id;
        this.content = content;
    };
    getId():string{
        return this.id;
    };
    setId(id: string): void{
        this.id = id;
    };
    getContent(): string{
        return this.content;
    };
    setContent(content: string): void{
        this.content = content;
    };
    event():void{
        const btn: HTMLElement | null = createHTMLButton(this.id, this.content);
        btn?.addEventListener('click', () =>{
            addMessage(this.content, 'user');
            if(chatDiv){
                chatDiv.scroll({
                    top:999999,
                    behavior: 'smooth'
                });
            }
            let jsonSend = JSON.stringify({'chatToken': token, 'buttonId':this.id});
            connection.send(jsonSend);
        });
    };
};

//get-запрос для получения токена (не работает)
connection.onopen = function(event) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
};
/*
* Слушатель сообщений от сервера
* В случае совпадения токена выводит сообщение и обновляет кнопки
* (Работоспособность неизвестна)
*/
connection.onmessage = function(message: any){
    let jsonGet = JSON.parse(message);
    if(message.chatToken === token){
        let idPool: string[] = [];
        for(let i: number = 0; i < message.idPool.length; i++){
            idPool[i] = message.idPool[i];
        };
        addMessage(message.type, 'bot');
        if(chatDiv){
            chatDiv.scroll({
                top:999999,
                behavior: 'smooth'
            });
        }
        updateButtons(idPool);
    };
};

const btn: Button = new Button('siteNavigation', getContentById('siteNavigation'));
btn.event();