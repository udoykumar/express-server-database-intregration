import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  // console.log(req.body);
  //   const { name, email, password, age } = req.body;
  const result = await userService.createUserIntoDB(req.body);
  // console.log("result", result);
  res.status(201).json({
    message: "created post request",
    data: result.rows,
  });
};

const getAllUser = async (req: Request, res: Response) => {
  console.log(req.user);
  try {
    const result = await userService.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Users not found",
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id as string);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Users not found",
      error: error,
    });
  }
};

const getUpdateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  // console.log({ name, password, age, is_active });
  try {
    const result = await userService.updateUserFromDB(req.body, id as string);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Users not found",
      error: error,
    });
  }
};

const getDeleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteUserFromDB(id as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Users not found",
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  getUpdateUser,
  getDeleteUser,
};
