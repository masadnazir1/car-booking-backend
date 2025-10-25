-- ===============================================
-- SEED DATA FOR CAR BOOKING SYSTEM
-- ===============================================

-- 1. USERS
INSERT INTO users (full_name, email, phone, role, password_hash, status)
VALUES
('Ali Khan', 'ali@example.com', '03001112222', 'renter', 'hashed_password_1', 'active'),
('Sara Ahmed', 'sara@example.com', '03003334444', 'dealer', 'hashed_password_2', 'active'),
('Bilal Iqbal', 'bilal@example.com', '03005556666', 'dealer', 'hashed_password_3', 'active');

-- 2. DEALER BUSINESSES
INSERT INTO dealer_businesses (user_id, business_name, logo_url, description, established_year, registration_number, tax_id, status)
VALUES
(2, 'Prime Motors', 'https://example.com/logo1.png', 'Luxury car dealer', 2015, 'REG-1001', 'TAX-2001', 'approved'),
(3, 'City Drive Rentals', 'https://example.com/logo2.png', 'Affordable rentals for everyone', 2018, 'REG-1002', 'TAX-2002', 'approved'),
(3, 'AutoHub', 'https://example.com/logo3.png', 'New and used cars dealership', 2016, 'REG-1003', 'TAX-2003', 'pending');

-- 3. DEALER CUSTOMERS
INSERT INTO dealer_customers (dealer_id, customer_id)
VALUES
(2, 1),
(3, 1),
(3, 2);

-- 4. BRANDS
INSERT INTO brands (name, slug, country, founded_year, website)
VALUES
('Toyota', 'toyota', 'Japan', 1937, 'https://www.toyota.com'),
('Honda', 'honda', 'Japan', 1948, 'https://www.honda.com'),
('BMW', 'bmw', 'Germany', 1916, 'https://www.bmw.com');

-- 5. CATEGORIES
INSERT INTO categories (name, description)
VALUES
('SUV', 'Sport Utility Vehicles'),
('Sedan', 'Comfortable city cars'),
('Hatchback', 'Compact and efficient');

-- 6. CARS
INSERT INTO cars (dealer_id, brand_id, category_id, name, description, images, badge, seats, doors, transmission, fuel, daily_rate, location, ac, year, mileage)
VALUES
(2, 1, 1, 'Toyota Fortuner', 'Spacious SUV with 7 seats', ARRAY['https://example.com/fortuner1.jpg'], 'Premium', 7, 5, 'Automatic', 'Diesel', 150.00, 'Islamabad', TRUE, 2021, 30000),
(3, 2, 2, 'Honda Civic', 'Comfortable sedan with sleek design', ARRAY['https://example.com/civic1.jpg'], 'Sport', 5, 4, 'Manual', 'Petrol', 100.00, 'Lahore', TRUE, 2020, 25000),
(3, 3, 3, 'BMW X3', 'Luxury compact SUV', ARRAY['https://example.com/bmw-x3.jpg'], 'Luxury', 5, 4, 'Automatic', 'Petrol', 300.00, 'Karachi', TRUE, 2022, 10000);

-- 7. COUPONS
INSERT INTO coupons (code, discount_type, discount_value, start_date, end_date, created_by)
VALUES
('SAVE10', 'percentage', 10.00, NOW(), NOW() + INTERVAL '30 days', 2),
('FLAT500', 'flat', 500.00, NOW(), NOW() + INTERVAL '15 days', 3),
('DEAL20', 'percentage', 20.00, NOW(), NOW() + INTERVAL '10 days', 3);

-- 8. BOOKINGS
INSERT INTO bookings (car_id, renter_id, dealer_id, start_date, end_date, days, total_price, discount, final_amount, coupon_id, status, payment_status, pickup_location, dropoff_location)
VALUES
(1, 1, 2, NOW(), NOW() + INTERVAL '2 days', 2, 300.00, 30.00, 270.00, 1, 'confirmed', 'paid', 'Islamabad', 'Lahore'),
(2, 1, 3, NOW(), NOW() + INTERVAL '3 days', 3, 300.00, 0.00, 300.00, NULL, 'pending', 'unpaid', 'Lahore', 'Karachi'),
(3, 1, 3, NOW(), NOW() + INTERVAL '1 day', 1, 300.00, 60.00, 240.00, 3, 'completed', 'paid', 'Karachi', 'Karachi');

-- 9. FAQS
INSERT INTO faqs (title, description, role)
VALUES
('How to book a car?', 'Simply select your preferred car and booking dates.', 'renter'),
('How to list my cars?', 'Register as a dealer and add your business details.', 'dealer'),
('Payment options?', 'We support card and PayPal for now.', 'renter');

-- 10. NOTIFICATIONS
INSERT INTO notifications (user_id, type, message)
VALUES
(1, 'booking_update', 'Your booking has been confirmed.'),
(2, 'payment', 'Payment received for booking #1.'),
(3, 'reminder', 'Car maintenance reminder.');

-- 11. PAYMENTS
INSERT INTO payments (booking_id, payer_id, receiver_id, amount, payment_method, payment_status, transaction_id, commission)
VALUES
(1, 1, 2, 270.00, 'card', 'paid', 'TXN001', 27.00),
(2, 1, 3, 300.00, 'paypal', 'pending', 'TXN002', 30.00),
(3, 1, 3, 240.00, 'stripe', 'paid', 'TXN003', 24.00);

-- 12. REVIEWS
INSERT INTO reviews (booking_id, rater_id, dealer_id, car_id, rating, comment)
VALUES
(1, 1, 2, 1, 5, 'Excellent car and smooth process.'),
(2, 1, 3, 2, 4, 'Good experience, minor issues.'),
(3, 1, 3, 3, 5, 'Perfect!');

-- 13. SAVED CARS
INSERT INTO saved_cars (user_id, car_id)
VALUES
(1, 1),
(1, 2),
(1, 3);

-- 14. USER COUPONS
INSERT INTO user_coupons (user_id, coupon_id, assigned_by, used)
VALUES
(1, 1, 2, TRUE),
(1, 2, 3, FALSE),
(2, 3, 3, FALSE);

-- 15. MESSAGES
INSERT INTO messages (booking_id, sender_id, receiver_id, message)
VALUES
(1, 1, 2, 'Hi, I have confirmed the booking.'),
(1, 2, 1, 'Thanks, the car will be ready tomorrow.'),
(3, 3, 1, 'Hope you enjoyed your trip!');
