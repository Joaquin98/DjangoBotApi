import json
from django.shortcuts import render
#from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from info.models import Building
from django.forms.models import model_to_dict
from info.serializers import BuildingSerializer


@api_view(["GET"])
def api_home(request, *args, **kwargs):

    if request.method != "GET":
        return Response({"detail":"GET not allowed"},status=405)
    instance = Building.objects.all().order_by("?").first()
    data = {}
    if instance:
        data = BuildingSerializer(instance).data
    return Response(data)
#        json_data_str = json.dumps(data)
#    return HttpResponse(data, headers = {"content-type":"application/json"})