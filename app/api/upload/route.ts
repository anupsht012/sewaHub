import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to buffer for processing or saving
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // TODO: Upload buffer/file to Cloudinary, AWS S3, Supabase Storage, or save locally.
    // Example placeholder URL returning Base64 for instant preview/testing:
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      url: base64Image, // Replace with uploaded hosted image URL from S3/Cloudinary
    });
  } catch (error: unknown) {
    console.error("Upload route error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json({ message }, { status: 500 });
  }
}