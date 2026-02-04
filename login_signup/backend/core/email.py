import smtplib
import secrets
from email.message import EmailMessage
from core.config import settings


def send_email(to: str, subject: str, body: str):
    msg = EmailMessage()
    msg["From"] = settings.FROM_EMAIL
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(
            settings.SMTP_USERNAME,
            settings.SMTP_PASSWORD
        )
        server.send_message(msg)

