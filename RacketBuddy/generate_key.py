import secrets
import base64

# Generate a random 32-byte key and encode it in base64
secret_key = base64.b64encode(secrets.token_bytes(32)).decode('utf-8')
print("\nYour secure SECRET_KEY is:")
print(secret_key)
print("\nAdd this to your environment variables in Vercel as SECRET_KEY") 