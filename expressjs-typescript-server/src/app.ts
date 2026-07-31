import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
const app: Application = express();
// middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  // res.send("Hello World!!!!");

  res.status(200).json({
    message: "hello world!!",
    author: "next level",
  });
});

app.post("/api/users", async (req: Request, res: Response) => {
  // console.log(req.body);
  const { name, email, password, age } = req.body;

  const result = await pool.query(
    `
    INSERT INTO users(name, email,password, age) VALUES($1,$2,$3,$4)
    RETURNING *
    `,
    [name, email, password, age],
  );
  // console.log("result", result);
  res.status(201).json({
    message: "created post request",
    data: result.rows[0],
  });
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
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
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id = $1
      `,
      [id],
    );
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
    console.log(result.rows);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Users not found",
      error: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;
  // console.log(id);
  // console.log({ name, password, age, is_active });
  try {
    const result = await pool.query(
      `
    UPDATE users SET name=COALESCE($1,name),password=COALESCE($2,password),age=COALESCE($3,age),is_active=COALESCE($4,is_active) WHERE id=$5 RETURNING *
    `,
      [name, password, age, is_active, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Users not found",
      error: error,
    });
  }
});
app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM users WHERE id=$1
      `,
      [id],
    );
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
});
export default app;
