import { format } from "date-fns";
import { enUS } from "date-fns/locale";

// Format number with thousand separator
export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-US").format(num);
};

// Format tonnage with kg unit
export const formatTonnage = (kg) => {
  return `${formatNumber(kg)} kg`;
};

// Format date
export const formatDate = (date, formatStr = "MM/dd/yyyy") => {
  return format(new Date(date), formatStr, { locale: enUS });
};

// Format date with time
export const formatDateTime = (date) => {
  return format(new Date(date), "MM/dd/yyyy HH:mm", { locale: enUS });
};

// Calculate percentage
export const calculatePercentage = (current, max) => {
  if (max === 0) return 0;
  return Math.round((current / max) * 100);
};

// Get status color based on percentage
export const getStatusColor = (percentage) => {
  if (percentage <= 70) return "normal";
  if (percentage <= 85) return "caution";
  if (percentage <= 100) return "warning";
  return "critical";
};

// Get status label
export const getStatusLabel = (percentage) => {
  if (percentage <= 70) return "Normal";
  if (percentage <= 85) return "Perhatian";
  if (percentage <= 100) return "Mendekati Max";
  return "Melebihi Max";
};

// Get status emoji
export const getStatusEmoji = (percentage) => {
  if (percentage <= 70) return "🟢";
  if (percentage <= 85) return "🟡";
  if (percentage <= 100) return "🟠";
  return "🔴";
};

// Calculate tonnage from shots
export const calculateTonnageFromShots = (shots, kgPerShot) => {
  return shots * kgPerShot;
};

// Truncate text
export const truncate = (str, maxLength) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
};
