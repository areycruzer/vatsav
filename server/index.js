const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { WebSocketServer } = require('ws');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const { exec } = require('child_process');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const port = 3001;

// --- Gemini API Setup ---
// IMPORTANT: Replace "YOUR_GEMINI_API_KEY" with your actual API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Configure a proxy agent if the HTTPS_PROXY environment variable is set
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const fetchOptions = {};
if (proxy) {
  console.log(`Using HTTPS proxy: ${proxy}`);
  fetchOptions.agent = new HttpsProxyAgent(proxy);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY, fetchOptions);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
// ------------------------

// PostgreSQL connection pool
const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'vatsav',
  password: 'password',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Function to initialize the database
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Drop tables to ensure a clean slate, handling dependencies
    await client.query('DROP TABLE IF EXISTS call_logs');
    await client.query('DROP TABLE IF EXISTS emergencies');
    console.log('Dropped existing tables.');

    // Re-create emergencies table
    await client.query(`
      CREATE TABLE emergencies (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        time VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        description TEXT,
        latitude FLOAT,
        longitude FLOAT,
        triage_status VARCHAR(50)
      );
    `);
    console.log('Re-created emergencies table.');

    // Re-create call_logs table
    await client.query(`
      CREATE TABLE call_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        transcript JSONB,
        emotions JSONB,
        triage_status VARCHAR(50),
        summary TEXT,
        recommended_action TEXT,
        approved BOOLEAN DEFAULT false
      );
    `);
    console.log('Re-created call_logs table.');

    // Seed emergencies
    const seedEmergencies = [
      // --- Original Entries ---
      // Mumbai
      { id: 'EMG001', type: 'Fire', location: 'Bandra West, Mumbai', time: '10:00AM', status: 'Active', description: 'Large fire in residential building.', latitude: 19.0596, longitude: 72.8407, triage_status: 'CRITICAL' },
      { id: 'EMG002', type: 'Medical', location: 'Andheri East, Mumbai', time: '10:15AM', status: 'Active', description: 'Caller reports chest pains.', latitude: 19.1136, longitude: 72.8697, triage_status: 'HIGH' },
      // Delhi
      { id: 'EMG003', type: 'Accident', location: 'Connaught Place, New Delhi', time: '09:45AM', status: 'Resolved', description: 'Minor two-car collision.', latitude: 28.6330, longitude: 77.2193, triage_status: 'MEDIUM' },
      { id: 'EMG004', type: 'Burglary', location: 'Karol Bagh, New Delhi', time: '11:05AM', status: 'Active', description: 'Reported break-in.', latitude: 28.6501, longitude: 77.1950, triage_status: 'HIGH' },
      // Bangalore
      { id: 'EMG005', type: 'Public Disturbance', location: 'Koramangala, Bengaluru', time: '11:20AM', status: 'Active', description: 'Large crowd causing a disruption.', latitude: 12.9352, longitude: 77.6245, triage_status: 'MEDIUM' },
      { id: 'EMG006', type: 'Gas Leak', location: 'Indiranagar, Bengaluru', time: '11:30AM', status: 'Active', description: 'Strong smell of gas reported.', latitude: 12.9719, longitude: 77.6412, triage_status: 'CRITICAL' },
      // Hyderabad
      { id: 'EMG007', type: 'Assault', location: 'HITECH City, Hyderabad', time: '11:45AM', status: 'Resolved', description: 'Altercation reported, suspect apprehended.', latitude: 17.4435, longitude: 78.3772, triage_status: 'HIGH' },
      // Chennai
      { id: 'EMG008', type: 'Missing Person', location: 'T. Nagar, Chennai', time: '12:00PM', status: 'Active', description: 'A child has been reported missing.', latitude: 13.0400, longitude: 80.2363, triage_status: 'CRITICAL' },
      // Kolkata
      { id: 'EMG009', type: 'Theft', location: 'Park Street, Kolkata', time: '12:15PM', status: 'Active', description: 'Shoplifting reported at a retail store.', latitude: 22.5514, longitude: 88.3580, triage_status: 'MEDIUM' },
  
      // --- Added Entries ---
      // Pune
      { id: 'EMG010', type: 'Accident', location: 'Hinjewadi, Pune', time: '12:45PM', status: 'Active', description: 'Multi-vehicle pile-up on the highway.', latitude: 18.5913, longitude: 73.7389, triage_status: 'CRITICAL' },
      { id: 'EMG011', type: 'Medical', location: 'Koregaon Park, Pune', time: '01:05PM', status: 'Active', description: 'Elderly person fell, suspected hip fracture.', latitude: 18.5363, longitude: 73.8939, triage_status: 'HIGH' },
  
      // Surat
      { id: 'EMG012', type: 'Fire', location: 'Adajan, Surat', time: '01:20PM', status: 'Active', description: 'Fire reported in a textile factory warehouse.', latitude: 21.1959, longitude: 72.7954, triage_status: 'CRITICAL' },
      { id: 'EMG013', type: 'Theft', location: 'Piplod, Surat', time: '01:30PM', status: 'Resolved', description: 'Chain snatching incident.', latitude: 21.1492, longitude: 72.7831, triage_status: 'MEDIUM' },
  
      // Jaipur
      { id: 'EMG014', type: 'Public Disturbance', location: 'C-Scheme, Jaipur', time: '01:45PM', status: 'Active', description: 'Unauthorized political rally causing traffic jams.', latitude: 26.9038, longitude: 75.7909, triage_status: 'MEDIUM' },
      { id: 'EMG015', type: 'Missing Person', location: 'Malviya Nagar, Jaipur', time: '02:00PM', status: 'Active', description: 'Tourist reported missing from a hotel.', latitude: 26.8539, longitude: 75.8054, triage_status: 'CRITICAL' },
      
      // Ahmedabad
      { id: 'EMG016', type: 'Medical', location: 'Satellite, Ahmedabad', time: '02:15PM', status: 'Active', description: 'Individual experiencing severe allergic reaction.', latitude: 23.0285, longitude: 72.5085, triage_status: 'HIGH' },
      { id: 'EMG017', type: 'Structural Collapse', location: 'Maninagar, Ahmedabad', time: '02:35PM', status: 'Active', description: 'Balcony of an old building has collapsed.', latitude: 22.9972, longitude: 72.6015, triage_status: 'CRITICAL' },
  
      // Lucknow
      { id: 'EMG018', type: 'Burglary', location: 'Gomti Nagar, Lucknow', time: '02:50PM', status: 'Active', description: 'Home invasion reported by a resident.', latitude: 26.8552, longitude: 81.0019, triage_status: 'HIGH' },
      
      // More Delhi
      { id: 'EMG019', type: 'Flooding', location: 'Saket, New Delhi', time: '03:00PM', status: 'Active', description: 'Severe waterlogging due to burst pipeline.', latitude: 28.5284, longitude: 77.2185, triage_status: 'MEDIUM' },
      
      // More Mumbai
      { id: 'EMG020', type: 'Assault', location: 'Dadar, Mumbai', time: '03:15PM', status: 'Resolved', description: 'Fight broke out at the railway station.', latitude: 19.0180, longitude: 72.8428, triage_status: 'HIGH' },
      
      // More Bangalore
      { id: 'EMG021', type: 'Power Outage', location: 'Whitefield, Bengaluru', time: '03:30PM', status: 'Active', description: 'Transformer explosion caused a major power outage.', latitude: 12.9698, longitude: 77.7499, triage_status: 'LOW' },
      
      // Kanpur
      { id: 'EMG022', type: 'Industrial Accident', location: 'Panki, Kanpur', time: '03:45PM', status: 'Active', description: 'Chemical spill at a manufacturing plant.', latitude: 26.4670, longitude: 80.2486, triage_status: 'CRITICAL' },
      
      // Nagpur
      { id: 'EMG023', type: 'Vandalism', location: 'Sitabuldi, Nagpur', time: '04:00PM', status: 'Active', description: 'Group of individuals damaging shop fronts.', latitude: 21.1465, longitude: 79.0824, triage_status: 'LOW' },
      
      // Indore
      { id: 'EMG024', type: 'Food Poisoning', location: 'Vijay Nagar, Indore', time: '04:15PM', status: 'Active', description: 'Multiple reports of illness from a wedding party.', latitude: 22.7533, longitude: 75.8937, triage_status: 'HIGH' },
      
      // More Chennai
      { id: 'EMG025', type: 'Accident', location: 'Anna Nagar, Chennai', time: '04:30PM', status: 'Resolved', description: 'City bus collided with a car. Minor injuries.', latitude: 13.0849, longitude: 80.2101, triage_status: 'MEDIUM' },
      
      // More Kolkata
      { id: 'EMG026', type: 'Medical', location: 'Salt Lake, Kolkata', time: '04:45PM', status: 'Active', description: 'Caller reports breathing difficulties.', latitude: 22.5852, longitude: 88.4064, triage_status: 'CRITICAL' },
      
      // More Hyderabad
      { id: 'EMG027', type: 'Animal Control', location: 'Banjara Hills, Hyderabad', time: '05:00PM', status: 'Active', description: 'Report of an aggressive stray dog pack.', latitude: 17.4172, longitude: 78.4344, triage_status: 'LOW' }
  ];
    for (const emergency of seedEmergencies) {
        await client.query(
            'INSERT INTO emergencies (id, type, location, time, status, description, latitude, longitude, triage_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [emergency.id, emergency.type, emergency.location, emergency.time, emergency.status, emergency.description, emergency.latitude, emergency.longitude, emergency.triage_status]
        );
    }
    console.log('Emergencies table seeded successfully.');

    // Seed call logs
    console.log('Seeding 100 dummy call logs...');
    const statuses = ['Critical', 'High', 'Medium', 'Low'];
    const actions = ['Dispatch police', 'Dispatch ambulance', 'Dispatch fire department', 'Advise caller'];
    const summaries = ['Report of a car accident.', 'Caller feels unwell.', 'Possible burglary in progress.', 'Noise complaint.'];
    for (let i = 0; i < 100; i++) {
        const status = statuses[i % statuses.length];
        const transcript = [{ message: { role: 'user', content: `This is dummy call number ${i + 1}.` } }, { message: { role: 'assistant', content: 'This is a dummy response.' } }];
        const emotions = { anger: Math.random(), joy: Math.random(), fear: Math.random(), sadness: Math.random() };
        await client.query(
            `INSERT INTO call_logs (transcript, emotions, triage_status, summary, recommended_action, approved) VALUES ($1, $2, $3, $4, $5, $6)`,
            [JSON.stringify(transcript), JSON.stringify(emotions), status, summaries[i % summaries.length], actions[i % actions.length], Math.random() > 0.5]
        );
    }
    console.log('100 dummy call logs seeded successfully.');

  } catch (err) {
    console.error('Error during database initialization:', err);
  } finally {
    client.release();
  }
}

// API endpoint to get all emergencies
app.get('/api/emergencies', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM emergencies ORDER BY time DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete an emergency
app.delete('/api/emergencies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await pool.query('DELETE FROM emergencies WHERE id = $1', [id]);
    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ msg: 'Emergency not found' });
    }
    res.json({ msg: 'Emergency deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// API endpoint to create a new emergency
app.post('/api/emergencies', async (req, res) => {
  try {
    const { id, type, location, time, status, description } = req.body;
    const newEmergency = await pool.query(
      'INSERT INTO emergencies (id, type, location, time, status, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, type, location, time, status, description]
    );
    const createdEmergency = newEmergency.rows[0];
    res.status(201).json(createdEmergency);
    broadcast({ type: 'CREATE', payload: createdEmergency });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// API endpoint to update an emergency
app.put('/api/emergencies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, location, time, status, description } = req.body;
    const updatedEmergency = await pool.query(
      'UPDATE emergencies SET type = $1, location = $2, time = $3, status = $4, description = $5 WHERE id = $6 RETURNING *',
      [type, location, time, status, description, id]
    );
    const changedEmergency = updatedEmergency.rows[0];
    res.json(changedEmergency);
    broadcast({ type: 'UPDATE', payload: changedEmergency });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// API endpoint to delete an emergency
app.delete('/api/emergencies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM emergencies WHERE id = $1');
    res.status(204).send(); // No content
    broadcast({ type: 'DELETE', payload: { id } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// API endpoint to analyze a call and create a log
app.get('/api/calls', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM call_logs ORDER BY created_at DESC');
    // Parse the transcript and emotions from JSON strings to JSON objects
    const logs = result.rows.map(log => ({
      ...log,
      transcript: typeof log.transcript === 'string' ? JSON.parse(log.transcript) : log.transcript,
      emotions: typeof log.emotions === 'string' ? JSON.parse(log.emotions) : log.emotions,
    }));
    res.json(logs);
  } catch (err) {
    console.error('Error fetching call logs:', err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/calls/analyze', async (req, res) => {
  const { transcript, emotions } = req.body;

  if (!transcript || transcript.length === 0) {
    return res.status(400).json({ error: 'Transcript is required.' });
  }

  try {
    // 1. Format the transcript for Gemini
    const formattedTranscript = transcript.map(msg => `${msg.message.role}: ${msg.message.content}`).join('\n');
    
    const prompt = `
      You are an expert emergency dispatcher AI. Analyze the following emergency call transcript and provide a triage assessment.
      
      **Transcript:**
      ${formattedTranscript}

      **Task:**
      Based on the transcript, provide the following in a JSON object format:
      1.  "triage_status": Classify the call's urgency. Options are: 'Critical', 'High', 'Medium', 'Low'.
      2.  "summary": A concise, one-sentence summary of the incident.
      3.  "recommended_action": The single most important next action for the dispatcher (e.g., "Dispatch police and ambulance immediately," "Advise caller to stay on the line," "No action required, non-emergency").

      **JSON Output Example:**
      {
        "triage_status": "Critical",
        "summary": "A house fire has been reported with people possibly trapped inside.",
        "recommended_action": "Dispatch fire department and ambulance to the location immediately."
      }
    `;

    // 2. Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();
    // Clean the text to remove markdown code block syntax
    const cleanedText = analysisText.replace(/```json/g, '').replace(/```/g, '');
    const analysis = JSON.parse(cleanedText);

    // 3. Save to database
    const logResult = await pool.query(
      `INSERT INTO call_logs (transcript, emotions, triage_status, summary, recommended_action)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [JSON.stringify(transcript.map(t => ({ message: t.message }))), JSON.stringify(emotions), analysis.triage_status, analysis.summary, analysis.recommended_action]
    );

    res.status(201).json(logResult.rows[0]);

  } catch (err) {
    console.error('Error analyzing call:', err);
    if (err.cause) {
      console.error('Underlying cause:', err.cause);
    }
    res.status(500).json({ 
        error: 'Server Error during analysis', 
        details: err.message,
        cause: err.cause ? err.cause.message : 'No specific cause available' 
    });
  }
});

// Diagnostic endpoint to test Google API connectivity
app.get('/api/health/test-google-connection', (req, res) => {
  exec('curl -v https://generativelanguage.googleapis.com/v1beta/models', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ 
        message: 'Failed to execute curl command.',
        error: error.message,
        stdout,
        stderr
      });
    }
    res.status(200).json({
      message: 'Curl command executed successfully.',
      stdout,
      stderr
    });
  });
});

// Start the server after initializing the database
const server = app.listen(port, async () => {
  try {
    await initializeDatabase();
    console.log(`Server with database connection listening at - http://localhost:${port}`);
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
});

// WebSocket server setup
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  console.log('Client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(data));
    }
  });
}
