## API Endpoints Description

This document provides a description of the API endpoints in this codebase.

### `/api/auth/seller-register`

- **Purpose:** Registers a new seller in the system.
- **Method:** POST
- **Authentication:** None
- **Request Body:** JSON object containing seller information such as company name, email, phone number, registration details, address, and contact information.
  ```json
  {
    "companyName": "Example Company",
    "email": "seller@example.com",
    "phoneNo": "123-456-7890",
    "companyRegistrationNo": "REG123",
    "address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "postalCode": "91234",
    "establishmentYear": "2020",
    "natureOfBusiness": "Retail",
    "panTanNo": "PAN123",
    "contactName": "John Doe",
    "contactPhoneNo": "098-765-4321",
    "country": "USA",
    "dob": "1980-01-01",
    "taxId": "TAX456"
  }
  ```
- **Response Body:**
  - Success (201):
    ```json
    {
      "message": "Seller registration successful. Please wait for admin approval. Your temporary password is 'Welcome'",
      "user": { ... } // New user object
    }
    ```
  - Error (400):
    ```json
    { "message": "User already exists" }
    ```
  - Error (500):
    ```json
    { "message": "Internal server error" }
    ```
- **Error Codes:**
  - 400: Bad Request - If the user already exists.
  - 500: Internal Server Error - If there is an error during registration.

### `/api/auth/logout`

- **Purpose:** Logs out the current user.
- **Method:** POST
- **Authentication:** Requires authentication (session).
- **Request Body:** None
- **Response Body:**
  - Success (200):
    ```json
    { "success": true }
    ```
  - Error (500):
    ```json
    { "error": "Failed to logout" }
    ```
- **Error Codes:**
  - 500: Internal Server Error - If there is an error during logout.

### `/api/auth/[...nextauth]`

- **Purpose:** Handles authentication using NextAuth.js. This route is dynamic and catches all auth-related requests.
- **Methods:** GET, POST
- **Authentication:** Uses CredentialsProvider for email/password login.
- **Request Body:**
  - For login (POST):
    ```json
    {
      "email": "user@example.com",
      "password": "password",
      "role": "SELLER" | "BUYER" | "SUPER_ADMIN"
    }
    ```
- **Response Body:**
  - Success: Redirects to the callback URL after successful authentication.
  - Error: Redirects to the error page (`/login`) with an error message.
- **Error Codes:**
  - 401: Unauthorized - If the credentials are invalid or the account is not approved.

### `/api/auctions`

- **Purpose:**
  - Creates a new auction (POST).
  - Retrieves a list of auctions (GET).
- **Methods:** POST, GET
- **Authentication:** Requires authentication. Only sellers can create auctions.
- **Request Body:**
  - POST:
    ```json
    {
      "title": "Auction Title",
      "description": "Auction description",
      "startPrice": 100,
      "endTime": "2024-12-31T23:59:59.000Z",
      "images": ["url1", "url2"]
    }
    ```
  - GET: None (but supports query parameters)
- **Query Parameters (GET):**
  - `status`: Filters auctions by status (e.g., `ACTIVE`, `PENDING`, `CLOSED`).
  - `sellerId`: Filters auctions by seller ID.
- **Response Body:**
  - POST (Success 200):
    ```json
    { ... } // Newly created auction object
    ```
  - POST (Error 400):
    ```json
    { "error": "Missing required fields" }
    ```
  - GET (Success 200):
    ```json
    [ { ... }, { ... } ] // Array of auction objects
    ```
  - Error (500):
    ```json
    { "error": "Failed to create/fetch auction" }
    ```
- **Error Codes:**
  - 401: Unauthorized - If the user is not authenticated.
  - 403: Forbidden - If a non-seller tries to create an auction.
  - 400: Bad Request - If required fields are missing.
  - 500: Internal Server Error - If there is an error during auction creation/retrieval.

### `/api/admin/sellers`

- **Purpose:** Retrieves a list of sellers for admin users.
- **Method:** GET
- **Authentication:** Requires authentication as a SUPER_ADMIN.
- **Request Body:** None
- **Query Parameters:**
  - `approved`: Filters sellers by approval status (`true` or `false`).
  - `search`: Filters sellers by email, name, company name, or company registration number (case-insensitive).
- **Response Body:**
  - Success (200):
    ```json
    { "sellers": [ { ... }, { ... } ] } // Array of seller objects
    ```
  - Error (401):
    ```json
    { "message": "Not authenticated" }
    ```
  - Error (403):
    ```json
    { "message": "Not authorized" }
    ```
  - Error (500):
    ```json
    { "message": "Failed to fetch sellers", "error": "..." }
    ```
- **Error Codes:**
  - 401: Unauthorized - If the user is not authenticated.
  - 403: Forbidden - If the user is not a SUPER_ADMIN.
  - 500: Internal Server Error - If there is an error during seller retrieval.

### `/api/admin/sellers/[id]/approve`

- **Purpose:** Approves or rejects a seller account.
- **Method:** POST
- **Authentication:** Requires authentication as a SUPER_ADMIN.
- **Request Body:**
  ```json
  { "approve": true | false }
  ```
- **URL Parameter:**
  - `id`: The ID of the seller to approve/reject.
- **Response Body:**
  - Success (200):
    ```json
    {
      "message": "Seller approved/rejected successfully",
      "seller": { ... } // Updated seller object
    }
    ```
  - Error (401):
    ```json
    { "message": "Not authenticated" }
    ```
  - Error (403):
    ```json
    { "message": "Not authorized" }
    ```
  - Error (404):
    ```json
    { "message": "Seller not found" }
    ```
  - Error (500):
    ```json
    { "message": "Failed to process seller approval", "error": "..." }
    ```
- **Error Codes:**
  - 401: Unauthorized - If the user is not authenticated.
  - 403: Forbidden - If the user is not a SUPER_ADMIN.
  - 404: Not Found - If the seller is not found.
  - 500: Internal Server Error - If there is an error during the approval process.

### `/api/admin/auctions/pending`

- **Purpose:** Retrieves a list of pending auctions for admin approval.
- **Method:** GET
- **Authentication:** Requires authentication as a SUPER_ADMIN.
- **Request Body:** None
- **Response Body:**
  - Success (200):
    ```json
    { "auctions": [ { ... }, { ... } ] } // Array of pending auction objects
    ```
  - Error (401):
    ```json
    { "message": "Not authenticated" }
    ```
  - Error (403):
    ```json
    { "message": "Not authorized" }
    ```
  - Error (500):
    ```json
    { "message": "Internal server error", "error": "..." }
    ```
- **Error Codes:**
  - 401: Unauthorized - If the user is not authenticated.
  - 403: Forbidden - If the user is not a SUPER_ADMIN.
  - 500: Internal Server Error - If there is an error during auction retrieval.

### `/api/admin/auctions/[id]/approve`

- **Purpose:** Approves or rejects an auction.
- **Method:** POST
- **Authentication:** Requires authentication as a SUPER_ADMIN.
- **Request Body:**
  ```json
  { "approve": true | false }
  ```
- **URL Parameter:**
  - `id`: The ID of the auction to approve/reject.
- **Response Body:**
  - Success (200):
    ```json
    {
      "message": "Auction approved/rejected successfully",
      "auction": { ... } // Updated auction object
    }
    ```
  - Error (401):
    ```json
    { "message": "Not authenticated" }
    ```
  - Error (403):
    ```json
    { "message": "Not authorized" }
    ```
  - Error (404):
    ```json
    { "message": "Auction not found" }
    ```
  - Error (400):
    ```json
    { "message": "Cannot approve auction from unapproved seller" }
    ```
  - Error (500):
    ```json
    { "message": "Failed to process auction approval", "error": "..." }
    ```
- **Error Codes:**
  - 401: Unauthorized - If the user is not authenticated.
  - 403: Forbidden - If the user is not a SUPER_ADMIN.
  - 404: Not Found - If the auction is not found.
  - 400: Bad Request - If trying to approve an auction from an unapproved seller.
  - 500: Internal Server Error - If there is an error during the approval process.

### `/api/admin/approvals`

- **Purpose:** Retrieves counts of pending sellers, pending auctions, and total users.
- **Method:** GET
- **Authentication:** None (but likely intended for admin use in the UI)
- **Request Body:** None
- **Response Body:**
  ```json
  {
    "pendingSellers": [ { ... }, { ... } ], // Array of pending seller objects
    "pendingAuctions": [ { ... }, { ... } ], // Array of pending auction objects
    "totalUsers": 123 // Total number of users
  }
  ```
- **Error Codes:**

  - 500: Internal Server Error - If there is an error during data retrieval.

- **Purpose:** Updates the approval status of a seller or auction.
- **Method:** PATCH
- **Authentication:** Likely requires admin authentication (SUPER_ADMIN), though not explicitly checked in the code.
- **Request Body:**
  ```json
  {
    "type": "seller" | "auction",
    "id": "recordId",
    "approved": true | false
  }
  ```
- **Response Body:**
  - Success (200):
    ```json
    { "success": true }
    ```
  - Error (500):
    ```json
    { "error": "Failed to update approval" }
    ```
- **Error Codes:**
  - 500: Internal Server Error - If there is an error during the update process.
