import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AddPlantScreen extends StatefulWidget {
  final int userId;
  const AddPlantScreen({super.key, required this.userId});

  @override
  State<AddPlantScreen> createState() => _AddPlantScreenState();
}

class _AddPlantScreenState extends State<AddPlantScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _speciesCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _notesCtrl = TextEditingController();

  String? _selectedType;
  String? _selectedWater;
  String? _selectedSunlight;
  bool _loading = false;

  static const _types = ['vegetable', 'flower', 'herb', 'fruit', 'succulent', 'houseplant', 'tree', 'other'];
  static const _waterOptions = ['Daily', 'Every 2-3 days', 'Weekly', 'Every 2 weeks'];
  static const _sunlightOptions = ['Full sun (6+ hrs)', 'Partial sun (3-6 hrs)', 'Shade (< 3 hrs)'];

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    try {
      final res = await ApiService.addPlant(
        userId: widget.userId,
        name: _nameCtrl.text.trim(),
        species: _speciesCtrl.text.trim().isEmpty ? null : _speciesCtrl.text.trim(),
        type: _selectedType,
        location: _locationCtrl.text.trim().isEmpty ? null : _locationCtrl.text.trim(),
        waterFrequency: _selectedWater,
        sunlight: _selectedSunlight,
        notes: _notesCtrl.text.trim().isEmpty ? null : _notesCtrl.text.trim(),
      );
      if (res['success'] == true && mounted) {
        Navigator.pop(context, true);
      } else {
        _showError(res['error'] ?? 'Failed to add plant.');
      }
    } catch (e) {
      _showError('Cannot reach server.');
    } finally {
      setState(() => _loading = false);
    }
  }

  void _showError(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg), backgroundColor: Colors.red));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F7EE),
      appBar: AppBar(
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
        title: const Text('Add Plant'),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
        child: FilledButton.icon(
          onPressed: _loading ? null : _save,
          style: FilledButton.styleFrom(
            backgroundColor: const Color(0xFF2E7D32),
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          icon: _loading
              ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
              : const Icon(Icons.check),
          label: const Text('Save Plant', style: TextStyle(fontSize: 16)),
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            _section('Basic Info'),
            TextFormField(
              controller: _nameCtrl,
              decoration: const InputDecoration(labelText: 'Plant Name *', prefixIcon: Icon(Icons.eco), filled: true, fillColor: Colors.white),
              validator: (v) => v == null || v.trim().isEmpty ? 'Name is required' : null,
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _speciesCtrl,
              decoration: const InputDecoration(labelText: 'Species (optional)', prefixIcon: Icon(Icons.science_outlined), filled: true, fillColor: Colors.white),
            ),
            const SizedBox(height: 14),
            DropdownButtonFormField<String>(
              value: _selectedType,
              decoration: const InputDecoration(labelText: 'Plant Type', prefixIcon: Icon(Icons.category_outlined), filled: true, fillColor: Colors.white),
              items: _types.map((t) => DropdownMenuItem(value: t, child: Text(_capitalize(t)))).toList(),
              onChanged: (v) => setState(() => _selectedType = v),
            ),
            const SizedBox(height: 24),
            _section('Location & Care'),
            TextFormField(
              controller: _locationCtrl,
              decoration: const InputDecoration(labelText: 'Location (e.g. Backyard, Windowsill)', prefixIcon: Icon(Icons.place_outlined), filled: true, fillColor: Colors.white),
            ),
            const SizedBox(height: 14),
            DropdownButtonFormField<String>(
              value: _selectedWater,
              decoration: const InputDecoration(labelText: 'Watering Frequency', prefixIcon: Icon(Icons.water_drop_outlined), filled: true, fillColor: Colors.white),
              items: _waterOptions.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
              onChanged: (v) => setState(() => _selectedWater = v),
            ),
            const SizedBox(height: 14),
            DropdownButtonFormField<String>(
              value: _selectedSunlight,
              decoration: const InputDecoration(labelText: 'Sunlight', prefixIcon: Icon(Icons.wb_sunny_outlined), filled: true, fillColor: Colors.white),
              items: _sunlightOptions.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
              onChanged: (v) => setState(() => _selectedSunlight = v),
            ),
            const SizedBox(height: 24),
            _section('Notes'),
            TextFormField(
              controller: _notesCtrl,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Notes (optional)', alignLabelWithHint: true, prefixIcon: Icon(Icons.notes), filled: true, fillColor: Colors.white),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Widget _section(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600,
          color: Color(0xFF2E7D32), letterSpacing: 0.5)),
    );
  }

  String _capitalize(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

  @override
  void dispose() {
    _nameCtrl.dispose();
    _speciesCtrl.dispose();
    _locationCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }
}
