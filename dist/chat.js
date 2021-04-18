// CSS классы
const yourMessage = 'yourChatMessage';
const otherMessage = 'otherChatMessage';
// Уникальный идентификатор пользователя
const currentUser = 1;
// Стандартное имя пользователя
const userName = 'User';
// Импровезированное хранилище сообщений
let data = [
    {
        messageId: 1,
        userId: 1,
        userName,
        messageContent: 'test',
        sendTime: '2021-04-17T15:45:04.123123'
    },
    {
        messageId: 2,
        userId: 2,
        userName: 'Igor',
        messageContent: 'Lorem',
        sendTime: '2021-04-17T15:55:04.123123'
    },
    {
        messageId: 3,
        userId: 3,
        userName: 'kek',
        messageContent: 'test',
        sendTime: '2021-04-17T16:45:04.123123'
    },
    {
        messageId: 4,
        userId: 1,
        userName,
        messageContent: 'test',
        sendTime: '2021-04-17T17:45:04.123123',
        responseMessage: 'Lorem',
        responseUser: 'Igor'
    },
    {
        messageId: 3,
        userId: 3,
        userName: 'kek',
        messageContent: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique nostrum provident, rem repellendus sed ipsam necessitatibus tenetur odio eaque quibusdam nam laboriosam commodi expedita illum mollitia neque earum saepe modi.',
        sendTime: '2021-04-17T16:45:04.123123'
    }
];
// Определение, с какой стороны сообщение
function getMessageClass(userId) {
    return ((userId === currentUser) ? yourMessage : otherMessage);
}
// Создание сообщения из интерфейса
function createMessageFromInterface(value) {
    return createMessage(value.messageId, value.userId, value.userName, value.messageContent, value.sendTime, value.responseMessage, value.responseUser);
}
// Создание сообщения
function createMessage(messageId, userId, userName, messageContent, sendTime, responseMessage, responseUser) {
    let messageDiv = document.createElement('div');
    messageDiv.setAttribute('class', 'chatMessage ' + getMessageClass(userId));
    messageDiv.setAttribute('id', `${messageId}`);
    messageDiv.appendChild(createMessageHeader(userName, sendTime, messageContent));
    if (responseMessage && responseUser) {
        messageDiv.appendChild(createReplyMessage(responseMessage, responseUser));
    }
    messageDiv.appendChild(createMessageSpan(messageContent));
    return messageDiv;
}
// Задание содержимого сообщения
function createMessageSpan(messageContent) {
    let messageSpan = document.createElement('span');
    messageSpan.setAttribute('class', 'messageContent');
    messageSpan.innerText = messageContent;
    return messageSpan;
}
// Задание заголовка сообщения
function createMessageHeader(userName, sendTime, message) {
    let messageHeader = document.createElement('div');
    messageHeader.setAttribute('class', 'messageHeader');
    let userSpan = document.createElement('span');
    userSpan.setAttribute('class', 'userName');
    userSpan.innerText = userName;
    let timeSpan = document.createElement('span');
    timeSpan.setAttribute('class', 'messageTime');
    let time = new Date(sendTime);
    timeSpan.innerText = `${time.getHours()}:${time.getMinutes()}`;
    let button = document.createElement('button');
    button.setAttribute('class', 'btnAnswer');
    button.innerHTML = '&#11178';
    button.addEventListener("click", (ev) => {
        pinResponse(userName, message);
    });
    messageHeader.appendChild(userSpan);
    messageHeader.appendChild(timeSpan);
    messageHeader.appendChild(button);
    return messageHeader;
}
// Прикрепление сообщения
function pinResponse(userName, message) {
    deletePinnedResponse();
    let footer = document.getElementById('chatFooter');
    let responseDiv = document.createElement('div');
    responseDiv.setAttribute('id', 'underInputReplyChatMessage');
    responseDiv.setAttribute('class', 'replyChatMessage');
    let userSpan = document.createElement('span');
    userSpan.setAttribute('class', 'userName');
    userSpan.setAttribute('id', 'userReplyInput');
    userSpan.setAttribute('style', 'font-size: 10px;');
    userSpan.innerText = userName;
    let messageSpan = document.createElement('span');
    messageSpan.setAttribute('class', 'answerContent');
    messageSpan.setAttribute('id', 'messageReplyInput');
    messageSpan.innerText = message;
    let deleteBtn = document.createElement('span');
    deleteBtn.setAttribute('class', 'cancelreplyChatMessage');
    deleteBtn.innerHTML = '&#10006';
    deleteBtn.addEventListener('click', (ev) => {
        deletePinnedResponse();
    });
    responseDiv.appendChild(userSpan);
    responseDiv.appendChild(messageSpan);
    responseDiv.appendChild(deleteBtn);
    footer.prepend(responseDiv);
}
// Удаление прикрепленного сообщения
function deletePinnedResponse() {
    let div = document.getElementById("underInputReplyChatMessage");
    if (div) {
        div.remove();
    }
}
// Создание блока с ответным сообщением
function createReplyMessage(responseMessage, responseUser) {
    let replyMessage = document.createElement('div');
    replyMessage.setAttribute('class', 'replyChatMessage');
    let userSpan = document.createElement('span');
    userSpan.setAttribute('class', 'userName');
    userSpan.setAttribute('style', 'font-size: 10px;');
    userSpan.innerText = responseUser;
    let br = document.createElement('br');
    let answerSpan = document.createElement('span');
    answerSpan.setAttribute('class', 'answerContent');
    answerSpan.innerText = responseMessage;
    replyMessage.appendChild(userSpan);
    replyMessage.appendChild(br);
    replyMessage.appendChild(answerSpan);
    return replyMessage;
}
// Загрузка сообщений
function loadMessages() {
    const chatBody = document.getElementById('chatBody');
    data.forEach(value => chatBody.appendChild(createMessageFromInterface(value)));
    // let xhr:XMLHttpRequest = new XMLHttpRequest()
    // xhr.open('GET', '', true)
    // xhr.onreadystatechange = (ev:Event) => {
    //     messages:MessageJSON[] = (<MessageJSON[]>JSON.parse(xhr.responseText))
    //     let parsedObj = JSON.parse(xhr.responseText)
    // }
}
// Отправка сообщения
function sendMessage(userId, messageContent, responseMessage, responseUser) {
    // let xhr:XMLHttpRequest = new XMLHttpRequest()
    // xhr.open('POST', '', true)
    // xhr.onreadystatechange = (ev:Event) => {
    //     if(xhr.readyState == XMLHttpRequest.DONE){
    //         const chatBody:HTMLElement = document.getElementById('chatBody');
    //         let json = JSON.parse(xhr.responseText)
    //         let userName:string = json['userName']
    //         let sendTime:string = json['sendTime']
    //         let messageId:number = json['messageId']
    // chatBody.appendChild(createMessageFromInterface({ 
    //     messageId, 
    //     userId, 
    //     userName, 
    //     messageContent, 
    //     sendTime, 
    //     responseMessage, 
    //     responseUser
    //         }))
    //     }
    // }
    // xhr.send(JSON.stringify({ 
    //     userId,  
    //     messageContent,
    //     responseMessage, 
    //     responseUser
    // }))
    let chatBody = document.getElementById('chatBody');
    let message = {
        messageId: data[data.length - 1].messageId + 1,
        userId,
        userName,
        messageContent,
        sendTime: new Date().toISOString(),
        responseMessage,
        responseUser
    };
    data.push(message);
    chatBody.appendChild(createMessageFromInterface(message));
}
// Обработка нажатия кнопки
function clickSendMessage() {
    let input = document.getElementById('chatInputMessage');
    let responseMessage = document.getElementById("messageReplyInput");
    let responseUser = document.getElementById("userReplyInput");
    if (input.value) {
        sendMessage(currentUser, input.value, responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.innerText, responseUser === null || responseUser === void 0 ? void 0 : responseUser.innerText);
        deletePinnedResponse();
        input.value = '';
    }
}
// Очистить чат
function clearChatMessages() {
    document.getElementById("chatBody").innerHTML = "";
}
