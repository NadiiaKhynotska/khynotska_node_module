const fs = require("node:fs/promises")
const path = require("path")

const collectionPath = path.join(process.cwd(),"colection.json")

const getAllFromCollection = async () =>{
    const json = await fs.readFile(collectionPath, {encoding: "utf-8"})
    return JSON.parse(json)
}

const saveToCollection = async (data) =>{
    await fs.writeFile(collectionPath, JSON.stringify(data))
}


module.exports = {
    getAllFromCollection,
    saveToCollection
}
