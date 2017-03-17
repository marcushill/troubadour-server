const REQUIRE_HEADER_DEFAULTS = {
  header_name: 'X-API-HEADER',
  validation_func: (...rest) => true,
  error_message: `Missing header: X-API-HEADER`,
};

export function requireHeader(opts=REQUIRE_HEADER_DEFAULTS) {
  opts = Object.assign({}, REQUIRE_HEADER_DEFAULTS, opts);
  return (req, resp, next) => {
    if(req.get(opts.header_name) &&
    opts.validation_func(req.get(opts.header_name))) {
      next();
    } else {
      resp.status(400).json({error: opts.error_message});
    }
  };
}
