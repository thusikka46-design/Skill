-- =========================================================================
-- SkillSwap Community Network — Production PostgreSQL DDL Script
-- Architecture Module: Relational Persistence Layer (TimeBank & Skill Match)
-- HND in IT Internship Viva Defense
-- =========================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. ENUMS & DOMAIN TYPES
-- -------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('LEARNER', 'MENTOR', 'BOTH', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE skill_type_enum AS ENUM ('OFFERED', 'WANTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proficiency_enum AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE swap_status_enum AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status_enum AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type_enum AS ENUM ('SWAP_COMPLETION', 'SIGNUP_BONUS', 'ADMIN_ADJUSTMENT', 'DISPUTE_REFUND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -------------------------------------------------------------------------
-- 2. CORE ENTITY TABLES
-- -------------------------------------------------------------------------

-- USERS TABLE
-- Tracks core user credentials, role, bio, and audited TimeBank balance.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'BOTH',
    headline VARCHAR(180),
    bio TEXT,
    time_credit_balance NUMERIC(10, 2) NOT NULL DEFAULT 3.00,
    average_rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_hours_taught NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_hours_learned NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    avatar_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_positive_credits CHECK (time_credit_balance >= 0.00),
    CONSTRAINT chk_valid_rating CHECK (average_rating >= 0.00 AND average_rating <= 5.00)
);

-- SKILLS MASTER CATALOG TABLE
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- USER_SKILLS JUNCTION TABLE
-- Defines mapping of who can teach what ('OFFERED') and who wants to learn what ('WANTED').
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    skill_type skill_type_enum NOT NULL,
    proficiency_level proficiency_enum NOT NULL DEFAULT 'INTERMEDIATE',
    experience_years INT DEFAULT 1 CHECK (experience_years >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_skill_type UNIQUE (user_id, skill_id, skill_type)
);

-- SWAP_REQUESTS TABLE
-- Represents a proposed bilateral or mutual exchange between two swappers.
CREATE TABLE IF NOT EXISTS swap_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_offered_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    skill_wanted_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    status swap_status_enum NOT NULL DEFAULT 'PENDING',
    ai_compatibility_score NUMERIC(5, 2),
    ai_rationale TEXT,
    initial_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_different_swappers CHECK (requester_id <> provider_id)
);

-- SESSIONS TABLE
-- Scheduled live video or 1-on-1 peer teaching session.
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    swap_request_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    meeting_link VARCHAR(500),
    status session_status_enum NOT NULL DEFAULT 'SCHEDULED',
    session_roadmap_json JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_positive_duration CHECK (duration_hours > 0.00)
);

-- TIMEBANK_TRANSACTIONS TABLE
-- Double-entry audit ledger for non-monetary currency transfer: 1 hour = 1 credit.
CREATE TABLE IF NOT EXISTS timebank_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    swap_request_id UUID REFERENCES swap_requests(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    credits_transferred NUMERIC(6, 2) NOT NULL,
    transaction_type transaction_type_enum NOT NULL,
    description VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_positive_transfer CHECK (credits_transferred > 0.00)
);

-- REVIEWS TABLE
-- Peer ratings & feedback collected after verified session completion.
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating_score INT NOT NULL,
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rating_range CHECK (rating_score >= 1 AND rating_score <= 5),
    CONSTRAINT chk_different_reviewers CHECK (reviewer_id <> reviewee_id)
);

-- -------------------------------------------------------------------------
-- 3. HIGH PERFORMANCE B-TREE INDEXES
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(skill_name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_lookup ON user_skills(skill_type, skill_id);

CREATE INDEX IF NOT EXISTS idx_swap_requests_requester ON swap_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_provider ON swap_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_status ON swap_requests(status);

CREATE INDEX IF NOT EXISTS idx_sessions_swap ON sessions(swap_request_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

CREATE INDEX IF NOT EXISTS idx_transactions_sender ON timebank_transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver ON timebank_transactions(receiver_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON timebank_transactions(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_session ON reviews(session_id);

-- -------------------------------------------------------------------------
-- 4. ATOMIC TIMEBANK TRANSACTION STORED PROCEDURE
-- Ensures credit deductions and additions happen inside an atomic ACID transaction.
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION execute_timebank_swap_transfer(
    p_session_id UUID,
    p_learner_id UUID,
    p_mentor_id UUID,
    p_hours NUMERIC
) RETURNS VOID AS $$
DECLARE
    v_balance NUMERIC;
BEGIN
    -- Check learner credit solvency
    SELECT time_credit_balance INTO v_balance FROM users WHERE id = p_learner_id FOR UPDATE;
    IF v_balance < p_hours THEN
        RAISE EXCEPTION 'Insufficient TimeBank credits. Balance is %, required is %', v_balance, p_hours;
    END IF;

    -- Debit Learner
    UPDATE users 
    SET time_credit_balance = time_credit_balance - p_hours,
        total_hours_learned = total_hours_learned + p_hours,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_learner_id;

    -- Credit Mentor
    UPDATE users 
    SET time_credit_balance = time_credit_balance + p_hours,
        total_hours_taught = total_hours_taught + p_hours,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_mentor_id;

    -- Insert Audit Record
    INSERT INTO timebank_transactions (
        sender_id,
        receiver_id,
        session_id,
        credits_transferred,
        transaction_type,
        description
    ) VALUES (
        p_learner_id,
        p_mentor_id,
        p_session_id,
        p_hours,
        'SWAP_COMPLETION',
        CONCAT('TimeBank credit transfer for ', p_hours, ' hour(s) of peer instruction.')
    );
END;
$$ LANGUAGE plpgsql;
