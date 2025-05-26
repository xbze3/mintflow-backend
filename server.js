const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

const deckSchema = new mongoose.Schema({
    courseCode: { type: String, required: true },
    topicName: { type: String, required: true },
    courseName: { type: String, required: true },
    cards: [{ type: String }],
});

const cardSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    topicName: { type: String, required: true },
});

const Deck = mongoose.model("Deck", deckSchema);
const Card = mongoose.model("Card", cardSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "https://mintflow.onrender.com/",
        allowedHeaders: ["Authorization", "Content-Type"],
    })
);

app.get("/search-decks", async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === "") {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {
        const foundDecks = await Deck.find({
            $or: [
                { courseCode: new RegExp(query, "i") },
                { topicName: new RegExp(query, "i") },
            ],
        });

        res.json(foundDecks);
    } catch (err) {
        console.error("Error searching decks:", err);
        res.status(500).send("Server error");
    }
});

app.get("/get-cards", async (req, res) => {
    const { topicName } = req.query;

    if (!topicName || topicName.trim() === "") {
        return res.status(400).json({ error: "Topic Name is required" });
    }

    try {
        const foundCards = await Card.find({
            topicName: new RegExp(topicName, "i"),
        });

        res.json(foundCards);
    } catch (err) {
        console.error("Error searching cards:", err);
        res.status(500).send("Server error");
    }
});

app.listen(8081, "0.0.0.0", () => {
    console.log("Listening on port 8081...");
});
