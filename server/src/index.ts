import express from 'express';
import cors from 'cors';
import objectsRouter from './routes/objects';
import alertsRouter from './routes/alerts';
import scenariosRouter from './routes/scenarios';
import logsRouter from './routes/logs';
import evidenceRouter from './routes/evidence';
import reportsRouter from './routes/reports';
import topologyRouter from './routes/topology';
import environmentRouter from './routes/environment';
import healthRouter from './routes/health';
import policiesRouter from './routes/policies';
import channelsRouter from './routes/channels';
import agentsGovernanceRouter from './routes/agents-governance';

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
app.use('/health-nodes', healthRouter);
app.use('/policies', policiesRouter);
app.use('/channels', channelsRouter);
app.use('/agents-governance', agentsGovernanceRouter);

app.listen(PORT, () => {
  console.log(`Zodiac AOS534 Mock API running on http://localhost:${PORT}`);
  console.log(`Truth Model: v0.98 (simulated) | DEMO MODE`);
});
