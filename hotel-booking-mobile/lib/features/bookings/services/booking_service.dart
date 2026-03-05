import 'package:dio/dio.dart';
import '../../../core/api_client.dart';
import '../../../models/booking.dart';

class BookingService {
  final ApiClient _apiClient;

  BookingService(this._apiClient);

  Future<Map<String, dynamic>> createPaymentIntent(String hotelId, int numberOfNights) async {
    try {
      final response = await _apiClient.dio.post(
        '/hotels/$hotelId/bookings/payment-intent',
        data: {'numberOfNights': numberOfNights},
      );
      return response.data;
    } catch (e) {
      print('Create payment intent error: $e');
      rethrow;
    }
  }

  Future<void> confirmBooking(String hotelId, Map<String, dynamic> bookingData) async {
    try {
      await _apiClient.dio.post(
        '/hotels/$hotelId/bookings',
        data: bookingData,
      );
    } catch (e) {
      print('Confirm booking error: $e');
      rethrow;
    }
  }

  Future<List<Booking>> fetchMyBookings() async {
    try {
      final response = await _apiClient.dio.get('/my-bookings');
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        // The backend returns an array of objects where each object contains hotel data and a bookings array
        // We'll flatten it for the mobile list
        List<Booking> bookings = [];
        for (var item in data) {
          if (item['bookings'] != null && (item['bookings'] as List).isNotEmpty) {
            bookings.add(Booking.fromJson(item['bookings'][0]));
          }
        }
        return bookings;
      }
      return [];
    } catch (e) {
      print('Fetch my bookings error: $e');
      rethrow;
    }
  }
}
