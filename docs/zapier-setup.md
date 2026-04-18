# Zapier Email Automation Setup

## Overview

Zapier triggers a personalized email when a couple completes the wedding quiz. The email includes their personalized results link and package recommendation based on their quiz answers.

## How It Works

1. Couple submits quiz via `/api/submit-quiz`
2. API stores response in database and calculates archetype + recommended package
3. API fires POST request to Zapier webhook URL with couple's data
4. Zapier receives webhook and sends personalized email via Gmail (or your email provider)
5. Email includes link to `/results/{id}` with their personalized profile

## Setup Steps

### Step 1: Create Zapier Account

1. Go to [zapier.com](https://zapier.com) and create an account (or log in)
2. Verify your email address

### Step 2: Create New Zap

1. Click **"Create"** → **"New Zap"**
2. Name it: **"Wedding Quiz Email"**

### Step 3: Set Up Trigger (Webhooks by Zapier)

1. Search for and select app: **"Webhooks by Zapier"**
2. Choose trigger: **"Catch Hook"**
3. Click **"Continue"**
4. You'll see a unique webhook URL (e.g., `https://hooks.zapier.com/hooks/catch/...`)
5. **Copy this URL** — you'll need it for your environment configuration
6. Click **"Continue"**

### Step 4: Configure Environment Variable

Add the Zapier webhook URL to your `.env.local` file:

```env
NEXT_PUBLIC_ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_URL
```

This tells the API where to send the webhook when a quiz is submitted.

### Step 5: Set Up Action (Email)

1. In Zapier, click **"+"** to add an action
2. Search for and select: **"Gmail"** (or your preferred email provider)
3. Choose action: **"Send Email"**
4. Connect your Gmail account (or email provider) to Zapier if not already connected
5. Click **"Continue"**

### Step 6: Map Email Fields

Configure the email with the following fields. Use the **"Body"** dropdown to insert dynamic data from the webhook:

#### To
- Click the field and select **"Email"** from the webhook data

#### Subject
```
Your Personalized Wedding Film Profile ✨
```

#### From
- Select the email address from your connected Gmail account

#### Body (HTML)
```html
<p>Hi <strong>[Name]</strong>,</p>

<p>Thank you for taking our wedding film quiz! We loved learning about your vision.</p>

<p>Based on your answers, we think the <strong>[Package]</strong> Collection is perfect for you because it captures the storytelling style that resonates most with your personality.</p>

<p><strong>Here's your personalized profile:</strong></p>
<p><a href="[Results Link]" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Your Profile</a></p>

<p>Your profile breaks down:</p>
<ul>
  <li>Your wedding film archetype: <strong>[Archetype]</strong></li>
  <li>Why this package matches your style</li>
  <li>What you can expect from us</li>
</ul>

<p>Ready to chat about bringing your vision to life? <a href="mailto:hello@yourcompany.com">Let's schedule a call</a>.</p>

<p style="margin-top: 32px; font-size: 14px; color: #666;">
  Warmly,<br>
  Your Wedding Film Team
</p>
```

#### Mapping Instructions

When you click in each field, you'll see options to insert data from the webhook. Map:

- `[Name]` → Select **"name"** from Webhooks by Zapier
- `[Package]` → Select **"package"** from Webhooks by Zapier
- `[Results Link]` → Select **"resultsLink"** from Webhooks by Zapier
- `[Archetype]` → Select **"archetype"** from Webhooks by Zapier

### Step 7: Test the Zap

1. In Zapier, click **"Test"**
2. Go back to your app and submit a test quiz response
3. Zapier should capture the webhook and show the data
4. Review the preview email in Zapier to verify all personalization is correct
5. Click **"Publish"** to complete the test

### Step 8: Activate the Zap

1. Toggle the Zap to **ON** (top right)
2. You'll see a confirmation that the Zap is now active
3. Any quiz submissions will now trigger emails automatically

## Testing the Full Flow

### 1. Test with Sample Data

If you want to test without submitting a real quiz:

1. In Zapier, click the **"Webhooks by Zapier"** trigger
2. Click **"Test"** 
3. Send a test webhook with this curl command:

```bash
curl -X POST https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Jane & John",
    "archetype": "The Storyteller",
    "package": "Documentary",
    "resultsLink": "https://yoursite.com/results/test-123"
  }'
```

Replace `YOUR_WEBHOOK_URL` with your actual webhook URL and update the test data as needed.

### 2. Test with Real Quiz Submission

1. Make sure `NEXT_PUBLIC_ZAPIER_WEBHOOK_URL` is set in `.env.local`
2. Restart your development server
3. Go to the quiz page
4. Complete and submit the quiz
5. Check your email inbox for the personalized email
6. Click the results link to verify it loads correctly

## Troubleshooting

### Email Not Arriving

**Check Zapier logs:**
1. Go to your Zap in Zapier
2. Click **"View Logs"**
3. Look for errors in recent executions
4. Common issues:
   - Webhook URL not copied correctly
   - `.env.local` not reloaded (restart dev server)
   - Gmail account not properly connected to Zapier

**Check API logs:**
1. Look at your Next.js console for webhook errors
2. Verify the `NEXT_PUBLIC_ZAPIER_WEBHOOK_URL` is set and valid
3. Check that email field is being passed correctly from quiz form

### Personalization Not Working

1. In Zapier, check that dynamic fields are properly mapped
2. Verify the webhook is receiving all expected fields (email, name, archetype, package, resultsLink)
3. Test the webhook manually with curl (see Testing section)

### Webhook Not Firing

1. Verify `NEXT_PUBLIC_ZAPIER_WEBHOOK_URL` is set in `.env.local`
2. Restart your development server
3. Check `/api/submit-quiz` endpoint is responding with `success: true`
4. Check browser console and Next.js logs for fetch errors

## Webhook Payload Reference

The `/api/submit-quiz` endpoint sends the following data to Zapier:

```json
{
  "email": "couple@example.com",
  "name": "Jane & John",
  "archetype": "The Storyteller",
  "package": "Documentary",
  "resultsLink": "https://yoursite.com/results/abc-123-def"
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Couple's email address from quiz form |
| `name` | string | Couple's name from quiz form |
| `archetype` | string | Calculated wedding film archetype based on answers (e.g., "The Storyteller", "The Romantic") |
| `package` | string | Recommended package based on style preference and planning stage |
| `resultsLink` | string | Full URL to their personalized results page |

## Advanced Customization

### Change Email Provider

Zapier supports many email providers. To use a different provider:

1. In the Action step, replace Gmail with:
   - **Outlook** for Microsoft accounts
   - **Apple Mail** for iCloud
   - **SMTP** for custom email servers
2. Connect the account and follow the same field mapping process

### Add Conditional Logic

To send different emails based on package type:

1. Add a **"Filter"** between the trigger and action
2. Set condition: `package` equals `"Documentary"` (or other package names)
3. Create separate actions (emails) for each package type
4. This lets you customize messaging per package

### Store Responses in Google Sheets

To keep a record of all quiz responses:

1. Add another action: **"Google Sheets"**
2. Choose: **"Create Spreadsheet Row"**
3. Connect your Google account
4. Map columns to webhook fields
5. All responses will be logged automatically

## Next Steps

Once email automation is working:

1. Monitor Zapier logs to ensure consistent delivery
2. Collect open/click metrics if your email provider supports it
3. Consider A/B testing different email templates
4. Add follow-up emails in Zapier (e.g., reminder after 7 days)
5. Integrate responses with your CRM for lead tracking
