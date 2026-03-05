import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../models/hotel.dart';
import '../../../models/user.dart';
import '../../auth/auth_provider.dart';
import '../booking_provider.dart';

class BookingScreen extends ConsumerStatefulWidget {
  final Hotel hotel;

  const BookingScreen({super.key, required this.hotel});

  @override
  ConsumerState<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends ConsumerState<BookingScreen> {
  DateTime? _checkIn;
  DateTime? _checkOut;
  bool _isLoading = false;

  Future<void> _selectDateRange(BuildContext context) async {
    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF1A237E),
              onPrimary: Colors.white,
              onSurface: Color(0xFF1A237E),
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _checkIn = picked.start;
        _checkOut = picked.end;
      });
    }
  }

  Future<void> _handleBooking() async {
    if (_checkIn == null || _checkOut == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select check-in and check-out dates')),
      );
      return;
    }

    final user = ref.read(userProvider);
    if (user == null) return;

    setState(() => _isLoading = true);

    try {
      final nightCount = _checkOut!.difference(_checkIn!).inDays;
      final totalCost = widget.hotel.pricePerNight * nightCount;

      final bookingService = ref.read(bookingServiceProvider);
      
      // 1. Create Payment Intent
      final intent = await bookingService.createPaymentIntent(widget.hotel.id, nightCount);
      
      // 2. Simulated Payment (Assuming success for mobile demo)
      // In a real app, you would use the stripe_flutter package here
      
      // 3. Confirm Booking
      await bookingService.confirmBooking(widget.hotel.id, {
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'adultCount': 1,
        'childCount': 0,
        'checkIn': _checkIn!.toIso8601String(),
        'checkOut': _checkOut!.toIso8601String(),
        'totalCost': totalCost,
        'paymentIntentId': intent['paymentIntentId'],
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Booking confirmed successfully!')),
        );
        Navigator.of(context).popUntil((route) => route.isFirst);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Booking failed: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final nightCount = (_checkIn != null && _checkOut != null) ? _checkOut!.difference(_checkIn!).inDays : 0;
    final totalCost = widget.hotel.pricePerNight * nightCount;

    return Scaffold(
      appBar: AppBar(
        title: Text('Complete Booking', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              widget.hotel.name,
              style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text('${widget.hotel.city}, ${widget.hotel.country}', style: TextStyle(color: Colors.grey[600])),
            const Divider(height: 48),
            Text('Select Dates', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            InkWell(
              onTap: () => _selectDateRange(context),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[300]!),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.calendar_today, color: Color(0xFF1A237E)),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _checkIn == null 
                              ? 'Select check-in & check-out' 
                              : '${DateFormat('MMM dd').format(_checkIn!)} - ${DateFormat('MMM dd, yyyy').format(_checkOut!)}',
                          style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                        ),
                        if (nightCount > 0)
                          Text('$nightCount nights', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            Text('Price Details', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('\$${widget.hotel.pricePerNight.toStringAsFixed(0)} x $nightCount nights'),
                Text('\$${totalCost.toStringAsFixed(0)}'),
              ],
            ),
            const Divider(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Total (USD)', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 18)),
                Text('\$${totalCost.toStringAsFixed(0)}', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 22, color: const Color(0xFF1A237E))),
              ],
            ),
            const SizedBox(height: 48),
            ElevatedButton(
              onPressed: _isLoading ? null : _handleBooking,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1A237E),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: BorderRadius.circular(12),
              ),
              child: _isLoading 
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('CONFIRM BOOKING', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2)),
            ),
          ],
        ),
      ),
    );
  }
}
