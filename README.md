# mac-network-drive

Port on Mac of [windows-network-drive](https://github.com/larrybahr/windows-network-drive) package.

## Installation

```
npm install mac-network-drive
```

## Usage

All examples assume:

```javascript
let networkDrive = require('mac-network-drive');
```

### find

find(drivePath: string): Promise<string | undefined>

#### Examples

```javascript
 networkDrive.find("\\DoesExist\Path")
 .then(function (path)
 {
	 // path === "/Volumes/"
 });

 networkDrive.find("\\\\DoesNOTExist\Path")
 .then(function (path)
 {
	 // path === undefined
 });
```
### list

list(void): Promise<Object>

#### Examples

```javascript
 networkDrive.list()
 .then(function (drives)
 {
	 /*
		drives = {
			"/Volumes/...":"\\DoesExist\Path\Files",
			"/Volumes/...":"\\NETWORKB\\DRIVE C"
		}
	*/
 });
 ```

### mount

mount(drivePath: string, undefined, username?: string, password?: string): Promise<string>

The second param is useless. I kept it to have the same amount of parameters that the windows package.

#### Examples

```javascript
 networkDrive.mount("\\\\DoesExist\\Path\\Files", undefined, undefined, undefined)
 .then(function (path)
 {
	 // path = "/Volumes/xxx"
 });
```

### unmount

Not implemented yet

## Tests

```
npm test
```

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Format code with VS Code. Add unit tests for any new or changed functionality. Lint and test your code.