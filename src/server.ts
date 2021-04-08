import express from "express";
import "./database";
const app = express();

app.get("/", (request, response) => {
    return response.json({message:"HelloWorld"});
});

app.post("/", (request, response) => {
    return response.json(
        {
            message: "Dados Salvos!"
        }
    );
});

app.listen(3333, () => console.log("Server running"));