import express from 'express';
import multer from 'multer';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 4000;

const heartt = process.env.dbConnectionStr
const dbName = 'HRF';


const dbConnectionStr = 'mongodb+srv://Heartrecovfoundation:Heartrecovfoundation@cluster0.9crw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


const client = new MongoClient(dbConnectionStr, { useUnifiedTopology: true });

let db;

client.connect().then(() => {
    db = client.db(dbName);
    console.log(`Connected to ${dbName} Database`);
}).catch((err) => {
    console.error(err);
});

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|docx|doc|jpg|jpeg|png)$/)) {
            return cb(new Error('Only PDF, DOCX, DOC, JPG, JPEG, and PNG files are allowed!'));
        }
        cb(undefined, true);
    },
});

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Endpoints


app.get('/', async (req, res) => {
    try {
        res.sendFile('index.html', { root: __dirname });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});


console.log(_dirname);


app.get('/volunteers', async (req, res) => {
    try {
        res.sendFile('volunteers.html', { root: __dirname });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});

app.get('/api/indsponsors', async (req, res) => {
    try {
        const indsponsors = await db.collection('indsponsors').find().toArray();
        res.json(indsponsors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching indsponsors' });
    }
});

app.get('/indsponsors', async (req, res) => {
    try {
        res.sendFile('indsponsors.html', { root: __dirname });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});


app.get('/api/corporatesponsors', async (req, res) => {
    try {
        const corporatesponsors = await db.collection('corporatesponsors').find().toArray();
        res.json(corporatesponsors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching corporatesponsors' });
    }
});


app.get('/corporatesponsors', async (req, res) => {
    try {
        res.sendFile('corporatesponsors.html', { root: __dirname });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});

app.get('/api/patients', async (req, res) => {
    try {
        const patients = await db.collection('patients').find().toArray();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching patients' });
    }
});

app.get('/patients', async (req, res) => {
    try {
        res.sendFile('patients.html', { root: __dirname });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});


app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await db.collection('contacts').find().toArray();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

app.get('/contacts', async (req, res) => {
    try {
        res.sendFile('contacts.html', { root: __dirname });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});

app.get('/donations', async (req, res) => {
    try {
        res.sendFile('donations.html', { root: __dirname });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching data from database' });
    }
});


app.get('/api/donations', async (req, res) => {
    try {
        const donations = await db.collection('donations').find().toArray();
        res.json(donations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching donations' });
    }
});


app.get('/api/volunteers', async (req, res) => {
    try {
        const volunteers = await db.collection('volunteerform').find().toArray();
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching volunteers' });
    }
});

app.get('/api/data', async (req, res) => {
    try {
        const volunteers = await db.collection('volunteerform').find().toArray();
        const indsponsors = await db.collection('indsponsors').find().toArray();
        const corporatesponsors = await db.collection('corporatesponsors').find().toArray();
        const patients = await db.collection('patients').find().toArray();
        const contacts = await db.collection('contacts').find().toArray();
        const donations = await db.collection('donations').find().toArray();

        const data = {
            volunteers,
            indsponsors,
            corporatesponsors,
            patients,
            contacts,
            donations
        };

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching data' });
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});

module.exports = app;
