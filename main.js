const express = require("express")
const appService = require("./app.service")

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get("/users", async (req, res) => {
    const users = await appService.getAllFromCollection()
    res.json(users)
})

app.post("/users", async (req, res) => {
    try {
        const {name, age, gender, address} = req.body
        if (!name || name.length < 2) {
            throw new Error("Incorrect name")
        }
        if (!age || age < 18 || age > 100) {
            throw new Error("Incorrect age")
        }
        if (!gender || gender !== 'female' && gender !== 'male') {
            throw new Error("Incorrect gender")
        }
        if (!address) {
            throw new Error("Incorrect address")
        }
        const users = await appService.getAllFromCollection()

        const lastId = users[users.length - 1].id
        const newUser = {id: lastId + 1, name, age, gender, address}

        users.push(newUser)
        await appService.saveToCollection(users)

        res.status(201).json(newUser)
    } catch (e) {
        res.status(404).json(e.message)

    }
})

app.get("/users/:userId", async (req, res) => {
    try {
        const {userId} = req.params
        const users = await appService.getAllFromCollection()
        const user = users.find(user => user.id === Number(userId))
        if (!user) {
            throw new Error("User not found!")
        }
        res.json(user)
    } catch (e) {
        res.status(404).json(e.message)
    }
})

app.put("/users/:userId", async (req, res) => {
    try {
        const {userId} = req.params;
        const {name, age, gender, address} = req.body

        if (!name || name.length < 2) {
            throw new Error("Incorrect name")
        }
        if (!age || age < 18 || age > 100) {
            throw new Error("Incorrect age")
        }
        if(gender || address){
            throw new Error("Yo can not change 'gender' or 'address'")
        }


        const users = await appService.getAllFromCollection();
        const user = users.find(user => user.id === Number(userId))
        if (!user) {
            throw new Error("User not found!")
        }

        const updatedUser = {...user, name, age}
        const indexOfUser = users.findIndex(user => user.id === Number(userId))
        users.splice(indexOfUser, 1, updatedUser)

        await appService.saveToCollection(users)

        res.status(200).json(updatedUser)
    } catch (e) {
        res.status(404).json(e.message)
    }
})

app.delete("/users/:userId", async (req, res) => {
    try {
        const {userId} = req.params
        const users = await appService.getAllFromCollection()
        const user = users.find(user => user.id === Number(userId))
        if (!user) {
            throw new Error("User not found!")
        }
        const indexOfUser = users.findIndex(user => user.id === Number(userId))
        users.splice(indexOfUser, 1)

        await appService.saveToCollection(users)
        res.sendStatus(204)
    } catch (e) {
        res.status(404).json(e.message)
    }
})


const PORT = 5001
app.listen(PORT, () => {
    console.log(`App started on PORT - ${PORT}`)
})
