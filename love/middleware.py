from django.conf import settings
from django.shortcuts import redirect


class SiteAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Disable the gate when no password is configured.
        if not settings.SITE_ACCESS_PASSWORD:
            return self.get_response(request)

        path = request.path
        is_open_path = (
            path.startswith('/access/')
            or path.startswith('/admin/')
            or path.startswith('/static/')
            or path == '/favicon.ico'
        )

        has_access = request.session.get('site_access_granted', False)
        if not is_open_path and not has_access:
            return redirect('site-access')

        return self.get_response(request)
