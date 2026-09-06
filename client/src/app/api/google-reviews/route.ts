
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeid = searchParams.get('placeid');

  if (!placeid) {
    return NextResponse.json({ error: 'placeid is required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.status !== 'OK') {
      return NextResponse.json({ error: data.error_message || data.status }, { status: 400 });
    }

    return NextResponse.json(data.result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}