# CRM Module API Documentation

## Overview

The CRM (Customer Relationship Management) module provides lead tracking and follow-up management functionality. It allows you to:
- Create and manage leads
- Track registration status
- Schedule and track follow-ups via multiple channels (WhatsApp, Email, SMS)
- Monitor lead progression through stages
- Search and filter leads

**Base URL:** `/api/v1/crm`

---

## Enums

### LeadRegistrationStatus
```
PENDING     - Lead has not yet registered
REGISTERED  - Lead has successfully registered
```

### FollowUpChannel
```
WHATSAPP - Follow-up via WhatsApp
EMAIL    - Follow-up via Email
SMS      - Follow-up via SMS
```

### FollowUpStatus
```
PENDING   - Follow-up is scheduled but not sent
COMPLETED - Follow-up was successfully sent
SKIPPED   - Follow-up was intentionally skipped
FAILED    - Follow-up attempt failed
```

---

## Data Models

### CrmLead
```json
{
  "id": 1,
  "lead_id": "LEAD-00001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "registration_status": "PENDING",
  "current_stage": 1,
  "notes": "Interested in premium package",
  "followups": [],
  "created_at": "2026-06-03T10:00:00+00:00",
  "updated_at": "2026-06-03T10:00:00+00:00"
}
```

### CrmLeadFollowUp
```json
{
  "id": 1,
  "lead_id": 1,
  "step_order": 1,
  "channel": "EMAIL",
  "scheduled_at": "2026-06-05T10:00:00+00:00",
  "sent_at": "2026-06-05T10:15:00+00:00",
  "status": "COMPLETED",
  "notes": "Initial welcome email sent",
  "created_at": "2026-06-03T10:00:00+00:00",
  "updated_at": "2026-06-05T10:15:00+00:00"
}
```

---

## API Endpoints

### 1. Create Lead

Creates a new lead in the CRM system. Lead ID is auto-generated if not provided.

**Endpoint:** `POST /api/v1/crm/leads`

**Request Body:**
```json
{
  "name": "Rohith",
  "email": "test@example.com",
  "phone": "+919876543210",
  "lead_id": "LEAD-001",
  "registration_status": "PENDING",
  "current_stage": null,
  "notes": "Lead from website contact form",
  "followups": []
}
```

**Request Body (with follow-ups):**
```json
{
  "name": "Rohith",
  "email": "test@example.com",
  "phone": "+919876543210",
  "lead_id": "LEAD-001",
  "registration_status": "PENDING",
  "notes": "Lead from website contact form",
  "followups": [
    {
      "step_order": 1,
      "channel": "EMAIL",
      "scheduled_at": "2026-06-05T10:00:00+00:00",
      "status": "PENDING",
      "notes": "Send welcome email"
    },
    {
      "step_order": 2,
      "channel": "WHATSAPP",
      "scheduled_at": "2026-06-07T10:00:00+00:00",
      "status": "PENDING",
      "notes": "WhatsApp introduction message"
    },
    {
      "step_order": 3,
      "channel": "SMS",
      "scheduled_at": "2026-06-10T10:00:00+00:00",
      "status": "PENDING",
      "notes": "SMS reminder"
    }
  ]
}
```

**Minimum Required Fields:**
```json
{
  "name": "Rohith",
  "email": "test@example.com",
  "phone": "+919876543210"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Lead created successfully",
  "data": {
    "id": 1,
    "lead_id": "LEAD-00001",
    "name": "Rohith",
    "email": "test@example.com",
    "phone": "+919876543210",
    "registration_status": "PENDING",
    "current_stage": 1,
    "notes": "Lead from website contact form",
    "followups": [
      {
        "id": 1,
        "lead_id": 1,
        "step_order": 1,
        "channel": "EMAIL",
        "scheduled_at": "2026-06-05T10:00:00+00:00",
        "sent_at": null,
        "status": "PENDING",
        "notes": "Send welcome email",
        "created_at": "2026-06-03T10:00:00+00:00",
        "updated_at": "2026-06-03T10:00:00+00:00"
      }
    ],
    "created_at": "2026-06-03T10:00:00+00:00",
    "updated_at": "2026-06-03T10:00:00+00:00"
  }
}
```

**Error Response (409 Conflict - Duplicate lead_id):**
```json
{
  "detail": "Lead with lead_id 'LEAD-001' already exists"
}
```

---

### 2. List Leads

Retrieves a list of all leads with optional filtering.

**Endpoint:** `GET /api/v1/crm/leads`

**Query Parameters:**
- `skip` (integer, default: 0) - Number of records to skip for pagination
- `limit` (integer, default: 100, max: 1000) - Number of records to return
- `registration_status` (string, optional) - Filter by status: "PENDING" or "REGISTERED"

**Example Request:**
```
GET /api/v1/crm/leads?skip=0&limit=50&registration_status=PENDING
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Leads retrieved successfully",
  "data": [
    {
      "id": 1,
      "lead_id": "LEAD-00001",
      "name": "Rohith",
      "email": "test@example.com",
      "phone": "+919876543210",
      "registration_status": "PENDING",
      "current_stage": 2,
      "notes": "Lead from website",
      "followups": [
        {
          "id": 1,
          "lead_id": 1,
          "step_order": 1,
          "channel": "EMAIL",
          "scheduled_at": "2026-06-05T10:00:00+00:00",
          "sent_at": "2026-06-05T10:15:00+00:00",
          "status": "COMPLETED",
          "notes": "Welcome email sent",
          "created_at": "2026-06-03T10:00:00+00:00",
          "updated_at": "2026-06-05T10:15:00+00:00"
        }
      ],
      "created_at": "2026-06-03T10:00:00+00:00",
      "updated_at": "2026-06-03T10:30:00+00:00"
    }
  ]
}
```

---

### 3. Search Leads

Advanced search with multiple filters and pagination.

**Endpoint:** `POST /api/v1/crm/leads/search`

**Request Body:**
```json
{
  "page": 1,
  "limit": 10,
  "registration_status": "PENDING",
  "lead_id": "LEAD-001",
  "name": "Rohith",
  "email": "test@example.com",
  "phone": "+91987654",
  "current_stage": 2
}
```

**All fields are optional except `page` and `limit`:**
```json
{
  "page": 1,
  "limit": 10
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "lead_id": "LEAD-00001",
      "name": "Rohith",
      "email": "test@example.com",
      "phone": "+919876543210",
      "registration_status": "PENDING",
      "current_stage": 2,
      "notes": null,
      "followups": [],
      "created_at": "2026-06-03T10:00:00+00:00",
      "updated_at": "2026-06-03T10:00:00+00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

---

### 4. Get Lead by ID

Retrieves a single lead by its internal database ID.

**Endpoint:** `GET /api/v1/crm/leads/{lead_pk}`

**Example Request:**
```
GET /api/v1/crm/leads/1
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Lead retrieved successfully",
  "data": {
    "id": 1,
    "lead_id": "LEAD-00001",
    "name": "Rohith",
    "email": "test@example.com",
    "phone": "+919876543210",
    "registration_status": "PENDING",
    "current_stage": 1,
    "notes": "Lead from website",
    "followups": [
      {
        "id": 1,
        "lead_id": 1,
        "step_order": 1,
        "channel": "EMAIL",
        "scheduled_at": "2026-06-05T10:00:00+00:00",
        "sent_at": null,
        "status": "PENDING",
        "notes": null,
        "created_at": "2026-06-03T10:00:00+00:00",
        "updated_at": "2026-06-03T10:00:00+00:00"
      }
    ],
    "created_at": "2026-06-03T10:00:00+00:00",
    "updated_at": "2026-06-03T10:00:00+00:00"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Lead not found"
}
```

---

### 5. Get Lead by Business Lead ID

Retrieves a lead by its business lead_id (e.g., "LEAD-00001").

**Endpoint:** `GET /api/v1/crm/leads/by-lead-id/{business_lead_id}`

**Example Request:**
```
GET /api/v1/crm/leads/by-lead-id/LEAD-00001
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Lead retrieved successfully",
  "data": {
    "id": 1,
    "lead_id": "LEAD-00001",
    "name": "Rohith",
    "email": "test@example.com",
    "phone": "+919876543210",
    "registration_status": "PENDING",
    "current_stage": 1,
    "notes": null,
    "followups": [],
    "created_at": "2026-06-03T10:00:00+00:00",
    "updated_at": "2026-06-03T10:00:00+00:00"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Lead not found"
}
```

---

### 6. Update Lead

Updates an existing lead's information.

**Endpoint:** `PUT /api/v1/crm/leads/{lead_pk}`

**Request Body (all fields optional):**
```json
{
  "name": "Rohith Kumar",
  "email": "rohith.updated@example.com",
  "phone": "+919876543210",
  "registration_status": "REGISTERED",
  "current_stage": 3,
  "notes": "Lead successfully converted"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Lead updated successfully",
  "data": {
    "id": 1,
    "lead_id": "LEAD-00001",
    "name": "Rohith Kumar",
    "email": "rohith.updated@example.com",
    "phone": "+919876543210",
    "registration_status": "REGISTERED",
    "current_stage": 3,
    "notes": "Lead successfully converted",
    "followups": [],
    "created_at": "2026-06-03T10:00:00+00:00",
    "updated_at": "2026-06-03T15:30:00+00:00"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Lead not found"
}
```

---

### 7. Update Lead Registration Status

Updates only the registration status of a lead.

**Endpoint:** `PATCH /api/v1/crm/leads/{lead_pk}/registration-status`

**Request Body:**
```json
{
  "registration_status": "REGISTERED"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Lead registration status updated successfully",
  "data": {
    "id": 1,
    "lead_id": "LEAD-00001",
    "name": "Rohith",
    "email": "test@example.com",
    "phone": "+919876543210",
    "registration_status": "REGISTERED",
    "current_stage": 1,
    "notes": null,
    "followups": [],
    "created_at": "2026-06-03T10:00:00+00:00",
    "updated_at": "2026-06-03T15:45:00+00:00"
  }
}
```

---

### 8. Update Lead Current Stage

Updates the current follow-up stage for a lead.

**Endpoint:** `PATCH /api/v1/crm/leads/{lead_pk}/current-stage`

**Request Body:**
```json
{
  "current_stage": 2
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Lead current stage updated successfully",
  "data": {
    "id": 1,
    "lead_id": "LEAD-00001",
    "name": "Rohith",
    "email": "test@example.com",
    "phone": "+919876543210",
    "registration_status": "PENDING",
    "current_stage": 2,
    "notes": null,
    "followups": [],
    "created_at": "2026-06-03T10:00:00+00:00",
    "updated_at": "2026-06-03T16:00:00+00:00"
  }
}
```

---

### 9. Delete Lead

Deletes a lead and all associated follow-ups (CASCADE).

**Endpoint:** `DELETE /api/v1/crm/leads/{lead_pk}`

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Lead deleted successfully",
  "data": {
    "lead_id": 1,
    "business_lead_id": "LEAD-00001"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Lead not found"
}
```

---

## Follow-Up Management Endpoints

### 10. Create Follow-Up

Creates a new follow-up for an existing lead.

**Endpoint:** `POST /api/v1/crm/leads/{lead_pk}/followups`

**Request Body:**
```json
{
  "step_order": 4,
  "channel": "WHATSAPP",
  "scheduled_at": "2026-06-15T14:00:00+00:00",
  "sent_at": null,
  "status": "PENDING",
  "notes": "Final reminder before closing"
}
```

**Minimum Required Fields:**
```json
{
  "step_order": 4,
  "channel": "WHATSAPP",
  "scheduled_at": "2026-06-15T14:00:00+00:00"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Follow-up created successfully",
  "data": {
    "id": 4,
    "lead_id": 1,
    "step_order": 4,
    "channel": "WHATSAPP",
    "scheduled_at": "2026-06-15T14:00:00+00:00",
    "sent_at": null,
    "status": "PENDING",
    "notes": "Final reminder before closing",
    "created_at": "2026-06-03T16:30:00+00:00",
    "updated_at": "2026-06-03T16:30:00+00:00"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Lead not found"
}
```

---

### 11. List Follow-Ups

Retrieves all follow-ups for a specific lead.

**Endpoint:** `GET /api/v1/crm/leads/{lead_pk}/followups`

**Example Request:**
```
GET /api/v1/crm/leads/1/followups
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Follow-ups retrieved successfully",
  "data": [
    {
      "id": 1,
      "lead_id": 1,
      "step_order": 1,
      "channel": "EMAIL",
      "scheduled_at": "2026-06-05T10:00:00+00:00",
      "sent_at": "2026-06-05T10:15:00+00:00",
      "status": "COMPLETED",
      "notes": "Welcome email sent successfully",
      "created_at": "2026-06-03T10:00:00+00:00",
      "updated_at": "2026-06-05T10:15:00+00:00"
    },
    {
      "id": 2,
      "lead_id": 1,
      "step_order": 2,
      "channel": "WHATSAPP",
      "scheduled_at": "2026-06-07T10:00:00+00:00",
      "sent_at": null,
      "status": "PENDING",
      "notes": "WhatsApp introduction",
      "created_at": "2026-06-03T10:00:00+00:00",
      "updated_at": "2026-06-03T10:00:00+00:00"
    }
  ]
}
```

---

### 12. Get Single Follow-Up

Retrieves a specific follow-up by ID.

**Endpoint:** `GET /api/v1/crm/leads/{lead_pk}/followups/{followup_pk}`

**Example Request:**
```
GET /api/v1/crm/leads/1/followups/2
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Follow-up retrieved successfully",
  "data": {
    "id": 2,
    "lead_id": 1,
    "step_order": 2,
    "channel": "WHATSAPP",
    "scheduled_at": "2026-06-07T10:00:00+00:00",
    "sent_at": null,
    "status": "PENDING",
    "notes": "WhatsApp introduction",
    "created_at": "2026-06-03T10:00:00+00:00",
    "updated_at": "2026-06-03T10:00:00+00:00"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Follow-up not found"
}
```

---

### 13. Update Follow-Up

Updates an existing follow-up. When status is changed to "COMPLETED", the lead's current_stage is automatically advanced to the next pending step.

**Endpoint:** `PUT /api/v1/crm/leads/{lead_pk}/followups/{followup_pk}`

**Request Body (all fields optional):**
```json
{
  "step_order": 2,
  "channel": "WHATSAPP",
  "scheduled_at": "2026-06-07T14:00:00+00:00",
  "sent_at": "2026-06-07T14:05:00+00:00",
  "status": "COMPLETED",
  "notes": "WhatsApp message sent successfully"
}
```

**Common Use Case - Mark as Completed:**
```json
{
  "status": "COMPLETED",
  "sent_at": "2026-06-07T14:05:00+00:00",
  "notes": "Sent via n8n automation"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Follow-up updated successfully",
  "data": {
    "id": 2,
    "lead_id": 1,
    "step_order": 2,
    "channel": "WHATSAPP",
    "scheduled_at": "2026-06-07T14:00:00+00:00",
    "sent_at": "2026-06-07T14:05:00+00:00",
    "status": "COMPLETED",
    "notes": "WhatsApp message sent successfully",
    "created_at": "2026-06-03T10:00:00+00:00",
    "updated_at": "2026-06-07T14:05:00+00:00"
  }
}
```

---

### 14. Delete Follow-Up

Deletes a specific follow-up and recalculates the lead's current stage.

**Endpoint:** `DELETE /api/v1/crm/leads/{lead_pk}/followups/{followup_pk}`

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Follow-up deleted successfully",
  "data": {
    "followup_id": 2,
    "lead_id": 1
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Follow-up not found"
}
```

---

## Common Workflows

### Workflow 1: Create Lead and Schedule Follow-Ups

1. **Create lead with follow-ups in one call:**
```json
POST /api/v1/crm/leads
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+919876543210",
  "followups": [
    {
      "step_order": 1,
      "channel": "EMAIL",
      "scheduled_at": "2026-06-05T09:00:00+00:00"
    },
    {
      "step_order": 2,
      "channel": "WHATSAPP",
      "scheduled_at": "2026-06-07T09:00:00+00:00"
    },
    {
      "step_order": 3,
      "channel": "SMS",
      "scheduled_at": "2026-06-10T09:00:00+00:00"
    }
  ]
}
```

### Workflow 2: Process Follow-Up (n8n Automation)

1. **Query pending follow-ups:**
```json
POST /api/v1/crm/leads/search
{
  "page": 1,
  "limit": 100
}
```

2. **For each lead, get follow-ups:**
```
GET /api/v1/crm/leads/{lead_id}/followups
```

3. **Filter pending follow-ups where `scheduled_at <= now` and `status == "PENDING"`**

4. **Send message via external service (WhatsApp/Email/SMS)**

5. **Update follow-up status:**
```json
PUT /api/v1/crm/leads/{lead_id}/followups/{followup_id}
{
  "status": "COMPLETED",
  "sent_at": "2026-06-07T10:15:23+00:00",
  "notes": "Sent via n8n - Message ID: msg_12345"
}
```

### Workflow 3: Convert Lead to Registered

1. **Update registration status:**
```json
PATCH /api/v1/crm/leads/{lead_id}/registration-status
{
  "registration_status": "REGISTERED"
}
```

### Workflow 4: Search and Filter Leads

1. **Find all pending leads at stage 2:**
```json
POST /api/v1/crm/leads/search
{
  "page": 1,
  "limit": 50,
  "registration_status": "PENDING",
  "current_stage": 2
}
```

2. **Find leads by phone number:**
```json
POST /api/v1/crm/leads/search
{
  "page": 1,
  "limit": 10,
  "phone": "+91987654"
}
```

---

## Important Notes

### Lead ID Generation
- If `lead_id` is not provided during creation, it will be auto-generated in format `LEAD-00001`, `LEAD-00002`, etc.
- If provided, it will be normalized to uppercase and uniqueness is enforced

### Current Stage Behavior
- `current_stage` represents the active follow-up step number
- When a follow-up is marked as `COMPLETED`, the system automatically advances `current_stage` to the next `PENDING` follow-up
- If no follow-ups exist, `current_stage` is `null`
- You can manually set `current_stage` using the PATCH endpoint

### Phone Number Validation
- Must be 8-15 digits
- Can optionally start with `+` for country code
- Spaces and hyphens are allowed but normalized

### Timestamps
- All timestamps use ISO 8601 format with timezone
- `scheduled_at` is required when creating follow-ups
- `sent_at` should be set when the follow-up is actually sent
- `created_at` and `updated_at` are automatically managed

### Pagination
- Default page size is 10-100 depending on endpoint
- Maximum page size is 1000 for list endpoints, 100 for search
- Pagination response includes `has_next` and `has_prev` for easy navigation

### Error Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate lead_id)
- `500` - Internal Server Error

---

## Example n8n Integration Points

### 1. Webhook to Create Lead
Trigger: External form submission
Action: POST to `/api/v1/crm/leads`

### 2. Scheduled Workflow to Send Follow-Ups
Trigger: Cron (every 5 minutes)
Actions:
1. Search all leads
2. For each lead, get follow-ups
3. Filter by `scheduled_at <= now AND status == PENDING`
4. Send via channel (WhatsApp/Email/SMS)
5. Update follow-up status to COMPLETED

### 3. Lead Status Sync
Trigger: Webhook from registration system
Action: PATCH to `/api/v1/crm/leads/{id}/registration-status`

### 4. Daily Report
Trigger: Cron (daily at 9 AM)
Actions:
1. Search leads with `registration_status=PENDING`
2. Generate report
3. Send via email

---

## Authentication

**Note:** Add your authentication mechanism here (e.g., Bearer tokens, API keys, etc.)

Example:
```
Authorization: Bearer your_api_token_here
```

---

## Rate Limiting

**Note:** Add rate limiting information if applicable.

---

## Support

For issues or questions regarding the CRM API, please contact the development team.

**API Version:** 1.0  
**Last Updated:** June 3, 2026
