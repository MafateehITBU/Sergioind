# FileCenter API - cURL Commands

## Base URL
```
http://localhost:5001/api/filecenter
```

## 1. Public Endpoints (No Authentication Required)

### Get All Files
```bash
curl -X GET "http://localhost:5001/api/filecenter"
```

### Get All Files with Filters
```bash
curl -X GET "http://localhost:5001/api/filecenter?page=1&limit=10&search=document&sortBy=createdAt&sortOrder=desc&status=active"
```

### Get File by ID
```bash
curl -X GET "http://localhost:5001/api/filecenter/FILE_ID_HERE"
```

### Download File
```bash
curl -X GET "http://localhost:5001/api/filecenter/FILE_ID_HERE/download" \
  --output "downloaded_file.pdf"
```

### View File (Get file info and increment view count)
```bash
curl -X GET "http://localhost:5001/api/filecenter/FILE_ID_HERE/view"
```

## 2. Admin Endpoints (Require Authentication)

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

### Create FileCenter Entry (Upload File and Image)
```bash
curl -X POST "http://localhost:5001/api/filecenter" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Important Document" \
  -F "description=This is a very important document that contains crucial information for the project" \
  -F "file=@/path/to/your/document.pdf" \
  -F "image=@/path/to/your/thumbnail.jpg"
```

### Create FileCenter Entry (File Only)
```bash
curl -X POST "http://localhost:5001/api/filecenter" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Technical Manual" \
  -F "description=Complete technical manual for the system implementation" \
  -F "file=@/path/to/your/manual.pdf"
```

### Create FileCenter Entry (Image Only)
```bash
curl -X POST "http://localhost:5001/api/filecenter" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Product Image" \
  -F "description=High quality product image for marketing materials" \
  -F "image=@/path/to/your/product.jpg"
```

### Update FileCenter Entry
```bash
curl -X PUT "http://localhost:5001/api/filecenter/FILE_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Updated Document Name" \
  -F "description=Updated description for the document" \
  -F "file=@/path/to/your/new_document.pdf" \
  -F "image=@/path/to/your/new_thumbnail.jpg"
```

### Update FileCenter Entry (Text Only)
```bash
curl -X PUT "http://localhost:5001/api/filecenter/FILE_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Updated Name" \
  -F "description=Updated description without changing files"
```

### Toggle File Status (Active/Inactive)
```bash
curl -X PATCH "http://localhost:5001/api/filecenter/FILE_ID_HERE/toggle-status" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete File Image Only
```bash
curl -X DELETE "http://localhost:5001/api/filecenter/FILE_ID_HERE/delete-image" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete FileCenter Entry
```bash
curl -X DELETE "http://localhost:5001/api/filecenter/FILE_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get FileCenter Statistics
```bash
curl -X GET "http://localhost:5001/api/filecenter/stats/overview" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Example with Real File Paths

### Upload a PDF Document
```bash
curl -X POST "http://localhost:5001/api/filecenter" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=User Manual" \
  -F "description=Complete user manual for the application with step-by-step instructions" \
  -F "file=@/Users/username/Documents/user_manual.pdf" \
  -F "image=@/Users/username/Pictures/manual_cover.jpg"
```

### Upload an Image File
```bash
curl -X POST "http://localhost:5001/api/filecenter" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Company Logo" \
  -F "description=High resolution company logo for branding purposes" \
  -F "image=@/Users/username/Pictures/company_logo.png"
```

## 4. File Upload Examples for Different File Types

### Upload Excel File
```bash
curl -X POST "http://localhost:5001/api/filecenter" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Sales Report" \
  -F "description=Monthly sales report with detailed analytics" \
  -F "file=@/path/to/sales_report.xlsx"
```

### Upload Word Document
```bash
curl -X POST "http://localhost:5001/api/filecenter" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Project Proposal" \
  -F "description=Detailed project proposal document" \
  -F "file=@/path/to/proposal.docx"
```

### Upload ZIP Archive
```bash
curl -X POST "http://localhost:5001/api/filecenter" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Source Code" \
  -F "description=Complete source code archive for the project" \
  -F "file=@/path/to/source_code.zip"
```

## 5. Response Examples

### Successful File Upload Response
```json
{
  "success": true,
  "message": "FileCenter entry created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f67890123a",
    "name": "Important Document",
    "description": "This is a very important document",
    "fileUrl": "https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/files/document.pdf",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/images/thumbnail.jpg",
    "fileType": "pdf",
    "fileSize": 1024000,
    "downloadCount": 0,
    "viewCount": 0,
    "status": "active",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### File List Response
```json
{
  "success": true,
  "message": "FileCenter entries retrieved successfully",
  "data": {
    "files": [
      {
        "_id": "64f8a1b2c3d4e5f67890123a",
        "name": "Document 1",
        "description": "Description 1",
        "fileUrl": "https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/files/doc1.pdf",
        "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/images/thumb1.jpg",
        "fileType": "pdf",
        "fileSize": 1024000,
        "downloadCount": 5,
        "viewCount": 12,
        "status": "active"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

### Statistics Response
```json
{
  "success": true,
  "message": "FileCenter statistics retrieved successfully",
  "data": {
    "totalFiles": 150,
    "activeFiles": 120,
    "inactiveFiles": 30,
    "totalDownloads": 2500,
    "totalViews": 5000,
    "fileTypes": {
      "pdf": 50,
      "docx": 30,
      "xlsx": 20,
      "jpg": 25,
      "png": 15,
      "zip": 10
    },
    "recentUploads": 15
  }
}
```

## 6. Error Handling

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "File name is required"
    },
    {
      "field": "description",
      "message": "File description must be between 10 and 1000 characters"
    }
  ]
}
```

### File Upload Error
```json
{
  "success": false,
  "message": "Error uploading file to Cloudinary"
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Access denied. Token required"
}
```

## 7. Query Parameters

### Available Query Parameters for GET /filecenter
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in name and description
- `sortBy` - Sort field (name, createdAt, updatedAt, downloadCount, viewCount)
- `sortOrder` - Sort order (asc, desc)
- `status` - Filter by status (active, inactive)
- `fileType` - Filter by file type (pdf, docx, xlsx, jpg, png, etc.)

### Example with Multiple Parameters
```bash
curl -X GET "http://localhost:5001/api/filecenter?page=2&limit=5&search=manual&sortBy=downloadCount&sortOrder=desc&status=active&fileType=pdf"
```

## 8. File Type Support

### Supported File Types
- **Documents**: PDF, DOC, DOCX, TXT, RTF
- **Spreadsheets**: XLS, XLSX, CSV
- **Presentations**: PPT, PPTX
- **Images**: JPG, JPEG, PNG, GIF, BMP, SVG, WEBP
- **Archives**: ZIP, RAR, 7Z, TAR, GZ
- **Code**: JS, TS, PY, JAVA, CPP, C, HTML, CSS, JSON, XML
- **Other**: MP4, MP3, WAV, AVI, MOV

## 9. Notes

1. **File Upload**: Use `-F` for form-data uploads with files
2. **Authentication**: Admin endpoints require Bearer token authentication
3. **File Size**: Maximum file size is 10MB (configurable)
4. **Image Processing**: Images are automatically optimized and resized
5. **Download Tracking**: Download count increments automatically
6. **View Tracking**: View count increments when accessing file info
7. **Cloud Storage**: Files are stored in Cloudinary for reliability
8. **Public Access**: File viewing and downloading are public
9. **Admin Management**: Only admins can upload, update, and delete files
10. **Status Management**: Files can be toggled between active and inactive

## 10. Testing Tips

1. **Test with Small Files**: Start with small files to test the upload functionality
2. **Check File Types**: Ensure your file type is supported
3. **Verify Authentication**: Make sure your token is valid for admin operations
4. **Monitor Response**: Check the response for file URLs and metadata
5. **Test Download**: Verify that downloaded files are complete and uncorrupted 