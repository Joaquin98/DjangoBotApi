from rest_framework import serializers
from .models import Building

class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = [
            'name',
            'level',
            'next_level',
            'sale_price'
        ]