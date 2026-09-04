class RetryPolicy {
  static shouldRetry(attempts, error) {
    if (!error) return false;
    return attempts < 3 && (error.code === 'E_TIMEOUT' || error.code === 'E_BROKER_UNAVAILABLE');
  }
}

module.exports = { RetryPolicy };
