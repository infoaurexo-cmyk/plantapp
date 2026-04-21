import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import 'result_screen.dart';

class AnalyzeScreen extends StatefulWidget {
  final Map<String, dynamic> plant;
  const AnalyzeScreen({super.key, required this.plant});

  @override
  State<AnalyzeScreen> createState() => _AnalyzeScreenState();
}

class _AnalyzeScreenState extends State<AnalyzeScreen> {
  final _symptomsCtrl = TextEditingController();
  final _imagePicker = ImagePicker();
  Uint8List? _selectedImageBytes;
  String? _selectedImageName;
  bool _loading = false;

  static const _quickSymptoms = [
    'Yellow leaves',
    'Brown spots on leaves',
    'Wilting / drooping',
    'White powdery coating',
    'Sticky residue on leaves',
    'Tiny bugs / insects',
    'Leaf drop',
    'Slow / stunted growth',
    'Root rot / mushy base',
    'Curled or distorted leaves',
  ];

  void _addQuickSymptom(String s) {
    final current = _symptomsCtrl.text.trim();
    if (current.isEmpty) {
      _symptomsCtrl.text = s;
    } else if (!current.toLowerCase().contains(s.toLowerCase())) {
      _symptomsCtrl.text = '$current, ${s.toLowerCase()}';
    }
    _symptomsCtrl.selection = TextSelection.fromPosition(
      TextPosition(offset: _symptomsCtrl.text.length),
    );
  }

  Future<void> _pickImage() async {
    try {
      final XFile? pickedFile = await _imagePicker.pickImage(source: ImageSource.camera);
      if (pickedFile != null) {
        final bytes = await pickedFile.readAsBytes();
        setState(() {
          _selectedImageBytes = bytes;
          _selectedImageName = pickedFile.name;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error picking image: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _analyze() async {
    final symptoms = _symptomsCtrl.text.trim();
    if (symptoms.isEmpty && _selectedImageBytes == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please describe symptoms or take a photo.')),
      );
      return;
    }

    setState(() => _loading = true);
    try {
      final result = await ApiService.analyzePlant(
        plantId: widget.plant['id'],
        symptoms: symptoms,
        imageBytes: _selectedImageBytes,
      );
      if (mounted) {
        final returned = await Navigator.push<bool>(
          context,
          MaterialPageRoute(builder: (_) => ResultScreen(result: result, plant: widget.plant)),
        );
        if (mounted) Navigator.pop(context, returned);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cannot reach server. Is the backend running?'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
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
        title: Text('Analyze: ${plant['name']}'),
      ),
      body: _loading ? _loadingView() : _form(),
    );
  }

  Widget _loadingView() {
    return const Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircularProgressIndicator(color: Color(0xFF2E7D32)),
          SizedBox(height: 20),
          Text('Analyzing with AI...', style: TextStyle(fontSize: 16, color: Color(0xFF2E7D32))),
          SizedBox(height: 8),
          Text('This may take up to 60 seconds', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _form() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Card(
          elevation: 1,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                const Icon(Icons.eco, color: Color(0xFF2E7D32)),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.plant['name'] ?? '',
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                    if (widget.plant['type'] != null)
                      Text(widget.plant['type'], style: const TextStyle(color: Colors.grey, fontSize: 12)),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),
        // Image capture section
        if (_selectedImageBytes == null)
          OutlinedButton.icon(
            onPressed: _pickImage,
            icon: const Icon(Icons.camera_alt),
            label: const Text('Capture Photo for AI Analysis'),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              side: const BorderSide(color: Color(0xFF2E7D32), width: 1.5),
            ),
          )
        else
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.memory(_selectedImageBytes!, height: 250, fit: BoxFit.cover),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  TextButton.icon(
                    onPressed: () => setState(() {
                      _selectedImageBytes = null;
                      _selectedImageName = null;
                    }),
                    icon: const Icon(Icons.close),
                    label: const Text('Remove'),
                  ),
                  TextButton.icon(
                    onPressed: _pickImage,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Retake'),
                  ),
                ],
              ),
            ],
          ),
        const SizedBox(height: 20),
        const Text('Quick symptoms — tap to add:',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF2E7D32))),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _quickSymptoms
              .map((s) => ActionChip(
                    label: Text(s, style: const TextStyle(fontSize: 12)),
                    onPressed: () => _addQuickSymptom(s),
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: Color(0xFF81C784)),
                  ))
              .toList(),
        ),
        const SizedBox(height: 20),
        const Text('Describe symptoms in detail:',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF2E7D32))),
        const SizedBox(height: 10),
        TextField(
          controller: _symptomsCtrl,
          maxLines: 5,
          decoration: const InputDecoration(
            hintText: 'e.g. Yellow leaves with brown spots starting from the bottom, plant is drooping despite regular watering...',
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(),
            alignLabelWithHint: true,
          ),
        ),
        const SizedBox(height: 28),
        FilledButton.icon(
          onPressed: _analyze,
          style: FilledButton.styleFrom(
            backgroundColor: const Color(0xFF2E7D32),
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          icon: const Icon(Icons.search),
          label: const Text('Get AI Diagnosis', style: TextStyle(fontSize: 16)),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _symptomsCtrl.dispose();
    super.dispose();
  }
}
