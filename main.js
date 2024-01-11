
const fs = require('node:fs/promises')
const path = require('node:path')

function fileOrFolderNameCreator(count, nameOfFileOrFolder, typeOfFile) {
    const namesArr = []
    for (let i = 1; i <= count; i++) {
        if (typeOfFile) {
            namesArr.push(nameOfFileOrFolder + i + "." + typeOfFile)
        } else {
            namesArr.push(nameOfFileOrFolder + i)
        }
    }
    return namesArr

}

async function makeDirectory(mainFolderName, count, fileName, folderName, typeOfFile) {
    const fileNameArr = fileOrFolderNameCreator(count,fileName,typeOfFile)
    const folderNameArr = fileOrFolderNameCreator(count, folderName)

    console.log(fileNameArr, folderNameArr)

    try {
        const mainFolder = path.join(__dirname, mainFolderName);
        const dirCreation = await fs.mkdir(mainFolder, {recursive: true});

        fileNameArr.map(async (fileName, index) => {
            const data = new Uint8Array(Buffer.from(`Text in file ${index + 1}`));
            await fs.writeFile(path.join(mainFolder, fileName), data)

        })

        folderNameArr.map(async (folderName) => {
            await fs.mkdir(path.join(mainFolder, folderName), {recursive: true})
        })

        const pathArr = await fs.readdir(mainFolder)
        console.log(pathArr)

        pathArr.map(async (element, index) => {
            const status = await fs.stat(path.join(mainFolder, element))
            console.log(status.isFile() ? `${index + 1} - FILE:` : `${index + 1} - FOLDER:`, element)
        })

    } catch (e) {
        throw new Error(e.message)
    }
}

makeDirectory( "mainFolder",6, "file", "subFolder", "txt").then()
makeDirectory( "newFolder",4, "element", "elementFolder", "txt").then()
