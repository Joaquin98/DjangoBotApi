from rest_framework import serializers
from .models import Building, BuildingOrder, ClaimOrder

class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = [
            'name',
            'level',
            'next_level',
            'sale_price'
        ]


class BuildingOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuildingOrder
        fields = [
            'model_url',
            'action_name',
            'town_id',
            'building_id',
            'order_id'
        ]


class ClaimOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimOrder
        fields = [
            'model_url',
            'action_name',
            'town_id',
            'type',
            'option'
        ]



