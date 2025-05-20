# The default meta precedence order (update as needed)
IPWARE_META_PRECEDENCE_ORDER = (
  "X_FORWARDED_FOR",  # Load balancers or proxies such as AWS ELB (default client is `left-most` [`<client>, <proxy1>, <proxy2>`])
  "HTTP_X_FORWARDED_FOR",  # Similar to X_FORWARDED_TO
  "HTTP_CLIENT_IP",  # Standard headers used by providers such as Amazon EC2, Heroku etc.
  "HTTP_X_REAL_IP",  # Standard headers used by providers such as Amazon EC2, Heroku etc.
  "HTTP_X_FORWARDED",  # Squid and others
  "HTTP_X_CLUSTER_CLIENT_IP",  # Rackspace LB and Riverbed Stingray
  "HTTP_FORWARDED_FOR",  # RFC 7239
  "HTTP_FORWARDED",  # RFC 7239
  "HTTP_CF_CONNECTING_IP",  # CloudFlare
  "X-CLIENT-IP",  # Microsoft Azure
  "X-REAL-IP",  # NGINX
  "X-CLUSTER-CLIENT-IP",  # Rackspace Cloud Load Balancers
  "X_FORWARDED",  # Squid
  "FORWARDED_FOR",  # RFC 7239
  "CF-CONNECTING-IP",  # CloudFlare
  "TRUE-CLIENT-IP",  # CloudFlare Enterprise,
  "FASTLY-CLIENT-IP",  # Firebase, Fastly
  "FORWARDED",  # RFC 7239
  "CLIENT-IP",  # Akamai and Cloudflare: True-Client-IP and Fastly: Fastly-Client-IP
  "REMOTE_ADDR",  # Default
)