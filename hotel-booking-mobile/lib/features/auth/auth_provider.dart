import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/api_client.dart';
import 'services/auth_service.dart';
import '../../models/user.dart';

final apiClientProvider = Provider((ref) => ApiClient());

final authServiceProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AuthService(apiClient);
});

final userProvider = StateProvider<User?>((ref) => null);
