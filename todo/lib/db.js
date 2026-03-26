import { Pool } from "pg";

const pool = new Pool({
 connectionString: 'postgresql://postgres:12345@localhost:5432/tododb'
});

export default pool;