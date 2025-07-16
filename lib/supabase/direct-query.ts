import { getSupabaseAdmin } from "./admin"

export async function executeDirectQuery(sql: string) {
  const supabase = getSupabaseAdmin()

  try {
    // Execute the SQL directly using the PostgreSQL query interface
    const { data, error } = await supabase.query(sql)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error executing direct query:", error)
    return { success: false, error }
  }
}
