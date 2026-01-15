"""
SecureMind ML Training Pipeline
Trains a classification model to detect vulnerable, safe, and hallucinated code
"""

import os
import csv
import pickle
import numpy as np
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
import joblib
import json

# Paths
BASE_DIR = Path(__file__).parent / "securemind"
RAW_CODE_DIR = BASE_DIR / "raw_code"
LABELS_DIR = BASE_DIR / "labels"
MODELS_DIR = BASE_DIR / "models"

# Create models directory
MODELS_DIR.mkdir(exist_ok=True)

class CodeClassificationTrainer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=3000,
            ngram_range=(1, 3),
            min_df=2,
            max_df=0.95,
            analyzer='char'
        )
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        self.label_encoder = {
            'vulnerable': 0,
            'safe': 1,
            'hallucinated': 2
        }
        self.reverse_label_encoder = {v: k for k, v in self.label_encoder.items()}
        self.training_metrics = {}

    def load_raw_code_files(self):
        """Load code from raw_code directories"""
        data = []
        
        # Load from CSV if available
        csv_path = LABELS_DIR / "dataset.csv"
        if csv_path.exists():
            with open(csv_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    code = row['code'].strip()
                    
                    # Determine label
                    if row.get('is_hallucinated') == '1':
                        label = 'hallucinated'
                    elif row.get('is_vulnerable') == '1':
                        label = 'vulnerable'
                    else:
                        label = 'safe'
                    
                    if code:
                        data.append({
                            'code': code,
                            'label': label,
                            'is_vulnerable': int(row.get('is_vulnerable', 0)),
                            'is_hallucinated': int(row.get('is_hallucinated', 0))
                        })
        
        # Load from raw code files (fallback)
        for category in ['safe', 'vulnerable', 'hallucinated']:
            category_dir = RAW_CODE_DIR / category
            if category_dir.exists():
                for code_file in category_dir.glob("*.py"):
                    with open(code_file, 'r', encoding='utf-8', errors='ignore') as f:
                        code = f.read().strip()
                        if code and not any(d['code'] == code for d in data):
                            data.append({
                                'code': code,
                                'label': category,
                                'is_vulnerable': 1 if category == 'vulnerable' else 0,
                                'is_hallucinated': 1 if category == 'hallucinated' else 0
                            })
        
        return data

    def extract_features(self, codes):
        """Extract TF-IDF features from code"""
        return self.vectorizer.fit_transform(codes).toarray()

    def train(self, data):
        """Train the model"""
        if not data:
            print("No data available for training!")
            return False
        
        codes = [d['code'] for d in data]
        labels = [self.label_encoder[d['label']] for d in data]
        
        print(f"Total samples: {len(codes)}")
        print(f"Label distribution: {dict(sorted([(self.reverse_label_encoder[l], labels.count(l)) for l in set(labels)]))}")
        
        # Extract features
        print("Extracting features...")
        X = self.vectorizer.fit_transform(codes).toarray()
        y = np.array(labels)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y if len(set(y)) > 1 else None
        )
        
        print(f"Training set size: {len(X_train)}")
        print(f"Test set size: {len(X_test)}")
        
        # Train model
        print("Training model...")
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average='weighted')
        
        self.training_metrics = {
            'accuracy': float(accuracy),
            'f1_score': float(f1),
            'train_size': len(X_train),
            'test_size': len(X_test),
            'feature_count': X.shape[1],
            'classes': list(self.reverse_label_encoder.values())
        }
        
        print(f"\nAccuracy: {accuracy:.4f}")
        print(f"F1 Score: {f1:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=[self.reverse_label_encoder[i] for i in range(3)]))
        
        return True

    def save_model(self):
        """Save trained model and vectorizer"""
        model_path = MODELS_DIR / "code_classifier.pkl"
        vectorizer_path = MODELS_DIR / "vectorizer.pkl"
        metrics_path = MODELS_DIR / "metrics.json"
        
        joblib.dump(self.model, model_path)
        joblib.dump(self.vectorizer, vectorizer_path)
        
        with open(metrics_path, 'w') as f:
            json.dump(self.training_metrics, f, indent=2)
        
        print(f"\nModel saved to {model_path}")
        print(f"Vectorizer saved to {vectorizer_path}")
        print(f"Metrics saved to {metrics_path}")

    def predict(self, code):
        """Predict label and confidence for code"""
        X = self.vectorizer.transform([code]).toarray()
        label_idx = self.model.predict(X)[0]
        probabilities = self.model.predict_proba(X)[0]
        
        confidence = float(max(probabilities))
        label = self.reverse_label_encoder[label_idx]
        
        prob_dict = {
            self.reverse_label_encoder[i]: float(probabilities[i])
            for i in range(len(probabilities))
        }
        
        return {
            'label': label,
            'confidence': confidence,
            'probabilities': prob_dict
        }


def main():
    print("=" * 60)
    print("SecureMind ML Training Pipeline")
    print("=" * 60)
    
    trainer = CodeClassificationTrainer()
    
    # Load data
    print("\nLoading data from dataset.csv and raw code files...")
    data = trainer.load_raw_code_files()
    
    if not data:
        print("ERROR: No data found!")
        return
    
    # Train model
    print("\nStarting model training...")
    if trainer.train(data):
        # Save model
        trainer.save_model()
        print("\n" + "=" * 60)
        print("Training completed successfully!")
        print("=" * 60)
    else:
        print("Training failed!")


if __name__ == "__main__":
    main()
