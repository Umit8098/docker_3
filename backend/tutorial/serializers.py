from rest_framework import serializers
from .models import Tutorial

class TutorialSerializer(serializers.ModelSerializer):
    
    # abc = serializers.IntegerField(default=1)
    
    # tit_des = serializers.SerializerMethodField(default=1)

    class Meta:
        model=Tutorial
        fields="__all__"
        # fields=("title",)

    # def get_tit_des(self, obj):
    #     return f"{obj.id} {obj.description[0:3]}..."
