import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "..","client", "dist")));

app.get('/index',(req,res)=>{
    res.sendFile(path.join(__dirname,"..","client","dist","index.html"));
})

app.listen(3000, () => {
    console.log("Listening on 3000...");
});