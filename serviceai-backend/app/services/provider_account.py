import re
import json
import string
import random
import httpx
from pathlib import Path

FIREBASE_WEB_API_KEY = "AIzaSyBfYfONuBzQ_lcDK__zfwXty7dlCjC2KBQ"
FIREBASE_PROJECT_ID  = "hacakathon-service"

_AUTH_SIGNUP_URL = (
    f"https://identitytoolkit.googleapis.com/v1/accounts:signUp"
    f"?key={FIREBASE_WEB_API_KEY}"
)
_FIRESTORE_BASE = (
    f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}"
    f"/databases/(default)/documents"
)

_PROVIDERS_JSON = Path(__file__).parent.parent.parent / "data" / "providers.json"


def _generate_email(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    return f"provider.{digits}@booknfix.app"


def _generate_password(length: int = 10) -> str:
    chars = string.ascii_letters + string.digits
    return "".join(random.choices(chars, k=length))


def _normalize_category(service_type: str) -> str:
    s = (service_type or "").lower()
    mapping = {
        "plumb": "plumber",
        "electric": "electrician",
        "doctor": "doctor",
        "physician": "doctor",
        "clean": "cleaner",
        "paint": "painter",
        "carpent": "carpenter",
        "wood": "carpenter",
        "ac": "ac_technician",
        "mechanic": "mechanic",
    }
    for key, cat in mapping.items():
        if key in s:
            return cat
    return s.split()[0] if s else "general"


def _lookup_provider_in_json(phone: str) -> dict:
    """Find a provider in providers.json by matching phone digits."""
    phone_digits = re.sub(r"\D", "", phone)
    try:
        with open(_PROVIDERS_JSON, encoding="utf-8") as f:
            data = json.load(f)
        for p in data.get("providers", []):
            if re.sub(r"\D", "", p.get("phone", "")) == phone_digits:
                return p
    except Exception as e:
        print(f"[ACCOUNT] providers.json lookup failed: {e}")
    return {}


def _write_firestore_profile(uid: str, id_token: str, profile_fields: dict):
    """Write provider profile to Firestore using the user's own id_token."""
    url = f"{_FIRESTORE_BASE}/users/{uid}"
    try:
        resp = httpx.patch(
            url,
            json={"fields": profile_fields},
            headers={"Authorization": f"Bearer {id_token}"},
            timeout=15,
        )
        if not resp.is_success:
            print(f"[ACCOUNT] Firestore write failed: {resp.status_code} {resp.text[:200]}")
    except Exception as e:
        print(f"[ACCOUNT] Firestore write error: {e}")


def create_provider_account_if_new(
    provider_name: str,
    provider_phone: str,
    service_type: str,
) -> dict:
    """
    Creates a Firebase Auth account + Firestore profile for the provider
    if one does not already exist.

    Returns:
        {
            email:    str,
            password: str | None  — None if account already existed,
            uid:      str | None,
            is_new:   bool,
        }
    """
    email    = _generate_email(provider_phone)
    password = _generate_password()

    scraped = _lookup_provider_in_json(provider_phone)

    print(f"[ACCOUNT] Creating provider account for {provider_name} → {email}")

    try:
        resp = httpx.post(
            _AUTH_SIGNUP_URL,
            json={"email": email, "password": password, "returnSecureToken": True},
            timeout=15,
        )

        if resp.status_code == 400:
            error_msg = resp.json().get("error", {}).get("message", "")
            if "EMAIL_EXISTS" in error_msg:
                print(f"[ACCOUNT] Account already exists for {email} — skipping creation")
                return {"email": email, "password": None, "uid": None, "is_new": False}
            print(f"[ACCOUNT] Firebase signup error: {error_msg}")
            return {"email": email, "password": None, "uid": None, "is_new": False}

        resp.raise_for_status()
        data     = resp.json()
        uid      = data["localId"]
        id_token = data["idToken"]

        print(f"[ACCOUNT] Firebase account created → UID={uid}")

        # Build Firestore document using scraped data where available
        profile_fields = {
            "uid":             {"stringValue": uid},
            "email":           {"stringValue": email},
            "name":            {"stringValue": provider_name},
            "role":            {"stringValue": "provider"},
            "phone":           {"stringValue": provider_phone},
            "category":        {"stringValue": scraped.get("category") or _normalize_category(service_type)},
            "city":            {"stringValue": scraped.get("city", "Unknown")},
            "area":            {"stringValue": scraped.get("area", "Unknown")},
            "businessName":    {"stringValue": scraped.get("name") or provider_name},
            "experienceYears": {"integerValue": str(scraped.get("experience_years", 0))},
            "address":         {"stringValue": ""},
            "linkedProviderId":{"nullValue": None},
        }

        _write_firestore_profile(uid, id_token, profile_fields)
        print(f"[ACCOUNT] Firestore profile written for {email}")

        return {"email": email, "password": password, "uid": uid, "is_new": True}

    except Exception as e:
        print(f"[ACCOUNT] Account creation failed: {e}")
        return {"email": email, "password": None, "uid": None, "is_new": False}
