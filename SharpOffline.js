const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const fs = require("fs");
const Menu = require("electron").Menu;
const MenuItem = require("electron").MenuItem;

let mainWindow;
var pluginName;
switch(process.platform){
	case "win32":
		pluginName = "pepflashplayer.dll";
		break;
	case "darwin":
		pluginName = "PepperFlashPlayer.plugin";
		break;
	case "linux":
		pluginName = "libpepflashplayer.so";
		break;
}
app.commandLine.appendSwitch("ppapi-flash-path", path.join(__dirname, pluginName));

function createWindow(){
	mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {plugins: true}});
	mainWindow.loadURL(`file://${__dirname}/SharpUpdate.html`);
	mainWindow.on("closed", function(){
		mainWindow = null;
	});
}

//Change prompt to execute in render process
var template = [
{
	label: "About",
	submenu: [
	{
		label: "Tool Menu",
		click: function(item, focusedWindow){
			if(focusedWindow) focusedWindow.loadURL(`file://${__dirname}/SharpToolMenu.html`);
		}
	},
	{
		label: "About Version",
		click: function(item, focusedWindow){
			if(focusedWindow) focusedWindow.loadURL(`file://${__dirname}/SharpAbout.html`);
		}
	}
	]
},
{
	label: "Developer Tools",
	submenu: [
	{
		label: "Toggle Developer Tools",
		click: function(item, focusedWindow){
			if(focusedWindow) focusedWindow.webContents.toggleDevTools();
		}
	},
	{
		label: "Refresh Page (Loses project!)",
		click: function(item, focusedWindow){
			if(focusedWindow) focusedWindow.webContents.executeJavaScript("window.location.reload();");
		}
	},
	{
		label: "Visit URL (Loses project!)",
		click: function(item, focusedWindow){
			if(focusedWindow) focusedWindow.loadURL(`file://${__dirname}/SharpBrowser.html`);
		}
	},
	{
		label: "Open Sharp Browser",
		click: function(item, focusedWindow){
			if(focusedWindow) focusedWindow.webContents.executeJavaScript("window.open('SharpBrowser.html', '')");
		}
	}
	]
},
{
	label: "Help",
	submenu: [
	{
		label: "Bugs and Support",
		click: function(item, focusedWindow){
			if(focusedWindow) focusedWindow.webContents.executeJavaScript("window.open('https://github.com/SharpScratchMod/SharpOfflineMacLinux/issues', '');");
		}
	},
	{
		label: "Troubleshoot",
		click: function(item, focusedWindow){
			if(focusedWindow) focusedWindow.webContents.executeJavaScript("window.open('https://github.com/SharpScratchMod/SharpOfflineMacLinux/wiki/Troubleshoot', '');");
		}
	}
	]
}
];
var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.on("ready", createWindow);
app.on("window-all-closed", function(){
	if(process.platform !== "darwin"){
		app.quit();
	}
});
app.on("activate", function(){
	if(mainWindow === null){
		createWindow();
	}
});