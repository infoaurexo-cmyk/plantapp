import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;

const String _baseUrl = 'https://plantapp-backend-production.up.railway.app/api';

class ApiService {
  static final _client = http.Client();

  // ── Users ──────────────────────────────────────────────────────────────
  static Future<Map<String, dynamic>> createUser(String username, String email) async {
    final res = await _client.post(
      Uri.parse('$_baseUrl/users'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'email': email}),
    );
    return jsonDecode(res.body);
  }

  static Future<Map<String, dynamic>> getUser(int userId) async {
    final res = await _client.get(Uri.parse('$_baseUrl/users/$userId'));
    return jsonDecode(res.body);
  }

  // ── Plants ─────────────────────────────────────────────────────────────
  static Future<Map<String, dynamic>> addPlant({
    required int userId,
    required String name,
    String? species,
    String? type,
    String? location,
    String? waterFrequency,
    String? sunlight,
    String? notes,
  }) async {
    final res = await _client.post(
      Uri.parse('$_baseUrl/plants'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'user_id': userId,
        'name': name,
        if (species != null) 'species': species,
        if (type != null) 'type': type,
        if (location != null) 'location': location,
        if (waterFrequency != null) 'water_frequency': waterFrequency,
        if (sunlight != null) 'sunlight_requirement': sunlight,
        if (notes != null) 'notes': notes,
      }),
    );
    return jsonDecode(res.body);
  }

  static Future<List<dynamic>> getPlants(int userId) async {
    final res = await _client.get(Uri.parse('$_baseUrl/plants/$userId'));
    final body = jsonDecode(res.body);
    return body['data'] ?? [];
  }

  static Future<Map<String, dynamic>> getPlantDetails(int plantId) async {
    final res = await _client.get(Uri.parse('$_baseUrl/plants/details/$plantId'));
    return jsonDecode(res.body);
  }

  static Future<void> deletePlant(int plantId) async {
    await _client.delete(Uri.parse('$_baseUrl/plants/$plantId'));
  }

  // ── Analysis ───────────────────────────────────────────────────────────
  static Future<Map<String, dynamic>> analyzePlant({
    required int plantId,
    required String symptoms,
    Uint8List? imageBytes,
  }) async {
    String? imageBase64;
    if (imageBytes != null) {
      imageBase64 = base64Encode(imageBytes);
    }

    final res = await _client.post(
      Uri.parse('$_baseUrl/analysis'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'plant_id': plantId,
        'symptoms': symptoms,
        if (imageBase64 != null) 'image_base64': imageBase64,
      }),
    );
    return jsonDecode(res.body);
  }

  static Future<List<dynamic>> getAnalysisHistory(int plantId) async {
    final res = await _client.get(Uri.parse('$_baseUrl/analysis/plant/$plantId'));
    final body = jsonDecode(res.body);
    return body['data'] ?? [];
  }
}
