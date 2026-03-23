interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
  ip: string;
}

export function generateContactEmailTemplate({
  name,
  email,
  message,
  ip,
}: ContactEmailProps): string {
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no, address=no, email=no, date=no" />
  <title>Nuevo Mensaje de Contacto</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse;}
    .fallback-font {font-family: Arial, sans-serif;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  
  <!-- Wrapper Table -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        
        <!-- Main Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 20px 30px; background-color: #1a1a1a;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="left" style="font-size: 24px; font-weight: bold; color: #facc15; font-family: Arial, Helvetica, sans-serif;">
                    &lt;SMV/&gt;
                  </td>
                  <td align="right" style="font-size: 10px; font-weight: bold; color: #22c55e; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, Helvetica, sans-serif;">
                    INTERNAL NOTIFICATION
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Yellow Banner with Footer inside -->
          <tr>
            <td style="background-color: #facc15; padding: 25px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-size: 36px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 2px; font-family: Arial, Helvetica, sans-serif;">
                    NEW MESSAGE
                  </td>
                </tr>
                <!-- Footer inside yellow banner -->
                <tr>
                  <td style="padding-top: 15px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="left" style="font-size: 9px; color: #000000; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif; opacity: 0.7;">
                          AUTOMATED SYSTEM MESSAGE
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size: 10px; color: #000000; font-weight: bold; font-family: Arial, Helvetica, sans-serif; padding-top: 5px;">
                          © ${currentYear} SMV PORTFOLIO ENGINE
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content Area -->
          <tr>
            <td style="background-color: #1a1a1a; border: 2px solid #facc15; border-top: none;">
              
              <!-- Sender Info -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding: 30px 30px 0 30px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <span style="font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">FROM:</span>
                          <span style="font-size: 18px; font-weight: bold; color: #ffffff; margin-left: 15px; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">${escapeHtml(name)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <span style="font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">EMAIL:</span>
                          <a href="mailto:${escapeHtml(email)}" style="font-size: 14px; font-weight: bold; color: #facc15; margin-left: 10px; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; font-family: Arial, Helvetica, sans-serif;">${escapeHtml(email)}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 20px;">
                          <span style="font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">IP:</span>
                          <span style="font-size: 12px; color: #666666; margin-left: 10px; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">${escapeHtml(ip)}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Message Content -->
                <tr>
                  <td style="padding: 0 30px 30px 30px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #2a2a2a; border-left: 3px solid #facc15;">
                      <tr>
                        <td style="padding: 25px;">
                          <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #e5e5e5; font-family: Arial, Helvetica, sans-serif;">
                            ${escapeHtml(message).replace(/\n/g, '<br/>')}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
          
        </table>
        <!-- End Main Container -->
        
      </td>
    </tr>
  </table>
  <!-- End Wrapper Table -->
  
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}
