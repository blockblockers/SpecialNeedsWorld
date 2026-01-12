# Supabase Email Templates for Special Needs World

Copy these templates into your Supabase Dashboard:
**Authentication → Email Templates**

---

## 1. Confirm Signup (if you re-enable email confirmation)

**Subject:**
```
Welcome to Special Needs World! 🌟
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Special Needs World</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFEF5; font-family: 'Patrick Hand', 'Comic Sans MS', cursive, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFEF5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500px" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; border: 4px solid #F5A623; overflow: hidden; max-width: 500px;">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding: 30px 20px 20px; background: linear-gradient(135deg, #87CEEB 0%, #4A9FD4 100%);">
              <img src="{{ .SiteURL }}/logo.jpeg" alt="Special Needs World" width="100" height="100" style="border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
              <h1 style="color: #ffffff; font-size: 28px; margin: 15px 0 5px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Special Needs World</h1>
              <p style="color: #ffffff; font-size: 14px; margin: 0; opacity: 0.9;">An ecosystem for the special needs community</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #5CB85C; font-size: 24px; margin: 0 0 15px; text-align: center;">Welcome! 🎉</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hi there! We're so excited to have you join Special Needs World!
              </p>
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">
                Click the button below to confirm your email and start exploring our tools:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #5CB85C; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; padding: 15px 40px; border-radius: 30px; border: 3px solid #4CAF50; box-shadow: 4px 4px 0 rgba(0,0,0,0.2);">
                      ✨ Confirm Email ✨
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #888; font-size: 12px; margin: 25px 0 0; text-align: center;">
                If the button doesn't work, copy this link:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #4A9FD4; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #f8f8f8; border-top: 2px dashed #F5A623;">
              <p style="color: #8E6BBF; font-size: 14px; font-style: italic; text-align: center; margin: 0;">
                For Finn, and for people like him. 💜
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Reset Password

**Subject:**
```
Reset Your Special Needs World Password 🔐
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFEF5; font-family: 'Patrick Hand', 'Comic Sans MS', cursive, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFEF5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500px" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; border: 4px solid #8E6BBF; overflow: hidden; max-width: 500px;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 20px 20px; background: linear-gradient(135deg, #8E6BBF 0%, #6B4F9E 100%);">
              <img src="{{ .SiteURL }}/logo.jpeg" alt="Special Needs World" width="80" height="80" style="border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
              <h1 style="color: #ffffff; font-size: 24px; margin: 15px 0 0;">Password Reset</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #8E6BBF; font-size: 22px; margin: 0 0 15px; text-align: center;">🔐 Reset Your Password</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #8E6BBF; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; padding: 15px 40px; border-radius: 30px; border: 3px solid #7B5BA8; box-shadow: 4px 4px 0 rgba(0,0,0,0.2);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #888; font-size: 14px; margin: 25px 0 0; text-align: center;">
                Didn't request this? You can safely ignore this email.
              </p>
              
              <p style="color: #888; font-size: 12px; margin: 15px 0 0; text-align: center;">
                Link not working? Copy this:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #8E6BBF; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #f8f8f8; border-top: 2px dashed #8E6BBF;">
              <p style="color: #8E6BBF; font-size: 14px; font-style: italic; text-align: center; margin: 0;">
                For Finn, and for people like him. 💜
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Magic Link

**Subject:**
```
Your Special Needs World Login Link ✨
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Magic Login Link</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFEF5; font-family: 'Patrick Hand', 'Comic Sans MS', cursive, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFEF5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500px" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; border: 4px solid #4A9FD4; overflow: hidden; max-width: 500px;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 20px 20px; background: linear-gradient(135deg, #87CEEB 0%, #4A9FD4 100%);">
              <img src="{{ .SiteURL }}/logo.jpeg" alt="Special Needs World" width="80" height="80" style="border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
              <h1 style="color: #ffffff; font-size: 24px; margin: 15px 0 0;">Magic Login ✨</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #4A9FD4; font-size: 22px; margin: 0 0 15px; text-align: center;">Click to Sign In!</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 25px; text-align: center;">
                Here's your magic link to sign in to Special Needs World. No password needed!
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #4A9FD4; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; padding: 15px 40px; border-radius: 30px; border: 3px solid #3A8FC4; box-shadow: 4px 4px 0 rgba(0,0,0,0.2);">
                      🚀 Sign In Now
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #888; font-size: 12px; margin: 25px 0 0; text-align: center;">
                This link expires in 24 hours.<br>
                <a href="{{ .ConfirmationURL }}" style="color: #4A9FD4; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #f8f8f8; border-top: 2px dashed #4A9FD4;">
              <p style="color: #8E6BBF; font-size: 14px; font-style: italic; text-align: center; margin: 0;">
                For Finn, and for people like him. 💜
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. Change Email Address

**Subject:**
```
Confirm Your New Email Address 📧
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Email Change</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFEF5; font-family: 'Patrick Hand', 'Comic Sans MS', cursive, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFEF5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500px" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; border: 4px solid #F5A623; overflow: hidden; max-width: 500px;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 20px 20px; background: linear-gradient(135deg, #F5A623 0%, #E69500 100%);">
              <img src="{{ .SiteURL }}/logo.jpeg" alt="Special Needs World" width="80" height="80" style="border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
              <h1 style="color: #ffffff; font-size: 24px; margin: 15px 0 0;">Email Update</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #F5A623; font-size: 22px; margin: 0 0 15px; text-align: center;">📧 Confirm Your New Email</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">
                Click below to confirm this as your new email address for Special Needs World:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #F5A623; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; padding: 15px 40px; border-radius: 30px; border: 3px solid #E69500; box-shadow: 4px 4px 0 rgba(0,0,0,0.2);">
                      Confirm Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #888; font-size: 14px; margin: 25px 0 0; text-align: center;">
                Didn't request this change? Please contact support.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #f8f8f8; border-top: 2px dashed #F5A623;">
              <p style="color: #8E6BBF; font-size: 14px; font-style: italic; text-align: center; margin: 0;">
                For Finn, and for people like him. 💜
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## How to Apply These Templates

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**

2. For each template type (Confirm signup, Reset password, Magic link, Change email):
   - Click to edit
   - Paste the **Subject** line
   - Switch to **Source** or **HTML** mode
   - Paste the **Body HTML**
   - Click **Save**

3. Make sure your **Site URL** is set correctly in **Authentication** → **URL Configuration**

---

## Disable Email Confirmation (Already Done)

Since you've disabled email confirmation in Supabase, users can sign up and immediately access the app without clicking a confirmation link. The "Confirm Signup" template is only needed if you re-enable this feature later.
