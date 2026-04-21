import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/user_session.dart';
import 'add_plant_screen.dart';
import 'plant_detail_screen.dart';
import 'login_screen.dart';

class HomeScreen extends StatefulWidget {
  final int userId;
  final String username;

  const HomeScreen({super.key, required this.userId, required this.username});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<dynamic> _plants = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPlants();
  }

  Future<void> _loadPlants() async {
    setState(() => _loading = true);
    try {
      final plants = await ApiService.getPlants(widget.userId);
      setState(() => _plants = plants);
    } catch (_) {
      // silently fail — show empty state
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _deletePlant(int plantId, String plantName) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete plant?'),
        content: Text('Remove "$plantName" and all its analysis history?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed == true) {
      await ApiService.deletePlant(plantId);
      _loadPlants();
    }
  }

  Color _typeColor(String? type) {
    switch (type?.toLowerCase()) {
      case 'vegetable': return const Color(0xFF388E3C);
      case 'flower': return const Color(0xFFAD1457);
      case 'herb': return const Color(0xFF00838F);
      case 'fruit': return const Color(0xFFE65100);
      case 'succulent': return const Color(0xFF558B2F);
      default: return const Color(0xFF455A64);
    }
  }

  IconData _typeIcon(String? type) {
    switch (type?.toLowerCase()) {
      case 'vegetable': return Icons.eco;
      case 'flower': return Icons.local_florist;
      case 'herb': return Icons.grass;
      case 'fruit': return Icons.apple;
      case 'succulent': return Icons.spa;
      default: return Icons.yard;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F7EE),
      appBar: AppBar(
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('My Garden', style: TextStyle(fontWeight: FontWeight.bold)),
            Text('Hi, ${widget.username}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.normal)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Sign out',
            onPressed: () async {
              await UserSession.clear();
              if (mounted) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              }
            },
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF2E7D32)))
          : _plants.isEmpty
              ? _emptyState()
              : RefreshIndicator(
                  onRefresh: _loadPlants,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _plants.length,
                    itemBuilder: (_, i) => _plantCard(_plants[i]),
                  ),
                ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
        onPressed: () async {
          final added = await Navigator.push<bool>(
            context,
            MaterialPageRoute(builder: (_) => AddPlantScreen(userId: widget.userId)),
          );
          if (added == true) _loadPlants();
        },
        icon: const Icon(Icons.add),
        label: const Text('Add Plant'),
      ),
    );
  }

  Widget _plantCard(Map<String, dynamic> plant) {
    final color = _typeColor(plant['type']);
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => PlantDetailScreen(plant: plant)),
          );
          _loadPlants();
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: color.withOpacity(0.15),
                child: Icon(_typeIcon(plant['type']), color: color, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(plant['name'] ?? 'Unnamed',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                    if (plant['species'] != null)
                      Text(plant['species'],
                          style: TextStyle(fontSize: 13, color: Colors.grey[600], fontStyle: FontStyle.italic)),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      children: [
                        if (plant['type'] != null)
                          _chip(plant['type'], color),
                        if (plant['location'] != null)
                          _chip(plant['location'], Colors.grey[700]!),
                      ],
                    ),
                  ],
                ),
              ),
              PopupMenuButton<String>(
                onSelected: (v) {
                  if (v == 'delete') _deletePlant(plant['id'], plant['name']);
                },
                itemBuilder: (_) => [
                  const PopupMenuItem(value: 'delete',
                      child: Row(children: [Icon(Icons.delete_outline, color: Colors.red), SizedBox(width: 8), Text('Delete')])),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _chip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(label, style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w500)),
    );
  }

  Widget _emptyState() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.yard_outlined, size: 80, color: Colors.green[200]),
          const SizedBox(height: 16),
          const Text('No plants yet', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w500, color: Color(0xFF558B2F))),
          const SizedBox(height: 8),
          const Text('Tap "Add Plant" to get started', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}
