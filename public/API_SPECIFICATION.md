# COMPIA Editora - API Specification (OpenAPI 3.0)

## Base URL: `http://localhost:8080/api`

---

## Authentication

### POST /api/auth/register
**Request:**
```json
{ "name": "string", "email": "string", "password": "string" }
```
**Response 201:**
```json
{ "token": "string", "user": { "id": "string", "name": "string", "email": "string", "role": "CUSTOMER" } }
```

### POST /api/auth/login
**Request:**
```json
{ "email": "string", "password": "string" }
```
**Response 200:**
```json
{ "token": "string", "user": { "id": "string", "name": "string", "email": "string", "role": "CUSTOMER | ADMIN" } }
```

### GET /api/auth/me
**Headers:** `Authorization: Bearer {token}`
**Response 200:**
```json
{ "id": "string", "name": "string", "email": "string", "role": "CUSTOMER | ADMIN" }
```

---

## Products

### GET /api/products
**Query Params:** `category`, `search`, `sort` (price-asc, price-desc, rating, newest), `page`, `size`
**Response 200:**
```json
{
  "content": [
    {
      "id": "string",
      "title": "string",
      "author": "string",
      "description": "string",
      "price": 89.90,
      "productType": "PHYSICAL | EBOOK",
      "stock": 45,
      "imageUrl": "/images/deep-learning.jpg",
      "category": "string",
      "isbn": "string",
      "pages": 420,
      "publishedYear": 2024,
      "rating": 4.8,
      "reviewCount": 127,
      "bundleItems": ["string"]
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "number": 0
}
```

### GET /api/products/{id}
**Response 200:** Single Product object (same as above)

### POST /api/products (Admin)
**Headers:** `Authorization: Bearer {token}`
**Request:**
```json
{
  "title": "string",
  "author": "string",
  "description": "string",
  "price": 89.90,
  "productType": "PHYSICAL",
  "stock": 45,
  "imageUrl": "string",
  "category": "string"
}
```
**Response 201:** Created Product object

### PUT /api/products/{id} (Admin)
**Request:** Partial Product object
**Response 200:** Updated Product object

### DELETE /api/products/{id} (Admin)
**Response 204:** No content

---

## Shipping

### POST /api/shipping/calculate
**Request:**
```json
{
  "cep": "01001000",
  "items": [{ "productId": "1", "quantity": 1, "productType": "PHYSICAL" }]
}
```
**Response 200:**
```json
[
  { "id": "pac", "name": "Correios PAC", "price": 18.50, "estimatedDays": 7, "description": "Entrega econômica" },
  { "id": "sedex", "name": "Correios SEDEX", "price": 32.90, "estimatedDays": 3, "description": "Entrega expressa" },
  { "id": "pickup", "name": "Retirada no local", "price": 0, "estimatedDays": 1, "description": "Retire em nossa sede" },
  { "id": "digital", "name": "Entrega Digital", "price": 0, "estimatedDays": 0, "description": "Download imediato" }
]
```

---

## Payments

### POST /api/payments/pix
**Request:**
```json
{ "orderId": "string", "amount": 84.90 }
```
**Response 200:**
```json
{
  "qrCode": "base64-encoded-image",
  "copyPasteCode": "00020126580014br.gov.bcb.pix...",
  "expiresAt": "2025-03-12T15:00:00Z"
}
```

### POST /api/payments/card
**Request:**
```json
{
  "orderId": "string",
  "amount": 154.30,
  "cardNumber": "4111111111111111",
  "cardHolder": "JOAO SILVA",
  "expiration": "12/26",
  "cvv": "123"
}
```
**Response 200:**
```json
{ "approved": true, "transactionId": "TXN-123456" }
```

---

## Orders

### POST /api/orders
**Headers:** `Authorization: Bearer {token}`
**Request:**
```json
{
  "items": [{ "productId": "1", "quantity": 1 }],
  "customerInfo": { "name": "string", "email": "string", "phone": "string" },
  "shippingAddress": { "cep": "string", "state": "string", "city": "string", "neighborhood": "string", "street": "string", "number": "string", "complement": "string" },
  "shippingMethodId": "pac",
  "paymentMethod": "CREDIT_CARD | PIX"
}
```
**Response 201:**
```json
{
  "id": "ORD-2025-001",
  "paymentStatus": "APPROVED",
  "orderStatus": "PROCESSING",
  "shippingInfo": { "method": "Correios PAC", "estimatedDays": 7 },
  "total": 154.30,
  "downloadLinks": [{ "productId": "3", "title": "ML com Python", "url": "/api/download/ORD-2025-001/3" }]
}
```

### GET /api/orders/{id}
**Response 200:** Full Order object

---

## Downloads

### GET /api/download/{orderId}
**Headers:** `Authorization: Bearer {token}`
**Response 200:** PDF file (application/pdf)

---

## Reviews

### GET /api/products/{id}/reviews
**Response 200:**
```json
[{ "id": "string", "userName": "string", "rating": 5, "comment": "string", "createdAt": "2024-11-15" }]
```

---

## Error Responses
All errors follow:
```json
{ "status": 400, "error": "Bad Request", "message": "Validation failed", "timestamp": "2025-03-12T10:00:00Z" }
```

## Status Codes
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
