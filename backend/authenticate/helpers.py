from django.core.mail import send_mail
from django.core.cache import cache
from random import randint
from django.conf import settings
from uuid import uuid4

def send_otp(user):
    try:
        otp = randint(100000, 999999)
        email_verification_token = uuid4()
        subject = "MovieHub: Email Verification"
        message = f"""Hi, your OTP for email verification is: {otp}
        Or, you may click on this link to verify your email address: http://localhost:3000/#/auth/{user.username}/{email_verification_token}"""
        from_email = settings.EMAIL_FROM
        recipient_list = [user.email, ]
        send_mail(subject, message, from_email, recipient_list)
        cache.set(user.email, otp, 60)
        user.otp = otp
        user.email_verification_token = email_verification_token
        user.save()
        return True
    except Exception as e:
        print(e)
        return False
