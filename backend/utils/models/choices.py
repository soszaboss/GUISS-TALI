from django.db import models
from django.utils.translation import gettext_lazy as _


class VisiteChoices(models.IntegerChoices):
    FIRST = 1, _('FIRST')
    SECOND = 2, _('SECOND')
    THIRD = 3, _('THIRD')


class Cornee(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    OPACITE_AXE = "OPACITE_AXE", _("OPACITE_AXE")
    OPACITE_PERIPHERIE = "OPACITE_PERIPHERIE", _("OPACITE_PERIPHERIE")
    OPACITE_TOTALE = "OPACITE_TOTALE", _("OPACITE_TOTALE")
    AUTRE = "AUTRE", _("AUTRE")


class ChambreAnterieureProfondeur(models.TextChoices):
    NORMALE = "NORMALE", _("NORMALE")
    REDUITE = "REDUITE", _("REDUITE")
    AUGMENTEE = "AUGMENTEE", _("AUGMENTEE")
    ASYMETRIQUE = "ASYMETRIQUE", _("ASYMETRIQUE")


class ChambreAnterieureTransparence(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    ANORMALE = "ANORMALE", _("ANORMALE")


class Pupille(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    MYOSIS = "MYOSIS", _("MYOSIS")
    MYDRIASE = "MYDRIASE", _("MYDRIASE")


class AxeVisuel(models.TextChoices):
    DEGAGE = "DEGAGE", _("DEGAGE")
    OBSTRUE = "OBSTRUE", _("OBSTRUE")
    LEUCOCORIE = "LEUCOCORIE", _("LEUCOCORIE")


class Cristallin(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    OPAQUE = "OPAQUE", _("OPAQUE")
    COLOBOME = "COLOBOME", _("COLOBOME")
    APHAKIE = "APHAKIE", _("APHAKIE")
    PSEUDOPHAKIE = "PSEUDOPHAKIE", _("PSEUDOPHAKIE")


class Vitre(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    CORPS_FLOTTANTS = "CORPS_FLOTTANTS", _("CORPS_FLOTTANTS")
    HEMORRAGIE = "HEMORRAGIE", _("HEMORRAGIE")
    HYALITE = "HYALITE", _("HYALITE")
    PVR = "PVR", _("PVR")
    AUTRES = "AUTRES", _("AUTRES")


class TypeAnomalie(models.TextChoices):
    PIGMENTS = "PIGMENTS", _("PIGMENTS")
    HYPHEMA = "HYPHEMA", _("HYPHEMA")
    HYPOPION = "HYPOPION", _("HYPOPION")
    AUTRE = "AUTRE", _("AUTRE")


class QuantiteAnomalie(models.TextChoices):
    MINIME = "MINIME", _("MINIME")
    ATTEIGNANT_AIR_PUPILLAIRE = "ATTEIGNANT_AIR_PUPILLAIRE", _("ATTEIGNANT_AIR_PUPILLAIRE")
    RECOUVRANT_PUPILLE = "RECOUVRANT_PUPILLE", _("RECOUVRANT_PUPILLE")


class RPM(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    LENT = "LENT", _("LENT")
    ABOLI = "ABOLI", _("ABOLI")


class Iris(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    IRIDODONESIS = "IRIDODONESIS", _("IRIDODONESIS")
    RUBEUSE = "RUBEOSE", _("RUBEOSE")
    SYNECHIES = "SYNECHIES", _("SYNECHIES")
    AUTRES = "AUTRES", _("AUTRES")


class Macula(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    CICATRICE = "CICATRICE", _("CICATRICE")
    OEDEME = "OEDEME", _("OEDEME")
    DMLA = "DMLA", _("DMLA")


class ChampRetinienPeripherique(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    CICATRICE = "CICATRICE", _("CICATRICE")
    OEDEME = "OEDEME", _("OEDEME")
    HEMORRAGIE = "HEMORRAGIE", _("HEMORRAGIE")
    EXUDATS = "EXUDATS", _("EXUDATS")
    AUTRE = "AUTRE", _("AUTRE")


class Vaisseaux(models.TextChoices):
    NORMAUX = "NORMAUX", _("NORMAUX")
    ARTERIOSCLEROSE = "ARTERIOSCLEROSE", _("ARTERIOSCLEROSE")
    OVR = "OVR", _("OVR")
    OAR = "OAR", _("OAR")
    NEOVAISSEUX = "NEOVAISSEUX", _("NEOVAISSEUX")


class PositionCristallin(models.TextChoices):
    NORMALE = "NORMALE", _("NORMALE")
    ECTOPIE = "ECTOPIE", _("ECTOPIE")
    LUXATION_ANTERIEURE = "LUXATION_SUBLUXATION_ANTERIEURE", _("LUXATION_SUBLUXATION_ANTERIEURE")
    LUXATION_POSTERIEURE = "LUXATION_SUBLUXATION_POSTERIEURE", _("LUXATION_SUBLUXATION_POSTERIEURE")


class Papille(models.TextChoices):
    NORMALE = "NORMALE", _("NORMALE")
    EXCAVATION_ELARGIE = "EXCAVATION_ELARGIE", _("EXCAVATION_ELARGIE")
    ATROPHIE = "ATROPHIE", _("ATROPHIE")
    OEDEME = "OEDEME", _("OEDEME")
    DYSMORPHIE = "DYSMORPHIE", _("DYSMORPHIE")
    AUTRES = "AUTRES", _("AUTRES")


class PerimetrieBinoculaire(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    SCOTOME_CENTRAL = "SCOTOME_CENTRAL", _("SCOTOME_CENTRAL")
    SCOTOME_PERIPHERIQUE = "SCOTOME_PERIPHERIQUE", _("SCOTOME_PERIPHERIQUE")
    AMPUTATION = "AMPUTATION", _("AMPUTATION")


class SegmentChoices(models.TextChoices):
    NORMAL = "NORMAL", _("NORMAL")
    PRESENCE_LESION = "PRESENCE_LESION", _("PRESENCE_LESION")
    REMANIEMENT_TOTAL = "REMANIEMENT_TOTAL", _("REMANIEMENT_TOTAL")


class DommageChoices(models.TextChoices):
    IMPORTANT = "IMPORTANT", _("IMPORTANT")
    MODERE = "MODERE", _("MODERE")
    LEGER = "LEGER", _("LEGER")



class AddictionTypeChoices(models.TextChoices):
    TABAGISME = "TABAGISME", _("TABAGISME")
    ALCOOL = "ALCOOL", _("ALCOOL")
    TELEPHONE = "TELEPHONE", _("TELEPHONE")
    OTHER = "OTHER", _("OTHER")
    SANS_PARTICULARITE = "SANS_PARTICULARITE", _("SANS_PARTICULARITE")


class FamilialChoices(models.TextChoices):
    CECITE = "CECITE", _("CECITE")
    GPAO = "GPAO", _("GPAO")
    OTHER = "OTHER", _("OTHER")


class HypotonisantValue(models.TextChoices):
    BBLOQUANTS = "BBLOQUANTS", _("BBLOQUANTS")
    IAC = "IAC", _("IAC")
    PROSTAGLANDINES = "PROSTAGLANDINES", _("PROSTAGLANDINES")
    PILOCARPINE = "PILOCARPINE", _("PILOCARPINE")
    AUTRES = "AUTRES", _("AUTRES")


class Symptomes(models.TextChoices):
    AUCUN = "AUCUN", _("AUCUN")
    BAV = "BAV", _("BAV")
    ROUGEUR = "ROUGEUR", _("ROUGEUR")
    DOULEUR = "DOULEUR", _("DOULEUR")
    DIPLOPIE = "DIPLOPIE", _("DIPLOPIE")
    STARBISME = "STARBISME", _("STARBISME")
    NYSTAGMUS = "NYSTAGMUS", _("NYSTAGMUS")
    PTOSIS = "PTOSIS", _("PTOSIS")
    AUTRES = "AUTRES", _("AUTRES")

class EtatConducteurChoices(models.TextChoices):
        DCD = 'DECEDE', _('DECEDE')
        PERTE_DE_VUE = 'PERTE_DE_VUE', _('PERTE_DE_VUE')
        ACTIF = 'ACTIF', _('ACTIF')
        INACTIF = 'INACTIF', _('INACTIF')

class ArretCauseChoices(models.TextChoices):
    MALADIE = 'MALADIE', _('MALADIE')
    ACCIDENT = 'ACCIDENT', _('ACCIDENT')
    AUTRE = 'AUTRE', _('AUTRE')
    CHOMAGE = 'CHOMAGE', _('CHOMAGE')

class DECESCauseChoices(models.TextChoices):
    MORT_NATUREL = 'MORT_NATUREL', _('MORT_NATUREL')
    ACCIDENT = 'ACCIDENT', _('ACCIDENT')
    NON_PRECESEE = 'NON_PRECESEE', _('NON_PRECESEE')