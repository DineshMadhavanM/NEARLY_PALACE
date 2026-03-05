import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api_client.dart';
import '../../models/booking.dart';
import 'services/booking_service.dart';
import '../auth/auth_provider.dart';

final bookingServiceProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return BookingService(apiClient);
});

final myBookingsProvider = FutureProvider<List<Booking>>((ref) async {
  final bookingService = ref.watch(bookingServiceProvider);
  return bookingService.fetchMyBookings();
});
