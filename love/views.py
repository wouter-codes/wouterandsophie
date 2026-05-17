from django.conf import settings
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.core.mail import send_mail
from django.utils import timezone
import json

from .forms import SiteAccessForm

# Create your views here.


def site_access(request):
    if request.method == 'POST':
        form = SiteAccessForm(request.POST)
        if form.is_valid():
            submitted_password = form.cleaned_data['password']
            if submitted_password == settings.SITE_ACCESS_PASSWORD:
                request.session['site_access_granted'] = True
                return redirect('index')

            form.add_error('password', 'Incorrect password')

        return render(request, 'love/access_gate.html', {'form': form})

    form = SiteAccessForm()
    return render(request, 'love/access_gate.html', {'form': form})


def index(request):
    return render(request, 'love/index.html')


def accommodation(request):
    return render(request, 'love/accommodation.html')


def budget(request):
    return render(request, 'love/budget.html')


def midrange(request):
    return render(request, 'love/midrange.html')


def comfort(request):
    return render(request, 'love/comfort.html')


def faq(request):
    return render(request, 'love/faq.html')


def the_wedding(request):
    return render(request, 'love/the_wedding.html')


def wedding_list(request):
    return render(request, 'love/wedding_list.html')


@require_POST
def submit_booking(request):
    """
    Handle booking form submission and send confirmation email.
    Expects JSON POST data with: guestNames, numberOfPeople, tier, cost, currency
    """
    try:
        data = json.loads(request.body)
        
        # Extract form data
        guest_names = data.get('guestNames', [])
        num_people = data.get('numberOfPeople', '')
        tier = data.get('tier', '').strip()
        cost = data.get('cost', '')
        currency = data.get('currency', 'GBP').strip()
        
        # Validate required fields
        if not all([guest_names, num_people, tier, cost]):
            return JsonResponse(
                {'success': False, 'error': 'Missing required fields'},
                status=400
            )
        
        # Get current timestamp
        submission_time = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Format guest names for email
        guest_list = '\n'.join([f'{i+1}. {name}' for i, name in enumerate(guest_names)])
        
        # Prepare email content
        subject = f"New Booking Payment Received - {tier.title()} Accommodation"
        
        message = f"""
New Booking Payment Received
======================

Submission Date: {submission_time}

Guest Information:
------------------
Number of Guests: {num_people}
Guest Names:
{guest_list}

Booking Details:
----------------
Accommodation Tier: {tier.title()}
Cost: {cost} {currency}

---
This email was generated automatically from the booking form.
"""
        
        # Send email to admin
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],  # Send to admin email
            fail_silently=False,
        )
        
        return JsonResponse({'success': True, 'message': 'Booking submitted successfully'})
    
    except json.JSONDecodeError:
        return JsonResponse(
            {'success': False, 'error': 'Invalid JSON'},
            status=400
        )
    except Exception as e:
        return JsonResponse(
            {'success': False, 'error': str(e)},
            status=500
        )


@require_POST
def send_gift_message(request):
    """
    Handle gift message submission and send email.
    Expects JSON POST data with: message
    """
    try:
        data = json.loads(request.body)
        
        # Extract message
        message_text = data.get('message', '').strip()
        
        # Validate message is not empty
        if not message_text:
            return JsonResponse(
                {'success': False, 'error': 'Message cannot be empty'},
                status=400
            )
        
        # Get current timestamp
        submission_time = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Prepare email content
        subject = "New Gift Message - Honeymoon Fundraiser"
        
        message = f"""
New Honeymoon Gift Message Received
=========================

Submission Date: {submission_time}

Message:
--------
{message_text}

---
This email was generated automatically from the honeymoon fundraiser gift message form.
"""
        
        # Send email to admin
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['rsvp@wouterandsophie.love'],
            fail_silently=False,
        )
        
        return JsonResponse({'success': True, 'message': 'Message sent successfully'})
    
    except json.JSONDecodeError:
        return JsonResponse(
            {'success': False, 'error': 'Invalid JSON'},
            status=400
        )
    except Exception as e:
        return JsonResponse(
            {'success': False, 'error': str(e)},
            status=500
        )
