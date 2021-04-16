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
let type:string;

test.use(cors());

const server = http.createServer(test);

server.listen(3000, () => console.log("Server started!"));

test.get('/chatToken', function(req, res) {
    var json = JSON.stringify({type: 'chatToken', data: uuid()});
    res.send(json);
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

        switch (data.buttonId) {
            case 'siteNavigation' : {
                idPool= ["1", "2", "3", "4", "5", "6"];
                type = "changeButtons";
                util.createResponse(idPool, type, data.token);
            }

            case 'faq' : {

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
        createResponse: (idPool:string[], type: string, connectionToken: string) => {
            let response = {
                msgType: type,
                data: [],
                token: connectionToken
            }
            for (const id of idPool) {
                response.data.push(id);
            }
        
            socket.send(response);
            }
    };


    

})
