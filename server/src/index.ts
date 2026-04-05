import express from 'express';
import cors from 'cors';
import objectsRouter from './routes/objects.js';
import alertsRouter from './routes/alerts.js';
import scenariosRouter from './routes/scenarios.js';
import logsRouter from './routes/logs.js';
import evidenceRouter from './routes/evidence.js';
import reportsRouter from './routes/reports.js';
import topologyRouter from './routes/topology.js';
import environmentRouter from './routes/environment.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Zodiac AOS534 Mock API', truth_model: 'v0.98 (simulated)', timestamp: new Date().toISOString() });
});

app.use('/objects', objectsRouter);
app.use('/alerts', alertsRouter);
app.use('/scenarios', scenariosRouter);
app.use('/logs', logsRouter);
app.use('/evidence', evidenceRouter);
app.use('/reports', reportsRouter);
app.use('/topology', topologyRouter);
app.use('/environment', environmentRouter);

app.listen(PORT, () => {
  console.log(`Zodiac AOS534 Mock API running on http://localhost:${PORT}`);
  console.log(`Truth Model: v0.98 (simulated) | DEMO MODE`);
});
