/* eslint-disable import/no-extraneous-dependencies */
import { remote, shell } from 'electron';
import bus from './event';

const template = [
  {
    label: 'Items',
    submenu: [
      {
        label: 'Add New',
        accelerator: 'CmdOrCtrl+N',
        click() { bus.$emit('newItem'); }
      },
      {
        label: 'Read Item',
        accelerator: 'CmdOrCtrl+Enter',
        click() { bus.$emit('readItem'); }
      },
      {
        label: 'Delete Item',
        accelerator: 'CmdOrCtrl+Backspace',
        click() { window.deleteItem(-1); }
      },
      {
        label: 'Open in Browser',
        accelerator: 'CmdOrCtrl+Shift+Enter',
        click() { bus.$emit('openInBrowser'); }
      },
      { type: 'separator' },
      {
        label: 'Search Items',
        accelerator: 'CmdOrCtrl+S',
        click() { bus.$emit('search'); }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() { shell.openExternal('https://electronjs.org'); }
      }
    ]
  }
];

// Mac specific
if (process.platform === 'darwin') {
  template.unshift({
    label: remote.app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      {
        role: 'services',
        submenu: []
      },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  });

  // Mac extra window options
  template[3].submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  ];
}

const menu = remote.Menu.buildFromTemplate(template);
remote.Menu.setApplicationMenu(menu);
