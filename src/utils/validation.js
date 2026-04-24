export function validateHash(hash) {
  if (!hash) return "Hash is required";
  const clean = hash.replace(/^0x/i, "");
  if (clean.length !== 64)  return "Hash must be 64 hex characters";
  if (!/^[0-9a-fA-F]+$/.test(clean)) return "Hash must contain only hex characters";
  return null;
}

export function validateTitle(title) {
  if (!title?.trim()) return "Title is required";
  if (title.trim().length > 100) return "Title must be 100 characters or less";
  if (!/^[\x20-\x7E]*$/.test(title)) return "Title must contain only printable ASCII characters";
  return null;
}

export function validateDocType(type) {
  const valid = ["diploma","certificate","research","contribution","award","art","other"];
  if (!type) return "Document type is required";
  if (!valid.includes(type)) return `Type must be one of: ${valid.join(", ")}`;
  return null;
}

export function validateStacksAddress(addr) {
  if (!addr) return "Address is required";
  if (!addr.startsWith("SP") && !addr.startsWith("ST")) return "Must be a Stacks address (starts with SP or ST)";
  if (addr.length < 30 || addr.length > 52) return "Invalid address length";
  return null;
}