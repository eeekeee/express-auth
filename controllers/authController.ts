import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  res.json({
    message: "signup controller",
  });
};

export const login = async (req: Request, res: Response) => {
  res.json({
    message: "login controller",
  });
};

export const logout = async (req: Request, res: Response) => {
  res.json({
    message: "logout controller",
  });
};
