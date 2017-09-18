const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(`file://${__dirname}/main.html`);

    mainWindow.on('closed', () => { app.quit(); });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);


});

function createAddWindow() {
    if (!addWindow) {
        addWindow = new BrowserWindow({
            width: 300,
            height: 200,
            title: 'Add New Todo'
        });
    
        addWindow.loadURL(`file://${__dirname}/add.html`);

        addWindow.on('closed', () => { addWindow = null; });
    }

    addWindow.focus();
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
});

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Tasks',
                click() {
                    createAddWindow();
                }
            },
            { 
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+W',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    // 'production'
    // 'development'
    // 'staging'
    // 'test'
    menuTemplate.push({
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
            label: 'Developer Tools',
            accelerator: 'Ctrl+Shift+I',
            click(item, focusedWindow) { focusedWindow.toggleDevTools(); }
            }
        ]
    });
}