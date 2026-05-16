import { pool } from "../../db";
import type { IUser } from "./user.interface";


const createUserIntoDB = async (payload: IUser) => {
    // console.log(req.body);
    const { name, email, password, age } = payload;

    const result = await pool.query(`
    INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *
    `, [name, email, password, age])
    // console.log(result);

    return result
}

export const userService = {
    createUserIntoDB
}