from django.db import models
from django.utils.translation import gettext_lazy as _


class VisiteChoices(models.IntegerChoices):
    FIRST = 1, _('First')
    SECOND = 2, _('Second')
    THIRD = 3, _('Third')


class Cornee(models.TextChoices):
    NORMAL = "Normal", _("Normal")
    OPACITE_AXE = "Opacité Axe", _("Opacité - Axe")
    OPACITE_PERIPHERIE = "Opacité Périphérie", _("Opacité - Périphérie")
    OPACITE_TOTALE = "Opacité Totale", _("Opacité - Totale")
    AUTRE = "Autre", _("Autre")


class ChambreAnterieureProfondeur(models.TextChoices):
    NORM = "Normale", _("Normale")
    REDUITE = "Réduite", _("Réduite")
    AUGMENTEE = "Augmentée", _("Augmentée")
    ASYMETRIQUE = "Asymétrique", _("Asymétrique")


class ChambreAnterieureTransparence(models.TextChoices):
    NORMAL = "Normal", _("Normal")
    ANORMALE = "Anormale", _("Anormale")


class Pupille(models.TextChoices):
    NORMAL = "Normal", _("Normal")
    MYOSIS = "Myosis", _("Myosis")
    MYDRIASE = "Mydriase", _("Mydriase")


class AxeVisuel(models.TextChoices):
    DEGAGE = "Dégagé", _("Dégagé")
    OBSTRUE = "Obstrué", _("Obstrué")
    LEUCOCORIE = "Leucocorie", _("Leucocorie")


class Cristallin(models.TextChoices):
    NORMAL = "Normal", _("Normal")
    OPAQUE = "Opaque", _("Opaque")
    COLOBOME = "Colobome", _("Colobome")
    APHAKIE = "Aphakie", _("Aphakie")
    PSEUDOPHAKIE = "Pseudophakie", _("Pseudophakie")


class Vitre(models.TextChoices):
    NORMAL = "Normal", _("Normal")
    FLOTTANTS = "Corps flottants", _("Corps flottants")
    HEMORRAGIE = "Hémorragie", _("Hémorragie")
    HYALITE = "Hyalite", _("Hyalite")
    PVR = "PVR", _("PVR")
    AUTRES = "Autres", _("Autres")


class TypeAnomalie(models.TextChoices):
    PIGMENTS = "Pigments", _("Pigments")
    HYPHEMA = "Hyphéma", _("Hyphéma")
    HYPOPION = "Hypopion", _("Hypopion")
    AUTRE = "Autre", _("Autre")


class QuantiteAnomalie(models.TextChoices):
    MINIME = "Minime", _("Minime")
    ATTEIGNANT_AIR_PUPILLAIRE = "Atteignant air pupillaire", _("Atteignant air pupillaire")
    RECOUVRANT_PUPILLE = "Recouvrant pupille", _("Recouvrant pupille")


class RPM(models.TextChoices):
    NORMAL = "Normal", _("Normal")
    LENT = "Lent", _("Lent")
    ABOLI = "Aboli", _("Aboli")


class Iris(models.TextChoices):
    NORMAL = "Normal", _("Normal")
    IRIDODONESIS = "Iridodonésis", _("Iridodonésis")
    RUBEUSE = "Rubéose", _("Rubéose")
    SYNECHIES = "Synéchies", _("Synéchies")
    AUTRES = "Autres", _("Autres")


class Macula(models.TextChoices):
    NORMAL = "Normal", _("Normal")
    CICATRICE = "Cicatrice", _("Cicatrice")
    OEDEME = "Œdème", _("Œdème")
    DMLA = "DMLA", _("DMLA")


class ChampRetinienPeripherique(models.TextChoices):
    NORMAL = "Normal", _("Normal")
    CICATRICE = "Cicatrice", _("Cicatrice")
    OEDEME = "Œdème", _("Œdème")
    HEMORRAGIE = "Hémorragie", _("Hémorragie")
    EXUDATS = "Exudats", _("Exudats")
    AUTRE = "Autre", _("Autre")


class Vaisseaux(models.TextChoices):
    NORMAUX = "Normaux", _("Normaux")
    ARTERIOSCLEROSE = "Artériosclérose", _("Artériosclérose")
    OVR = "OVR", _("OVR")
    OAR = "OAR", _("OAR")
    NEOVAISSEUX = "Néovaisseux", _("Néovaisseux")


class PositionCristallin(models.TextChoices):
    NORMALE = "Normale", _("Normale")
    ECTOPIE = "Ectopie", _("Ectopie")
    LUXATION_ANTERIEURE = "Luxation/subluxation antérieure", _("Luxation/subluxation antérieure")
    LUXATION_POSTERIEURE = "Luxation/subluxation postérieure", _("Luxation/subluxation postérieure")


class Papille(models.TextChoices):
    NORMALE = "Normale", _("Normale")
    EXCAVATION_ELARGIE = "Excavation élargie", _("Excavation élargie")
    ATROPHIE = "Atrophie", _("Atrophie")
    OEDEME = "Œdème", _("Œdème")
    DYSMORPHIE = "Dysmorphie", _("Dysmorphie")
    AUTRES = "Autres", _("Autres")


class PerimetrieBinoculaire(models.TextChoices):
    NORMAL = "Normal", _("Normal")
    SCOTOME_CENTRAL = "Scotome central", _("Scotome central")
    SCOTOME_PERIPHERIQUE = "Scotome périphérique", _("Scotome périphérique")
    AMPUTATION = "Amputation", _("Amputation")


class SegmentChoices(models.TextChoices):
    NORMAL = 'NORMAL', _('Normal')
    PRESENCE_LESION = 'PRESENCE LESION', _('Presence lesion')
    REMANIEMENT_TOTAL = 'REMANIEMENT TOTAL', _('Remanement total')


class DommageChoices(models.TextChoices):
    CORPOREL = "corporel", _("Corporel")
    MATERIEL = "materiel", _("Matériel")

class DegatChoices(models.TextChoices):
    IMPORTANT = "important", _("Important")
    MODERE = "modéré", _("Modéré")
    LEGER = "léger", _("Léger")

class AddictionTypeChoices(models.TextChoices):
    TABAGISME = "tabagisme", _("Tabagisme")
    ALCOOL = "alcool", _("Alcool")
    TELEPHONE = "telephone", _("Téléphone portable")
    OTHER = "other", _("Autres")

class FamilialChoices(models.TextChoices):
    CECITE = "cecité", _("Cécité")
    GPAO = "gpao", _("GPAO")
    OTHER = "other", _("Autres")


class HypotonisantValue(models.TextChoices):
    BBLOQUANTS = 'BBLOQUANTS', _('BBLOQUANTS')
    IAC = 'IAC', _('IAC')
    PROSTAGLANDINES = 'PROSTAGLANDINES', _('PROSTAGLANDINES')
    PILOCARPINE = 'PILOCARPINE', _('PILOCARPINE')
    AUTRES = ('AUTRES', _('AUTRES'))


class Symptomes(models.TextChoices):
    AUCUN = 'AUCUN', _('Aucun')
    BAV = 'BAV', _('BAV')
    ROUGEUR = 'ROUGEUR', _('ROUGEUR')
    DOULEUR = 'DOULEUR', _('DOULEUR')
    DIPLOPIE = 'DIPLOPIE', _('DIPLOPIE')
    STARBISME = 'STARBISME', _('STARBISME')
    NYSTAGMUS = 'NYSTAGMUS', _('NYSTAGMUS')
    PTOSIS = 'PTOSIS', _('PTOSIS')
    AUTRES = 'AUTRES', _('AUTRES')