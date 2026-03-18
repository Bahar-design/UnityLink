-- Users
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'volunteer' CHECK (role IN ('admin', 'volunteer')),
  community VARCHAR(100),
  phone VARCHAR(20),
  notify_sms BOOLEAN DEFAULT FALSE,
  notify_email BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts
CREATE TABLE posts (
  post_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  category VARCHAR(30) NOT NULL CHECK (category IN ('junior_youth', 'childrens_class', 'devotional', 'event')),
  title VARCHAR(200) NOT NULL,
  body TEXT,
  community VARCHAR(100),
  event_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations
CREATE TABLE locations (
  location_id SERIAL PRIMARY KEY,
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_type VARCHAR(20) DEFAULT 'house' CHECK (location_type IN ('house', 'apartment_building')),
  status VARCHAR(20) DEFAULT 'unvisited' CHECK (status IN ('unvisited', 'visited', 'engaged')),
  community VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Apartment Units
CREATE TABLE apartment_units (
  unit_id SERIAL PRIMARY KEY,
  location_id INT NOT NULL REFERENCES locations(location_id),
  unit_number VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'unvisited' CHECK (status IN ('unvisited', 'visited', 'engaged'))
);

-- Visits
CREATE TABLE visits (
  visit_id SERIAL PRIMARY KEY,
  location_id INT REFERENCES locations(location_id),
  unit_id INT REFERENCES apartment_units(unit_id),
  user_id INT NOT NULL REFERENCES users(user_id),
  visit_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Insights
CREATE TABLE ai_insights (
  insight_id SERIAL PRIMARY KEY,
  visit_id INT NOT NULL REFERENCES visits(visit_id),
  interest_type VARCHAR(100),
  priority_level VARCHAR(10) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
  suggested_action TEXT,
  reasoning TEXT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions
CREATE TABLE subscriptions (
  sub_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id),
  community VARCHAR(100) NOT NULL,
  channel VARCHAR(10) DEFAULT 'both' CHECK (channel IN ('sms', 'email', 'both'))
);