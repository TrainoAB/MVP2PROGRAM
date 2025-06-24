import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function POST(req) {
    const body = await req.json();
    const { description, price, days, imageUrl, videoUrl, trainerId } = body;

    const { data, error } = await supabase
        .from("training_programs")
        .insert([
            {
                description,
                price,
                days,
                image_url: imageUrl,
                video_url: videoUrl,
                trainer_id: trainerId,
            },
        ])
    
    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
    return NextResponse.json(
        { message: "Training program sparat", data },
        { status: 201 }
    );
}
