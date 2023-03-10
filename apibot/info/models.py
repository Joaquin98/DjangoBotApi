from django.db import models

class Building(models.Model):
    name = models.CharField(max_length=100)
    level = models.IntegerField()
    next_level = models.IntegerField()

    @property
    def sale_price(self):
        return "%.2f" % (float(self.level) + 1)



class Town(models.Model):
    town_id = models.IntegerField()
 

class BuildingOrder(models.Model):
    model_url = models.CharField(max_length=200)
    action_name = models.CharField(max_length=100)
    town_id = models.IntegerField()
    building_id = models.CharField(max_length=100)
    order_id = models.IntegerField()

#{"model_url":"BuildingOrder","action_name":"buildUp","arguments":{"building_id":"ironer"},"town_id":631,"nl_init":true}

class ClaimOrder(models.Model):
    model_url = models.CharField(max_length=200)
    action_name = models.CharField(max_length=100)
    farm_town_id = models.IntegerField()
    type = models.CharField(max_length=100)
    option = models.IntegerField()
    town_id = models.IntegerField()
    #town = models.ForeignKey(Town,on_delete=models.CASCADE) #models.IntegerField()


#{"model_url":"FarmTownPlayerRelation/2972","action_name":"claim","arguments":{"farm_town_id":158,"type":"resources","option":1},"town_id":631,"nl_init":true}

