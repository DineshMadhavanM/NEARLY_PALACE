class Hotel {
  final String id;
  final String userId;
  final String name;
  final String city;
  final String country;
  final String description;
  final List<String> type;
  final int adultCount;
  final int childCount;
  final List<String> facilities;
  final double pricePerNight;
  final int starRating;
  final List<String> imageUrls;
  final DateTime lastUpdated;
  final Contact? contact;

  Hotel({
    required this.id,
    required this.userId,
    required this.name,
    required this.city,
    required this.country,
    required this.description,
    required this.type,
    required this.adultCount,
    required this.childCount,
    required this.facilities,
    required this.pricePerNight,
    required this.starRating,
    required this.imageUrls,
    required this.lastUpdated,
    this.contact,
  });

  factory Hotel.fromJson(Map<String, dynamic> json) {
    return Hotel(
      id: json['_id'] ?? '',
      userId: json['userId'] ?? '',
      name: json['name'] ?? '',
      city: json['city'] ?? '',
      country: json['country'] ?? '',
      description: json['description'] ?? '',
      type: List<String>.from(json['type'] ?? []),
      adultCount: json['adultCount'] ?? 0,
      childCount: json['childCount'] ?? 0,
      facilities: List<String>.from(json['facilities'] ?? []),
      pricePerNight: (json['pricePerNight'] ?? 0).toDouble(),
      starRating: json['starRating'] ?? 0,
      imageUrls: List<String>.from(json['imageUrls'] ?? []),
      lastUpdated: DateTime.parse(json['lastUpdated'] ?? DateTime.now().toIso8601String()),
      contact: json['contact'] != null ? Contact.fromJson(json['contact']) : null,
    );
  }
}

class Contact {
  final String phone;
  final String email;
  final String website;
  final String googleMapLink;

  Contact({
    required this.phone,
    required this.email,
    required this.website,
    required this.googleMapLink,
  });

  factory Contact.fromJson(Map<String, dynamic> json) {
    return Contact(
      phone: json['phone'] ?? '',
      email: json['email'] ?? '',
      website: json['website'] ?? '',
      googleMapLink: json['googleMapLink'] ?? '',
    );
  }
}
