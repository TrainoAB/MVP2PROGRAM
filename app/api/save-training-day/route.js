// import { NextResponse } from "next/server";
// import { supabase } from "@/utils/supabase/supabase"; 

// export async function POST(req) {
//   console.log("Request body:", req.body);
//   try {
//     const body = await req.json();
//     const { month_number, day_number, image_url, video_url } = body;

//     if (!month_number || !day_number) {
//       return NextResponse.json(
//         { error: "Månad och dag krävs" },
//         { status: 400 }
//       );
//     }

//     const { data: program, error: programError } = await supabase
//       .from("training_programs")
//       .select("id")
//       .order("inserted_at", { ascending: false })
//       .limit(1)
//       .maybeSingle();

//     if (programError) {
//       console.error("Insert error:", programError);
//       return NextResponse.json(
//         { error: "Kunde inte spara", details: programError.message },
//         { status: 404}
//       );
//     }

//     const { data, dayError } = await supabase
//       .from("training_days")
//       .insert([
//         {
//           training_program_id: program.id,
//           month_number,
//           day_number,
//           image_url,
//           video_url,
//         },
//       ])
//       .select();

//     if (dayError) {
//       console.error("Error inserting training day:", dayError);
//       return NextResponse.json(
//         { error: "Kunde inte spara", details: dayError.message },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ success: true, data }, { status: 201 });
//   } catch (error) {
//     console.error("SERVER ERROR:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }
