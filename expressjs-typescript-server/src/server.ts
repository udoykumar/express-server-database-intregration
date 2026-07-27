import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 5000;
// middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_tv7ylGEc0VmP@ep-icy-water-av9877d9-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

app.get("/", (req: Request, res: Response) => {
  // res.send("Hello World!!!!");

  res.status(200).json({
    message: "hello world!!",
    author: "next level",
  });
});

app.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  res.status(201).json({
    message: "created post request",
    data: { name, email },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
