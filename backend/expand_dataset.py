import csv
from pathlib import Path

BASE_DIR = Path(r'd:\securemind\backend\securemind')
LABELS_DIR = BASE_DIR / "labels"

VULNERABLE_SAMPLES = [
    ("SELECT * FROM users WHERE id = \" + user_input", "SQL Injection"),
    ("os.system('ls ' + user_input)", "Command Injection"),
    ("exec(user_code)", "Code Injection"),
    ("eval(untrusted_input)", "Code Injection"),
    ("pickle.loads(user_data)", "Deserialization"),
    ("import importlib; importlib.import_module(user_input)", "Code Injection"),
    ("subprocess.run('command' + user_input, shell=True)", "Command Injection"),
    ("open(user_path).read()", "Path Traversal"),
    ("requests.get(url, verify=False)", "SSL Verification Disabled"),
]

SAFE_SAMPLES = [
    ("cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))", "Safe Query"),
    ("subprocess.run(['ls', user_input])", "Safe Command"),
    ("import os; os.environ.get('API_KEY')", "Safe Secret"),
    ("hashlib.sha256(password.encode()).hexdigest()", "Safe Hashing"),
    ("requests.get(url, verify=True)", "Safe Request"),
    ("json.loads(user_data)", "Safe JSON"),
    ("re.match(pattern, user_input)", "Safe Regex"),
    ("if user_input in whitelist:", "Safe Validation"),
    ("csrf_token = secrets.token_urlsafe()", "Safe Token"),
    ("password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())", "Safe Password"),
]

HALLUCINATED_SAMPLES = [
    ("import MagicalSecurityLib", "Hallucinated Import"),
    ("SecureAuthX.login(user, password)", "Hallucinated Method"),
    ("CryptoShield.encrypt(data)", "Hallucinated Method"),
    ("from quantum_security import QuantumEncrypt", "Hallucinated Import"),
    ("AdvancedAI.detectThreat(code)", "Hallucinated Method"),
    ("from blockchain_auth import UnbreakableAuth", "Hallucinated Import"),
    ("SafetyNet.preventAllVulnerabilities()", "Hallucinated Method"),
    ("import UltraSecure", "Hallucinated Import"),
]

csv_path = LABELS_DIR / "dataset.csv"
existing_rows = []

if csv_path.exists():
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        existing_rows = list(reader)

existing_ids = {int(row['id']) for row in existing_rows if 'id' in row}
next_id = max(existing_ids) + 1 if existing_ids else 1
new_rows = []

for code, vuln_type in VULNERABLE_SAMPLES:
    if code not in [row['code'] for row in existing_rows]:
        new_rows.append({'id': str(next_id), 'code': code, 'is_vulnerable': '1', 'vulnerability_type': vuln_type, 'is_hallucinated': '0', 'language': 'python'})
        next_id += 1

for code, _ in SAFE_SAMPLES:
    if code not in [row['code'] for row in existing_rows]:
        new_rows.append({'id': str(next_id), 'code': code, 'is_vulnerable': '0', 'vulnerability_type': 'NONE', 'is_hallucinated': '0', 'language': 'python'})
        next_id += 1

for code, halluc_type in HALLUCINATED_SAMPLES:
    if code not in [row['code'] for row in existing_rows]:
        new_rows.append({'id': str(next_id), 'code': code, 'is_vulnerable': '0', 'vulnerability_type': 'NONE', 'is_hallucinated': '1', 'language': 'python'})
        next_id += 1

all_rows = existing_rows + new_rows

with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['id', 'code', 'is_vulnerable', 'vulnerability_type', 'is_hallucinated', 'language'])
    writer.writeheader()
    writer.writerows(all_rows)

print(f"Dataset expanded!")
print(f"Existing samples: {len(existing_rows)}")
print(f"New samples added: {len(new_rows)}")
print(f"Total samples: {len(all_rows)}")
