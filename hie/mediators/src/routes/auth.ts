import express, { Request, response, Response } from "express";
import { createClient, getOpenHIMToken, installChannels, sendRequest } from "../lib/utils";


const router = express.Router();
router.use(express.json());

// Login
router.get("/token", async (req: Request, res: Response) => {
    try {
        let token = await getOpenHIMToken();
        await installChannels()
        res.set(token);
        res.json({ status: "success", token });
        return;
    }
    catch (error) {
        console.log(error);
        res.statusCode = 401;
        res.json({ error: "incorrect email or password" });
        return;
    }
});



// Login
router.post("/client", async (req: Request, res: Response) => {
    try {
        await getOpenHIMToken();
        let { name, password } = req.body;
        let response = await createClient(name, password);
        if (response === "Unauthorized" || response.indexOf("error") > -1) {
            res.statusCode = 401;
            res.json({ status: "error", error: response });
            return;
        }
        res.statusCode = 201;
        res.json({ status: "success", response });
        return;
    }
    catch (error) {
        console.log(error);
        res.statusCode = 401;
        res.json({ error: "incorrect email or password", status: "error" });
        return;
    }
});

// Login
router.get("/install", async (req: Request, res: Response) => {
    try {
        let token = await getOpenHIMToken();
        await sendRequest()
        res.json({ status: "success", token });
        return;
    }
    catch (error) {
        console.log(error);
        res.statusCode = 401;
        res.json({ error: "incorrect email or password" });
        return;
    }
});

export default router