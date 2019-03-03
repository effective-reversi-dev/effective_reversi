from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from reversiapp.view.add_user_info import add_user_info


@login_required
@add_user_info
def reversiapp(request):
    return render(request, 'reversiapp/index.html')
