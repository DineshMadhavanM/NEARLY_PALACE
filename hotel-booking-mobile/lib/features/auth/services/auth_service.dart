import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/api_client.dart';
import '../models/user.dart';

class AuthService {
  final ApiClient _apiClient;
  final _storage = const FlutterSecureStorage();

  AuthService(this._apiClient);

  Future<User?> login(String email, String password) async {
    try {
      final response = await _apiClient.dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        final token = data['token'];
        final userData = data['user'];

        if (token != null) {
          await _storage.write(key: 'auth_token', value: token);
          return User.fromJson(userData);
        }
      }
      return null;
    } catch (e) {
      print('Login error: $e');
      rethrow;
    }
  }

  Future<User?> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    try {
      final response = await _apiClient.dio.post('/auth/register', data: {
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        final token = data['token'];
        if (token != null) {
          await _storage.write(key: 'auth_token', value: token);
          // After register, we might need a separate call to get user profile 
          // or the register endpoint could return user data (it doesn't currently in backend)
          return null; // For now
        }
      }
      return null;
    } catch (e) {
      print('Register error: $e');
      rethrow;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'auth_token');
  }

  Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: 'auth_token');
    return token != null;
  }
}
