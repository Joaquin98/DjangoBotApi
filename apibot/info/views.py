from rest_framework import authentication, generics, permissions
from .models import BuildingOrder,ClaimOrder
from .serializers import BuildingOrderSerializer, ClaimOrderSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class BuildingOrderListCreateAPIView(generics.ListCreateAPIView):
    
    serializer_class = BuildingOrderSerializer
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        town_id = self.kwargs['town_id']
        queryset = BuildingOrder.objects.filter(town_id=town_id)
        return queryset

building_order_list_create_view = BuildingOrderListCreateAPIView.as_view()

class BuildingOrderDeleteAPIView(generics.DestroyAPIView):
    queryset = BuildingOrder.objects.all()
    serializer_class = BuildingOrderSerializer
    lookup_field = 'pk'

building_order_delete_view = BuildingOrderDeleteAPIView.as_view()




@api_view(['GET', 'POST'])
def building_order_alt_view(request, town_id = None, *args, **kwargs):
    method = request.method

    if method == 'GET':
        '''
        if pk is not None:
            obj = get_object_or_404(BuildingOrder, pk = pk)
            data = BuildingOrderSerializer(obj, many = False).data
            return Response(data)

        else:
        '''
        queryset = BuildingOrder.objects.filter(town_id = town_id)
        data = BuildingOrderSerializer(queryset, many = True).data
        return Response(data)
    
    if method == 'POST':
        serializer = BuildingOrderSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        

