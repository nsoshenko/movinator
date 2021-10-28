import express, { Application, Request, Response } from "express";

const app: Application = express();
const port: Number = 3001;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Hello bro",
  });
});

try {
  app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
  });
} catch (err: any) {
  console.error(`Error occured ${err.message}`);
}
