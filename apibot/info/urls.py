from django.urls import path
from . import views

urlpatterns = [
    path('building/',views.building_order_list_create_view),
    path('building/<int:town_id>/',views.building_order_list_create_view),
    path('building/delete/<int:pk>/',views.building_order_delete_view),
]