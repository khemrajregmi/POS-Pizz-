import express from 'express';

import orderRoutes from './routes/OrderRoutes';
import kitchenRoutes from './routes/KitchenRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World with TypeScript and Express!');
});

app.use('/api', orderRoutes);
app.use('/api',kitchenRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
