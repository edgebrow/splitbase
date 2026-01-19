import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log webhook events for debugging
    console.log("Webhook received:", JSON.stringify(body, null, 2));

    // Handle different webhook event types
    const { event, data } = body;

    switch (event) {
      case "frame_added":
        console.log("Mini app added by user:", data);
        break;
      case "frame_removed":
        console.log("Mini app removed by user:", data);
        break;
      case "notifications_enabled":
        console.log("Notifications enabled:", data);
        break;
      case "notifications_disabled":
        console.log("Notifications disabled:", data);
        break;
      default:
        console.log("Unknown event type:", event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" });
}
