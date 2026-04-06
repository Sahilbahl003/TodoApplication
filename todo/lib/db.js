import { Pool } from "pg";

const pool = new Pool({
 connectionString: 'postgresql://postgres:Sahil%40123@localhost:5432/tododb'
});

export default pool;