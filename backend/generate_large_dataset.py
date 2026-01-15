"""
Generate 1000+ Code Samples for ML Training
Creates diverse, realistic code patterns across vulnerable, safe, and hallucinated categories
"""

import csv
import random
from pathlib import Path

BASE_DIR = Path(r'd:\securemind\backend\securemind')
LABELS_DIR = BASE_DIR / "labels"

# Vulnerable Code Patterns (SQL Injection)
VULNERABLE_SQL = [
    "SELECT * FROM users WHERE id = " + "user_input",
    "query = 'SELECT * FROM users WHERE id = ' + user_id",
    "db.execute('SELECT * FROM users WHERE name = ' + username)",
    "cursor.execute('DELETE FROM users WHERE id = ' + uid)",
    "query = \"UPDATE users SET password = '\" + pwd + \"' WHERE id = \" + id",
    "SELECT * FROM products WHERE category = " + "cat",
    "db.query('INSERT INTO logs VALUES (' + data + ')')",
    "sql = 'SELECT * FROM accounts WHERE email = ' + email",
    "exec(\"DELETE FROM \" + table_name + \" WHERE id = \" + id)",
    "query = 'SELECT ' + columns + ' FROM ' + table + ' WHERE id = ' + id",
]

# Vulnerable Code Patterns (Command Injection)
VULNERABLE_CMD = [
    "os.system('ls ' + user_input)",
    "subprocess.call('rm ' + filename)",
    "os.system('cat ' + filepath)",
    "subprocess.run('ping ' + host, shell=True)",
    "cmd = 'curl ' + url",
    "os.system('grep ' + pattern + ' ' + file)",
    "system('ssh ' + server + ' ' + command)",
    "os.popen('find ' + directory + ' -name ' + pattern)",
    "exec('del ' + filename)",
    "subprocess.Popen('tar -xf ' + archive, shell=True)",
]

# Vulnerable Code Patterns (Code Injection)
VULNERABLE_CODE = [
    "exec(user_code)",
    "eval(user_input)",
    "compile(code_string)",
    "__import__(module_name)",
    "pickle.loads(data)",
    "eval('import ' + module)",
    "exec(open(filename).read())",
    "type(name, bases, dict)",
    "eval(expression)",
    "compile(user_provided_code, 'string', 'exec')",
]

# Vulnerable Code Patterns (Hardcoded Secrets)
VULNERABLE_SECRETS = [
    "api_key = '12345-abcdef-secret'",
    "password = 'admin123'",
    "token = 'ghp_1234567890abcdef'",
    "db_password = 'MyP@ssw0rd'",
    "aws_key = 'AKIAIOSFODNN7EXAMPLE'",
    "api_secret = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'",
    "oauth_token = 'ya29.a0AfH6SMBx...'",
    "slack_webhook = 'https://hooks.slack.com/services/T00000000/B00000000/...'",
    "github_token = 'ghp_xxxxxxxxxxxxxxxxxxxx'",
    "private_key = '-----BEGIN PRIVATE KEY-----'",
]

# Vulnerable Code Patterns (Debug/Misconfiguration)
VULNERABLE_DEBUG = [
    "app.run(debug=True)",
    "DEBUG = True",
    "SECURE_SSL_REDIRECT = False",
    "CSRF_COOKIE_SECURE = False",
    "SESSION_COOKIE_SECURE = False",
    "logging.basicConfig(level=logging.DEBUG)",
    "app.config['ENV'] = 'development'",
    "requests.get(url, verify=False)",
    "ssl._create_unverified_context()",
    "warnings.filterwarnings('ignore')",
]

# Safe Code Patterns (Parameterized Queries)
SAFE_QUERIES = [
    "cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))",
    "db.query('SELECT * FROM products WHERE id = %s', [product_id])",
    "stmt.setString(1, username)",
    "execute_query(query, params=[user_input])",
    "connection.execute('SELECT * FROM users WHERE email = :email', {'email': user_email})",
    "cursor.execute('INSERT INTO users (name, email) VALUES (?, ?)', (name, email))",
    "db.prepare('SELECT * FROM orders WHERE id = ?').run(order_id)",
    "sqlalchemy.text('SELECT * FROM users WHERE id = :id').bindparams(id=user_id)",
    "query.filter(User.id == user_id)",
    "User.objects.filter(id=user_id)",
]

# Safe Code Patterns (Secure Methods)
SAFE_METHODS = [
    "import os; os.environ.get('API_KEY')",
    "from dotenv import load_dotenv; load_dotenv()",
    "config = configparser.ConfigParser(); config.read('config.ini')",
    "hashlib.sha256(password.encode()).hexdigest()",
    "bcrypt.hashpw(password.encode(), bcrypt.gensalt())",
    "secrets.token_urlsafe(32)",
    "import secrets; secrets.choice(items)",
    "json.loads(json_string)",
    "re.match(pattern, text)",
    "urllib.parse.quote(user_input)",
]

# Safe Code Patterns (Secure Practices)
SAFE_PRACTICES = [
    "if user_input in whitelist: process(user_input)",
    "password = getpass.getpass('Enter password: ')",
    "validator.validate(email)",
    "if len(password) >= 12 and re.search(r'[A-Z]', password): accept()",
    "try: execute() except Exception as e: log_error(e)",
    "with open(file) as f: content = f.read()",
    "for item in items: if is_safe(item): process(item)",
    "csrf_token = secrets.token_urlsafe()",
    "input_data = sanitize(input_data)",
    "session.expire_on_commit = True",
]

# Safe Code Patterns (Libraries/Functions)
SAFE_LIBRARIES = [
    "from cryptography.fernet import Fernet",
    "import jwt; jwt.encode(payload, secret)",
    "from flask import escape, render_template_string",
    "from bleach import clean",
    "from email.mime.text import MIMEText",
    "import logging; logger = logging.getLogger(__name__)",
    "from sqlalchemy.orm import declarative_base",
    "import pytest",
    "from unittest.mock import patch",
    "import black",
]

# Hallucinated Libraries
HALLUCINATED_LIBS = [
    "import SecureAuthX",
    "from MagicalSecurityLib import encrypt",
    "import CryptoShield",
    "from quantum_security import QuantumEncrypt",
    "import AdvancedAI",
    "from blockchain_auth import UnbreakableAuth",
    "import SafetyNet",
    "from UltraSecure import SecureEverything",
    "import PerfectEncryption",
    "from FutureSecure import AIGuard",
]

# Hallucinated Methods
HALLUCINATED_METHODS = [
    "SecureAuthX.login(user, password)",
    "CryptoShield.encrypt(data)",
    "QuantumEncrypt.secure(information)",
    "AdvancedAI.detectThreat(code)",
    "UnbreakableAuth.authenticate(credentials)",
    "SafetyNet.preventAllVulnerabilities()",
    "UltraSecure.encrypt_everything(data)",
    "PerfectEncryption.make_unbreakable(secret)",
    "AIGuard.protect_from_attacks(system)",
    "MagicSecurity.auto_fix_vulnerabilities()",
]

# Hallucinated Imports with Methods
HALLUCINATED_COMBINED = [
    "from quantum_crypto import auto_encrypt; auto_encrypt(data)",
    "import ai_security; ai_security.detect_all_threats()",
    "from blockchain_safe import immutable_storage; immutable_storage.save(data)",
    "import perfect_auth; perfect_auth.impossible_to_hack(password)",
    "from ultra_encryption import unbreakable; result = unbreakable.encode(message)",
    "import magic_firewall; magic_firewall.block_all_attacks()",
    "from future_protection import universal_security; universal_security.protect_all()",
    "import neural_defense; neural_defense.learn_and_protect(system)",
    "from omniscient_scan import find_everything; find_everything.scan_code()",
    "import time_travel_security; time_travel_security.prevent_past_attacks()",
]

def generate_code_samples(count_per_category=350):
    """Generate diverse code samples for each category"""
    samples = []
    sample_id = 1
    
    # Vulnerable samples
    vulnerable_patterns = (VULNERABLE_SQL + VULNERABLE_CMD + VULNERABLE_CODE + 
                          VULNERABLE_SECRETS + VULNERABLE_DEBUG)
    
    for i in range(count_per_category):
        pattern = random.choice(vulnerable_patterns)
        # Add variations
        code = pattern
        if i % 3 == 1:
            code = f"{pattern}\n# vulnerable code\nresult = execute(code)"
        elif i % 3 == 2:
            code = f"try:\n    {pattern}\nexcept: pass"
        
        samples.append({
            'id': sample_id,
            'code': code,
            'is_vulnerable': '1',
            'vulnerability_type': 'SQL Injection' if 'WHERE' in pattern else 
                                 'Command Injection' if 'os.system' in pattern or 'subprocess' in pattern else
                                 'Code Injection' if any(x in pattern for x in ['exec', 'eval', 'pickle']) else
                                 'Hardcoded Secret' if any(x in pattern for x in ['key', 'password', 'token', 'secret']) else
                                 'Misconfiguration',
            'is_hallucinated': '0',
            'language': 'python'
        })
        sample_id += 1
    
    # Safe samples
    safe_patterns = (SAFE_QUERIES + SAFE_METHODS + SAFE_PRACTICES + SAFE_LIBRARIES)
    
    for i in range(count_per_category):
        pattern = random.choice(safe_patterns)
        code = pattern
        if i % 2 == 1:
            code = f"def secure_operation():\n    {pattern}\n    return result"
        
        samples.append({
            'id': sample_id,
            'code': code,
            'is_vulnerable': '0',
            'vulnerability_type': 'NONE',
            'is_hallucinated': '0',
            'language': 'python'
        })
        sample_id += 1
    
    # Hallucinated samples
    hallucinated_patterns = (HALLUCINATED_LIBS + HALLUCINATED_METHODS + HALLUCINATED_COMBINED)
    
    for i in range(count_per_category):
        pattern = random.choice(hallucinated_patterns)
        code = pattern
        if i % 3 == 1:
            code = f"{pattern}\ndata = secure_data()"
        elif i % 3 == 2:
            code = f"try:\n    {pattern}\nexcept ImportError:\n    pass"
        
        samples.append({
            'id': sample_id,
            'code': code,
            'is_vulnerable': '0',
            'vulnerability_type': 'NONE',
            'is_hallucinated': '1',
            'language': 'python'
        })
        sample_id += 1
    
    return samples

def main():
    print("=" * 70)
    print("Generating 1000+ Code Samples for ML Training")
    print("=" * 70)
    
    LABELS_DIR.mkdir(parents=True, exist_ok=True)
    csv_path = LABELS_DIR / "dataset.csv"
    
    # Generate samples (350 per category = 1050 total)
    print("\nGenerating code samples...")
    samples = generate_code_samples(count_per_category=350)
    
    # Shuffle to mix categories
    random.shuffle(samples)
    
    # Write to CSV
    print(f"Writing {len(samples)} samples to CSV...")
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['id', 'code', 'is_vulnerable', 'vulnerability_type', 'is_hallucinated', 'language'])
        writer.writeheader()
        writer.writerows(samples)
    
    # Statistics
    vulnerable_count = sum(1 for s in samples if s['is_vulnerable'] == '1')
    safe_count = sum(1 for s in samples if s['is_vulnerable'] == '0' and s['is_hallucinated'] == '0')
    hallucinated_count = sum(1 for s in samples if s['is_hallucinated'] == '1')
    
    print("\n" + "=" * 70)
    print("✓ Dataset Generation Complete!")
    print("=" * 70)
    print(f"\nTotal Samples: {len(samples)}")
    print(f"  • Vulnerable:   {vulnerable_count:4d} samples ({vulnerable_count*100/len(samples):.1f}%)")
    print(f"  • Safe:         {safe_count:4d} samples ({safe_count*100/len(samples):.1f}%)")
    print(f"  • Hallucinated: {hallucinated_count:4d} samples ({hallucinated_count*100/len(samples):.1f}%)")
    print(f"\nSaved to: {csv_path}")
    print("=" * 70)
    print("\nNext steps:")
    print("1. Run training: python train_model.py")
    print("2. Expected accuracy: ~90% with this dataset size")
    print("=" * 70)

if __name__ == "__main__":
    main()
