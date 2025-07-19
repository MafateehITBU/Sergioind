# Quotation Request API - cURL Commands

## Base URL
```
http://localhost:5001/api/quotation-requests
```

## 1. Create Quotation Request (Public - No Auth Required)

### Basic Quotation Request
```bash
curl -X POST http://localhost:5001/api/quotation-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "companyName": "ABC Company",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "note": "Please provide competitive pricing",
    "items": [
      {
        "product": "PRODUCT_ID_HERE",
        "size": "SIZE_ID_HERE",
        "flavor": "FLAVOR_ID_HERE",
        "quantity": 10
      },
      {
        "product": "ANOTHER_PRODUCT_ID_HERE",
        "size": "ANOTHER_SIZE_ID_HERE",
        "flavor": "ANOTHER_FLAVOR_ID_HERE",
        "quantity": 5
      }
    ]
  }'
```

### Single Item Quotation Request
```bash
curl -X POST http://localhost:5001/api/quotation-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "555-123-4567",
    "items": [
      {
        "product": "PRODUCT_ID_HERE",
        "size": "SIZE_ID_HERE",
        "flavor": "FLAVOR_ID_HERE",
        "quantity": 25
      }
    ]
  }'
```

## 2. Get Quotation Requests by Email (Public - No Auth Required)

### Get All Requests for an Email
```bash
curl -X GET "http://localhost:5001/api/quotation-requests/email/john.doe@example.com"
```

### Get Requests with Pagination
```bash
curl -X GET "http://localhost:5001/api/quotation-requests/email/john.doe@example.com?page=1&limit=5"
```

## 3. Admin Endpoints (Require Authentication)

### First, Login to Get Token
```bash
curl -X POST http://localhost:5001/api/superadmin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

### Copy the token from the response and use it in subsequent requests

### Get All Quotation Requests (Admin)
```bash
curl -X GET "http://localhost:5001/api/quotation-requests" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Requests with Filters
```bash
curl -X GET "http://localhost:5001/api/quotation-requests?status=ongoing&search=john&page=1&limit=10&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Quotation Request by ID
```bash
curl -X GET "http://localhost:5001/api/quotation-requests/QUOTATION_REQUEST_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Quotation Request Status
```bash
curl -X PATCH "http://localhost:5001/api/quotation-requests/QUOTATION_REQUEST_ID_HERE/status" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ongoing",
    "adminResponse": "We are currently reviewing your request and will get back to you within 24 hours.",
    "totalPrice": 1500.00
  }'
```

### Update Status Only
```bash
curl -X PATCH "http://localhost:5001/api/quotation-requests/QUOTATION_REQUEST_ID_HERE/status" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sent"
  }'
```


### Get Quotation Request Statistics
```bash
curl -X GET "http://localhost:5001/api/quotation-requests/stats" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete Quotation Request
```bash
curl -X DELETE "http://localhost:5001/api/quotation-requests/QUOTATION_REQUEST_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Example with Real IDs

### First, Get Product, Size, and Flavor IDs
```bash
# Get products
curl -X GET "http://localhost:5001/api/products"

# Get sizes
curl -X GET "http://localhost:5001/api/sizes"

# Get flavors
curl -X GET "http://localhost:5001/api/flavors"
```

### Create Quotation Request with Real IDs
```bash
curl -X POST http://localhost:5001/api/quotation-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "companyName": "Tech Solutions Inc",
    "email": "alice@techsolutions.com",
    "phoneNumber": "+1-555-987-6543",
    "note": "Bulk order for corporate event",
    "items": [
      {
        "product": "64f8a1b2c3d4e5f678901234",
        "size": "64f8a1b2c3d4e5f678901235",
        "flavor": "64f8a1b2c3d4e5f678901236",
        "quantity": 50
      },
      {
        "product": "64f8a1b2c3d4e5f678901237",
        "size": "64f8a1b2c3d4e5f678901238",
        "flavor": "64f8a1b2c3d4e5f678901239",
        "quantity": 25
      }
    ]
  }'
```

## 5. Status Values

The quotation request can have three statuses:
- `closed` (default) - Request is received but not yet processed
- `ongoing` - Request is being processed by admin
- `sent` - Quotation has been sent to the customer

## 6. Response Examples

### Successful Creation Response
```json
{
  "success": true,
  "message": "Quotation request created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f67890123a",
    "name": "John Doe",
    "companyName": "ABC Company",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "note": "Please provide competitive pricing",
    "items": [
      {
        "_id": "64f8a1b2c3d4e5f67890123b",
        "product": {
          "_id": "64f8a1b2c3d4e5f678901234",
          "name": "Product Name",
          "sku": "PROD-001",
          "price": 25.99
        },
        "size": {
          "_id": "64f8a1b2c3d4e5f678901235",
          "name": "Large"
        },
        "flavor": {
          "_id": "64f8a1b2c3d4e5f678901236",
          "name": "Chocolate"
        },
        "quantity": 10
      }
    ],
    "status": "closed",
    "totalItems": 10,
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### Statistics Response
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 150,
    "byStatus": {
      "closed": 45,
      "ongoing": 30,
      "sent": 75
    },
    "recentRequests": 12
  }
}
```

## 7. Error Handling

### Validation Error Example
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email"
    },
    {
      "field": "items[0].quantity",
      "message": "Quantity must be at least 1"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Access denied. Token required"
}
```

## Notes

1. **Public Endpoints**: Creating quotation requests and checking by email don't require authentication
2. **Admin Endpoints**: All management operations require admin authentication
3. **Status Tracking**: The system automatically tracks status changes with timestamps
4. **Validation**: All inputs are validated for format and required fields
5. **Pagination**: List endpoints support pagination with page and limit parameters
6. **Search**: Admin can search by name, company name, or email
7. **Sorting**: Results can be sorted by any field in ascending or descending order 