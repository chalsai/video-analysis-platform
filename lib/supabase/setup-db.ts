import { getSupabaseAdmin } from "./admin"

export async function setupDatabase() {
  const supabase = getSupabaseAdmin()

  try {
    console.log("Setting up database schema...")

    // Create subscription_plans table
    const { error: plansError } = await supabase.rpc("create_subscription_plans_table", {})
    if (plansError) throw plansError

    // Create users table (if not using Supabase Auth's users)
    const { error: usersError } = await supabase.rpc("create_custom_users_table", {})
    if (usersError) throw usersError

    // Create user_subscriptions table
    const { error: subsError } = await supabase.rpc("create_user_subscriptions_table", {})
    if (subsError) throw subsError

    // Create videos table
    const { error: videosError } = await supabase.rpc("create_videos_table", {})
    if (videosError) throw videosError

    // Create video_analyses table
    const { error: analysesError } = await supabase.rpc("create_video_analyses_table", {})
    if (analysesError) throw analysesError

    // Create detection_objects table
    const { error: objectsError } = await supabase.rpc("create_detection_objects_table", {})
    if (objectsError) throw objectsError

    // Create object_appearances table
    const { error: appearancesError } = await supabase.rpc("create_object_appearances_table", {})
    if (appearancesError) throw appearancesError

    // Create frame_detections table
    const { error: framesError } = await supabase.rpc("create_frame_detections_table", {})
    if (framesError) throw framesError

    // Create analysis_reports table
    const { error: reportsError } = await supabase.rpc("create_analysis_reports_table", {})
    if (reportsError) throw reportsError

    console.log("Database schema setup complete!")
    return { success: true }
  } catch (error) {
    console.error("Error setting up database schema:", error)
    return { success: false, error }
  }
}
