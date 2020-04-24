const electron = require("electron");
const { v4 : uuidv4 } = require('uuid');
uuidv4();

const {
    app, 
    BrowserWindow, 
    Menu, 
    ipcMain
} = electron;

let todayWindow;
let inputWindow;
let aboutWindow;

let allAppointment = [];

app.on("ready", () => {
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }, 
        title : "KASIR"
    });

    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("closed", () => {

        app.quit();
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

const inputWindowCreator = () => {
    inputWindow = new BrowserWindow ({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Input"
    });


    inputWindow.setMenu(null);
    inputWindow.loadURL(`file://${__dirname}/input.html`);
    inputWindow.on("closed", ()  => (inputWindow = null));
};

const aboutWindowCreator = () => {
    aboutWindow = new BrowserWindow ({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "About"
    });

    aboutWindow.setMenu(null);
    aboutWindow.loadURL(`file://${__dirname}/about.html`);
    aboutWindow.on("closed", ()  => (aboutWindow = null));
};



ipcMain.on("appointment:history", (event, appointment) => {
    appointment["id"] = uuidv4();
    appointment["done"] = 0;
    allAppointment.push(appointment);

    historyWindow.close();

    console.log(allAppointment);
});

ipcMain.on("appointment:request:history", event => {
    historyWindow.webContents.send('appointment:response:history', allAppointment);
});

ipcMain.on("appointment:request:today", event => {
    console.log("here2");
});

ipcMain.on("appointment:done", (event, id) => {
    console.log("here3");
});

const menuTemplate =  [{
        label: "MENU",
        submenu:[{
                label: "Input",

                click() {
                    inputWindowCreator()
                }
            },
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl + Q",
                click() {
                    app.quit();
                }
            }
        ]
    },
    ,
    {

        label: "VIEW",
        submenu: [{ role: "reload" }, { role: "toggledevtools" }]
    }
    ,
    {

        label: "ABOUT",
        click(){
            aboutWindowCreator();
}
    }
   


]