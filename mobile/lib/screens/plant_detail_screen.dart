import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'analyze_screen.dart';

class PlantDetailScreen extends StatefulWidget {
  final Map<String, dynamic> plant;
  const PlantDetailScreen({super.key, required this.plant});

  @override
  State<PlantDetailScreen> createState() => _PlantDetailScreenState();
}

class _PlantDetailScreenState extends State<PlantDetailScreen> {
  List<dynamic> _history = [];
  bool _loadingHistory = true;

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    setState(() => _loadingHistory = true);
    try {
      final h = await ApiService.getAnalysisHistory(widget.plant['id']);
      setState(() => _history = h);
    } catch (_) {} finally {
      setState(() => _loadingHistory = false);
    }
  }

  Color _severityColor(String? s) {
    switch (s?.toLowerCase()) {
      case 'high': return Colors.red;
      case 'medium': return Colors.orange;
      default: return Colors.green;
    }
  }

  @override
  Widget build(BuildContext context) {
    final plant = widget.plant;
    return Scaffold(
      backgroundColor: const Color(0xFFF0F7EE),
      appBar: AppBar(
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
        title: Text(plant['name'] ?? 'Plant Detail'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _infoCard(plant),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: () async {
              final result = await Navigator.push<bool>(
                context,
                MaterialPageRoute(builder: (_) => AnalyzeScreen(plant: plant)),
              );
              if (result == true) _loadHistory();
            },
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFF2E7D32),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            icon: const Icon(Icons.biotech),
            label: const Text('Analyze Plant Health', style: TextStyle(fontSize: 16)),
          ),
          const SizedBox(height: 24),
          const Text('Analysis History', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF1B5E20))),
          const SizedBox(height: 10),
          if (_loadingHistory)
            const Center(child: CircularProgressIndicator(color: Color(0xFF2E7D32)))
          else if (_history.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Center(child: Text('No analysis yet. Tap "Analyze Plant Health" above.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey))),
              ),
            )
          else
            ..._history.map((a) => _historyCard(a)),
        ],
      ),
    );
  }

  Widget _infoCard(Map<String, dynamic> plant) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (plant['species'] != null)
              Text(plant['species'],
                  style: const TextStyle(fontStyle: FontStyle.italic, color: Colors.grey, fontSize: 13)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 16,
              runSpacing: 8,
              children: [
                if (plant['type'] != null) _infoItem(Icons.category_outlined, plant['type']),
                if (plant['location'] != null) _infoItem(Icons.place_outlined, plant['location']),
                if (plant['water_frequency'] != null) _infoItem(Icons.water_drop_outlined, plant['water_frequency']),
                if (plant['sunlight_requirement'] != null) _infoItem(Icons.wb_sunny_outlined, plant['sunlight_requirement']),
              ],
            ),
            if (plant['notes'] != null) ...[
              const SizedBox(height: 12),
              const Divider(),
              const SizedBox(height: 8),
              Text(plant['notes'], style: const TextStyle(color: Colors.black87)),
            ],
          ],
        ),
      ),
    );
  }

  Widget _infoItem(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: const Color(0xFF558B2F)),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(fontSize: 13)),
      ],
    );
  }

  Widget _historyCard(Map<String, dynamic> a) {
    final severity = a['severity'] ?? 'Unknown';
    final color = _severityColor(severity);
    final date = a['created_at'] != null
        ? a['created_at'].toString().split('T').first
        : '';
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ExpansionTile(
        leading: CircleAvatar(
          radius: 18,
          backgroundColor: color.withOpacity(0.15),
          child: Icon(Icons.biotech, color: color, size: 18),
        ),
        title: Text(a['detected_issue'] ?? 'Analysis', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
        subtitle: Row(children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
            decoration: BoxDecoration(color: color.withOpacity(0.12), borderRadius: BorderRadius.circular(20)),
            child: Text(severity, style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w600)),
          ),
          const SizedBox(width: 8),
          Text(date, style: const TextStyle(fontSize: 11, color: Colors.grey)),
        ]),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (a['symptoms'] != null) ...[
                  const Text('Symptoms', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: Colors.grey)),
                  const SizedBox(height: 4),
                  Text(a['symptoms'], style: const TextStyle(fontSize: 13)),
                  const SizedBox(height: 12),
                ],
                const Text('Recommendations', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 4),
                Text(a['recommendations'] ?? '', style: const TextStyle(fontSize: 13)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
