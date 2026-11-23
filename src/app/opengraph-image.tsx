import { ImageResponse } from "next/og";

export const alt = "SaheliMile — Safe, Shared Last-Mile Commutes for Women";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FFFBEB",
          padding: "60px 70px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top Header Badge & Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "20px",
                backgroundColor: "#0D9488",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "38px",
                boxShadow: "0 10px 25px rgba(13, 148, 136, 0.35)",
              }}
            >
              🛺
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "38px",
                  fontWeight: 900,
                  color: "#0F172A",
                  letterSpacing: "-1px",
                }}
              >
                <span>Saheli</span>
                <span style={{ color: "#0D9488" }}>Mile</span>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#0F766E",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Safe Shared Commutes
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "white",
              padding: "10px 22px",
              borderRadius: "999px",
              border: "2px solid #FDE68A",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#F97316",
              }}
            />
            <span
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#9A3412",
              }}
            >
              TuteDude Buildathon • CityFix Challenge
            </span>
          </div>
        </div>

        {/* Main Center Message */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              fontSize: "62px",
              fontWeight: 900,
              color: "#0F172A",
              lineHeight: 1.15,
              letterSpacing: "-2px",
            }}
          >
            <span>Your Safe, Shared </span>
            <span
              style={{
                color: "#0D9488",
                marginLeft: "14px",
                textDecoration: "underline",
              }}
            >
              Last-Mile Home.
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "23px",
              fontWeight: 500,
              color: "#334155",
              lineHeight: 1.45,
            }}
          >
            Connecting verified women commuters exiting transit hubs along
            overlapping corridors with community-vouched autos and 50% fare split.
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "24px",
            borderTop: "2px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <div style={{ display: "flex", gap: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "white",
                padding: "8px 18px",
                borderRadius: "14px",
                border: "1.5px solid #CCFBF1",
                fontSize: "14px",
                fontWeight: 700,
                color: "#0F766E",
              }}
            >
              <span>👁️</span>
              <span>3-Blink Face AI Login</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "white",
                padding: "8px 18px",
                borderRadius: "14px",
                border: "1.5px solid #FFEDD5",
                fontSize: "14px",
                fontWeight: 700,
                color: "#C2410C",
              }}
            >
              <span>🛺</span>
              <span>50% Auto Meter Split</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "white",
                padding: "8px 18px",
                borderRadius: "14px",
                border: "1.5px solid #D1FAE5",
                fontSize: "14px",
                fontWeight: 700,
                color: "#047857",
              }}
            >
              <span>🤝</span>
              <span>Safe-Drop Handshake</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "15px",
              fontWeight: 800,
              color: "#0D9488",
            }}
          >
            sahelimile.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
