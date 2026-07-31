import unittest
from datetime import datetime, timedelta
from jose import jwt

from app.auth.password import hash_password, verify_password
from app.auth.jwt import create_token, verify_token, SECRET_KEY, ALGORITHM


class AuthTests(unittest.TestCase):
    def test_password_hashing(self):
        plain = "my_secure_password"
        hashed = hash_password(plain)
        
        # Verify it works
        self.assertTrue(verify_password(plain, hashed))
        # Verify invalid doesn't match
        self.assertFalse(verify_password("wrong_password", hashed))

    def test_token_creation_and_verification(self):
        data = {"sub": "test@user.com", "role": "ADMIN"}
        token = create_token(data)
        
        # Verify token is valid
        payload = verify_token(token)
        self.assertEqual(payload["sub"], "test@user.com")
        self.assertEqual(payload["role"], "ADMIN")
        self.assertIn("exp", payload)

    def test_expired_token(self):
        # Create an already expired token
        data = {"sub": "expired@user.com", "exp": datetime.utcnow() - timedelta(minutes=10)}
        token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
        
        # Verify token fails verification
        payload = verify_token(token)
        self.assertIsNone(payload)


if __name__ == "__main__":
    unittest.main()
