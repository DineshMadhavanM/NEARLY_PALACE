import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/api_client.dart';
import '../../models/hotel.dart';
import 'services/hotel_service.dart';
import '../auth/auth_provider.dart';

final hotelServiceProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return HotelService(apiClient);
});

final hotelsProvider = FutureProvider<List<Hotel>>((ref) async {
  final hotelService = ref.watch(hotelServiceProvider);
  return hotelService.fetchHotels();
});

final featuredHotelsProvider = FutureProvider<List<Hotel>>((ref) async {
  final hotels = await ref.watch(hotelsProvider.future);
  // In a real app, you might have a separate endpoint or filter on isFeatured
  return hotels.take(5).toList();
});
