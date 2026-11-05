-- Add optional client-managed trip planning details; existing records remain unchanged.
ALTER TABLE `trek`
  ADD COLUMN `departure_dates` TEXT NULL,
  ADD COLUMN `meeting_point` TEXT NULL,
  ADD COLUMN `inclusions` TEXT NULL,
  ADD COLUMN `exclusions` TEXT NULL,
  ADD COLUMN `required_gear` TEXT NULL,
  ADD COLUMN `cancellation_policy` TEXT NULL,
  ADD COLUMN `refund_policy` TEXT NULL;

ALTER TABLE `expedition`
  ADD COLUMN `departure_dates` TEXT NULL,
  ADD COLUMN `meeting_point` TEXT NULL,
  ADD COLUMN `inclusions` TEXT NULL,
  ADD COLUMN `exclusions` TEXT NULL,
  ADD COLUMN `required_gear` TEXT NULL,
  ADD COLUMN `cancellation_policy` TEXT NULL,
  ADD COLUMN `refund_policy` TEXT NULL;
