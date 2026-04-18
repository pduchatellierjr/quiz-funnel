# Zapier Email Automation Setup

## Overview
Zapier triggers a personalized email when a couple completes the quiz. The email includes their personalized results link.

## Steps

### 1. Create Zapier Zap
1. Go to zapier.com and log in
2. Click "Create" → New Zap
3. Name it: "Wedding Quiz Email"

### 2. Set Up Trigger (Webhooks)
1. Choose App: Webhooks by Zapier
2. Choose Trigger: Catch Hook
3. Copy the webhook URL
4. Add to `.env.local`: `NEXT_PUBLIC_ZAPIER_WEBHOOK_URL=<webhook_url>`

### 3. Set Up Action (Email)
1. Choose App: Gmail (or your email provider)
2. Choose Action: Send Email
3. Configure:
   - **To:** Use data from webhook (email field)
   - **Subject:** "Your Personalized Wedding Film Profile"
   - **Body:** Create personalized email template using Zapier's formatter:

```html
Hi [name],

Thank you for taking our wedding film quiz!

Based on your answers, we think the [package] Collection is perfect for you because [personalizationMessage].

Here's your personalized profile: [resultsLink]

Click the link to see your full profile and discover why this package is right for you.

Ready to talk? Let's discuss your vision.

Warmly,
[Your Name]
```

4. Test the Zap with sample data from the webhook

### 4. Activate Zap
1. Turn the Zap ON
2. Test by submitting the quiz
3. Verify email arrives with correct personalization
