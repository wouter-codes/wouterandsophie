from django import forms


class SiteAccessForm(forms.Form):
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        required=True,
        label='Enter Password',
        help_text='The second name of the bride + the second name of the groom (capital first letter for each)',
    )
