import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../../.env") });

// Localhost IPs that are always allowed (for development)
const LOCALHOST_IPS = new Set([
  "127.0.0.1",
  "::1",
  "::ffff:127.0.0.1",
]);

/**
 * Normalize an IP address — strips the IPv6-mapped IPv4 prefix if present.
 * e.g. "::ffff:192.168.1.1" → "192.168.1.1"
 */
function normalizeIp(ip) {
  if (!ip) return "";
  return ip.replace(/^::ffff:/, "").trim();
}

/**
 * Parse the ALLOWED_OFFICE_IP env var into a Set of IPs.
 * Supports comma-separated values.
 */
function getAllowedIps() {
  const raw = process.env.ALLOWED_OFFICE_IP || "";
  const ips = new Set();
  raw.split(",").forEach((ip) => {
    const trimmed = ip.trim();
    if (trimmed) ips.add(trimmed);
  });
  return ips;
}

/**
 * IP Restriction Middleware
 *
 * Blocks requests from IPs not on the office whitelist.
 * Localhost is always allowed for development.
 * Reads the client's real IP from x-forwarded-for (proxy) or req.ip.
 */
export default function ipRestriction(req, res, next) {
  // Extract the real client IP (first entry in x-forwarded-for, or req.ip)
  const forwarded = req.headers["x-forwarded-for"];
  const rawIp = forwarded
    ? forwarded.split(",")[0].trim()
    : req.ip || req.connection?.remoteAddress || "";

  const clientIp = normalizeIp(rawIp);

  // Always allow localhost for development
  if (LOCALHOST_IPS.has(rawIp) || LOCALHOST_IPS.has(clientIp) || clientIp === "127.0.0.1") {
    return next();
  }

  // Check against the allowed office IPs
  const allowedIps = getAllowedIps();

  // If no office IPs are configured, allow all traffic (fail-open for unconfigured env)
  if (allowedIps.size === 0) {
    return next();
  }

  if (allowedIps.has(clientIp)) {
    return next();
  }

  // Blocked — return 403
  console.warn(`⛔ IP blocked: ${clientIp} (raw: ${rawIp})`);
  return res.status(403).json({
    error: "ACCESS_DENIED",
    message:
      "You must be connected to the PANDR office network to access this system.",
  });
}
