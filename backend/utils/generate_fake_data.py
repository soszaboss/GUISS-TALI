import random

def generate_random_phone_number():
    prefix = random.choice(["76", "77", "78"])  # Opérateurs au Sénégal (Orange, Free, Expresso)
    number = f"+221{prefix}{random.randint(1000000, 9999999)}"
    return number

def generate_random_license_number():
    prefix = "SN-"  # Préfixe standard pour le Sénégal
    number = f"{random.randint(100000, 999999)}-{random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}"
    return prefix + number

def generate_random_plate_number():
    prefix = random.choice(["DK", "TH", "ZG"])  # Exemples de préfixes régionaux
    number = f"{random.randint(1000, 9999)}-{random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}{random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}"
    return f"{prefix}-{number}"

