const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {
  Menu,
  globalShortcut
} = require('electron');
const fs = require('fs');

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500
  })
  // ,frame: false})
  mainWindow.loadURL(`file://${__dirname}/app/index.html`)

  //   mainWindow.webContents.openDevTools();

  //   mainWindow.setResizable(false)

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  var template = [{},
    {
      label: 'Open',
      submenu: [{
          label: 'Select Folder',
          accelerator: 'CommandOrControl+O',
          click: function () {
            openFolderDialog();
          }
        },
        /* {
           label:'Song Control',
           submenu:[
             {
               label:'Pause',
               accelerator:'CommandOrControl+E',
               click:function(){
                 sendPauseSongMessage();
               }
             },
             {
               label:'Next',
               accelerator:'CommandOrControl+N',
               click:function(){
                 sendNextSongMessage();
               }
             },
             {
               label:'Previous',
               accelerator:'CommandOrControl+P',
               click:function(){
                 sendNextSongMessage();
               }
             }
           ]
         }*/
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);

  // globalShortcut.register('CommandOrControl+P', function(){
  //   openFolderDialog();
  // });
});


function openFolderDialog() {
  var dialog = electron.dialog;

  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  }, function (filePath) {
    if (filePath) {
      fs.readdir(filePath[0], function (err, files) {
        var arr = [];
        for (var i = 0; i < files.length; i++) {
          if (files[i].substr(-4) === ".mp3") {
            arr.push(files[i]);
          }
        }
        // console.log(arr);
        var objToSend = {};
        objToSend.path = filePath[0];
        objToSend.files = arr;
        // console.log('objToSend',objToSend);
        mainWindow.webContents.send('modal-folder-content', objToSend);
      })
    } else {
      //   mainWindow.webContents.send('modal-error');
    }
  })
}