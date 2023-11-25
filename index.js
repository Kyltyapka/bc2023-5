import express from "express";
import path from 'path';
import multer from 'multer';
import bodyParser from 'body-parser';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const upload = multer();
 
const app = express();
const port = 8000;

app.use(bodyParser.json()); // для обробки JSON-даних
app.use(bodyParser.urlencoded({ extended: true }));

let notes = [];

app.get("/", (req, res) => {
    res.send("hello")
});

app.get('/notes', (req, res) => {
    res.json(notes);
});

app.get('/UploadForm.html', (req, res) => {
    res.sendFile(path.resolve('static', 'UploadForm.html'));
});

app.post('/upload', upload.none(), (req, res) => {
    const { note_name, note } = req.body;
    const existingNote = notes.find((n) => n.note_name === note_name);
    if (existingNote) {
        return res.status(400).send('Note with this name already exists');
    }
    notes.push({ note_name, note });
    res.status(201).send('Note uploaded successfully');
});

app.get('/notes/:note_name', (req, res) => {
    const { note_name } = req.params;
    const foundNote = notes.find((n) => n.note_name === note_name);
    if (!foundNote) {
        return res.status(404).send('Note not found');
    }
    res.send(foundNote.note);
});

app.put('/notes/:note_name', (req, res) => {
    const { note_name } = req.params;
    const { note } = req.body;
    const foundNote = notes.find((n) => n.note_name === note_name);
    if (!foundNote) {
        return res.status(404).send('Note not found');
    }
    foundNote.note = note;
    res.send('Note updated successfully');
});


app.delete('/notes/:note_name', (req, res) => {
    const { note_name } = req.params;
    notes = notes.filter((n) => n.note_name !== note_name);
    res.send('Note deleted successfully');
});

app.listen(port, () => {
    console.log(`Server is running ${port}.`);
});
