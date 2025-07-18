# Supabase Email Configuration for FreshSense

This guide will help you fix the email confirmation issues and update branding from "Supabase Auth" to "FreshSense".

## 🔧 Quick Fixes Required

### 1. Update Site URL (Critical)

**Current Issue**: Emails contain `http://localhost:3000/auth` 
**Fix**: Change to production URL

**Steps**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your FreshSense project
3. Navigate to **Authentication** → **Settings**
4. Update **Site URL**: `https://freshsense-ai.vercel.app`
5. Click **Save**

### 2. Update Redirect URLs

**Add these URLs in Authentication → Settings → Redirect URLs**:
```
https://freshsense-ai.vercel.app/auth
https://freshsense-ai.vercel.app/auth/confirm
https://freshsense-ai.vercel.app/**
```

**Remove these URLs**:
```
http://localhost:3000/auth
http://localhost:3000/**
```

## 📧 Email Template Customization

### 3. Confirm Signup Email

**Path**: Authentication → Email Templates → Confirm signup

**Subject**: `Welcome to FreshSense - Confirm Your Account`

**Template**:
```html
<h2>Welcome to FreshSense! 🥬</h2>

<p>Thank you for joining FreshSense, the AI-powered food freshness analyzer that helps you:</p>
<ul>
  <li>🔍 Analyze food freshness with AI</li>
  <li>👨‍🍳 Get personalized recipe suggestions</li>
  <li>🛒 Shop ingredients with one click</li>
  <li>♻️ Reduce food waste and save money</li>
</ul>

<p>Click the button below to confirm your account and start analyzing your food:</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #10b981; color: white; padding: 12px 24px; 
            text-decoration: none; border-radius: 8px; font-weight: bold; 
            display: inline-block;">
    Confirm Your FreshSense Account
  </a>
</div>

<p>Or copy and paste this link into your browser:</p>
<p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>

<hr style="margin: 30px 0; border: 1px solid #e5e7eb;">

<p style="color: #6b7280; font-size: 14px;">
  If you didn't create a FreshSense account, you can safely ignore this email.
</p>

<p style="color: #6b7280; font-size: 14px;">
  Thanks,<br>
  The FreshSense Team<br>
  <em>Reduce waste • Save money • Stay healthy</em>
</p>
```

### 4. Magic Link Email

**Path**: Authentication → Email Templates → Magic Link

**Subject**: `Sign in to FreshSense`

**Template**:
```html
<h2>Sign in to FreshSense 🥬</h2>

<p>Click the button below to sign in to your FreshSense account:</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{ .TokenHash }}" 
     style="background-color: #10b981; color: white; padding: 12px 24px; 
            text-decoration: none; border-radius: 8px; font-weight: bold; 
            display: inline-block;">
    Sign in to FreshSense
  </a>
</div>

<p>Or copy and paste this link into your browser:</p>
<p><a href="{{ .TokenHash }}">{{ .TokenHash }}</a></p>

<p style="color: #6b7280; font-size: 14px;">
  This link will expire in 1 hour for security reasons.
</p>

<hr style="margin: 30px 0; border: 1px solid #e5e7eb;">

<p style="color: #6b7280; font-size: 14px;">
  If you didn't request this sign-in link, you can safely ignore this email.
</p>

<p style="color: #6b7280; font-size: 14px;">
  Thanks,<br>
  The FreshSense Team
</p>
```

### 5. Reset Password Email

**Path**: Authentication → Email Templates → Reset Password

**Subject**: `Reset Your FreshSense Password`

**Template**:
```html
<h2>Reset Your FreshSense Password 🔑</h2>

<p>We received a request to reset the password for your FreshSense account.</p>

<p>Click the button below to create a new password:</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{ .TokenHash }}" 
     style="background-color: #10b981; color: white; padding: 12px 24px; 
            text-decoration: none; border-radius: 8px; font-weight: bold; 
            display: inline-block;">
    Reset Your Password
  </a>
</div>

<p>Or copy and paste this link into your browser:</p>
<p><a href="{{ .TokenHash }}">{{ .TokenHash }}</a></p>

<p style="color: #6b7280; font-size: 14px;">
  This link will expire in 1 hour for security reasons.
</p>

<hr style="margin: 30px 0; border: 1px solid #e5e7eb;">

<p style="color: #6b7280; font-size: 14px;">
  If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
</p>

<p style="color: #6b7280; font-size: 14px;">
  Thanks,<br>
  The FreshSense Team<br>
  <em>Reduce waste • Save money • Stay healthy</em>
</p>
```

## 🎨 Advanced Email Settings

### 6. Custom SMTP (Optional - Paid Plans)

For complete branding control:

1. **Authentication** → **Settings** → **SMTP Settings**
2. Configure custom SMTP with your domain
3. Set **From Name**: "FreshSense"
4. Set **From Email**: "noreply@freshsense-ai.com" (if you have custom domain)

### 7. Email Rate Limiting

Adjust in **Authentication** → **Settings**:
- **Rate Limit**: Reasonable limits for production
- **Email Confirm**: Enable for security

## ✅ Testing Checklist

After making changes, test:

1. **Sign Up Flow**:
   - [ ] Create new account
   - [ ] Email arrives with FreshSense branding
   - [ ] Confirmation link points to `freshsense-ai.vercel.app`
   - [ ] Confirmation works without errors

2. **Password Reset**:
   - [ ] Request password reset
   - [ ] Email has FreshSense branding
   - [ ] Reset link works correctly

3. **Magic Link** (if using):
   - [ ] Request magic link
   - [ ] Email properly branded
   - [ ] Sign-in successful

## 🐛 Troubleshooting

### Common Issues:

**"Invalid redirect URL"**:
- Ensure production URL is in Redirect URLs list
- Check for typos in URL

**Emails still from localhost**:
- Wait 5-10 minutes for changes to propagate
- Clear browser cache
- Test with incognito/private window

**Templates not updating**:
- Save templates after editing
- Test with new email address

### Support Resources:

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Template Variables](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Custom SMTP Setup](https://supabase.com/docs/guides/platform/custom-domains)

## 📝 Implementation Checklist

- [ ] Update Site URL to production
- [ ] Add production URLs to Redirect URLs
- [ ] Remove localhost URLs
- [ ] Customize Confirm Signup email template
- [ ] Customize Magic Link email template  
- [ ] Customize Reset Password email template
- [ ] Test signup flow
- [ ] Test password reset flow
- [ ] Verify all emails use FreshSense branding
- [ ] Confirm no localhost references remain