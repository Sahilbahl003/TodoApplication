import { Pool } from "pg";

const pool = new Pool({
 connectionString: 'postgresql://postgres:11111@postgres:5432/tododb'
});

export default pool;