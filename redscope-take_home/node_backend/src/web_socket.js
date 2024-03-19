import { WebSocketServer } from 'ws';
import fs from 'fs-extra';
import { dataFolderName } from './constants.js'
import path from "path";


const startWebSocketServer = () => {
  const wss = new WebSocketServer({ port: 3008 });
  wss.on('connection', (ws) => {
    console.log('WebSocket connection established.');

    // Handle incoming messages
    ws.on('message', (message) => {
      const payload = JSON.parse(message.toString());
      processPayload(payload);
    });
  });
};


let lastUrl = null;
let urlIdMap = {};
let idCounter = 1;

const processPayload = (payload) => {
  const { type, url, data, id} = payload;
  console.log("*".repeat(80));
  console.log({ type, url, payload, id});
  console.log("*".repeat(80));

  if (type !== 'rrweb events') {
    return;
  }
  const jsonData = JSON.parse(data);

  let dataFilePath;

  if (url in urlIdMap) { // URL exists in records
    const id = urlIdMap[url];
    dataFilePath = path.join(dataFolderName, id.toString());
    fs.writeJsonSync(dataFilePath, jsonData, { flag: 'a' });
  } else { // URL is new or not present in records
    const id = idCounter++;
    urlIdMap[url] = id;
    dataFilePath = path.join(dataFolderName, id.toString());
    fs.writeJsonSync(dataFilePath, jsonData);
  }

  lastUrl = url;
};


export {
  startWebSocketServer,
};
