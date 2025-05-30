import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("image");

  if (!file) {
    return new Response(JSON.stringify({ error: "Ingen fil hittades." }), {
      status: 400,
    });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = file.name.replaceAll(" ", "_"); // Sanera filnamn
  const filePath = path.join(process.cwd(), "public/assets", filename);

  await writeFile(filePath, buffer);

  return new Response(JSON.stringify({ path: `/assets/${filename}` }), {
    status: 200,
  });
}
