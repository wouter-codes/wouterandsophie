from django.conf import settings
from django.shortcuts import render, redirect

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
