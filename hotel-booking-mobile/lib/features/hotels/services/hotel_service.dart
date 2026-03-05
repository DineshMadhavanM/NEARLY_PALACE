import 'package:dio/dio.dart';
import '../../../core/api_client.dart';
import '../../../models/hotel.dart';

class HotelService {
  final ApiClient _apiClient;

  HotelService(this._apiClient);

  Future<List<Hotel>> fetchHotels() async {
    try {
      final response = await _apiClient.dio.get('/hotels');
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'] ?? response.data;
        return data.map((json) => Hotel.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Fetch hotels error: $e');
      rethrow;
    }
  }

  Future<Hotel?> fetchHotelById(String id) async {
    try {
      final response = await _apiClient.dio.get('/hotels/$id');
      if (response.statusCode == 200) {
        return Hotel.fromJson(response.data);
      }
      return null;
    } catch (e) {
      print('Fetch hotel details error: $e');
      rethrow;
    }
  }
}
