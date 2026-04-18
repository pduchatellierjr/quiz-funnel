-- Quiz Responses Table
-- Stores all quiz responses with calculated archetype and package assignment

CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  wedding_date DATE,

  -- Quiz answers
  primary_fear VARCHAR(50) NOT NULL,
  planning_stage VARCHAR(50) NOT NULL,
  style_preference INTEGER NOT NULL CHECK (style_preference >= 0 AND style_preference <= 100),

  -- Calculated fields
  archetype VARCHAR(50) NOT NULL,
  recommended_package VARCHAR(50) NOT NULL,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON quiz_responses(email);
CREATE INDEX idx_archetype ON quiz_responses(archetype);
CREATE INDEX idx_package ON quiz_responses(recommended_package);
