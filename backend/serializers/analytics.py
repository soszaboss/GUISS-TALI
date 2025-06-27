from rest_framework import serializers


class DistributionPermisSerializer(serializers.Serializer):
    leger = serializers.IntegerField()
    lourd = serializers.IntegerField()
    autres = serializers.IntegerField()


class EvolutionVisitesSerializer(serializers.Serializer):
    periode = serializers.CharField()
    nombre = serializers.IntegerField()


class EvolutionGroupSerializer(serializers.Serializer):
    par_mois = EvolutionVisitesSerializer(many=True)
    par_semaine = EvolutionVisitesSerializer(many=True)
    par_annee = EvolutionVisitesSerializer(many=True)


class TonusStatSerializer(serializers.Serializer):
    od = serializers.FloatField()
    og = serializers.FloatField()


class TonusCountSerializer(serializers.Serializer):
    od = serializers.IntegerField()
    og = serializers.IntegerField()


class DashboardStatsSerializer(serializers.Serializer):
    nombre_total_patients = serializers.IntegerField()
    age_moyen = serializers.FloatField()
    nombre_professionnels = serializers.IntegerField()
    duree_moyenne_conduite = serializers.FloatField()
    distribution_permis = DistributionPermisSerializer()
    tonus_moyen = TonusStatSerializer()
    tonus_superieur_a_21 = TonusCountSerializer()
    nombre_incompatibles = serializers.IntegerField()
    patients_risque_dossier = serializers.IntegerField()
    evolution_visites = EvolutionGroupSerializer()
