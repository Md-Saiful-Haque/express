import express, { json, type Application, type Request, type Response } from "express"
import config from "./config";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";

const app: Application = express()
// const port = config.port;

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req: Request, res: Response) => {
  // res.send('Hello World!')
  res.status(200).json({
    message: "Express Server",
    "author": "Saiful"
  })
})

app.use("/api/users", userRoute)
app.use("/api/profiles", profileRoute)


export default app
