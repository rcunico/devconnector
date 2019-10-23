function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

export default isEmpty;

// Validators.isEmpty will only check for an empty String
// This function was custom-made to check objects as well
