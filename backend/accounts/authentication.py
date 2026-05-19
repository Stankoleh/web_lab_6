from rest_framework.authentication import TokenAuthentication


class TokenOrBearerAuthentication(TokenAuthentication):
    """Accept both 'Token <key>' and 'Bearer <key>' for student/demo runs."""

    keyword = 'Token'

    def authenticate(self, request):
        auth = request.META.get('HTTP_AUTHORIZATION', '')
        if auth.startswith('Bearer '):
            request.META['HTTP_AUTHORIZATION'] = 'Token ' + auth.split(' ', 1)[1]
        return super().authenticate(request)
