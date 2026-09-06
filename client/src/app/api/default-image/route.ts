import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), "public", "menuitems-image");
    
    // फोल्डर नभएमा खाली array दिने
    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(dirPath);
    
    // फोल्डरका सबै Valid Image हरूको Path तयार पार्ने
    const images = files
      .filter((file) => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
      .map((file) => `/menuitems-image/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ images: [] });
  }
}