from django import forms


class SiteAccessForm(forms.Form):
    password = forms.CharField(
        widget=forms.PasswordInput(),
        required=True,
        label='Enter Password',
    )
