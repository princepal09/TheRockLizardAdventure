export const passwordResetTemplate = (resetUrl: string, name?: string): string => {
  const logoUrl =
    'https://res.cloudinary.com/ueeujsm7/image/upload/v1788094445/ieit/site-settings/ipjlwdeqvwuv462lpipb.png';

  const safeName = name?.trim() || 'there';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
/>

  <title>Reset Your Password - IEIT Computer Institute</title>

  <style>
    @media only screen and (max-width: 620px) {
      .email-wrapper {
        padding: 15px !important;
      }

      .email-card {
        width: 100% !important;
        border-radius: 12px !important;
      }

      .header {
        padding: 30px 20px !important;
      }

      .content {
        padding: 30px 22px !important;
      }

      .footer {
        padding: 22px 20px !important;
      }

      .title {
        font-size: 24px !important;
      }

      .reset-button {
        display: block !important;
        width: auto !important;
      }

      .brand-name {
        font-size: 19px !important;
      }
    }

    @media (prefers-color-scheme: dark) {
      .email-card {
        background-color: #ffffff !important;
      }

      .content {
        background-color: #ffffff !important;
      }
    }
  </style>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #eef3f9;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
  "
>

  <!-- Main Background -->
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width: 100%;
      background-color: #eef3f9;
    "
  >
    <tr>
      <td
        align="center"
        class="email-wrapper"
        style="padding: 35px 15px;"
      >

        <!-- Email Card -->
        <table
          role="presentation"
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          class="email-card"
          style="
            width: 100%;
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(11, 42, 91, 0.10);
          "
        >

          <!-- ========================================= -->
          <!-- TOP RED ACCENT -->
          <!-- ========================================= -->

          <tr>
            <td
              style="
                height: 6px;
                background-color: #d71920;
                font-size: 0;
                line-height: 0;
              "
            >
              &nbsp;
            </td>
          </tr>


          <!-- ========================================= -->
          <!-- HEADER -->
          <!-- ========================================= -->

          <tr>
            <td
              class="header"
              align="center"
              style="
                padding: 30px 25px 28px;
                background-color: #0b2a5b;
                background-image: linear-gradient(
                  135deg,
                  #071f45 0%,
                  #0b2a5b 55%,
                  #123d7a 100%
                );
              "
            >

              <!-- Logo -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td
                    align="center"
                    style="
                      background-color: #ffffff;
                      padding: 8px;
                      border-radius: 50%;
                      box-shadow: 0 5px 20px rgba(0,0,0,0.18);
                    "
                  >
                    <img
                      src="${logoUrl}"
                      alt="IEIT Computer Institute"
                      width="92"
                      height="92"
                      style="
                        display: block;
                        width: 92px;
                        height: 92px;
                        border: 0;
                        border-radius: 50%;
                      "
                    />
                  </td>
                </tr>
              </table>

              <!-- Brand -->
              <div
                class="brand-name"
                style="
                  margin-top: 17px;
                  color: #ffffff;
                  font-size: 21px;
                  line-height: 28px;
                  font-weight: 700;
                  letter-spacing: 0.8px;
                "
              >
                IEIT COMPUTER INSTITUTE
              </div>

              <div
                style="
                  margin-top: 5px;
                  color: #cbd8ea;
                  font-size: 12px;
                  line-height: 18px;
                  letter-spacing: 0.3px;
                "
              >
                Institute of Electronics &amp; Information Technology
              </div>

              <!-- Red separator -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin-top: 18px;"
              >
                <tr>
                  <td
                    style="
                      width: 45px;
                      height: 3px;
                      background-color: #d71920;
                      border-radius: 3px;
                    "
                  >
                    &nbsp;
                  </td>
                </tr>
              </table>

              <div
                style="
                  margin-top: 10px;
                  color: #ffffff;
                  font-size: 11px;
                  line-height: 17px;
                  font-weight: 600;
                  letter-spacing: 0.4px;
                "
              >
                ALMORA
              </div>

            </td>
          </tr>


          <!-- ========================================= -->
          <!-- BODY -->
          <!-- ========================================= -->

          <tr>
            <td
              class="content"
              style="
                padding: 38px 45px 35px;
                background-color: #ffffff;
              "
            >

              <!-- Small Label -->

              <div
                style="
                  display: inline-block;
                  padding: 6px 11px;
                  background-color: #fff1f1;
                  border-radius: 20px;
                  color: #c5161d;
                  font-size: 11px;
                  font-weight: 700;
                  letter-spacing: 0.7px;
                  text-transform: uppercase;
                "
              >
                Account Security
              </div>


              <!-- Heading -->

              <h1
                class="title"
                style="
                  margin: 17px 0 13px;
                  padding: 0;
                  color: #0b2a5b;
                  font-size: 27px;
                  line-height: 34px;
                  font-weight: 700;
                "
              >
                Reset Your Password
              </h1>


              <!-- Greeting -->

              <p
                style="
                  margin: 0 0 15px;
                  color: #303b4a;
                  font-size: 15px;
                  line-height: 25px;
                "
              >
                Hello <strong>${safeName}</strong>,
              </p>


              <!-- Message -->

              <p
                style="
                  margin: 0 0 13px;
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 25px;
                "
              >
                We received a request to reset the password for your
                <strong style="color: #0b2a5b;">
                  IEIT Computer Institute
                </strong>
                account.
              </p>

              <p
                style="
                  margin: 0 0 25px;
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 25px;
                "
              >
                Click the button below to securely create a new password.
              </p>


              <!-- ===================================== -->
              <!-- SECURITY BOX -->
              <!-- ===================================== -->

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin: 0 0 28px;
                  background-color: #f5f8fc;
                  border-left: 4px solid #0b2a5b;
                  border-radius: 6px;
                "
              >
                <tr>
                  <td style="padding: 14px 16px;">

                    <div
                      style="
                        color: #0b2a5b;
                        font-size: 13px;
                        line-height: 20px;
                        font-weight: 700;
                      "
                    >
                      Password reset requested
                    </div>

                    <div
                      style="
                        margin-top: 3px;
                        color: #6b7280;
                        font-size: 12px;
                        line-height: 19px;
                      "
                    >
                      For your security, this link is valid for
                      <strong>15 minutes</strong>.
                    </div>

                  </td>
                </tr>
              </table>


              <!-- ===================================== -->
              <!-- BUTTON -->
              <!-- ===================================== -->

              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                align="center"
                style="margin: 0 auto 30px;"
              >
                <tr>
                  <td
                    align="center"
                    style="
                      border-radius: 7px;
                      background-color: #d71920;
                      box-shadow: 0 5px 15px rgba(215, 25, 32, 0.22);
                    "
                  >

                    <a
                      href="${resetUrl}"
                      class="reset-button"
                      style="
                        display: inline-block;
                        padding: 14px 38px;
                        color: #ffffff;
                        background-color: #d71920;
                        border: 1px solid #d71920;
                        border-radius: 7px;
                        font-size: 14px;
                        line-height: 20px;
                        font-weight: 700;
                        text-decoration: none;
                        letter-spacing: 0.2px;
                      "
                    >
                      Reset My Password
                    </a>

                  </td>
                </tr>
              </table>


              <!-- ===================================== -->
              <!-- FALLBACK URL -->
              <!-- ===================================== -->

              <p
                style="
                  margin: 0 0 8px;
                  color: #9ca3af;
                  font-size: 11px;
                  line-height: 18px;
                  text-align: center;
                "
              >
                If the button doesn't work, copy and paste your reset link
                into your browser.
              </p>


              <!-- ===================================== -->
              <!-- IGNORE MESSAGE -->
              <!-- ===================================== -->

              <p
                style="
                  margin: 20px 0 0;
                  padding-top: 18px;
                  border-top: 1px solid #e8edf3;
                  color: #9ca3af;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: center;
                "
              >
                Didn't request a password reset?
                You can safely ignore this email.
              </p>

            </td>
          </tr>


          <!-- ========================================= -->
          <!-- FOOTER -->
          <!-- ========================================= -->

          <tr>
            <td
              class="footer"
              align="center"
              style="
                padding: 25px 35px 28px;
                background-color: #f7f9fc;
                border-top: 1px solid #e7ebf1;
              "
            >

              <div
                style="
                  color: #0b2a5b;
                  font-size: 14px;
                  line-height: 20px;
                  font-weight: 700;
                "
              >
                IEIT Computer Institute
              </div>

              <div
                style="
                  margin-top: 4px;
                  color: #8a94a3;
                  font-size: 11px;
                  line-height: 18px;
                "
              >
                Institute of Electronics &amp; Information Technology
              </div>

              <div
                style="
                  margin-top: 3px;
                  color: #9ca3af;
                  font-size: 11px;
                  line-height: 18px;
                "
              >
                An ISO 9001:2015 Certified Institute
              </div>

              <!-- Footer accent -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin-top: 15px;"
              >
                <tr>
                  <td
                    style="
                      width: 28px;
                      height: 3px;
                      background-color: #d71920;
                    "
                  >
                    &nbsp;
                  </td>

                  <td
                    style="
                      width: 7px;
                      font-size: 0;
                    "
                  >
                    &nbsp;
                  </td>

                  <td
                    style="
                      width: 28px;
                      height: 3px;
                      background-color: #0b2a5b;
                    "
                  >
                    &nbsp;
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>


        <!-- Bottom Disclaimer -->

        <table
          role="presentation"
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width: 100%;
            max-width: 600px;
          "
        >
          <tr>
            <td
              align="center"
              style="
                padding: 17px 20px 0;
                color: #9aa4b2;
                font-size: 10px;
                line-height: 16px;
              "
            >
              This is an automated email from IEIT Computer Institute.
              Please do not reply to this message.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};
