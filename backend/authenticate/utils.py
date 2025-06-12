from django.core.mail import send_mail
from django.core.cache import cache
from random import randint
from django.conf import settings
from uuid import uuid4
from django.contrib.auth.tokens import default_token_generator
import os


def send_account_activation(user):
    # if cache.get(user.email):
    #     return False
    try:
        otp = randint(100000, 999999)
        email_verification_token = uuid4()
        link = f'{os.environ.get("FRONTEND_BASE_URL")}/MovieHub/#/activate_account/{user.username}/{email_verification_token}'
        subject = "MovieHub: Email Verification"
        message = f"""
Alright listen up, Alf. Got wind you signed up for somethin' with one of me mates' fancy platforms. Good on ya, diversifyin' yer portfolio and all that. But here's the rub: your email ain't lookin' so kosher, mate. Got more holes in it than a goldfish sieve.

So, here's the deal, sunshine: click the link below and verify that email, sharpish. Think of it like wearin' a bulletproof vest in a Shelby gun fight. You wouldn't skip that, would ya? No, ya wouldn't.

{link}

Remember Ae, time waits for no man, especially not a bloke with an unverified email. Tick tock, mate.

Sincerely (not really),

Alfie Solemons

P.S. Don't even think about forwardin' this. I know where you live. And I know where you get your haircuts. Just click the link, Alfie. It's the only way to avoid a concrete nap."""

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

def send_password_reset(user):
    #if cache.get(user.email):
    #   return False
    try:
        token = default_token_generator.make_token(user)
        link = f'{os.environ.get("FRONTEND_BASE_URL")}/MovieHub/#/reset_password/{user.username}/{token}'
        subject = "MovieHub: Password Reset Link"
        message = f"""
Oi, sharp suit,

Word on the street is you've forgotten your password. Now, I ain't one for sentiment, but a bloke stuck in the dark's a liability, especially when it comes to secrets and Shelby business. So, I've taken the liberty of greasin' the hinges on your memory door.

Here's the deal:

Click the link below. It'll lead you to a page where you can choose a new password, somethin' cleverer than "Alfie123", eh?

{link}

Don't dawdle, this ain't a charity raffle. This one link expires faster than Grace's patience with Tommy's schemes.
If you didn't request this, well, consider it a friendly reminder that someone's after your digital goods. Maybe it's Finn fumbling with your phone again, or maybe it's a Peaky Blinder wannabe with sticky fingers. You decide.

Now, don't get any ideas about playing coy. If I come to know that you forgot your password again, I'll be tappin' your kneecap with a rusty razor faster than you can say "by order of the Peaky Blinders."

Cheers,

Alfie "The Fixer" Solomons"""
        from_email = settings.EMAIL_FROM
        recipient_list = [user.email, ]
        print(send_mail(subject, message, from_email, recipient_list))
        cache.set(user.email, token, 60)
        return True
    except Exception as e:
        print(e)
        return False