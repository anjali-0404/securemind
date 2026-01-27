"""
SecureMind ML Model Benchmark Visualizations
Generates comprehensive visualization charts for benchmark results
"""

import json
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# Paths
BENCHMARKS_DIR = Path(__file__).parent / "benchmarks"
REPORT_PATH = BENCHMARKS_DIR / "benchmark_report.json"
VISUALIZATIONS_DIR = BENCHMARKS_DIR / "visualizations"

# Create visualizations directory
VISUALIZATIONS_DIR.mkdir(exist_ok=True)

# Set style
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

# SecureMind Colors
COLORS = {
    'primary': '#60A5FA',
    'secondary': '#A78BFA',
    'success': '#10B981',
    'danger': '#EF4444',
    'warning': '#F59E0B'
}


class BenchmarkVisualizer:
    """Create visualizations from benchmark results"""
    
    def __init__(self):
        self.results = self.load_results()
    
    def load_results(self):
        """Load benchmark results from JSON"""
        if not REPORT_PATH.exists():
            print(f"✗ Report not found at {REPORT_PATH}")
            return None
        
        with open(REPORT_PATH, 'r') as f:
            return json.load(f)
    
    def visualize_inference_speed(self):
        """Visualize inference speed benchmarks"""
        if 'inference_benchmarks' not in self.results:
            return
        
        data = self.results['inference_benchmarks']
        single_inf = data['single_inference']
        
        # Figure 1: Single Inference Statistics
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        fig.suptitle('Inference Speed Benchmarks', fontsize=16, fontweight='bold')
        
        # 1.1: Latency distribution
        metrics = ['avg_time_ms', 'min_time_ms', 'p95_time_ms', 'p99_time_ms', 'max_time_ms']
        values = [single_inf[m] for m in metrics]
        labels = ['Average', 'Min', 'P95', 'P99', 'Max']
        colors_list = [COLORS['primary'], COLORS['success'], COLORS['warning'], COLORS['danger'], COLORS['secondary']]
        
        axes[0, 0].bar(labels, values, color=colors_list, edgecolor='black', linewidth=1.5)
        axes[0, 0].set_ylabel('Latency (ms)', fontweight='bold')
        axes[0, 0].set_title('Single Inference Latency Distribution', fontweight='bold')
        axes[0, 0].grid(axis='y', alpha=0.3)
        
        for i, v in enumerate(values):
            axes[0, 0].text(i, v + 2, f'{v:.2f}ms', ha='center', fontweight='bold')
        
        # 1.2: Throughput
        throughput = single_inf['throughput_per_second']
        axes[0, 1].barh(['Throughput'], [throughput], color=COLORS['success'], edgecolor='black', linewidth=1.5)
        axes[0, 1].set_xlabel('Requests/Second', fontweight='bold')
        axes[0, 1].set_title('Single Inference Throughput', fontweight='bold')
        axes[0, 1].text(throughput/2, 0, f'{throughput:.2f} req/s', ha='center', va='center', 
                       fontweight='bold', fontsize=12, color='white')
        
        # 1.3: Batch inference performance
        batch_data = data['batch_inference']
        batch_sizes = []
        batch_times = []
        batch_throughputs = []
        
        for key in sorted(batch_data.keys(), key=lambda x: int(x.split('_')[1])):
            batch_sizes.append(batch_data[key]['batch_size'])
            batch_times.append(batch_data[key]['time_per_sample_ms'])
            batch_throughputs.append(batch_data[key]['throughput'])
        
        axes[1, 0].plot(batch_sizes, batch_times, marker='o', linewidth=2.5, markersize=10, 
                       color=COLORS['primary'], label='Time/Sample')
        axes[1, 0].fill_between(batch_sizes, batch_times, alpha=0.3, color=COLORS['primary'])
        axes[1, 0].set_xlabel('Batch Size', fontweight='bold')
        axes[1, 0].set_ylabel('Time per Sample (ms)', fontweight='bold')
        axes[1, 0].set_title('Batch Processing: Time per Sample', fontweight='bold')
        axes[1, 0].grid(True, alpha=0.3)
        axes[1, 0].set_xscale('log')
        
        for x, y in zip(batch_sizes, batch_times):
            axes[1, 0].text(x, y + 5, f'{y:.2f}ms', ha='center', fontweight='bold')
        
        # 1.4: Batch throughput
        axes[1, 1].plot(batch_sizes, batch_throughputs, marker='s', linewidth=2.5, markersize=10,
                       color=COLORS['success'], label='Throughput')
        axes[1, 1].fill_between(batch_sizes, batch_throughputs, alpha=0.3, color=COLORS['success'])
        axes[1, 1].set_xlabel('Batch Size', fontweight='bold')
        axes[1, 1].set_ylabel('Requests/Second', fontweight='bold')
        axes[1, 1].set_title('Batch Processing: Throughput', fontweight='bold')
        axes[1, 1].grid(True, alpha=0.3)
        axes[1, 1].set_xscale('log')
        
        for x, y in zip(batch_sizes, batch_throughputs):
            axes[1, 1].text(x, y + 50, f'{y:.0f}', ha='center', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(VISUALIZATIONS_DIR / 'inference_speed_benchmarks.png', dpi=300, bbox_inches='tight')
        print("✓ Saved: inference_speed_benchmarks.png")
        plt.close()
    
    def visualize_performance_metrics(self):
        """Visualize classification performance metrics"""
        if 'performance_metrics' not in self.results:
            return
        
        data = self.results['performance_metrics']
        overall = data['overall']
        per_class = data['per_class']
        
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        fig.suptitle('Classification Performance Metrics', fontsize=16, fontweight='bold')
        
        # 2.1: Overall metrics radar-like chart
        metrics_names = ['accuracy', 'precision', 'recall', 'f1_score']
        metrics_values = [overall[m] for m in metrics_names]
        labels = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
        
        x_pos = np.arange(len(labels))
        bars = axes[0, 0].bar(x_pos, metrics_values, color=COLORS['primary'], 
                             edgecolor='black', linewidth=1.5)
        axes[0, 0].set_ylabel('Score', fontweight='bold')
        axes[0, 0].set_title('Overall Performance Metrics', fontweight='bold')
        axes[0, 0].set_xticks(x_pos)
        axes[0, 0].set_xticklabels(labels)
        axes[0, 0].set_ylim([0.95, 1.001])
        axes[0, 0].grid(axis='y', alpha=0.3)
        
        for i, v in enumerate(metrics_values):
            axes[0, 0].text(i, v + 0.002, f'{v:.4f}', ha='center', fontweight='bold')
        
        # 2.2: Per-class metrics comparison
        class_names = list(per_class.keys())
        metrics_to_compare = ['precision', 'recall', 'f1_score']
        
        x = np.arange(len(class_names))
        width = 0.25
        
        for i, metric in enumerate(metrics_to_compare):
            values = [per_class[cn][metric] for cn in class_names]
            axes[0, 1].bar(x + i*width, values, width, label=metric.replace('_', ' ').title(),
                          color=plt.cm.Set2(i), edgecolor='black', linewidth=1)
        
        axes[0, 1].set_ylabel('Score', fontweight='bold')
        axes[0, 1].set_title('Per-Class Metrics Comparison', fontweight='bold')
        axes[0, 1].set_xticks(x + width)
        axes[0, 1].set_xticklabels(class_names)
        axes[0, 1].legend()
        axes[0, 1].grid(axis='y', alpha=0.3)
        
        # 2.3: Confusion Matrix Heatmap
        conf_matrix = np.array(data['confusion_matrix'])
        sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', ax=axes[1, 0],
                   xticklabels=class_names, yticklabels=class_names, cbar_kws={'label': 'Count'},
                   linewidths=1.5, linecolor='black')
        axes[1, 0].set_title('Confusion Matrix', fontweight='bold')
        axes[1, 0].set_ylabel('True Label', fontweight='bold')
        axes[1, 0].set_xlabel('Predicted Label', fontweight='bold')
        
        # 2.4: Class support distribution
        support_values = [per_class[cn]['support'] for cn in class_names]
        colors_classes = [COLORS['danger'], COLORS['success'], COLORS['warning']]
        
        wedges, texts, autotexts = axes[1, 1].pie(support_values, labels=class_names, autopct='%1.1f%%',
                                                    colors=colors_classes, startangle=90,
                                                    wedgeprops={'edgecolor': 'black', 'linewidth': 1.5})
        axes[1, 1].set_title('Class Distribution in Test Set', fontweight='bold')
        
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
        
        plt.tight_layout()
        plt.savefig(VISUALIZATIONS_DIR / 'performance_metrics.png', dpi=300, bbox_inches='tight')
        print("✓ Saved: performance_metrics.png")
        plt.close()
    
    def visualize_scalability(self):
        """Visualize scalability benchmarks"""
        if 'scalability_benchmarks' not in self.results:
            return
        
        data = self.results['scalability_benchmarks']
        
        # Extract data
        dataset_sizes = []
        vectorization_times = []
        prediction_times = []
        total_times = []
        per_sample_times = []
        
        for key in sorted(data.keys(), key=lambda x: int(x.split('_')[1])):
            dataset_sizes.append(data[key]['dataset_size'])
            vectorization_times.append(data[key]['vectorization_time_ms'])
            prediction_times.append(data[key]['prediction_time_ms'])
            total_times.append(data[key]['total_time_ms'])
            per_sample_times.append(data[key]['avg_per_sample_ms'])
        
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        fig.suptitle('Scalability Benchmarks', fontsize=16, fontweight='bold')
        
        # 3.1: Stacked bar chart - Vectorization vs Prediction
        x_pos = np.arange(len(dataset_sizes))
        width = 0.6
        
        axes[0, 0].bar(x_pos, vectorization_times, width, label='Vectorization',
                      color=COLORS['primary'], edgecolor='black', linewidth=1)
        axes[0, 0].bar(x_pos, prediction_times, width, bottom=vectorization_times,
                      label='Prediction', color=COLORS['secondary'], edgecolor='black', linewidth=1)
        axes[0, 0].set_ylabel('Time (ms)', fontweight='bold')
        axes[0, 0].set_xlabel('Dataset Size', fontweight='bold')
        axes[0, 0].set_title('Processing Time Breakdown', fontweight='bold')
        axes[0, 0].set_xticks(x_pos)
        axes[0, 0].set_xticklabels(dataset_sizes)
        axes[0, 0].legend()
        axes[0, 0].grid(axis='y', alpha=0.3)
        
        # 3.2: Total time trend
        axes[0, 1].plot(dataset_sizes, total_times, marker='o', linewidth=2.5, markersize=10,
                       color=COLORS['danger'], label='Total Time')
        axes[0, 1].fill_between(dataset_sizes, total_times, alpha=0.3, color=COLORS['danger'])
        axes[0, 1].set_ylabel('Total Time (ms)', fontweight='bold')
        axes[0, 1].set_xlabel('Dataset Size', fontweight='bold')
        axes[0, 1].set_title('Total Processing Time vs Dataset Size', fontweight='bold')
        axes[0, 1].grid(True, alpha=0.3)
        axes[0, 1].set_xscale('log')
        
        for x, y in zip(dataset_sizes, total_times):
            axes[0, 1].text(x, y + 20, f'{y:.0f}ms', ha='center', fontweight='bold', fontsize=9)
        
        # 3.3: Per-sample time
        axes[1, 0].plot(dataset_sizes, per_sample_times, marker='s', linewidth=2.5, markersize=10,
                       color=COLORS['success'], label='Per-Sample Time')
        axes[1, 0].fill_between(dataset_sizes, per_sample_times, alpha=0.3, color=COLORS['success'])
        axes[1, 0].set_ylabel('Time per Sample (ms)', fontweight='bold')
        axes[1, 0].set_xlabel('Dataset Size', fontweight='bold')
        axes[1, 0].set_title('Time per Sample vs Dataset Size', fontweight='bold')
        axes[1, 0].grid(True, alpha=0.3)
        axes[1, 0].set_xscale('log')
        
        for x, y in zip(dataset_sizes, per_sample_times):
            axes[1, 0].text(x, y + 0.05, f'{y:.3f}ms', ha='center', fontweight='bold', fontsize=9)
        
        # 3.4: Scalability index (time per size)
        scalability_efficiency = [t / s for t, s in zip(total_times, dataset_sizes)]
        axes[1, 1].bar(range(len(dataset_sizes)), scalability_efficiency, color=COLORS['warning'],
                      edgecolor='black', linewidth=1.5)
        axes[1, 1].set_ylabel('Time/Size Ratio', fontweight='bold')
        axes[1, 1].set_title('Scalability Efficiency Index', fontweight='bold')
        axes[1, 1].set_xticks(range(len(dataset_sizes)))
        axes[1, 1].set_xticklabels(dataset_sizes)
        axes[1, 1].grid(axis='y', alpha=0.3)
        
        for i, v in enumerate(scalability_efficiency):
            axes[1, 1].text(i, v + 0.01, f'{v:.4f}', ha='center', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(VISUALIZATIONS_DIR / 'scalability_benchmarks.png', dpi=300, bbox_inches='tight')
        print("✓ Saved: scalability_benchmarks.png")
        plt.close()
    
    def visualize_feature_importance(self):
        """Visualize feature importance analysis"""
        if 'feature_importance' not in self.results:
            return
        
        data = self.results['feature_importance']
        top_features = data['top_20_features']
        
        fig, axes = plt.subplots(1, 2, figsize=(14, 8))
        fig.suptitle('Feature Importance Analysis', fontsize=16, fontweight='bold')
        
        # 1.1: Top 20 features
        ranks = [f['rank'] for f in top_features]
        importances = [f['importance'] for f in top_features]
        indices = [f['feature_index'] for f in top_features]
        
        # Create color gradient
        colors_gradient = plt.cm.viridis(np.linspace(0.3, 0.9, len(importances)))
        
        bars = axes[0].barh(range(len(importances)), importances, color=colors_gradient,
                           edgecolor='black', linewidth=1)
        axes[0].set_yticks(range(len(importances)))
        axes[0].set_yticklabels([f'Feature #{idx}' for idx in indices], fontsize=9)
        axes[0].set_xlabel('Importance Score', fontweight='bold')
        axes[0].set_title('Top 20 Most Important Features', fontweight='bold')
        axes[0].grid(axis='x', alpha=0.3)
        axes[0].invert_yaxis()
        
        for i, v in enumerate(importances):
            axes[0].text(v + 0.0002, i, f'{v:.6f}', va='center', fontweight='bold', fontsize=8)
        
        # 1.2: Importance statistics
        stats = data['feature_importance_stats']
        stat_labels = ['Mean', 'Std Dev', 'Min', 'Max']
        stat_values = [stats['mean'], stats['std'], stats['min'], stats['max']]
        colors_stats = [COLORS['primary'], COLORS['secondary'], COLORS['success'], COLORS['danger']]
        
        axes[1].bar(stat_labels, stat_values, color=colors_stats, edgecolor='black', linewidth=1.5)
        axes[1].set_ylabel('Importance Score', fontweight='bold')
        axes[1].set_title('Feature Importance Statistics', fontweight='bold')
        axes[1].grid(axis='y', alpha=0.3)
        
        for i, v in enumerate(stat_values):
            axes[1].text(i, v + 0.0002, f'{v:.6f}', ha='center', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(VISUALIZATIONS_DIR / 'feature_importance.png', dpi=300, bbox_inches='tight')
        print("✓ Saved: feature_importance.png")
        plt.close()
    
    def visualize_memory_benchmarks(self):
        """Visualize memory usage benchmarks"""
        if 'memory_benchmarks' not in self.results:
            return
        
        data = self.results['memory_benchmarks']
        
        fig, axes = plt.subplots(1, 2, figsize=(12, 5))
        fig.suptitle('Memory Usage Benchmarks', fontsize=16, fontweight='bold')
        
        # 1.1: Memory breakdown
        components = ['Model', 'Vectorizer']
        sizes = [data['model_size_mb'], data['vectorizer_size_mb']]
        colors_mem = [COLORS['primary'], COLORS['secondary']]
        
        # Handle case where sizes might be zero
        if sum(sizes) > 0:
            wedges, texts, autotexts = axes[0].pie(sizes, labels=components, autopct='%1.1f%%',
                                                   colors=colors_mem, startangle=90,
                                                   wedgeprops={'edgecolor': 'black', 'linewidth': 1.5})
            axes[0].set_title('Memory Distribution', fontweight='bold')
            
            for autotext in autotexts:
                autotext.set_color('white')
                autotext.set_fontweight('bold')
        else:
            axes[0].text(0.5, 0.5, 'Memory sizes are very small\n(< 1 MB)', 
                        ha='center', va='center', fontsize=12, fontweight='bold')
            axes[0].set_title('Memory Distribution', fontweight='bold')
        
        # 1.2: Memory statistics
        mem_labels = ['Model\n(MB)', 'Vectorizer\n(MB)', 'Total\n(MB)']
        mem_values = [data['model_size_mb'], data['vectorizer_size_mb'], data['total_size_mb']]
        colors_bars = [COLORS['primary'], COLORS['secondary'], COLORS['success']]
        
        bars = axes[1].bar(mem_labels, mem_values, color=colors_bars, edgecolor='black', linewidth=1.5)
        axes[1].set_ylabel('Size (MB)', fontweight='bold')
        axes[1].set_title('Memory Footprint Summary', fontweight='bold')
        axes[1].grid(axis='y', alpha=0.3)
        
        for i, v in enumerate(mem_values):
            axes[1].text(i, v + 0.0001, f'{v:.2f}MB', ha='center', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(VISUALIZATIONS_DIR / 'memory_benchmarks.png', dpi=300, bbox_inches='tight')
        print("✓ Saved: memory_benchmarks.png")
        plt.close()
    
    def generate_all_visualizations(self):
        """Generate all benchmark visualizations"""
        print("\n" + "="*60)
        print("GENERATING BENCHMARK VISUALIZATIONS")
        print("="*60 + "\n")
        
        self.visualize_inference_speed()
        self.visualize_performance_metrics()
        self.visualize_scalability()
        self.visualize_feature_importance()
        self.visualize_memory_benchmarks()
        
        print(f"\n✓ All visualizations saved to: {VISUALIZATIONS_DIR}/")


def main():
    """Generate benchmark visualizations"""
    visualizer = BenchmarkVisualizer()
    
    if visualizer.results is None:
        print("✗ Cannot generate visualizations without benchmark results")
        return
    
    visualizer.generate_all_visualizations()
    
    print("\n" + "="*60)
    print("VISUALIZATION GENERATION COMPLETED")
    print("="*60)


if __name__ == "__main__":
    main()
