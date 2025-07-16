import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { executeDirectQuery } from "@/lib/supabase/direct-query"

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    // First, create the exec_sql function directly
    const createExecSqlFunction = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$ LANGUAGE plpgsql;
    `

    // Try to execute the raw SQL to create the function
    const { success, error: funcError } = await executeDirectQuery(createExecSqlFunction)

    if (!success) {
      console.error("Error creating exec_sql function:", funcError)
      return NextResponse.json({ error: "Failed to create exec_sql function" }, { status: 500 })
    }

    // Now create the stored procedures for table creation
    const createProcedures = [
      // Subscription plans procedure
      `
      CREATE OR REPLACE FUNCTION create_subscription_plans_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS subscription_plans (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          max_video_size_mb INTEGER NOT NULL,
          max_video_duration_minutes INTEGER NOT NULL,
          price_monthly DECIMAL(10, 2) NOT NULL,
          price_yearly DECIMAL(10, 2) NOT NULL,
          features JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Insert default plans if table is empty
        IF (SELECT COUNT(*) FROM subscription_plans) = 0 THEN
          INSERT INTO subscription_plans (id, name, max_video_size_mb, max_video_duration_minutes, price_monthly, price_yearly, features)
          VALUES
            ('free', 'Free Trial', 50, 2, 0, 0, '["Basic object detection", "Limited video size", "Limited video duration"]'),
            ('basic', 'Basic', 200, 10, 9.99, 99.99, '["Standard object detection", "Increased video size", "Increased video duration", "Report sharing"]'),
            ('pro', 'Professional', 1000, 30, 29.99, 299.99, '["Advanced object detection", "Large video size", "Extended video duration", "Report sharing", "API access"]'),
            ('enterprise', 'Enterprise', 10000, 120, 99.99, 999.99, '["Premium object detection", "Unlimited video size", "Extended video duration", "Report sharing", "API access", "Custom model training"]');
        END IF;
      END;
      $$ LANGUAGE plpgsql;
      `,

      // Custom users table procedure (if not using Supabase Auth)
      `
      CREATE OR REPLACE FUNCTION create_custom_users_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS custom_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      END;
      $$ LANGUAGE plpgsql;
      `,

      // User subscriptions procedure
      `
      CREATE OR REPLACE FUNCTION create_user_subscriptions_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS user_subscriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          plan_id VARCHAR(50) NOT NULL REFERENCES subscription_plans(id),
          status VARCHAR(50) NOT NULL,
          current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
          current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
          cancel_at_period_end BOOLEAN DEFAULT FALSE,
          payment_provider VARCHAR(50),
          payment_provider_subscription_id VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      END;
      $$ LANGUAGE plpgsql;
      `,

      // Videos table procedure
      `
      CREATE OR REPLACE FUNCTION create_videos_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS videos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          file_path VARCHAR(1024) NOT NULL,
          file_size_bytes BIGINT NOT NULL,
          duration_seconds NUMERIC(10, 2),
          mime_type VARCHAR(100),
          thumbnail_path VARCHAR(1024),
          status VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      END;
      $$ LANGUAGE plpgsql;
      `,

      // Video analyses procedure
      `
      CREATE OR REPLACE FUNCTION create_video_analyses_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS video_analyses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
          status VARCHAR(50) NOT NULL,
          model_version VARCHAR(100) NOT NULL,
          processing_started_at TIMESTAMP WITH TIME ZONE,
          processing_completed_at TIMESTAMP WITH TIME ZONE,
          processing_time_seconds NUMERIC(10, 2),
          error_message TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      END;
      $$ LANGUAGE plpgsql;
      `,

      // Detection objects procedure
      `
      CREATE OR REPLACE FUNCTION create_detection_objects_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS detection_objects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          analysis_id UUID NOT NULL REFERENCES video_analyses(id) ON DELETE CASCADE,
          object_class VARCHAR(100) NOT NULL,
          track_id INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      END;
      $$ LANGUAGE plpgsql;
      `,

      // Object appearances procedure
      `
      CREATE OR REPLACE FUNCTION create_object_appearances_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS object_appearances (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          detection_object_id UUID NOT NULL REFERENCES detection_objects(id) ON DELETE CASCADE,
          start_time_seconds NUMERIC(10, 2) NOT NULL,
          end_time_seconds NUMERIC(10, 2) NOT NULL,
          average_confidence NUMERIC(5, 4) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      END;
      $$ LANGUAGE plpgsql;
      `,

      // Frame detections procedure
      `
      CREATE OR REPLACE FUNCTION create_frame_detections_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS frame_detections (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          detection_object_id UUID NOT NULL REFERENCES detection_objects(id) ON DELETE CASCADE,
          frame_number INTEGER NOT NULL,
          time_seconds NUMERIC(10, 2) NOT NULL,
          confidence NUMERIC(5, 4) NOT NULL,
          bbox_x NUMERIC(10, 2) NOT NULL,
          bbox_y NUMERIC(10, 2) NOT NULL,
          bbox_width NUMERIC(10, 2) NOT NULL,
          bbox_height NUMERIC(10, 2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      END;
      $$ LANGUAGE plpgsql;
      `,

      // Analysis reports procedure
      `
      CREATE OR REPLACE FUNCTION create_analysis_reports_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS analysis_reports (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          analysis_id UUID NOT NULL REFERENCES video_analyses(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          share_token VARCHAR(100) UNIQUE,
          is_public BOOLEAN DEFAULT FALSE,
          expires_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      END;
      $$ LANGUAGE plpgsql;
      `,
    ]

    // Execute each procedure creation
    for (const procedure of createProcedures) {
      // Try to use the exec_sql function first
      const { error } = await supabase.rpc("exec_sql", { sql: procedure }).catch(async () => {
        // If that fails, use direct query
        return await executeDirectQuery(procedure)
      })

      if (error) {
        console.error("Error creating procedure:", error)
        throw error
      }
    }

    return NextResponse.json({ success: true, message: "Procedures created successfully" })
  } catch (error) {
    console.error("Create procedures API error:", error)
    return NextResponse.json({ error: "Failed to create procedures" }, { status: 500 })
  }
}
