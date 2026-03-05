class Booking {
  final String? id;
  final String userId;
  final String hotelId;
  final String firstName;
  final String lastName;
  final String email;
  final int adultCount;
  final int childCount;
  final DateTime checkIn;
  final DateTime checkOut;
  final double totalCost;
  final String? status;
  final String? paymentStatus;

  Booking({
    this.id,
    required this.userId,
    required this.hotelId,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.adultCount,
    required this.childCount,
    required this.checkIn,
    required this.checkOut,
    required this.totalCost,
    this.status,
    this.paymentStatus,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['_id'],
      userId: json['userId'] ?? '',
      hotelId: json['hotelId'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      email: json['email'] ?? '',
      adultCount: json['adultCount'] ?? 1,
      childCount: json['childCount'] ?? 0,
      checkIn: DateTime.parse(json['checkIn']),
      checkOut: DateTime.parse(json['checkOut']),
      totalCost: (json['totalCost'] ?? 0).toDouble(),
      status: json['status'],
      paymentStatus: json['paymentStatus'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'adultCount': adultCount,
      'childCount': childCount,
      'checkIn': checkIn.toIso8601String(),
      'checkOut': checkOut.toIso8601String(),
      'totalCost': totalCost,
    };
  }
}
