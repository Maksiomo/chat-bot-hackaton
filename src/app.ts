const chatDiv: HTMLElement | null = document.getElementById('chat')!;
const buttonsDiv: HTMLElement | null = document.getElementById('buttonContainer')!;

function makeGoodTime(int:number):string{
    if(int < 10){
        return '0'+int;
    }
    else{
        return '' + int;
    }
}

function addMessage(message: string, isUser: boolean):void{
    const newDiv: HTMLElement | null = document.createElement('div');
    const date: Date = new Date;
    if(isUser){
        newDiv.setAttribute("class", "container userMessage");
        newDiv.innerHTML = `<span id="Time">Вы ${makeGoodTime(date.getHours())}:${makeGoodTime(date.getMinutes())}</span><br><p>${message}</p>`;
    }
    else{
        newDiv.setAttribute("class", "container botMessage");
        newDiv.innerHTML = `<span id="Time">Бот ${makeGoodTime(date.getHours())}:${makeGoodTime(date.getMinutes())}</span><br><p>${message}</p>`;
    }
    if(chatDiv){
        chatDiv.appendChild(newDiv);
    }
}

function createHTMLButton(id: string, content: string):HTMLElement | null {
    const newDiv: HTMLElement | null = document.createElement('button');
    newDiv.setAttribute("id", id);
    newDiv.setAttribute("class", 'container button');
    newDiv.innerHTML = content;
    if(buttonsDiv){
        buttonsDiv.appendChild(newDiv);
    }
    return newDiv;
}

function removeOldButtons():void{
    if(buttonsDiv){
        while(buttonsDiv.firstChild){
            buttonsDiv.removeChild(buttonsDiv.firstChild);
        }
    }
}

function getContentById(id: string):string{
    switch(id) { 
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

function updateButtons(ids: string[]): void{
    removeOldButtons();
    for (let id of ids) {
        const btn: Button = new Button(id, getContentById(id));
        btn.event();
    }
}

class Button{
    private id: string;
    private content: string;
    constructor(id: string, content: string){
        this.id = id;
        this.content = content;
    }
    getId():string{
        return this.id;
    }
    setId(id: string): void{
        this.id = id;
    }
    getContent(): string{
        return this.content;
    }
    setContent(content: string): void{
        this.content = content;
    }
    event():void{
        const btn: HTMLElement | null = createHTMLButton(this.id, this.content);
        btn?.addEventListener('click', () =>{
            addMessage(this.content, true);
            addMessage('Responce', true);
            if(chatDiv){
                chatDiv.scroll({
                    top:999999,
                    behavior: 'smooth'
                });
            }
            const sa: string[] = ['FAQ', 'lk'];
            updateButtons(sa);
        });
    }
};

const btn: Button = new Button('start', 'старт');
btn.event();