from django.db.models import Avg, Q
from apps.examens.models import OcularTension, Conclusion


# ➤ Tonus moyen (OD et OG)
def get_tonus_moyen():
    return OcularTension.objects.aggregate(
        tonus_moyen_od=Avg('od'),
        tonus_moyen_og=Avg('og')
    )


# ➤ Nombre de patients avec tonus supérieur à 21
def get_nombre_tonus_superieur_a_21():
    return OcularTension.objects.filter(Q(od__gt=21) | Q(og__gt=21)).count()


# ➤ Nombre de conclusions "incompatible"
def get_nombre_incompatibles():
    return Conclusion.objects.filter(vision='incompatible').count()


# ➤ Nombre de conclusions "à risque"
def get_nombre_a_risque():
    return Conclusion.objects.filter(vision='a_risque').count()
