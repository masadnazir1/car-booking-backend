function validateFields(fields) {
  const errors = [];
  for (const [key, value] of Object.entries(fields)) {
    const val = typeof value === "string" ? value.trim() : value;

    if (val === "" || val === null || val === undefined) {
      errors.push(`${key} is required`);
      continue;
    }
  }
  return errors;
}

export default validateFields;
