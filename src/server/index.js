const express = require("express");
const port = 8000;
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const { analyze } = require("./analyse");

// middlewares
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

dotenv.config();

const MEAN_CLOUD_API_KEY = process.env.API_KEY;

app.get('/', function (req, res) {
    res.render("index.html");
});

app.post("/", async (req, res) => {
    // 1. Get the URL from the request body
    const url = req.body.URI;

    try {
        // 2. Fetch Data from API by sending the URL and the key
        const Analyze = await analyze(url, MEAN_CLOUD_API_KEY);
        const { code, msg, sample } = Analyze;

        // Send errors if result was wrong
        if (code === 212 || code === 100) {
            return res.send({ msg: msg, code: code });
        }

        return res.send({ sample: sample, code: code });

    } catch (error) {
        return res.status(500).send({ msg: "Internal server error", code: 500 });
    }
});

app.listen(port, () => console.log("Server is now listening on port 8000"));
