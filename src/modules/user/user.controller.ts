import type { Request, Response } from "express";
// import { pool } from "../../db";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body)
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
}

const getAlluser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB()
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
}

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id as string)
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
}

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.updateUserFromDB(req.body, id as string)

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
}

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id as string)

    // console.log(result);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

export const userController = {
    createUser,
    getAlluser,
    getSingleUser,
    updateUser,
    deleteUser
}