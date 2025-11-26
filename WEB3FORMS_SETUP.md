# Web3Forms Integration Setup

## Quick Setup Instructions

### 1. Get Your Web3Forms Access Key

1. Visit [https://web3forms.com](https://web3forms.com)
2. Sign up for a free account (or log in if you already have one)
3. Create a new form or use the default one
4. Copy your **Access Key** from the dashboard

### 2. Add Your Access Key to the Contact Form

1. Open `src/components/Contact.vue`
2. Find this line (around line 168):
   ```javascript
   const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY_HERE'
   ```
3. Replace `'YOUR_WEB3FORMS_ACCESS_KEY_HERE'` with your actual access key:
   ```javascript
   const WEB3FORMS_ACCESS_KEY = 'your-actual-access-key-here'
   ```

### 3. Test the Form

1. Run your development server: `npm run dev`
2. Navigate to the Contact page
3. Fill out the form and submit
4. Check your email inbox for the form submission

## Features Implemented

✅ **Terminal-style UI**
- Status messages display like terminal output: `$ sending message...`
- Blinking cursor animation during loading
- Success: `$ message sent successfully ✓`
- Error: `$ error: failed to send message`

✅ **Form Validation**
- Required field validation
- Email format validation
- Real-time error messages

✅ **Security Features**
- Honeypot anti-bot field (hidden)
- Client-side rate limiting (30-second cooldown)
- No API keys exposed in frontend (Web3Forms handles this securely)

✅ **UX Enhancements**
- Loading states with disabled inputs
- Form clears on successful submission
- Graceful error handling
- Mobile responsive design
- No page refresh (SPA-friendly)

## Example Terminal Outputs

**Before sending:**
```
$ sending message...▊
```

**On success:**
```
$ message sent successfully ✓
```

**On error:**
```
$ error: failed to send message
```

**Rate limited:**
```
$ error: rate limited. please wait 25s
```

## Troubleshooting

### Form not sending?
- Check that your access key is correctly set in `Contact.vue`
- Verify your access key is valid at [web3forms.com](https://web3forms.com)
- Check browser console for any error messages

### Rate limiting issues?
- The form has a 30-second cooldown between submissions
- This is stored in browser localStorage
- Clear localStorage if you need to reset: `localStorage.removeItem('contact_form_last_submit')`

### Not receiving emails?
- Check your Web3Forms dashboard for form submissions
- Verify your email settings in Web3Forms account
- Check spam/junk folder

## Notes

- This integration works perfectly with GitHub Pages (static hosting)
- No backend required - everything is client-side
- Web3Forms handles email delivery securely
- Free tier includes 250 submissions per month

