import { getSupabaseAdmin } from "./admin"

export async function execSQL(sql: string) {
  const supabase = getSupabaseAdmin()

  try {
    // First, try to execute the SQL using the exec_sql function
    const { error } = await supabase.rpc("exec_sql", { sql }).catch(async () => {
      // If the function doesn't exist, create it first
      const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS void AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql;
      `

      // Try to execute the raw SQL to create the function
      try {
        await supabase.query(createFunctionSQL)

        // Now try to execute the original SQL
        return await supabase.rpc("exec_sql", { sql })
      } catch (err) {
        return { error: err }
      }
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error executing SQL:", error)
    return { success: false, error }
  }
}
