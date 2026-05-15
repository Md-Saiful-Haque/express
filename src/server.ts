import express, { json, type Application, type Request, type Response } from "express"
import { Pool } from "pg"

const app: Application = express()
const port = 3000

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_LAWV3So9yDHx@ep-crimson-frog-aq2txkhb-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_ative BOOLEAN DEFAULT true,
      age INT,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `)
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
}
initDB()

app.get('/', (req: Request, res: Response) => {
  // res.send('Hello World!')
  res.status(200).json({
    message: "Express Server",
    "author": "Saiful"
  })
})

app.post('/api/users', async (req: Request, res: Response) => {
  try {
    // console.log(req.body);
    const { name, email, password, age } = req.body;

    const result = await pool.query(`
    INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *
    `, [name, email, password, age])
    // console.log(result);

    res.status(201).json({
      message: "User Created Successfully",
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error
    })
  }
})

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `)
    res.status(200).json({
      success: true,
      message: "User Retrived Successfully",
      data: result.rows
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }
})

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM users WHERE id = $1
      `, [id])

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found!",
        data: {}
      })
    }

    res.status(200).json({
      success: true,
      message: "User Retrived Successfully",
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }
})

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_ative } = req.body;

  try {
    const result = await pool.query(`
      UPDATE users SET name = $1, password = $2, age = $3, is_ative = $4
       WHERE id =$5 RETURNING *
      `, [name, password, age, is_ative, id])

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found!"
      })
    }

    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
