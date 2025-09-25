# **Garirent MongoDB Database Design**

**Database Name:** `garirent`

---

## **1. Users Collection**

Stores all platform users (renters and dealers), including social login information.

```json
{
  "_id": ObjectId, // MongoDB primary key
  "fullName": "John Doe", // User's full name
  "email": "john@example.com", // Unique email
  "phone": "+923001234567", // Unique phone
  "role": "renter", // 'renter' or 'dealer'
  "passwordHash": "hashedPassword", // Optional for social login
  "socialLogin": { // Social login providers
    "google": {
      "id": "googleId",
      "token": "oauthToken"
    },
    "facebook": {
      "id": "facebookId",
      "token": "oauthToken"
    }
  },
  "profileImage": "url-to-image", // Avatar/profile picture
  "address": { // Optional physical address
    "street": "123 Street",
    "city": "Lahore",
    "province": "Punjab",
    "country": "Pakistan",
    "zip": "54000",
    "location": {
      "type": "Point", // GeoJSON Point
      "coordinates": [74.3587, 31.5204] // [lng, lat]
    }
  },
  "createdAt": ISODate(),
  "updatedAt": ISODate(),
  "status": "active" // 'active', 'suspended', 'deleted'
}
```

**Indexes:**

- `email` (unique)
- `phone` (unique)
- `role`
- `address.location` (2dsphere) for geospatial queries

---

## **2. Cars Collection**

Stores cars listed by dealers.

```json
{
  "_id": ObjectId,
  "dealerId": ObjectId, // Reference to Users._id
  "name": "Toyota Corolla",
  "category": "Sedan", // Sedan/SUV/Hatchback/Luxury
  "description": "Well-maintained car for daily rental",
  "images": ["url1", "url2"], // Car images
  "badge": "New", // Optional label like 'Popular', 'Premium'
  "seats": 5,
  "doors": 4,
  "transmission": "Automatic",
  "fuel": "Petrol",
  "dailyRate": 50, // Rent per day in currency
  "status": "available", // available/unavailable/maintenance
  "location": { // Car pickup location
    "type": "Point",
    "coordinates": [74.3587, 31.5204]
  },
  "createdAt": ISODate(),
  "updatedAt": ISODate()
}
```

**Indexes:**

- `dealerId`
- `category`
- `status`
- `location` (2dsphere)

---

## **3. Bookings Collection**

Tracks all car bookings.

```json
{
  "_id": ObjectId,
  "carId": ObjectId, // Reference to Cars._id
  "renterId": ObjectId, // Reference to Users._id
  "dealerId": ObjectId, // Reference to Users._id
  "startDate": ISODate(),
  "endDate": ISODate(),
  "days": 5, // Number of booked days
  "totalPrice": 250, // Calculated total
  "status": "pending", // pending/confirmed/cancelled/completed
  "paymentStatus": "unpaid", // unpaid/paid/refunded
  "createdAt": ISODate(),
  "updatedAt": ISODate(),
  "pickupLocation": {
    "type": "Point",
    "coordinates": [74.3587, 31.5204]
  },
  "dropoffLocation": {
    "type": "Point",
    "coordinates": [74.3600, 31.5210]
  }
}
```

**Indexes:**

- `carId`
- `renterId`
- `dealerId`
- `status`
- `startDate`, `endDate`

---

## **4. Payments Collection**

Tracks all payments for bookings.

```json
{
  "_id": ObjectId,
  "bookingId": ObjectId, // Reference to Bookings._id
  "payerId": ObjectId, // Reference to Users._id (renter)
  "receiverId": ObjectId, // Reference to Users._id (dealer)
  "amount": 250,
  "paymentMethod": "card", // card/paypal/stripe
  "paymentStatus": "paid", // paid/failed/pending/refunded
  "transactionId": "txn_123456", // Payment gateway transaction id
  "commission": 25, // Platform commission
  "createdAt": ISODate()
}
```

**Indexes:**

- `bookingId` (unique)
- `payerId`
- `receiverId`

---

## **5. Reviews Collection**

Stores ratings and reviews for cars and dealers.

```json
{
  "_id": ObjectId,
  "bookingId": ObjectId,
  "raterId": ObjectId, // User who rated
  "dealerId": ObjectId,
  "carId": ObjectId,
  "rating": 4.5, // 1 to 5
  "comment": "Excellent car and service",
  "createdAt": ISODate()
}
```

**Indexes:**

- `dealerId`
- `carId`
- `raterId`

---

## **6. Notifications Collection**

For in-app or push notifications.

```json
{
  "_id": ObjectId,
  "userId": ObjectId, // Recipient user
  "type": "booking_update", // booking_update/payment/reminder
  "message": "Your booking is confirmed",
  "read": false,
  "createdAt": ISODate()
}
```

**Indexes:**

- `userId`
- `read`

---

## **7. FAQ / Support Collection**

Platform FAQs and support topics.

```json
{
  "_id": ObjectId,
  "title": "How do payouts work?",
  "description": "Weekly payouts for dealers, after commission deduction.",
  "role": "dealer", // 'dealer' or 'renter'
  "createdAt": ISODate()
}
```

---

## **8. Admin / Settings Collection**

Platform-wide configuration.

```json
{
  "_id": ObjectId,
  "key": "platform_commission_rate",
  "value": 10, // percent
  "updatedAt": ISODate()
}
```

---

## **9. Social Login Handling**

- Stored in `socialLogin` subdocument in `users`.
- Login checks by `socialLogin.google.id` or `socialLogin.facebook.id`.
- Optional password for social users.

---

## **10. Geospatial Queries Example**

```js
// Find cars within 10km radius
db.cars.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: 10000,
    },
  },
  status: "available",
});
```

**Indexes:**

- `location` → 2dsphere

---

## **11. Collection Relationships**

| Collection    | Reference                 |
| ------------- | ------------------------- |
| Cars          | dealerId → Users.\_id     |
| Bookings      | carId → Cars.\_id         |
| Bookings      | renterId → Users.\_id     |
| Bookings      | dealerId → Users.\_id     |
| Payments      | bookingId → Bookings.\_id |
| Payments      | payerId → Users.\_id      |
| Payments      | receiverId → Users.\_id   |
| Reviews       | carId → Cars.\_id         |
| Reviews       | dealerId → Users.\_id     |
| Reviews       | raterId → Users.\_id      |
| Notifications | userId → Users.\_id       |

---

## **12. Index Summary**

- Unique: `email`, `phone`, `transactionId`
- Compound: `dealerId + status` for listings
- Geospatial: 2dsphere on all `location` fields
- TTL (optional): For temporary tokens or OTPs

---

**This design supports:**

- Multi-role users (renters & dealers)
- Social login integration
- Car listings with geospatial search
- Booking, payments, reviews, and notifications
- Admin and global platform settings
