const CONSTANTS = {
  API_VERSION: process.env.API_VERSION,
  API_ERRORS: {
    INTERNAL_SERVER_MSG:
      "The operation could not be completed due to an issue on our side. It has been logged and will be reviewed. Please try again later.",
    INTERNAL_SERVER_ERR:
      "A server-side error occurred while processing your request.",
  },

  ROUTES: {
    DEALER: "/dealer",
    AUTH: "/auth",
  },
};

export default CONSTANTS;
