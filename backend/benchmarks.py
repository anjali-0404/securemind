"""
SecureMind ML Model Benchmarks
Comprehensive performance evaluation and benchmarking suite for the code classification model
"""

import time
import json
import numpy as np
from pathlib import Path
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_auc_score, classification_report,
    roc_curve, auc, precision_recall_curve, average_precision_score
)
import joblib
import csv
from train_model import CodeClassificationTrainer

# Paths
BASE_DIR = Path(__file__).parent / "securemind"
MODELS_DIR = BASE_DIR / "models"
LABELS_DIR = BASE_DIR / "labels"
BENCHMARKS_DIR = Path(__file__).parent / "benchmarks"

# Create benchmarks directory
BENCHMARKS_DIR.mkdir(exist_ok=True)


class ModelBenchmark:
    """Comprehensive benchmarking suite for the ML model"""
    
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.results = {
            'timestamp': time.strftime("%Y-%m-%d %H:%M:%S"),
            'model_info': {},
            'performance_metrics': {},
            'inference_benchmarks': {},
            'cross_validation_results': {},
            'feature_analysis': {},
            'confusion_matrices': {}
        }
        self.load_model()
    
    def load_model(self):
        """Load trained model and vectorizer"""
        model_path = MODELS_DIR / "code_classifier.pkl"
        vectorizer_path = MODELS_DIR / "vectorizer.pkl"
        
        if model_path.exists() and vectorizer_path.exists():
            self.model = joblib.load(model_path)
            self.vectorizer = joblib.load(vectorizer_path)
            print("✓ Model and vectorizer loaded successfully")
        else:
            print("✗ Model files not found. Please train the model first.")
            return False
        
        return True
    
    def benchmark_inference_speed(self, num_samples=1000):
        """Benchmark single and batch inference speed"""
        print("\n" + "="*60)
        print("INFERENCE SPEED BENCHMARKS")
        print("="*60)
        
        # Sample code snippets
        sample_codes = [
            "import os\npassword = input('Enter password: ')\nif password == 'admin':\n    print('Access granted')",
            "def safe_function():\n    data = [1, 2, 3]\n    return sum(data)",
            "model.predict(user_input)  # Missing input validation",
            "x = 1\ny = 2\nz = x + y\nprint(z)",
            "import pickle\ndata = pickle.loads(user_data)  # Unsafe deserialization"
        ]
        
        benchmarks = {
            'single_inference': {},
            'batch_inference': {}
        }
        
        # Single inference benchmark
        print("\n[1] Single Inference Benchmark:")
        times = []
        for _ in range(num_samples):
            code = sample_codes[_ % len(sample_codes)]
            start = time.time()
            prediction = self.model.predict(self.vectorizer.transform([code]).toarray())
            end = time.time()
            times.append((end - start) * 1000)  # Convert to ms
        
        avg_time = np.mean(times)
        min_time = np.min(times)
        max_time = np.max(times)
        p95_time = np.percentile(times, 95)
        p99_time = np.percentile(times, 99)
        
        benchmarks['single_inference'] = {
            'samples': num_samples,
            'avg_time_ms': round(avg_time, 4),
            'min_time_ms': round(min_time, 4),
            'max_time_ms': round(max_time, 4),
            'p95_time_ms': round(p95_time, 4),
            'p99_time_ms': round(p99_time, 4),
            'throughput_per_second': round(1000 / avg_time, 2)
        }
        
        print(f"   Average: {avg_time:.4f} ms")
        print(f"   Min: {min_time:.4f} ms")
        print(f"   Max: {max_time:.4f} ms")
        print(f"   P95: {p95_time:.4f} ms")
        print(f"   P99: {p99_time:.4f} ms")
        print(f"   Throughput: {benchmarks['single_inference']['throughput_per_second']:.2f} req/sec")
        
        # Batch inference benchmark
        print("\n[2] Batch Inference Benchmark:")
        batch_sizes = [1, 10, 50, 100, 500]
        
        for batch_size in batch_sizes:
            codes = [sample_codes[i % len(sample_codes)] for i in range(batch_size)]
            
            start = time.time()
            X = self.vectorizer.transform(codes).toarray()
            predictions = self.model.predict(X)
            end = time.time()
            
            batch_time = (end - start) * 1000
            time_per_sample = batch_time / batch_size
            
            benchmarks['batch_inference'][f'batch_{batch_size}'] = {
                'batch_size': batch_size,
                'total_time_ms': round(batch_time, 4),
                'time_per_sample_ms': round(time_per_sample, 4),
                'throughput': round(1000 / time_per_sample, 2)
            }
            
            print(f"   Batch {batch_size:3d}: {batch_time:8.4f} ms ({time_per_sample:.4f} ms/sample, {round(1000/time_per_sample, 2):.2f} req/sec)")
        
        self.results['inference_benchmarks'] = benchmarks
        return benchmarks
    
    def benchmark_memory_usage(self):
        """Benchmark memory footprint"""
        print("\n" + "="*60)
        print("MEMORY USAGE BENCHMARKS")
        print("="*60)
        
        import sys
        
        model_size = sys.getsizeof(self.model) / (1024 * 1024)  # MB
        vectorizer_size = sys.getsizeof(self.vectorizer) / (1024 * 1024)  # MB
        
        memory_info = {
            'model_size_mb': round(model_size, 2),
            'vectorizer_size_mb': round(vectorizer_size, 2),
            'total_size_mb': round(model_size + vectorizer_size, 2),
            'feature_dimensions': self.vectorizer.max_features
        }
        
        print(f"\nModel size: {model_size:.2f} MB")
        print(f"Vectorizer size: {vectorizer_size:.2f} MB")
        print(f"Total size: {memory_info['total_size_mb']:.2f} MB")
        print(f"Feature dimensions: {memory_info['feature_dimensions']}")
        
        self.results['memory_benchmarks'] = memory_info
        return memory_info
    
    def benchmark_classification_performance(self):
        """Benchmark classification performance metrics"""
        print("\n" + "="*60)
        print("CLASSIFICATION PERFORMANCE BENCHMARKS")
        print("="*60)
        
        # Load data
        trainer = CodeClassificationTrainer()
        data = trainer.load_raw_code_files()
        
        if not data:
            print("✗ No data available for benchmarking")
            return None
        
        codes = [d['code'] for d in data]
        labels = np.array([trainer.label_encoder[d['label']] for d in data])
        
        # Extract features
        X = self.vectorizer.transform(codes).toarray()
        
        # Get predictions
        y_pred = self.model.predict(X)
        y_pred_proba = self.model.predict_proba(X)
        
        # Calculate metrics
        accuracy = accuracy_score(labels, y_pred)
        precision = precision_score(labels, y_pred, average='weighted', zero_division=0)
        recall = recall_score(labels, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(labels, y_pred, average='weighted', zero_division=0)
        
        # Per-class metrics
        class_names = ['vulnerable', 'safe', 'hallucinated']
        per_class_metrics = {}
        
        for i, class_name in enumerate(class_names):
            class_mask = labels == i
            if class_mask.sum() > 0:
                class_pred = y_pred[class_mask]
                class_true = labels[class_mask]
                
                per_class_metrics[class_name] = {
                    'precision': round(precision_score(class_true, class_pred, average='binary', zero_division=0), 4),
                    'recall': round(recall_score(class_true, class_pred, average='binary', zero_division=0), 4),
                    'f1_score': round(f1_score(class_true, class_pred, average='binary', zero_division=0), 4),
                    'support': int(class_mask.sum())
                }
        
        # Confusion matrix
        conf_matrix = confusion_matrix(labels, y_pred)
        
        performance_metrics = {
            'overall': {
                'accuracy': round(accuracy, 4),
                'precision': round(precision, 4),
                'recall': round(recall, 4),
                'f1_score': round(f1, 4),
                'total_samples': len(labels)
            },
            'per_class': per_class_metrics,
            'confusion_matrix': conf_matrix.tolist()
        }
        
        print(f"\nOverall Accuracy: {accuracy:.4f}")
        print(f"Overall Precision: {precision:.4f}")
        print(f"Overall Recall: {recall:.4f}")
        print(f"Overall F1-Score: {f1:.4f}")
        
        print("\nPer-Class Metrics:")
        for class_name, metrics in per_class_metrics.items():
            print(f"  {class_name:12s}: P={metrics['precision']:.4f} R={metrics['recall']:.4f} F1={metrics['f1_score']:.4f} (n={metrics['support']})")
        
        self.results['performance_metrics'] = performance_metrics
        return performance_metrics
    
    def benchmark_scalability(self, dataset_sizes=[100, 500, 1000, 5000]):
        """Benchmark scalability with varying dataset sizes"""
        print("\n" + "="*60)
        print("SCALABILITY BENCHMARKS")
        print("="*60)
        
        scalability_results = {}
        sample_code = "def test():\n    return True\n"
        
        for size in dataset_sizes:
            codes = [sample_code] * size
            
            # Vectorization time
            start = time.time()
            X = self.vectorizer.transform(codes).toarray()
            vectorization_time = (time.time() - start) * 1000
            
            # Prediction time
            start = time.time()
            predictions = self.model.predict(X)
            prediction_time = (time.time() - start) * 1000
            
            scalability_results[f'size_{size}'] = {
                'dataset_size': size,
                'vectorization_time_ms': round(vectorization_time, 4),
                'prediction_time_ms': round(prediction_time, 4),
                'total_time_ms': round(vectorization_time + prediction_time, 4),
                'avg_per_sample_ms': round((vectorization_time + prediction_time) / size, 4)
            }
            
            print(f"\nDataset Size: {size}")
            print(f"  Vectorization: {vectorization_time:.4f} ms")
            print(f"  Prediction: {prediction_time:.4f} ms")
            print(f"  Total: {vectorization_time + prediction_time:.4f} ms")
            print(f"  Avg per sample: {(vectorization_time + prediction_time) / size:.4f} ms")
        
        self.results['scalability_benchmarks'] = scalability_results
        return scalability_results
    
    def benchmark_feature_importance(self):
        """Benchmark feature importance analysis"""
        print("\n" + "="*60)
        print("FEATURE IMPORTANCE ANALYSIS")
        print("="*60)
        
        if hasattr(self.model, 'feature_importances_'):
            feature_importances = self.model.feature_importances_
            
            # Get top 20 features
            top_indices = np.argsort(feature_importances)[-20:][::-1]
            top_features = [
                {
                    'rank': i + 1,
                    'feature_index': int(idx),
                    'importance': round(float(feature_importances[idx]), 6)
                }
                for i, idx in enumerate(top_indices)
            ]
            
            print("\nTop 20 Most Important Features:")
            for feat in top_features:
                print(f"  {feat['rank']:2d}. Feature #{feat['feature_index']:4d}: {feat['importance']:.6f}")
            
            feature_info = {
                'total_features': len(feature_importances),
                'top_20_features': top_features,
                'feature_importance_stats': {
                    'mean': round(float(np.mean(feature_importances)), 6),
                    'std': round(float(np.std(feature_importances)), 6),
                    'min': round(float(np.min(feature_importances)), 6),
                    'max': round(float(np.max(feature_importances)), 6)
                }
            }
            
            self.results['feature_importance'] = feature_info
            return feature_info
        
        return None
    
    def generate_report(self):
        """Generate comprehensive benchmark report"""
        print("\n" + "="*60)
        print("GENERATING COMPREHENSIVE BENCHMARK REPORT")
        print("="*60)
        
        # Run all benchmarks
        self.benchmark_inference_speed()
        self.benchmark_memory_usage()
        self.benchmark_classification_performance()
        self.benchmark_scalability()
        self.benchmark_feature_importance()
        
        # Save results
        report_path = BENCHMARKS_DIR / "benchmark_report.json"
        with open(report_path, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"\n✓ Benchmark report saved to {report_path}")
        
        # Generate CSV summary
        csv_path = BENCHMARKS_DIR / "benchmark_summary.csv"
        self.save_csv_summary(csv_path)
        
        return self.results
    
    def save_csv_summary(self, filepath):
        """Save benchmark summary as CSV"""
        with open(filepath, 'w', newline='') as f:
            writer = csv.writer(f)
            
            writer.writerow(['SecureMind ML Model Benchmark Summary'])
            writer.writerow([])
            
            # Inference benchmarks
            if 'inference_benchmarks' in self.results:
                writer.writerow(['Inference Benchmarks'])
                writer.writerow(['Metric', 'Value'])
                for key, value in self.results['inference_benchmarks']['single_inference'].items():
                    writer.writerow([key, value])
                writer.writerow([])
            
            # Performance metrics
            if 'performance_metrics' in self.results:
                writer.writerow(['Classification Performance'])
                writer.writerow(['Metric', 'Value'])
                for key, value in self.results['performance_metrics']['overall'].items():
                    writer.writerow([key, value])
                writer.writerow([])
            
            # Memory benchmarks
            if 'memory_benchmarks' in self.results:
                writer.writerow(['Memory Usage'])
                writer.writerow(['Metric', 'Value'])
                for key, value in self.results['memory_benchmarks'].items():
                    writer.writerow([key, value])
        
        print(f"✓ CSV summary saved to {filepath}")


def main():
    """Run complete benchmark suite"""
    print("\n" + "="*70)
    print("SECUREMIND ML MODEL BENCHMARKING SUITE")
    print("="*70)
    
    benchmark = ModelBenchmark()
    
    if benchmark.model is None:
        print("\n✗ Cannot run benchmarks without a trained model")
        return
    
    # Generate comprehensive report
    results = benchmark.generate_report()
    
    print("\n" + "="*70)
    print("BENCHMARK EXECUTION COMPLETED SUCCESSFULLY")
    print("="*70)
    print(f"\nResults saved to: {BENCHMARKS_DIR}/")
    print("  - benchmark_report.json")
    print("  - benchmark_summary.csv")


if __name__ == "__main__":
    main()
