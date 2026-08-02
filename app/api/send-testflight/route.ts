import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Handle CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {
  try {
    const { testerEmail } = await req.json();

    if (!testerEmail) {
      return NextResponse.json(
        { success: false, error: "Tester email is required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const formattedDate = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sahl.nexbex@gmail.com",
        pass: "wqrboagjafmacpla",
      },
    });

    const mailOptions = {
      from: '"Mutakamela TestFlight Hub" <sahl.nexbex@gmail.com>',
      to: "anshad@nexbex.in",
      subject: `🚀 TestFlight Access Request: ${testerEmail}`,
      text: `Hello Anshad,\n\nA new user has requested TestFlight access for the Mutakamela iOS Mobile App.\n\nTester Email: ${testerEmail}\nDate: ${formattedDate}\n\nSent automatically via Mutakamela Platform System.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 14px; background-color: #FFFFFF; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #1E1B4B 0%, #312E81 100%); padding: 24px; border-radius: 10px; text-align: center; color: #FFFFFF;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">🚀 Mutakamela iOS TestFlight Request</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #A5B4FC;">Automated Beta Tester Access Portal</p>
          </div>
          
          <div style="padding: 24px 8px; color: #334155; line-height: 1.6;">
            <p style="font-size: 15px; margin-top: 0;">Hello Anshad,</p>
            <p style="font-size: 15px;">A new request for iOS TestFlight beta access has been submitted for the <strong>Mutakamela Digital Insurance Mobile App</strong>.</p>
            
            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #3B82F6; border-radius: 8px; padding: 18px; margin: 20px 0;">
              <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">TESTER DETAILS</div>
              <div style="font-size: 17px; font-weight: 700; color: #0F172A; margin-bottom: 6px;">
                Email: <a href="mailto:${testerEmail}" style="color: #2563EB; text-decoration: none;">${testerEmail}</a>
              </div>
              <div style="font-size: 13px; color: #64748B;">
                Submission Time: ${formattedDate}
              </div>
            </div>

            <p style="font-size: 14px; color: #475569;">Please add this Apple ID email address to App Store Connect to grant TestFlight beta build access.</p>
          </div>

          <div style="border-top: 1px solid #F1F5F9; padding-top: 16px; font-size: 12px; color: #94A3B8; text-align: center;">
            Dispatched via <strong>sahl.nexbex@gmail.com</strong> for Mutakamela Mobile Showcase Platform.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("TestFlight email sent successfully via SMTP:", info.messageId);

    return NextResponse.json(
      {
        success: true,
        emailSent: true,
        message: "TestFlight request email sent directly to anshad@nexbex.in",
        testerEmail,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process request" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
