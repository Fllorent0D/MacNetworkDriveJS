"use strict"
const exec = require('child-process-promise').exec
const MAX_BUFFER_SIZE = 2000 * 1024;
const applescript = require("applescript")
const macNetworkDrive = {

  list: function list() {

    let fetchDisks = exec("/bin/df", {
      maxBuffer: MAX_BUFFER_SIZE
    });

    let completePromise = new Promise((resolve, reject) => {
      fetchDisks.then(result => {
        if (typeof result.stderr === "string" && result.stderr.length !== 0) {
          reject(stderr)
        }

        let pathList = result.stdout.split(/\s*[\n\r]+/g);
        let drivePath = {}

        pathList.splice(0, 1)
        let regex = /^\/\/\S*@(\S*)\s*\S*\s*\S*\s*\S*\s*\S*\s*\S*\s*\S*\s*\S*\s*(\S*)$/
        let re = new RegExp(regex, 'i')

        for (let line of pathList) {
          let matches = line.match(re);
          if (matches) {
            drivePath["\\\\" + matches[1].replace('/', '\\') + "\\"] = matches[2];
          }
        }
        resolve(drivePath)
      }).catch(err => {

        reject(err)

      })

    })
    return completePromise;
  },
  find: function find(drivePath) {
    let completePromise = new Promise((resolve, reject) => {

      if ("string" !== typeof drivePath || 0 === drivePath.length) {
        reject("Invalid path");
      }

      macNetworkDrive.list().then(networkDrives => {
        for (let currentDrivePath in networkDrives) {
          if (!networkDrives.hasOwnProperty(currentDrivePath)) {
            continue;
          }

          if (drivePath.charAt(drivePath.length - 1) != "\\")
            drivePath += "\\"

          if (currentDrivePath.toUpperCase() === drivePath.toUpperCase()) {
            resolve(networkDrives[currentDrivePath]);
          }
        }
        resolve(undefined);
      })

    })
    return completePromise;

  },
  mount: function mount(drivePath, localPath = null, username = null, password = null) {
    /* parametetr localPath is unused -> allow to have the same signature */
    let completePromise = new Promise((resolve, reject) => {

      let test = macNetworkDrive.find(drivePath).then(result => {
        if (result !== undefined) {
          resolve(result)
        } else {
          let connectPath = ""
          let serverPath = drivePath

          if (username != null && password != null) {
            username = username.replace("\\", "\\\\")
            connectPath = `${username}:${password}@`
          }

          serverPath = serverPath.replace("\\\\", "")
          serverPath = serverPath.replace("\\", "/")

          let pathDrive = `smb://${connectPath}${serverPath}`
          let mountScript = `
            tell application "Finder"
            with timeout of 2 seconds
              try
                mount volume "${pathDrive}"
              end try
              end timeout
            end tell`

          applescript.execString(mountScript, (err, result) => {
            if (err || result === undefined) {
              if (err === undefined)
                reject("Unable to connect")

              reject(err)
            }
            macNetworkDrive.find(drivePath).then(result => {
              resolve(result)
            })
          })
        }
      })
    })
    return completePromise;
  },
  unmount: function unmount() {

  }
}
exports.list = macNetworkDrive.list
exports.find = macNetworkDrive.find
exports.mount = macNetworkDrive.mount
exports.unmount = macNetworkDrive.unmount
