export function isValidService (service): [boolean, { [key: string]: string }] {
  const errors: { [key: string]: string } = {};
  if (!service.name) {
    errors.name = 'Name is required';
  }
  if (!service.algorithm) {
    errors.algorithm = 'Algorithm is required';
  }
  if (service.notes) {
    if (service.notes.length) {
      errors.notes = 'Notes must be an object containing "username", "email", and "other"';
    }
    if (typeof service.notes !== 'object') {
      errors.notes = 'Notes must be an object';
    }
    if (service.notes.username && typeof service.notes.username !== 'string') {
      errors.notes = 'Username must be a string';
    }
    if (service.notes.email && typeof service.notes.email !== 'string') {
      errors.notes = 'Email must be a string';
    }
    if (service.notes.other && typeof service.notes.other !== 'string') {
      errors.notes = 'Other must be a string';
    }
  }
  return [Object.keys(errors).length === 0, errors];
}

export default isValidService;