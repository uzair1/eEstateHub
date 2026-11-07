export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  console.error(err);
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: err.issues });
  }
  return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}