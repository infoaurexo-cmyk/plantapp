import 'package:flutter/material.dart';

class ResultScreen extends StatelessWidget {
  final Map<String, dynamic> result;
  final Map<String, dynamic> plant;

  const ResultScreen({super.key, required this.result, required this.plant});

  Color _severityColor(String? s) {
    switch (s?.toLowerCase()) {
      case 'high': return Colors.red;
      case 'medium': return Colors.orange;
      default: return Colors.green;
    }
  }

  IconData _severityIcon(String? s) {
    switch (s?.toLowerCase()) {
      case 'high': return Icons.error_outline;
      case 'medium': return Icons.warning_amber_outlined;
      default: return Icons.check_circle_outline;
    }
  }

  @override
  Widget build(BuildContext context) {
    final analysis = result['analysis'] as Map<String, dynamic>? ?? {};
    final kb = result['knowledgeBase'] as Map<String, dynamic>? ?? {};
    final severity = analysis['severity'];
    final color = _severityColor(severity);
    final matchedDiseases = kb['matchedDiseases'] as List<dynamic>? ?? [];
    final careTips = kb['careTips'] as List<dynamic>? ?? [];

    return Scaffold(
      backgroundColor: const Color(0xFFF0F7EE),
      appBar: AppBar(
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
        title: const Text('Diagnosis Result'),
        actions: [
          TextButton.icon(
            onPressed: () => Navigator.pop(context, true),
            icon: const Icon(Icons.check, color: Colors.white),
            label: const Text('Done', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Severity banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              border: Border.all(color: color.withOpacity(0.3)),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                Icon(_severityIcon(severity), color: color, size: 36),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Severity: $severity',
                          style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 15)),
                      const SizedBox(height: 4),
                      Text(analysis['detectedIssue'] ?? 'Plant health concern',
                          style: const TextStyle(fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Symptoms
          _sectionCard(
            icon: Icons.assignment_outlined,
            title: 'Reported Symptoms',
            child: Text(analysis['symptoms'] ?? '', style: const TextStyle(fontSize: 14)),
          ),
          const SizedBox(height: 12),

          // AI Recommendations
          _sectionCard(
            icon: Icons.auto_awesome,
            title: 'AI Recommendations',
            child: Text(analysis['recommendations'] ?? '', style: const TextStyle(fontSize: 14, height: 1.5)),
          ),
          const SizedBox(height: 12),

          // Matched diseases from knowledge base
          if (matchedDiseases.isNotEmpty) ...[
            _sectionCard(
              icon: Icons.local_library_outlined,
              title: 'From Knowledge Base',
              child: Column(
                children: matchedDiseases.map<Widget>((d) => _diseaseCard(d)).toList(),
              ),
            ),
            const SizedBox(height: 12),
          ],

          // Care tips
          if (careTips.isNotEmpty) ...[
            _sectionCard(
              icon: Icons.tips_and_updates_outlined,
              title: 'Care Tips for ${plant['type'] ?? 'This Plant'}',
              child: Column(
                children: careTips.map<Widget>((t) => _careTipRow(t)).toList(),
              ),
            ),
            const SizedBox(height: 12),
          ],

          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: () => Navigator.pop(context, true),
            icon: const Icon(Icons.arrow_back),
            label: const Text('Back to Plant'),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              side: const BorderSide(color: Color(0xFF2E7D32)),
              foregroundColor: const Color(0xFF2E7D32),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionCard({required IconData icon, required String title, required Widget child}) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              Icon(icon, size: 18, color: const Color(0xFF2E7D32)),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF1B5E20))),
            ]),
            const SizedBox(height: 12),
            child,
          ],
        ),
      ),
    );
  }

  Widget _diseaseCard(Map<String, dynamic> d) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FBE7),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFC5E1A5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(d['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          if (d['description'] != null) ...[
            const SizedBox(height: 4),
            Text(d['description'], style: const TextStyle(fontSize: 12, color: Colors.grey)),
          ],
          const SizedBox(height: 8),
          const Text('Organic Remedies', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: Color(0xFF33691E))),
          const SizedBox(height: 4),
          Text(d['organicRemedies'] ?? '', style: const TextStyle(fontSize: 12, height: 1.5)),
          if (d['preventionTips'] != null) ...[
            const SizedBox(height: 8),
            const Text('Prevention', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: Color(0xFF33691E))),
            const SizedBox(height: 4),
            Text(d['preventionTips'], style: const TextStyle(fontSize: 12, height: 1.5)),
          ],
        ],
      ),
    );
  }

  Widget _careTipRow(Map<String, dynamic> t) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 2),
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
            decoration: BoxDecoration(
              color: const Color(0xFF2E7D32).withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(t['category'] ?? '', style: const TextStyle(fontSize: 10, color: Color(0xFF2E7D32), fontWeight: FontWeight.w600)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(t['tip'] ?? '', style: const TextStyle(fontSize: 13, height: 1.4)),
                if (t['frequency'] != null)
                  Text(t['frequency'], style: const TextStyle(fontSize: 11, color: Colors.grey)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
