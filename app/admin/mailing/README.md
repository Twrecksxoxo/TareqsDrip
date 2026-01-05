# Admin Mailing

This folder adds an **admin-only sale email sender** at:

- `GET /admin/mailing`

It uses your existing admin authorization logic (`ADMIN_EMAIL` + Clerk) and sends email via **SMTP**.

## Environment variables

Add these to your `.env` (or deployment environment):

- `ADMIN_EMAIL=your-admin@email.com,other-admin@email.com`
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_USER=your-email@gmail.com`
- `SMTP_PASS=<16-character-app-password>`
- `MAIL_FROM="Tareqs Bazaar <your-email@gmail.com>"`

> Never commit real SMTP passwords (or any secrets) to git.

## API routes

- `GET /api/admin/mailing/recipients?audience=all|buyers`
  - returns `{ audience, total }`

- `POST /api/admin/mailing/send`
  - body:
    ```json
    {
      "subject": "string",
      "html": "string (optional)",
      "text": "string (optional)",
      "audience": "all | buyers",
      "dryRun": true,
      "limit": 200,
      "batchSize": 25,
      "batchDelayMs": 400
    }
    ```

## Notes / safety

- Start with **Dry run** to confirm the recipient count.
- Sending is done sequentially in batches to reduce SMTP throttling.
- This is a minimal implementation. For large lists or guaranteed delivery, next step would be pushing each recipient to a background job (you already have Inngest set up in this repo).
