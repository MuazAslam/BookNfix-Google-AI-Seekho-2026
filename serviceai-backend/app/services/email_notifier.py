import smtplib
import ssl
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

SENDER_EMAIL   = "muazaslam1023@gmail.com"
RECEIVER_EMAIL = "muhammadarslan1of3@gmail.com"
SMTP_HOST      = "smtp.gmail.com"
SMTP_PORT      = 587

APP_NAME        = "BookNfix"
APP_TAGLINE     = "Intelligent Service Booking — Powered by ServiceAI"
APP_URL         = "https://6a0ea5a9e5486332c51b6c81--stirring-kelpie-e96bcf.netlify.app"

EMAIL_TEMPLATE = """\
Dear {provider_name},

I hope this message finds you well.

We are reaching out on behalf of {app_name} to inform you that a new service
booking request has been submitted and requires your attention.

Please find the booking details below:

  Customer Name   :  {user_name}
  Service Required:  {service_type}
  Issue Described :  {problem}
  Service Address :  {user_address}
  Requested Time  :  {preferred_time}
  Request Placed  :  {created_at}

We kindly request you to review this booking at your earliest convenience and
confirm your availability for the above-mentioned date and time.

Should you have any questions or require further information, please do not
hesitate to reach out to us.

Thank you for being a valued service provider on {app_name}. We look forward
to your continued partnership.

--------------------------------------------------
Not yet registered on {app_name}?

Join our growing network of professional service providers and start receiving
bookings directly through our platform. Registration is quick, free, and opens
the door to thousands of customers in your area.

  Register here: {app_url}

We would love to have you on board.
--------------------------------------------------
{credentials_block}
Warm regards,
The {app_name} Team
"""

_CREDENTIALS_BLOCK = """\

We have automatically created a {app_name} provider account for you so you
can manage this and future bookings directly through our platform.

  Your Login Credentials
  ----------------------
  Email    :  {provider_email}
  Password :  {provider_password}

Please log in at your earliest convenience and change your password after
your first sign-in.

  Login here: {app_url}

"""


SUGGESTED_TIME_TEMPLATE = """\
Dear {provider_name},

I hope this message finds you well.

This is a follow-up from {app_name} regarding a booking for which you were
recently contacted by our AI agent.

We would like to confirm that our system has recorded the alternative time
you proposed during the interaction. Please find the updated booking details
below:

  Booking Reference :  {booking_id}
  Customer Name     :  {user_name}
  Service Required  :  {service_type}
  Service Address   :  {user_address}
  Customer Requested:  {original_time}
  Your Suggested    :  {suggested_time}

The customer has been notified of your proposed time and will respond shortly
through the {app_name} platform. Please keep this time slot available until
further confirmation is received.

Should you have any questions or need to make changes, please do not hesitate
to reach out to us.

Not yet on {app_name}? Register and manage all your bookings in one place.

  Register here: {app_url}

Thank you for your cooperation. We look forward to a successful appointment.

Warm regards,
The {app_name} Team
"""

CONFIRMED_TEMPLATE = """\
Dear {provider_name},

We are pleased to inform you that the customer has confirmed the booking for
the service you were contacted about through {app_name}.

Please find the confirmed appointment details below:

  Booking Reference :  {booking_id}
  Customer Name     :  {user_name}
  Service Required  :  {service_type}
  Service Address   :  {user_address}
  Confirmed Date    :  {confirmed_time}
  Confirmed At      :  {created_at}

Please ensure you are available and prepared to attend the above address at
the confirmed date and time. The customer is expecting your arrival.

If you need to make any changes or have any concerns before the appointment,
please contact us at your earliest convenience.

Not yet registered on {app_name}? Join our platform to manage bookings,
track your appointments, and grow your customer base.

  Register here: {app_url}

Thank you for being a valued service provider. We look forward to a
successful appointment.

Warm regards,
The {app_name} Team
"""


def _send(subject: str, body: str, tag: str) -> bool:
    """Internal helper — connects to SMTP and sends one email."""
    sender_password = os.getenv("EMAIL_APP_PASSWORD", "").strip()
    if not sender_password:
        print(f"[EMAIL] ⚠️  EMAIL_APP_PASSWORD not set — skipping {tag}")
        return False

    msg = MIMEMultipart()
    msg["From"]    = f"{APP_NAME} <{SENDER_EMAIL}>"
    msg["To"]      = RECEIVER_EMAIL
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as smtp:
            smtp.ehlo()
            smtp.starttls(context=context)
            smtp.login(SENDER_EMAIL, sender_password)
            smtp.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        print(f"[EMAIL] ✅  {tag} sent → {RECEIVER_EMAIL}")
        return True
    except Exception as e:
        print(f"[EMAIL] ❌  {tag} failed: {e}")
        return False


def send_booking_notification(
    user_name: str,
    service_type: str,
    problem: str,
    provider_name: str,
    user_address: str,
    preferred_time: str,
    provider_email: str = None,
    provider_password: str = None,
) -> bool:
    """Fires when the user presses Book — notifies the provider of a new request."""
    # Build credentials block only when a new account was just created
    if provider_email and provider_password:
        credentials_block = _CREDENTIALS_BLOCK.format(
            app_name=APP_NAME,
            app_url=APP_URL,
            provider_email=provider_email,
            provider_password=provider_password,
        )
    else:
        credentials_block = ""

    body = EMAIL_TEMPLATE.format(
        app_name=APP_NAME,
        app_tagline=APP_TAGLINE,
        app_url=APP_URL,
        user_name=user_name or "Unknown",
        service_type=service_type or "General Service",
        problem=problem or "—",
        provider_name=provider_name or "Unknown",
        user_address=user_address or "—",
        preferred_time=preferred_time or "Not specified",
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M"),
        credentials_block=credentials_block,
    )
    subject = f"New Booking Request — {service_type} | {APP_NAME}"
    return _send(subject, body, "Booking notification")


def send_suggested_time_notification(
    user_name: str,
    service_type: str,
    provider_name: str,
    user_address: str,
    original_time: str,
    suggested_time: str,
    booking_id: str = "",
) -> bool:
    """Fires when the provider suggests an alternative time — updates the user."""
    body = SUGGESTED_TIME_TEMPLATE.format(
        app_name=APP_NAME,
        app_tagline=APP_TAGLINE,
        app_url=APP_URL,
        user_name=user_name or "Valued Customer",
        service_type=service_type or "General Service",
        provider_name=provider_name or "your service provider",
        user_address=user_address or "—",
        original_time=original_time or "your requested time",
        suggested_time=suggested_time or "a new time (check the app)",
        booking_id=booking_id or "—",
    )
    subject = f"Follow-Up: Your Suggested Time Has Been Recorded | {APP_NAME}"
    return _send(subject, body, "Suggested-time notification")


def send_booking_confirmed_notification(
    user_name: str,
    service_type: str,
    provider_name: str,
    user_address: str,
    confirmed_time: str,
    booking_id: str = "",
) -> bool:
    """Fires when the booking is fully confirmed — notifies the user."""
    body = CONFIRMED_TEMPLATE.format(
        app_name=APP_NAME,
        app_tagline=APP_TAGLINE,
        app_url=APP_URL,
        user_name=user_name or "Valued Customer",
        service_type=service_type or "General Service",
        provider_name=provider_name or "your service provider",
        user_address=user_address or "—",
        confirmed_time=confirmed_time or "the agreed time",
        booking_id=booking_id or "—",
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M"),
    )
    subject = f"Booking Confirmed — {service_type} for {user_name} | {APP_NAME}"
    return _send(subject, body, "Booking confirmed notification")
