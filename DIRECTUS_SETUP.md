# Directus Setup Guide

## Step 1: Configure Directus Collection Permissions

1. Go to your Directus admin panel: https://cy-directus.onrender.com/admin
2. Navigate to **Settings** → **Roles & Permissions**
3. Find the **Public** role
4. Click on **Public** role
5. Find the **tracks** collection
6. Enable **Read** permission for the tracks collection
7. Save the changes

## Step 2: Get Authentication Token (Optional but Recommended)

If you want to use authentication instead of public access:

1. Go to **Settings** → **Access Tokens**
2. Click **Create Token**
3. Give it a name (e.g., "API Token")
4. Set expiration (optional)
5. Copy the generated token
6. Add it to your environment variables

## Step 3: Environment Variables

Create a `.env.local` file in your project root with:

```env
# Directus Configuration
DIRECTUS_URL=https://cy-directus.onrender.com
DIRECTUS_TOKEN=your_token_here_if_using_auth

# Next.js Configuration
NEXT_PUBLIC_DIRECTUS_URL=https://cy-directus.onrender.com
```

## Step 4: Test the API

After setting up permissions, test your API:

```bash
# Test without authentication (if public access is enabled)
curl "https://cy-directus.onrender.com/items/tracks"

# Test with authentication
curl "https://cy-directus.onrender.com/items/tracks" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Step 5: Verify Collection Structure

Make sure your tracks collection has these fields:
- `id` (auto-increment)
- `title` (string)
- `slug` (string, unique)
- `description` (text)
- `level` (string)
- `topic` (string)
- `modules` (relation or number)
- `duration` (string)
- `published` (boolean)
- `progress` (number, optional)

## Troubleshooting

### 403 Forbidden Error
- Check if the collection has public read permissions
- Verify the collection name is exactly "tracks"
- Make sure the collection exists

### 404 Not Found Error
- Verify the collection name
- Check if the collection is published
- Ensure the API endpoint is correct

### 500 Internal Server Error
- Check server logs
- Verify environment variables
- Test the Directus API directly
