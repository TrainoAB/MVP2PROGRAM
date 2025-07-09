
import { fetchTrainingDay } from "@/utils/supabase/api";

export async function GET(request) {
  console.log("🔍 In API: /api/get_day_image_or_video");
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const day = searchParams.get("day");
  const programId = searchParams.get("programId");

  if (!month || !day || !programId) {
    return NextResponse.json(
      { success: false, message: "Month, day och programId krävs." },
      { status: 400 }
    );
  }

  try {
    const data = await fetchTrainingDay();

    // const { data, error } = await supabase
    //   .from("training_days")
    //   .select("image_url, video_url, saved_date")
    //   .eq("program_id", programId)
    //   .eq("month", month)
    //   .eq("day", day)
    //   .single();

    // if (error) {
    //   console.error("Fel vid databashämtning:", error.message);
    //   return NextResponse.json(
    //     { success: false, message: "Kunde inte hämta data för dagen." },
    //     { status: 500 }
    //   );
    // }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
