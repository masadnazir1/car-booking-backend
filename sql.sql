CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('renter', 'dealer')) NOT NULL,
  password_hash TEXT,
  social_login JSONB, -- stores google/facebook tokens
  profile_image TEXT,
  reset_password_token TEXT,
  reset_password_expire BIGINT,
  address JSONB, -- stores street, city, etc.
  status VARCHAR(20) CHECK (status IN ('active', 'suspended', 'deleted')) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dealer_businesses (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  established_year INT,
  registration_number VARCHAR(100),
  tax_id VARCHAR(100),
  address JSONB, -- optional structured address (same format as users)
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo TEXT,
  country VARCHAR(100),
  description TEXT,
  founded_year INT,
  website TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  car_id INT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  renter_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dealer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  days INT NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  discount NUMERIC(12, 2) DEFAULT 0,
  final_amount NUMERIC(12, 2) NOT NULL,
  coupon_id VARCHAR(255),
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  payment_status VARCHAR(20) CHECK (payment_status IN ('unpaid', 'paid', 'refunded')) DEFAULT 'unpaid',
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  dealer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id INT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  images TEXT[], -- PostgreSQL native array for multiple image URLs
  badge VARCHAR(100),
  seats INT,
  doors INT,
  transmission VARCHAR(100),
  fuel VARCHAR(50),
  daily_rate NUMERIC(12, 2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('available', 'unavailable', 'maintenance')) DEFAULT 'available',
  location TEXT NOT NULL,
  ac BOOLEAN DEFAULT TRUE,
  year INT NOT NULL,
  mileage INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('flat', 'percentage')),
    discount_value NUMERIC(10,2) NOT NULL,
    max_discount NUMERIC(10,2),
    min_booking_amount NUMERIC(10,2) DEFAULT 0,
    applicable_categories TEXT[],                 -- e.g. ['SUV','Sedan']
    applicable_dealers UUID[],                    -- store dealer IDs
    eligible_users UUID[],                        -- store user IDs
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    usage_limit INT DEFAULT 1,
    per_user_limit INT DEFAULT 1,
    used_count INT DEFAULT 0,
    -- store usedBy as JSON array of objects [{userId, bookingId, usedAt}]
    used_by JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disabled')),
    created_by UUID NOT NULL,                     -- Admin ID reference
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);






CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    role VARCHAR(20) CHECK (role IN ('dealer', 'renter')) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id SERIAL  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('booking_update', 'payment', 'reminder')),
    message TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id SERIAL NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    payer_id SERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id SERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('card', 'paypal', 'stripe')) DEFAULT 'card',
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('paid', 'failed', 'pending', 'refunded')) DEFAULT 'pending',

    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    commission NUMERIC(10, 2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id SERIAL NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    rater_id SERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dealer_id SERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id SERIAL NOT NULL REFERENCES cars(id) ON DELETE CASCADE,

    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);




CREATE TABLE saved_cars (
    id SERIAL PRIMARY KEY,
    user_id SERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id SERIAL NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, car_id)  -- Prevent duplicate saved cars per user
);


CREATE TABLE user_coupons (
    id SERIAL PRIMARY KEY,
    user_id SERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coupon_id SERIAL NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    assigned_by SERIAL NOT NULL REFERENCES users(id) ON DELETE SET NULL,

    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id) ON DELETE CASCADE, -- optional, if message is about a booking
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    message_type VARCHAR(20) CHECK (message_type IN ('text', 'image', 'file')) DEFAULT 'text',
    attachment_url TEXT, -- if message_type is 'image' or 'file'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);








