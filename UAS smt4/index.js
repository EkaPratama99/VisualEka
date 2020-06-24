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
let listWindow;

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

const listWindowCreator = () => {
    listWindow = new BrowserWindow ({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "History"
    });
    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed", ()  => (listWindow = null));
};

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



ipcMain.on("appointment:list", (event, appointment) => {
    appointment["id"] = uuidv4();
    appointment["done"] = 0;
    allAppointment.push(appointment);

    listWindow.close();

    console.log(allAppointment);
});

ipcMain.on("appointment:request:list", event => {
    listWindow.webContents.send('appointment:response:list', allAppointment);
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
                label: "History",
                click() {
                    listWindowCreator();
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